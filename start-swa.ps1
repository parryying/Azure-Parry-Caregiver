# Start Complete Local Environment with Azure Static Web Apps CLI
# This emulates the EXACT Azure environment locally

Write-Host "Starting Azure Static Web Apps Local Emulator..." -ForegroundColor Cyan
Write-Host ""

# Switch to dev environment
Write-Host "1. Switching to DEV environment..." -ForegroundColor Yellow
Copy-Item api\local.settings.dev.json api\local.settings.json -Force
Write-Host "   OK Using local Cosmos DB Emulator" -ForegroundColor Green
Write-Host ""

# Check Cosmos DB Emulator
Write-Host "2. Checking Cosmos DB Emulator..." -ForegroundColor Yellow
$cosmosProcess = Get-Process -Name "CosmosDB.Emulator" -ErrorAction SilentlyContinue
if ($cosmosProcess) {
    Write-Host "   OK Cosmos DB Emulator is running" -ForegroundColor Green
} else {
    Write-Host "   Starting Cosmos DB Emulator..." -ForegroundColor Yellow
    Start-Process "C:\Program Files\Azure Cosmos DB Emulator\CosmosDB.Emulator.exe"
    Write-Host "   Waiting for emulator to start..." -ForegroundColor Gray
    Start-Sleep -Seconds 10
}
Write-Host ""

# Switch to Node.js 20.x for Azure Functions compatibility
Write-Host "3. Switching to Node.js 20.x..." -ForegroundColor Yellow
nvm use 20.18.1
Write-Host ""

# Start Static Web Apps CLI
Write-Host "4. Starting Azure Static Web Apps Emulator..." -ForegroundColor Yellow
Write-Host ""
Write-Host "   Frontend: http://localhost:4280" -ForegroundColor Cyan
Write-Host "   API: http://localhost:4280/api" -ForegroundColor Cyan
Write-Host ""
Write-Host "   This emulates the EXACT Azure environment!" -ForegroundColor Green
Write-Host "   Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

# Start SWA CLI (this will block and show output)
swa start . --api-location api --port 4280
