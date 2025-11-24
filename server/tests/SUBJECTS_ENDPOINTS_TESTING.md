# Testing Subjects and Chapters Endpoints

This document describes how to test the subjects and chapters endpoints once the database is properly set up.

## Prerequisites

1. MySQL database `sos_prepa_bdd` must exist
2. Tables `Subjectt`, `Chapter`, and `Accountt` must be created using the SQL schema
3. Server must be running on `http://localhost:3000`

## Endpoints Implemented

### 1. GET /api/subjects
Retrieves all subjects from the database.

**Request:**
```bash
curl http://localhost:3000/api/subjects
```

**Expected Response:**
```json
{
  "success": true,
  "subjects": [
    {
      "id": 1,
      "name": "Mathématiques"
    },
    {
      "id": 2,
      "name": "Probabilités"
    }
  ]
}
```

**Requirements Validated:** 4.1

---

### 2. GET /api/chapters
Retrieves all chapters, optionally filtered by subjectId.

**Request (all chapters):**
```bash
curl http://localhost:3000/api/chapters
```

**Request (filtered by subject):**
```bash
curl http://localhost:3000/api/chapters?subjectId=1
```

**Expected Response:**
```json
{
  "success": true,
  "chapters": [
    {
      "id": 1,
      "name": "Algèbre",
      "subjectId": 1
    },
    {
      "id": 2,
      "name": "Géométrie",
      "subjectId": 1
    }
  ]
}
```

**Requirements Validated:** 4.2, 4.3

---

### 3. POST /api/subjects/create
Creates a new subject (requires authentication and teacher role).

**Request:**
```bash
curl -X POST http://localhost:3000/api/subjects/create \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"subjectName": "Physique"}'
```

**Expected Response (Success):**
```json
{
  "success": true,
  "message": "Matière créée avec succès",
  "subjectId": 3
}
```

**Expected Response (Unauthorized - No Token):**
```json
{
  "success": false,
  "message": "Authorization header required"
}
```

**Expected Response (Forbidden - Not a Teacher):**
```json
{
  "success": false,
  "message": "Accès réservé aux professeurs"
}
```

**Expected Response (Validation Error):**
```json
{
  "success": false,
  "message": "Le nom de la matière est requis"
}
```

**Expected Response (Duplicate):**
```json
{
  "success": false,
  "message": "Cette matière existe déjà"
}
```

**Requirements Validated:** 4.1, 2.1, 2.3

---

### 4. POST /api/chapters/create
Creates a new chapter (requires authentication and teacher role).

**Request:**
```bash
curl -X POST http://localhost:3000/api/chapters/create \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"chapterName": "Mécanique", "subjectId": 3}'
```

**Expected Response (Success):**
```json
{
  "success": true,
  "message": "Chapitre créé avec succès",
  "chapterId": 5
}
```

**Expected Response (Subject Not Found):**
```json
{
  "success": false,
  "message": "Matière non trouvée"
}
```

**Expected Response (Validation Error):**
```json
{
  "success": false,
  "message": "Le nom du chapitre est requis"
}
```

**Expected Response (Duplicate):**
```json
{
  "success": false,
  "message": "Ce chapitre existe déjà pour cette matière"
}
```

**Requirements Validated:** 4.2, 2.1, 2.3

---

## How to Get a JWT Token for Testing

1. Register a teacher account:
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testteacher","email":"teacher@test.com","password":"password123","teacher":true}'
```

2. Login to get the token:
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teacher@test.com","password":"password123"}'
```

3. Use the returned token in the Authorization header:
```
Authorization: Bearer <token_from_login_response>
```

---

## Implementation Details

### Middleware Used

1. **authenticateToken**: Verifies JWT token and attaches user info to request
2. **requireTeacher**: Checks if authenticated user has teacher role

### Database Queries

- All queries use parameterized statements to prevent SQL injection
- Subject and chapter names are trimmed before insertion
- Duplicate checks are performed before insertion
- Foreign key validation ensures referenced subjects exist

### Error Handling

- 400: Validation errors (missing or invalid input)
- 401: Authentication errors (missing or invalid token)
- 403: Authorization errors (user is not a teacher)
- 404: Resource not found (subject doesn't exist)
- 409: Conflict errors (duplicate names)
- 500: Server errors (database errors, etc.)

---

## Testing Checklist

- [ ] GET /api/subjects returns empty array when no subjects exist
- [ ] GET /api/subjects returns all subjects when they exist
- [ ] GET /api/chapters returns empty array when no chapters exist
- [ ] GET /api/chapters returns all chapters when no filter is provided
- [ ] GET /api/chapters filters by subjectId correctly
- [ ] POST /api/subjects/create requires authentication
- [ ] POST /api/subjects/create requires teacher role
- [ ] POST /api/subjects/create validates input
- [ ] POST /api/subjects/create prevents duplicates
- [ ] POST /api/subjects/create returns new subject ID
- [ ] POST /api/chapters/create requires authentication
- [ ] POST /api/chapters/create requires teacher role
- [ ] POST /api/chapters/create validates input
- [ ] POST /api/chapters/create verifies subject exists
- [ ] POST /api/chapters/create prevents duplicates within same subject
- [ ] POST /api/chapters/create returns new chapter ID
