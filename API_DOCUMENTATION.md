# API Documentation

## Base URL

```
http://localhost:3000/api
```

For production, replace with your production URL.

## Authentication

Most endpoints require authentication using JWT (JSON Web Tokens). Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Token Expiration

Tokens expire after 1 hour by default (configurable via `JWT_EXPIRES_IN` environment variable).

## Response Format

All API responses follow this format:

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description"
}
```

## HTTP Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request parameters
- `401 Unauthorized` - Authentication required or token invalid
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource already exists
- `500 Internal Server Error` - Server error

---

## Endpoints

### Health Check

#### GET /health

Check if the API is running.

**Authentication**: Not required

**Response**:
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## Authentication Endpoints

### Register User

#### POST /register

Register a new user account.

**Authentication**: Not required

**Request Body**:
```json
{
  "username": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "teacher": false
}
```

**Parameters**:
- `username` (string, required): User's display name
- `email` (string, required): Valid email address
- `password` (string, required): Password (minimum 6 characters)
- `teacher` (boolean, optional): Whether user is a teacher (default: false)

**Success Response** (201):
```json
{
  "success": true,
  "message": "Utilisateur créé avec succès"
}
```

**Error Responses**:
- `400`: Missing required fields or invalid email
- `409`: Email already exists

---

### Login

#### POST /login

Authenticate a user and receive a JWT token.

**Authentication**: Not required

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Parameters**:
- `email` (string, required): User's email
- `password` (string, required): User's password

**Success Response** (200):
```json
{
  "success": true,
  "message": "Connexion réussie",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "nickname": "John Doe",
    "teacher": false
  }
}
```

**Error Responses**:
- `400`: Missing email or password
- `401`: Invalid credentials

---

### Verify Token

#### GET /auth/verify

Verify if the current JWT token is valid.

**Authentication**: Required

**Success Response** (200):
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "john@example.com",
    "nickname": "John Doe",
    "teacher": false
  }
}
```

**Error Responses**:
- `401`: Invalid or expired token

---

### Logout

#### POST /logout

Logout the current user (clears token from database).

**Authentication**: Required

**Success Response** (200):
```json
{
  "success": true,
  "message": "Déconnexion réussie"
}
```

---

## Subject & Chapter Endpoints

### Get All Subjects

#### GET /subjects

Retrieve all subjects.

**Authentication**: Not required

**Success Response** (200):
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

---

### Get Chapters

#### GET /chapters

Retrieve chapters, optionally filtered by subject.

**Authentication**: Not required

**Query Parameters**:
- `subjectId` (integer, optional): Filter chapters by subject ID

**Example Request**:
```
GET /chapters?subjectId=1
```

**Success Response** (200):
```json
{
  "success": true,
  "chapters": [
    {
      "id": 1,
      "name": "Algèbre linéaire",
      "subjectId": 1
    },
    {
      "id": 2,
      "name": "Analyse",
      "subjectId": 1
    }
  ]
}
```

---

### Create Subject

#### POST /subjects/create

Create a new subject (teacher only).

**Authentication**: Required (Teacher role)

**Request Body**:
```json
{
  "subjectName": "Physique"
}
```

**Parameters**:
- `subjectName` (string, required): Name of the subject

**Success Response** (201):
```json
{
  "success": true,
  "message": "Matière créée avec succès",
  "subjectId": 3
}
```

**Error Responses**:
- `400`: Missing subject name
- `403`: User is not a teacher
- `409`: Subject already exists

---

### Create Chapter

#### POST /chapters/create

Create a new chapter (teacher only).

**Authentication**: Required (Teacher role)

**Request Body**:
```json
{
  "chapterName": "Mécanique quantique",
  "subjectId": 3
}
```

**Parameters**:
- `chapterName` (string, required): Name of the chapter
- `subjectId` (integer, required): ID of the parent subject

**Success Response** (201):
```json
{
  "success": true,
  "message": "Chapitre créé avec succès",
  "chapterId": 10
}
```

**Error Responses**:
- `400`: Missing required fields
- `403`: User is not a teacher
- `404`: Subject not found
- `409`: Chapter already exists for this subject

---

## QCM Endpoints

### Get QCMs

#### GET /qcm

Retrieve QCMs, optionally filtered by subject and/or chapter.

**Authentication**: Required

**Query Parameters**:
- `subjectId` (integer, optional): Filter by subject ID
- `chapterId` (integer, optional): Filter by chapter ID

**Example Request**:
```
GET /qcm?subjectId=1&chapterId=2
```

**Success Response** (200):
```json
{
  "success": true,
  "qcms": [
    {
      "id": 1,
      "name": "QCM Algèbre - Niveau 1",
      "difficulty": 0,
      "chapterId": 2,
      "userId": 5,
      "subjectId": 1
    }
  ]
}
```

