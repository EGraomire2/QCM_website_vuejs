# Stores Documentation

Ce dossier contient les stores Pinia pour la gestion d'état de l'application.

## Auth Store (`auth.js`)

Le store d'authentification gère l'état de connexion de l'utilisateur.

### État
- `user`: Objet utilisateur (id, email, nickname, teacher)
- `token`: Token JWT pour l'authentification
- `isAuthenticated`: Boolean indiquant si l'utilisateur est connecté
- `isTeacher`: Boolean indiquant si l'utilisateur est un professeur

### Getters
- `isLoggedIn`: Retourne true si l'utilisateur est connecté
- `userRole`: Retourne 'teacher' ou 'student'
- `currentUser`: Retourne l'objet utilisateur

### Actions
- `login(email, password)`: Connecte l'utilisateur
- `register(username, email, password)`: Inscrit un nouvel utilisateur
- `logout()`: Déconnecte l'utilisateur
- `checkAuth()`: Vérifie la validité du token
- `initializeFromStorage()`: Initialise l'état depuis localStorage

### Utilisation

```javascript
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Connexion
await authStore.login('user@example.com', 'password')

// Vérifier si connecté
if (authStore.isAuthenticated) {
  console.log('Utilisateur connecté:', authStore.user)
}

// Déconnexion
authStore.logout()
```

## Notification Store (`notification.js`)

Le store de notifications gère l'affichage des messages flash.

### État
- `message`: Message à afficher
- `type`: Type de notification ('success', 'error', 'info', 'warning')
- `visible`: Boolean indiquant si la notification est visible
- `timeout`: ID du timeout pour l'auto-dismiss
- `duration`: Durée d'affichage en millisecondes

### Getters
- `hasNotification`: Retourne true si une notification est visible
- `notificationClass`: Retourne la classe CSS basée sur le type

### Actions
- `showSuccess(message, duration)`: Affiche un message de succès
- `showError(message, duration)`: Affiche un message d'erreur
- `showInfo(message, duration)`: Affiche un message d'information
- `showWarning(message, duration)`: Affiche un message d'avertissement
- `show(message, type, duration)`: Affiche un message personnalisé
- `clear()`: Efface la notification
- `clearOnNavigation()`: Efface les notifications lors de la navigation

### Utilisation

```javascript
import { useNotificationStore } from '@/stores/notification'

const notificationStore = useNotificationStore()

// Afficher un message de succès
notificationStore.showSuccess('Opération réussie!')

// Afficher un message d'erreur
notificationStore.showError('Une erreur est survenue.')

// Afficher un message avec durée personnalisée (10 secondes)
notificationStore.showInfo('Information importante', 10000)

// Effacer manuellement
notificationStore.clear()
```

## Intégration avec le Router

Les stores sont intégrés avec Vue Router pour:
- Effacer les notifications lors de la navigation
- Protéger les routes nécessitant une authentification
- Protéger les routes réservées aux professeurs

Voir `router/index.js` pour les navigation guards.
