# Phase 2 Setup Guide - Azure Cosmos DB Configuration

## Step 1: Create Cosmos DB Account

1. **Go to Azure Portal:** https://portal.azure.com
2. Click **"Create a resource"**
3. Search for **"Azure Cosmos DB"** and select it
4. Click **"Create"**

### Select API:
- Choose **"Azure Cosmos DB for NoSQL"**
- Click **"Create"**

### Basic Settings:
- **Subscription:** Your subscription
- **Resource Group:** Use existing `caregiver-rg` (or create new)
- **Account Name:** `caregiver-cosmos-db` (must be globally unique - try adding your initials)
- **Location:** Same as your Static Web App (e.g., West US 2)
- **Capacity mode:** **Serverless** ✅ (pay per request, no minimum cost)
- **Apply Free Tier Discount:** **Yes** ✅ (if available)

### Global Distribution:
- **Geo-Redundancy:** Disable (not needed for personal use)
- **Multi-region Writes:** Disable

### Networking:
- **Connectivity method:** All networks (or Public endpoint if you want to restrict)

### Backup Policy:
- **Periodic** (default is fine)

Click **"Review + Create"** → **"Create"**

⏳ Wait 2-3 minutes for deployment to complete.

---

## Step 2: Create Database and Containers

Once deployment finishes:

1. Click **"Go to resource"**
2. In the left menu, click **"Data Explorer"**

### Create First Container (Creates Database Too):
3. Click **"New Container"** at the top
   - **Database id:** Create new → `CaregiverDB`
   - **Container id:** `Shifts`
   - **Partition key:** `/month` (organizes by month for fast queries)
   - Click **"OK"**

### Create Second Container:
4. Click **"New Container"** again
   - **Database id:** Use existing → `CaregiverDB` (select from dropdown)
   - **Container id:** `Settings`
   - **Partition key:** `/id` (one setting per caregiver)
   - Click **"OK"**

✅ **You should now see:** CaregiverDB database with two containers (Shifts and Settings)

---

## Step 3: Get Connection Credentials

1. In the left menu, click **"Keys"**
2. **Copy these values** (you'll need them next):
   - **URI** (e.g., `https://caregiver-cosmos-db.documents.azure.com:443/`)
   - **PRIMARY KEY** (long string of characters)

---

## Step 4: Configure Static Web App

1. Go to your **Static Web App** resource in Azure Portal
2. In the left menu, click **"Configuration"**
3. Click **"+ Add"** to add application settings:

### Add First Setting:
   - **Name:** `COSMOS_ENDPOINT`
   - **Value:** Paste the **URI** you copied
   - Click **"OK"**

### Add Second Setting:
4. Click **"+ Add"** again
   - **Name:** `COSMOS_KEY`
   - **Value:** Paste the **PRIMARY KEY** you copied
   - Click **"OK"**

5. Click **"Save"** at the top

---

## Step 5: Verify Setup (After Deployment)

Once we push the Phase 2 code:

1. **Open your website** (it will take 2-3 minutes to deploy)
2. **Clock in** for a caregiver
3. **Go to Azure Portal** → **Cosmos DB** → **Data Explorer**
4. Expand **CaregiverDB** → **Shifts** → **Items**
5. You should see your shift data stored there! 🎉

---

## Cost Estimate

With **Serverless** mode and **Free Tier**:
- **First 1000 RU/s:** Free
- **First 25GB storage:** Free
- **Your usage:** ~50 requests/day = **$0/month** ✅

Without free tier:
- **~$0.01/day** for typical usage (very cheap!)

---

## Troubleshooting

**Error: "Cosmos DB credentials not configured"**
- Check that `COSMOS_ENDPOINT` and `COSMOS_KEY` are set in Static Web App → Configuration
- Make sure you clicked **"Save"** after adding them

**Error: "Container not found"**
- Verify you created `CaregiverDB` database
- Verify you created `Shifts` and `Settings` containers
- Check partition keys: `/month` for Shifts, `/id` for Settings

**Data not syncing across devices**
- Open browser console (F12) and check for errors
- Verify the Azure deployment succeeded (GitHub Actions → green checkmark)

---

## Next Steps

Once you complete Steps 1-4 above, tell me and I'll:
1. Update the frontend to use Cosmos DB instead of localStorage
2. Push Phase 2 code to GitHub
3. Test multi-device sync!

---

**When you're ready, say "Cosmos DB configured" and I'll proceed with the frontend integration!**
