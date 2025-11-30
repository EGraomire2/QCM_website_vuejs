# Implémentation de l'internationalisation (i18n)

## Vue d'ensemble

L'internationalisation a été complètement implémentée sur toutes les vues de l'application. L'application supporte maintenant le français et l'anglais avec un sélecteur de langue dans le header.

## Fichiers modifiés

### Vues traduites

Toutes les vues suivantes ont été mises à jour pour utiliser `$t()` au lieu de texte en dur :

1. **LoginView.vue** - Page de connexion
2. **RegisterView.vue** - Page d'inscription
3. **HomeView.vue** - Page d'accueil
4. **CreateSubjectView.vue** - Création de matières et chapitres
5. **SelectQcmView.vue** - Sélection de QCM
6. **AnswerQcmView.vue** - Répondre à un QCM
7. **CorrectionView.vue** - Affichage de la correction
8. **CreateQcmView.vue** - Création de QCM
9. **LessonsView.vue** - Fiches de révision

### Fichiers de traduction

Les fichiers de traduction ont été complétés avec toutes les clés nécessaires :

- **client/src/locales/fr.json** - Traductions françaises
- **client/src/locales/en.json** - Traductions anglaises

## Structure des traductions

Les traductions sont organisées par catégories :

```json
{
  "app": { ... },           // Informations générales de l'application
  "nav": { ... },           // Navigation et menu
  "home": { ... },          // Page d'accueil
  "auth": { ... },          // Authentification (login/register)
  "qcm": { ... },           // Tout ce qui concerne les QCM
  "subjects": { ... },      // Matières et chapitres
  "lessons": { ... },       // Fiches de révision
  "messages": { ... }       // Messages d'erreur génériques
}
```

## Fonctionnalités

### Sélecteur de langue

Un sélecteur de langue avec drapeaux a été ajouté dans le header :
- 🇫🇷 Français
- 🇬🇧 English

Le changement de langue est instantané et persiste dans le localStorage.

### Traductions dynamiques

Les traductions supportent les paramètres dynamiques :

```javascript
// Exemple avec paramètres
this.$t('qcm.qcmSubmittedSuccess', { grade: grade.toFixed(2) })
// Résultat: "QCM soumis avec succès! Note: 15.50/20"
```

### Messages d'erreur

Tous les messages d'erreur et de validation ont été traduits :
- Validation de formulaires
- Messages de succès
- Messages d'erreur API
- Messages de chargement

## Utilisation

Pour ajouter une nouvelle traduction :

1. Ajoutez la clé dans `fr.json` et `en.json`
2. Utilisez `$t('categorie.cle')` dans le template
3. Pour les paramètres dynamiques : `$t('cle', { param: valeur })`

## Tests

Tous les fichiers ont été vérifiés avec getDiagnostics - aucune erreur détectée.

## Prochaines étapes possibles

- Ajouter d'autres langues (espagnol, allemand, etc.)
- Traduire les messages d'erreur du backend
- Ajouter des traductions pour les emails
- Implémenter la détection automatique de la langue du navigateur
