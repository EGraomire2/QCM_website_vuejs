# SOSprépa - Interactive MCQ Platform

---

**Name and ID:** [Your Name and ID]  
**Intake Code:** [Your Intake Code]  
**Subject:** Web Development  
**Project Title:** Migration and Modernization of the SOSprépa Platform

---

## Table of Contents

1. Introduction
2. Design
3. Implementation
4. User Guide
5. Conclusion
6. References

---

## 1. Introduction

### Project Context

SOSprépa is a web platform I developed to help EFREI students review their courses through interactive multiple-choice quizzes (MCQs). The initial project was built in PHP, but I decided to completely modernize it using Vue.js for the frontend and Node.js for the backend.

### Objectives

The main objective was to create a modern and user-friendly application where:
- Students can take MCQs and view their detailed corrections
- Teachers can create MCQs with different types of questions
- Administrators can manage users and content

### Technologies Used

**Frontend:**
- Vue.js 3 for the user interface
- Vue Router for navigation
- Pinia for state management
- Axios for API calls
- Vue I18n for multilingual support (French/English)

**Backend:**
- Node.js with Express for the API
- MySQL for the database
- JWT for authentication
- bcrypt to secure passwords

### Main Features

- Secure authentication system
- MCQ creation with single or multiple choice questions
- Automatic grading with positive and negative points system
- Multilingual interface (French/English)
- Administration panel to manage users and MCQs
- Access to revision sheets in PDF format

---

## 2. Design

### General Architecture

I opted for a classic client-server architecture:
- The Vue.js frontend communicates with the backend via a REST API
- The Node.js backend handles business logic and database access
- Authentication is done through JWT tokens stored on the client side

### Database

The database contains 8 main tables:

**users**: Stores users with their roles (student, teacher, admin)

**Subjectt and Chapter**: Organize MCQs by subjects and chapters

**QCM**: Contains quiz information (name, difficulty, creator)

**Question**: Stores questions with their points and explanations

**Possible_answer**: The possible answers for each question

**Attempt**: Records student attempts with their grades

**Answer_question and Has_answered**: Link student answers to questions

### Navigation Structure

The application follows a simple logical flow:

1. **Login/Registration** → Home page
2. **Home page** → Access to different features based on role
3. **MCQ Selection** → Answer MCQ → Detailed correction
4. **MCQ Creation** (teachers only)
5. **Admin Panel** (administrators only)

Routes are protected: if a student tries to access MCQ creation, they are automatically redirected to the home page.

### Main Wireframes

**Login Page**
- Simple form with email and password
- Link to registration
- Language selector (FR/EN flags)

**Home Page**
- Navigation menu with options based on role
- Clickable cards to access main features
- Personalized welcome message

**MCQ Selection**
- Filters by subject, chapter, and difficulty
- List of available MCQs with difficulty badges (Easy/Medium/Hard)
- "Start" button for each MCQ

**MCQ Answer Page**
- Questions displayed one by one or all together
- Radio buttons for single choice, checkboxes for multiple choice
- Point indication per question
- Submit button at the bottom of the page

**Correction Page**
- Final grade displayed at the top
- For each question: answers in green (correct) or red (incorrect)
- Indication of answers selected by the student
- Teacher's explanations if available

**MCQ Creation (Teachers)**
- Form for general information (name, subject, chapter, difficulty)
- Section to add questions with their answers
- Ability to mark multiple answers as correct
- Fields for positive and negative points

**Admin Panel**
- "MCQ Management" tab: list with deletion option
- "User Management" tab: list with role filters
- Actions to promote/revoke teacher status

---

## 3. Implementation

This section explains the source code for the major features of the application.

### 3.1 Authentication System with JWT

The authentication system uses JSON Web Tokens (JWT) to secure user sessions. Here's how the login process works:

**Backend - Login Service (server/services/auth.js)**

```javascript
async login(email, password) {
    // Step 1: Find user in database by email
    const [users] = await pool.execute(
        'SELECT ID_user, Nickname, Email, Password, Teacher, Administrator 
         FROM users WHERE Email = ?',
        [email]
    );
    
    // Step 2: Check if user exists
    if (users.length === 0) {
        throw new Error('Invalid credentials');
    }
    
    const user = users[0];
    
    // Step 3: Verify password using bcrypt
    const isValid = await bcrypt.compare(password, user.Password);
    if (!isValid) {
        throw new Error('Invalid credentials');
    }
    
    // Step 4: Generate JWT token with user information
    const token = jwt.sign(
        {
            userId: user.ID_user,
            email: user.Email,
            teacher: user.Teacher,
            admin: user.Administrator
        },
        JWT_SECRET,
        { expiresIn: '24h' }  // Token expires after 24 hours
    );
    
    // Step 5: Store token in database
    await pool.execute(
        'UPDATE users SET Token = ? WHERE ID_user = ?',
        [token, user.ID_user]
    );
    
    // Step 6: Return token and user info to client
    return {
        token,
        user: {
            id: user.ID_user,
            nickname: user.Nickname,
            email: user.Email,
            teacher: user.Teacher,
            admin: user.Administrator
        }
    };
}
```

