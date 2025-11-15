# Azure Website Deployment Guide

This project contains a simple website that automatically deploys to Azure Static Web Apps whenever you push code to GitHub.

## 🚀 Quick Start - Complete Setup Instructions

### Prerequisites
- A GitHub account
- An Azure account (free tier works!)
- Git installed on your computer

---

## Step 1: Initialize Git Repository

Open a terminal in this folder and run:

```powershell
git init
git add .
git commit -m "Initial commit: My Azure website"
```

---

## Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository (name it something like "my-azure-website")
3. **Do NOT** initialize with README, .gitignore, or license (we already have these)
4. Click "Create repository"

---

## Step 3: Push to GitHub

After creating your GitHub repo, run these commands (replace YOUR-USERNAME and YOUR-REPO):

```powershell
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git branch -M main
git push -u origin main

```

---

## Step 4: Create Azure Static Web App

1. Go to the Azure Portal: https://portal.azure.com
2. Click **"Create a resource"**
3. Search for **"Static Web App"** and select it
4. Click **"Create"**

### Fill in the details:

**Basics Tab:**
- **Subscription:** Select your subscription
- **Resource Group:** Create new or select existing
- **Name:** Choose a unique name (e.g., "my-website-app")
- **Plan type:** Select **Free** (for personal projects)
- **Region:** Choose closest to you
- **Deployment source:** Select **GitHub**

### GitHub Configuration:
5. Click **"Sign in with GitHub"** and authorize Azure
6. Select:
   - **Organization:** Your GitHub username
   - **Repository:** The repo you just created
   - **Branch:** main

### Build Configuration:
7. **Build Presets:** Select "Custom"
8. Fill in these values:
   - **App location:** `/` (this is the root folder)
   - **Api location:** Leave empty
   - **Output location:** Leave empty

9. Click **"Review + Create"**
10. Click **"Create"**

---

## Step 5: Get Your Deployment Token (Critical!)

Azure automatically creates a GitHub Actions workflow, but you need to verify the secret:

1. In Azure Portal, go to your Static Web App resource
2. Click **"Manage deployment token"** in the left menu
3. Copy the deployment token

### Add the token to GitHub:

4. Go to your GitHub repository
5. Click **Settings** → **Secrets and variables** → **Actions**
6. You should see a secret called `AZURE_STATIC_WEB_APPS_API_TOKEN` already created by Azure
   - If not, click **"New repository secret"**
   - Name: `AZURE_STATIC_WEB_APPS_API_TOKEN`
   - Value: Paste the deployment token from Azure
   - Click **"Add secret"**

---

## Step 6: Verify Deployment

1. Go to your GitHub repository
2. Click on the **"Actions"** tab
3. You should see a workflow running (or completed)
4. Once complete (green checkmark), your site is live!

### Find your website URL:

- In Azure Portal, go to your Static Web App
- The URL is shown at the top (something like: `https://your-app-name.azurestaticapps.net`)
- Click it to view your live website!

---

## 🎉 You're Done! Now What?

### Making Changes

Every time you want to update your website:

1. Edit your files in VS Code (`index.html`, `styles.css`, `script.js`)
2. Save your changes
3. Run these commands:

```powershell
git add .
git commit -m "Describe your changes here"
git push
```

4. GitHub Actions will automatically deploy your changes to Azure!
5. Wait 1-2 minutes and refresh your Azure website to see the updates

---

## 📁 Project Structure

```
.
├── index.html          # Main HTML file
├── styles.css          # Styling
├── script.js           # JavaScript functionality
├── .gitignore          # Files to ignore in git
├── .github/
│   └── workflows/
│       └── azure-static-web-apps.yml  # Auto-deployment workflow
└── README.md           # This file
```

---

## 🛠️ Customization Tips

### Change the website content:
- Edit `index.html` to modify the structure and text
- Edit `styles.css` to change colors, fonts, and layout
- Edit `script.js` to add interactive features

### Add more pages:
- Create new HTML files (e.g., `about.html`, `contact.html`)
- Link to them from `index.html`

### Add a custom domain (optional):
- In Azure Portal, go to your Static Web App
- Click "Custom domains" in the left menu
- Follow the instructions to add your domain

---

## 🔍 Troubleshooting

### Deployment failed?
- Check the Actions tab in GitHub for error details
- Verify the `AZURE_STATIC_WEB_APPS_API_TOKEN` secret exists in GitHub
- Make sure the workflow file is in `.github/workflows/`

### Website not updating?
- Check if the GitHub Action completed successfully
- Clear your browser cache (Ctrl+F5)
- Wait a few minutes for Azure CDN to update

### Need help?
- Check Azure Static Web Apps documentation: https://docs.microsoft.com/azure/static-web-apps/
- Check GitHub Actions logs in the Actions tab

---

## 📚 Resources

- [Azure Static Web Apps Documentation](https://docs.microsoft.com/azure/static-web-apps/)
- [GitHub Actions Documentation](https://docs.github.com/actions)
- [HTML/CSS/JS Tutorials](https://developer.mozilla.org/)

---

## 💡 Next Steps

Once you're comfortable with the basics:
- Add a backend API using Azure Functions
- Implement authentication
- Add a database
- Use a frontend framework (React, Vue, Angular)
- Set up staging environments using pull requests

Happy coding! 🚀
