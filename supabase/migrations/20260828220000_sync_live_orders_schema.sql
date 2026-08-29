-- Sync live orders table (ghcedtumkxhqdhrbrojn) with app expectations. Safe to re-run.

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS paid_at timestamptz,
  ADD COLUMN IF NOT EXISTS stripe_session_id text,
  ADD COLUMN IF NOT EXISTS additional_pickups integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS driver_payout_cents integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS platform_fee_cents integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS stripe_transfer_id text,
  ADD COLUMN IF NOT EXISTS payout_status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS paid_out_at timestamptz,
  ADD COLUMN IF NOT EXISTS dispatch_attempts integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS dispatch_status text NOT NULL DEFAULT 'queued',
  ADD COLUMN IF NOT EXISTS pickup_lat numeric,
  ADD COLUMN IF NOT EXISTS pickup_lng numeric,
  ADD COLUMN IF NOT EXISTS last_dispatched_at timestamptz,
  ADD COLUMN IF NOT EXISTS proof_photo_url text,
  ADD COLUMN IF NOT EXISTS delivered_at timestamptz;

CREATE INDEX IF NOT EXISTS orders_stripe_session_id_idx ON public.orders (stripe_session_id);

GRANT SELECT, INSERT, UPDATE ON public.orders TO authenticated;

-- Live schema stores some user ids as text; cast both sides like other policies.
DROP POLICY IF EXISTS "orders customer insert" ON public.orders;
CREATE POLICY "orders customer insert"
  ON public.orders
  FOR INSERT
  TO authenticated
  WITH CHECK (customer_id::text = auth.uid()::text);

DROP POLICY IF EXISTS "orders customer read" ON public.orders;
CREATE POLICY "orders customer read"
  ON public.orders
  FOR SELECT
  TO authenticated
  USING (
    customer_id::text = auth.uid()::text
    OR driver_id::text = auth.uid()::text
    OR public.has_role(auth.uid(), 'admin'::app_role)
  );

DROP POLICY IF EXISTS "orders involved update" ON public.orders;
CREATE POLICY "orders involved update"
  ON public.orders
  FOR UPDATE
  TO authenticated
  USING (
    customer_id::text = auth.uid()::text
    OR driver_id::text = auth.uid()::text
    OR public.has_role(auth.uid(), 'admin'::app_role)
  );

NOTIFY pgrst, 'reload schema';
