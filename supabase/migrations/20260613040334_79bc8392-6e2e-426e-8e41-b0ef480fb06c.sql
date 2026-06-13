
CREATE OR REPLACE FUNCTION public.haversine_miles(lat1 numeric, lng1 numeric, lat2 numeric, lng2 numeric)
RETURNS numeric
LANGUAGE sql
IMMUTABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT 3959 * 2 * asin(sqrt(
    power(sin(radians(($3 - $1) / 2)), 2) +
    cos(radians($1)) * cos(radians($3)) * power(sin(radians(($4 - $2) / 2)), 2)
  ))
$$;

REVOKE EXECUTE ON FUNCTION public.haversine_miles(numeric, numeric, numeric, numeric) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.haversine_miles(numeric, numeric, numeric, numeric) TO service_role;
