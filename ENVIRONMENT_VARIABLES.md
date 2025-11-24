# Environment Variables Documentation

This document describes all environment variables used in the SOSprépa application.

## Server Environment Variables

Location: `server/.env`

### Server Configuration

#### PORT
- **Description**: Port number on which the server will listen
- **Type**: Integer
- **Default**: 3000
- **Example**: `PORT=3000`
- **Required**: No

#### NODE_ENV
- **Description**: Node.js environment mode
- **Type**: String
- **Values**: `development`, `production`, `test`
- **Default**: development
- **Example**: `NODE_ENV=production`
- **Required**: No
- **Notes**: 
  - In production mode, detailed error messages are hidden
  - Affects logging verbosity

### Database Configuration

#### DB_HOST
- **Description**: MySQL database host address
- **Type**: String
- **Default**: localhost
- **Example**: `DB_HOST=localhost` or `DB_HOST=db.example.com`
- **Required**: Yes

#### DB_PORT
- **Description**: MySQL database port
- **Type**: Integer
- **Default**: 3306
- **Example**: `DB_PORT=3307`
- **Required**: No
- **Notes**: Only needed if using non-standard MySQL port

#### DB_USER
- **Description**: MySQL database username
- **Type**: String
- **Default**: root
- **Example**: `DB_USER=sosprepa_user`
- **Required**: Yes

#### DB_PASSWORD
- **Description**: MySQL database password
- **Type**: String
- **Default**: (empty)
- **Example**: `DB_PASSWORD=secure_password_123`
- **Required**: Yes (in production)
- **Security**: 
  - Never commit this to version control
  - Use strong passwords in production
  - Rotate regularly

#### DB_NAME
- **Description**: MySQL database name
- **Type**: String
- **Default**: sos_prepa_bdd
- **Example**: `DB_NAME=sos_prepa_bdd`
- **Required**: Yes

#### DB_CONNECTION_LIMIT
- **Description**: Maximum number of connections in the MySQL connection pool
- **Type**: Integer
- **Default**: 10
- **Example**: `DB_CONNECTION_LIMIT=20`
- **Required**: No
- **Notes**: 
  - Higher values allow more concurrent requests
  - Too high may exhaust database resources
  - Recommended: 10-50 for most applications

### JWT Configuration

#### JWT_SECRET
- **Description**: Secret key used to sign JWT tokens
- **Type**: String
- **Default**: REZMT4K5LMRSTU (development only)
- **Example**: `JWT_SECRET=your_very_secure_random_string_here`
- **Required**: Yes
- **Security**: 
  - **CRITICAL**: Change this in production!
  - Use a long, random string (minimum 32 characters)
  - Never commit production secrets to version control
  - Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

#### JWT_EXPIRES_IN
- **Description**: JWT token expiration time
- **Type**: String (time span)
- **Default**: 1h
- **Example**: 
  - `JWT_EXPIRES_IN=1h` (1 hour)
  - `JWT_EXPIRES_IN=7d` (7 days)
  - `JWT_EXPIRES_IN=30m` (30 minutes)
- **Required**: No
- **Format**: 
  - `s` for seconds
  - `m` for minutes
  - `h` for hours
  - `d` for days
- **Notes**: 
  - Shorter expiration is more secure
  - Longer expiration is more convenient
  - Recommended: 1h for production

### CORS Configuration

#### CORS_ORIGIN
- **Description**: Allowed origin for CORS requests
- **Type**: String (URL)
- **Default**: http://localhost:8080
- **Example**: 
  - Development: `CORS_ORIGIN=http://localhost:8080`
  - Production: `CORS_ORIGIN=https://sosprepa.example.com`
- **Required**: Yes
- **Notes**: 
  - Must match the frontend URL exactly
  - Include protocol (http/https)
  - No trailing slash
  - For multiple origins, modify `server/middleware/cors.js`

---

## Client Environment Variables

Location: `client/.env`

### API Configuration

#### VUE_APP_API_URL
- **Description**: Base URL for backend API
- **Type**: String (URL)
- **Default**: http://localhost:3000
- **Example**: 
  - Development: `VUE_APP_API_URL=http://localhost:3000`
  - Production: `VUE_APP_API_URL=https://api.sosprepa.example.com`
- **Required**: Yes
- **Notes**: 
  - Must match the backend server URL
  - Include protocol (http/https)
  - No trailing slash
  - Do not include `/api` suffix (added automatically)

### Application Configuration

#### VUE_APP_NAME
- **Description**: Application display name
- **Type**: String
- **Default**: SOSprépa
- **Example**: `VUE_APP_NAME=SOSprépa`
- **Required**: No
- **Notes**: Used in page titles and branding

---

## Environment-Specific Configurations

