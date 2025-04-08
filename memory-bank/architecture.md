# Architecture du Projet Team Visio

## Structure Globale

```
team_visio/
├── app/                    # Application principale
├── memory-bank/           # Documentation et ressources
├── .github/               # Configuration GitHub Actions
└── .cursor/              # Configuration Cursor IDE
```

## Application (app/)

### Configuration et Build
- `package.json` : Dépendances et scripts npm
- `vite.config.js` : Configuration Vite (bundler)
- `svelte.config.js` : Configuration Svelte
- `jsconfig.json` : Configuration JavaScript/TypeScript
- `vercel.json` : Configuration du déploiement Vercel

### Environnement
- `.env` : Variables d'environnement locales
- `.env.example` : Template des variables d'environnement
- `.env.production` : Variables d'environnement de production

### Source (src/)

#### Composants Principaux
- `App.svelte` : Composant racine de l'application
- `routes.js` : Configuration des routes
- `main.js` : Point d'entrée de l'application
- `app.css` : Styles globaux

#### Organisation des Dossiers

1. **Components** (`src/components/`)
   - Composants réutilisables
   - Structure modulaire pour la maintenance

2. **Routes** (`src/routes/`)
   - Pages de l'application
   - Gestion du routage

3. **Stores** (`src/stores/`)
   - Gestion d'état avec Svelte stores
   - Centralisation des données

4. **Lib** (`src/lib/`)
   - Utilitaires et services
   - Intégrations externes (Supabase, etc.)

5. **Tests** (`src/tests/`)
   - Tests unitaires et d'intégration
   - Configuration des tests

6. **Styles** (`src/styles/`)
   - Feuilles de style globales
   - Variables CSS et thèmes

7. **Assets** (`src/assets/`)
   - Images, polices, etc.
   - Ressources statiques

### Tests
- `setupTests.js` : Configuration des tests
- Tests unitaires pour chaque composant
- Tests d'intégration pour les fonctionnalités principales

## Déploiement

### GitHub Actions
- Workflows pour le CI/CD
- Déploiement automatique sur Vercel

### Vercel
- Configuration du déploiement
- Gestion des environnements
- Optimisation des performances

## Technologies Principales

1. **Frontend**
   - Svelte : Framework principal
   - Vite : Bundler et serveur de développement
   - Supabase : Backend et authentification

2. **Tests**
   - Vitest : Framework de test
   - Testing Library : Utilitaires de test

3. **Déploiement**
   - Vercel : Plateforme de déploiement
   - GitHub Actions : CI/CD

## Architecture Logicielle

### Pattern d'Architecture
- Architecture modulaire
- Composants réutilisables
- Gestion d'état centralisée
- Séparation des préoccupations

### Flux de Données
1. **Stores**
   - Gestion de l'état global
   - Synchronisation avec Supabase
   - Cache local

2. **Composants**
   - Affichage des données
   - Interaction utilisateur
   - Communication entre composants

3. **Services**
   - Communication avec l'API
   - Gestion des erreurs
   - Transformation des données

## Bonnes Pratiques

1. **Code**
   - Composants modulaires
   - Tests unitaires
   - Documentation claire

2. **Performance**
   - Chargement différé
   - Optimisation des assets
   - Mise en cache

3. **Sécurité**
   - Validation des entrées
   - Gestion des tokens
   - Protection des routes

## Points d'Attention

1. **Maintenance**
   - Mise à jour des dépendances
   - Tests automatisés
   - Documentation à jour

2. **Évolutivité**
   - Architecture modulaire
   - Composants réutilisables
   - Gestion d'état flexible

3. **Performance**
   - Optimisation des assets
   - Chargement différé
   - Mise en cache

## Composants Détaillés

### Composants de Base (src/components/)

1. **Header** (`Header.svelte`)
   - Barre de navigation principale
   - Gestion de la navigation entre les pages
   - Intégration avec l'authentification
   - Responsive design

2. **Footer** (`Footer.svelte`)
   - Pied de page avec liens et informations
   - Section de contact
   - Liens vers les réseaux sociaux
   - Mentions légales

3. **UserStatusBar** (`UserStatusBar.svelte`)
   - Affichage du statut de l'utilisateur
   - Gestion de la connexion/déconnexion
   - Informations du profil utilisateur

4. **Hero** (`Hero.svelte`)
   - Section d'accueil principale
   - Présentation des fonctionnalités clés
   - Appel à l'action

5. **Features** (`Features.svelte`)
   - Présentation des fonctionnalités
   - Mise en avant des avantages
   - Design responsive

### Composants d'Authentification (src/components/auth/)

1. **LoginForm**
   - Formulaire de connexion
   - Gestion des erreurs
   - Intégration avec Supabase Auth

2. **RegisterForm**
   - Formulaire d'inscription
   - Validation des champs
   - Création de compte

### Composants de Salle (src/components/rooms/)

1. **RoomList**
   - Liste des salles disponibles
   - Filtrage et recherche
   - Pagination

2. **RoomCard**
   - Carte de présentation d'une salle
   - Informations essentielles
   - Actions rapides

3. **RoomForm**
   - Création/édition de salle
   - Gestion des paramètres
   - Validation des données

### Composants de Conférence (src/components/conference/)

1. **VideoConference**
   - Intégration vidéo
   - Gestion des participants
   - Contrôles de la conférence

2. **ChatPanel**
   - Messagerie en temps réel
   - Gestion des messages
   - Notifications

### Composants d'Administration (src/components/admin/)

1. **AdminDashboard**
   - Vue d'ensemble
   - Statistiques
   - Actions rapides

2. **UserManagement**
   - Gestion des utilisateurs
   - Rôles et permissions
   - Modération

### Composants UI (src/components/ui/)

1. **Button**
   - Boutons réutilisables
   - Variantes de style
   - États (disabled, loading)

2. **Modal**
   - Fenêtres modales
   - Gestion des événements
   - Animations

3. **Toast**
   - Notifications
   - Types de messages
   - Gestion du temps d'affichage

### Routes (src/routes/)

1. **Page d'Accueil** (`index.svelte`)
   - Landing page
   - Présentation du service
   - Appel à l'action

2. **Connexion** (`login.svelte`)
   - Authentification
   - Redirection post-connexion
   - Gestion des erreurs

3. **Salles** (`rooms.svelte`)
   - Liste des salles
   - Filtres et recherche
   - Navigation

4. **Salle** (`room.svelte`)
   - Interface de conférence
   - Gestion des participants
   - Contrôles

5. **Administration** (`admin.svelte`)
   - Dashboard admin
   - Gestion des utilisateurs
   - Statistiques

## Interactions entre Composants

### Flux d'Authentification
1. `Header` → `UserStatusBar` → `LoginForm`
   - Navigation vers la connexion
   - Gestion du statut
   - Mise à jour de l'interface

### Flux de Conférence
1. `RoomList` → `RoomCard` → `VideoConference`
   - Sélection de salle
   - Affichage des détails
   - Lancement de la conférence

### Flux d'Administration
1. `AdminDashboard` → `UserManagement`
   - Navigation dans le dashboard
   - Gestion des utilisateurs
   - Mise à jour des permissions

## État et Données

### Stores Principaux
1. **User Store**
   - Informations utilisateur
   - Statut de connexion
   - Permissions

2. **Room Store**
   - Liste des salles
   - État actuel
   - Participants

3. **Conference Store**
   - État de la conférence
   - Participants actifs
   - Paramètres

### Synchronisation
- Mise à jour en temps réel via Supabase
- Cache local pour les performances
- Gestion des erreurs de connexion
