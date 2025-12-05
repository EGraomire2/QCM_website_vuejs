# SOSprépa - Plateforme de QCM Interactive

---

**Nom et ID:** [Votre Nom et ID]  
**Code d'Intake:** [Votre Code d'Intake]  
**Matière:** Développement Web  
**Titre du Projet:** Migration et Modernisation de la Plateforme SOSprépa

---

## Table des Matières

1. Introduction
2. Conception
3. Implémentation
4. Guide Utilisateur
5. Conclusion
6. Références

---

## 1. Introduction

### Contexte du Projet

SOSprépa est une plateforme web que j'ai développée pour aider les étudiants de l'EFREI à réviser leurs cours à travers des QCM interactifs. Le projet initial était en PHP, mais j'ai décidé de le moderniser complètement en utilisant Vue.js pour le frontend et Node.js pour le backend.

### Objectifs

L'objectif principal était de créer une application moderne et facile à utiliser où :
- Les étudiants peuvent passer des QCM et voir leurs corrections détaillées
- Les professeurs peuvent créer des QCM avec différents types de questions
- Les administrateurs peuvent gérer les utilisateurs et les contenus

### Technologies Utilisées

**Frontend :**
- Vue.js 3 pour l'interface utilisateur
- Vue Router pour la navigation
- Pinia pour la gestion d'état
- Axios pour les appels API
- Vue I18n pour le support multilingue (français/anglais)

**Backend :**
- Node.js avec Express pour l'API
- MySQL pour la base de données
- JWT pour l'authentification
- bcrypt pour sécuriser les mots de passe

### Fonctionnalités Principales

- Système d'authentification sécurisé
- Création de QCM avec questions à choix unique ou multiple
- Correction automatique avec système de points positifs et négatifs
- Interface multilingue (français/anglais)
- Panel d'administration pour gérer les utilisateurs et les QCM
- Consultation de fiches de révision en PDF

---

## 2. Conception

### Architecture Générale

J'ai opté pour une architecture client-serveur classique :
- Le frontend Vue.js communique avec le backend via une API REST
- Le backend Node.js gère la logique métier et les accès à la base de données
- L'authentification se fait par tokens JWT stockés côté client

### Base de Données

La base de données contient 8 tables principales :

**Accountt** : Stocke les utilisateurs avec leurs rôles (étudiant, professeur, admin)

**Subjectt et Chapter** : Organisent les QCM par matières et chapitres

**QCM** : Contient les informations des questionnaires (nom, difficulté, créateur)

**Question** : Stocke les questions avec leurs points et explications

**Possible_answer** : Les réponses possibles pour chaque question

**Attempt** : Enregistre les tentatives des étudiants avec leurs notes

**Answer_question et Has_answered** : Lient les réponses des étudiants aux questions


### Structure de Navigation

L'application suit un flux logique simple :

1. **Connexion/Inscription** → Page d'accueil
2. **Page d'accueil** → Accès aux différentes fonctionnalités selon le rôle
3. **Sélection QCM** → Réponse au QCM → Correction détaillée
4. **Création QCM** (professeurs uniquement)
5. **Panel Admin** (administrateurs uniquement)

Les routes sont protégées : si un étudiant essaie d'accéder à la création de QCM, il est automatiquement redirigé vers l'accueil.

### Wireframes Principaux

**Page de Connexion**
- Formulaire simple avec email et mot de passe
- Lien vers l'inscription
- Sélecteur de langue (drapeaux FR/EN)

**Page d'Accueil**
- Menu de navigation avec les options selon le rôle
- Cartes cliquables pour accéder aux fonctionnalités principales
- Message de bienvenue personnalisé

**Sélection de QCM**
- Filtres par matière, chapitre et difficulté
- Liste des QCM disponibles avec badges de difficulté (Facile/Moyen/Difficile)
- Bouton "Commencer" pour chaque QCM

**Réponse au QCM**
- Questions affichées une par une ou toutes ensemble
- Boutons radio pour choix unique, cases à cocher pour choix multiple
- Indication du nombre de points par question
- Bouton de soumission en bas de page

