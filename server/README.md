# Server Node.js

API backend de SOSprépa.

## Installation

```bash
npm install
```

## Démarrage

```bash
node app.js
```

Le serveur démarre sur le port 3000.

## Structure

- `routes/` - Endpoints API
- `services/` - Logique métier
- `middleware/` - Auth, CORS, etc.
- `config/` - Configuration DB et JWT
- `tests/` - Tests unitaires et d'intégration

## Variables d'environnement

Créer un fichier `.env` :

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=sos_prepa_bdd
JWT_SECRET=votre_secret_jwt
PORT=3000
```

## API Endpoints

### Auth
- `POST /api/register` - Inscription
- `POST /api/login` - Connexion
- `GET /api/auth/verify` - Vérifier le token

### QCM
- `GET /api/qcm` - Liste des QCM
- `GET /api/qcm/:id` - Détails d'un QCM
- `POST /api/qcm/create` - Créer un QCM (professeur)
- `POST /api/qcm/:id/submit` - Soumettre des réponses
- `GET /api/qcm/:qcmId/correction/:attemptId` - Voir la correction
- `DELETE /api/qcm/:id` - Supprimer un QCM (admin)

### Matières & Chapitres
- `GET /api/subjects` - Liste des matières
- `POST /api/subjects/create` - Créer une matière
- `GET /api/chapters` - Liste des chapitres
- `POST /api/chapters/create` - Créer un chapitre

### Admin
- `GET /api/admin/users` - Liste des utilisateurs
- `PATCH /api/admin/users/:id/teacher` - Modifier le statut professeur

### Tentatives
- `GET /api/attempts` - Mes tentatives

## Tests

```bash
npm test
```

## Scripts utiles

```bash
node scripts/make-admin.js email@example.com
```

Promouvoir un utilisateur en administrateur.
