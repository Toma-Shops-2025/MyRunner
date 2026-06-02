DROP POLICY IF EXISTS "orders driver pool read" ON public.orders;
CREATE POLICY "orders driver pool read" ON public.orders
  FOR SELECT TO authenticated
  USING (
    status = 'pending'::order_status
    AND payment_status = 'paid'
    AND has_role(auth.uid(), 'driver'::app_role)
  );