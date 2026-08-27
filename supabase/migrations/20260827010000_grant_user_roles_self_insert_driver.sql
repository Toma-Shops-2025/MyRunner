-- Fix driver signup: policy existed but authenticated lacked INSERT privilege.
-- Run in Supabase SQL Editor for project ansjbzszrfkaajlfiukv if not applied via CLI.

GRANT INSERT ON public.user_roles TO authenticated;

DROP POLICY IF EXISTS "roles self insert driver" ON public.user_roles;
CREATE POLICY "roles self insert driver"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid() AND role = 'driver'::app_role);
