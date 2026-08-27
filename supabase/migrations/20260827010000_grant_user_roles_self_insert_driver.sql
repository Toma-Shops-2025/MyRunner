-- Fix driver signup: policy existed but authenticated lacked INSERT privilege.
-- Run in Supabase SQL Editor for project ghcedtumkxhqdhrbrojn if not applied via CLI.
-- Casts handle live schema where user_id may be text while auth.uid() is uuid.

GRANT INSERT ON public.user_roles TO authenticated;

DROP POLICY IF EXISTS "roles self insert driver" ON public.user_roles;
CREATE POLICY "roles self insert driver"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  user_id::text = auth.uid()::text
  AND role::text = 'driver'
);
