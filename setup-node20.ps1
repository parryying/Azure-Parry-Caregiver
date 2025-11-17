# Setup Node.js 20.x for Azure Functions
# Run this script in a NEW terminal window after installing nvm

Write-Host "Node.js 20.x Setup for Azure Functions" -ForegroundColor Cyan
Write-Host ""

# Step 1: Install Node.js 20
Write-Host "1. Installing Node.js 20.x LTS..." -ForegroundColor Yellow
nvm install 20.18.1
Write-Host ""

# Step 2: Use Node.js 20
Write-Host "2. Switching to Node.js 20.x..." -ForegroundColor Yellow
nvm use 20.18.1
Write-Host ""

# Step 3: Verify
Write-Host "3. Verifying Node.js version..." -ForegroundColor Yellow
node --version
Write-Host ""

Write-Host "OK Node.js 20.x is now active!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor White
Write-Host "  Run: .\start-swa.ps1" -ForegroundColor Cyan
Write-Host ""
Write-Host "To switch back to Node 24.x later:" -ForegroundColor Gray
Write-Host "  nvm use 24.11.1" -ForegroundColor Gray
Write-Host ""
