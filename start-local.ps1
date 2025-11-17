# Start Local Development Environment
# This runs the full app (API + Frontend) locally

Write-Host "Starting Local Development Environment..." -ForegroundColor Cyan
Write-Host ""

# Switch to dev environment
Write-Host "1. Switching to DEV environment..." -ForegroundColor Yellow
Copy-Item api\local.settings.dev.json api\local.settings.json -Force
Write-Host "   OK Using local Cosmos DB Emulator" -ForegroundColor Green
Write-Host ""

# Check if Cosmos DB Emulator is running
Write-Host "2. Checking Cosmos DB Emulator..." -ForegroundColor Yellow
$cosmosProcess = Get-Process -Name "CosmosDB.Emulator" -ErrorAction SilentlyContinue
if ($cosmosProcess) {
    Write-Host "   OK Cosmos DB Emulator is running" -ForegroundColor Green
} else {
    Write-Host "   Starting Cosmos DB Emulator..." -ForegroundColor Yellow
    Start-Process "C:\Program Files\Azure Cosmos DB Emulator\CosmosDB.Emulator.exe"
    Write-Host "   Waiting 10 seconds for emulator to start..." -ForegroundColor Gray
    Start-Sleep -Seconds 10
}
Write-Host ""

# Start Azure Functions
Write-Host "3. Starting Azure Functions API..." -ForegroundColor Yellow
Write-Host "   API will run at: http://localhost:7071" -ForegroundColor Cyan
Write-Host ""

cd api
$funcPath = "C:\Program Files\Microsoft\Azure Functions Core Tools\func.exe"
$nodePath = "C:\Program Files\nodejs"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$env:PATH = '$nodePath;' + `$env:PATH; & '$funcPath' start"
cd ..

Write-Host "4. Waiting for API to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5
Write-Host ""

# Open the local HTML file in browser
Write-Host "5. Opening app in browser..." -ForegroundColor Yellow
$htmlPath = Join-Path $PWD "index.local.html"
Start-Process $htmlPath
Write-Host ""

Write-Host "OK Local development environment is ready!" -ForegroundColor Green
Write-Host ""
Write-Host "Resources:" -ForegroundColor White
Write-Host "   Frontend: $htmlPath" -ForegroundColor Gray
Write-Host "   API: http://localhost:7071/api" -ForegroundColor Gray
Write-Host "   Cosmos DB Explorer: https://localhost:8081/_explorer/index.html" -ForegroundColor Gray
Write-Host ""
Write-Host "Tips:" -ForegroundColor White
Write-Host "   - Frontend has orange banner showing LOCAL DEV MODE" -ForegroundColor Gray
Write-Host "   - All data is stored in local emulator (safe to test)" -ForegroundColor Gray
Write-Host "   - Close the API terminal window to stop the server" -ForegroundColor Gray
Write-Host ""
