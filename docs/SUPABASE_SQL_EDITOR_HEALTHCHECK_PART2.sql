-- =============================================================================
-- MyRunner — Supabase SQL Editor PART 2 (run after Part 1 / profiles constraint OK)
-- Paste ALL of this into SQL Editor → Run once. Safe to re-run.
-- =============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- 4) user_roles — driver signup + has_role reads
-- ---------------------------------------------------------------------------
ALTER TABLE public.user_roles
  ALTER COLUMN id SET DEFAULT gen_random_uuid();

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'user_roles_user_id_role_key'
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
-- 5) driver_applications — fix n/a enum + missing columns
-- ---------------------------------------------------------------------------
ALTER TABLE public.driver_applications
  ADD COLUMN IF NOT EXISTS vehicle_type text,
  ADD COLUMN IF NOT EXISTS vehicle_make text,
  ADD COLUMN IF NOT EXISTS vehicle_model text,
  ADD COLUMN IF NOT EXISTS vehicle_year integer,
  ADD COLUMN IF NOT EXISTS license_number text,
  ADD COLUMN IF NOT EXISTS license_state text,
  ADD COLUMN IF NOT EXISTS insurance_provider text,
  ADD COLUMN IF NOT EXISTS background_check_status text DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS notes text,
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

DELETE FROM public.driver_applications a
USING public.driver_applications b
WHERE a.ctid < b.ctid
  AND a.user_id::text = b.user_id::text;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'driver_applications_user_id_key'
  ) THEN
    ALTER TABLE public.driver_applications
      ADD CONSTRAINT driver_applications_user_id_key UNIQUE (user_id);
  END IF;
END $$;

ALTER TABLE public.driver_applications
  ALTER COLUMN id SET DEFAULT gen_random_uuid();

UPDATE public.driver_applications
SET status = 'pending'::public.driver_status
WHERE status::text NOT IN ('pending', 'approved', 'rejected', 'suspended');

ALTER TABLE public.driver_applications
  ALTER COLUMN status SET DEFAULT 'pending'::public.driver_status;

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

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'driver_applications'
      AND column_name = 'background_check_status'
  ) THEN
    UPDATE public.driver_applications
    SET background_check_status = 'pending'
    WHERE background_check_status IS NULL
       OR background_check_status NOT IN ('pending', 'clear', 'failed');

    ALTER TABLE public.driver_applications
      ALTER COLUMN background_check_status SET DEFAULT 'pending';
  END IF;
END $$;

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
-- 6) orders — checkout
-- ---------------------------------------------------------------------------
GRANT SELECT, INSERT, UPDATE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;

-- ---------------------------------------------------------------------------
-- 7) Founder admin backfill
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
-- 8) Verification (read-only)
-- ---------------------------------------------------------------------------
SELECT 'driver_applications.status default' AS check, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'driver_applications' AND column_name = 'status';

SELECT 'driver_applications.background_check_status' AS check, data_type, udt_name, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'driver_applications' AND column_name = 'background_check_status';

SELECT 'bad driver_application status rows' AS check, count(*) AS n
FROM public.driver_applications
WHERE status::text NOT IN ('pending', 'approved', 'rejected', 'suspended');

SELECT 'has_role for authenticated' AS check,
  has_function_privilege('authenticated', 'public.has_role(uuid,public.app_role)', 'EXECUTE') AS ok;