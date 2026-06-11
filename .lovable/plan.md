
# Stripe Connect for Driver Payouts

## What changes for you

- Drivers get a new **Earnings** page where they finish a one-time Stripe onboarding (Stripe-hosted form: name, DOB, address, SSN last 4, bank account). Without it, they can still accept orders but can't be paid.
- After each delivered order, the system automatically sends **70% of the delivery fee + 100% of the tip** to the driver's Stripe account. MyRunner keeps the other 30% of the fee.
- Pricing updates to **$5.99 base + $1.50/mile + $3.00 per additional pickup**.
- You'll see each driver's onboarding status and lifetime payout total in the admin dashboard.

## Important heads-up

Lovable's built-in Stripe doesn't support Connect (driver payouts). To do this we have to switch to the **bring-your-own-key Stripe** mode, which means:

1. You'll need to add your Stripe **secret key** as a project secret (I'll prompt you when ready — get it from your Stripe dashboard → Developers → API keys → "Reveal live secret key", starts with `sk_live_...`).
2. In your Stripe dashboard, enable **Connect** under Settings → Connect → Get started → choose **Express** accounts → Platform profile (the form asks what your platform does — same delivery marketplace description as before).
3. The webhook URL changes — I'll generate a new signing secret you'll paste in.

The customer checkout flow stays exactly as it works today; only the underlying connection changes.

## Build steps

1. **Pricing update** — update `src/lib/pricing.ts` and the new-delivery form to use $5.99 base / $1.50 mile / $3 per extra pickup. Show breakdown to customer at checkout.
2. **Database**
   - Add `stripe_connect_account_id`, `payouts_enabled`, `onboarding_completed_at` to `profiles`
   - Add `driver_payout_cents`, `platform_fee_cents`, `stripe_transfer_id`, `payout_status`, `additional_pickups` to `orders`
   - Add `driver_payouts` table for ledger/history
3. **Server functions** (TanStack `createServerFn`)
   - `createConnectAccount` — creates Stripe Express account for the driver
   - `createOnboardingLink` — returns Stripe-hosted onboarding URL
   - `refreshAccountStatus` — checks `payouts_enabled` after onboarding
   - `payoutDriver` — runs when order marked `delivered`: creates a Stripe Transfer (70% × fee + 100% × tip) to driver's connected account, writes to `driver_payouts`
4. **Webhook handler** — listen for `account.updated` (onboarding state changes) and update profile flags
5. **Driver UI**
   - New `/driver/earnings` page: onboarding banner if not complete, payout history, lifetime totals, "Open Stripe dashboard" link
   - Block "Accept" button with helpful banner if `payouts_enabled=false`
6. **Order completion flow** — when driver marks delivered, call `payoutDriver` automatically; show payout amount in success toast
7. **Admin dashboard** — column showing each driver's onboarding status + total paid out

## Technical notes

- BYOK Stripe SDK directly (not gateway): `import Stripe from "stripe"` with `process.env.STRIPE_SECRET_KEY`
- Charges stay as direct charges on the platform account; payouts use `stripe.transfers.create({ amount, currency, destination: driverConnectAccountId, transfer_group: orderId })` after funds settle (~2 business days)
- For instant testing in sandbox, use `stripe.transfers.create` immediately — sandbox doesn't enforce settlement delays
- Express accounts let Stripe handle KYC, tax forms (1099-NEC at year-end), and the driver-facing payout dashboard — minimal work for you
- Tips are pulled from `orders.tip_cents`, fees from `orders.price_cents`
- A delivered order with no `driver_payout_cents` becomes admin's TODO (e.g., driver hasn't onboarded yet) — manual retry button in admin

## What you'll need to do during build

- Paste your Stripe live secret key when prompted
- After I push the webhook code, copy the new webhook URL → add it in Stripe dashboard → Developers → Webhooks → paste the signing secret back to me
- Enable Connect Express in your Stripe dashboard (5-min form)

Ready to proceed? Reply "go" and I'll start with the pricing update + database schema, then prompt you for the Stripe secret key when I need it.
