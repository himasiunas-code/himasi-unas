@echo off
echo =======================================
echo    HIMASI UNAS Frontend Setup Script
echo =======================================
echo.

echo Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found! Please install Node.js first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js found!
echo.

echo Installing dependencies...
npm install

echo ✅ Dependencies installed!
echo.
echo Starting Next.js development server...
echo Frontend will run on: http://localhost:3000
echo.
npm run dev