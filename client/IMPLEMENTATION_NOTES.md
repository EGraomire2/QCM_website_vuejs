# Task 11: API Service and Stores Implementation

## Completed Components

### 1. API Service (`src/services/api.js`)

✅ **Configuration de base avec Axios**
- Instance Axios configurée avec baseURL depuis variable d'environnement
- Headers par défaut: `Content-Type: application/json`

✅ **Intercepteur pour le token JWT**
- Ajout automatique du token JWT dans le header `Authorization: Bearer <token>`
- Récupération du token depuis localStorage

✅ **Intercepteur pour la gestion des erreurs**
- Gestion des erreurs 401 (Unauthorized): déconnexion et redirection
- Gestion des erreurs 403 (Forbidden): message d'accès non autorisé
- Gestion des erreurs 404 (Not Found): ressource non trouvée
- Gestion des erreurs 409 (Conflict): conflit de données
- Gestion des erreurs 500+ (Server Error): erreur serveur
- Gestion des erreurs réseau (Network Error)
- Intégration avec le NotificationStore pour afficher les messages

### 2. Auth Store (`src/stores/auth.js`)

✅ **État d'authentification**
- `user`: Informations de l'utilisateur
- `token`: Token JWT
- `isAuthenticated`: Statut de connexion
- `isTeacher`: Rôle de l'utilisateur

✅ **Getters**
- `isLoggedIn`: Vérification de connexion
- `userRole`: Rôle de l'utilisateur (teacher/student)
- `currentUser`: Informations utilisateur

✅ **Actions**
- `login(email, password)`: Connexion avec gestion d'erreurs
- `register(username, email, password)`: Inscription avec validation
- `logout()`: Déconnexion avec nettoyage
- `checkAuth()`: Vérification de la validité du token
- `initializeFromStorage()`: Initialisation depuis localStorage

✅ **Intégration avec NotificationStore**
- Messages de succès pour connexion/inscription/déconnexion
- Messages d'erreur détaillés pour les échecs

### 3. Notification Store (`src/stores/notification.js`)

✅ **État des notifications**
- `message`: Message à afficher
- `type`: Type de notification (success, error, info, warning)
- `visible`: Visibilité de la notification
- `timeout`: Gestion du timeout
- `duration`: Durée d'affichage (défaut: 5000ms)

✅ **Getters**
- `hasNotification`: Vérification de notification active
- `notificationClass`: Classe CSS basée sur le type

✅ **Actions**
- `showSuccess(message, duration)`: Message de succès
- `showError(message, duration)`: Message d'erreur
- `showInfo(message, duration)`: Message d'information
- `showWarning(message, duration)`: Message d'avertissement
- `show(message, type, duration)`: Message personnalisé
- `clear()`: Effacement manuel
- `clearOnNavigation()`: Effacement lors de la navigation

✅ **Auto-dismiss**
- Disparition automatique après 5 secondes (configurable)
- Gestion propre des timeouts

### 4. Router Integration (`src/router/index.js`)

✅ **Navigation Guards**
- Vérification d'authentification pour les routes protégées
- Vérification du rôle professeur pour les routes réservées
- Redirection automatique vers login si non authentifié
- Redirection vers home si accès non autorisé

✅ **Notification Clearing**
- Effacement automatique des notifications lors de la navigation
- Prévention de l'accumulation de messages

✅ **Redirection intelligente**
- Redirection des utilisateurs connectés depuis login/register vers home
- Conservation de l'URL de destination après login (query.redirect)

### 5. App Initialization (`src/main.js`)

✅ **Initialisation de l'état**
- Initialisation du store d'authentification depuis localStorage au démarrage
- Vérification automatique de la validité du token

### 6. Documentation

✅ **Fichiers créés**
- `client/src/stores/README.md`: Documentation des stores
- `client/src/services/README.md`: Documentation du service API
- `client/.env.example`: Template de configuration

## Requirements Validés

### Requirement 9.2: API calls avec Axios
✅ Service API centralisé avec configuration Axios

### Requirement 9.3: Gestion des erreurs API
✅ Intercepteur de réponse avec messages d'erreur conviviaux

### Requirement 9.4: Mise à jour réactive de l'UI
✅ Store Pinia avec état réactif pour l'authentification

### Requirement 9.5: Préservation de l'état d'authentification
✅ Persistance dans localStorage et initialisation au démarrage

### Requirement 13.1: Messages de succès
✅ NotificationStore avec méthode showSuccess

### Requirement 13.2: Messages d'erreur avec détails
✅ NotificationStore avec méthode showError et détails

### Requirement 13.3: Auto-dismiss des messages
✅ Timeout automatique de 5 secondes (configurable)

### Requirement 13.4: Effacement lors de la navigation
✅ Navigation guard qui efface les notifications

## Propriétés de Correction Validées

### Property 5: Session invalidation on logout
✅ Le store auth efface complètement l'état et le localStorage lors du logout

### Property 33: Reactive UI updates on auth state change
✅ Utilisation de Pinia pour la réactivité automatique

### Property 34: Auth state persistence across navigation
✅ État préservé dans le store Pinia pendant la navigation

### Property 41: Success message display
✅ NotificationStore.showSuccess() implémenté

### Property 42: Error message display with details
✅ NotificationStore.showError() avec messages détaillés

### Property 43: Message auto-dismissal
✅ Timeout automatique après 5 secondes

### Property 44: Message clearing on navigation
✅ clearOnNavigation() appelé dans le navigation guard

### Property 45: Authentication failure reason display
✅ Messages d'erreur spécifiques dans auth.login()

## Fonctionnalités Supplémentaires

- Support de 4 types de notifications (success, error, info, warning)
- Durée d'affichage configurable par notification
- Gestion propre des timeouts pour éviter les fuites mémoire
- Getters pour faciliter l'utilisation dans les composants
- Documentation complète avec exemples d'utilisation
- Template de configuration d'environnement
- Gestion des dépendances circulaires (import dynamique dans api.js)

## Prochaines Étapes

1. Créer les composants Vue pour utiliser ces stores
2. Implémenter le composant NotificationToast pour afficher les messages
3. Tester l'intégration avec le backend
4. Ajouter des tests unitaires pour les stores et le service API

## Notes Techniques

- **Import dynamique**: Utilisé dans api.js pour éviter les dépendances circulaires
- **localStorage**: Utilisé pour la persistance du token et des données utilisateur
- **Navigation guards**: Implémentés dans le router pour la sécurité
- **Pinia**: Choisi pour la gestion d'état (plus moderne que Vuex)
- **Axios interceptors**: Utilisés pour la logique transversale (auth, erreurs)
