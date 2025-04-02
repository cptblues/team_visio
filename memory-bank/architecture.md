# Architecture du Projet Team Visio

Ce document décrit l'architecture du projet et explique le rôle de chaque fichier et dossier.

## Structure des répertoires

```
team_visio/
├── app/                        # Application principale Svelte
│   ├── node_modules/           # Dépendances du projet
│   ├── public/                 # Fichiers statiques accessibles publiquement
│   ├── src/                    # Code source de l'application
│   │   ├── assets/             # Images, polices et autres ressources
│   │   ├── lib/                # Bibliothèques et utilitaires
│   │   │   ├── firebase/       # Utilitaires Firebase
│   │   │   ├── Counter.svelte  # Composant exemple
│   │   │   └── config.js       # Configuration de l'application
│   │   ├── tests/              # Tests automatisés
│   │   │   ├── App.test.js     # Test du composant App
│   │   │   └── config.test.js  # Test de la configuration
│   │   ├── App.svelte          # Composant racine de l'application
│   │   ├── main.js             # Point d'entrée de l'application
│   │   └── setupTests.js       # Configuration des tests
│   ├── .gitignore              # Fichiers à ignorer par Git
│   ├── .env                    # Variables d'environnement de développement
│   ├── .env.testing            # Variables d'environnement de test
│   ├── .env.production         # Variables d'environnement de production
│   ├── .env.example            # Exemple de variables d'environnement
│   ├── index.html              # Page HTML principale
│   ├── package.json            # Dépendances et scripts npm
│   ├── package-lock.json       # Verrouillage des versions de dépendances
│   └── vite.config.js          # Configuration de Vite et Vitest
└── memory-bank/                # Documentation et notes du projet
```

## Composants principaux

### Fichiers d'infrastructure

- **index.html** : Page HTML de base qui charge l'application Svelte.
- **vite.config.js** : Configuration de l'environnement de développement Vite et des tests Vitest.
- **package.json** : Définit les dépendances et les scripts du projet.
- **.env*** : Fichiers de variables d'environnement pour différents contextes.

### Code source

- **src/main.js** : Point d'entrée de l'application qui initialise le composant racine App.
- **src/App.svelte** : Composant racine qui définit la structure globale de l'application.
- **src/setupTests.js** : Configure l'environnement de test pour Vitest.
- **src/lib/config.js** : Module qui gère les variables d'environnement et la configuration.

### Tests

- **src/tests/App.test.js** : Tests unitaires pour le composant App.
- **src/tests/config.test.js** : Tests unitaires pour la configuration.

## Environnements

Le projet utilise trois environnements distincts avec des configurations spécifiques :

1. **Développement** (`.env`) : Utilisé pendant le développement local.
2. **Test** (`.env.testing`) : Utilisé pour les tests automatisés et l'environnement de staging.
3. **Production** (`.env.production`) : Utilisé pour le déploiement en production.

Les variables d'environnement sont accessible via `import.meta.env.VITE_XXX` dans le code source, mais nous recommandons de toujours passer par le module `config.js` qui offre une validation et une gestion centralisée.

## Structure future

À mesure que le projet évoluera, nous ajouterons les dossiers et fichiers suivants :

### Dossiers à venir

- **src/lib/firebase/** : Utilitaires pour l'intégration de Firebase (auth, firestore, etc.).
- **src/components/** : Composants réutilisables (boutons, formulaires, etc.).
- **src/routes/** : Pages de l'application (accueil, salles, etc.).
- **src/stores/** : Magasins Svelte pour la gestion de l'état global.

### Fichiers à venir

- **src/lib/firebase/config.js** : Configuration de Firebase avec les variables d'environnement.
- **src/lib/firebase/auth.js** : Fonctions pour gérer l'authentification.
- **src/lib/firebase/firestore.js** : Fonctions pour interagir avec Firestore.
