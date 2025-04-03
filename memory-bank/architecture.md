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
│   │   │   │   ├── index.js    # Initialisation Firebase
│   │   │   │   ├── firestore.js # Utilitaires Firestore
│   │   │   │   ├── auth.js     # Utilitaires d'authentification
│   │   │   │   ├── rooms.js    # Utilitaires de gestion des salles
│   │   │   │   └── admin.js    # Utilitaires d'administration
│   │   │   ├── Counter.svelte  # Composant exemple
│   │   │   └── config.js       # Configuration de l'application
│   │   ├── tests/              # Tests automatisés
│   │   │   ├── App.test.js     # Test du composant App
│   │   │   ├── config.test.js  # Test de la configuration
│   │   │   ├── firebase.test.js # Test de l'initialisation Firebase
│   │   │   ├── firestore.test.js # Test des fonctions Firestore
│   │   │   ├── RoomList.test.js # Test du composant RoomList
│   │   │   └── AdminRoomManager.test.js # Test du gestionnaire admin
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

### Module Firebase

- **src/lib/firebase/index.js** : Point d'entrée pour Firebase qui initialise les services (Firestore, Auth) et exporte les instances.
- **src/lib/firebase/firestore.js** : Fonctions CRUD génériques pour interagir avec Firestore et définition des collections.
- **src/lib/firebase/auth.js** : Fonctions pour gérer l'authentification des utilisateurs (inscription, connexion, déconnexion).
- **src/lib/firebase/rooms.js** : Fonctions spécifiques pour gérer les salles dans l'application.
- **src/lib/firebase/admin.js** : Fonctions d'administration pour gérer les droits des utilisateurs.
- **src/lib/firebase/seedData.js** : Fonctions d'initialisation de données pour le développement.

### Module Jitsi Meet

- **src/lib/jitsi/index.js** : Utilitaires pour l'intégration avec Jitsi Meet, gestion de la connexion et initialisation des salles de visioconférence.
- **src/components/conference/JitsiRoom.svelte** : Composant qui encapsule la visioconférence Jitsi Meet avec gestion des états et synchronisation avec Firestore.

### Tests

- **src/tests/App.test.js** : Tests unitaires pour le composant App.
- **src/tests/config.test.js** : Tests unitaires pour la configuration.
- **src/tests/firebase.test.js** : Tests unitaires pour l'initialisation de Firebase.
- **src/tests/firestore.test.js** : Tests unitaires pour les fonctions Firestore.
- **src/tests/RoomList.test.js** : Tests unitaires pour le composant de liste des salles.
- **src/tests/AdminRoomManager.test.js** : Tests unitaires pour le gestionnaire admin.
- **src/tests/HomePage.test.js** : Tests unitaires pour la page d'accueil.
- **src/tests/JitsiMeet.test.js** : Tests unitaires pour l'intégration de Jitsi Meet.

## Composants UI

La structure des composants de l'interface utilisateur est la suivante :

```
src/components/
├── Header.svelte        # En-tête de l'application avec logo et statut
├── Footer.svelte        # Pied de page avec liens et copyright
├── Hero.svelte          # Section principale de présentation sur la page d'accueil
├── Features.svelte      # Présentation des fonctionnalités de l'application
├── CallToAction.svelte  # Incitation à l'action pour l'utilisateur
├── UserStatusBar.svelte # Barre de statut utilisateur
├── FirebaseDebugger.svelte # Débogueur Firebase en développement
├── auth/                # Composants liés à l'authentification
│   ├── AuthContainer.svelte  # Conteneur pour les formulaires d'authentification
│   ├── LoginForm.svelte      # Formulaire de connexion
│   ├── RegisterForm.svelte   # Formulaire d'inscription
│   └── UserProfile.svelte    # Profil de l'utilisateur connecté
├── rooms/               # Composants liés aux salles
│   ├── RoomList.svelte       # Liste des salles disponibles
│   ├── AddRoomForm.svelte    # Formulaire d'ajout de salle
│   └── AdminRoomManager.svelte # Gestionnaire de salles pour administrateurs
└── admin/               # Composants d'administration
    └── MakeAdmin.svelte      # Outil pour devenir administrateur en développement
└── conference/          # Composants de visioconférence
    └── JitsiRoom.svelte      # Intégration de Jitsi Meet dans l'application
```

