-- Extra pickup or drop-off addresses for multi-pickup and multi-dropoff orders.
-- The first pickup and first drop-off stay in pickup_address and dropoff_address.
alter table public.orders
  add column if not exists route_stops jsonb not null default '[]'::jsonb;

comment on column public.orders.route_stops is
  'Additional stops: [{ "role": "pickup"|"dropoff", "address": text, "lat": number|null, "lng": number|null }]';