**Correction**
- Note finale affichée en haut
- Pour chaque question : réponses en vert (correctes) ou rouge (incorrectes)
- Indication des réponses sélectionnées par l'étudiant
- Explications du professeur si disponibles

**Création de QCM (Professeurs)**
- Formulaire pour les infos générales (nom, matière, chapitre, difficulté)
- Section pour ajouter des questions avec leurs réponses
- Possibilité de marquer plusieurs réponses comme correctes
- Champs pour les points positifs et négatifs

**Panel Admin**
- Onglet "Gestion des QCM" : liste avec possibilité de suppression
- Onglet "Gestion des Utilisateurs" : liste avec filtres par rôle
- Actions pour promouvoir/révoquer le statut professeur

---

## 3. Implémentation

### Système d'Authentification

J'ai implémenté un système d'authentification sécurisé avec JWT. Quand un utilisateur se connecte :

1. Le serveur vérifie l'email et le mot de passe (haché avec bcrypt)
2. Si c'est correct, il génère un token JWT contenant l'ID, l'email et le rôle
3. Le token est renvoyé au client et stocké dans le localStorage
4. Pour chaque requête suivante, le token est envoyé dans l'header Authorization
5. Le serveur vérifie le token avant d'autoriser l'accès aux ressources

Le middleware d'authentification vérifie automatiquement les permissions selon les rôles.

### Création de QCM

La création de QCM utilise des transactions pour garantir la cohérence des données. Si une erreur survient pendant la création (par exemple lors de l'ajout d'une question), toute l'opération est annulée.

Le type de question (choix unique ou multiple) est détecté automatiquement selon le nombre de réponses marquées comme correctes :
- 1 réponse correcte → Choix unique
- 2+ réponses correctes → Choix multiple

### Algorithme de Notation

J'ai développé un système de notation qui prend en compte les points positifs et négatifs :

**Pour les questions à choix unique :**
- Bonne réponse = +points de la question
- Mauvaise réponse = -points négatifs
- Pas de réponse = 0 point

**Pour les questions à choix multiple :**
- Chaque bonne réponse sélectionnée = +points proportionnels
- Chaque bonne réponse manquée = -points négatifs
- Chaque mauvaise réponse sélectionnée = -points négatifs
- Le score d'une question ne peut pas être négatif (minimum 0)

La note finale est calculée ainsi : (Points obtenus / Points totaux) × 20, avec un minimum de 0/20.

### Internationalisation

J'ai ajouté le support de deux langues (français et anglais) avec Vue I18n. Tous les textes de l'interface sont traduits, et l'utilisateur peut changer de langue à tout moment via les drapeaux dans l'en-tête. La préférence est sauvegardée dans le localStorage.

### Panel d'Administration

Le panel admin permet de :
- Voir tous les QCM et les supprimer si nécessaire
- Gérer les utilisateurs avec filtres par rôle
- Promouvoir des étudiants en professeurs
- Révoquer le statut professeur

Les utilisateurs sont automatiquement triés par hiérarchie (Admin > Professeur > Étudiant).

---

## 4. Guide Utilisateur

### Pour les Étudiants

**S'inscrire et se connecter**
1. Créer un compte avec email, nom et mot de passe
2. Se connecter avec les identifiants
3. Accéder à la page d'accueil

**Passer un QCM**
1. Cliquer sur "Passer un QCM" ou utiliser le menu "QCM"
2. Choisir une matière et un chapitre
3. Optionnel : filtrer par difficulté
4. Cliquer sur "Commencer" sur le QCM souhaité
5. Répondre aux questions (attention au type : choix unique ou multiple)
6. Cliquer sur "Soumettre les réponses"

**Voir la correction**
- La correction s'affiche automatiquement après la soumission
- Les réponses correctes sont en vert, les incorrectes en rouge
- Les points obtenus sont indiqués pour chaque question
- Les explications du professeur aident à comprendre les erreurs

**Consulter les fiches de révision**
1. Aller dans "Leçons"
2. Sélectionner un PDF dans la liste
3. Le visualiser directement ou le télécharger

**Changer de langue**
- Cliquer sur le drapeau français 🇫🇷 ou anglais 🇬🇧 dans l'en-tête
- L'interface se met à jour immédiatement

### Pour les Professeurs

