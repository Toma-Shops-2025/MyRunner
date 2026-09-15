-- Driver referral program: $25 each after referred Runner completes 3 deliveries
-- Run in Supabase → SQL Editor (MyRunner project)

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS referral_code text,
  ADD COLUMN IF NOT EXISTS referred_by uuid REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE UNIQUE INDEX IF NOT EXISTS profiles_referral_code_uidx
  ON public.profiles (referral_code)
  WHERE referral_code IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.driver_referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_code text NOT NULL,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'qualified', 'paid', 'failed')),
  deliveries_completed int NOT NULL DEFAULT 0,
  reward_cents int NOT NULL DEFAULT 2500,
  referrer_transfer_id text,
  referred_transfer_id text,
  qualified_at timestamptz,
  paid_at timestamptz,
  last_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (referred_id)
);

CREATE INDEX IF NOT EXISTS driver_referrals_referrer_idx ON public.driver_referrals (referrer_id);
CREATE INDEX IF NOT EXISTS driver_referrals_status_idx ON public.driver_referrals (status);

ALTER TABLE public.driver_referrals ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.driver_referrals TO authenticated;
GRANT ALL ON public.driver_referrals TO service_role;

DROP POLICY IF EXISTS "referrals self read" ON public.driver_referrals;
CREATE POLICY "referrals self read" ON public.driver_referrals
  FOR SELECT TO authenticated
  USING (referrer_id = auth.uid() OR referred_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
