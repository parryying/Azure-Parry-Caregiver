# Dev/Stage/Prod Environment Setup - Complete! 🎉

## ✅ What's Now Available

### 1. **Development Environment** (Local)
- **Cosmos DB:** Local Emulator (https://localhost:8081)
- **Data:** Completely isolated from production
- **Cost:** FREE - No Azure charges
- **Status:** ✅ Ready to use

### 2. **Production Environment** (Azure Cloud)
- **Cosmos DB:** caregiver-cosmos-db.documents.azure.com
- **Website:** https://icy-cliff-0c6f68710.3.azurestaticapps.net
- **Data:** Real production data
- **Status:** ✅ Active

### 3. **Staging Environment** (Not yet created)
- Would require separate Azure resources
- Can be added later if needed

---

## 🚀 Quick Start Guide

### Switch to Development (Local Testing)
```powershell
.\switch-to-dev.ps1
```

### Switch to Production
```powershell
.\switch-to-prod.ps1
```

---

## 📝 Common Workflows

### Testing Locally (Safe - No Production Impact)

1. **Switch to dev environment:**
   ```powershell
   .\switch-to-dev.ps1
   ```

2. **Run tests:**
   ```powershell
   cd api
   & "C:\Program Files\nodejs\node.exe" test.js
   & "C:\Program Files\nodejs\node.exe" test-clockin.js amy
   ```

3. **View data in Cosmos DB Explorer:**
   - Open: https://localhost:8081/_explorer/index.html
   - Navigate to: CaregiverDB → Shifts/Settings → Items

### Deploying to Production

1. **Make changes to code**

2. **Test locally first:**
   ```powershell
   .\switch-to-dev.ps1
   cd api
   & "C:\Program Files\nodejs\node.exe" test.js
   ```

3. **When ready, deploy:**
   ```powershell
   git add .
   git commit -m "Your change description"
   git push
   ```

4. **Wait 2-3 minutes** for GitHub Actions deployment

---

## 📁 Environment Files

| File | Purpose | Tracked in Git? |
|------|---------|----------------|
| `local.settings.json` | **Active config** - changes based on environment | ❌ No (gitignored) |
| `local.settings.dev.json` | Dev template (local emulator) | ❌ No (gitignored) |
| `local.settings.prod.json` | Prod template (Azure Cosmos) | ❌ No (gitignored) |

---

## 🛠️ Available Test Scripts

All scripts work in both dev and prod environments:

```powershell
cd api

# View dashboard
& "C:\Program Files\nodejs\node.exe" test.js

# Clock in
& "C:\Program Files\nodejs\node.exe" test-clockin.js amy
& "C:\Program Files\nodejs\node.exe" test-clockin.js linda

# Clock out (use shift ID from clock in)
& "C:\Program Files\nodejs\node.exe" test-clockout.js shift_1763266309119 2025-11

# Edit shift
& "C:\Program Files\nodejs\node.exe" test-edit.js shift_1763266309119 "2025-11-15T08:00:00" "2025-11-15T16:00:00"

# Delete shift
& "C:\Program Files\nodejs\node.exe" test-delete.js shift_1763266309119 2025-11
```

---

##  Benefits of This Setup

✅ **Safe Testing:** Test features locally without affecting production data  
✅ **Cost Efficient:** Local emulator is free, no Azure charges during development  
✅ **Fast Iteration:** No deployment wait times when testing  
✅ **Easy Switching:** One command to switch between environments  
✅ **Isolated Data:** Dev and prod databases are completely separate  

---

## 🔧 Cosmos DB Emulator Details

- **Endpoint:** https://localhost:8081
- **Key:** (Fixed emulator key - already configured)
- **Explorer UI:** https://localhost:8081/_explorer/index.html
- **Start:** Auto-starts with Windows (or manually from Start Menu)
- **Reset Data:** Stop emulator → Delete data folder to start fresh

---

## ⚠️ Important Notes

1. **Local settings files are NOT in Git** - They contain credentials
2. **Always test in dev first** before pushing to production
3. **Production tests modify real data** - Be careful!
4. **Emulator SSL certificate** - Now handled automatically (SSL verification disabled for localhost)

---

## 🎯 Next Steps

You're all set! Try this:

1. Make sure you're in dev mode:
   ```powershell
   .\switch-to-dev.ps1
   ```

2. Test creating a shift:
   ```powershell
   cd api
   & "C:\Program Files\nodejs\node.exe" test-clockin.js amy
   ```

3. View it in the emulator:
   - Open https://localhost:8081/_explorer/index.html
   - Navigate to CaregiverDB → Shifts → Items

4. When satisfied, switch to prod and deploy:
   ```powershell
   .\switch-to-prod.ps1
   git add .
   git commit -m "Your changes"
   git push
   ```

---

## 🆘 Troubleshooting

**Emulator not responding?**
- Check if it's running: Task Manager → Azure Cosmos DB Emulator
- Start manually: Start Menu → Azure Cosmos DB Emulator

**Certificate errors?**
- Should be fixed now with SSL verification disabled
- If issues persist, restart the emulator

**Wrong environment?**
- Check: `Get-Content api\local.settings.json | Select-String COSMOS_ENDPOINT`
- Should show `localhost:8081` for dev, `caregiver-cosmos-db` for prod

---

**Your complete dev/stage/prod environment is ready! 🚀**
