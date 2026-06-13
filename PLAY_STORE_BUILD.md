# MyRunner – Google Play Store Build (PowerShell + Bubblewrap TWA)

This wraps the published PWA at **https://myrunner.shop** as a Trusted Web Activity
(TWA) Android app you can upload to the Play Console. Same flow you used for
ViralSnap and Algorhythm.

---

## 0. One-time machine setup (PowerShell, run as Administrator)

```powershell
# Node 20 LTS (skip if already installed)
winget install OpenJS.NodeJS.LTS

# JDK 17 (Bubblewrap requires JDK 17)
winget install EclipseAdoptium.Temurin.17.JDK

# Install Bubblewrap CLI globally
npm install -g @bubblewrap/cli

# Verify
node -v
java -version
bubblewrap --version
```

When prompted by Bubblewrap on first run, let it download the Android SDK
and command-line tools into `%USERPROFILE%\.bubblewrap`.

---

## 1. Create the project folder

```powershell
cd $HOME\Desktop
mkdir myrunner-android
cd myrunner-android
```

---

## 2. Initialize from the live manifest

```powershell
bubblewrap init --manifest="https://myrunner.shop/manifest.webmanifest"
```

When it asks, use these values (press Enter to accept anything not listed):

| Prompt | Answer |
|---|---|
| Domain | `myrunner.shop` |
| Application name | `MyRunner` |
| Short name | `MyRunner` |
| Application ID (package) | `shop.myrunner.app` |
| Display mode | `standalone` |
| Orientation | `portrait` |
| Theme color | `#f5c542` |
| Background color | `#0a0a0a` |
| Start URL | `/` |
| Icon URL | `https://myrunner.shop/icon-512.png` |
| Include shortcuts? | `No` |
| Signing key path | (accept default `./android.keystore`) |
| Key alias | `android` |
| Password | **pick a strong one and save it in a password manager** |

> Save the keystore file (`android.keystore`) **and** the password. If you lose
> either, you can never publish updates under the same listing.

---

## 3. Build the release bundle

```powershell
bubblewrap build
```

Outputs in the project folder:

- `app-release-bundle.aab` ← upload this to Play Console
- `app-release-signed.apk` ← for local install / testing
- `assetlinks.json` ← needed for the next step

---

## 4. Verify Digital Asset Links (removes the URL bar)

Bubblewrap prints the SHA-256 fingerprint and writes `assetlinks.json` in
the project folder. You need to host it at:

```
https://myrunner.shop/.well-known/assetlinks.json
```

Easiest way: ask me to add it to the project. Paste the contents of the
generated `assetlinks.json` into chat and I'll commit it to
`public/.well-known/assetlinks.json` and republish. Without this file, the
app will open with a browser-style address bar on top.

Verify after deploy:

```powershell
curl https://myrunner.shop/.well-known/assetlinks.json
```

---

## 5. Test on a device (optional but recommended)

```powershell
# With a phone plugged in and USB debugging on:
bubblewrap install
```

Or sideload manually:

```powershell
adb install app-release-signed.apk
```

---

## 6. Upload to Google Play

1. Go to https://play.google.com/console → **Create app**.
2. App name: **MyRunner**, default language English (US), App, Free.
3. **Release → Production → Create new release**.
4. Upload `app-release-bundle.aab`.
5. Fill in store listing (short + full description, screenshots, 512×512 icon,
   1024×500 feature graphic), Data Safety form, Content rating, Target audience.
6. Submit for review.

---

## 7. Updating the app later

Whenever you change anything in Lovable:

- Frontend changes — just **Publish** in Lovable; the TWA reloads them automatically.
- Only rebuild the `.aab` when you change app metadata (name, icon, package id,
  permissions). To bump the Play version:

```powershell
cd $HOME\Desktop\myrunner-android
bubblewrap update          # pulls latest manifest values
bubblewrap build           # produces a new app-release-bundle.aab
```

Then upload the new `.aab` as a new release in Play Console.

---

## Troubleshooting

- **"JAVA_HOME is not set"** → `setx JAVA_HOME "C:\Program Files\Eclipse Adoptium\jdk-17.x.x-hotspot"` then open a fresh PowerShell.
- **Build fails on first run** → run `bubblewrap doctor` and follow its hints.
- **App shows a URL bar** → assetlinks.json is missing, wrong package name, or wrong fingerprint. Re-run `bubblewrap fingerprint` and replace the file.
