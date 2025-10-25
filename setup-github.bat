@echo off
echo 🚀 Setting up Calculation App for GitHub Pages...

REM Check if we're in a git repository
if not exist ".git" (
    echo 📁 Initializing Git repository...
    git init
    git branch -M main
)

REM Create .gitignore if it doesn't exist
if not exist ".gitignore" (
    echo 📝 Creating .gitignore...
    (
        echo # Node modules ^(if any^)
        echo node_modules/
        echo.
        echo # OS generated files
        echo .DS_Store
        echo .DS_Store?
        echo ._*
        echo .Spotlight-V100
        echo .Trashes
        echo ehthumbs.db
        echo Thumbs.db
        echo.
        echo # Editor directories and files
        echo .vscode/*
        echo !.vscode/extensions.json
        echo .idea
        echo .suo
        echo .ntvs*
        echo .njsproj
        echo .sln
        echo .sw?
        echo.
        echo # Logs
        echo *.log
        echo npm-debug.log*
        echo.
        echo # Local env files
        echo .env.local
        echo .env.*.local
        echo.
        echo # Backup files
        echo *.bak
        echo *.backup
    ) > .gitignore
)

REM Add all files and commit
echo 📦 Adding files to Git...
git add .
git commit -m "Initial commit: Calculation App with Profile System"

echo.
echo ✅ Setup complete!
echo.
echo 📋 Next steps:
echo 1. Repository already exists at: https://github.com/prakasitz/Calculation-Material-DN-SDN-EVO-40
echo 2. Run: git remote add origin https://github.com/prakasitz/Calculation-Material-DN-SDN-EVO-40.git
echo 3. Run: git push -u origin main
echo 4. Go to repository settings at: https://github.com/prakasitz/Calculation-Material-DN-SDN-EVO-40/settings
echo 5. Navigate to 'Pages' section
echo 6. Set source to 'Deploy from a branch'
echo 7. Select 'main' branch and '/ (root)' folder
echo 8. Your app will be available at: https://prakasitz.github.io/Calculation-Material-DN-SDN-EVO-40
echo.
echo 🎉 Your calculation app is ready for GitHub Pages!
pause