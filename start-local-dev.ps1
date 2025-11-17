# Start Complete Local Development Environment
# This script starts all components needed for local development

Write-Host "🚀 Starting Local Development Environment..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Switch to dev environment
Write-Host "1️⃣ Configuring local Cosmos DB Emulator..." -ForegroundColor Yellow
& "$PSScriptRoot\switch-to-dev.ps1"
Write-Host ""

# Step 2: Start Azure Functions API
Write-Host "2️⃣ Starting Azure Functions API on port 7071..." -ForegroundColor Yellow
Start-Process cmd -ArgumentList "/c", "$PSScriptRoot\start-api.cmd"
Write-Host "   ✅ API starting in new window..." -ForegroundColor Green
Start-Sleep -Seconds 8

# Step 3: Start HTTP Server for UI
Write-Host "3️⃣ Starting HTTP Server on port 8000..." -ForegroundColor Yellow
Start-Process cmd -ArgumentList "/c", "$PSScriptRoot\start-ui.cmd"
Write-Host "   ✅ UI Server starting in new window..." -ForegroundColor Green
Start-Sleep -Seconds 3

# Summary
Write-Host ""
Write-Host "✅ LOCAL DEVELOPMENT ENVIRONMENT READY!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Your local app is available at:" -ForegroundColor Cyan
Write-Host "   🌐 UI:  http://localhost:8000/index.local.html" -ForegroundColor White
Write-Host "   🔧 API: http://localhost:7071/api" -ForegroundColor White
Write-Host "   💾 DB:  https://localhost:8081/_explorer/index.html" -ForegroundColor White
Write-Host ""
Write-Host "💡 Tips:" -ForegroundColor Yellow
Write-Host "   - The UI has a red banner showing 'LOCAL DEV MODE'" -ForegroundColor Gray
Write-Host "   - All data is stored in Cosmos DB Emulator (safe to test)" -ForegroundColor Gray
Write-Host "   - Close the PowerShell windows to stop the servers" -ForegroundColor Gray
Write-Host ""
