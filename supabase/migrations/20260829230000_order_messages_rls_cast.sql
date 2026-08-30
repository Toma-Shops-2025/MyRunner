-- Live DB stores order user ids as text; original policies compare uuid directly.

DROP POLICY IF EXISTS "msgs read involved" ON public.order_messages;
DROP POLICY IF EXISTS "msgs insert involved" ON public.order_messages;

CREATE POLICY "msgs read involved" ON public.order_messages
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id::text = order_id::text
        AND (
          o.customer_id::text = auth.uid()::text
          OR o.driver_id::text = auth.uid()::text
        )
    )
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "msgs insert involved" ON public.order_messages
  FOR INSERT TO authenticated
  WITH CHECK (
    sender_id::text = auth.uid()::text
    AND EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id::text = order_id::text
        AND (
          o.customer_id::text = auth.uid()::text
          OR o.driver_id::text = auth.uid()::text
        )
    )
  );

NOTIFY pgrst, 'reload schema';
