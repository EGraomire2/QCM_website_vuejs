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

### Authentication System

I implemented a secure authentication system with JWT. When a user logs in:

1. The server verifies the email and password (hashed with bcrypt)
2. If correct, it generates a JWT token containing the ID, email, and role
3. The token is sent back to the client and stored in localStorage
4. For each subsequent request, the token is sent in the Authorization header
5. The server verifies the token before authorizing access to resources

The authentication middleware automatically checks permissions based on roles.

### MCQ Creation

MCQ creation uses transactions to ensure data consistency. If an error occurs during creation (for example when adding a question), the entire operation is cancelled.

The question type (single or multiple choice) is automatically detected based on the number of answers marked as correct:
- 1 correct answer → Single choice
- 2+ correct answers → Multiple choice

### Grading Algorithm

I developed a grading system that takes into account positive and negative points:

**For single choice questions:**
- Correct answer = +question points
- Wrong answer = -negative points
- No answer = 0 points

**For multiple choice questions:**
- Each correct answer selected = +proportional points
- Each correct answer missed = -negative points
- Each wrong answer selected = -negative points
- A question's score cannot be negative (minimum 0)

The final grade is calculated as follows: (Points earned / Total points) × 20, with a minimum of 0/20.

### Internationalization

I added support for two languages (French and English) with Vue I18n. All interface texts are translated, and users can change language at any time via the flags in the header. The preference is saved in localStorage.

### Administration Panel

The admin panel allows you to:
- View all MCQs and delete them if necessary
- Manage users with role filters
- Promote students to teachers
- Revoke teacher status

Users are automatically sorted by hierarchy (Admin > Teacher > Student).

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