**Frontend - Authentication Store (client/src/stores/auth.js)**

```javascript
// Pinia store for managing authentication state
export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: null,
        isAuthenticated: false
    }),
    
    actions: {
        async login(email, password) {
            // Call backend API
            const response = await api.post('/api/login', { email, password });
            
            // Store token and user info
            this.token = response.data.token;
            this.user = response.data.user;
            this.isAuthenticated = true;
            
            // Persist in localStorage for page refreshes
            localStorage.setItem('token', this.token);
            localStorage.setItem('user', JSON.stringify(this.user));
        }
    }
});
```

**Axios Interceptor - Automatic Token Injection (client/src/services/api.js)**

```javascript
// Add JWT token to every request automatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        // Add Authorization header with Bearer token
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle authentication errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid - logout user
            const authStore = useAuthStore();
            authStore.logout();
            router.push('/login');
        }
        return Promise.reject(error);
    }
);
```

### 3.2 MCQ Creation with Transactions

Creating an MCQ involves multiple database operations that must all succeed or all fail. I use MySQL transactions to ensure data consistency.

**Backend - QCM Creation (server/routes/qcm.js)**

```javascript
router.post('/create', requireAuth, requireTeacher, async (req, res) => {
    const connection = await pool.getConnection();
    
    try {
        // Start transaction
        await connection.beginTransaction();
        
        // Step 1: Insert QCM
        const [qcmResult] = await connection.execute(
            'INSERT INTO QCM (Name_QCM, Difficulty, ID_user, ID_Chapter) 
             VALUES (?, ?, ?, ?)',
            [qcmData.qcmName, qcmData.difficulty, userId, qcmData.qcmChapter]
        );
        const qcmId = qcmResult.insertId;
        
        // Step 2: Insert each question
        for (const question of qcmData.questions) {
            // Determine question type automatically
            const correctCount = question.isCorrect.filter(Boolean).length;
            const questionType = correctCount > 1 ? 'multiple' : 'unique';
            
            const [questionResult] = await connection.execute(
                'INSERT INTO Question (Question_heading, Number_of_points, 
                 Type_of_question, Negative_points, Explanation, ID_QCM) 
                 VALUES (?, ?, ?, ?, ?, ?)',
                [question.question, question.questionPoints, questionType,
                 question.negativePoints, question.explanation, qcmId]
            );
            const questionId = questionResult.insertId;
            
            // Step 3: Insert answers for this question
            for (let i = 0; i < question.answers.length; i++) {
                await connection.execute(
                    'INSERT INTO Possible_answer (Proposition, Validity, ID_Question) 
                     VALUES (?, ?, ?)',
                    [question.answers[i], question.isCorrect[i] ? 1 : 0, questionId]
                );
            }
        }
        
        // Commit transaction - all operations succeeded
        await connection.commit();
        res.json({ success: true, qcmId });
        
    } catch (error) {
        // Rollback transaction - undo all changes
        await connection.rollback();
        res.status(500).json({ success: false, message: error.message });
    } finally {
        connection.release();
    }
});
```

### 3.3 Grading Algorithm

The grading system calculates scores based on correct/incorrect answers with penalties.

**Backend - Scoring Service (server/services/scoring.js)**

