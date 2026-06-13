## What you'll get

**Spark-style offers, with a safety net.** When a customer pays for a delivery, the system finds the nearest online, eligible driver and sends them an exclusive offer with a 45-second countdown. Accept → it's theirs. Decline or let it expire → it goes to the next-nearest driver. If 5 drivers in a row pass (or no drivers are online), the order falls back to the open "Available orders" feed (the current behavior) so it doesn't sit dead — any eligible driver can grab it first-come.

**Drivers never browse open orders during normal operation** — only the single offer in front of them. The open feed only fills with orders the dispatcher couldn't place. Once volume picks up and there are always drivers online, the feed will usually be empty and everything flows through offers.

**Checkr is wired but dormant.** All the code, webhook endpoint, and DB fields are in place. The moment you drop in your Checkr API key, webhook secret, and package slug, new signups will trigger a background check automatically and the webhook will deactivate any driver who comes back ineligible.

---

## Spark-style dispatch — defaults I'm picking

- **Offer timeout:** 45 seconds per driver.
- **Search radius:** start at 5 mi, expand to 10 mi if no online drivers in 5, then 15 mi.
- **Max offer attempts before fallback:** 5 drivers tried, OR 4 minutes elapsed, whichever first.
- **Fallback:** order goes to the open "Available orders" feed (existing pool view) until someone accepts.
- **Driver location pings:** every 20 seconds while online (needed for nearest-driver math).
- **Audible alert** on incoming offer (web Audio API beep + vibrate on mobile).

If you want any of these tuned, say so before I build.

---

## Build steps

### 1. Schema migration
- Add to `profiles`: `current_lat numeric`, `current_lng numeric`, `location_updated_at timestamptz`, `driver_status text default 'offline'` (`offline` / `online` / `on_delivery`).
- New table `offers`: `id`, `order_id`, `driver_id`, `offered_at`, `expires_at`, `status` (`pending` / `accepted` / `declined` / `expired`), `attempt_number`. RLS: driver can read/update their own pending offer.
- New columns on `orders`: `dispatch_attempts int default 0`, `dispatch_status text default 'queued'` (`queued` / `offered` / `assigned` / `fallback_pool`), `pickup_lat`, `pickup_lng`.
- Add to `profiles`: Checkr fields → `checkr_candidate_id text`, `checkr_report_id text`, `checkr_report_status text`.
- Enable realtime on `offers` so the driver dashboard hears their own offers instantly.

### 2. Dispatch engine (`src/lib/dispatch.functions.ts`)
- `dispatchOrder(orderId)`: finds nearest online driver within current radius (using lat/lng haversine), inserts an `offers` row with 45s expiry, marks order `dispatch_status='offered'`. Skips drivers who are inactive, failed background, payouts not enabled, or currently `on_delivery`.
- `acceptOffer(offerId)`: locks order to driver, sets driver `on_delivery`, marks offer `accepted`, all other pending offers for that order → `expired`.
- `declineOffer(offerId)`: marks declined, immediately calls `dispatchOrder` again with `attempt_number+1` (skipping drivers who already saw it).
- `reassignExpired()` (cron, every 15s): finds offers past `expires_at`, marks `expired`, kicks off next dispatch. After 5 attempts or 4 minutes, sets order `dispatch_status='fallback_pool'` and stops auto-dispatching — order shows up in the open feed.

### 3. Pay-on-checkout hook
- After `payment_status='paid'` flips in the Stripe webhook, fire `dispatchOrder` once. (Already the right insertion point — no double-dispatch.)

### 4. Driver dashboard updates (`src/routes/driver.dashboard.tsx`)
- **Online/offline toggle** actually updates `profiles.driver_status` (today it only flips local state).
- **Location ping**: while online, `navigator.geolocation.watchPosition` updates `current_lat`/`current_lng` every 20s.
- **Offer modal**: realtime subscription to `offers` filtered by `driver_id=me, status=pending`. When one appears, show a big modal: pickup, dropoff, distance, payout, ★ countdown ring. Accept / Decline buttons. Audio beep + vibrate.
- **Open feed below**: shows only `dispatch_status='fallback_pool'` orders (the safety net). Same Accept button as today.

### 5. Checkr scaffold (dormant until keys)
- `src/lib/checkr.server.ts`: thin client wrapping create-candidate / create-invitation / get-report. Reads `CHECKR_API_KEY` and `CHECKR_PACKAGE_SLUG` from env. If unset → no-ops with a console warning (so dev keeps working).
- On driver signup, call `checkr.createCandidateAndInvite(profile)` — silently skips if keys missing.
- Webhook route `src/routes/api/public/checkr-webhook.ts`: verifies `X-Checkr-Signature` HMAC with `CHECKR_WEBHOOK_SECRET`, then on `report.completed`:
  - `clear` → `background_check_status='clear'`, `is_active=true`.
  - `consider` / `suspended` / `dispute` → `is_active=false`, `background_check_status='failed'`, driver role left in place but Accept/dispatch checks block them. (Existing UI already shows the deactivated banner.)
  - Later `clear` after dispute → reactivates automatically.
- Reviewer account (`driver-review@myrunner.shop`) short-circuits — never calls Checkr.

### 6. Cron (pg_cron, every 15s)
- Hits `/api/public/hooks/dispatch-tick` which runs `reassignExpired()`.

---

## Technical notes

- Nearest-driver math: haversine in SQL using `current_lat`/`current_lng` (no PostGIS dependency — keeps it simple). If you ever want real road distance later, swap in Mapbox Matrix API in `dispatch.functions.ts` without touching the rest.
- Offer realtime: subscribed via `supabase.channel().on('postgres_changes', { table: 'offers', filter: 'driver_id=eq.<uid>' })`.
- All dispatch decisions go through one server fn so the eligibility rules (active, background clear, payouts enabled, not on delivery, online) live in one place.
- The fallback pool path is identical to today's flow — so even if dispatch breaks, orders are never lost.
- Checkr keys I'll need from you whenever you're ready (project keeps running fine without them): `CHECKR_API_KEY`, `CHECKR_WEBHOOK_SECRET`, `CHECKR_PACKAGE_SLUG`.

---

Reply **go** and I'll start with the migration, then dispatch engine, then driver dashboard, then the Checkr scaffold.