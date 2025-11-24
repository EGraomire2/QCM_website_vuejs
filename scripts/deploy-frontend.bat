@echo off
REM SOSprépa Frontend Deployment Script for Windows

echo =========================================
echo SOSprépa Frontend Deployment
echo =========================================
echo.

REM Check if .env file exists
if not exist "client\.env" (
    echo Error: client\.env file not found
    echo Please create client\.env from client\.env.example
    exit /b 1
)

cd client

echo Installing dependencies...
call npm install
if errorlevel 1 (
    echo Dependency installation failed
    exit /b 1
)

echo.
echo Building for production...
call npm run build
if errorlevel 1 (
    echo Build failed. Deployment aborted.
    exit /b 1
)

echo.
echo =========================================
echo Frontend Deployment Complete!
echo =========================================
echo.
echo Built files are in: client\dist\
echo.
echo Deployment options:
echo.
echo 1. IIS (Windows):
echo    - Copy dist\* to your IIS website folder
echo    - Configure URL Rewrite for SPA routing
echo.
echo 2. Nginx:
echo    - Copy dist\* to your nginx html folder
echo    - Configure nginx (see example in README.md)
echo.
echo 3. Static hosting (Netlify, Vercel, etc.):
echo    - Upload dist\ folder
echo    - Configure build command: npm run build
echo    - Configure publish directory: dist
echo.

cd ..
pause
