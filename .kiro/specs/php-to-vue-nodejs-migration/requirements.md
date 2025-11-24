# Requirements Document

## Introduction

Ce document définit les exigences pour le portage de l'application SOSprépa d'une architecture PHP monolithique vers une architecture moderne avec Vue.js pour le frontend et Node.js/Express pour le backend. L'application est une plateforme éducative permettant aux professeurs de créer des QCM (questionnaires à choix multiples) et aux étudiants de les compléter, avec correction automatique et consultation de fiches de révision.

## Glossary

- **System**: L'application SOSprépa dans son ensemble (frontend Vue.js + backend Node.js)
- **User**: Utilisateur de l'application (professeur ou étudiant)
- **Teacher**: Utilisateur avec privilèges de création de contenu
- **Student**: Utilisateur standard pouvant répondre aux QCM
- **QCM**: Questionnaire à Choix Multiples
- **Question**: Une question individuelle dans un QCM
- **Proposition**: Une réponse possible à une question
- **Attempt**: Une tentative de réponse à un QCM par un utilisateur
- **Subject**: Matière académique (ex: Mathématiques, Probabilités)
- **Chapter**: Chapitre d'une matière
- **Token**: Jeton d'authentification JWT pour sécuriser les sessions
- **Grade**: Note obtenue sur 20 pour un QCM
- **Flash Message**: Message temporaire affiché à l'utilisateur

## Requirements

### Requirement 1: Authentification et Gestion des Utilisateurs

**User Story:** En tant qu'utilisateur, je veux pouvoir créer un compte et me connecter, afin d'accéder aux fonctionnalités de l'application.

#### Acceptance Criteria

1. WHEN a user submits valid registration credentials THEN THE System SHALL create a new user account with encrypted password
2. WHEN a user submits valid login credentials THEN THE System SHALL generate a JWT token and return it to the client
3. WHEN a user makes an authenticated request with a valid token THEN THE System SHALL verify the token and allow access to protected resources
4. WHEN a user makes an authenticated request with an invalid or expired token THEN THE System SHALL reject the request and return a 401 status code
5. WHEN a user logs out THEN THE System SHALL invalidate the session on the client side

### Requirement 2: Gestion des Rôles et Permissions

**User Story:** En tant qu'administrateur système, je veux différencier les professeurs des étudiants, afin de contrôler l'accès aux fonctionnalités de création de contenu.

#### Acceptance Criteria

1. WHEN a user account is created THEN THE System SHALL assign a role (teacher or student) to the account
2. WHEN a teacher accesses the QCM creation page THEN THE System SHALL display the creation interface
3. WHEN a student attempts to access the QCM creation page THEN THE System SHALL deny access and redirect to the home page
4. WHEN the navigation menu is rendered THEN THE System SHALL display role-appropriate menu items based on user permissions

### Requirement 3: Création de QCM par les Professeurs

**User Story:** En tant que professeur, je veux créer des QCM avec questions et réponses, afin de permettre aux étudiants de s'exercer.

#### Acceptance Criteria

1. WHEN a teacher selects a subject and chapter THEN THE System SHALL enable the QCM creation form
2. WHEN a teacher adds a question with at least two answers THEN THE System SHALL validate that at least one answer is marked as correct
3. WHEN a teacher marks multiple answers as correct THEN THE System SHALL set the question type to "multiple choice"
4. WHEN a teacher marks only one answer as correct THEN THE System SHALL set the question type to "single choice"
5. WHEN a teacher submits a complete QCM THEN THE System SHALL save all questions, answers, and metadata to the database in a single transaction
6. WHEN a teacher specifies negative points for a question THEN THE System SHALL store this value for scoring calculations
7. WHEN a teacher adds an explanation to a question THEN THE System SHALL store it for display during correction

### Requirement 4: Gestion des Matières et Chapitres

**User Story:** En tant que professeur, je veux créer de nouvelles matières et chapitres, afin d'organiser les QCM par thématique.

#### Acceptance Criteria

1. WHEN a teacher creates a new subject THEN THE System SHALL add it to the subjects list and return the new subject ID
2. WHEN a teacher creates a new chapter for a subject THEN THE System SHALL associate the chapter with the specified subject
3. WHEN a user selects a subject THEN THE System SHALL display only chapters belonging to that subject
4. WHEN the QCM creation form loads THEN THE System SHALL populate subject and chapter dropdowns with current database values

### Requirement 5: Réponse aux QCM par les Étudiants

**User Story:** En tant qu'étudiant, je veux répondre aux QCM disponibles, afin de tester mes connaissances.

#### Acceptance Criteria

1. WHEN a user selects a subject and chapter THEN THE System SHALL display all QCM matching those criteria
2. WHEN a user clicks on a QCM THEN THE System SHALL display all questions with their answer options
3. WHEN a user selects an answer for a single-choice question THEN THE System SHALL deselect any previously selected answer for that question
4. WHEN a user selects answers for a multiple-choice question THEN THE System SHALL allow multiple selections
5. WHEN a user submits their answers THEN THE System SHALL calculate the score and create an attempt record
6. WHEN a user has previously attempted a QCM THEN THE System SHALL replace the old attempt with the new one

### Requirement 6: Calcul Automatique des Notes

**User Story:** En tant que système, je veux calculer automatiquement les notes des QCM, afin de fournir un feedback immédiat aux étudiants.

#### Acceptance Criteria

