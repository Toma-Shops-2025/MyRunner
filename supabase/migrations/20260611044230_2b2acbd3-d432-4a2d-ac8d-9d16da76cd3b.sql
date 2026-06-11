
-- Profiles: Connect account fields
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS stripe_connect_account_id text UNIQUE,
  ADD COLUMN IF NOT EXISTS payouts_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS onboarding_completed_at timestamptz;

-- Orders: payout tracking
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS additional_pickups integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS driver_payout_cents integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS platform_fee_cents integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS stripe_transfer_id text,
  ADD COLUMN IF NOT EXISTS payout_status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS paid_out_at timestamptz;

-- Driver payouts ledger
CREATE TABLE IF NOT EXISTS public.driver_payouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  amount_cents integer NOT NULL,
  tip_cents integer NOT NULL DEFAULT 0,
  fee_share_cents integer NOT NULL DEFAULT 0,
  stripe_transfer_id text UNIQUE,
  status text NOT NULL DEFAULT 'pending',
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.driver_payouts TO authenticated;
GRANT ALL ON public.driver_payouts TO service_role;

ALTER TABLE public.driver_payouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Drivers can view own payouts"
  ON public.driver_payouts FOR SELECT
  TO authenticated
  USING (auth.uid() = driver_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Service role manages payouts"
  ON public.driver_payouts FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_driver_payouts_driver ON public.driver_payouts(driver_id);
CREATE INDEX IF NOT EXISTS idx_driver_payouts_order ON public.driver_payouts(order_id);

CREATE TRIGGER touch_driver_payouts_updated_at
  BEFORE UPDATE ON public.driver_payouts
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
