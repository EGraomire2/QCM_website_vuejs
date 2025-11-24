#!/bin/bash

# SOSprépa Backend Deployment Script

set -e  # Exit on error

echo "========================================="
echo "SOSprépa Backend Deployment"
echo "========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env file exists
if [ ! -f "server/.env" ]; then
    echo -e "${RED}Error: server/.env file not found${NC}"
    echo "Please create server/.env from server/.env.example"
    exit 1
fi

cd server

echo -e "${YELLOW}Installing dependencies...${NC}"
npm install --production

echo ""
echo -e "${YELLOW}Running tests...${NC}"
npm test || {
    echo -e "${RED}Tests failed. Deployment aborted.${NC}"
    exit 1
}

echo ""
echo "========================================="
echo -e "${GREEN}Backend Deployment Complete!${NC}"
echo "========================================="
echo ""
echo "To start the server:"
echo "  npm start"
echo ""
echo "Or with PM2:"
echo "  pm2 start app.js --name sosprepa-api"
echo "  pm2 save"
echo "  pm2 startup"
echo ""
