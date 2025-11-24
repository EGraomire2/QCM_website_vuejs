#!/bin/bash

# SOSprépa Deployment Script
# This script deploys both backend and frontend

set -e  # Exit on error

echo "========================================="
echo "SOSprépa Deployment Script"
echo "========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env files exist
if [ ! -f "server/.env" ]; then
    echo -e "${RED}Error: server/.env file not found${NC}"
    echo "Please create server/.env from server/.env.example"
    exit 1
fi

if [ ! -f "client/.env" ]; then
    echo -e "${RED}Error: client/.env file not found${NC}"
    echo "Please create client/.env from client/.env.example"
    exit 1
fi

# Deploy Backend
echo -e "${YELLOW}Deploying Backend...${NC}"
cd server

echo "Installing backend dependencies..."
npm install --production

echo "Running backend tests..."
npm test || {
    echo -e "${RED}Backend tests failed. Deployment aborted.${NC}"
    exit 1
}

echo -e "${GREEN}Backend deployment successful!${NC}"
cd ..

# Deploy Frontend
echo ""
echo -e "${YELLOW}Deploying Frontend...${NC}"
cd client

echo "Installing frontend dependencies..."
npm install

echo "Building frontend for production..."
npm run build || {
    echo -e "${RED}Frontend build failed. Deployment aborted.${NC}"
    exit 1
}

echo -e "${GREEN}Frontend deployment successful!${NC}"
cd ..

# Summary
echo ""
echo "========================================="
echo -e "${GREEN}Deployment Complete!${NC}"
echo "========================================="
echo ""
echo "Backend: Ready to start with 'npm start' in server/"
echo "Frontend: Built files in client/dist/"
echo ""
echo "Next steps:"
echo "1. Start the backend server:"
echo "   cd server && npm start"
echo ""
echo "2. Serve the frontend (example with nginx):"
echo "   - Copy client/dist/* to your web server"
echo "   - Configure nginx to serve static files"
echo "   - Set up reverse proxy for /api to backend"
echo ""
echo "3. Or use PM2 for process management:"
echo "   pm2 start server/app.js --name sosprepa-api"
echo ""
