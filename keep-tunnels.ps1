$ErrorActionPreference = "Continue"
$env:NODE_OPTIONS="--use-system-ca"

while ($true) {
    Write-Host "Starting Annapurna Aahaar frontend localtunnel..."
    cmd.exe /c "npx localtunnel --port 5173 --subdomain annapurna-aahaar-store"
    Start-Sleep -Seconds 3
}
