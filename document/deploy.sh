#!/bin/bash

echo "🚀 HIMASI UNAS Chatbot - Public Deployment Script"
echo "=================================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📝 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit - HIMASI UNAS Chatbot"
else
    echo "📝 Git repository exists, committing changes..."
    git add .
    git commit -m "Prepare for production deployment - $(date)"
fi

echo ""
echo "🌐 Deployment Options:"
echo "1. Deploy Frontend to Vercel (Recommended)"
echo "2. Deploy Backend to Railway (Recommended)"
echo "3. Deploy Both (Full Deployment)"
echo "4. Deploy to Netlify (Alternative)"
echo ""

read -p "Select option (1-4): " choice

case $choice in
    1)
        echo "🎯 Deploying Frontend to Vercel..."
        if ! command -v vercel &> /dev/null; then
            echo "📦 Installing Vercel CLI..."
            npm install -g vercel
        fi
        vercel
        ;;
    2)
        echo "🔧 Backend deployment guide:"
        echo "1. Push this repository to GitHub"
        echo "2. Go to https://railway.app"
        echo "3. Login with GitHub"
        echo "4. Create new project from GitHub repo"
        echo "5. Set root directory to: app/"
        echo "6. Railway will auto-deploy your Flask backend"
        echo ""
        echo "📋 Don't forget to update CORS settings with your Vercel URL!"
        ;;
    3)
        echo "🚀 Full deployment..."
        echo "Step 1: Deploying Frontend..."
        if ! command -v vercel &> /dev/null; then
            npm install -g vercel
        fi
        vercel
        
        echo ""
        echo "Step 2: Deploy backend manually on Railway:"
        echo "https://railway.app"
        ;;
    4)
        echo "🌐 Netlify deployment:"
        echo "1. Push to GitHub"
        echo "2. Go to https://netlify.com"
        echo "3. Connect GitHub repo"
        echo "4. Set build directory to root"
        echo "5. Deploy both frontend and backend functions"
        ;;
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac

echo ""
echo "✅ Deployment initiated!"
echo ""
echo "📋 Post-deployment checklist:"
echo "- [ ] Update CORS settings with production URLs"
echo "- [ ] Test chatbot on live URL"
echo "- [ ] Set up custom domain (optional)"
echo "- [ ] Monitor logs and performance"
echo ""
echo "🎉 Your HIMASI UNAS Chatbot will be publicly accessible!"