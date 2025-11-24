# SOSprépa Backend Server

Node.js/Express backend API for the SOSprépa QCM platform.

## 📋 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Database](#database)
- [Deployment](#deployment)

## ✨ Features

- **RESTful API**: Clean, well-documented API endpoints
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access**: Teacher and student roles with different permissions
- **MySQL Database**: Relational database with connection pooling
- **Automatic Scoring**: Intelligent QCM scoring algorithm
- **Transaction Support**: Database transactions for data integrity
- **Error Handling**: Centralized error handling with meaningful messages
- **CORS Support**: Configured for cross-origin requests

## 🔧 Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MySQL (v5.7 or higher)

## 📦 Installation

```bash
# Install dependencies
npm install
```

## ⚙️ Configuration

### Environment Variables

1. Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

2. Edit `.env` with your configuration:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=sos_prepa_bdd
DB_CONNECTION_LIMIT=10

# JWT Configuration
JWT_SECRET=your_secure_secret_key
JWT_EXPIRES_IN=1h

# CORS Configuration
CORS_ORIGIN=http://localhost:8080
```

**Important**: 
- Change `JWT_SECRET` to a secure random string in production
- Use strong database passwords
- See [ENVIRONMENT_VARIABLES.md](../ENVIRONMENT_VARIABLES.md) for detailed documentation

### Database Setup

1. Create the database:

```sql
CREATE DATABASE sos_prepa_bdd;
```

2. Import the schema:

```bash
mysql -u root -p sos_prepa_bdd < ../former_project/sosprepa_creation.sql
```

3. (Optional) Import sample data:

```bash
mysql -u root -p sos_prepa_bdd < ../former_project/sosprepa_JeuxDonnées.sql
```

## 🏃 Running the Server

### Development Mode

```bash
# Start the server
npm start

# Or with auto-reload (if nodemon is installed)
npm run dev
```

The server will start on `http://localhost:3000` (or the port specified in `.env`).

### Production Mode

```bash
NODE_ENV=production npm start
```

### Using PM2 (Recommended for Production)

```bash
# Install PM2 globally
npm install -g pm2

# Start the server
pm2 start app.js --name sosprepa-api

# Save the process list
pm2 save

# Set up auto-start on system boot
pm2 startup
```

## 📁 Project Structure

```
server/
├── config/              # Configuration files
│   ├── database.js      # MySQL connection pool
│   └── jwt.js           # JWT configuration
│
├── middleware/          # Express middleware
│   ├── auth.js          # JWT authentication
│   ├── cors.js          # CORS configuration
│   └── errorHandler.js  # Global error handler
│
├── routes/              # API route definitions
│   ├── auth.js          # Authentication routes
│   ├── qcm.js           # QCM routes
│   ├── subjects.js      # Subject/Chapter routes
│   ├── attempts.js      # Attempt routes
│   └── index.js         # Main router
│
├── services/            # Business logic
│   ├── auth.js          # Authentication service
│   └── scoring.js       # Scoring algorithms
│
├── tests/               # Test files
│   ├── integration/     # Integration tests
│   ├── properties/      # Property-based tests
│   └── unit/            # Unit tests
│
├── .env                 # Environment variables (not in git)
├── .env.example         # Example environment variables
├── app.js               # Application entry point
├── package.json         # Dependencies and scripts
└── vitest.config.js     # Test configuration
```

## 📚 API Documentation

See [API_DOCUMENTATION.md](../API_DOCUMENTATION.md) for complete API reference.

### Quick Reference

**Base URL**: `http://localhost:3000/api`

**Main Endpoints**:
- `POST /register` - Register new user
- `POST /login` - Login and get JWT token
- `GET /subjects` - Get all subjects
- `GET /chapters` - Get chapters
- `GET /qcm` - Get QCMs (filtered)
- `POST /qcm/create` - Create QCM (teacher only)
- `POST /qcm/:id/submit` - Submit answers
- `GET /qcm/:qcmId/correction/:attemptId` - Get correction
- `GET /attempts` - Get user attempts

### Authentication

Most endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Types

#### Unit Tests
Located in `tests/unit/`, these test individual functions and services.

Example:
```bash
# Run only unit tests
npm test -- tests/unit
```

#### Integration Tests
Located in `tests/integration/`, these test API endpoints and workflows.

Example:
```bash
# Run only integration tests
npm test -- tests/integration
```

#### Property-Based Tests
Located in `tests/properties/`, these test properties across random inputs using fast-check.

Example:
```bash
# Run only property tests
npm test -- tests/properties
```

### Test Coverage

View coverage report:
```bash
npm run test:coverage
```

Coverage reports are generated in `coverage/` directory.

## 🗄️ Database

### Connection Pool

The server uses a MySQL connection pool for better performance:
- **Reusable connections**: Connections are reused across requests
- **Automatic management**: Pool handles connection lifecycle
- **Keep-alive**: Prevents connection timeouts
- **Configurable limit**: Set via `DB_CONNECTION_LIMIT` environment variable

### Schema

The database schema includes:
- **Accountt**: User accounts
- **Subjectt**: Academic subjects
- **Chapter**: Chapters within subjects
- **QCM**: Questionnaires
- **Question**: Questions within QCMs
- **Possible_answer**: Answer propositions
- **Attempt**: User attempts at QCMs
- **Answer_question**: Points earned per question
- **Has_answered**: User's selected propositions

See `../former_project/sosprepa_creation.sql` for complete schema.

### Migrations

Currently, the application uses the existing database schema without migrations. For schema changes:

1. Backup the database
2. Apply SQL changes manually
3. Update application code
4. Test thoroughly

## 🚀 Deployment

### Deployment Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET`
- [ ] Use strong database password
- [ ] Configure `CORS_ORIGIN` for production domain
- [ ] Set up SSL/TLS (HTTPS)
- [ ] Configure firewall rules
- [ ] Set up database backups
- [ ] Configure logging
- [ ] Set up monitoring
- [ ] Test all endpoints

### Deployment Scripts

Use the provided deployment scripts:

```bash
# Deploy backend only
../scripts/deploy-backend.sh

# Or on Windows
..\scripts\deploy-backend.bat
```

### Manual Deployment

1. **Install dependencies**:
```bash
npm install --production
```

2. **Set environment variables**:
```bash
export NODE_ENV=production
export PORT=3000
# ... other variables
```

3. **Start the server**:
```bash
npm start
```

### Using PM2

```bash
# Start
pm2 start app.js --name sosprepa-api

# Monitor
pm2 monit

# View logs
pm2 logs sosprepa-api

# Restart
pm2 restart sosprepa-api

# Stop
pm2 stop sosprepa-api
```

### Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM node:14-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["node", "app.js"]
```

Build and run:

```bash
docker build -t sosprepa-api .
docker run -p 3000:3000 --env-file .env sosprepa-api
```

## 🔒 Security

### Best Practices

1. **Environment Variables**: Never commit `.env` to version control
2. **JWT Secret**: Use a strong, random secret (minimum 32 characters)
3. **Database**: Use parameterized queries (already implemented)
4. **Passwords**: Hashed with bcrypt (already implemented)
5. **CORS**: Configure allowed origins properly
6. **HTTPS**: Use SSL/TLS in production
7. **Rate Limiting**: Consider implementing for production
8. **Input Validation**: All inputs are validated (already implemented)

### Security Headers

Consider adding security headers in production:

```javascript
// Add to app.js
const helmet = require('helmet');
app.use(helmet());
```

## 🐛 Troubleshooting

### Cannot connect to database

**Check**:
- MySQL is running
- Database exists
- Credentials are correct
- Host and port are correct

**Test connection**:
```bash
mysql -h localhost -u root -p sos_prepa_bdd
```

### Port already in use

**Solution**:
```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process
kill -9 <PID>

# Or change PORT in .env
```

### JWT token errors

**Check**:
- `JWT_SECRET` is set
- Token is being sent in Authorization header
- Token format: `Bearer <token>`
- Token hasn't expired

### CORS errors

**Check**:
- `CORS_ORIGIN` matches frontend URL exactly
- Include protocol (http/https)
- No trailing slash

## 📊 Monitoring

### Health Check

```bash
curl http://localhost:3000/api/health
```

Response:
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Logging

Logs are written to console. In production, consider:
- Using a logging library (winston, pino)
- Writing logs to files
- Sending logs to a logging service

### Performance Monitoring

Consider implementing:
- Response time tracking
- Database query performance monitoring
- Error rate monitoring
- Resource usage monitoring

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MySQL2 Documentation](https://github.com/sidorares/node-mysql2)
- [JWT Documentation](https://jwt.io/)
- [bcrypt Documentation](https://github.com/kelektiv/node.bcrypt.js)
- [Vitest Documentation](https://vitest.dev/)

## 🤝 Contributing

See the main [README.md](../README.md) for contribution guidelines.

## 📝 License

ISC License
