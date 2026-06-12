## What you'll see when this ships

1. **Driver application is now one continuous flow.** A new applicant fills out a longer form (personal info + DOB + last 4 of SSN + home address + emergency contact + vehicle + license/insurance + uploads). On submit they're created, signed in, granted the `driver` role automatically, and dropped on `/driver/dashboard` — no admin approval needed.
2. **They can see the dashboard immediately but can't accept orders yet.** A persistent banner says "Complete Stripe payout setup to start accepting deliveries." The Accept button is disabled until Stripe Connect onboarding is `payouts_enabled = true`.
3. **Background check guardrail.** A new `background_check_status` on their profile defaults to `pending`. If you (admin) flip it to `failed`, their `driver` role is removed and a "Deactivated" banner takes over their dashboard until you flip it back to `clear`. The hook is in place even though Checkr itself isn't wired yet — you'll toggle status manually from the admin page.
4. **Customer pays right when they submit a new delivery.** The new-delivery form leads straight into Stripe embedded checkout. Payment success creates the order in `available` status and it shows up in the driver "Available orders" feed. No more orders stuck in "pending" with no way to pay.
5. **Driver claim → deliver → payout.** Drivers see Available orders, hit Accept (only if onboarded), do the delivery, mark Delivered, and the existing `payoutDriver` server function automatically transfers their 70% + 100% tip. House keeps 30%.
6. **Demo driver for reviewers.** A `demo-driver@myrunner.shop` / `Demo1234!` account is seeded with: driver role, background check = clear, Stripe Connect marked complete (mock — no real account, payouts simulated), so the reviewer can log in and immediately accept demo orders.

## Build steps

1. **Schema migration**
   - Add to `profiles`: `date_of_birth`, `ssn_last4`, `home_address`, `home_city`, `home_state`, `home_zip`, `phone`, `emergency_contact_name`, `emergency_contact_phone`, `background_check_status` (enum-ish text default `'pending'`), `background_check_updated_at`, `is_active` (default true).
   - Drop the admin-approval requirement from `driver_applications.status` default to `'auto_approved'`; keep the table for record-keeping.
   - Add `available` to allowed `orders.status` values; orders start at `'awaiting_payment'`, flip to `'available'` on `payment_status='paid'`.
   - RLS: drivers can read their own profile, admins can update `background_check_status` via `has_role('admin')`.

2. **Driver signup form rewrite** (`src/routes/driver-signup.tsx`)
   - Add all the new fields (DOB, last-4 SSN, full address, emergency contact). Full SSN field present but we only persist last 4 — discarded after submit.
   - On submit: create user → upsert profile with all data → insert `driver` role → toast → navigate to `/driver/dashboard`.

3. **Driver dashboard banners** (`src/routes/driver.dashboard.tsx`)
   - Top banner: "Complete Stripe payout setup" if `payouts_enabled=false`, linking to `/driver/earnings`.
   - Top banner: "Account deactivated — background check status: failed" if `background_check_status='failed'` or `is_active=false`.
   - Available-orders list pulled from `orders` where `status='available'`. Accept button disabled (with tooltip) when payouts not enabled or account inactive.

4. **Customer pay-on-submit** (`src/routes/app.new-delivery.tsx`)
   - On submit: create order with `status='awaiting_payment'`, then immediately open Stripe Embedded Checkout in a dialog. On success, webhook flips `payment_status='paid'` AND `status='available'` so drivers see it. On dialog close without paying: order stays awaiting_payment, customer sees a Pay Now button on `/app/orders/$id`.

5. **Webhook update** (`src/routes/api/public/payments/webhook.ts`)
   - On `checkout.session.completed` for an order: set `payment_status='paid'` and `status='available'` in one update.

6. **Admin background check toggle** (`src/routes/admin.drivers.tsx`)
   - Add a status dropdown per driver: `pending` / `clear` / `failed`. Server fn updates the profile and, on `failed`, removes the `driver` role; on `clear` reinstated if missing.

7. **Demo driver seed** (one-time migration)
   - Insert demo auth user, profile with `background_check_status='clear'`, `payouts_enabled=true`, `stripe_connect_account_id='acct_demo'`. Bypass `payoutDriver` for demo driver (skip Stripe transfer, just write the ledger row as `status='simulated'`).
   - Show "Demo driver login" hint card on `/login` with the credentials.

## Technical notes

- Last-4 SSN stored as `text` column with a check `length=4 and ~ '^\d{4}$'`. Full SSN never touches the DB — collected client-side and dropped after submit.
- `payoutDriver` server fn gets a short-circuit: if `driver.stripe_connect_account_id = 'acct_demo'` skip the Stripe transfer and write the payout row with `status='simulated'`. Keeps the demo end-to-end without needing a real Connect account.
- Background-check enforcement uses both an `is_active` profile flag and role removal so RLS-checked queries (Accept button server fn) naturally fail for deactivated drivers.
- The existing `payouts_enabled` flag continues to gate Accept; we add an `is_active && background_check_status != 'failed'` check alongside it.
- Demo driver password set via Supabase admin API in a one-time server-side seed script (run as migration with `auth.admin.createUser`).

Reply "go" and I'll start with the migration + form rewrite, then wire the rest in sequence.