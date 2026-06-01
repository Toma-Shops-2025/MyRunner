-- Auto-grant admin role to founder email on signup, and grant now if exists
CREATE OR REPLACE FUNCTION public.grant_founder_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email = 'founder@myrunner.shop' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
      ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS on_profile_insert_founder_admin ON public.profiles;
CREATE TRIGGER on_profile_insert_founder_admin
AFTER INSERT ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.grant_founder_admin();

-- If the founder already has a profile, grant now
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM public.profiles WHERE email = 'founder@myrunner.shop'
ON CONFLICT DO NOTHING;