# SOSprépa - QCM Platform

SOSprépa is a modern web application for creating and taking multiple-choice questionnaires (QCM). Built with Vue.js 3 for the frontend and Node.js/Express for the backend, it provides a complete platform for teachers to create quizzes and students to test their knowledge.

## 🚀 Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Role-Based Access**: Separate interfaces for teachers and students
- **QCM Creation**: Teachers can create quizzes with single or multiple-choice questions
- **Automatic Scoring**: Intelligent scoring system with support for negative points
- **Detailed Corrections**: Students can review their answers with explanations
- **Subject Organization**: Organize quizzes by subjects and chapters
- **PDF Lessons**: Access to revision materials in PDF format
- **Responsive Design**: Works on desktop and mobile devices

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **MySQL** (v5.7 or higher)
- **Git**

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/EGraomire2/QCM_website_vuejs.git
cd QCM_website_vuejs
```

### 2. Install Dependencies

Install dependencies for both the root project, server, and client:

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Database Setup

1. Create a MySQL database:

```sql
CREATE DATABASE sos_prepa_bdd;
```

2. Import the database schema from `former_project/sosprepa_creation.sql`:

```bash
mysql -u root -p sos_prepa_bdd < former_project/sosprepa_creation.sql
```

3. (Optional) Import sample data from `former_project/sosprepa_JeuxDonnées.sql`:

```bash
mysql -u root -p sos_prepa_bdd < former_project/sosprepa_JeuxDonnées.sql
```

## ⚙️ Configuration

### Server Configuration

1. Navigate to the `server` directory
2. Copy `.env.example` to `.env`:

```bash
cd server
cp .env.example .env
```

3. Edit `.env` with your configuration:

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
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=1h

# CORS Configuration
CORS_ORIGIN=http://localhost:8080
```

**Important**: Change `JWT_SECRET` to a secure random string in production.

### Client Configuration

1. Navigate to the `client` directory
2. Copy `.env.example` to `.env`:

```bash
cd client
cp .env.example .env
```

3. Edit `.env` with your configuration:

```env
# API Configuration
VUE_APP_API_URL=http://localhost:3000

# Application Configuration
VUE_APP_NAME=SOSprépa
```

## 🏃 Running the Application

### Development Mode

You can run both the server and client simultaneously from the root directory:

```bash
# From the root directory
npm run dev
```

This will start:
- Backend server on `http://localhost:3000`
- Frontend client on `http://localhost:8080`

### Running Separately

**Backend Server:**

```bash
cd server
npm start
# or for development with auto-reload
npm run dev
```

**Frontend Client:**

```bash
cd client
npm run serve
```

### Production Build

**Build the client:**

```bash
cd client
npm run build
```

The production-ready files will be in `client/dist/`.

## 📁 Project Structure

```
QCM_website_vuejs/
├── client/                 # Vue.js frontend application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── assets/        # CSS and images
│   │   ├── components/    # Reusable Vue components
│   │   ├── router/        # Vue Router configuration
│   │   ├── services/      # API service layer
│   │   ├── stores/        # Pinia state management
│   │   ├── views/         # Page components
│   │   ├── App.vue        # Root component
│   │   └── main.js        # Application entry point
│   ├── .env               # Environment variables
│   └── package.json       # Client dependencies
│
├── server/                # Node.js/Express backend
│   ├── config/           # Configuration files
│   │   ├── database.js   # MySQL connection pool
│   │   └── jwt.js        # JWT configuration
│   ├── middleware/       # Express middleware
│   │   ├── auth.js       # Authentication middleware
│   │   ├── cors.js       # CORS configuration
│   │   └── errorHandler.js # Error handling
│   ├── routes/           # API route definitions
│   │   ├── auth.js       # Authentication routes
│   │   ├── qcm.js        # QCM routes
│   │   ├── subjects.js   # Subject/Chapter routes
│   │   ├── attempts.js   # Attempt routes
│   │   └── index.js      # Main router
│   ├── services/         # Business logic
│   │   ├── auth.js       # Authentication service
│   │   └── scoring.js    # Scoring algorithms
│   ├── tests/            # Test files
│   │   ├── integration/  # Integration tests
│   │   ├── properties/   # Property-based tests
│   │   └── unit/         # Unit tests
│   ├── .env              # Environment variables
│   ├── app.js            # Application entry point
│   └── package.json      # Server dependencies
│
├── former_project/        # Original PHP application (reference)
├── package.json          # Root dependencies
└── README.md             # This file
```

