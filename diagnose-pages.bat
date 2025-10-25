@echo off
echo 🔍 GitHub Pages Diagnostic Tool
echo Repository: https://github.com/prakasitz/Calculation-Material-DN-SDN-EVO-40
echo Expected URL: https://prakasitz.github.io/Calculation-Material-DN-SDN-EVO-40
echo.

echo ❌ Getting 404 Not Found Error
echo.
echo 🔧 Most Common Causes & Solutions:
echo.

echo 1️⃣  GITHUB PAGES NOT ENABLED
echo    ► Go to: https://github.com/prakasitz/Calculation-Material-DN-SDN-EVO-40/settings/pages
echo    ► If you see "GitHub Pages is currently disabled"
echo    ► Under "Source", select "Deploy from a branch"
echo    ► Choose "main" branch and "/ (root)" folder
echo    ► Click "Save"
echo.

echo 2️⃣  REPOSITORY IS PRIVATE
echo    ► Go to: https://github.com/prakasitz/Calculation-Material-DN-SDN-EVO-40/settings
echo    ► Scroll to bottom "Danger Zone"
echo    ► Click "Change repository visibility"
echo    ► Make it PUBLIC (required for free GitHub Pages)
echo.

echo 3️⃣  NO FILES PUSHED TO MAIN BRANCH
echo    ► Check: https://github.com/prakasitz/Calculation-Material-DN-SDN-EVO-40
echo    ► Make sure index.html exists in the main branch
echo.

echo 4️⃣  PAGES STILL BUILDING
echo    ► Check: https://github.com/prakasitz/Calculation-Material-DN-SDN-EVO-40/deployments
echo    ► Look for "github-pages" deployments
echo    ► Wait 5-10 minutes for first deployment
echo.

echo.
echo 🎯 QUICK FIX - Try this order:
echo.
echo Step A: Make repository PUBLIC (if it's private)
echo Step B: Push your code to main branch
echo Step C: Enable GitHub Pages with "Deploy from branch"
echo Step D: Wait 5-10 minutes
echo.

set /p fix="Ready to push your code and enable Pages? (y/n): "
if /i "%fix%" neq "y" (
    echo.
    echo 💡 Please check the repository settings first:
    echo https://github.com/prakasitz/Calculation-Material-DN-SDN-EVO-40/settings
    echo.
    pause
    exit /b 1
)

echo.
echo 🚀 Pushing code to GitHub...

REM Initialize git if needed
if not exist ".git" (
    git init
    git branch -M main
)

REM Add remote if needed  
git remote get-url origin >nul 2>&1
if %errorlevel% neq 0 (
    git remote add origin https://github.com/prakasitz/Calculation-Material-DN-SDN-EVO-40.git
)

REM Add all files
git add .

REM Commit
git commit -m "Deploy: Fix GitHub Pages - ensure all files are present"

REM Push
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ✅ Code pushed successfully!
    echo.
    echo 🔧 NOW DO THIS MANUALLY:
    echo.
    echo 1. Go to: https://github.com/prakasitz/Calculation-Material-DN-SDN-EVO-40/settings/pages
    echo 2. Under "Source", select "Deploy from a branch"
    echo 3. Choose "main" branch and "/ (root)" folder
    echo 4. Click "Save"
    echo 5. Wait 5-10 minutes
    echo 6. Visit: https://prakasitz.github.io/Calculation-Material-DN-SDN-EVO-40
    echo.
    echo 📊 Check build status: https://github.com/prakasitz/Calculation-Material-DN-SDN-EVO-40/actions
) else (
    echo.
    echo ❌ Push failed. Check your git credentials.
)

echo.
pause