1. WHEN scoring a single-choice question where the correct answer is selected THEN THE System SHALL award the full points for that question
2. WHEN scoring a single-choice question where an incorrect answer is selected THEN THE System SHALL deduct the negative points specified
3. WHEN scoring a multiple-choice question THEN THE System SHALL deduct negative points for each incorrect selection or missed correct answer
4. WHEN the total points for a question fall below zero THEN THE System SHALL set the question score to zero
5. WHEN all questions are scored THEN THE System SHALL calculate the final grade as (earned points / total points) × 20
6. WHEN the final grade is below zero THEN THE System SHALL set the grade to zero

### Requirement 7: Affichage de la Correction

**User Story:** En tant qu'étudiant, je veux voir la correction détaillée de mes réponses, afin de comprendre mes erreurs.

#### Acceptance Criteria

1. WHEN a user views their correction THEN THE System SHALL display each question with all propositions
2. WHEN displaying propositions THEN THE System SHALL visually distinguish correct answers from incorrect ones
3. WHEN displaying propositions THEN THE System SHALL indicate which answers the user selected
4. WHEN a question has an explanation THEN THE System SHALL display it in the correction view
5. WHEN displaying the correction THEN THE System SHALL show the points earned for each question and the total grade

### Requirement 8: Consultation des Fiches de Révision

**User Story:** En tant qu'étudiant, je veux consulter des fiches de révision en PDF, afin de réviser les notions de cours.

#### Acceptance Criteria

1. WHEN a user selects a PDF from the dropdown THEN THE System SHALL display the PDF in an embedded viewer
2. WHEN a PDF is displayed THEN THE System SHALL show a download button
3. WHEN a user clicks the download button THEN THE System SHALL open the PDF in a new tab for download
4. WHEN no PDF is selected THEN THE System SHALL hide the viewer and download button

### Requirement 9: Architecture Frontend Vue.js

**User Story:** En tant que développeur, je veux une architecture frontend moderne avec Vue.js, afin de faciliter la maintenance et l'évolution de l'application.

#### Acceptance Criteria

1. WHEN the application loads THEN THE System SHALL use Vue Router for client-side navigation
2. WHEN making API calls THEN THE System SHALL use Axios with centralized configuration
3. WHEN an API error occurs THEN THE System SHALL display user-friendly error messages
4. WHEN user authentication state changes THEN THE System SHALL update the UI reactively
5. WHEN navigating between pages THEN THE System SHALL preserve authentication state using Vuex or Pinia

### Requirement 10: Architecture Backend Node.js/Express

**User Story:** En tant que développeur, je veux une API REST avec Node.js/Express, afin de séparer la logique métier du frontend.

#### Acceptance Criteria

1. WHEN the server starts THEN THE System SHALL establish a connection to the MySQL database
2. WHEN an API endpoint is called THEN THE System SHALL validate request parameters and body
3. WHEN a database error occurs THEN THE System SHALL rollback transactions and return appropriate error responses
4. WHEN handling authentication THEN THE System SHALL use JWT middleware to protect routes
5. WHEN processing requests THEN THE System SHALL use Express middleware for CORS, JSON parsing, and error handling

### Requirement 11: Sécurité et Validation

**User Story:** En tant qu'administrateur système, je veux que l'application soit sécurisée, afin de protéger les données des utilisateurs.

#### Acceptance Criteria

1. WHEN storing passwords THEN THE System SHALL hash them using bcrypt with appropriate salt rounds
2. WHEN generating JWT tokens THEN THE System SHALL include user ID, email, and role in the payload
3. WHEN validating user input THEN THE System SHALL sanitize and validate all data before database operations
4. WHEN executing SQL queries THEN THE System SHALL use parameterized queries to prevent SQL injection
5. WHEN handling CORS THEN THE System SHALL configure allowed origins appropriately for the environment

### Requirement 12: Migration des Données et Compatibilité

**User Story:** En tant que développeur, je veux maintenir la compatibilité avec la base de données existante, afin de préserver les données actuelles.

#### Acceptance Criteria

1. WHEN connecting to the database THEN THE System SHALL use the existing schema without modifications
2. WHEN querying tables THEN THE System SHALL use the existing table names (Accountt, Subjectt, QCM, Question, etc.)
3. WHEN handling user sessions THEN THE System SHALL maintain compatibility with the existing Token field
4. WHEN calculating scores THEN THE System SHALL use the same algorithm as the PHP version
5. WHEN displaying data THEN THE System SHALL format it consistently with the existing application

### Requirement 13: Messages Flash et Feedback Utilisateur

**User Story:** En tant qu'utilisateur, je veux recevoir des messages de confirmation ou d'erreur, afin de comprendre le résultat de mes actions.

#### Acceptance Criteria

1. WHEN an action succeeds THEN THE System SHALL display a success message to the user
2. WHEN an action fails THEN THE System SHALL display an error message with details
3. WHEN a message is displayed THEN THE System SHALL automatically dismiss it after a reasonable duration
4. WHEN navigating to a new page THEN THE System SHALL clear previous messages
5. WHEN authentication fails THEN THE System SHALL display the reason for failure

### Requirement 14: Réutilisation des Styles Existants

**User Story:** En tant que développeur, je veux réutiliser les styles CSS existants, afin de maintenir la cohérence visuelle de l'application.

#### Acceptance Criteria

1. WHEN rendering views THEN THE System SHALL apply the existing CSS files without modification
2. WHEN displaying forms THEN THE System SHALL use the existing class names and structure
3. WHEN showing the navigation header THEN THE System SHALL maintain the existing visual design
4. WHEN displaying QCM lists THEN THE System SHALL preserve the existing card layout and styling
5. WHEN showing corrections THEN THE System SHALL use the existing color scheme for correct/incorrect answers
