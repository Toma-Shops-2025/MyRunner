-- Live project may have NOT NULL columns without working defaults on insert.
ALTER TABLE public.orders
  ALTER COLUMN platform_fee_cents SET DEFAULT 0,
  ALTER COLUMN driver_payout_cents SET DEFAULT 0,
  ALTER COLUMN payment_status SET DEFAULT 'pending',
  ALTER COLUMN payout_status SET DEFAULT 'pending';

UPDATE public.orders
SET
  platform_fee_cents = COALESCE(platform_fee_cents, 0),
  driver_payout_cents = COALESCE(driver_payout_cents, 0),
  payment_status = COALESCE(payment_status, 'pending'),
  payout_status = COALESCE(payout_status, 'pending')
WHERE
  platform_fee_cents IS NULL
  OR driver_payout_cents IS NULL
  OR payment_status IS NULL
  OR payout_status IS NULL;
