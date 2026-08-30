ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS stripe_payment_intent_id text;

CREATE INDEX IF NOT EXISTS orders_stripe_payment_intent_id_idx ON public.orders (stripe_payment_intent_id);

NOTIFY pgrst, 'reload schema';
