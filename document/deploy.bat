@echo off
echo 🚀 HIMASI UNAS Chatbot - Public Deployment Script
echo ==================================================

REM Check if git is initialized
if not exist ".git" (
    echo 📝 Initializing Git repository...
    git init
    git add .
    git commit -m "Initial commit - HIMASI UNAS Chatbot"
) else (
    echo 📝 Git repository exists, committing changes...
    git add .
    git commit -m "Prepare for production deployment"
)

echo.
echo 🌐 Deployment Options:
echo 1. Deploy to Hostinger (Smart Backend - Recommended)
echo 2. Deploy to Vercel (Frontend Only)
echo 3. Deploy to Railway (Python Backend)
echo 4. Deploy to Netlify (Alternative)
echo 5. Build for manual upload
echo.

set /p choice="Select option (1-5): "

if %choice%==1 (
    echo 🎯 Preparing Hostinger Deployment with Smart Backend...
    echo 📦 Building static files...
    call npm run build
    call npm run export
    
    echo 📁 Backing up basic chatbot...
    copy chatbot.php chatbot-basic.php >nul 2>&1
    
    echo 📋 Hostinger Upload Checklist:
    echo ✅ Build completed - files ready in 'out/' folder
    echo ✅ chatbot-smart.php ready for upload
    echo ✅ chatbot-basic.php created as backup
    echo.
    echo 📤 Upload these to Hostinger public_html/:
    echo - All files from 'out/' folder
    echo - chatbot-smart.php
    echo - chatbot-basic.php (backup)
    echo.
    echo 🔧 After upload, ensure write permissions for chat_logs.txt
    echo 🌐 Test URL: https://yourdomain.com/chatbot-smart.php
    
) else if %choice%==2 (
    echo 🎯 Deploying Frontend to Vercel...
    where vercel >nul 2>&1
    if %errorlevel% neq 0 (
        echo 📦 Installing Vercel CLI...
        npm install -g vercel
    )
    vercel
) else if %choice%==3 (
    echo 🔧 Backend deployment guide:
    echo 1. Push this repository to GitHub
    echo 2. Go to https://railway.app
    echo 3. Login with GitHub
    echo 4. Create new project from GitHub repo
    echo 5. Set root directory to: app/
    echo 6. Railway will auto-deploy your Flask backend
    echo.
    echo 📋 Don't forget to update CORS settings with your Vercel URL!
) else if %choice%==4 (
    echo 🚀 Full deployment...
    echo Step 1: Deploying Frontend...
    where vercel >nul 2>&1
    if %errorlevel% neq 0 (
        npm install -g vercel
    )
    vercel
    
    echo.
    echo Step 2: Deploy backend manually on Railway:
    echo https://railway.app
) else if %choice%==5 (
    echo 📦 Building for manual upload...
    call npm run build
    call npm run export
    copy chatbot.php chatbot-basic.php >nul 2>&1
    echo ✅ Files ready in 'out/' folder for manual upload
) else if %choice%==6 (
    echo 🌐 Netlify deployment:
    echo 1. Push to GitHub
    echo 2. Go to https://netlify.com
    echo 3. Connect GitHub repo
    echo 4. Set build directory to root
    echo 5. Deploy both frontend and backend functions
) else (
    echo ❌ Invalid option
    pause
    exit /b 1
)

echo.
echo ✅ Deployment initiated!
echo.
echo 📋 Post-deployment checklist:
echo - Update CORS settings with production URLs
echo - Test chatbot on live URL
echo - Set up custom domain (optional)
echo - Monitor logs and performance
echo.
echo 🎉 Your HIMASI UNAS Chatbot will be publicly accessible!
pause