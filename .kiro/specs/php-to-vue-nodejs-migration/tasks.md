# Implementation Plan

- [x] 1. Configuration initiale du projet





  - Configurer les variables d'environnement pour le serveur Node.js
  - Configurer la connexion à la base de données MySQL avec pool de connexions
  - Mettre en place la structure de dossiers backend (routes, services, middleware, config)
  - Configurer les middleware Express (CORS, JSON parser, error handler)
  - _Requirements: 10.1, 10.5_
-

- [x] 2. Implémentation de l'authentification backend







  - Créer le service d'authentification avec bcrypt pour le hashing des mots de passe
  - Implémenter l'endpoint POST /api/register avec validation des données
  - Implémenter l'endpoint POST /api/login avec génération de JWT
  - Créer le middleware JWT pour protéger les routes
  - Implémenter l'endpoint GET /api/auth/verify pour vérifier les tokens
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 11.1, 11.2_

- [x] 2.1 Écrire les tests de propriété pour l'authentification









  - **Property 1: Password hashing on registration**
  - **Validates: Requirements 1.1, 11.1**

- [x] 2.2 Écrire les tests de propriété pour les tokens JWT








  - **Property 2: JWT token generation on login**
  - **Validates: Requirements 1.2, 11.2**

- [ ]* 2.3 Écrire les tests de propriété pour la validation des tokens
  - **Property 3: Token validation for protected resources**
  - **Property 4: Invalid token rejection**
  - **Validates: Requirements 1.3, 1.4**

- [x] 3. Implémentation des endpoints Subjects et Chapters








  - Créer l'endpoint GET /api/subjects pour récupérer toutes les matières
  - Créer l'endpoint GET /api/chapters avec filtrage par subjectId
  - Créer l'endpoint POST /api/subjects/create (protégé, teacher only)
  - Créer l'endpoint POST /api/chapters/create (protégé, teacher only)
  - Ajouter la validation des rôles (middleware requireTeacher)
  - _Requirements: 4.1, 4.2, 4.3, 2.1_

- [ ]* 3.1 Écrire les tests de propriété pour la gestion des matières et chapitres
  - **Property 15: Subject creation returns valid ID**
  - **Property 16: Chapter-subject association**
  - **Property 17: Chapter filtering by subject**
  - **Validates: Requirements 4.1, 4.2, 4.3**
-

- [x] 4. Implémentation du service de scoring







  - Créer le service de calcul de score pour les questions à choix unique
  - Créer le service de calcul de score pour les questions à choix multiple
  - Implémenter la logique de points négatifs et de plancher à zéro
  - Implémenter le calcul de la note finale sur 20
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

- [ ]* 4.1 Écrire les tests de propriété pour le scoring
  - **Property 23: Full points for correct single-choice answer**
  - **Property 24: Negative points for incorrect single-choice answer**
  - **Property 25: Multiple-choice scoring with penalties**
  - **Property 26: Question score floor at zero**
  - **Property 27: Final grade calculation**
  - **Property 28: Grade floor at zero**
  - **Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5, 6.6**
-

- [ ] 5. Implémentation des endpoints QCM






  - Créer l'endpoint GET /api/qcm avec filtrage par subject et chapter
  - Créer l'endpoint GET /api/qcm/:id pour récupérer un QCM avec ses questions
  - Créer l'endpoint POST /api/qcm/create avec gestion transactionnelle
  - Implémenter la validation des questions (au moins une réponse correcte)
  - Implémenter la détection automatique du type de question (unique/multiple)
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 5.1_

- [ ]* 5.1 Écrire les tests de propriété pour la création de QCM
  - **Property 9: Question validation requires correct answer**
  - **Property 10: Multiple correct answers set type to multiple**
  - **Property 11: Single correct answer sets type to unique**
  - **Property 12: Transactional QCM creation**
  - **Validates: Requirements 3.2, 3.3, 3.4, 3.5**

- [ ]* 5.2 Écrire les tests de propriété pour le filtrage des QCM
  - **Property 18: QCM filtering by subject and chapter**
  - **Validates: Requirements 5.1**
-
-

- [ ] 6. Implémentation de la soumission de réponses et des tentatives





  - Créer l'endpoint POST /api/qcm/:id/submit pour soumettre les réponses
  - Implémenter la suppression de l'ancienne tentative si elle existe
  - Créer l'enregistrement Attempt avec la note calculée
  - Créer les enregistrements Answer_question et Has_answered
  - Utiliser le service de scoring pour calculer les points
  - _Requirements: 5.5, 5.6, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

- [ ]* 6.1 Écrire les tests de propriété pour les tentatives
  - **Property 21: Attempt creation on submission**
  - **Property 22: Attempt replacement**
  - **Validates: Requirements 5.5, 5.6**
-

- [ ] 7. Implémentation de l'endpoint de correction





  - Créer l'endpoint GET /api/qcm/:qcmId/correction/:attemptId
  - Récupérer le QCM, les questions, les propositions et les réponses de l'utilisateur
  - Récupérer les points obtenus pour chaque question
  - Formater les données pour l'affichage de la correction
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

