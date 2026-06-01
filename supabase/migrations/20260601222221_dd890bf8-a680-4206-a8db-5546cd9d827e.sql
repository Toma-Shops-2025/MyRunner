
-- Roles
create type public.app_role as enum ('customer','driver','admin');
create type public.order_status as enum ('pending','accepted','picked_up','in_transit','delivered','cancelled');
create type public.order_type as enum ('standard','multi_pickup','multi_dropoff','scheduled');
create type public.driver_status as enum ('pending','approved','rejected','suspended');

-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "profiles self read" on public.profiles for select to authenticated using (id = auth.uid());
create policy "profiles self update" on public.profiles for update to authenticated using (id = auth.uid());
create policy "profiles self insert" on public.profiles for insert to authenticated with check (id = auth.uid());

-- Roles
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "roles self read" on public.user_roles for select to authenticated using (user_id = auth.uid());
create policy "roles admin all" on public.user_roles for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- Auto-create profile + customer role
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)));
  insert into public.user_roles (user_id, role) values (new.id, 'customer') on conflict do nothing;
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- Driver applications
create table public.driver_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  vehicle_type text,
  vehicle_make text,
  vehicle_model text,
  vehicle_year int,
  license_number text,
  license_state text,
  insurance_provider text,
  background_check_status text default 'pending',
  status driver_status not null default 'pending',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.driver_applications to authenticated;
grant all on public.driver_applications to service_role;
alter table public.driver_applications enable row level security;
create policy "driver_app self read" on public.driver_applications for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "driver_app self insert" on public.driver_applications for insert to authenticated with check (user_id = auth.uid());
create policy "driver_app self update" on public.driver_applications for update to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));

-- Orders
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references auth.users(id) on delete cascade,
  driver_id uuid references auth.users(id) on delete set null,
  pickup_address text not null,
  dropoff_address text not null,
  item_description text not null,
  notes text,
  type order_type not null default 'standard',
  status order_status not null default 'pending',
  price_cents int not null default 0,
  tip_cents int not null default 0,
  distance_miles numeric(8,2),
  scheduled_for timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.orders to authenticated;
grant all on public.orders to service_role;
alter table public.orders enable row level security;
create policy "orders customer read" on public.orders for select to authenticated using (customer_id = auth.uid() or driver_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "orders driver pool read" on public.orders for select to authenticated using (status = 'pending' and public.has_role(auth.uid(),'driver'));
create policy "orders customer insert" on public.orders for insert to authenticated with check (customer_id = auth.uid());
create policy "orders involved update" on public.orders for update to authenticated using (customer_id = auth.uid() or driver_id = auth.uid() or public.has_role(auth.uid(),'admin'));

-- Order messages
create table public.order_messages (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);
grant select, insert on public.order_messages to authenticated;
grant all on public.order_messages to service_role;
alter table public.order_messages enable row level security;
create policy "msgs read involved" on public.order_messages for select to authenticated using (
  exists (select 1 from public.orders o where o.id = order_id and (o.customer_id = auth.uid() or o.driver_id = auth.uid()))
  or public.has_role(auth.uid(),'admin')
);
create policy "msgs insert involved" on public.order_messages for insert to authenticated with check (
  sender_id = auth.uid() and exists (
    select 1 from public.orders o where o.id = order_id and (o.customer_id = auth.uid() or o.driver_id = auth.uid())
  )
);

-- Reports
create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references auth.users(id) on delete cascade,
  reported_user_id uuid references auth.users(id) on delete set null,
  order_id uuid references public.orders(id) on delete set null,
  category text not null,
  details text not null,
  status text not null default 'open',
  created_at timestamptz not null default now()
);
grant select, insert on public.reports to authenticated;
grant all on public.reports to service_role;
alter table public.reports enable row level security;
create policy "reports self read" on public.reports for select to authenticated using (reporter_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "reports self insert" on public.reports for insert to authenticated with check (reporter_id = auth.uid());
create policy "reports admin update" on public.reports for update to authenticated using (public.has_role(auth.uid(),'admin'));

-- Driver preferences (block / favorite)
create table public.driver_preferences (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references auth.users(id) on delete cascade,
  driver_id uuid not null references auth.users(id) on delete cascade,
  preference text not null check (preference in ('blocked','preferred')),
  created_at timestamptz not null default now(),
  unique (customer_id, driver_id, preference)
);
grant select, insert, delete on public.driver_preferences to authenticated;
grant all on public.driver_preferences to service_role;
alter table public.driver_preferences enable row level security;
create policy "prefs self all" on public.driver_preferences for all to authenticated using (customer_id = auth.uid()) with check (customer_id = auth.uid());

-- Updated_at trigger helper
create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;
create trigger profiles_touch before update on public.profiles for each row execute function public.touch_updated_at();
create trigger orders_touch before update on public.orders for each row execute function public.touch_updated_at();
create trigger driver_apps_touch before update on public.driver_applications for each row execute function public.touch_updated_at();
