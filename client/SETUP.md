# Vue.js Frontend Configuration

## Overview
This Vue.js 3 application uses modern tooling and libraries for state management and API communication.

## Installed Dependencies

### Core Framework
- **Vue 3** (^3.2.13) - Progressive JavaScript framework
- **Vue Router** (^4.6.3) - Official router for Vue.js

### State Management
- **Pinia** (^3.0.4) - Official state management library for Vue 3

### HTTP Client
- **Axios** (^1.13.2) - Promise-based HTTP client

## Project Structure

```
client/
├── src/
│   ├── assets/          # CSS files and static assets
│   │   ├── answer.css
│   │   ├── correct.css
│   │   ├── create-qcm.css
│   │   ├── lessons.css
│   │   ├── login.css
│   │   ├── select-qcm.css
│   │   └── styles.css
│   ├── components/      # Reusable Vue components
│   ├── router/          # Vue Router configuration
│   │   └── index.js
│   ├── services/        # API services
│   │   └── api.js       # Axios instance with interceptors
│   ├── stores/          # Pinia stores
│   │   ├── auth.js      # Authentication store
│   │   └── notification.js  # Notification/flash messages store
│   ├── views/           # Page components
│   ├── App.vue          # Root component
│   └── main.js          # Application entry point
```

## Configuration Details

### Pinia Store
Configured in `main.js` and available throughout the application for state management.

**Stores:**
- `auth.js` - Manages user authentication state, login/logout, and token handling
- `notification.js` - Manages flash messages and notifications

### Axios API Service
Configured in `services/api.js` with:
- Base URL: `http://localhost:3000`
- Request interceptor: Automatically adds JWT token to requests
- Response interceptor: Handles 401 errors and redirects to login

### Vue Router
Configured in `router/index.js` with routes for:
- `/` - Home page
- `/login` - Login page
- `/register` - Registration page
- `/qcm/create` - QCM creation (requires auth + teacher role)
- `/qcm/select` - QCM selection (requires auth)
- `/qcm/:id/answer` - Answer QCM (requires auth)
- `/qcm/:qcmId/correction/:attemptId` - View correction (requires auth)
- `/lessons` - View lessons/PDFs

## Running the Application

```bash
# Install dependencies
npm install

# Run development server
npm run serve

# Build for production
npm run build

# Lint and fix files
npm run lint
```

## API Integration

The application communicates with a Node.js/Express backend running on `http://localhost:3000`.

All authenticated requests automatically include the JWT token from localStorage in the Authorization header.

## CSS Files

All existing CSS files from the PHP version have been preserved in `src/assets/`:
- `styles.css` - Global styles
- `login.css` - Login/register page styles
- `create-qcm.css` - QCM creation form styles
- `select-qcm.css` - QCM selection page styles
- `answer.css` - QCM answer page styles
- `correct.css` - Correction page styles
- `lessons.css` - Lessons page styles