Les professeurs ont toutes les fonctionnalités des étudiants, plus :

**Créer une matière ou un chapitre**
1. Aller dans "Créer Matière/Chapitre"
2. Remplir le nom et valider
3. La matière/chapitre est immédiatement disponible

**Créer un QCM**
1. Aller dans "Créer un QCM"
2. Remplir les informations : nom, matière, chapitre, difficulté
3. Ajouter des questions :
   - Écrire l'énoncé
   - Définir les points positifs et négatifs
   - Ajouter au moins 2 réponses
   - Cocher les réponses correctes
   - Ajouter une explication (optionnel)
4. Cliquer sur "Créer le QCM"

Le système vérifie automatiquement que tout est correct avant de créer le QCM.

### Pour les Administrateurs

Les administrateurs ont toutes les fonctionnalités des professeurs, plus :

**Gérer les QCM**
1. Aller dans "Admin" → onglet "Gestion des QCM"
2. Voir tous les QCM de la plateforme
3. Supprimer un QCM si nécessaire (avec confirmation)

**Gérer les utilisateurs**
1. Aller dans "Admin" → onglet "Gestion des Utilisateurs"
2. Filtrer par rôle si besoin
3. Promouvoir un étudiant en professeur
4. Révoquer le statut professeur d'un utilisateur

Les modifications sont immédiates et affectent directement les permissions de l'utilisateur.

---

## 5. Conclusion

### Bilan du Projet

Ce projet m'a permis de moderniser complètement la plateforme SOSprépa en passant d'une architecture PHP monolithique à une architecture moderne avec Vue.js et Node.js. Le résultat est une application plus rapide, plus maintenable et plus agréable à utiliser.

Les principaux acquis de ce projet sont :
- Maîtrise de Vue.js 3 et de son écosystème (Router, Pinia, I18n)
- Développement d'une API REST sécurisée avec Node.js/Express
- Gestion de l'authentification avec JWT
- Utilisation de transactions pour garantir la cohérence des données
- Implémentation d'un système de rôles et permissions
- Création d'une interface multilingue

### Difficultés Rencontrées

La principale difficulté a été de reproduire fidèlement l'algorithme de notation de la version PHP, notamment pour les questions à choix multiple. J'ai dû créer des tests unitaires pour m'assurer que les calculs étaient corrects.

La gestion des transactions MySQL a aussi demandé de l'attention pour éviter les incohérences lors de la création de QCM avec plusieurs questions.

### Améliorations Possibles

Si j'avais plus de temps, j'ajouterais :

**Statistiques et suivi**
- Tableau de bord pour voir sa progression
- Graphiques par matière
- Historique des tentatives

**Fonctionnalités sociales**
- Commentaires sur les QCM
- Forum de discussion
- Partage de ressources entre étudiants

**Amélioration de l'expérience**
- Mode examen avec chronomètre
- QCM aléatoires générés automatiquement
- Notifications pour rappeler de réviser
- Application mobile

**Côté technique**
- Mise en cache pour améliorer les performances
- Authentification à deux facteurs
- Export des notes en PDF
- API publique pour intégrations tierces

### Conclusion Générale

SOSprépa est maintenant une plateforme moderne et fonctionnelle qui répond aux besoins des étudiants et des professeurs. L'architecture choisie permet d'ajouter facilement de nouvelles fonctionnalités à l'avenir. Ce projet m'a permis de mettre en pratique les concepts de développement web moderne et de créer une application complète de A à Z.

---

## 6. Références

Vue.js Official Documentation. (2024). Retrieved from https://vuejs.org/

Node.js Documentation. (2024). Retrieved from https://nodejs.org/docs/

Express.js API Reference. (2024). Retrieved from https://expressjs.com/

MySQL 8.0 Reference Manual. (2024). Retrieved from https://dev.mysql.com/doc/

JWT Introduction. (2024). Retrieved from https://jwt.io/introduction

Vue Router Documentation. (2024). Retrieved from https://router.vuejs.org/

Pinia Documentation. (2024). Retrieved from https://pinia.vuejs.org/

Vue I18n Documentation. (2024). Retrieved from https://vue-i18n.intlify.dev/

---

**Fin du Rapport**
