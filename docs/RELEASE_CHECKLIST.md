# MyRunner release checklist

## Web deploy (Netlify or Vercel)

1. Merge to `main`.
2. **Netlify:** Site → Deploys → **Clear cache and deploy** (or pay account + auto-deploy).
3. **Vercel:** [docs/VERCEL_SETUP.md](./VERCEL_SETUP.md) — import repo, env vars, custom domain.
4. Confirm [https://myrunner.shop/deploy.json](https://myrunner.shop/deploy.json) `commit` matches `main`.
5. Smoke-test: home, pricing, driver signup submit, login.

## Supabase

Your `driver_applications` schema is aligned when:

- `vehicle_type` → `text`, default `NULL`
- `background_check_status` → `text`, default `pending`
- `status` → `driver_status`, default `pending`

Re-run the audit in [SUPABASE_FIX_DRIVER_NA_ENUM.sql](./SUPABASE_FIX_DRIVER_NA_ENUM.sql) if driver submit fails.

## Android AAB — PowerShell (laptop)

From the repo folder, with JDK 17 and Android SDK installed:

```powershell
$env:ANDROID_KEYSTORE_PASSWORD = 'YOUR_STORE_PASSWORD'
$env:ANDROID_KEY_PASSWORD = 'YOUR_KEY_PASSWORD'   # omit if same as store
cd $env:USERPROFILE\Desktop\myrunner   # or your clone path
git pull origin main
.\build-aab.ps1
```

Keystore default: `C:\Keys\myrunner.jks`, alias `myrunner1`. See [ANDROID_AAB_CI.md](./ANDROID_AAB_CI.md).

## Android AAB — GitHub (phone only)

1. Repo → **Settings → Secrets → Actions** — four secrets from [ANDROID_AAB_CI.md](./ANDROID_AAB_CI.md).
2. GitHub mobile app → **Actions** → **Build Android AAB** → **Run workflow** → branch `main`.
3. When finished, download artifact **myrunner-aab-vc…** and upload in Play Console.

Pushes to `main` only run a placeholder job; **you must Run workflow** for a real AAB.