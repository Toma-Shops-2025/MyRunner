-- Belt-and-suspenders: allow authenticated driver applicants to write their row.
-- Server function uses service role; run this if client writes are still needed.

GRANT INSERT, UPDATE ON public.driver_applications TO authenticated;

DROP POLICY IF EXISTS "driver_app self insert" ON public.driver_applications;
CREATE POLICY "driver_app self insert"
ON public.driver_applications
FOR INSERT
TO authenticated
WITH CHECK (user_id::text = auth.uid()::text);

DROP POLICY IF EXISTS "driver_app self update" ON public.driver_applications;
CREATE POLICY "driver_app self update"
ON public.driver_applications
FOR UPDATE
TO authenticated
USING (user_id::text = auth.uid()::text OR public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (user_id::text = auth.uid()::text OR public.has_role(auth.uid(), 'admin'::app_role));
