-- Restore kidstory1000@gmail.com as the driver account. Safe to re-run.

DO $$
DECLARE
  uid uuid;
BEGIN
  SELECT id INTO uid FROM auth.users WHERE lower(email) = 'kidstory1000@gmail.com';
  IF uid IS NULL THEN
    RAISE NOTICE 'Driver user not found';
    RETURN;
  END IF;

  UPDATE auth.users
  SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb)
    || jsonb_build_object('signup_intent', 'driver')
  WHERE id = uid;

  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id::text = uid::text AND role::text = 'driver'
  ) THEN
    INSERT INTO public.user_roles (id, user_id, role)
    VALUES (gen_random_uuid(), uid, 'driver');
  END IF;

  UPDATE public.driver_applications
  SET status = 'approved'
  WHERE user_id::text = uid::text;
END $$;
