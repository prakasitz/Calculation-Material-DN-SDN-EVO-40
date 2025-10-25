# GitHub Pages Setup Guide

## 🔧 Fix Deployment Issues

### Step 1: Enable GitHub Pages
1. Go to your repository: https://github.com/prakasitz/Calculation-Material-DN-SDN-EVO-40
2. Click on **Settings** tab
3. Scroll down to **Pages** section in the left sidebar
4. Under **Source**, select **"GitHub Actions"** (not "Deploy from a branch")
5. Click **Save**

### Step 2: Check Repository Permissions
1. Go to **Settings** → **Actions** → **General**
2. Under **Workflow permissions**, select:
   - ✅ **"Read and write permissions"**
   - ✅ **"Allow GitHub Actions to create and approve pull requests"**
3. Click **Save**

### Step 3: Re-run the Deployment
After making these changes, either:
- Push a new commit to trigger the workflow
- Or go to **Actions** tab and re-run the failed workflow

## 🌐 Expected Result
Your app will be available at: https://prakasitz.github.io/Calculation-Material-DN-SDN-EVO-40

## 🐛 Troubleshooting

### If you still get 403 errors:
1. Make sure your repository is **public** (private repos need GitHub Pro for Pages)
2. Check that GitHub Actions are enabled in your repository settings
3. Verify you have admin permissions on the repository

### Alternative: Manual GitHub Pages
If GitHub Actions continue to fail, you can use the classic method:
1. Go to **Settings** → **Pages**
2. Under **Source**, select **"Deploy from a branch"**
3. Choose **main** branch and **/ (root)** folder
4. Use the `deploy.bat` script to push changes manually