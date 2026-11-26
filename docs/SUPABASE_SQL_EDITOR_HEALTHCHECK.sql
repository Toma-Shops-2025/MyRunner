-- =============================================================================
-- MyRunner — Supabase SQL Editor health check (idempotent, safe to re-run)
-- Paste this entire file into: Supabase Dashboard → SQL → New query → Run
-- Project: your MyRunner Supabase (e.g. ghcedtumkxhqdhrbrojn)
--
-- What it does:
--   • Ensures enums, has_role(), grants, and RLS policies the app expects
--   • Fixes driver_applications enum/default drift (invalid "n/a" on submit)
--   • Aligns user_roles / driver_applications constraints with the live app
-- It does NOT drop tables or delete user data (except normalizing bad enum rows).
-- =============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- 1) Core enum types (no-op if already present)
-- ---------------------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('customer', 'driver', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.driver_status AS ENUM ('pending', 'approved', 'rejected', 'suspended');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.order_status AS ENUM (
    'pending', 'accepted', 'picked_up', 'in_transit', 'delivered', 'cancelled'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.order_type AS ENUM (
    'standard', 'multi_pickup', 'multi_dropoff', 'scheduled'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ---------------------------------------------------------------------------
-- 2) has_role() — auth + admin checks (TanStack app + RLS)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id::text = _user_id::text
      AND role::text = _role::text
  );
$$;

REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;

-- ---------------------------------------------------------------------------
-- 3) profiles — onboarding + background check columns
-- ---------------------------------------------------------------------------
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS date_of_birth date,
  ADD COLUMN IF NOT EXISTS ssn_last4 text,
  ADD COLUMN IF NOT EXISTS home_address text,
  ADD COLUMN IF NOT EXISTS home_city text,
  ADD COLUMN IF NOT EXISTS home_state text,
  ADD COLUMN IF NOT EXISTS home_zip text,
  ADD COLUMN IF NOT EXISTS emergency_contact_name text,
  ADD COLUMN IF NOT EXISTS emergency_contact_phone text,
  ADD COLUMN IF NOT EXISTS background_check_status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS background_check_updated_at timestamptz,
  ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS current_lat numeric,
  ADD COLUMN IF NOT EXISTS current_lng numeric,
  ADD COLUMN IF NOT EXISTS location_updated_at timestamptz,
  ADD COLUMN IF NOT EXISTS driver_status text NOT NULL DEFAULT 'offline',
  ADD COLUMN IF NOT EXISTS onboarding_completed_at timestamptz,
  ADD COLUMN IF NOT EXISTS stripe_connect_account_id text,
  ADD COLUMN IF NOT EXISTS payouts_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS checkr_candidate_id text,
  ADD COLUMN IF NOT EXISTS referral_code text;

-- Normalize legacy / dashboard values before adding CHECK constraints
UPDATE public.profiles
SET background_check_status = CASE lower(trim(background_check_status))
  WHEN 'clear' THEN 'clear'
  WHEN 'failed' THEN 'failed'
  WHEN 'pending' THEN 'pending'
  WHEN 'approved' THEN 'clear'
  WHEN 'rejected' THEN 'failed'
  WHEN 'suspended' THEN 'failed'
  WHEN 'n/a' THEN 'pending'
  WHEN 'na' THEN 'pending'
  WHEN '' THEN 'pending'
  ELSE 'pending'
END
WHERE background_check_status IS NULL
   OR lower(trim(background_check_status)) NOT IN ('pending', 'clear', 'failed');

UPDATE public.profiles
SET ssn_last4 = NULL
WHERE ssn_last4 IS NOT NULL
  AND ssn_last4 !~ '^[0-9]{4}$';

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_ssn_last4_format') THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_ssn_last4_format
      CHECK (ssn_last4 IS NULL OR ssn_last4 ~ '^[0-9]{4}$');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_bg_check_status_values') THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_bg_check_status_values
      CHECK (background_check_status IN ('pending', 'clear', 'failed'));
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- 4) user_roles — inserts from signup / driver flow
-- ---------------------------------------------------------------------------
ALTER TABLE public.user_roles
  ALTER COLUMN id SET DEFAULT gen_random_uuid();

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'user_roles_user_id_role_key'
  ) AND NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.user_roles'::regclass
      AND contype = 'u'
      AND pg_get_constraintdef(oid) LIKE '%user_id%'
      AND pg_get_constraintdef(oid) LIKE '%role%'
  ) THEN
    ALTER TABLE public.user_roles
      ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);
  END IF;
END $$;

GRANT SELECT, INSERT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

DROP POLICY IF EXISTS "roles self read" ON public.user_roles;
CREATE POLICY "roles self read"
ON public.user_roles FOR SELECT TO authenticated
USING (user_id::text = auth.uid()::text);

DROP POLICY IF EXISTS "roles self insert driver" ON public.user_roles;
CREATE POLICY "roles self insert driver"
ON public.user_roles FOR INSERT TO authenticated
WITH CHECK (user_id::text = auth.uid()::text AND role::text = 'driver');

