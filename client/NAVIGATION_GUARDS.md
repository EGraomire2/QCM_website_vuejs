# Navigation Guards Implementation

## Overview

The navigation guards have been implemented in `client/src/router/index.js` to protect routes and manage user access based on authentication status and role.

## Implementation Details

### Guard Functions

The router uses a global `beforeEach` navigation guard that:

1. **Clears notifications on navigation** - Ensures old messages don't persist
2. **Verifies token validity** - For protected routes, checks if the JWT token is still valid
3. **Checks authentication** - Redirects to login if user is not authenticated
4. **Checks teacher role** - Redirects to home if user is not a teacher for teacher-only routes
5. **Prevents authenticated users from accessing login/register** - Redirects to home

### Route Meta Fields

Routes use meta fields to specify protection requirements:

```javascript
{
  path: '/qcm/create',
  name: 'CreateQCM',
  component: CreateQcmView,
  meta: { 
    requiresAuth: true,      // Requires authentication
    requiresTeacher: true    // Requires teacher role
  }
}
```

### Authentication Flow

1. **On App Load** (`main.js`):
   - `authStore.initializeFromStorage()` loads token and user from localStorage
   - Sets initial authentication state

2. **On Navigation** (`router/index.js`):
   - Guard checks if route requires authentication
   - If authenticated and accessing protected route, verifies token with backend
   - If token is invalid/expired, clears auth and redirects to login
   - If valid, checks role requirements

3. **Token Verification**:
   - Calls `authStore.checkAuth()` which hits `/api/auth/verify`
   - Updates user data if valid
   - Clears auth state if invalid

### Protected Routes

- `/qcm/select` - Requires authentication
- `/qcm/:id/answer` - Requires authentication
- `/qcm/:qcmId/correction/:attemptId` - Requires authentication
- `/qcm/create` - Requires authentication AND teacher role

### Public Routes

- `/` - Home (accessible to all)
- `/login` - Login page
- `/register` - Registration page
- `/lessons` - Lessons page (accessible to all)

## Requirements Validation

✅ **Requirement 1.3**: Token validation for protected resources
- Implemented via `authStore.checkAuth()` call before accessing protected routes

✅ **Requirement 1.4**: Invalid token rejection
- Invalid/expired tokens trigger logout and redirect to login with error message

✅ **Requirement 2.2**: Teacher access to QCM creation
- Implemented via `meta.requiresTeacher` check

✅ **Requirement 2.3**: Student denial of QCM creation access
- Non-teacher users redirected to home with error message

## Error Messages

- **Not authenticated**: "Vous devez être connecté pour accéder à cette page."
- **Session expired**: "Votre session a expiré. Veuillez vous reconnecter."
- **Not authorized (teacher only)**: "Accès réservé aux professeurs."

## Testing

To test the navigation guards:

1. **Test unauthenticated access**:
   - Try to access `/qcm/select` without logging in
   - Should redirect to `/login` with error message

2. **Test student access to teacher routes**:
   - Login as a student
   - Try to access `/qcm/create`
   - Should redirect to `/` with error message

3. **Test token expiration**:
   - Login and wait for token to expire
   - Try to access a protected route
   - Should redirect to `/login` with session expired message

4. **Test authenticated user on login page**:
   - Login successfully
   - Try to access `/login` or `/register`
   - Should redirect to `/` (home)