```javascript
// Calculate score for a single-choice question
scoreUniqueQuestion(question, userAnswers, correctAnswers) {
    const userAnswer = userAnswers[0];  // Only one answer possible
    const correctAnswer = correctAnswers[0];
    
    if (userAnswer === correctAnswer) {
        // Correct answer: award full points
        return question.Number_of_points;
    } else if (userAnswer) {
        // Wrong answer: deduct negative points
        return -question.Negative_points;
    } else {
        // No answer: zero points
        return 0;
    }
}

// Calculate score for a multiple-choice question
scoreMultipleQuestion(question, userAnswers, correctAnswers) {
    let score = 0;
    const pointsPerCorrect = question.Number_of_points / correctAnswers.length;
    
    // Check each correct answer
    for (const correctId of correctAnswers) {
        if (userAnswers.includes(correctId)) {
            // Correct answer selected: add proportional points
            score += pointsPerCorrect;
        } else {
            // Correct answer missed: deduct penalty
            score -= question.Negative_points;
        }
    }
    
    // Check for wrong answers selected
    for (const userAnswer of userAnswers) {
        if (!correctAnswers.includes(userAnswer)) {
            // Wrong answer selected: deduct penalty
            score -= question.Negative_points;
        }
    }
    
    // Question score cannot be negative
    return Math.max(0, score);
}

// Calculate final grade for entire MCQ
async scoreAttempt(qcmId, userId, answers) {
    let totalPoints = 0;
    let earnedPoints = 0;
    
    // Score each question
    for (const question of questions) {
        totalPoints += question.Number_of_points;
        
        const questionScore = question.Type_of_question === 'unique'
            ? this.scoreUniqueQuestion(question, userAnswers, correctAnswers)
            : this.scoreMultipleQuestion(question, userAnswers, correctAnswers);
        
        earnedPoints += questionScore;
    }
    
    // Calculate final grade out of 20
    const grade = (earnedPoints / totalPoints) * 20;
    const finalGrade = Math.max(0, grade);  // Minimum grade is 0
    
    return { grade: finalGrade, earnedPoints, totalPoints };
}
```

### 3.4 Route Protection with Middleware

Routes are protected based on user roles using middleware functions.

**Backend - Authentication Middleware (server/middleware/auth.js)**

```javascript
// Verify JWT token
export const requireAuth = (req, res, next) => {
    try {
        // Extract token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }
        
        const token = authHeader.substring(7);
        
        // Verify and decode token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Add user info to request object
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            teacher: decoded.teacher,
            admin: decoded.admin
        };
        
        next();  // Continue to route handler
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

// Verify teacher role
export const requireTeacher = (req, res, next) => {
    if (!req.user.teacher && !req.user.admin) {
        return res.status(403).json({ message: 'Teacher access required' });
    }
    next();
};

// Verify admin role
export const requireAdmin = (req, res, next) => {
    if (!req.user.admin) {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
};
```

**Frontend - Route Guards (client/src/router/index.js)**

```javascript
// Global navigation guard
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    
    // Restore session from localStorage
    if (!authStore.isAuthenticated) {
        authStore.restoreSession();
    }
    
    // Check if route requires authentication
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        return next('/login');
    }
    
    // Check if route requires teacher role
    if (to.meta.requiresTeacher && !authStore.isTeacher && !authStore.isAdmin) {
        return next('/');
    }
    
    // Check if route requires admin role
    if (to.meta.requiresAdmin && !authStore.isAdmin) {
        return next('/');
    }
    
    next();  // Allow navigation
});
```

### 3.5 Internationalization Implementation

The application supports French and English using Vue I18n.

**Configuration (client/src/main.js)**

```javascript
import { createI18n } from 'vue-i18n';
import fr from './locales/fr.json';
import en from './locales/en.json';

// Create i18n instance
const i18n = createI18n({
    legacy: false,
    locale: localStorage.getItem('language') || 'fr',  // Default to French
    fallbackLocale: 'fr',
    messages: { fr, en }
});

app.use(i18n);
```

**Usage in Components**

```vue
<template>
  <div>
    <!-- Use $t() to translate text -->
    <h1>{{ $t('qcm.select') }}</h1>
    <button>{{ $t('qcm.start') }}</button>
    
    <!-- Language selector -->
    <button @click="changeLanguage('fr')">🇫🇷</button>
    <button @click="changeLanguage('en')">🇬🇧</button>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n';

export default {
    setup() {
        const { locale } = useI18n();
        
        const changeLanguage = (lang) => {
            locale.value = lang;
            localStorage.setItem('language', lang);
        };
        
        return { changeLanguage };
    }
};
</script>
```

**Translation Files (client/src/locales/fr.json)**

```json
{
    "nav": {
        "home": "Accueil",
        "qcm": "QCM",
        "create": "Créer"
    },
    "qcm": {
        "select": "Sélectionner un QCM",
        "start": "Commencer",
        "submit": "Soumettre"
    }
}
```

---

## 4. User Guide

### For Students

**Sign up and log in**
1. Create an account with email, name, and password
2. Log in with credentials
3. Access the home page

