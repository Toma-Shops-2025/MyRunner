-- Live DB drift: some columns picked up driver_status enum default 'n/a', which is invalid.
-- Normalize defaults and coerce any bad rows before app submit.

UPDATE public.driver_applications
SET status = 'pending'
WHERE status::text NOT IN ('pending', 'approved', 'rejected', 'suspended');

ALTER TABLE public.driver_applications
  ALTER COLUMN status SET DEFAULT 'pending'::public.driver_status;

-- background_check_status is text in repo migrations; fix if it was altered in the dashboard.
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

UPDATE public.driver_applications
SET background_check_status = 'pending'
WHERE background_check_status IS NULL
   OR background_check_status NOT IN ('pending', 'clear', 'failed');

ALTER TABLE public.driver_applications
  ALTER COLUMN background_check_status SET DEFAULT 'pending';