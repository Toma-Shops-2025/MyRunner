# MyRunner - Build signed APK for local testing
# Usage: cd Desktop\myrunner ; .\build-apk.ps1

$ProjectPath  = "$env:USERPROFILE\Desktop\myrunner"
$KeystorePath = "C:\Keys\myrunner.jks"
$KeyAlias     = "myrunner1"
$ApkPath      = "$ProjectPath\android\app\build\outputs\apk\release\app-release.apk"
$Password     = "Custom.247"

$ErrorActionPreference = "Stop"

function Step($msg) { Write-Host "`n==> $msg" -ForegroundColor Cyan }

Set-Location $ProjectPath

Step "Installing dependencies"
bun install

Step "Building web app"
bun run build
if ($LASTEXITCODE -ne 0) { throw "Web build failed" }

Step "Regenerating Android launcher icon + splash from resources/"
bun run assets:generate
if ($LASTEXITCODE -ne 0) { throw "Asset generation failed" }

Step "Syncing Capacitor Android"
bunx cap sync android

Step "Building signed release APK"
Set-Location "$ProjectPath\android"
& .\gradlew.bat assembleRelease `
  "-Pandroid.injected.signing.store.file=$KeystorePath" `
  "-Pandroid.injected.signing.store.password=$Password" `
  "-Pandroid.injected.signing.key.alias=$KeyAlias" `
  "-Pandroid.injected.signing.key.password=$Password"
$gradleExit = $LASTEXITCODE
Set-Location $ProjectPath

if ($gradleExit -eq 0 -and (Test-Path $ApkPath)) {
  Write-Host "`n  SUCCESS! APK Ready: $ApkPath" -ForegroundColor Green
  Start-Process explorer.exe "/select,`"$ApkPath`""
} else {
  Write-Error "APK not found at $ApkPath"
}
