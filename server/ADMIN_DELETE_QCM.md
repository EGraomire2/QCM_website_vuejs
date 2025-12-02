# Route d'administration - Suppression de QCM

## Vue d'ensemble

Une nouvelle route protégée a été ajoutée pour permettre aux administrateurs de supprimer des QCM et toutes leurs données associées.

## Endpoint

```
DELETE /api/qcm/:id
```

### Authentification

- **Requise** : Oui (JWT token)
- **Rôle requis** : Administrateur
- **Middleware** : `authenticateToken`, `requireAdmin`

### Paramètres

- **id** (path parameter) : ID du QCM à supprimer

### Réponse

#### Succès (200)
```json
{
  "success": true,
  "message": "QCM \"Nom du QCM\" supprimé avec succès",
  "deletedQcmId": 123
}
```

#### Erreurs

**401 Unauthorized** - Token manquant ou invalide
```json
{
  "success": false,
  "message": "Authorization header required"
}
```

**403 Forbidden** - Utilisateur non administrateur
```json
{
  "success": false,
  "message": "Accès réservé aux administrateurs"
}
```

**404 Not Found** - QCM non trouvé
```json
{
  "success": false,
  "message": "QCM non trouvé"
}
```

## Modifications apportées

### 1. Middleware d'authentification (`server/middleware/auth.js`)

Ajout du middleware `requireAdmin` :

```javascript
const requireAdmin = (req, res, next) => {
    if (!req.user || !req.user.admin) {
        return res.status(403).json({
            success: false,
            message: 'Accès réservé aux administrateurs'
        });
    }
    next();
};
```

### 2. Service d'authentification (`server/services/auth.js`)

Le champ `Administrator` est maintenant inclus dans :
- La génération du token JWT
- La réponse de login
- La vérification du token

### 3. Store d'authentification client (`client/src/stores/auth.js`)

Ajout du champ `isAdmin` dans le state pour gérer le rôle d'administrateur côté client.

### 4. Route de suppression (`server/routes/qcm.js`)

La route effectue une suppression en cascade dans l'ordre suivant :
1. **Has_answered** - Réponses sélectionnées par les utilisateurs
2. **Answer_question** - Réponses aux questions
3. **Attempt** - Tentatives de QCM
4. **Possible_answer** - Propositions de réponses
5. **Question** - Questions du QCM
6. **QCM** - Le QCM lui-même

Toutes les opérations sont effectuées dans une transaction pour garantir l'intégrité des données.

## Utilisation

### Exemple avec curl

```bash
curl -X DELETE http://localhost:3000/api/qcm/123 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Exemple avec JavaScript (fetch)

```javascript
const deleteQcm = async (qcmId) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`http://localhost:3000/api/qcm/${qcmId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  return data;
};
```

### Exemple avec le service API client

```javascript
import api from '@/services/api';

const deleteQcm = async (qcmId) => {
  try {
    const response = await api.delete(`/api/qcm/${qcmId}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    throw error;
  }
};
```

## Sécurité

- ✅ Authentification JWT requise
- ✅ Vérification du rôle administrateur
- ✅ Transaction SQL pour garantir l'intégrité
- ✅ Rollback automatique en cas d'erreur
- ✅ Validation de l'existence du QCM avant suppression

## Prochaines étapes

Pour implémenter l'interface d'administration :

1. Créer une vue `AdminView.vue` dans `client/src/views/`
2. Ajouter une route protégée dans le router
3. Créer un guard de navigation pour vérifier `authStore.isAdmin`
4. Implémenter l'interface de gestion des QCM avec boutons de suppression
5. Ajouter des confirmations avant suppression
6. Afficher des notifications de succès/erreur

## Base de données

### Champ Administrator

Le champ `Administrator` dans la table `users` doit être de type `BOOLEAN` :

```sql
CREATE TABLE users (
    ID_user INT NOT NULL AUTO_INCREMENT,
    Nickname VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    Teacher BOOLEAN NOT NULL DEFAULT 0,
    Administrator BOOLEAN NOT NULL DEFAULT 0,
    Token TEXT,
    PRIMARY KEY (ID_user)
);
```

Pour promouvoir un utilisateur en administrateur :

```sql
UPDATE users SET Administrator = 1 WHERE ID_user = ?;
```

## Tests

Pour tester cette fonctionnalité :

1. Créer un utilisateur administrateur dans la base de données
2. Se connecter avec cet utilisateur
3. Récupérer le token JWT
4. Appeler l'endpoint DELETE avec le token
5. Vérifier que le QCM et toutes ses données associées sont supprimés

## Notes importantes

- ⚠️ La suppression est **irréversible**
- ⚠️ Toutes les tentatives et réponses des utilisateurs sont également supprimées
- ⚠️ Aucune sauvegarde n'est effectuée automatiquement
- 💡 Considérer l'ajout d'une suppression "soft" (marquage comme supprimé) pour les besoins d'audit
