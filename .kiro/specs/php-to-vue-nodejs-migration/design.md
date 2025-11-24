# Design Document

## Overview

Ce document décrit l'architecture et la conception détaillée pour le portage de l'application SOSprépa d'une architecture PHP monolithique vers une architecture moderne séparant le frontend (Vue.js) et le backend (Node.js/Express). L'application conservera toutes les fonctionnalités existantes tout en améliorant la maintenabilité, la scalabilité et l'expérience développeur.

### Objectifs Principaux

1. **Séparation des préoccupations**: Frontend et backend complètement découplés
2. **API RESTful**: Communication via endpoints HTTP standardisés
3. **Authentification moderne**: JWT pour la gestion des sessions
4. **Réactivité**: Interface utilisateur réactive avec Vue.js 3
5. **Compatibilité**: Maintien de la compatibilité avec la base de données MySQL existante
6. **Réutilisation**: Conservation des styles CSS existants

## Architecture

### Architecture Globale

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (Browser)                      │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Vue.js 3 Application                      │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐ │ │
│  │  │  Router  │  │  Store   │  │  Views/Components    │ │ │
│  │  │ (Vue     │  │ (Pinia/  │  │  - Login             │ │ │
│  │  │  Router) │  │  Vuex)   │  │  - Register          │ │ │
│  │  │          │  │          │  │  - CreateQCM         │ │ │
│  │  └──────────┘  └──────────┘  │  - AnswerQCM         │ │ │
│  │                               │  - Correction        │ │ │
│  │                               │  - SelectQCM         │ │ │
│  │                               │  - Lessons           │ │ │
│  │                               └──────────────────────┘ │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │           API Service (Axios)                    │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/HTTPS (REST API)
                            │ JSON
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Node.js/Express Server                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    Middleware Layer                     │ │
│  │  ┌──────────┐  ┌──────────┐  ┌────────────────────┐  │ │
│  │  │   CORS   │  │   JSON   │  │  Authentication    │  │ │
│  │  │          │  │  Parser  │  │  (JWT Middleware)  │  │ │
│  │  └──────────┘  └──────────┘  └────────────────────┘  │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    API Routes                           │ │
│  │  /api/auth/*    /api/qcm/*    /api/subjects/*         │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                  Business Logic Layer                   │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐ │ │
│  │  │   Auth   │  │   QCM    │  │  Scoring/Grading     │ │ │
│  │  │ Service  │  │ Service  │  │     Service          │ │ │
│  │  └──────────┘  └──────────┘  └──────────────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                  Data Access Layer                      │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │         MySQL Connection Pool (mysql2)           │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ SQL Queries
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      MySQL Database                          │
│  Tables: Accountt, QCM, Question, Possible_answer,         │
│          Attempt, Answer_question, Has_answered,            │
│          Subjectt, Chapter                                  │
└─────────────────────────────────────────────────────────────┘
```

### Flux de Données

#### Authentification
```
User → LoginView → API Service → POST /api/login → Auth Controller
→ Validate credentials → Generate JWT → Store token in DB
→ Return {token, user} → Store in localStorage → Redirect to Home
```

#### Création de QCM
```
Teacher → CreateQCMView → Fill form → Submit
→ API Service → POST /api/qcm/create (with JWT header)
→ Auth Middleware → Verify token & teacher role
→ QCM Controller → Validate data → Begin transaction
→ Insert QCM → Insert Questions → Insert Propositions
→ Commit transaction → Return success → Redirect to QCM list
```

#### Réponse à un QCM
```
Student → SelectQCMView → Choose QCM → AnswerQCMView
→ GET /api/qcm/:id → Return QCM with questions
→ User selects answers → Submit
→ POST /api/qcm/:id/submit (with answers array)
→ Scoring Service → Calculate points per question
→ Calculate final grade → Store Attempt
→ Return {attemptId, grade} → Redirect to Correction
```

## Components and Interfaces

### Frontend Components

#### 1. Vue Router Configuration

```javascript
// router/index.js
const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/register', name: 'Register', component: RegisterView },
  { 
    path: '/qcm/create', 
    name: 'CreateQCM', 
    component: CreateQcmView,
    meta: { requiresAuth: true, requiresTeacher: true }
  },
  { 
    path: '/qcm/select', 
    name: 'SelectQCM', 
    component: SelectQcmView,
    meta: { requiresAuth: true }
  },
  { 
    path: '/qcm/:id/answer', 
    name: 'AnswerQCM', 
    component: AnswerQcmView,
    meta: { requiresAuth: true }
  },
  { 
    path: '/qcm/:qcmId/correction/:attemptId', 
    name: 'Correction', 
    component: CorrectionView,
    meta: { requiresAuth: true }
  },
  { path: '/lessons', name: 'Lessons', component: LessonsView }
];
```

#### 2. Store (Pinia/Vuex)

```javascript
// stores/auth.js
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isTeacher: false
  }),
  
  actions: {
    async login(email, password) {
      const response = await api.post('/api/login', { email, password });
      this.token = response.data.token;
      this.user = response.data.user;
      this.isAuthenticated = true;
      this.isTeacher = response.data.user.teacher;
      localStorage.setItem('token', this.token);
      localStorage.setItem('user', JSON.stringify(this.user));
    },
    
    logout() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      this.isTeacher = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    
    async checkAuth() {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.get('/api/auth/verify', {
            headers: { Authorization: `Bearer ${token}` }
          });
          this.token = token;
          this.user = response.data.user;
          this.isAuthenticated = true;
          this.isTeacher = response.data.user.teacher;
        } catch (error) {
          this.logout();
        }
      }
    }
  }
});
```

#### 3. API Service

```javascript
// services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token invalide ou expiré
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Backend API Endpoints

#### Authentication Endpoints

```
POST /api/register
Body: { username, email, password }
Response: { success: true, message: "User registered successfully" }

POST /api/login
Body: { email, password }
Response: { token, user: { id, email, nickname, teacher } }

GET /api/auth/verify
Headers: { Authorization: "Bearer <token>" }
Response: { user: { id, email, nickname, teacher } }

POST /api/logout
Headers: { Authorization: "Bearer <token>" }
Response: { success: true }
```

#### QCM Endpoints

```
GET /api/qcm
Query: ?subjectId=X&chapterId=Y
Headers: { Authorization: "Bearer <token>" }
Response: [ { id, name, difficulty, subjectId, chapterId, userId } ]

GET /api/qcm/:id
Headers: { Authorization: "Bearer <token>" }
Response: { 
  qcm: { id, name, difficulty },
  questions: [
    {
      id, heading, type, negativePoints, points,
      answers: [ { id, proposition, validity } ]
    }
  ]
}

POST /api/qcm/create
Headers: { Authorization: "Bearer <token>" }
Body: {
  qcmName, qcmSubject, qcmChapter, difficulty,
  questions: [
    {
      question, answers, isCorrect, multipleCorrect,
      negativePoints, questionPoints, explanation
    }
  ]
}
Response: { success: true, qcmId }

POST /api/qcm/:id/submit
Headers: { Authorization: "Bearer <token>" }
Body: {
  qcmId,
  answers: [ { questionId, propositionId } ]
}
Response: { 
  success: true, 
  attemptId, 
  totalPoints, 
  earnedPoints, 
  grade 
}

GET /api/qcm/:qcmId/correction/:attemptId
Headers: { Authorization: "Bearer <token>" }
Response: {
  qcm: { name, difficulty },
  attempt: { grade, date },
  questions: [
    {
      id, heading, explanation, type, negativePoints, points,
      propositions: [ { id, proposition, validity } ],
      userAnswers: [ propositionId ],
      pointsEarned
    }
  ]
}
```

#### Subject & Chapter Endpoints

```
GET /api/subjects
Response: [ { id, name } ]

GET /api/chapters
Query: ?subjectId=X
Response: [ { id, name, subjectId } ]

POST /api/subjects/create
Headers: { Authorization: "Bearer <token>" }
Body: { subjectName }
Response: { success: true, subjectId }

POST /api/chapters/create
Headers: { Authorization: "Bearer <token>" }
Body: { chapterName, subjectId }
Response: { success: true, chapterId }
```

#### Attempt Endpoints

```
GET /api/attempts
Headers: { Authorization: "Bearer <token>" }
Response: [ { id, qcmId, grade, date } ]
```

## Data Models

### Database Schema (Existing - No Changes)

```sql
-- Table Accountt (users)
CREATE TABLE Accountt (
  ID_user INT PRIMARY KEY AUTO_INCREMENT,
  Nickname VARCHAR(255),
  Teacher BOOLEAN,
  Administrator BOOLEAN,
  Email VARCHAR(255) UNIQUE,
  Password VARCHAR(255),
  Token TEXT
);

-- Table Subjectt
CREATE TABLE Subjectt (
  ID_Subject INT PRIMARY KEY AUTO_INCREMENT,
  Subject_name VARCHAR(255)
);

-- Table Chapter
CREATE TABLE Chapter (
  ID_Chapter INT PRIMARY KEY AUTO_INCREMENT,
  Chapter_name VARCHAR(255),
  ID_Subject INT,
  FOREIGN KEY (ID_Subject) REFERENCES Subjectt(ID_Subject)
);

-- Table QCM
CREATE TABLE QCM (
  ID_QCM INT PRIMARY KEY AUTO_INCREMENT,
  Name_QCM VARCHAR(255),
  Difficulty INT, -- 0: easy, 1: medium, 2: hard
  ID_user INT,
  ID_Chapter INT,
  FOREIGN KEY (ID_user) REFERENCES Accountt(ID_user),
  FOREIGN KEY (ID_Chapter) REFERENCES Chapter(ID_Chapter)
);

-- Table Question
CREATE TABLE Question (
  ID_Question INT PRIMARY KEY AUTO_INCREMENT,
  Question_heading TEXT,
  Number_of_points INT,
  Type_of_question VARCHAR(50), -- 'unique' or 'multiple'
  Negative_points INT,
  Explanation TEXT,
  ID_QCM INT,
  FOREIGN KEY (ID_QCM) REFERENCES QCM(ID_QCM)
);

-- Table Possible_answer
CREATE TABLE Possible_answer (
  ID_Proposition INT PRIMARY KEY AUTO_INCREMENT,
  Proposition TEXT,
  Validity BOOLEAN,
  ID_Question INT,
  FOREIGN KEY (ID_Question) REFERENCES Question(ID_Question)
);

-- Table Attempt
CREATE TABLE Attempt (
  ID_Attempt INT PRIMARY KEY AUTO_INCREMENT,
  Date_attempt DATETIME,
  Grade DECIMAL(5,2),
  ID_QCM INT,
  ID_user INT,
  FOREIGN KEY (ID_QCM) REFERENCES QCM(ID_QCM),
  FOREIGN KEY (ID_user) REFERENCES Accountt(ID_user)
);

-- Table Answer_question
CREATE TABLE Answer_question (
  ID_Answer INT PRIMARY KEY AUTO_INCREMENT,
  Points_earned INT,
  ID_Question INT,
  ID_Attempt INT,
  FOREIGN KEY (ID_Question) REFERENCES Question(ID_Question),
  FOREIGN KEY (ID_Attempt) REFERENCES Attempt(ID_Attempt)
);

-- Table Has_answered
CREATE TABLE Has_answered (
  ID_Proposition INT,
  ID_Answer INT,
  PRIMARY KEY (ID_Proposition, ID_Answer),
  FOREIGN KEY (ID_Proposition) REFERENCES Possible_answer(ID_Proposition),
  FOREIGN KEY (ID_Answer) REFERENCES Answer_question(ID_Answer)
);
```

### Frontend Data Models (TypeScript Interfaces)

```typescript
// types/auth.ts
interface User {
  id: number;
  email: string;
  nickname: string;
  teacher: boolean;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

// types/qcm.ts
interface QCM {
  id: number;
  name: string;
  difficulty: number; // 0: easy, 1: medium, 2: hard
  subjectId: number;
  chapterId: number;
  userId: number;
}

interface Question {
  id: number;
  heading: string;
  type: 'unique' | 'multiple';
  negativePoints: number;
  points: number;
  explanation?: string;
  answers: Proposition[];
}

interface Proposition {
  id: number;
  proposition: string;
  validity: boolean;
}

interface UserAnswer {
  questionId: number;
  propositionId: number;
}

interface Attempt {
  id: number;
  qcmId: number;
  userId: number;
  grade: number;
  date: string;
}

interface QuestionResult {
  question: Question;
  userAnswers: number[];
  pointsEarned: number;
}

// types/subject.ts
interface Subject {
  id: number;
  name: string;
}

interface Chapter {
  id: number;
  name: string;
  subjectId: number;
}
```

## C
orrectness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Authentication and Security Properties

Property 1: Password hashing on registration
*For any* valid registration credentials, the system should store the password as a bcrypt hash (not plaintext) in the database
**Validates: Requirements 1.1, 11.1**

Property 2: JWT token generation on login
*For any* valid login credentials, the system should return a valid JWT token that can be decoded to extract user information
**Validates: Requirements 1.2, 11.2**

Property 3: Token validation for protected resources
*For any* authenticated request with a valid token, the system should grant access to protected resources
**Validates: Requirements 1.3**

Property 4: Invalid token rejection
*For any* request with an invalid, expired, or malformed token, the system should reject it with a 401 status code
**Validates: Requirements 1.4**

Property 5: Session invalidation on logout
*For any* logout action, the system should remove the token from localStorage and clear the authentication store
**Validates: Requirements 1.5**

### Role-Based Access Control Properties

Property 6: Role assignment on account creation
*For any* new user account, the system should assign a teacher field (true or false) indicating their role
**Validates: Requirements 2.1**

Property 7: Teacher-only route protection
*For any* non-teacher user attempting to access teacher-only routes, the system should deny access and redirect to the home page
**Validates: Requirements 2.3**

Property 8: Role-based navigation rendering
*For any* user role, the navigation menu should display only the menu items appropriate for that role
**Validates: Requirements 2.4**

### QCM Creation and Validation Properties

Property 9: Question validation requires correct answer
*For any* question submission, if no answers are marked as correct, the system should reject the question
**Validates: Requirements 3.2**

Property 10: Multiple correct answers set type to multiple
*For any* question with more than one answer marked as correct, the system should automatically set the question type to "multiple"
**Validates: Requirements 3.3**

Property 11: Single correct answer sets type to unique
*For any* question with exactly one answer marked as correct, the system should automatically set the question type to "unique"
**Validates: Requirements 3.4**

Property 12: Transactional QCM creation
*For any* QCM submission, either all data (QCM, questions, propositions) should be saved or none should be saved (no partial saves)
**Validates: Requirements 3.5**

Property 13: Negative points persistence
*For any* question with specified negative points, the system should store this value and retrieve it correctly for scoring
**Validates: Requirements 3.6**

Property 14: Explanation persistence
*For any* question with an explanation, the system should store it and display it during correction
**Validates: Requirements 3.7**

### Subject and Chapter Management Properties

Property 15: Subject creation returns valid ID
*For any* new subject creation, the system should add it to the subjects list and return a valid positive integer ID
**Validates: Requirements 4.1**

Property 16: Chapter-subject association
*For any* new chapter creation, the system should correctly associate it with the specified subject via foreign key
**Validates: Requirements 4.2**

Property 17: Chapter filtering by subject
*For any* subject selection, the system should return only chapters that belong to that subject
**Validates: Requirements 4.3**

### QCM Selection and Answer Submission Properties

Property 18: QCM filtering by subject and chapter
*For any* subject and chapter selection, the system should display only QCMs matching both criteria
**Validates: Requirements 5.1**

Property 19: Single-choice answer deselection
*For any* single-choice question, selecting a new answer should deselect any previously selected answer
**Validates: Requirements 5.3**

Property 20: Multiple-choice multiple selections
*For any* multiple-choice question, the system should allow multiple answers to be selected simultaneously
**Validates: Requirements 5.4**

Property 21: Attempt creation on submission
*For any* answer submission, the system should create an attempt record with a calculated score
**Validates: Requirements 5.5**

Property 22: Attempt replacement
*For any* user submitting a second attempt for the same QCM, the system should delete the previous attempt and create a new one
**Validates: Requirements 5.6**

### Scoring Algorithm Properties

Property 23: Full points for correct single-choice answer
*For any* single-choice question where the correct answer is selected, the system should award the full points specified for that question
**Validates: Requirements 6.1**

Property 24: Negative points for incorrect single-choice answer
*For any* single-choice question where an incorrect answer is selected, the system should deduct the specified negative points
**Validates: Requirements 6.2**

Property 25: Multiple-choice scoring with penalties
*For any* multiple-choice question, the system should deduct negative points for each incorrect selection and each missed correct answer
**Validates: Requirements 6.3**

Property 26: Question score floor at zero
*For any* question where penalties would result in negative points, the system should clamp the question score to zero
**Validates: Requirements 6.4**

Property 27: Final grade calculation
*For any* completed QCM attempt, the system should calculate the final grade as (earned points / total points) × 20
**Validates: Requirements 6.5**

Property 28: Grade floor at zero
*For any* QCM attempt where the calculated grade would be negative, the system should set the grade to zero
**Validates: Requirements 6.6**

### Correction Display Properties

Property 29: Visual distinction of correct/incorrect answers
*For any* proposition in the correction view, the system should apply different CSS classes to visually distinguish correct from incorrect answers
**Validates: Requirements 7.2**

Property 30: User selection indication
*For any* proposition that the user selected, the system should mark it with a visual indicator in the correction view
**Validates: Requirements 7.3**

Property 31: Explanation display when present
*For any* question with an explanation, the system should display it in the correction view
**Validates: Requirements 7.4**

### Error Handling and User Feedback Properties

Property 32: API error message display
*For any* API error, the system should display a user-friendly error message to the user
**Validates: Requirements 9.3**

Property 33: Reactive UI updates on auth state change
*For any* authentication state change (login/logout), the system should reactively update the UI to reflect the new state
**Validates: Requirements 9.4**

Property 34: Auth state persistence across navigation
*For any* navigation between pages, the system should preserve the authentication state in the store
**Validates: Requirements 9.5**

Property 35: Request validation
*For any* API endpoint call with invalid parameters or body, the system should reject the request with an appropriate error response
**Validates: Requirements 10.2**

Property 36: Transaction rollback on database error
*For any* database error during a transaction, the system should rollback all changes and return an error response
**Validates: Requirements 10.3**

Property 37: JWT middleware protection
*For any* protected route, the system should require a valid JWT token in the Authorization header
**Validates: Requirements 10.4**

Property 38: Input sanitization and validation
*For any* user input, the system should sanitize and validate it before performing database operations
**Validates: Requirements 11.3**

Property 39: Token compatibility with existing schema
*For any* JWT token generation, the system should store it in the existing Token field in the Accountt table
**Validates: Requirements 12.3**

Property 40: Scoring algorithm consistency
*For any* QCM attempt, the scoring results should match the algorithm used in the PHP version
**Validates: Requirements 12.4**

Property 41: Success message display
*For any* successful action, the system should display a success message to the user
**Validates: Requirements 13.1**

Property 42: Error message display with details
*For any* failed action, the system should display an error message with details about the failure
**Validates: Requirements 13.2**

Property 43: Message auto-dismissal
*For any* displayed message, the system should automatically dismiss it after a reasonable duration (e.g., 5 seconds)
**Validates: Requirements 13.3**

Property 44: Message clearing on navigation
*For any* navigation to a new page, the system should clear any previously displayed messages
**Validates: Requirements 13.4**

Property 45: Authentication failure reason display
*For any* authentication failure, the system should display the specific reason for the failure (invalid email, incorrect password, etc.)
**Validates: Requirements 13.5**

## Error Handling

### Frontend Error Handling

#### API Error Interceptor
```javascript
// Axios interceptor for handling API errors
api.interceptors.response.use(
  response => response,
  error => {
    const message = error.response?.data?.message || 'Une erreur est survenue';
    
    // Show error message to user
    useNotificationStore().showError(message);
    
    // Handle specific error codes
    if (error.response?.status === 401) {
      // Unauthorized - clear auth and redirect to login
      useAuthStore().logout();
      router.push('/login');
    } else if (error.response?.status === 403) {
      // Forbidden - redirect to home
      router.push('/');
    } else if (error.response?.status === 404) {
      // Not found - show 404 page
      router.push('/404');
    }
    
    return Promise.reject(error);
  }
);
```

#### Form Validation
```javascript
// Client-side validation before API calls
const validateQCMForm = (qcmData) => {
  const errors = [];
  
  if (!qcmData.qcmName || qcmData.qcmName.trim() === '') {
    errors.push('Le nom du QCM est requis');
  }
  
  if (!qcmData.qcmSubject) {
    errors.push('La matière est requise');
  }
  
  if (!qcmData.qcmChapter) {
    errors.push('Le chapitre est requis');
  }
  
  if (!qcmData.questions || qcmData.questions.length === 0) {
    errors.push('Au moins une question est requise');
  }
  
  qcmData.questions.forEach((q, index) => {
    if (!q.question || q.question.trim() === '') {
      errors.push(`La question ${index + 1} est vide`);
    }
    
    if (!q.answers || q.answers.length < 2) {
      errors.push(`La question ${index + 1} doit avoir au moins 2 réponses`);
    }
    
    const correctCount = q.isCorrect.filter(Boolean).length;
    if (correctCount === 0) {
      errors.push(`La question ${index + 1} doit avoir au moins une réponse correcte`);
    }
  });
  
  return errors;
};
```

### Backend Error Handling

#### Global Error Handler Middleware
```javascript
// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Database errors
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      success: false,
      message: 'Cette entrée existe déjà'
    });
  }
  
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({
      success: false,
      message: 'Référence invalide'
    });
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token invalide'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expiré'
    });
  }
  
  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  
  // Default error
  res.status(500).json({
    success: false,
    message: 'Erreur serveur interne'
  });
});
```

#### Request Validation Middleware
```javascript
// Middleware for validating request body
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }
    next();
  };
};

// Example schema using Joi
const qcmCreationSchema = Joi.object({
  qcmName: Joi.string().required().min(3).max(255),
  qcmSubject: Joi.number().integer().positive().required(),
  qcmChapter: Joi.number().integer().positive().required(),
  difficulty: Joi.number().integer().min(0).max(2).required(),
  questions: Joi.array().min(1).items(
    Joi.object({
      question: Joi.string().required().min(5),
      answers: Joi.array().min(2).items(Joi.string().required()),
      isCorrect: Joi.array().min(1).items(Joi.boolean()),
      multipleCorrect: Joi.boolean(),
      negativePoints: Joi.number().integer().min(0),
      questionPoints: Joi.number().integer().min(1),
      explanation: Joi.string().allow('').optional()
    })
  )
});
```

#### Transaction Error Handling
```javascript
// Example of transaction with error handling
const createQCM = async (qcmData, userId) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    // Insert QCM
    const [qcmResult] = await connection.execute(
      'INSERT INTO QCM (Name_QCM, Difficulty, ID_user, ID_Chapter) VALUES (?, ?, ?, ?)',
      [qcmData.qcmName, qcmData.difficulty, userId, qcmData.qcmChapter]
    );
    const qcmId = qcmResult.insertId;
    
    // Insert questions
    for (const question of qcmData.questions) {
      const [questionResult] = await connection.execute(
        'INSERT INTO Question (Question_heading, Number_of_points, Type_of_question, Negative_points, Explanation, ID_QCM) VALUES (?, ?, ?, ?, ?, ?)',
        [
          question.question,
          question.questionPoints,
          question.multipleCorrect ? 'multiple' : 'unique',
          question.negativePoints,
          question.explanation || '',
          qcmId
        ]
      );
      const questionId = questionResult.insertId;
      
      // Insert propositions
      for (let i = 0; i < question.answers.length; i++) {
        await connection.execute(
          'INSERT INTO Possible_answer (Proposition, Validity, ID_Question) VALUES (?, ?, ?)',
          [question.answers[i], question.isCorrect[i] ? 1 : 0, questionId]
        );
      }
    }
    
    await connection.commit();
    return { success: true, qcmId };
    
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
```

## Testing Strategy

### Unit Testing

#### Frontend Unit Tests (Vitest + Vue Test Utils)

**Test Coverage:**
- Component rendering and props
- User interactions (clicks, form submissions)
- Computed properties and watchers
- Store actions and mutations
- Router navigation guards
- API service methods

**Example Test:**
```javascript
// tests/components/LoginView.spec.js
import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import LoginView from '@/views/LoginView.vue';
import { createPinia } from 'pinia';

describe('LoginView', () => {
  it('should submit login form with valid credentials', async () => {
    const wrapper = mount(LoginView, {
      global: {
        plugins: [createPinia()]
      }
    });
    
    await wrapper.find('input[type="email"]').setValue('test@example.com');
    await wrapper.find('input[type="password"]').setValue('password123');
    await wrapper.find('form').trigger('submit.prevent');
    
    // Verify API call was made
    expect(mockApiPost).toHaveBeenCalledWith('/api/login', {
      email: 'test@example.com',
      password: 'password123'
    });
  });
});
```

#### Backend Unit Tests (Jest/Mocha + Chai)

**Test Coverage:**
- Route handlers
- Middleware functions
- Database queries
- Authentication logic
- Scoring algorithms
- Input validation

**Example Test:**
```javascript
// tests/scoring.test.js
const { calculateScore } = require('../services/scoring');

describe('Scoring Service', () => {
  it('should award full points for correct single-choice answer', () => {
    const question = {
      type: 'unique',
      points: 5,
      negativePoints: 2,
      propositions: [
        { id: 1, validity: true },
        { id: 2, validity: false }
      ]
    };
    
    const userAnswers = [1];
    const score = calculateScore(question, userAnswers);
    
    expect(score).toBe(5);
  });
  
  it('should deduct negative points for incorrect single-choice answer', () => {
    const question = {
      type: 'unique',
      points: 5,
      negativePoints: 2,
      propositions: [
        { id: 1, validity: true },
        { id: 2, validity: false }
      ]
    };
    
    const userAnswers = [2];
    const score = calculateScore(question, userAnswers);
    
    expect(score).toBe(-2);
  });
});
```

### Property-Based Testing

Property-based testing will be implemented using **fast-check** for JavaScript/TypeScript. Each property-based test will run a minimum of 100 iterations with randomly generated inputs.

**Property-Based Testing Library:** fast-check (https://github.com/dubzzz/fast-check)

**Test Configuration:**
```javascript
// vitest.config.js
export default {
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    }
  }
};
```

**Property Test Examples:**

```javascript
// tests/properties/auth.property.test.js
import fc from 'fast-check';
import { hashPassword, verifyPassword } from '@/services/auth';

describe('Authentication Properties', () => {
  it('Property 1: Password hashing produces non-plaintext hashes', () => {
    fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 8, maxLength: 100 }),
        async (password) => {
          const hash = await hashPassword(password);
          // Hash should not equal plaintext password
          expect(hash).not.toBe(password);
          // Hash should be a bcrypt hash (starts with $2b$)
          expect(hash).toMatch(/^\$2[aby]\$/);
        }
      ),
      { numRuns: 100 }
    );
  });
  
  it('Property 2: JWT tokens contain required user information', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.integer({ min: 1 }),
          email: fc.emailAddress(),
          teacher: fc.boolean()
        }),
        (user) => {
          const token = generateToken(user);
          const decoded = jwt.decode(token);
          
          expect(decoded.id).toBe(user.id);
          expect(decoded.email).toBe(user.email);
          expect(decoded.teacher).toBe(user.teacher);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

**Property Test Tagging Convention:**
Each property-based test MUST include a comment tag in the following format:
```javascript
// **Feature: php-to-vue-nodejs-migration, Property 1: Password hashing on registration**
```

### Integration Testing

**Test Coverage:**
- End-to-end API workflows
- Database integration
- Authentication flows
- QCM creation and submission flows
- Scoring and correction flows

**Example Integration Test:**
```javascript
// tests/integration/qcm-workflow.test.js
describe('QCM Workflow Integration', () => {
  let authToken;
  let qcmId;
  
  beforeAll(async () => {
    // Login as teacher
    const loginResponse = await request(app)
      .post('/api/login')
      .send({ email: 'teacher@test.com', password: 'password123' });
    authToken = loginResponse.body.token;
  });
  
  it('should complete full QCM creation and submission workflow', async () => {
    // Create QCM
    const createResponse = await request(app)
      .post('/api/qcm/create')
      .set('Authorization', `Bearer ${authToken}`)
      .send(qcmData);
    
    expect(createResponse.status).toBe(200);
    qcmId = createResponse.body.qcmId;
    
    // Get QCM
    const getResponse = await request(app)
      .get(`/api/qcm/${qcmId}`)
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(getResponse.status).toBe(200);
    expect(getResponse.body.qcm.id).toBe(qcmId);
    
    // Submit answers
    const submitResponse = await request(app)
      .post(`/api/qcm/${qcmId}/submit`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ answers: answerData });
    
    expect(submitResponse.status).toBe(200);
    expect(submitResponse.body.attemptId).toBeDefined();
  });
});
```

### E2E Testing (Optional)

**Tool:** Playwright or Cypress

**Test Coverage:**
- User registration and login flows
- QCM creation by teachers
- QCM selection and answering by students
- Correction viewing
- PDF lesson viewing

## Implementation Notes

### Database Connection

```javascript
// config/database.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3307,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sos_prepa_bdd',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
```

### Environment Configuration

```javascript
// .env (development)
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=3307
DB_USER=root
DB_PASSWORD=
DB_NAME=sos_prepa_bdd
JWT_SECRET=REZMT4K5LMRSTU
JWT_EXPIRATION=1h
CORS_ORIGIN=http://localhost:8080
```

### Scoring Algorithm Implementation

```javascript
// services/scoring.js
const calculateQuestionScore = (question, userAnswers) => {
  const { type, points, negativePoints, propositions } = question;
  
  if (type === 'unique') {
    // Single choice: full points if correct, negative points if wrong
    const correctProp = propositions.find(p => p.validity);
    const userSelected = userAnswers[0];
    
    if (userSelected === correctProp.id) {
      return points;
    } else {
      return -negativePoints;
    }
  } else {
    // Multiple choice: deduct for each wrong selection or missed correct answer
    let score = points;
    
    for (const prop of propositions) {
      const isSelected = userAnswers.includes(prop.id);
      
      if (isSelected && !prop.validity) {
        // Selected wrong answer
        score -= negativePoints;
      } else if (!isSelected && prop.validity) {
        // Missed correct answer
        score -= negativePoints;
      }
    }
    
    // Floor at 0
    return Math.max(0, score);
  }
};

const calculateFinalGrade = (questions, userAnswersByQuestion) => {
  let totalPoints = 0;
  let earnedPoints = 0;
  
  for (const question of questions) {
    totalPoints += question.points;
    const userAnswers = userAnswersByQuestion[question.id] || [];
    const questionScore = calculateQuestionScore(question, userAnswers);
    earnedPoints += questionScore;
  }
  
  const grade = (earnedPoints / totalPoints) * 20;
  return Math.max(0, grade);
};

module.exports = { calculateQuestionScore, calculateFinalGrade };
```

### CSS Integration

All existing CSS files will be imported in the respective Vue components:

```vue
<!-- Example: LoginView.vue -->
<style scoped>
@import '../assets/login.css';
</style>
```

The CSS files will remain unchanged and will be copied from the `former_project/src/css/` directory to `client/src/assets/`.

## Migration Strategy

### Phase 1: Backend API Development
1. Set up Express server with middleware
2. Implement authentication endpoints
3. Implement QCM CRUD endpoints
4. Implement subject/chapter endpoints
5. Implement scoring service
6. Write unit tests for all endpoints

### Phase 2: Frontend Vue.js Development
1. Set up Vue 3 project with Router and Pinia
2. Create authentication views (Login, Register)
3. Create QCM views (Create, Select, Answer, Correction)
4. Create Lessons view
5. Implement API service with Axios
6. Integrate existing CSS files
7. Write component tests

### Phase 3: Integration and Testing
1. Connect frontend to backend API
2. Test complete workflows
3. Fix bugs and edge cases
4. Performance optimization
5. Security audit

### Phase 4: Deployment
1. Set up production environment variables
2. Configure CORS for production
3. Set up database connection pooling
4. Deploy backend to server
5. Build and deploy frontend
6. Monitor and maintain
