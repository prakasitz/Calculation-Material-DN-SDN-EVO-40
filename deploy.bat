@echo off
echo 🚀 Deploying Calculation App to GitHub Pages...
echo Repository: https://github.com/prakasitz/Calculation-Material-DN-SDN-EVO-40
echo.

REM Check if git is initialized
if not exist ".git" (
    echo 📁 Initializing Git repository...
    git init
    git branch -M main
)

REM Check if remote origin exists
git remote get-url origin >nul 2>&1
if %errorlevel% neq 0 (
    echo 🔗 Adding remote origin...
    git remote add origin https://github.com/prakasitz/Calculation-Material-DN-SDN-EVO-40.git
) else (
    echo ✅ Remote origin already configured
)

REM Add all files and commit
echo 📦 Preparing files for deployment...
git add .

REM Check if there are changes to commit
git diff --staged --quiet
if %errorlevel% neq 0 (
    echo 💾 Committing changes...
    git commit -m "Update: Calculation app with profile system - %date% %time%"
) else (
    echo ℹ️ No changes to commit
)

REM Push to GitHub
echo 🚀 Pushing to GitHub...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ✅ Deployment successful!
    echo.
    echo 🌐 Your app will be available at:
    echo https://prakasitz.github.io/Calculation-Material-DN-SDN-EVO-40
    echo.
    echo 📋 To enable GitHub Pages (if not already enabled):
    echo 1. Go to: https://github.com/prakasitz/Calculation-Material-DN-SDN-EVO-40/settings/pages
    echo 2. Set source to "Deploy from a branch"
    echo 3. Select "main" branch and "/ (root)" folder
    echo 4. Click "Save"
    echo.
    echo 🎉 Deployment complete!
) else (
    echo.
    echo ❌ Deployment failed. Please check your credentials and try again.
    echo.
    echo 💡 Troubleshooting:
    echo - Make sure you're logged into Git: git config --global user.name "Your Name"
    echo - Make sure you have push access to the repository
    echo - Check your internet connection
)

echo.
pause