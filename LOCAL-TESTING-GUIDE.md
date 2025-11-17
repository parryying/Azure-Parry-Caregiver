# Quick Start: Local Testing with Azure Static Web Apps CLI

## One-Time Setup (Do This Once)

### Step 1: Close and Reopen PowerShell
Close this terminal window and open a NEW PowerShell terminal.

### Step 2: Run Node.js 20.x Setup
```powershell
cd C:\Parry\Vibecoding\Azure
.\setup-node20.ps1
```

This will:
- Install Node.js 20.18.1 LTS
- Switch to Node 20.x
- Verify the installation

---

## Daily Usage: Start Local Environment

Open PowerShell and run:

```powershell
cd C:\Parry\Vibecoding\Azure
.\start-swa.ps1
```

This will:
1. Switch to dev environment (local Cosmos DB Emulator)
2. Check/start Cosmos DB Emulator
3. Switch to Node.js 20.x
4. Start Azure Static Web Apps emulator

Then open your browser to: **http://localhost:4280**

---

## Testing Workflow

### Test Locally (Safe - No Production Impact)
1. Run `.\start-swa.ps1`
2. Open http://localhost:4280
3. Test all features (clock in/out, edit, delete, reports, CSV export)
4. Data goes to local Cosmos DB Emulator only

### Deploy to Production
When satisfied with local testing:
```powershell
git add .
git commit -m "Your changes"
git push
```

Wait 2-3 minutes, then check: https://icy-cliff-0c6f68710.3.azurestaticapps.net

---

## Switching Node.js Versions

### For Azure Functions / SWA (Use Node 20.x)
```powershell
nvm use 20.18.1
```

### For Other Projects (Use Node 24.x)
```powershell
nvm use 24.11.1
```

### Check Current Version
```powershell
node --version
```

---

## Troubleshooting

**"nvm command not found"**
- Close ALL PowerShell windows
- Open a NEW PowerShell window
- NVM requires a terminal restart after installation

**"Node version incompatible"**
- Make sure you ran `nvm use 20.18.1` first
- Check with `node --version` (should show v20.x)

**"Port 4280 already in use"**
- Stop the previous SWA instance (Ctrl+C)
- Or use a different port: `swa start . --api-location api --port 4281`

**Cosmos DB Emulator not running**
- Check Start Menu → Azure Cosmos DB Emulator
- Or the script will auto-start it

---

## Environment Files

| What You're Testing | Environment | Command |
|---------------------|-------------|---------|
| Local (Safe) | Dev with Emulator | `.\start-swa.ps1` |
| Production (Live) | Azure Cloud | Visit https://icy-cliff-0c6f68710.3.azurestaticapps.net |

---

## Summary

**Setup once:**
1. Close terminal
2. Open new terminal
3. Run `.\setup-node20.ps1`

**Use daily:**
1. Run `.\start-swa.ps1`
2. Open http://localhost:4280
3. Test your app!

**Deploy:**
```powershell
git add .
git commit -m "..."
git push
```

That's it! 🎉
