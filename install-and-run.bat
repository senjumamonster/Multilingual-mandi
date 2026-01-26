@echo off
echo ========================================
echo  The Multilingual Mandi Setup Script
echo ========================================
echo.

echo Checking Node.js installation...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo.
echo Node.js found! Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo ========================================
echo  Starting The Multilingual Mandi...
echo ========================================
echo.
echo The application will open in your browser at:
echo http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

npm start