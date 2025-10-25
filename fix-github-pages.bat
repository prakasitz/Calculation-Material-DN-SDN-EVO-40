@echo off
echo 🔧 GitHub Pages Deployment Fix Script
echo Repository: https://github.com/prakasitz/Calculation-Material-DN-SDN-EVO-40
echo.

echo 📋 This script will help you fix the GitHub Pages deployment issue.
echo.
echo ❌ The error you saw indicates a permissions issue with GitHub Actions.
echo.
echo 🛠️  Manual fixes needed (do these in your browser):
echo.
echo 1️⃣  Go to: https://github.com/prakasitz/Calculation-Material-DN-SDN-EVO-40/settings/pages
echo     - Under "Source", select "GitHub Actions" (not "Deploy from a branch")
echo     - Click Save
echo.
echo 2️⃣  Go to: https://github.com/prakasitz/Calculation-Material-DN-SDN-EVO-40/settings/actions
echo     - Under "Workflow permissions", select "Read and write permissions"
echo     - Check "Allow GitHub Actions to create and approve pull requests"
echo     - Click Save
echo.
echo 3️⃣  Make sure your repository is PUBLIC (required for free GitHub Pages)
echo.

set /p continue="Have you completed steps 1-3 above? (y/n): "
if /i "%continue%" neq "y" (
    echo.
    echo ℹ️  Please complete the manual steps above first, then run this script again.
    echo.
    pause
    exit /b 1
)

echo.
echo 🚀 Now pushing updated workflow to trigger deployment...
echo.

REM Add the updated workflow file
git add .github/workflows/deploy.yml
git add GITHUB_PAGES_SETUP.md
git add .

REM Commit the fix
git commit -m "Fix: Update GitHub Actions workflow for Pages deployment with proper permissions"

REM Push to trigger the new workflow
git push origin main

if %errorlevel% equ 0 (
    echo.
    echo ✅ Updated workflow pushed successfully!
    echo.
    echo 🔄 GitHub Actions should now run with proper permissions.
    echo.
    echo 👀 Check the deployment status at:
    echo https://github.com/prakasitz/Calculation-Material-DN-SDN-EVO-40/actions
    echo.
    echo 🌐 Your app will be available at:
    echo https://prakasitz.github.io/Calculation-Material-DN-SDN-EVO-40
    echo.
    echo ⏱️  It may take 2-5 minutes for the deployment to complete.
) else (
    echo.
    echo ❌ Push failed. Please check your git configuration and internet connection.
)

echo.
pause