-- Run in Supabase SQL Editor before retrying driver signup on the phone.
-- Copy the FULL driver_applications column list (step 1) back to support if submit still fails.

-- 1) Every column on driver_applications (check vehicle_type is text, not driver_status)
SELECT column_name, udt_name, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'driver_applications'
ORDER BY ordinal_position;

-- 2) Any remaining bad defaults site-wide
SELECT table_name, column_name, udt_name, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND (
    udt_name = 'driver_status'
    OR column_default::text ILIKE '%n/a%'
  )
ORDER BY table_name, column_name;

-- 3) Optional: clear your test user's half-saved row (replace UUID from Auth → Users)
-- DELETE FROM public.driver_applications WHERE user_id = 'YOUR-USER-UUID-HERE';

-- 4) Apply the fix block from SUPABASE_FIX_DRIVER_NA_ENUM.sql (sections after the SELECTs) if step 2 shows n/a or vehicle_type as driver_status.