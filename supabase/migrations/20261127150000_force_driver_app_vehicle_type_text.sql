-- Live drift: vehicle_type (or other columns) may still be driver_status with default 'n/a'.

ALTER TABLE public.driver_applications
  ALTER COLUMN vehicle_type DROP DEFAULT,
  ALTER COLUMN background_check_status DROP DEFAULT,
  ALTER COLUMN status DROP DEFAULT;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
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

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
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