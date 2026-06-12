
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
  ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;

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

DROP POLICY IF EXISTS "profiles admin read" ON public.profiles;
CREATE POLICY "profiles admin read" ON public.profiles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "profiles admin update" ON public.profiles;
CREATE POLICY "profiles admin update" ON public.profiles
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- driver_applications default: leave enum alone, use 'approved' for auto-approval
ALTER TABLE public.driver_applications
  ALTER COLUMN status SET DEFAULT 'approved';
