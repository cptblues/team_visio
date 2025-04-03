# Team Visio

Application de visioconférence développée avec Svelte, Firebase et Jitsi Meet.

## Guide de déploiement

### Prérequis

1. **Compte Firebase** : Créez un projet sur [Firebase Console](https://console.firebase.google.com/)
2. **Node.js et npm** : Installation requise pour le développement local
3. **Firebase CLI** : Installez-le globalement via npm 
   ```
   npm install -g firebase-tools
   ```
4. **GitHub** : Un repository GitHub pour le déploiement automatique

### Configuration des secrets GitHub

Pour utiliser le déploiement automatique via GitHub Actions, configurez les secrets suivants dans votre repository GitHub :

1. `FIREBASE_SERVICE_ACCOUNT_TEAM_VISIO` : Clé de service Firebase au format JSON
   - Générez cette clé dans la console Firebase : Paramètres du projet > Comptes de service > Générer une nouvelle clé privée
   - Copiez tout le contenu du fichier JSON généré

2. `FIREBASE_ENV_PRODUCTION` : Variables d'environnement pour la production
   - Copiez le contenu de votre fichier `.env.production` local

3. `FIREBASE_ENV_TESTING` : Variables d'environnement pour l'environnement de test
   - Copiez le contenu de votre fichier `.env.testing` local

### Déploiement local

Pour déployer manuellement depuis votre machine :

1. Connectez-vous à Firebase CLI
   ```
   firebase login
   ```

2. Naviguez vers le dossier de l'application
   ```
   cd app
   ```

3. Construisez l'application pour la production
   ```
   npm run build
   ```

4. Déployez sur Firebase Hosting
   ```
   npm run deploy
   ```

### Déploiement automatique

Le déploiement automatique est configuré via GitHub Actions :

- **Push sur la branche main** : Déploie automatiquement sur l'environnement de production
- **Pull Requests** : Crée un environnement de prévisualisation temporaire

### Environnements

- **Production** : [https://team-visio.web.app](https://team-visio.web.app)
- **Prévisualisations PR** : URLs générées automatiquement pour chaque pull request

### Dépannage

En cas de problème de déploiement :

1. Vérifiez les logs dans l'onglet Actions de GitHub
2. Assurez-vous que les secrets GitHub sont correctement configurés
3. Vérifiez que le projet Firebase est correctement initialisé avec Hosting
4. Consultez `firebase-debug.log` pour les déploiements locaux