**Difficulty Levels**:
- `0`: Easy (Facile)
- `1`: Medium (Moyen)
- `2`: Hard (Difficile)

---

### Get QCM Details

#### GET /qcm/:id

Retrieve a specific QCM with all its questions and propositions.

**Authentication**: Required

**URL Parameters**:
- `id` (integer): QCM ID

**Example Request**:
```
GET /qcm/1
```

**Success Response** (200):
```json
{
  "success": true,
  "qcm": {
    "id": 1,
    "name": "QCM Algèbre - Niveau 1",
    "difficulty": 0,
    "chapterId": 2,
    "userId": 5
  },
  "questions": [
    {
      "id": 1,
      "heading": "Quelle est la définition d'un espace vectoriel?",
      "points": 5,
      "type": "unique",
      "negativePoints": 2,
      "explanation": "Un espace vectoriel est...",
      "answers": [
        {
          "id": 1,
          "proposition": "Un ensemble muni d'une addition et d'une multiplication scalaire",
          "validity": true
        },
        {
          "id": 2,
          "proposition": "Un ensemble de vecteurs",
          "validity": false
        }
      ]
    }
  ]
}
```

**Question Types**:
- `unique`: Single choice (only one correct answer)
- `multiple`: Multiple choice (multiple correct answers)

**Error Responses**:
- `404`: QCM not found

---

### Create QCM

#### POST /qcm/create

Create a new QCM with questions and propositions (teacher only).

**Authentication**: Required (Teacher role)

**Request Body**:
```json
{
  "qcmName": "QCM Algèbre - Niveau 1",
  "qcmSubject": 1,
  "qcmChapter": 2,
  "difficulty": 0,
  "questions": [
    {
      "question": "Quelle est la définition d'un espace vectoriel?",
      "answers": [
        "Un ensemble muni d'une addition et d'une multiplication scalaire",
        "Un ensemble de vecteurs",
        "Un groupe abélien"
      ],
      "isCorrect": [true, false, false],
      "multipleCorrect": false,
      "negativePoints": 2,
      "questionPoints": 5,
      "explanation": "Un espace vectoriel est un ensemble muni de deux opérations..."
    }
  ]
}
```

**Parameters**:
- `qcmName` (string, required): Name of the QCM
- `qcmSubject` (integer, required): Subject ID
- `qcmChapter` (integer, required): Chapter ID
- `difficulty` (integer, required): Difficulty level (0, 1, or 2)
- `questions` (array, required): Array of question objects
  - `question` (string, required): Question text
  - `answers` (array, required): Array of answer strings (minimum 2)
  - `isCorrect` (array, required): Boolean array indicating correct answers
  - `multipleCorrect` (boolean, optional): Ignored (auto-detected)
  - `negativePoints` (integer, required): Points deducted for wrong answers
  - `questionPoints` (integer, required): Points awarded for correct answer
  - `explanation` (string, optional): Explanation shown in correction

**Validation Rules**:
- QCM name must not be empty
- At least one question required
- Each question must have at least 2 answers
- Each question must have at least one correct answer
- Question points must be >= 1
- Negative points must be >= 0

**Success Response** (201):
```json
{
  "success": true,
  "message": "QCM créé avec succès",
  "qcmId": 15
}
```

**Error Responses**:
- `400`: Validation errors
- `403`: User is not a teacher
- `404`: Chapter not found

---

### Submit QCM Answers

#### POST /qcm/:id/submit

Submit answers for a QCM and receive calculated score.

**Authentication**: Required

**URL Parameters**:
- `id` (integer): QCM ID

**Request Body**:
```json
{
  "answers": [
    {
      "questionId": 1,
      "propositionId": 1
    },
    {
      "questionId": 2,
      "propositionId": 3
    },
    {
      "questionId": 2,
      "propositionId": 4
    }
  ]
}
```

**Parameters**:
- `answers` (array, required): Array of answer objects
  - `questionId` (integer): Question ID
  - `propositionId` (integer): Selected proposition ID

**Note**: For multiple-choice questions, include multiple answer objects with the same `questionId`.

**Success Response** (200):
```json
{
  "success": true,
  "message": "Réponses soumises avec succès",
  "attemptId": 42,
  "totalPoints": 20,
  "earnedPoints": 15,
  "grade": 15.0
}
```

**Scoring Algorithm**:
- **Single Choice**: Full points if correct, negative points if wrong
- **Multiple Choice**: Deduct negative points for each wrong selection or missed correct answer
- **Question Floor**: Question score cannot go below 0
- **Final Grade**: (earnedPoints / totalPoints) × 20, minimum 0