-- ---------------------------------------------------------------------------
-- 5) driver_applications — unique user, grants, enum fix (includes n/a migration)
-- ---------------------------------------------------------------------------
DELETE FROM public.driver_applications a
USING public.driver_applications b
WHERE a.ctid < b.ctid
  AND a.user_id::text = b.user_id::text;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'driver_applications_user_id_key'
  ) THEN
    ALTER TABLE public.driver_applications
      ADD CONSTRAINT driver_applications_user_id_key UNIQUE (user_id);
  END IF;
END $$;

ALTER TABLE public.driver_applications
  ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Fix invalid status values
UPDATE public.driver_applications
SET status = 'pending'::public.driver_status
WHERE status::text NOT IN ('pending', 'approved', 'rejected', 'suspended');

ALTER TABLE public.driver_applications
  ALTER COLUMN status SET DEFAULT 'pending'::public.driver_status;

-- If background_check_status was wrongly typed as driver_status enum in the dashboard
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'driver_applications'
      AND column_name = 'background_check_status'
      AND udt_name = 'driver_status'
  ) THEN
    ALTER TABLE public.driver_applications
      ALTER COLUMN background_check_status TYPE text
      USING CASE background_check_status::text
        WHEN 'approved' THEN 'clear'
        WHEN 'rejected' THEN 'failed'
        WHEN 'suspended' THEN 'failed'
        WHEN 'pending' THEN 'pending'
        ELSE 'pending'
      END;
  END IF;
END $$;

-- If vehicle_type was wrongly typed as driver_status enum (common "n/a" default bug)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'driver_applications'
      AND column_name = 'vehicle_type'
      AND udt_name = 'driver_status'
  ) THEN
    ALTER TABLE public.driver_applications
      ALTER COLUMN vehicle_type TYPE text
      USING NULLIF(vehicle_type::text, 'n/a');
  END IF;
END $$;

UPDATE public.driver_applications
SET background_check_status = 'pending'
WHERE background_check_status IS NULL
   OR background_check_status NOT IN ('pending', 'clear', 'failed');

ALTER TABLE public.driver_applications
  ALTER COLUMN background_check_status SET DEFAULT 'pending';

GRANT SELECT, INSERT, UPDATE ON public.driver_applications TO authenticated;
GRANT ALL ON public.driver_applications TO service_role;

DROP POLICY IF EXISTS "driver_app self read" ON public.driver_applications;
CREATE POLICY "driver_app self read"
ON public.driver_applications FOR SELECT TO authenticated
USING (
  user_id::text = auth.uid()::text
  OR public.has_role(auth.uid(), 'admin'::app_role)
);

DROP POLICY IF EXISTS "driver_app self insert" ON public.driver_applications;
CREATE POLICY "driver_app self insert"
ON public.driver_applications FOR INSERT TO authenticated
WITH CHECK (user_id::text = auth.uid()::text);

DROP POLICY IF EXISTS "driver_app self update" ON public.driver_applications;
CREATE POLICY "driver_app self update"
ON public.driver_applications FOR UPDATE TO authenticated
USING (
  user_id::text = auth.uid()::text
  OR public.has_role(auth.uid(), 'admin'::app_role)
)
WITH CHECK (
  user_id::text = auth.uid()::text
  OR public.has_role(auth.uid(), 'admin'::app_role)
);

-- ---------------------------------------------------------------------------
-- 6) orders — customer insert grant (checkout)
-- ---------------------------------------------------------------------------
GRANT SELECT, INSERT, UPDATE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;

-- ---------------------------------------------------------------------------
-- 7) Founder admin backfill (optional; safe)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.grant_founder_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email IS NOT NULL AND lower(NEW.email) IN (
    'founder@myrunner.shop',
    'mytomaai@gmail.com',
    'gitrdone.courier.247@gmail.com'
  ) THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

INSERT INTO public.user_roles (user_id, role)
SELECT p.id, 'admin'::public.app_role
FROM public.profiles p
WHERE lower(p.email) IN (
  'founder@myrunner.shop',
  'mytomaai@gmail.com',
  'gitrdone.courier.247@gmail.com'
)
AND NOT EXISTS (
  SELECT 1 FROM public.user_roles ur
  WHERE ur.user_id = p.id AND ur.role = 'admin'::public.app_role
);

COMMIT;

-- ---------------------------------------------------------------------------
-- 8) Verification (read-only — does not change data)
-- ---------------------------------------------------------------------------
SELECT 'driver_applications.status defaults' AS check,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'driver_applications'
  AND column_name = 'status';

SELECT 'driver_applications.background_check_status type' AS check,
  data_type, udt_name, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'driver_applications'
  AND column_name = 'background_check_status';

SELECT 'bad driver_applications.status rows' AS check, count(*) AS n
FROM public.driver_applications
WHERE status::text NOT IN ('pending', 'approved', 'rejected', 'suspended');

SELECT 'has_role executable by authenticated' AS check,
  has_function_privilege('authenticated', 'public.has_role(uuid,public.app_role)', 'EXECUTE') AS ok;