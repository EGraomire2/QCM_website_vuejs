# SOSprépa - Plateforme de QCM

Site web de révision pour les étudiants EFREI avec des QCM interactifs.

## Démarrage rapide

```bash
# Installer les dépendances
npm install
cd client && npm install
cd ../server && npm install

# Lancer le projet
npm run dev
```

Le site sera accessible sur http://localhost:8080

## Structure

- `client/` - Interface Vue.js
- `server/` - API Node.js/Express
- `former_project/` - Scripts SQL de la base de données

## Fonctionnalités

- Création et gestion de QCM par les professeurs
- Passage de QCM avec correction automatique
- Système de notation avec points négatifs
- Fiches de révision PDF
- Interface multilingue (FR/EN)
- Panel d'administration

## Configuration

Copier les fichiers `.env.example` vers `.env` dans `client/` et `server/` et remplir les variables.

## Base de données

Utiliser les scripts SQL dans `former_project/` pour créer la base MySQL.

## Scripts utiles

```bash
npm run dev          # Lancer client + serveur
npm run client       # Lancer uniquement le client
npm run server       # Lancer uniquement le serveur
npm run make-admin   # Promouvoir un utilisateur en admin
```

## Comptes par défaut

Voir `former_project/sosprepa_JeuxDonnées.sql` pour les comptes de test.

---

Projet réalisé dans le cadre des études à EFREI Paris.