-

- [ ] 8. Implémentation de l'endpoint des tentatives utilisateur






  - Créer l'endpoint GET /api/attempts pour récupérer les tentatives de l'utilisateur connecté
  - Filtrer les tentatives par utilisateur
  - _Requirements: 5.6_

- [ ] 9. Checkpoint Backend - Vérifier que tous les tests passent






  - Ensure all tests pass, ask the user if questions arise.
-
- [ ] 10. Configuration du projet Vue.js frontend






- [ ] 10. Configuration du projet Vue.js frontend




  - Initialiser le projet Vue 3 avec Vite
  - Installer et configurer Vue Router
  - Installer et configurer Pinia pour la gestion d'état
  - Installer Axios pour les appels API
  - Copier les fichiers CSS existants dans src/assets
  - _Requirements: 9.1, 9.2, 14.1_
-

- [x] 11. Création du service API et des stores







  - Créer le service API avec Axios et configuration de base
  - Ajouter les intercepteurs pour le token JWT
  - Ajouter les intercepteurs pour la gestion des erreurs
  - Créer le store d'authentification (Pinia)
  - Créer le store de notifications pour les messages flash
  - _Requirements: 9.2, 9.3, 9.4, 9.5, 13.1, 13.2, 13.3, 13.4_

- [ ]* 11.1 Écrire les tests de propriété pour le store d'authentification
  - **Property 5: Session invalidation on logout**
  - **Property 33: Reactive UI updates on auth state change**
  - **Property 34: Auth state persistence across navigation**
  - **Validates: Requirements 1.5, 9.4, 9.5**
-

- [x] 12. Implémentation des vues d'authentification







  - Corriger et compléter LoginView.vue avec gestion d'erreurs
  - Corriger et compléter RegisterView.vue avec validation des mots de passe
  - Ajouter la gestion des messages flash
  - Intégrer avec le store d'authentification
  - Ajouter la redirection après connexion/inscription
  - _Requirements: 1.1, 1.2, 1.5, 13.1, 13.2, 13.5_

- [ ]* 12.1 Écrire les tests unitaires pour les vues d'authentification
  - Tester le rendu des formulaires
  - Tester la validation côté client
  - Tester les appels API
  - _Requirements: 1.1, 1.2_
- [x] 13. Implémentation de la vue Home




- [ ] 13. Implémentation de la vue Home




  - Corriger HomeView.vue pour utiliser Vue Router au lieu de liens HTML
  - Ajouter la navigation conditionnelle basée sur l'authentification
  - Intégrer le header avec navigation dynamique
  - Appliquer les styles CSS existants
  - _Requirements: 2.4, 14.1, 14.2_
-
- [x] 14. Création du composant Header réutilisable




- [ ] 14. Création du composant Header réutilisable




  - Créer un composant Header.vue avec navigation conditionnelle
  - Afficher les liens appropriés selon le rôle (teacher/student)
  - Afficher les liens de connexion/inscription si non connecté
  - Intégrer dans toutes les vues
  - _Requirements: 2.4, 14.2_

- [ ]* 14.1 Écrire les tests de propriété pour la navigation basée sur les rôles
  - **Property 7: Teacher-only route protection**
  - **Property 8: Role-based navigation rendering**
  - **Validates: Requirements 2.3, 2.4**
-

- [x] 15. Implémentation de la vue CreateQCM







  - Créer le formulaire complet de création de QCM
  - Implémenter la sélection de matière et chapitre avec filtrage dynamique
  - Implémenter l'ajout/suppression de questions
  - Implémenter l'ajout/suppression de réponses
  - Implémenter le toggle unique/multiple choice
  - Implémenter les compteurs de points et points négatifs
  - Ajouter la validation côté client
  - Intégrer avec l'API backend
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 4.4_

- [ ]* 15.1 Écrire les tests unitaires pour CreateQCMView
  - Tester l'ajout/suppression de questions
  - Tester l'ajout/suppression de réponses
  - Tester la validation du formulaire
  - _Requirements: 3.1, 3.2_
-

- [x] 16. Implémentation de la vue SelectQCM






  - Créer le formulaire de sélection de matière et chapitre
  - Implémenter le filtrage dynamique des chapitres par matière
  - Récupérer et afficher la liste des QCM filtrés
  - Afficher les tentatives précédentes de l'utilisateur
  - Ajouter les liens vers les QCM et les corrections
  - Appliquer les styles CSS existants
  - _Requirements: 4.3, 5.1, 5.6, 14.4_

- [ ]* 16.1 Écrire les tests unitaires pour SelectQCMView
  - Tester le filtrage des chapitres
  - Tester le filtrage des QCM
  - Tester l'affichage des tentatives
  - _Requirements: 4.3, 5.1_

