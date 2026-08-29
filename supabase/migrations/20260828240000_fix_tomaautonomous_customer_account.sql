-- One-time fix: tomaautonomous@gmail.com is a customer account, not a driver.
-- Safe to re-run. Adjust email if needed.

DO $$
DECLARE
  uid uuid;
BEGIN
  SELECT id INTO uid FROM auth.users WHERE lower(email) = 'tomaautonomous@gmail.com';
  IF uid IS NULL THEN
    RAISE NOTICE 'User not found';
    RETURN;
  END IF;

  DELETE FROM public.user_roles
  WHERE user_id::text = uid::text AND role::text = 'driver';

  DELETE FROM public.driver_applications
  WHERE user_id::text = uid::text
    AND status::text IS DISTINCT FROM 'approved';

  UPDATE auth.users
  SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb)
    || jsonb_build_object('signup_intent', 'customer')
  WHERE id = uid;
END $$;
