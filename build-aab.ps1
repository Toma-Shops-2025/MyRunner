# MyRunner — Signed AAB build script (PowerShell)
# Same flow as AlgoRhythm / ViralSnap.
#
# Prereqs (one time):
#   - Node 20 LTS + Bun installed
#   - JDK 17 installed and JAVA_HOME set
#   - Android Studio installed (so the Android SDK exists)
#   - You have already run, ONCE, from this folder:
#       bunx cap add android
#       bunx cap sync android
#   - You have generated a keystore at C:\Keys\myrunner.jks (alias: myrunner1)
#
# Usage:
#   cd $env:USERPROFILE\Desktop\myrunner
#   .\build-aab.ps1

$ErrorActionPreference = "Stop"

$KEYSTORE = if ($env:ANDROID_KEYSTORE_PATH) { $env:ANDROID_KEYSTORE_PATH } else { "C:\Keys\myrunner.jks" }
$KEY_ALIAS = if ($env:ANDROID_KEY_ALIAS) { $env:ANDROID_KEY_ALIAS } else { "myrunner1" }
$Password = $env:ANDROID_KEYSTORE_PASSWORD
if (-not $Password) { $Password = $env:ANDROID_KEY_PASSWORD }

if (-not (Test-Path $KEYSTORE)) {
  Write-Error "Keystore not found at $KEYSTORE. Set ANDROID_KEYSTORE_PATH or generate the keystore (see docs/ANDROID_AAB_CI.md)."
}
if (-not $Password) {
  Write-Error "Set ANDROID_KEYSTORE_PASSWORD (and ANDROID_KEY_PASSWORD if different) before building. See docs/ANDROID_AAB_CI.md."
}

Write-Host "==> Pulling latest code" -ForegroundColor Cyan
git pull

Write-Host "==> Installing deps" -ForegroundColor Cyan
bun install

Write-Host "==> Building web app" -ForegroundColor Cyan
bun run build

Write-Host "==> Regenerating Android icons + splash from resources/" -ForegroundColor Cyan
bun run assets:generate
if ($LASTEXITCODE -ne 0) { throw "Asset generation failed" }

Write-Host "==> Syncing Capacitor" -ForegroundColor Cyan
bunx cap sync android

# Bump versionCode in android/app/build.gradle
$gradle = "android/app/build.gradle"
$content = Get-Content $gradle -Raw
if ($content -match "versionCode (\d+)") {
  $current = [int]$Matches[1]
  $next = $current + 1
  $content = $content -replace "versionCode \d+", "versionCode $next"
  Set-Content $gradle $content
  Write-Host "==> Bumped versionCode: $current -> $next" -ForegroundColor Green
}

Write-Host "==> Building signed release AAB" -ForegroundColor Cyan

Push-Location android
try {
  .\gradlew.bat bundleRelease `
    "-Pandroid.injected.signing.store.file=$KEYSTORE" `
    "-Pandroid.injected.signing.store.password=$Password" `
    "-Pandroid.injected.signing.key.alias=$KEY_ALIAS" `
    "-Pandroid.injected.signing.key.password=$Password"
} finally {
  Pop-Location
}

$aab = "android\app\build\outputs\bundle\release\app-release.aab"
if (Test-Path $aab) {
  Write-Host "`n✅ DONE: $aab" -ForegroundColor Green
  explorer.exe "/select,$((Resolve-Path $aab).Path)"
} else {
  Write-Error "Build finished but AAB not found at $aab"
}
