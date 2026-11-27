-- Paste this entire file into Supabase → SQL Editor → Run once.
-- Fixes driver_status "n/a" on driver signup (hidden defaults, triggers, RPC).

BEGIN;

-- 1) Show every column type + default (authoritative; share output if submit still fails)
SELECT a.attname AS column_name,
       pg_catalog.format_type(a.atttypid, a.atttypmod) AS pg_type,
       pg_get_expr(d.adbin, d.adrelid) AS column_default
FROM pg_catalog.pg_attribute a
LEFT JOIN pg_catalog.pg_attrdef d ON a.attrelid = d.adrelid AND a.attnum = d.adnum
WHERE a.attrelid = 'public.driver_applications'::regclass
  AND a.attnum > 0
  AND NOT a.attisdropped
ORDER BY a.attnum;

-- 2) Drop ALL column defaults on driver_applications (removes any stray 'n/a'::driver_status)
DO $$
DECLARE
  col record;
BEGIN
  FOR col IN
    SELECT a.attname
    FROM pg_catalog.pg_attribute a
    WHERE a.attrelid = 'public.driver_applications'::regclass
      AND a.attnum > 0
      AND NOT a.attisdropped
  LOOP
    EXECUTE format(
      'ALTER TABLE public.driver_applications ALTER COLUMN %I DROP DEFAULT',
      col.attname
    );
  END LOOP;
END $$;

-- 3) Any non-status column still typed as driver_status → text
DO $$
DECLARE
  col record;
BEGIN
  FOR col IN
    SELECT a.attname
    FROM pg_catalog.pg_attribute a
    JOIN pg_catalog.pg_type t ON a.atttypid = t.oid
    JOIN pg_catalog.pg_namespace n ON t.typnamespace = n.oid
    WHERE a.attrelid = 'public.driver_applications'::regclass
      AND a.attnum > 0
      AND NOT a.attisdropped
      AND n.nspname = 'public'
      AND t.typname = 'driver_status'
      AND a.attname <> 'status'
  LOOP
    EXECUTE format(
      'ALTER TABLE public.driver_applications ALTER COLUMN %I TYPE text USING %I::text',
      col.attname,
      col.attname
    );
  END LOOP;
END $$;

ALTER TABLE public.driver_applications
  ALTER COLUMN vehicle_type TYPE text USING vehicle_type::text;

ALTER TABLE public.driver_applications
  ALTER COLUMN background_check_status TYPE text USING background_check_status::text;

UPDATE public.driver_applications
SET status = 'pending'::public.driver_status
WHERE status::text NOT IN ('pending', 'approved', 'rejected', 'suspended');

ALTER TABLE public.driver_applications
  ALTER COLUMN status SET DEFAULT 'pending'::public.driver_status;

ALTER TABLE public.driver_applications
  ALTER COLUMN created_at SET DEFAULT now();

ALTER TABLE public.driver_applications
  ALTER COLUMN updated_at SET DEFAULT now();

ALTER TABLE public.driver_applications
  ALTER COLUMN background_check_status SET DEFAULT 'pending';

-- 4) Remove non-standard triggers (keep touch_updated_at)
DO $$
DECLARE
  trg record;
BEGIN
  FOR trg IN
    SELECT tgname
    FROM pg_trigger
    WHERE tgrelid = 'public.driver_applications'::regclass
      AND NOT tgisinternal
      AND tgname <> 'driver_apps_touch'
  LOOP
  EXECUTE format('DROP TRIGGER IF EXISTS %I ON public.driver_applications', trg.tgname);
  END LOOP;
END $$;

-- 5) Signup RPC: disable user triggers during write, then re-enable
CREATE OR REPLACE FUNCTION public.upsert_driver_application_for_signup(
  p_id uuid,
  p_user_id text,
  p_vehicle_make text,
  p_vehicle_model text,
  p_vehicle_year integer,
  p_vehicle_type text,
  p_license_number text,
  p_license_state text,
  p_insurance_provider text,
  p_background_check_status text,
  p_status public.driver_status,
  p_notes text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM set_config('session_replication_role', 'replica', true);

  INSERT INTO public.driver_applications (
    id,
    user_id,
    vehicle_make,
    vehicle_model,
    vehicle_year,
    vehicle_type,
    license_number,
    license_state,
    insurance_provider,
    background_check_status,
    status,
    notes,
    created_at,
    updated_at
  )
  VALUES (
    p_id,
    p_user_id,
    p_vehicle_make,
    p_vehicle_model,
    p_vehicle_year,
    COALESCE(NULLIF(trim(p_vehicle_type), ''), 'car'),
    p_license_number,
    p_license_state,
    p_insurance_provider,
    COALESCE(p_background_check_status, 'pending'),
  (
    CASE p_status::text
      WHEN 'approved' THEN 'approved'::public.driver_status
      WHEN 'rejected' THEN 'rejected'::public.driver_status
      WHEN 'suspended' THEN 'suspended'::public.driver_status
      ELSE 'pending'::public.driver_status
    END
  ),
    p_notes,
    now(),
    now()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    vehicle_make = EXCLUDED.vehicle_make,
    vehicle_model = EXCLUDED.vehicle_model,
    vehicle_year = EXCLUDED.vehicle_year,
    vehicle_type = EXCLUDED.vehicle_type,
    license_number = EXCLUDED.license_number,
    license_state = EXCLUDED.license_state,
    insurance_provider = EXCLUDED.insurance_provider,
    background_check_status = EXCLUDED.background_check_status,
    status = EXCLUDED.status,
    notes = EXCLUDED.notes,
    updated_at = now();

  PERFORM set_config('session_replication_role', 'origin', true);
EXCEPTION
  WHEN OTHERS THEN
    PERFORM set_config('session_replication_role', 'origin', true);
    RAISE;
END;
$$;

REVOKE ALL ON FUNCTION public.upsert_driver_application_for_signup FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.upsert_driver_application_for_signup TO service_role;

COMMIT;

NOTIFY pgrst, 'reload schema';

-- 6) Confirm RPC exists
SELECT proname, pg_get_function_identity_arguments(oid) AS args
FROM pg_proc
WHERE proname = 'upsert_driver_application_for_signup';