## 📚 Documentation

### Core Documentation

- **[API Documentation](./API_DOCUMENTATION.md)** - Complete API reference with examples
- **[Environment Variables](./ENVIRONMENT_VARIABLES.md)** - Detailed environment configuration guide
- **[Deployment Guide](./DEPLOYMENT_GUIDE.md)** - Step-by-step production deployment instructions
- **[Contributing Guide](./CONTRIBUTING.md)** - Guidelines for contributing to the project

### Component Documentation

- **[Server README](./server/README.md)** - Backend server documentation
- **[Client README](./client/README.md)** - Frontend application documentation

## 📚 API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API reference.

### Quick Reference

**Base URL**: `http://localhost:3000/api`

**Authentication**: Most endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Main Endpoints

- **Authentication**
  - `POST /register` - Register a new user
  - `POST /login` - Login and get JWT token
  - `GET /auth/verify` - Verify token validity
  - `POST /logout` - Logout user

- **Subjects & Chapters**
  - `GET /subjects` - Get all subjects
  - `GET /chapters?subjectId=X` - Get chapters (filtered by subject)
  - `POST /subjects/create` - Create new subject (teacher only)
  - `POST /chapters/create` - Create new chapter (teacher only)

- **QCM**
  - `GET /qcm?subjectId=X&chapterId=Y` - Get QCMs (filtered)
  - `GET /qcm/:id` - Get QCM with questions
  - `POST /qcm/create` - Create new QCM (teacher only)
  - `POST /qcm/:id/submit` - Submit answers
  - `GET /qcm/:qcmId/correction/:attemptId` - Get correction

- **Attempts**
  - `GET /attempts` - Get user's attempts

## 🧪 Testing

### Backend Tests

```bash
cd server

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Types

- **Unit Tests**: Test individual functions and services
- **Integration Tests**: Test API endpoints and workflows
- **Property-Based Tests**: Test properties across random inputs

## 🚀 Deployment

### Deployment Scripts

Deployment scripts are provided in the `scripts/` directory:

```bash
# Deploy to production
./scripts/deploy.sh

# Deploy backend only
./scripts/deploy-backend.sh

# Deploy frontend only
./scripts/deploy-frontend.sh
```

### Manual Deployment

#### Backend Deployment

1. Set environment variables for production
2. Install dependencies: `npm install --production`
3. Start the server: `npm start`
4. Use a process manager like PM2:

```bash
npm install -g pm2
pm2 start server/app.js --name sosprepa-api
pm2 save
pm2 startup
```

#### Frontend Deployment

1. Build the production bundle:

```bash
cd client
npm run build
```

2. Serve the `dist/` folder using a web server (nginx, Apache, etc.)

Example nginx configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/client/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Environment Variables for Production

**Server (.env):**
```env
NODE_ENV=production
PORT=3000
DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASSWORD=your-secure-password
DB_NAME=sos_prepa_bdd
JWT_SECRET=your-very-secure-secret-key
JWT_EXPIRES_IN=1h
CORS_ORIGIN=https://your-domain.com
```

**Client (.env.production):**
```env
VUE_APP_API_URL=https://your-domain.com/api
VUE_APP_NAME=SOSprépa
```

## 🔒 Security Considerations

- Always use HTTPS in production
- Keep JWT_SECRET secure and never commit it to version control
- Use strong passwords for database access
- Regularly update dependencies
- Implement rate limiting for API endpoints
- Validate and sanitize all user inputs
- Use parameterized queries to prevent SQL injection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 👥 Authors

- Original PHP version: [Project contributors]
- Vue.js/Node.js migration: [Your name]

## 🐛 Known Issues

See [ISSUES.md](./ISSUES.md) for known issues and planned improvements.

## 📞 Support

For support, please open an issue on GitHub or contact the development team.