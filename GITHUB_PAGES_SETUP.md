# GitHub Pages Setup Guide

## � FIXING 404 NOT FOUND ERROR

Your site https://prakasitz.github.io/Calculation-Material-DN-SDN-EVO-40 shows 404 because:

### ✅ Step 1: Check Repository Visibility
1. Go to: https://github.com/prakasitz/Calculation-Material-DN-SDN-EVO-40/settings
2. Scroll to bottom "Danger Zone"
3. If repository is PRIVATE, click "Change repository visibility" → Make PUBLIC
4. **GitHub Pages requires PUBLIC repositories for free accounts**

### ✅ Step 2: Push Your Code
1. Run `diagnose-pages.bat` to push all files
2. Make sure `index.html` exists in your main branch
3. Check: https://github.com/prakasitz/Calculation-Material-DN-SDN-EVO-40

### ✅ Step 3: Enable GitHub Pages
1. Go to: https://github.com/prakasitz/Calculation-Material-DN-SDN-EVO-40/settings/pages
2. Under **Source**, select **"Deploy from a branch"**
3. Choose **"main"** branch and **"/ (root)"** folder
4. Click **Save**
5. **WAIT 5-10 minutes** for first deployment

### ✅ Step 4: Verify Deployment
- Check status: https://github.com/prakasitz/Calculation-Material-DN-SDN-EVO-40/deployments
- Look for "github-pages" environment
- Green checkmark = successful deployment

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