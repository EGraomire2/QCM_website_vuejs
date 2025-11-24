@echo off
REM SOSprépa Backend Deployment Script for Windows

echo =========================================
echo SOSprépa Backend Deployment
echo =========================================
echo.

REM Check if .env file exists
if not exist "server\.env" (
    echo Error: server\.env file not found
    echo Please create server\.env from server\.env.example
    exit /b 1
)

cd server

echo Installing dependencies...
call npm install --production
if errorlevel 1 (
    echo Dependency installation failed
    exit /b 1
)

echo.
echo Running tests...
call npm test
if errorlevel 1 (
    echo Tests failed. Deployment aborted.
    exit /b 1
)

echo.
echo =========================================
echo Backend Deployment Complete!
echo =========================================
echo.
echo To start the server:
echo   npm start
echo.
echo Or with PM2:
echo   pm2 start app.js --name sosprepa-api
echo   pm2 save
echo   pm2 startup
echo.

cd ..
pause