### Development Environment

**Server (.env)**:
```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=sos_prepa_bdd
DB_CONNECTION_LIMIT=10
JWT_SECRET=REZMT4K5LMRSTU
JWT_EXPIRES_IN=1h
CORS_ORIGIN=http://localhost:8080
```

**Client (.env)**:
```env
VUE_APP_API_URL=http://localhost:3000
VUE_APP_NAME=SOSprépa
```

### Production Environment

**Server (.env)**:
```env
PORT=3000
NODE_ENV=production
DB_HOST=your-production-db-host
DB_USER=sosprepa_prod_user
DB_PASSWORD=your_very_secure_password
DB_NAME=sos_prepa_bdd
DB_CONNECTION_LIMIT=20
JWT_SECRET=your_very_secure_random_string_minimum_32_characters
JWT_EXPIRES_IN=1h
CORS_ORIGIN=https://sosprepa.example.com
```

**Client (.env.production)**:
```env
VUE_APP_API_URL=https://api.sosprepa.example.com
VUE_APP_NAME=SOSprépa
```

### Test Environment

**Server (.env.test)**:
```env
PORT=3001
NODE_ENV=test
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=sos_prepa_bdd_test
DB_CONNECTION_LIMIT=5
JWT_SECRET=test_secret_key
JWT_EXPIRES_IN=1h
CORS_ORIGIN=http://localhost:8081
```

---

## Security Best Practices

### 1. Never Commit Secrets

Add `.env` files to `.gitignore`:
```
# Environment variables
.env
.env.local
.env.production
.env.test
```

### 2. Use Strong Secrets

Generate secure JWT secrets:
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32
```

### 3. Rotate Secrets Regularly

- Change JWT_SECRET periodically (will invalidate all tokens)
- Update database passwords regularly
- Use different secrets for different environments

### 4. Restrict Database Access

- Use dedicated database users with minimal privileges
- Don't use root user in production
- Grant only necessary permissions:
  ```sql
  CREATE USER 'sosprepa_user'@'localhost' IDENTIFIED BY 'secure_password';
  GRANT SELECT, INSERT, UPDATE, DELETE ON sos_prepa_bdd.* TO 'sosprepa_user'@'localhost';
  FLUSH PRIVILEGES;
  ```

### 5. Use Environment-Specific Configurations

- Never use development secrets in production
- Use different database instances for dev/test/prod
- Test with production-like configurations

---

## Troubleshooting

### "Cannot connect to database"

**Check**:
- DB_HOST is correct
- DB_PORT matches your MySQL configuration
- DB_USER and DB_PASSWORD are correct
- Database exists: `SHOW DATABASES;`
- User has permissions: `SHOW GRANTS FOR 'user'@'host';`

### "CORS error" in browser console

**Check**:
- CORS_ORIGIN matches frontend URL exactly
- Include protocol (http/https)
- No trailing slash
- Server is running

### "Invalid token" errors

**Check**:
- JWT_SECRET is the same across server restarts
- Token hasn't expired (check JWT_EXPIRES_IN)
- Token is being sent in Authorization header
- Token format: `Bearer <token>`

### "Port already in use"

**Check**:
- Another process is using the PORT
- Change PORT to a different value
- Kill the process using the port:
  ```bash
  # Linux/Mac
  lsof -ti:3000 | xargs kill
  
  # Windows
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  ```

---

## Environment Variable Validation

The application validates environment variables on startup. Missing or invalid variables will cause the server to fail with descriptive error messages.

### Required Variables

**Server**:
- DB_HOST
- DB_USER
- DB_NAME
- JWT_SECRET
- CORS_ORIGIN

**Client**:
- VUE_APP_API_URL

### Optional Variables

All other variables have sensible defaults and are optional.

---

## Docker Configuration

If using Docker, pass environment variables via:

1. **docker-compose.yml**:
```yaml
services:
  backend:
    environment:
      - PORT=3000
      - DB_HOST=db
      - DB_USER=root
      - DB_PASSWORD=password
      - DB_NAME=sos_prepa_bdd
      - JWT_SECRET=${JWT_SECRET}
      - CORS_ORIGIN=http://localhost:8080
```

2. **.env file** (referenced in docker-compose.yml):
```env
JWT_SECRET=your_secure_secret
```

3. **Command line**:
```bash
docker run -e PORT=3000 -e DB_HOST=localhost ...
```

---

## Additional Resources

- [dotenv documentation](https://github.com/motdotla/dotenv)
- [Vue CLI Environment Variables](https://cli.vuejs.org/guide/mode-and-env.html)
- [Node.js Best Practices - Environment Variables](https://github.com/goldbergyoni/nodebestpractices#6-security-best-practices)
