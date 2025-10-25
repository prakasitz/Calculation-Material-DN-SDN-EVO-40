@echo off
echo 🌐 Simple GitHub Pages Deployment (Branch Method)
echo Repository: https://github.com/prakasitz/Calculation-Material-DN-SDN-EVO-40
echo.

echo 📝 This method uses the simple "Deploy from branch" approach.
echo It's more reliable and easier to set up than GitHub Actions.
echo.

echo 🔧 What you need to do:
echo.
echo 1. Go to: https://github.com/prakasitz/Calculation-Material-DN-SDN-EVO-40/settings/pages
echo 2. Under "Source", select "Deploy from a branch"
echo 3. Choose "main" branch and "/ (root)" folder
echo 4. Click Save
echo.

set /p continue="Ready to push your code? (y/n): "
if /i "%continue%" neq "y" (
    echo.
    echo ℹ️  Please set up GitHub Pages first using the steps above.
    echo.
    pause
    exit /b 1
)

echo.
echo 🚀 Deploying to GitHub Pages...
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

REM Remove the GitHub Actions workflow since we're using branch deployment
if exist ".github\workflows\deploy.yml" (
    echo 🗑️  Removing GitHub Actions workflow (using branch deployment instead)...
    del ".github\workflows\deploy.yml"
)

REM Add all files and commit
echo 📦 Adding files...
git add .

REM Check if there are changes to commit
git diff --staged --quiet
if %errorlevel% neq 0 (
    echo 💾 Committing changes...
    git commit -m "Deploy: Calculation app - Branch deployment method"
) else (
    echo ℹ️ No changes to commit, pushing existing code...
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
    echo ⏱️  GitHub Pages usually takes 2-10 minutes to update.
    echo.
    echo 💡 To check deployment status:
    echo https://github.com/prakasitz/Calculation-Material-DN-SDN-EVO-40/deployments
) else (
    echo.
    echo ❌ Push failed. Please check your credentials and try again.
    echo.
    echo 💡 Make sure you have push access to the repository.
)

echo.
pause