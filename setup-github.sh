#!/bin/bash

# GitHub Pages Setup Script for Calculation App

echo "🚀 Setting up Calculation App for GitHub Pages..."

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
    git branch -M main
fi

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    echo "📝 Creating .gitignore..."
    cat > .gitignore << EOF
# Node modules (if any)
node_modules/

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.suo
.ntvs*
.njsproj
.sln
.sw?

# Logs
*.log
npm-debug.log*

# Local env files
.env.local
.env.*.local

# Backup files
*.bak
*.backup
EOF
fi

# Add all files and commit
echo "📦 Adding files to Git..."
git add .
git commit -m "Initial commit: Calculation App with Profile System"

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Create a new repository on GitHub"
echo "2. Run: git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git"
echo "3. Run: git push -u origin main"
echo "4. Go to your GitHub repository settings"
echo "5. Navigate to 'Pages' section"
echo "6. Set source to 'Deploy from a branch'"
echo "7. Select 'main' branch and '/ (root)' folder"
echo "8. Your app will be available at: https://YOUR_USERNAME.github.io/YOUR_REPO_NAME"
echo ""
echo "🎉 Your calculation app is ready for GitHub Pages!"