**Attempt Replacement**: If the user has previously attempted this QCM, the old attempt is deleted and replaced with the new one.

**Error Responses**:
- `400`: Invalid answers format or empty QCM
- `404`: QCM not found

---

### Get Correction

#### GET /qcm/:qcmId/correction/:attemptId

Retrieve detailed correction for a specific attempt.

**Authentication**: Required (must be the attempt owner)

**URL Parameters**:
- `qcmId` (integer): QCM ID
- `attemptId` (integer): Attempt ID

**Example Request**:
```
GET /qcm/1/correction/42
```

**Success Response** (200):
```json
{
  "success": true,
  "qcm": {
    "id": 1,
    "name": "QCM Algèbre - Niveau 1",
    "difficulty": 0
  },
  "attempt": {
    "id": 42,
    "grade": 15.0,
    "date": "2024-01-15T10:30:00.000Z"
  },
  "questions": [
    {
      "id": 1,
      "heading": "Quelle est la définition d'un espace vectoriel?",
      "explanation": "Un espace vectoriel est...",
      "type": "unique",
      "negativePoints": 2,
      "points": 5,
      "propositions": [
        {
          "id": 1,
          "proposition": "Un ensemble muni d'une addition et d'une multiplication scalaire",
          "validity": true
        },
        {
          "id": 2,
          "proposition": "Un ensemble de vecteurs",
          "validity": false
        }
      ],
      "userAnswers": [1],
      "pointsEarned": 5
    }
  ]
}
```

**Response Fields**:
- `propositions`: All answer options with their validity
- `userAnswers`: Array of proposition IDs the user selected
- `pointsEarned`: Points earned for this question
- `explanation`: Explanation text (null if not provided)

**Error Responses**:
- `403`: Attempt does not belong to current user
- `404`: Attempt or QCM not found

---

## Attempt Endpoints

### Get User Attempts

#### GET /attempts

Retrieve all attempts for the authenticated user.

**Authentication**: Required

**Success Response** (200):
```json
{
  "success": true,
  "attempts": [
    {
      "id": 42,
      "qcmId": 1,
      "grade": 15.0,
      "date": "2024-01-15T10:30:00.000Z",
      "qcmName": "QCM Algèbre - Niveau 1",
      "difficulty": 0
    },
    {
      "id": 41,
      "qcmId": 2,
      "grade": 18.5,
      "date": "2024-01-14T14:20:00.000Z",
      "qcmName": "QCM Analyse - Niveau 2",
      "difficulty": 1
    }
  ]
}
```

**Note**: Attempts are ordered by date (most recent first).

---

## Error Handling

### Common Error Responses

#### 401 Unauthorized

```json
{
  "success": false,
  "message": "Token invalide"
}
```

or

```json
{
  "success": false,
  "message": "Token expiré"
}
```

#### 403 Forbidden

```json
{
  "success": false,
  "message": "Accès réservé aux professeurs"
}
```

#### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Erreur serveur interne"
}
```

---

## Rate Limiting

Currently, no rate limiting is implemented. For production deployment, consider implementing rate limiting to prevent abuse.

---

## CORS Configuration

The API is configured to accept requests from the origin specified in the `CORS_ORIGIN` environment variable (default: `http://localhost:8080`).

For production, update this to your frontend domain.

---

## Database Schema Reference

### Tables

- **Accountt**: User accounts
- **Subjectt**: Academic subjects
- **Chapter**: Chapters within subjects
- **QCM**: Questionnaires
- **Question**: Questions within QCMs
- **Possible_answer**: Answer propositions for questions
- **Attempt**: User attempts at QCMs
- **Answer_question**: Points earned per question in an attempt
- **Has_answered**: User's selected propositions for each question

For detailed schema, see `former_project/sosprepa_creation.sql`.

---

## Examples

### Complete Workflow Example

#### 1. Register a new user

```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "teacher": false
  }'
```

#### 2. Login

```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

#### 3. Get available QCMs

```bash
curl -X GET "http://localhost:3000/api/qcm?subjectId=1" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### 4. Get QCM details

```bash
curl -X GET http://localhost:3000/api/qcm/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### 5. Submit answers

```bash
curl -X POST http://localhost:3000/api/qcm/1/submit \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "answers": [
      {"questionId": 1, "propositionId": 1},
      {"questionId": 2, "propositionId": 3}
    ]
  }'
```

#### 6. View correction

```bash
curl -X GET http://localhost:3000/api/qcm/1/correction/42 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Changelog

### Version 1.0.0 (2024-01-15)

- Initial API release
- Authentication with JWT
- QCM creation and management
- Automatic scoring system
- Correction viewing
- Subject and chapter management
- User attempt tracking
