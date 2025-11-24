# Navigation Guards Test Plan

## Manual Testing Checklist

### Test 1: Unauthenticated User Access to Protected Routes

**Requirement**: 1.3, 1.4

**Steps**:
1. Clear localStorage (logout if logged in)
2. Navigate to `http://localhost:8080/qcm/select`
3. **Expected**: Redirected to `/login` with error message "Vous devez être connecté pour accéder à cette page."

**Test Cases**:
- [ ] `/qcm/select` → redirects to `/login`
- [ ] `/qcm/1/answer` → redirects to `/login`
- [ ] `/qcm/1/correction/1` → redirects to `/login`
- [ ] `/qcm/create` → redirects to `/login`

### Test 2: Student Access to Teacher-Only Routes

**Requirement**: 2.2, 2.3

**Steps**:
1. Login as a student (teacher = false)
2. Navigate to `http://localhost:8080/qcm/create`
3. **Expected**: Redirected to `/` (home) with error message "Accès réservé aux professeurs."

**Test Cases**:
- [ ] Student tries to access `/qcm/create` → redirects to `/`
- [ ] Error notification displays "Accès réservé aux professeurs."

### Test 3: Teacher Access to Teacher-Only Routes

**Requirement**: 2.2

**Steps**:
1. Login as a teacher (teacher = true)
2. Navigate to `http://localhost:8080/qcm/create`
3. **Expected**: Successfully displays the CreateQCM page

**Test Cases**:
- [ ] Teacher can access `/qcm/create`
- [ ] CreateQCM form is displayed

### Test 4: Token Verification on Protected Route Access

**Requirement**: 1.3, 1.4

**Steps**:
1. Login successfully
2. Manually modify the token in localStorage to an invalid value
3. Navigate to a protected route (e.g., `/qcm/select`)
4. **Expected**: Token verification fails, redirected to `/login` with message "Votre session a expiré. Veuillez vous reconnecter."

**Test Cases**:
- [ ] Invalid token triggers verification
- [ ] User is logged out (localStorage cleared)
- [ ] Redirected to `/login`
- [ ] Error notification displays

### Test 5: Authenticated User on Login/Register Pages

**Steps**:
1. Login successfully
2. Navigate to `http://localhost:8080/login`
3. **Expected**: Redirected to `/` (home)

**Test Cases**:
- [ ] Authenticated user accessing `/login` → redirects to `/`
- [ ] Authenticated user accessing `/register` → redirects to `/`

### Test 6: Token Expiration Handling

**Requirement**: 1.4

**Steps**:
1. Login successfully
2. Wait for token to expire (or manually set an expired token)
3. Navigate to a protected route
4. **Expected**: Token verification fails, redirected to `/login`

**Test Cases**:
- [ ] Expired token detected by backend
- [ ] User is logged out
- [ ] Redirected to `/login`
- [ ] Session expired message displayed

### Test 7: Notification Clearing on Navigation

**Steps**:
1. Trigger an error notification (e.g., failed login)
2. Navigate to another page
3. **Expected**: Previous notification is cleared

**Test Cases**:
- [ ] Notifications cleared on route change
- [ ] No stale messages persist

### Test 8: Redirect After Login

**Steps**:
1. Try to access `/qcm/select` while not logged in
2. Get redirected to `/login?redirect=/qcm/select`
3. Login successfully
4. **Expected**: Redirected back to `/qcm/select`

**Test Cases**:
- [ ] Redirect query parameter is set
- [ ] After login, user is redirected to original destination

## Automated Test Scenarios (Future Implementation)

### Unit Tests for Navigation Guards

```javascript
describe('Navigation Guards', () => {
  it('should redirect unauthenticated users to login', async () => {
    // Test implementation
  });
  
  it('should redirect non-teachers from teacher routes', async () => {
    // Test implementation
  });
  
  it('should verify token before accessing protected routes', async () => {
    // Test implementation
  });
  
  it('should redirect authenticated users from login page', async () => {
    // Test implementation
  });
});
```

### Integration Tests

```javascript
describe('Navigation Guard Integration', () => {
  it('should complete full authentication flow', async () => {
    // 1. Try to access protected route
    // 2. Get redirected to login
    // 3. Login successfully
    // 4. Get redirected back to original route
  });
  
  it('should handle token expiration gracefully', async () => {
    // 1. Login with short-lived token
    // 2. Wait for expiration
    // 3. Try to access protected route
    // 4. Verify logout and redirect
  });
});
```

## Requirements Coverage

✅ **Requirement 1.3**: Token validation for protected resources
- Implemented in router guard with `authStore.checkAuth()` call

✅ **Requirement 1.4**: Invalid token rejection
- Invalid/expired tokens trigger logout and redirect with error message

✅ **Requirement 2.2**: Teacher access to QCM creation
- Teachers can access routes with `meta.requiresTeacher`

✅ **Requirement 2.3**: Student denial of QCM creation access
- Non-teachers redirected to home with error message

## Implementation Summary

The navigation guards are fully implemented with:

1. **Global beforeEach guard** in `router/index.js`
2. **Token verification** via `authStore.checkAuth()`
3. **Role-based access control** via `meta.requiresTeacher`
4. **Error notifications** for unauthorized access
5. **Redirect handling** for login flow
6. **Session management** with localStorage

All requirements (1.3, 1.4, 2.2, 2.3) are satisfied by the implementation.
