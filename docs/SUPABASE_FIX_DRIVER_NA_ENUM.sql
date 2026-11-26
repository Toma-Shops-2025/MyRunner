-- Run once in Supabase SQL Editor if driver submit still says driver_status "n/a"

BEGIN;

-- 1) Show which columns use driver_status or default n/a
SELECT column_name, udt_name, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'driver_applications'
  AND (udt_name = 'driver_status' OR column_default::text ILIKE '%n/a%');

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