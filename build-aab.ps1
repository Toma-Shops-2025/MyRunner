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

$KEYSTORE = "C:\Keys\myrunner.jks"
$KEY_ALIAS = "myrunner1"

if (-not (Test-Path $KEYSTORE)) {
  Write-Error "Keystore not found at $KEYSTORE. Generate it first with keytool (see README)."
}

Write-Host "==> Pulling latest code" -ForegroundColor Cyan
git pull

Write-Host "==> Installing deps" -ForegroundColor Cyan
bun install

Write-Host "==> Building web app" -ForegroundColor Cyan
bun run build

Write-Host "==> Regenerating Android icons + splash" -ForegroundColor Cyan
bunx capacitor-assets generate --android

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
$password = Read-Host "Keystore password" -AsSecureString
$plain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto(
  [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))

Push-Location android
try {
  .\gradlew.bat bundleRelease `
    "-Pandroid.injected.signing.store.file=$KEYSTORE" `
    "-Pandroid.injected.signing.store.password=$plain" `
    "-Pandroid.injected.signing.key.alias=$KEY_ALIAS" `
    "-Pandroid.injected.signing.key.password=$plain"
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
