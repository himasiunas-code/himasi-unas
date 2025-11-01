#!/bin/bash

echo "======================================="
echo "   HIMASI UNAS Chatbot Setup Script"
echo "======================================="
echo

# Check if Python is installed
if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
    echo "❌ Python not found! Please install Python first."
    echo "Download from: https://www.python.org/downloads/"
    exit 1
fi

# Use python3 if available, otherwise python
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
    PIP_CMD="pip3"
else
    PYTHON_CMD="python"
    PIP_CMD="pip"
fi

echo "✅ Python found!"
echo

echo "Setting up virtual environment..."
cd app

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    $PYTHON_CMD -m venv venv
fi

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing Python dependencies..."
$PIP_CMD install -r requirements.txt

echo "✅ Setup complete!"
echo
echo "Starting Flask backend server..."
echo "Backend will run on: http://localhost:5000"
echo

$PYTHON_CMD app.py