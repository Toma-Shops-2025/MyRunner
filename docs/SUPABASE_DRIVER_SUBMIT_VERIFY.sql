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

-- 4) Apply the fix block from SUPABASE_FIX_DRIVER_NA_ENUM.sql if step 2 shows n/a or vehicle_type as driver_status.

-- 5) If step 1 already looks correct but the app still says driver_status "n/a",
--    PostgREST may be serving a stale schema (from when vehicle_type used default n/a).
NOTIFY pgrst, 'reload schema';

-- 6) All columns in public that use the driver_status enum (should be only driver_applications.status)
SELECT table_name, column_name, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND udt_name = 'driver_status'
ORDER BY table_name, column_name;

-- 7) Triggers on driver_applications (should be driver_apps_touch only)
SELECT tgname, pg_get_triggerdef(oid) AS definition
FROM pg_trigger
WHERE tgrelid = 'public.driver_applications'::regclass
  AND NOT tgisinternal;

-- 8) Confirm Netlify/Vercel SUPABASE_URL matches THIS project (Settings → API → Project URL).