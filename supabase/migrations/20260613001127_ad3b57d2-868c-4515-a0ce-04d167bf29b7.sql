-- Allow users to grant themselves the 'driver' role during driver application signup.
-- Admin role assignments still require admin (existing policy).
CREATE POLICY "roles self insert driver"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid() AND role = 'driver'::app_role);