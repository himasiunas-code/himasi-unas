@echo off
echo ========================================
echo HIMASI UNAS WhatsApp Web Service
echo ========================================
echo.

echo 🚀 Starting self-hosted WhatsApp service - STABLE VERSION
echo 📱 Using Baileys library - more reliable than WhatsApp Web
echo 🔐 No third-party API keys needed!
echo ✨ Fixes WhatsApp Web compatibility issues
echo.

REM Check if Node.js is available
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found! Please install Node.js first.
    pause
    exit /b 1
)

REM Check if the project directory exists
if not exist "package.json" (
    echo ❌ package.json not found! Run this from the project root directory.
    pause
    exit /b 1
)

REM Check if required dependencies are installed
if not exist "node_modules\@whiskeysockets\baileys" (
    echo 📦 Installing Baileys WhatsApp dependencies...
    npm install @whiskeysockets/baileys qrcode-terminal pino
    if errorlevel 1 (
        echo ❌ Failed to install dependencies!
        pause
        exit /b 1
    )
)

REM Check if pino logger is installed
if not exist "node_modules\pino" (
    echo 📦 Installing Pino logger (required by Baileys)...
    npm install pino
    if errorlevel 1 (
        echo ❌ Failed to install pino logger!
        pause
        exit /b 1
    )
)

echo 📱 Initializing Baileys WhatsApp service...
echo ⏳ Please wait for QR code to appear...
echo.
echo 📋 Steps to connect:
echo   1. QR code will appear in this terminal
echo   2. Open WhatsApp on your phone
echo   3. Go to Settings ^> Linked Devices
echo   4. Tap "Link a Device"
echo   5. Scan the QR code below
echo.
echo 💡 Using Baileys - more stable than WhatsApp Web!
echo.

REM Start the Baileys WhatsApp service
echo 🚀 Starting HIMASI UNAS WhatsApp Baileys Service...
node whatsapp-service-baileys.js

pause