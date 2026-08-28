-- Fix driver_applications self-read when user_id type differs from auth.uid().

DROP POLICY IF EXISTS "driver_app self read" ON public.driver_applications;
CREATE POLICY "driver_app self read"
ON public.driver_applications
FOR SELECT
TO authenticated
USING (
  user_id::text = auth.uid()::text
  OR public.has_role(auth.uid(), 'admin'::app_role)
);
