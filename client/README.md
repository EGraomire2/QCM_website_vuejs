# Client Vue.js

Interface utilisateur de SOSprépa.

## Installation

```bash
npm install
```

## Développement

```bash
npm run serve
```

## Build production

```bash
npm run build
```

## Structure

- `src/views/` - Pages de l'application
- `src/components/` - Composants réutilisables
- `src/stores/` - Gestion d'état (Pinia)
- `src/services/` - Appels API
- `src/locales/` - Traductions FR/EN
- `src/assets/` - CSS et images

## Variables d'environnement

Créer un fichier `.env` :

```
VUE_APP_API_URL=http://localhost:3000
```

## Routes

- `/` - Page d'accueil
- `/login` - Connexion
- `/register` - Inscription
- `/qcm/select` - Liste des QCM
- `/qcm/create` - Créer un QCM (professeurs)
- `/admin` - Panel admin (administrateurs)
- `/lessons` - Fiches de révision

## Technologies

- Vue 3
- Vue Router
- Pinia
- Axios
- Vue I18n
