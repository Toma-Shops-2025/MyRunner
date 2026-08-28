-- Live project ghcedtumkxhqdhrbrojn was missing this column; safe to re-run.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS onboarding_completed_at timestamptz;
