# Deploy MyRunner on Vercel (free Hobby tier)

Use this when Netlify is unavailable. **You do not need Netlify** to recover environment variables — each value comes from the service that issued it (or from this repo where noted).

## 1. Import the repo

1. Sign up at [vercel.com](https://vercel.com) with **GitHub**.
2. **Add New Project** → import **Toma-Shops-2025/MyRunner**.
3. Framework: **TanStack Start** (auto-detected). Root: repository root.
4. Build command (from `vercel.json`): `node scripts/write-deploy-meta.mjs && npm run build`
5. **Do not** set a custom output directory — Nitro writes `.vercel/output` automatically.

## 2. Environment variables (Production)

In **Project → Settings → Environment Variables**, add each name below for **Production** (and Preview if you want branch deploys). Use `.env.example` as a checklist.

| Variable | Required | Where to get it (not Netlify) |
|----------|----------|-------------------------------|
| `SUPABASE_URL` | Yes | [Supabase](https://supabase.com/dashboard) → your project → **Settings → API** → Project URL |
| `SUPABASE_PUBLISHABLE_KEY` | Yes | Same page → **anon public** key (often `eyJ...`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Same page → **service_role** (secret; server only) |
| `VITE_SUPABASE_URL` | Yes | Same as `SUPABASE_URL` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Yes | Same as `SUPABASE_PUBLISHABLE_KEY` |
| `PUBLIC_APP_URL` | Yes | `https://myrunner.shop` (or your `*.vercel.app` URL until DNS moves) |
| `STRIPE_ENV` | Yes | `live` for production shop (use `sandbox` only for test) |
| `VITE_PAYMENTS_CLIENT_TOKEN` | Yes | [Stripe Dashboard](https://dashboard.stripe.com/apikeys) → **Publishable key** (`pk_live_...`). Also in repo `.env.production` for the live publishable key used in builds. |
| `STRIPE_LIVE_API_KEY` | Yes | Stripe → **Secret key** `sk_live_...` |
| `STRIPE_SANDBOX_API_KEY` | If testing | Stripe test mode secret `sk_test_...` |
| `PAYMENTS_LIVE_WEBHOOK_SECRET` | Yes for webhooks | Stripe → **Developers → Webhooks** → your endpoint → **Signing secret** (create endpoint after Vercel URL is known) |
| `PAYMENTS_SANDBOX_WEBHOOK_SECRET` | Optional | Test webhook signing secret |
| `MAPBOX_PUBLIC_TOKEN` | For maps | [Mapbox](https://account.mapbox.com/) → Access tokens → public token |
| `GEMINI_API_KEY` | Optional | [Google AI Studio](https://aistudio.google.com/apikey) — support chat AI |
| `CHECKR_API_KEY` | Optional | Checkr dashboard API key |
| `CHECKR_PACKAGE_SLUG` | Optional | Checkr package slug for invitations |
| `CHECKR_WEBHOOK_SECRET` | Optional | Checkr webhook signing secret |
| `DISPATCH_CRON_SECRET` | Optional | Any long random string you choose (protects `/api/public/hooks/dispatch-tick`) |

**Vite client vars:** `VITE_*` names must be set in Vercel so they are embedded at **build** time. After changing them, **redeploy**.

## 3. First deploy (before DNS)

1. Deploy once with variables filled in.
2. Open `https://YOUR-PROJECT.vercel.app/deploy.json` — `commit` should match `main`.
3. Test **driver signup** on the Vercel URL. If that works, move DNS.

## 4. Point `myrunner.shop` at Vercel

At your **domain registrar** (where you bought `myrunner.shop`), remove Netlify DNS if needed, then add what Vercel shows under **Project → Settings → Domains**:

- Usually an **A** record to Vercel’s IP and/or **CNAME** `cname.vercel-dns.com` for `www`.

Wait for DNS propagation (minutes to hours). The Android app can keep using `https://myrunner.shop` with no Play Store update.

## 5. Update external callbacks

After the public URL is final:

| Service | What to update |
|---------|----------------|
| **Supabase** | **Authentication → URL configuration** — Site URL `https://myrunner.shop`, Redirect URLs include `https://myrunner.shop/auth/callback` and `https://*.vercel.app/auth/callback` |
| **Stripe** | Webhook endpoint `https://myrunner.shop/api/public/payments/webhook` → copy new signing secret into `PAYMENTS_LIVE_WEBHOOK_SECRET` → redeploy |
| **Checkr** | Webhook URL if used |

## 6. Returning to Netlify later

Set `NITRO_PRESET=netlify` in Netlify build environment and restore `vite.config` default or pass env in `netlify.toml`. This repo keeps `netlify.toml` for that path.