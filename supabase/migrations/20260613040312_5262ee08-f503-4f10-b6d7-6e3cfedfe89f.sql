
-- Profiles: location + driver_status + checkr fields
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS current_lat numeric,
  ADD COLUMN IF NOT EXISTS current_lng numeric,
  ADD COLUMN IF NOT EXISTS location_updated_at timestamptz,
  ADD COLUMN IF NOT EXISTS driver_status text NOT NULL DEFAULT 'offline',
  ADD COLUMN IF NOT EXISTS checkr_candidate_id text,
  ADD COLUMN IF NOT EXISTS checkr_report_id text,
  ADD COLUMN IF NOT EXISTS checkr_report_status text;

-- Orders: dispatch tracking + pickup coords
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS dispatch_attempts int NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS dispatch_status text NOT NULL DEFAULT 'queued',
  ADD COLUMN IF NOT EXISTS pickup_lat numeric,
  ADD COLUMN IF NOT EXISTS pickup_lng numeric,
  ADD COLUMN IF NOT EXISTS last_dispatched_at timestamptz;

-- Offers table
CREATE TABLE IF NOT EXISTS public.offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  driver_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  offered_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  attempt_number int NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, UPDATE ON public.offers TO authenticated;
GRANT ALL ON public.offers TO service_role;

ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Drivers can view their own offers"
  ON public.offers FOR SELECT
  TO authenticated
  USING (driver_id = auth.uid());

CREATE POLICY "Drivers can update their own pending offers"
  ON public.offers FOR UPDATE
  TO authenticated
  USING (driver_id = auth.uid() AND status = 'pending')
  WITH CHECK (driver_id = auth.uid());

CREATE INDEX IF NOT EXISTS offers_driver_pending_idx ON public.offers(driver_id, status);
CREATE INDEX IF NOT EXISTS offers_order_idx ON public.offers(order_id);
CREATE INDEX IF NOT EXISTS offers_expires_idx ON public.offers(expires_at) WHERE status = 'pending';

CREATE TRIGGER offers_touch_updated_at
  BEFORE UPDATE ON public.offers
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Enable realtime for offers
ALTER PUBLICATION supabase_realtime ADD TABLE public.offers;

-- Haversine distance function (miles)
CREATE OR REPLACE FUNCTION public.haversine_miles(lat1 numeric, lng1 numeric, lat2 numeric, lng2 numeric)
RETURNS numeric
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT 3959 * 2 * asin(sqrt(
    power(sin(radians(($3 - $1) / 2)), 2) +
    cos(radians($1)) * cos(radians($3)) * power(sin(radians(($4 - $2) / 2)), 2)
  ))
$$;