## Stores

La gestion de l'état global est effectuée à travers des stores Svelte :

```
src/stores/
└── userStore.js         # Store pour gérer l'état de l'utilisateur connecté
```

## Styles

Les styles de l'application sont centralisés dans :

```
src/styles/
└── global.css           # Styles globaux, variables CSS et utilitaires
```

## Routing

Le système de routage est géré par svelte-spa-router :

```
src/
├── routes.js            # Configuration des routes de l'application
└── routes/
    ├── index.svelte     # Composant de la page d'accueil
    └── demo.svelte      # Page de démonstration pour Jitsi Meet
```

## Modèle de données

### Collection `users`

Stocke les informations des utilisateurs.

```javascript
{
  uid: String,           // ID utilisateur (correspondant à l'ID Firebase Auth)
  email: String,         // Email de l'utilisateur
  displayName: String,   // Nom d'affichage
  isAdmin: Boolean,      // Si l'utilisateur est administrateur
  createdAt: Timestamp   // Date de création du compte
}
```

### Collection `rooms`

Stocke les informations des salles.

```javascript
{
  name: String,          // Nom de la salle
  description: String,   // Description de la salle
  createdBy: String,     // ID de l'utilisateur créateur
  isPublic: Boolean,     // Si la salle est publique
  participants: Array,   // Liste des participants [userId1, userId2, ...]
  capacity: Number,      // Nombre maximum de participants (null = illimité)
  createdAt: Timestamp,  // Date de création de la salle
  updatedAt: Timestamp   // Date de dernière modification
}
```

### Collection `settings`

Stocke les paramètres globaux de l'application.

```javascript
{
  id: String,            // ID du document (par exemple "global")
  // Autres paramètres selon les besoins
}
```

## Environnements

Le projet utilise trois environnements distincts avec des configurations spécifiques :

1. **Développement** (`.env`) : Utilisé pendant le développement local.
2. **Test** (`.env.testing`) : Utilisé pour les tests automatisés et l'environnement de staging.
3. **Production** (`.env.production`) : Utilisé pour le déploiement en production.

Les variables d'environnement sont accessible via `import.meta.env.VITE_XXX` dans le code source, mais nous recommandons de toujours passer par le module `config.js` qui offre une validation et une gestion centralisée.

## Structure future

À mesure que le projet évoluera, nous ajouterons les dossiers et fichiers suivants :

### Dossiers à venir

