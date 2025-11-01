@echo off
echo =======================================
echo    HIMASI UNAS Chatbot Setup Script
echo =======================================
echo.

echo Checking Python installation...
py --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python not found! Please install Python first.
    echo Download from: https://www.python.org/downloads/
    pause
    exit /b 1
)

echo ✅ Python found!
echo.

echo Setting up virtual environment...
cd app
if not exist venv (
    echo Creating virtual environment...
    py -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate

echo Installing Python dependencies...
pip install Flask Flask-Cors Flask-RESTful requests nltk python-dotenv

echo ✅ Setup complete!
echo.
echo Starting Flask backend server...
echo Backend will run on: http://localhost:5000
echo Press Ctrl+C to stop the server
echo.
python app.py