# Start Azure Functions API Locally
# This keeps the terminal open and running

Write-Host "🔧 Starting Azure Functions API..." -ForegroundColor Cyan
Write-Host "   Port: 7071" -ForegroundColor Gray
Write-Host "   Database: Cosmos DB Emulator (localhost:8081)" -ForegroundColor Gray
Write-Host ""
Write-Host "⚠️  IMPORTANT: Keep this window open!" -ForegroundColor Yellow
Write-Host "   Closing this window will stop the API." -ForegroundColor Gray
Write-Host ""

# Add Node.js to PATH for this session
$env:Path = "C:\Program Files\nodejs;" + $env:Path

# Change to api directory
Set-Location "$PSScriptRoot\api"

# Start Azure Functions (this blocks until stopped)
& "C:\Program Files\Microsoft\Azure Functions Core Tools\func.exe" start --port 7071

# If func exits, show message
Write-Host ""
Write-Host "❌ API has stopped!" -ForegroundColor Red
Write-Host "Press any key to close this window..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