**Take an MCQ**
1. Click on "Take an MCQ" or use the "MCQ" menu
2. Choose a subject and chapter
3. Optional: filter by difficulty
4. Click "Start" on the desired MCQ
5. Answer the questions (pay attention to the type: single or multiple choice)
6. Click "Submit answers"

**View the correction**
- The correction is displayed automatically after submission
- Correct answers are in green, incorrect ones in red
- Points earned are indicated for each question
- Teacher's explanations help understand mistakes

**Access revision sheets**
1. Go to "Lessons"
2. Select a PDF from the list
3. View it directly or download it

**Change language**
- Click on the French 🇫🇷 or English 🇬🇧 flag in the header
- The interface updates immediately

### For Teachers

Teachers have all student features, plus:

**Create a subject or chapter**
1. Go to "Create Subject/Chapter"
2. Fill in the name and validate
3. The subject/chapter is immediately available

**Create an MCQ**
1. Go to "Create an MCQ"
2. Fill in the information: name, subject, chapter, difficulty
3. Add questions:
   - Write the statement
   - Define positive and negative points
   - Add at least 2 answers
   - Check the correct answers
   - Add an explanation (optional)
4. Click "Create MCQ"

The system automatically checks that everything is correct before creating the MCQ.

### For Administrators

Administrators have all teacher features, plus:

**Manage MCQs**
1. Go to "Admin" → "MCQ Management" tab
2. View all platform MCQs
3. Delete an MCQ if necessary (with confirmation)

**Manage users**
1. Go to "Admin" → "User Management" tab
2. Filter by role if needed
3. Promote a student to teacher
4. Revoke a user's teacher status

Changes are immediate and directly affect the user's permissions.

---

## 5. Conclusion

### Project Summary

This project allowed me to completely modernize the SOSprépa platform by moving from a monolithic PHP architecture to a modern architecture with Vue.js and Node.js. The result is a faster, more maintainable, and more user-friendly application.

The main achievements of this project are:
- Mastery of Vue.js 3 and its ecosystem (Router, Pinia, I18n)
- Development of a secure REST API with Node.js/Express
- Authentication management with JWT
- Use of transactions to ensure data consistency
- Implementation of a role and permission system
- Creation of a multilingual interface

### Challenges Encountered

The main difficulty was faithfully reproducing the grading algorithm from the PHP version, especially for multiple choice questions. I had to create unit tests to ensure the calculations were correct.

Managing MySQL transactions also required attention to avoid inconsistencies when creating MCQs with multiple questions.

### Possible Improvements

If I had more time, I would add:

**Statistics and tracking**
- Dashboard to view progress
- Charts by subject
- Attempt history

**Social features**
- Comments on MCQs
- Discussion forum
- Resource sharing between students

**Experience improvements**
- Exam mode with timer
- Randomly generated MCQs
- Notifications to remind to review
- Mobile application

**Technical side**
- Caching to improve performance
- Two-factor authentication
- Export grades to PDF
- Public API for third-party integrations

### General Conclusion

SOSprépa is now a modern and functional platform that meets the needs of students and teachers. The chosen architecture makes it easy to add new features in the future. This project allowed me to put into practice modern web development concepts and create a complete application from A to Z.

---

## 6. References

Axios. (2024). *Axios HTTP client documentation*. https://axios-http.com/

bcrypt. (2024). *bcrypt npm package*. https://www.npmjs.com/package/bcrypt

Express.js. (2024). *Express API reference*. https://expressjs.com/

Jones, M., Bradley, J., & Sakimura, N. (2015). *JSON Web Token (JWT)*. RFC 7519. https://jwt.io/introduction

Mozilla Developer Network. (2024). *HTTP authentication*. https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication

Node.js Foundation. (2024). *Node.js documentation*. https://nodejs.org/docs/

Oracle Corporation. (2024). *MySQL 8.0 reference manual*. https://dev.mysql.com/doc/

Pinia. (2024). *Pinia documentation - The Vue store that you will enjoy using*. https://pinia.vuejs.org/

Vue.js. (2024). *Vue.js official guide*. https://vuejs.org/guide/

Vue I18n. (2024). *Vue I18n documentation - Internationalization plugin for Vue.js*. https://vue-i18n.intlify.dev/

Vue Router. (2024). *Vue Router documentation - The official router for Vue.js*. https://router.vuejs.org/

W3C. (2023). *Web Content Accessibility Guidelines (WCAG) 2.1*. https://www.w3.org/WAI/WCAG21/quickref/

---

**End of Report**
