# Switch to Development Environment (Local Cosmos DB Emulator)
Write-Host "Switching to DEVELOPMENT environment..." -ForegroundColor Yellow
Copy-Item api\local.settings.dev.json api\local.settings.json -Force
Write-Host "✅ Now using LOCAL Cosmos DB Emulator" -ForegroundColor Green
Write-Host ""
Write-Host "Database: https://localhost:8081" -ForegroundColor Cyan
Write-Host "Explorer: https://localhost:8081/_explorer/index.html" -ForegroundColor Cyan
Write-Host ""
Write-Host "To test:" -ForegroundColor White
Write-Host '  cd api' -ForegroundColor Gray
Write-Host '  & "C:\Program Files\nodejs\node.exe" test.js' -ForegroundColor Gray
