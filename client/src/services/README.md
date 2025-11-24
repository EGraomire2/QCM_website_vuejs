# Services Documentation

Ce dossier contient les services pour communiquer avec l'API backend.

## API Service (`api.js`)

Le service API est une instance Axios configurée pour communiquer avec le backend Node.js.

### Configuration

- **Base URL**: Configurée via `VUE_APP_API_URL` (défaut: `http://localhost:3000`)
- **Headers**: `Content-Type: application/json`
- **Authentification**: Token JWT automatiquement ajouté aux requêtes

### Intercepteurs

#### Request Interceptor
Ajoute automatiquement le token JWT à toutes les requêtes si l'utilisateur est connecté.

```javascript
Authorization: Bearer <token>
```

#### Response Interceptor
Gère automatiquement les erreurs HTTP:

- **401 Unauthorized**: Session expirée, redirection vers login
- **403 Forbidden**: Accès non autorisé
- **404 Not Found**: Ressource non trouvée
- **409 Conflict**: Conflit (ex: email déjà utilisé)
- **500+ Server Error**: Erreur serveur
- **Network Error**: Erreur de connexion

Toutes les erreurs affichent automatiquement une notification via le `NotificationStore`.

### Utilisation

```javascript
import api from '@/services/api'

// GET request
const response = await api.get('/api/qcm')
console.log(response.data)

// POST request
const response = await api.post('/api/login', {
  email: 'user@example.com',
  password: 'password'
})

// PUT request
const response = await api.put('/api/qcm/1', {
  name: 'Nouveau nom'
})

// DELETE request
await api.delete('/api/qcm/1')

// Avec paramètres de requête
const response = await api.get('/api/qcm', {
  params: {
    subjectId: 1,
    chapterId: 2
  }
})

// Avec headers personnalisés
const response = await api.get('/api/qcm', {
  headers: {
    'Custom-Header': 'value'
  }
})
```

### Gestion des Erreurs

Les erreurs sont automatiquement gérées par l'intercepteur, mais vous pouvez aussi les gérer manuellement:

```javascript
try {
  const response = await api.post('/api/qcm/create', qcmData)
  // Succès
} catch (error) {
  // L'erreur a déjà été affichée via notification
  // Vous pouvez ajouter une logique supplémentaire ici
  console.error('Erreur:', error)
}
```

### Variables d'Environnement

Créez un fichier `.env` à la racine du projet client:

```env
VUE_APP_API_URL=http://localhost:3000
```

Pour la production:

```env
VUE_APP_API_URL=https://api.sosprepa.com
```

### Endpoints Disponibles

#### Authentification
- `POST /api/register` - Inscription
- `POST /api/login` - Connexion
- `GET /api/auth/verify` - Vérification du token
- `POST /api/logout` - Déconnexion

#### QCM
- `GET /api/qcm` - Liste des QCM (avec filtres)
- `GET /api/qcm/:id` - Détails d'un QCM
- `POST /api/qcm/create` - Créer un QCM (professeur)
- `POST /api/qcm/:id/submit` - Soumettre des réponses
- `GET /api/qcm/:qcmId/correction/:attemptId` - Voir la correction

#### Matières et Chapitres
- `GET /api/subjects` - Liste des matières
- `GET /api/chapters` - Liste des chapitres (avec filtre par matière)
- `POST /api/subjects/create` - Créer une matière (professeur)
- `POST /api/chapters/create` - Créer un chapitre (professeur)

#### Tentatives
- `GET /api/attempts` - Liste des tentatives de l'utilisateur
