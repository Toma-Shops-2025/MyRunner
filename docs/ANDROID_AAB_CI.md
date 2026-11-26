# Build a signed AAB from your phone (GitHub Actions)

Use this when you are away from your laptop. The app still loads **https://myrunner.shop** in the WebView; this workflow only rebuilds the native Android shell and bumps **versionCode** for Play Console.

## One-time setup (on your laptop)

### 1. Add repository secrets

In GitHub: **MyRunner → Settings → Secrets and variables → Actions → New repository secret**

| Secret | Value |
|--------|--------|
| `ANDROID_KEYSTORE_BASE64` | Base64 of `C:\Keys\myrunner.jks` (see PowerShell below) |
| `ANDROID_KEYSTORE_PASSWORD` | Keystore password |
| `ANDROID_KEY_ALIAS` | `myrunner1` |
| `ANDROID_KEY_PASSWORD` | Key password (same as keystore if you used one password) |

Encode the keystore on Windows (PowerShell):

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("C:\Keys\myrunner.jks")) | Set-Clipboard
```

Paste the clipboard into the `ANDROID_KEYSTORE_BASE64` secret (one long line, no spaces).

### 2. Confirm Actions are enabled

**Settings → Actions → General** — allow workflows for this repository.

## Build from your phone

1. Install the **GitHub** app and sign in.
2. Open **Toma-Shops-2025/MyRunner** → **Actions**.
3. Tap **Build Android AAB** → **Run workflow**.
4. Branch: **`main`** (default).
5. Leave **Bump versionCode** and **Commit version bump** on unless you know you already bumped locally.
6. When the run is green, open the run → **Artifacts** → download **myrunner-aab-vc…**.
7. Upload the `.aab` in **Play Console** (browser or Play Console app; use “Open with” / Files if the artifact is a zip on Android).

## Local build (laptop)

Still supported via `.\build-aab.ps1` after setting:

```powershell
$env:ANDROID_KEYSTORE_PATH = "C:\Keys\myrunner.jks"
$env:ANDROID_KEYSTORE_PASSWORD = "your-password"
$env:ANDROID_KEY_ALIAS = "myrunner1"
$env:ANDROID_KEY_PASSWORD = "your-password"
```

Do not commit passwords. Prefer GitHub Secrets for CI.

## Notes

- Each Play upload needs a **higher versionCode** than the last release. CI bumps by 1 by default and can push that change to `main`.
- If you build on the laptop and CI on the same day, pull `main` first so you do not reuse a versionCode.
- Artifacts are kept **90 days** on GitHub.