-- Cast-safe driver_payouts read + backfill failed transfer for completed test order.

DROP POLICY IF EXISTS "Drivers can view own payouts" ON public.driver_payouts;
CREATE POLICY "Drivers can view own payouts"
  ON public.driver_payouts FOR SELECT
  TO authenticated
  USING (
    driver_id::text = auth.uid()::text
    OR EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id::text = auth.uid()::text
        AND ur.role::text = 'admin'
    )
  );

-- Backfill ledger row for the clothes delivery if Stripe transfer failed and no row exists
INSERT INTO public.driver_payouts (
  driver_id, order_id, amount_cents, tip_cents, fee_share_cents, status, error_message
)
SELECT
  o.driver_id::uuid,
  o.id,
  ROUND(o.price_cents * 0.7)::int + COALESCE(o.tip_cents, 0),
  COALESCE(o.tip_cents, 0),
  ROUND(o.price_cents * 0.7)::int,
  'failed',
  'Insufficient Stripe platform balance at delivery time'
FROM public.orders o
WHERE o.status = 'delivered'
  AND o.driver_id IS NOT NULL
  AND o.item_description ILIKE '%clothes%'
  AND NOT EXISTS (
    SELECT 1 FROM public.driver_payouts dp WHERE dp.order_id = o.id
  );
