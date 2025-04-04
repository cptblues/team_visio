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
├── userStore.js         # Store pour gérer l'état de l'utilisateur connecté
└── lib/stores/jitsiStore.js  # Store pour gérer l'état de la visioconférence et les participants
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
    └── rooms.svelte     # Page dédiée aux salles (liste, création, administration)
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
  updatedAt: Timestamp,  // Date de dernière modification
  conferenceActive: Boolean // Si une visioconférence est active dans cette salle
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

## Intégration avec Jitsi Meet

L'application intègre Jitsi Meet pour la visioconférence :

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

### Architecture de l'intégration

- **Module principal** : `src/lib/jitsi/index.js` gère l'initialisation de Jitsi, le chargement du script, et expose des méthodes pour contrôler les fonctionnalités (audio, vidéo, participants).
- **Store Jitsi** : `src/stores/jitsiStore.js` maintient l'état de la visioconférence et des participants.
- **Composant d'interface** : `src/components/conference/JitsiRoom.svelte` encapsule l'intégration dans un composant réutilisable.

### Approche technique

L'intégration utilise l'approche par iframe directe :
1. Génération d'URL avec paramètres pour configurer Jitsi Meet
2. Création d'un iframe avec les permissions nécessaires
3. Insertion de l'iframe dans le conteneur DOM

```javascript
// Exemple simplifié de création d'iframe
const jitsiUrl = `https://${jitsiDomain}/${roomName}?${params.toString()}`;
const iframe = document.createElement('iframe');
iframe.src = jitsiUrl;
iframe.allow = 'camera; microphone; fullscreen; display-capture; autoplay';
jitsiContainer.appendChild(iframe);
```

### Flux de fonctionnement

1. Le composant `JitsiRoom` est initialisé avec un ID de salle Firestore
2. Un conteneur DOM est préparé pour recevoir l'iframe
3. L'URL Jitsi est générée avec les paramètres appropriés
4. L'iframe est créé et inséré dans le conteneur
5. Les événements de participation sont synchronisés avec Firestore
6. Lors de la destruction du composant, l'iframe est supprimé et l'utilisateur retiré de la liste des participants

### Gestion des erreurs et compatibilité

- Vérification de la compatibilité du navigateur avec WebRTC
- Mécanismes de récupération en cas d'échec d'initialisation
- Interface utilisateur pour les différents états (chargement, erreur, rejoindre)
- Synchronisation des participants entre Jitsi et Firestore

### Bonnes pratiques et enseignements

#### 1. Gestion du conteneur DOM
Le composant JitsiRoom a été conçu pour **toujours** rendre le conteneur DOM (`jitsiContainer`). Cela évite les problèmes de références DOM non disponibles liés au cycle de vie des composants Svelte.

#### 2. Stratégie d'initialisation robuste
L'initialisation comprend ces étapes pour maximiser la stabilité :
- Attendre un `tick()` pour que Svelte mette à jour le DOM
- Ajouter un court délai (100ms) avant d'initialiser Jitsi Meet
- Vérifier explicitement que le conteneur est disponible et correctement dimensionné

#### 3. Structure CSS adaptée
Le positionnement absolu et les z-index appropriés permettent de superposer correctement les états de chargement et d'erreur sur le conteneur Jitsi.

#### 4. Gestion complète du cycle de vie
- `onMount` : vérification de compatibilité et initialisation
- `onDestroy` : nettoyage des ressources et mise à jour de Firestore
- Fonctions explicites pour rejoindre/quitter les salles manuellement

### Variables d'environnement

```
VITE_JITSI_DOMAIN      # Domaine du serveur Jitsi Meet (défaut: meet.jit.si)
VITE_JITSI_ROOM_PREFIX # Préfixe pour les noms de salles (défaut: teamvisio-)
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

### Page d'administration

Une page dédiée à l'administration est accessible uniquement aux utilisateurs ayant des droits d'administrateur :

- **Route :** `/admin`
- **Fichier :** `src/routes/admin.svelte`

La page d'administration est structurée avec un système d'onglets pour organiser les différentes fonctionnalités :
- **Gestion des salles** : Interface pour créer, modifier et supprimer des salles
- **Gestion des utilisateurs** : Interface pour gérer les utilisateurs (fonctionnalité à développer)
- **Paramètres** : Interface pour configurer les paramètres de la plateforme (fonctionnalité à développer)

### Contrôle d'accès

La page d'administration est protégée par plusieurs niveaux de sécurité :
- Vérification côté client pour rediriger les utilisateurs non-administrateurs
- Le lien vers la page d'administration n'est visible que pour les administrateurs
- Sécurisation côté serveur via les règles Firebase

### Gestion des droits

- **Module d'administration** : `src/lib/firebase/admin.js` fournit des fonctions pour gérer les droits d'administration.
- **Composant de promotion** : `src/components/admin/MakeAdmin.svelte` permet de promouvoir un utilisateur au statut d'administrateur (uniquement en développement).

### Composants d'administration

- **AdminRoomManager.svelte** : Interface complète pour la gestion des salles, incluant la création, la modification et la suppression.
- **AddRoomForm.svelte** : Formulaire pour la création rapide de salles, utilisé dans la page d'administration.

### Tests

Les fonctionnalités d'administration sont couvertes par des tests spécifiques :
- `src/tests/AdminRoomManager.test.js` : Valide le composant de gestion des salles
- `src/tests/AdminPage.test.js` : Teste l'ensemble de la page d'administration, y compris l'accès conditionnel et l'intégration des composants