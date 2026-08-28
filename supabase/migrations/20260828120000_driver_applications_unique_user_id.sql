-- Fix driver signup: ensure one application row per user for upserts.
-- Safe to re-run. Dedupes duplicate user_id rows first.

DELETE FROM public.driver_applications a
USING public.driver_applications b
WHERE a.ctid < b.ctid
  AND a.user_id::text = b.user_id::text;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'driver_applications_user_id_key'
      AND conrelid = 'public.driver_applications'::regclass
  ) THEN
    ALTER TABLE public.driver_applications
      ADD CONSTRAINT driver_applications_user_id_key UNIQUE (user_id);
  END IF;
END $$;

ALTER TABLE public.driver_applications
  ALTER COLUMN id SET DEFAULT gen_random_uuid();