- **src/components/** : Composants réutilisables (boutons, formulaires, etc.).
- **src/routes/** : Pages de l'application (accueil, salles, etc.).
- **src/stores/** : Magasins Svelte pour la gestion de l'état global.

### Fichiers à venir

- **src/lib/firebase/config.js** : Configuration de Firebase avec les variables d'environnement.
- **src/lib/firebase/auth.js** : Fonctions pour gérer l'authentification.
- **src/lib/firebase/firestore.js** : Fonctions pour interagir avec Firestore.

## Sécurité Firebase

### Règles de sécurité Firestore

Configuration des règles de sécurité pour Firestore :

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Règles pour le développement (à ne pas utiliser en production)
    match /{document=**} {
      allow read, write: if true;
    }
    
    // Règles pour la production (à implémenter plus tard)
    // match /users/{userId} {
    //   allow read, update, delete: if request.auth != null && request.auth.uid == userId;
    //   allow create: if request.auth != null;
    // }
    // match /rooms/{roomId} {
    //   allow read: if true;
    //   allow create, update, delete: if request.auth != null;
    // }
    // match /settings/{document=**} {
    //   allow read: if true;
    //   allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    // }
  }
}
```

### Configuration Firebase

Les paramètres de configuration Firebase sont stockés dans les fichiers d'environnement :

```
.env
.env.testing
.env.production
```

Avec les variables suivantes :

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID
```

## Fonctionnalités d'administration

L'application inclut un système d'administration permettant aux utilisateurs ayant le statut d'administrateur de gérer les salles et les utilisateurs :

### Gestion des droits

- **Module d'administration** : `src/lib/firebase/admin.js` fournit des fonctions pour gérer les droits d'administration.
- **Composant de promotion** : `src/components/admin/MakeAdmin.svelte` permet aux utilisateurs de se promouvoir administrateurs en développement.

### API d'administration

```javascript
// Mettre à jour le statut d'administrateur d'un utilisateur (réservé aux admins)
updateUserAdminStatus(userId, isAdmin)

// Se promouvoir administrateur (uniquement en développement)
makeSelfAdmin()
```

### Stockage des droits

- Le statut d'administrateur est stocké dans le champ `isAdmin` de chaque document utilisateur dans Firestore.
- Le système vérifie automatiquement ce statut lors de la connexion et le met à disposition dans le store utilisateur.
- L'interface utilisateur s'adapte automatiquement pour afficher les fonctionnalités d'administration aux utilisateurs concernés.

### Accès aux fonctionnalités administratives

- Un store dérivé `isAdmin` permet de vérifier facilement si l'utilisateur actuel est un administrateur.
- Les fonctionnalités d'administration sont conditionnellement affichées dans l'interface utilisateur.
- Des vérifications de sécurité sont effectuées côté serveur pour empêcher les accès non autorisés.

## Intégration avec Jitsi Meet

L'application intègre Jitsi Meet pour la visioconférence en utilisant leur API externe :

### Configuration

```javascript
// Dans config.js
export const jitsiConfig = {
  domain: import.meta.env.VITE_JITSI_DOMAIN || 'meet.jit.si',
  roomPrefix: import.meta.env.VITE_JITSI_ROOM_PREFIX || 'teamvisio-',
  options: {
    // Options pour l'interface et le comportement de Jitsi Meet
  }
};
```

### API et intégration

- L'API Jitsi Meet est chargée dynamiquement par le module `src/lib/jitsi/index.js` lors de son utilisation.
- Le composant `JitsiRoom.svelte` encapsule la logique d'intégration et synchronise les participants avec Firestore.
- La synchronisation entre les salles Firestore et Jitsi est assurée par les fonctions `joinRoom` et `leaveRoom`.

### Flux de fonctionnement

1. Le composant `JitsiRoom` est initialisé avec un ID de salle Firestore.
2. Le composant charge dynamiquement le script Jitsi si nécessaire.
3. Une instance de l'API Jitsi est créée et configure la visioconférence avec les options appropriées.
4. Les participants sont automatiquement ajoutés/supprimés de la liste dans Firestore lors des entrées/sorties.
5. Lors de la destruction du composant, les ressources sont libérées et l'utilisateur est retiré de la liste des participants.

### Variables d'environnement

```
VITE_JITSI_DOMAIN      # Domaine du serveur Jitsi Meet (défaut: meet.jit.si)
VITE_JITSI_ROOM_PREFIX # Préfixe pour les noms de salles (défaut: teamvisio-)
```

### Bonnes pratiques et enseignements

Lors de l'intégration de Jitsi Meet dans un composant Svelte, nous avons rencontré quelques défis et identifié plusieurs bonnes pratiques :

#### 1. Gestion du conteneur DOM
Le composant JitsiRoom a été conçu pour **toujours** rendre le conteneur DOM (`jitsiContainer`) même lorsqu'il n'est pas visible, puis le masquer/afficher via CSS. Cela évite les problèmes de références DOM non disponibles liés au cycle de vie des composants Svelte.

```html
<div class="jitsi-container" bind:this={jitsiContainer} style="display: {isJoined ? 'block' : 'none'}"></div>
```

#### 2. Stratégie d'initialisation
L'initialisation comprend ces étapes pour maximiser la stabilité :
- Attendre un `tick()` pour que Svelte mette à jour le DOM
- Ajouter un court délai (100ms) avant d'initialiser Jitsi Meet
- Vérifier explicitement que le conteneur est disponible

#### 3. Structure CSS adaptée
Le positionnement absolu et les z-index appropriés permettent de superposer correctement les états de chargement et d'erreur sur le conteneur Jitsi :
```css
.jitsi-container {
  position: absolute;
  z-index: 1;
}
.loading-container {
  position: relative;
  z-index: 2;
}
```

#### 4. Gestion complète du cycle de vie
- `onMount` : chargement du script et initialisation de Jitsi Meet
- `onDestroy` : libération des ressources et mise à jour de Firestore
- Fonctions explicites pour rejoindre/quitter les salles manuellement

Ces approches assurent une intégration robuste de l'API externe Jitsi Meet dans le framework Svelte, prévenant les erreurs courantes liées aux références DOM et au cycle de vie des composants.
