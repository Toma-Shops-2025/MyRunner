-- Ensure authenticated users can read their own roles (has_role RPC + direct select).

GRANT SELECT ON public.user_roles TO authenticated;

DROP POLICY IF EXISTS "roles self read" ON public.user_roles;
CREATE POLICY "roles self read"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id::text = auth.uid()::text);

GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
