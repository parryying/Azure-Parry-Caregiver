# Switch to Production Environment (Azure Cosmos DB)
Write-Host "Switching to PRODUCTION environment..." -ForegroundColor Yellow
Copy-Item api\local.settings.prod.json api\local.settings.json -Force
Write-Host "✅ Now using AZURE Cosmos DB (Production)" -ForegroundColor Green
Write-Host ""
Write-Host "Database: caregiver-cosmos-db.documents.azure.com" -ForegroundColor Cyan
Write-Host "Website: https://icy-cliff-0c6f68710.3.azurestaticapps.net" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  WARNING: Tests will modify PRODUCTION data!" -ForegroundColor Red
Write-Host ""
Write-Host "To test:" -ForegroundColor White
Write-Host '  cd api' -ForegroundColor Gray
Write-Host '  & "C:\Program Files\nodejs\node.exe" test.js' -ForegroundColor Gray
