
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS paid_at timestamptz,
  ADD COLUMN IF NOT EXISTS stripe_session_id text;

CREATE INDEX IF NOT EXISTS orders_stripe_session_id_idx ON public.orders (stripe_session_id);
