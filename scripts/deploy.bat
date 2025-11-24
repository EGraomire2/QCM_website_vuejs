@echo off
REM SOSprépa Deployment Script for Windows
REM This script deploys both backend and frontend

echo =========================================
echo SOSprépa Deployment Script
echo =========================================
echo.

REM Check if .env files exist
if not exist "server\.env" (
    echo Error: server\.env file not found
    echo Please create server\.env from server\.env.example
    exit /b 1
)

if not exist "client\.env" (
    echo Error: client\.env file not found
    echo Please create client\.env from client\.env.example
    exit /b 1
)

REM Deploy Backend
echo Deploying Backend...
cd server

echo Installing backend dependencies...
call npm install --production
if errorlevel 1 (
    echo Backend dependency installation failed
    exit /b 1
)

echo Running backend tests...
call npm test
if errorlevel 1 (
    echo Backend tests failed. Deployment aborted.
    exit /b 1
)

echo Backend deployment successful!
cd ..

REM Deploy Frontend
echo.
echo Deploying Frontend...
cd client

echo Installing frontend dependencies...
call npm install
if errorlevel 1 (
    echo Frontend dependency installation failed
    exit /b 1
)

echo Building frontend for production...
call npm run build
if errorlevel 1 (
    echo Frontend build failed. Deployment aborted.
    exit /b 1
)

echo Frontend deployment successful!
cd ..

REM Summary
echo.
echo =========================================
echo Deployment Complete!
echo =========================================
echo.
echo Backend: Ready to start with 'npm start' in server\
echo Frontend: Built files in client\dist\
echo.
echo Next steps:
echo 1. Start the backend server:
echo    cd server ^&^& npm start
echo.
echo 2. Serve the frontend with a web server
echo.
echo 3. Or use PM2 for process management:
echo    pm2 start server\app.js --name sosprepa-api
echo.

pause
