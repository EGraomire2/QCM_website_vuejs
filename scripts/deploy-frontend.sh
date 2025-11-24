#!/bin/bash

# SOSprépa Frontend Deployment Script

set -e  # Exit on error

echo "========================================="
echo "SOSprépa Frontend Deployment"
echo "========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env file exists
if [ ! -f "client/.env" ]; then
    echo -e "${RED}Error: client/.env file not found${NC}"
    echo "Please create client/.env from client/.env.example"
    exit 1
fi

cd client

echo -e "${YELLOW}Installing dependencies...${NC}"
npm install

echo ""
echo -e "${YELLOW}Building for production...${NC}"
npm run build || {
    echo -e "${RED}Build failed. Deployment aborted.${NC}"
    exit 1
}

echo ""
echo "========================================="
echo -e "${GREEN}Frontend Deployment Complete!${NC}"
echo "========================================="
echo ""
echo "Built files are in: client/dist/"
echo ""
echo "Deployment options:"
echo ""
echo "1. Nginx (recommended):"
echo "   - Copy dist/* to /var/www/sosprepa/"
echo "   - Configure nginx (see example in README.md)"
echo ""
echo "2. Apache:"
echo "   - Copy dist/* to your DocumentRoot"
echo "   - Enable mod_rewrite for SPA routing"
echo ""
echo "3. Static hosting (Netlify, Vercel, etc.):"
echo "   - Upload dist/ folder"
echo "   - Configure build command: npm run build"
echo "   - Configure publish directory: dist"
echo ""
