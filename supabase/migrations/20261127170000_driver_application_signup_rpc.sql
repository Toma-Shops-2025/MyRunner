-- Bypass PostgREST table schema drift (vehicle_type cached as driver_status default n/a).
-- Run in SQL Editor if driver signup still fails before this migration is applied remotely.

ALTER TABLE public.driver_applications
  ALTER COLUMN vehicle_type DROP DEFAULT,
  ALTER COLUMN background_check_status DROP DEFAULT,
  ALTER COLUMN status DROP DEFAULT;

ALTER TABLE public.driver_applications
  ALTER COLUMN vehicle_type TYPE text
  USING vehicle_type::text;

ALTER TABLE public.driver_applications
  ALTER COLUMN vehicle_type SET DEFAULT NULL;

UPDATE public.driver_applications
SET status = 'pending'::public.driver_status
WHERE status::text NOT IN ('pending', 'approved', 'rejected', 'suspended');

ALTER TABLE public.driver_applications
  ALTER COLUMN status SET DEFAULT 'pending'::public.driver_status;

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
    notes
  )
  VALUES (
    p_id,
    p_user_id,
    p_vehicle_make,
    p_vehicle_model,
    p_vehicle_year,
    p_vehicle_type,
    p_license_number,
    p_license_state,
    p_insurance_provider,
    p_background_check_status,
    p_status,
    p_notes
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
END;
$$;

REVOKE ALL ON FUNCTION public.upsert_driver_application_for_signup FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.upsert_driver_application_for_signup TO service_role;

NOTIFY pgrst, 'reload schema';