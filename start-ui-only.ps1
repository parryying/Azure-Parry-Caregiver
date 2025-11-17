# Start HTTP Server for UI
# This serves the local HTML/CSS/JS files

Write-Host "🌐 Starting UI Web Server..." -ForegroundColor Cyan
Write-Host "   Port: 8000" -ForegroundColor Gray
Write-Host "   URL: http://localhost:8000/index.local.html" -ForegroundColor Gray
Write-Host ""

# Ensure we're in the root directory
Set-Location "$PSScriptRoot"

# Add Node.js to PATH for this session
$env:Path = "C:\Program Files\nodejs;" + $env:Path

# Start HTTP server
npx http-server -p 8000 -c-1 --cors

# Keep window open if it exits
Write-Host ""
Write-Host "Server has stopped. Press any key to close..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
