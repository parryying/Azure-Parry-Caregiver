# Start Azure Functions API Manually
# Run this if start-local.ps1 doesn't work

Write-Host "Starting Azure Functions API..." -ForegroundColor Cyan

# Add Node.js to PATH for this session
$env:PATH = "C:\Program Files\nodejs;" + $env:PATH

# Navigate to api folder
Set-Location "C:\Parry\Vibecoding\Azure\api"

# Start Functions
Write-Host "Starting on http://localhost:7071" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

& "C:\Program Files\Microsoft\Azure Functions Core Tools\func.exe" start