- [x] 17. Implémentation de la vue AnswerQCM







  - Récupérer le QCM avec ses questions depuis l'API
  - Afficher les questions avec leurs propositions
  - Implémenter la sélection unique pour les questions "unique"
  - Implémenter la sélection multiple pour les questions "multiple"
  - Gérer l'état des réponses sélectionnées
  - Implémenter la soumission des réponses
  - Rediriger vers la correction après soumission
  - Appliquer les styles CSS existants
  - _Requirements: 5.2, 5.3, 5.4, 5.5, 14.2_

- [ ]* 17.1 Écrire les tests de propriété pour la sélection de réponses
  - **Property 19: Single-choice answer deselection**
  - **Property 20: Multiple-choice multiple selections**
  - **Validates: Requirements 5.3, 5.4**

- [ ]* 17.2 Écrire les tests unitaires pour AnswerQCMView
  - Tester le chargement des questions
  - Tester la sélection de réponses
  - Tester la soumission
  - _Requirements: 5.2, 5.3, 5.4, 5.5_
-
- [x] 18. Implémentation de la vue Correction




- [ ] 18. Implémentation de la vue Correction



  - Récupérer les données de correction depuis l'API
  - Afficher les questions avec toutes les propositions
  - Distinguer visuellement les réponses correctes et incorrectes
  - Indiquer les réponses sélectionnées par l'utilisateur
  - Afficher les explications quand elles existent
  - Afficher les points obtenus par question et la note totale
  - Appliquer les styles CSS existants (correct.css)
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 14.5_

- [ ]* 18.1 Écrire les tests de propriété pour l'affichage de la correction
  - **Property 29: Visual distinction of correct/incorrect answers**
  - **Property 30: User selection indication**
  - **Property 31: Explanation display when present**
  - **Validates: Requirements 7.2, 7.3, 7.4**

- [ ]* 18.2 Écrire les tests unitaires pour CorrectionView
  - Tester l'affichage des propositions
  - Tester l'affichage des explications
  - Tester l'affichage des scores
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
-

- [x] 19. Implémentation de la vue Lessons





- [ ] 19. Implémentation de la vue Lessons
  - Créer le dropdown de sélection de PDF
  - Implémenter l'affichage du PDF dans un iframe
  - Implémenter le bouton de téléchargement
  - Gérer l'affichage conditionnel du viewer et du bouton
  - Appliquer les styles CSS existants (lessons.css)
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 14.1_

- [ ]* 19.1 Écrire les tests unitaires pour LessonsView
  - Tester la sélection de PDF
  - Tester l'affichage du viewer
  - Tester le bouton de téléchargement
  - _Requirements: 8.1, 8.2, 8.3, 8.4_
-
- [x] 20. Configuration des guards de navigation




- [ ] 20. Configuration des guards de navigation



  - Créer le guard requireAuth pour les routes protégées
  - Créer le guard requireTeacher pour les routes professeur
  - Implémenter la vérification du token au chargement de l'application
  - Rediriger vers login si non authentifié
  - Rediriger vers home si non autorisé
  - _Requirements: 1.3, 1.4, 2.2, 2.3_

-

- [x] 21. Implémentation du système de notifications





  - Créer un composant NotificationToast pour les messages flash
  - Implémenter l'auto-dismiss après 5 secondes
  - Implémenter le clearing des messages à la navigation
  - Intégrer dans App.vue
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

- [ ]* 21.1 Écrire les tests de propriété pour les notifications
  - **Property 41: Success message display**
  - **Property 42: Error message display with details**
  - **Property 43: Message auto-dismissal**
  - **Property 44: Message clearing on navigation**
  - **Property 45: Authentication failure reason display**
  - **Validates: Requirements 13.1, 13.2, 13.3, 13.4, 13.5**

- [x] 22. Checkpoint Frontend - Vérifier que tous les tests passent






  - Ensure all tests pass, ask the user if questions arise.
-

- [x] 23. Tests d'intégration end-to-end




  - Tester le flux complet d'inscription et connexion
  - Tester le flux complet de création de QCM par un professeur
  - Tester le flux complet de réponse à un QCM par un étudiant
  - Tester le flux complet de consultation de la correction
  - Tester la gestion des erreurs et des cas limites
  - _Requirements: All_

- [ ]* 23.1 Écrire les tests de propriété pour la compatibilité avec l'algorithme PHP
  - **Property 40: Scoring algorithm consistency**
  - **Validates: Requirements 12.4**

- [ ] 24. Vérification finale et optimisation



  - Vérifier que tous les styles CSS sont correctement appliqués
  - Vérifier la compatibilité avec la base de données existante
  - Optimiser les requêtes SQL si nécessaire
  - Vérifier la sécurité (validation, sanitization, JWT)
  - Tester sur différents navigateurs
  - _Requirements: 11.3, 11.4, 12.1, 12.2, 12.3, 14.1, 14.2, 14.3, 14.4, 14.5_

- [x] 25. Documentation et déploiement





  - Créer un README avec instructions d'installation
  - Documenter les variables d'environnement
  - Documenter l'API (endpoints, paramètres, réponses)
  - Préparer les scripts de déploiement
  - _Requirements: All_
