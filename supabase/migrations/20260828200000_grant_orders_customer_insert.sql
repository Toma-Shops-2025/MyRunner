-- Live project ghcedtumkxhqdhrbrojn: ensure customers can create orders.
GRANT SELECT, INSERT, UPDATE ON public.orders TO authenticated;

DROP POLICY IF EXISTS "orders customer insert" ON public.orders;
CREATE POLICY "orders customer insert"
  ON public.orders
  FOR INSERT
  TO authenticated
  WITH CHECK (customer_id::text = auth.uid()::text);
