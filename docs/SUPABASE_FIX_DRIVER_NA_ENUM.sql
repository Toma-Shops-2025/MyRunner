-- Run once in Supabase SQL Editor if driver submit still says driver_status "n/a"
-- After fixing schema, trigger a fresh Netlify production deploy from main and open
-- https://myrunner.shop/deploy.json — commit should match GitHub main (e.g. d23f964+).

BEGIN;

-- 0) Whole-schema audit: any driver_status column or default mentioning n/a
SELECT table_name, column_name, udt_name, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND (
    udt_name = 'driver_status'
    OR column_default::text ILIKE '%n/a%'
  )
ORDER BY table_name, column_name;

-- 1) driver_applications columns of interest
SELECT column_name, udt_name, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'driver_applications'
  AND (udt_name = 'driver_status' OR column_default::text ILIKE '%n/a%');

-- 1b) Drop any legacy defaults before type changes
ALTER TABLE public.driver_applications
  ALTER COLUMN vehicle_type DROP DEFAULT,
  ALTER COLUMN background_check_status DROP DEFAULT,
  ALTER COLUMN status DROP DEFAULT;

-- 2) vehicle_type must be text, not driver_status enum
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

ALTER TABLE public.driver_applications
  ALTER COLUMN vehicle_type TYPE text
  USING vehicle_type::text;

ALTER TABLE public.driver_applications
  ALTER COLUMN vehicle_type SET DEFAULT NULL;

-- 3) background_check_status must stay text (pending/clear/failed)
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

ALTER TABLE public.driver_applications
  ALTER COLUMN background_check_status SET DEFAULT 'pending';

UPDATE public.driver_applications
SET status = 'pending'::public.driver_status
WHERE status::text NOT IN ('pending', 'approved', 'rejected', 'suspended');

ALTER TABLE public.driver_applications
  ALTER COLUMN status SET DEFAULT 'pending'::public.driver_status;

COMMIT;

SELECT column_name, udt_name, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'driver_applications'
  AND column_name IN ('vehicle_type', 'background_check_status', 'status')
ORDER BY column_name;

-- 4) If submit still fails with driver_status "n/a" after step 1 looks fine, PostgREST may still
--    treat vehicle_type as driver_status when using .upsert(). Run the full file:
--    supabase/migrations/20261127170000_driver_application_signup_rpc.sql
--    (creates upsert_driver_application_for_signup + forces vehicle_type to text).

-- 5) Authoritative column types (not information_schema cache):
SELECT a.attname AS column_name,
       pg_catalog.format_type(a.atttypid, a.atttypmod) AS pg_type,
       pg_get_expr(d.adbin, d.adrelid) AS column_default
FROM pg_catalog.pg_attribute a
LEFT JOIN pg_catalog.pg_attrdef d ON a.attrelid = d.adrelid AND a.attnum = d.adnum
WHERE a.attrelid = 'public.driver_applications'::regclass
  AND a.attnum > 0
  AND NOT a.attisdropped
ORDER BY a.attnum;