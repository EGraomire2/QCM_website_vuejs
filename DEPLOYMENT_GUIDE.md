# SOSprépa Deployment Guide

This guide provides step-by-step instructions for deploying the SOSprépa application to production.

## 📋 Table of Contents

- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Server Requirements](#server-requirements)
- [Database Setup](#database-setup)
- [Backend Deployment](#backend-deployment)
- [Frontend Deployment](#frontend-deployment)
- [SSL/TLS Configuration](#ssltls-configuration)
- [Monitoring and Maintenance](#monitoring-and-maintenance)
- [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] Production server with SSH access
- [ ] Domain name configured (e.g., sosprepa.example.com)
- [ ] MySQL database server
- [ ] SSL certificate (Let's Encrypt recommended)
- [ ] Backup strategy in place
- [ ] All tests passing locally
- [ ] Environment variables configured
- [ ] Security review completed

---

## Server Requirements

### Minimum Requirements

- **OS**: Ubuntu 20.04 LTS or later (or equivalent Linux distribution)
- **CPU**: 2 cores
- **RAM**: 2 GB
- **Storage**: 20 GB
- **Node.js**: v14 or higher
- **MySQL**: v5.7 or higher
- **Nginx**: Latest stable version

### Recommended Requirements

- **CPU**: 4 cores
- **RAM**: 4 GB
- **Storage**: 50 GB SSD
- **Backup**: Automated daily backups

---

## Database Setup

### 1. Install MySQL

```bash
# Update package list
sudo apt update

# Install MySQL
sudo apt install mysql-server

# Secure MySQL installation
sudo mysql_secure_installation
```

### 2. Create Database and User

```bash
# Login to MySQL
sudo mysql -u root -p
```

```sql
-- Create database
CREATE DATABASE sos_prepa_bdd CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user
CREATE USER 'sosprepa_user'@'localhost' IDENTIFIED BY 'your_secure_password';

-- Grant privileges
GRANT SELECT, INSERT, UPDATE, DELETE ON sos_prepa_bdd.* TO 'sosprepa_user'@'localhost';

-- Apply changes
FLUSH PRIVILEGES;

-- Exit
EXIT;
```

### 3. Import Database Schema

```bash
# Import schema
mysql -u sosprepa_user -p sos_prepa_bdd < former_project/sosprepa_creation.sql

# (Optional) Import sample data
mysql -u sosprepa_user -p sos_prepa_bdd < former_project/sosprepa_JeuxDonnées.sql
```

### 4. Configure Database Backups

```bash
# Create backup script
sudo nano /usr/local/bin/backup-sosprepa-db.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/sosprepa"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

mysqldump -u sosprepa_user -p'your_secure_password' sos_prepa_bdd | gzip > $BACKUP_DIR/sosprepa_$DATE.sql.gz

# Keep only last 7 days of backups
find $BACKUP_DIR -name "sosprepa_*.sql.gz" -mtime +7 -delete
```

```bash
# Make executable
sudo chmod +x /usr/local/bin/backup-sosprepa-db.sh

# Add to crontab (daily at 2 AM)
sudo crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-sosprepa-db.sh
```

---

## Backend Deployment

### 1. Install Node.js

```bash
# Install Node.js 14.x
curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

### 2. Create Application User

```bash
# Create user
sudo useradd -m -s /bin/bash sosprepa

# Switch to user
sudo su - sosprepa
```

### 3. Clone Repository

```bash
# Clone repository
git clone https://github.com/EGraomire2/QCM_website_vuejs.git
cd QCM_website_vuejs
```

### 4. Configure Environment

```bash
# Navigate to server directory
cd server

# Create .env file
nano .env
```

```env
# Production configuration
NODE_ENV=production
PORT=3000

# Database
DB_HOST=localhost
DB_USER=sosprepa_user
DB_PASSWORD=your_secure_password
DB_NAME=sos_prepa_bdd
DB_CONNECTION_LIMIT=20

# JWT (generate a secure secret)
JWT_SECRET=your_very_secure_random_string_minimum_32_characters
JWT_EXPIRES_IN=1h

# CORS
CORS_ORIGIN=https://sosprepa.example.com
```

**Generate secure JWT secret**:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 5. Install Dependencies

```bash
# Install production dependencies
npm install --production
```

### 6. Run Tests

```bash
# Install dev dependencies for testing
npm install

# Run tests
npm test

# If tests pass, remove dev dependencies
npm prune --production
```

### 7. Install PM2

```bash
# Exit sosprepa user
exit

# Install PM2 globally
sudo npm install -g pm2

# Switch back to sosprepa user
sudo su - sosprepa
cd QCM_website_vuejs/server
```

### 8. Start Application with PM2

```bash
# Start application
pm2 start app.js --name sosprepa-api

# Save PM2 process list
pm2 save

# Exit sosprepa user
exit

# Set up PM2 to start on boot (as root)
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u sosprepa --hp /home/sosprepa
```

### 9. Configure PM2 Monitoring

```bash
# As sosprepa user
sudo su - sosprepa

# View logs
pm2 logs sosprepa-api

# Monitor
pm2 monit

# Check status
pm2 status
```

---

## Frontend Deployment

### 1. Build Frontend

```bash
# As sosprepa user
cd ~/QCM_website_vuejs/client

# Create production .env
nano .env.production
```

```env
VUE_APP_API_URL=https://sosprepa.example.com/api
VUE_APP_NAME=SOSprépa
```

```bash
# Install dependencies
npm install

# Build for production
npm run build
```

### 2. Install Nginx

```bash
# Exit sosprepa user
exit

# Install Nginx
sudo apt install nginx

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 3. Configure Nginx

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/sosprepa
```

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name sosprepa.example.com www.sosprepa.example.com;
    
    return 301 https://$server_name$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name sosprepa.example.com www.sosprepa.example.com;

    # SSL configuration (will be configured by Certbot)
    ssl_certificate /etc/letsencrypt/live/sosprepa.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/sosprepa.example.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Frontend static files
    root /home/sosprepa/QCM_website_vuejs/client/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    # SPA routing - serve index.html for all routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Deny access to hidden files
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/sosprepa /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## SSL/TLS Configuration

### Using Let's Encrypt (Recommended)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d sosprepa.example.com -d www.sosprepa.example.com

# Follow the prompts:
# - Enter email address
# - Agree to terms
# - Choose whether to redirect HTTP to HTTPS (recommended: yes)

# Test automatic renewal
sudo certbot renew --dry-run
```

### Certificate Auto-Renewal

Certbot automatically sets up a cron job for renewal. Verify:

```bash
# Check renewal timer
sudo systemctl status certbot.timer

# Manual renewal test
sudo certbot renew --dry-run
```

---

## Monitoring and Maintenance

### 1. Set Up Log Rotation

```bash
# Create logrotate configuration
sudo nano /etc/logrotate.d/sosprepa
```

```
/home/sosprepa/.pm2/logs/*.log {
    daily
    rotate 7
    compress
    delaycompress
    notifempty
    missingok
    create 0640 sosprepa sosprepa
}
```

### 2. Monitor Application

```bash
# View PM2 status
sudo su - sosprepa
pm2 status

# View logs
pm2 logs sosprepa-api

# Monitor resources
pm2 monit
```

### 3. Set Up Monitoring Alerts

Consider using:
- **UptimeRobot**: Free uptime monitoring
- **Prometheus + Grafana**: Advanced monitoring
- **PM2 Plus**: PM2 monitoring service

### 4. Regular Maintenance Tasks

**Daily**:
- Check application logs
- Monitor disk space
- Check database backups

**Weekly**:
- Review error logs
- Check SSL certificate expiration
- Update dependencies (security patches)

**Monthly**:
- Full system backup
- Security audit
- Performance review

---

## Troubleshooting

### Application Won't Start

**Check PM2 logs**:
```bash
pm2 logs sosprepa-api --lines 100
```

**Common issues**:
- Database connection failed: Check DB credentials in `.env`
- Port already in use: Check if another process is using port 3000
- Missing dependencies: Run `npm install`

### Database Connection Issues

**Test connection**:
```bash
mysql -u sosprepa_user -p sos_prepa_bdd
```

**Check MySQL status**:
```bash
sudo systemctl status mysql
```

**View MySQL logs**:
```bash
sudo tail -f /var/log/mysql/error.log
```

### Nginx Issues

**Test configuration**:
```bash
sudo nginx -t
```

**View error logs**:
```bash
sudo tail -f /var/log/nginx/error.log
```

**Restart Nginx**:
```bash
sudo systemctl restart nginx
```

### SSL Certificate Issues

**Check certificate**:
```bash
sudo certbot certificates
```

**Renew certificate**:
```bash
sudo certbot renew
```

**View Certbot logs**:
```bash
sudo tail -f /var/log/letsencrypt/letsencrypt.log
```

### High Memory Usage

**Check PM2 memory**:
```bash
pm2 status
```

**Restart application**:
```bash
pm2 restart sosprepa-api
```

**Increase server resources** if consistently high

### Slow Performance

**Check database queries**:
```sql
-- Enable slow query log
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;
```

**Optimize database**:
```sql
OPTIMIZE TABLE Accountt, QCM, Question, Possible_answer, Attempt;
```

**Check server resources**:
```bash
htop
df -h
free -m
```

---

## Rollback Procedure

If deployment fails:

### 1. Rollback Backend

```bash
# Stop current version
pm2 stop sosprepa-api

# Checkout previous version
cd ~/QCM_website_vuejs
git checkout <previous-commit-hash>

# Install dependencies
cd server
npm install --production

# Restart
pm2 restart sosprepa-api
```

### 2. Rollback Frontend

```bash
# Checkout previous version
cd ~/QCM_website_vuejs
git checkout <previous-commit-hash>

# Rebuild
cd client
npm install
npm run build

# Nginx will serve the updated files automatically
```

### 3. Rollback Database

```bash
# Restore from backup
gunzip < /var/backups/sosprepa/sosprepa_YYYYMMDD_HHMMSS.sql.gz | mysql -u sosprepa_user -p sos_prepa_bdd
```

---

## Security Hardening

### 1. Firewall Configuration

```bash
# Install UFW
sudo apt install ufw

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

### 2. Fail2Ban

```bash
# Install Fail2Ban
sudo apt install fail2ban

# Configure
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo nano /etc/fail2ban/jail.local

# Enable and start
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 3. Regular Updates

```bash
# Update system packages
sudo apt update
sudo apt upgrade

# Update Node.js packages
cd ~/QCM_website_vuejs/server
npm audit
npm audit fix
```

---

## Performance Optimization

### 1. Enable HTTP/2

Already enabled in Nginx configuration (`http2` directive).

### 2. Enable Gzip Compression

Already enabled in Nginx configuration.

### 3. Database Optimization

```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_qcm_chapter ON QCM(ID_Chapter);
CREATE INDEX idx_question_qcm ON Question(ID_QCM);
CREATE INDEX idx_attempt_user ON Attempt(ID_user);
CREATE INDEX idx_attempt_qcm ON Attempt(ID_QCM);
```

### 4. Connection Pooling

Already configured in `server/config/database.js`. Adjust `DB_CONNECTION_LIMIT` based on load.

---

## Conclusion

Your SOSprépa application should now be deployed and running in production. Remember to:

- Monitor logs regularly
- Keep backups up to date
- Update dependencies for security patches
- Monitor performance and scale as needed

For support, refer to the main [README.md](README.md) or open an issue on GitHub.
