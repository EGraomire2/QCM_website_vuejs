# Problèmes d'Authentification - Diagnostic et Solutions

## Problèmes Identifiés

### 1. ✅ Fichier `.env` manquant dans le client
**Problème :** Le fichier `client/.env` n'existait pas, ce qui empêchait l'application Vue.js de connaître l'URL de l'API.

**Solution :** Fichier créé avec la configuration suivante :
```
VUE_APP_API_URL=http://localhost:3000
VUE_APP_NAME=SOSprépa
```

### 2. ⚠️ Exécution de scripts PowerShell désactivée
**Problème :** Les commandes npm ne peuvent pas s'exécuter car PowerShell bloque l'exécution de scripts.

**Solutions possibles :**
- **Option A (Recommandée) :** Utiliser CMD au lieu de PowerShell
  ```cmd
  cd server
  node app.js
  ```

- **Option B :** Activer l'exécution de scripts PowerShell (nécessite des droits admin)
  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```

- **Option C :** Utiliser directement node
  ```cmd
  cd server
  node app.js
  ```

## Comment Tester

### Étape 1 : Démarrer le serveur backend
```cmd
cd server
node app.js
```

Vous devriez voir :
```
✓ Server is running at http://localhost:3000
✓ Environment: development
✓ API endpoints available at http://localhost:3000/api
```

### Étape 2 : Tester les endpoints (optionnel)
Dans un nouveau terminal :
```cmd
node test-server.js
```

### Étape 3 : Démarrer le client Vue.js
Dans un nouveau terminal :
```cmd
cd client
npm run serve
```

### Étape 4 : Tester l'inscription et la connexion
1. Ouvrir http://localhost:8080 dans le navigateur
2. Aller sur la page d'inscription
3. Créer un compte
4. Se connecter avec les identifiants créés

## Vérifications Supplémentaires

### Vérifier la base de données
Assurez-vous que :
- MySQL est démarré
- La base de données `sos_prepa_bdd` existe
- La table `Accountt` existe avec les bonnes colonnes

```sql
USE sos_prepa_bdd;
DESCRIBE Accountt;
```

### Vérifier les variables d'environnement
**Serveur (`server/.env`) :**
```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=sos_prepa_bdd
JWT_SECRET=REZMT4K5LMRSTU
JWT_EXPIRES_IN=1h
CORS_ORIGIN=http://localhost:8080
```

**Client (`client/.env`) :**
```
VUE_APP_API_URL=http://localhost:3000
```

## Erreurs Courantes et Solutions

### Erreur : "Network Error"
**Cause :** Le serveur backend n'est pas démarré ou n'est pas accessible.
**Solution :** Vérifier que le serveur tourne sur le port 3000.

### Erreur : "CORS policy"
**Cause :** Le serveur n'autorise pas les requêtes depuis le client.
**Solution :** Vérifier que `CORS_ORIGIN=http://localhost:8080` dans `server/.env`.

### Erreur : "Email ou mot de passe incorrect"
**Cause :** Les identifiants sont incorrects ou l'utilisateur n'existe pas.
**Solution :** Vérifier dans la base de données ou créer un nouveau compte.

### Erreur : "Un compte avec cet email existe déjà"
**Cause :** L'email est déjà utilisé.
**Solution :** Utiliser un autre email ou se connecter avec cet email.

### Erreur : "Token invalide" ou "Session expirée"
**Cause :** Le token JWT a expiré ou est invalide.
**Solution :** Se reconnecter.

## Architecture des Endpoints

### Endpoints d'authentification
- `POST /api/register` - Inscription
  - Body: `{ username, email, password }`
  - Response: `{ success: true, message, userId }`

- `POST /api/login` - Connexion
  - Body: `{ email, password }`
  - Response: `{ success: true, token, user: { id, email, nickname, teacher } }`

- `GET /api/auth/verify` - Vérification du token (protégé)
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ success: true, user }`

- `POST /api/logout` - Déconnexion (protégé)
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ success: true, message }`

## Flux d'Authentification

### Inscription
1. L'utilisateur remplit le formulaire d'inscription
2. Le client valide les données (email, longueur du mot de passe, correspondance)
3. Le client envoie `POST /api/register`
4. Le serveur vérifie si l'email existe déjà
5. Le serveur hash le mot de passe avec bcrypt
6. Le serveur insère l'utilisateur dans la base de données
7. Le client redirige vers la page de connexion

### Connexion
1. L'utilisateur remplit le formulaire de connexion
2. Le client envoie `POST /api/login`
3. Le serveur vérifie l'email et le mot de passe
4. Le serveur génère un token JWT
5. Le serveur stocke le token dans la base de données
6. Le serveur retourne le token et les infos utilisateur
7. Le client stocke le token dans localStorage
8. Le client redirige vers la page d'accueil

### Vérification du token
1. À chaque requête protégée, le client ajoute le token dans le header `Authorization`
2. Le middleware `authenticateToken` vérifie le token JWT
3. Si valide, la requête continue
4. Si invalide, retourne une erreur 401

## Prochaines Étapes

1. ✅ Créer le fichier `client/.env`
2. ⏳ Démarrer le serveur backend
3. ⏳ Démarrer le client frontend
4. ⏳ Tester l'inscription
5. ⏳ Tester la connexion
6. ⏳ Vérifier que les routes protégées fonctionnent

## Commandes Utiles

### Démarrer le serveur (CMD)
```cmd
cd server
node app.js
```

### Démarrer le client (CMD)
```cmd
cd client
npm run serve
```

### Tester les endpoints
```cmd
node test-server.js
```

### Vérifier la base de données
```cmd
mysql -u root -p
USE sos_prepa_bdd;
SELECT * FROM Accountt;
```
