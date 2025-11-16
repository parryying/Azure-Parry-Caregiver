# Environment Configuration Guide

## Environments

### 1. Development (Local with Emulator)
- **Cosmos DB:** Local emulator (https://localhost:8081)
- **API:** Local Azure Functions (http://localhost:7071)
- **Frontend:** Local file or dev server

### 2. Staging (Azure Cloud - Coming Soon)
- **Cosmos DB:** Separate Azure Cosmos DB staging account
- **API:** Separate Azure Static Web App for staging
- **Frontend:** Staging URL

### 3. Production (Azure Cloud - Current)
- **Cosmos DB:** caregiver-cosmos-db.documents.azure.com
- **API:** Azure Static Web App Functions
- **Frontend:** https://icy-cliff-0c6f68710.3.azurestaticapps.net

## Setup Instructions

### Local Development Environment

1. **Start Cosmos DB Emulator:**
   ```powershell
   # The emulator should auto-start after installation
   # Or manually: Start Menu → Azure Cosmos DB Emulator
   # Access at: https://localhost:8081/_explorer/index.html
   ```

2. **Create Local Database:**
   - Open https://localhost:8081/_explorer/index.html
   - Create database: `CaregiverDB`
   - Create containers:
     - `Shifts` with partition key `/month`
     - `Settings` with partition key `/id`

3. **Switch to Dev Config:**
   ```powershell
   cd api
   Copy-Item local.settings.dev.json local.settings.json
   ```

4. **Start Local Functions:**
   ```powershell
   # If func is in PATH:
   func start
   
   # Or use full path (if available):
   & "C:\Program Files\Microsoft\Azure Functions Core Tools\func.exe" start
   ```

5. **Update Frontend for Local Testing:**
   Edit `api-client.js` to use:
   ```javascript
   const API_BASE = 'http://localhost:7071/api';
   ```

### Switch Between Environments

**To Dev (Local Emulator):**
```powershell
cd api
Copy-Item local.settings.dev.json local.settings.json -Force
```

**To Prod (Azure Cloud):**
```powershell
cd api
Copy-Item local.settings.prod.json local.settings.json -Force
```

### Run Local Tests

**Test Dashboard:**
```powershell
& "C:\Program Files\nodejs\node.exe" api/test.js
```

**Test Clock In:**
```powershell
& "C:\Program Files\nodejs\node.exe" api/test-clockin.js amy
```

**Test Clock Out:**
```powershell
& "C:\Program Files\nodejs\node.exe" api/test-clockout.js shift_xxx 2025-11
```

**Test Edit:**
```powershell
& "C:\Program Files\nodejs\node.exe" api/test-edit.js shift_xxx "2025-11-15T08:00:00" "2025-11-15T16:00:00"
```

**Test Delete:**
```powershell
& "C:\Program Files\nodejs\node.exe" api/test-delete.js shift_xxx 2025-11
```

## Cosmos DB Emulator Notes

- **Default Endpoint:** https://localhost:8081
- **Default Key:** C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==
- **Explorer UI:** https://localhost:8081/_explorer/index.html
- **Certificate:** First run requires accepting self-signed certificate
- **Data:** Stored locally, separate from Azure production data
- **Reset:** Stop emulator, delete data folder to start fresh

## Future: Azure Staging Environment

To create a staging environment in Azure:

1. Create new Static Web App (e.g., "caregiver-staging")
2. Create new Cosmos DB account (e.g., "caregiver-cosmos-staging")
3. Update GitHub Actions workflow with staging slot
4. Use environment-specific secrets in GitHub

## Security Notes

- ✅ `local.settings.json` is gitignored
- ✅ `local.settings.*.json` files are gitignored
- ⚠️ Never commit Azure production credentials to Git
- ✅ Use environment variables in Azure Static Web Apps Configuration
