## Plan d'implémentation étape par étape

### Étape 1 : Préparer l'environnement de développement (PRIORITAIRE)
- **Instructions** :
  - Installer Node.js et npm sur votre machine.
  - Créer un nouveau projet SvelteKit via une commande dans le terminal.
  - Ajouter la dépendance Firebase au projet via npm.
  - Configurer Jest ou Vitest pour les tests automatisés.
- **Test** :
  - **Manuel** : Lancer le projet avec la commande de développement et vérifier que le serveur local démarre sans erreur en accédant à l’URL affichée dans le terminal.
  - **Automatisé** : Créer un test simple qui vérifie que l’application se lance correctement.

---

### Étape 2 : Configurer les comptes externes (PRIORITAIRE)
- **Instructions** :
  - Créer un compte sur Firebase et démarrer un nouveau projet.
  - Ajouter les clés API de Firebase dans un fichier de variables d’environnement au niveau du projet.
  - Préparer deux versions de ces fichiers : une pour l’environnement de test et une pour la production.
  - **Note** : Aucun compte externe n’est requis pour Jitsi Meet, car nous utiliserons l’instance publique gratuite meet.jit.si pour les tests initiaux.
- **Test** :
  - **Manuel** : Afficher une des variables d’environnement dans la console via un message temporaire et vérifier qu’elle apparaît correctement lors du lancement du projet.
  - **Automatisé** : Créer un test qui vérifie que les variables d’environnement sont correctement chargées.

---

### Étape 3 : Initialiser Firebase dans le projet (PRIORITAIRE)
- **Instructions** :
  - Créer un fichier dans le dossier des utilitaires pour gérer Firebase.
  - Configurer Firebase en utilisant les variables d’environnement pour connecter le projet à Firestore et à l’authentification.
  - Préparer trois collections dans Firestore : `users`, `rooms`, et `settings`.
  - Définir la structure des documents utilisateurs incluant un champ `isAdmin` (booléen).
- **Test** :
  - **Manuel** : Ajouter manuellement un document dans la collection des utilisateurs via la console Firebase, puis vérifier que ce document est bien visible dans l’interface de Firebase.
  - **Automatisé** : Créer un test qui vérifie la connexion à Firebase et la capacité à lire/écrire dans les collections.

---

### Étape 4 : Mettre en place une page d'accueil simple (PRIORITAIRE)
- **Instructions** :
  - Créer une page d’accueil dans le dossier des routes avec un titre et un message de bienvenue statique.
  - S’assurer que cette page est accessible à la racine de l’application.
  - Utiliser une palette de couleurs douces avec des tons pastel pour l’interface.
  - Mettre en place un design responsive de base (PC en priorité, mobile secondaire).
- **Test** :
  - **Manuel** : Lancer le projet et vérifier que la page d’accueil s’affiche avec le titre et le message prévus dans le navigateur.
  - **Automatisé** : Créer un test pour vérifier que les composants de la page d’accueil se chargent correctement.

---

### Étape 5 : Ajouter l'authentification de base (PRIORITAIRE)
- **Instructions** :
  - Créer un composant dans le dossier des composants pour gérer la connexion et l’inscription.
  - Configurer ce composant pour utiliser les services d’authentification Firebase avec email et mot de passe.
  - Afficher un formulaire simple avec des champs pour l’email et le mot de passe sur la page d’accueil.
  - Prévoir un mécanisme pour définir les administrateurs dans la base de données.
- **Test** :
  - **Manuel** : Tester l’inscription avec un email et un mot de passe fictifs, puis vérifier que l’utilisateur apparaît dans la section Authentification de la console Firebase.
  - **Automatisé** : Créer un test qui simule le processus d’authentification et vérifie que l’état de l’utilisateur est correctement mis à jour.

---


### Étape 7 : Afficher une liste statique de salles
- **Instructions** :
  - Ajouter une section sur la page d’accueil pour afficher une liste de salles codée en dur (exemple : « Salle 1 », « Salle 2 »).
  - Styliser cette liste pour la rendre claire et cliquable, en utilisant la palette de couleurs pastel définie.
  - Prévoir une indication visuelle que les salles sont publiques par défaut.
- **Test** :
  - **Manuel** : Vérifier que la liste s’affiche correctement sur la page d’accueil et que les éléments sont visibles et bien formatés dans le navigateur.
  - **Automatisé** : Créer un test pour vérifier que le composant de liste de salles se charge correctement avec des données statiques.

---

### Étape 8 : Connecter la liste des salles à Firestore
- **Instructions** :
  - Modifier la page d’accueil pour récupérer les salles depuis la collection Firestore en temps réel.
  - Remplacer la liste statique par les données dynamiques de Firestore.
  - Inclure dans le schéma des salles des propriétés comme `isPublic` (booléen, true par défaut) et `createdBy` (ID de l’utilisateur).
- **Test** :
  - **Manuel** : Ajouter une salle manuellement dans Firestore via la console, puis vérifier que cette salle apparaît automatiquement dans la liste sur la page d’accueil.
  - **Automatisé** : Créer un test qui vérifie que la liste des salles se met à jour automatiquement lorsque des données changent dans Firestore.

---

### Étape 9 : Permettre la création et gestion de salles pour les administrateurs
- **Instructions** :
  - Ajouter un champ de texte et un bouton sur la page d’accueil pour créer une nouvelle salle, visible uniquement pour les utilisateurs administrateurs.
  - Configurer une action pour ajouter une nouvelle salle dans Firestore avec un nom, le statut public/privé et l’ID de l’administrateur.
  - Ajouter la possibilité pour les administrateurs de supprimer des salles ou de modifier leurs paramètres.
- **Test** :
  - **Manuel** : Se connecter en tant qu’administrateur, créer une salle, la modifier, puis la supprimer, et vérifier que ces actions sont reflétées dans l’interface et dans Firestore.
  - **Automatisé** : Créer un test qui vérifie les autorisations et les opérations CRUD pour les salles selon le rôle de l’utilisateur.

---

### Étape 10 : Configurer Jitsi Meet pour la communication (PRIORITAIRE)
- **Instructions** :
  - Utiliser l’instance publique de Jitsi Meet (meet.jit.si) pour les tests initiaux afin d’éviter les coûts d’hébergement.
  - Intégrer le SDK Jitsi Meet dans votre projet Svelte via npm ou en incluant le script externe.
  - Créer un fichier dans le dossier des utilitaires pour gérer la configuration de Jitsi Meet (ex. domaine, options de base comme la désactivation du chat si non nécessaire).
  - Préparer une fonction pour générer un lien de salle Jitsi Meet basé sur l’ID de la salle dans votre application.
- **Test** :
  - **Manuel** : Appeler la fonction avec un ID de salle fictif et vérifier que le lien généré pointe vers une salle Jitsi Meet valide.
  - **Automatisé** : Créer un test qui vérifie la génération correcte du lien de la salle.

---

### Étape 11 : Créer une page pour les salles (PRIORITAIRE)
- **Instructions** :
  - Ajouter une nouvelle page dans le dossier des routes pour afficher les détails d’une salle spécifique.
  - Faire en sorte que cliquer sur une salle dans la liste redirige vers cette page avec l’identifiant de la salle.
  - Afficher les informations de la salle comme son nom, son statut (public/privé), et la liste des participants actuels (si disponible via Firebase).
  - Intégrer un iframe ou le composant Jitsi Meet pour afficher la vidéoconférence directement dans la page.
- **Test** :
  - **Manuel** : Cliquer sur une salle dans la liste et vérifier que la nouvelle page s’ouvre avec l’identifiant de la salle affiché dans l’URL ou sur la page, et que la vidéoconférence Jitsi Meet se charge.
  - **Automatisé** : Créer un test qui vérifie le routage et l’affichage correct des informations de la salle, ainsi que le chargement de l’iframe ou du composant Jitsi Meet.

---

### Étape 12 : Intégrer Jitsi Meet dans les salles (PRIORITAIRE)
- **Instructions** :
  - Sur la page des salles, configurer le composant Jitsi Meet pour se connecter automatiquement à la salle correspondante en utilisant l’ID de la salle.
  - Passer des options pour activer l’audio et la vidéo par défaut pour l’utilisateur qui rejoint la salle.
  - Afficher une grille des participants avec leur flux audio/vidéo via l’interface de Jitsi Meet.
  - Respecter les éventuelles limites de participants définies dans les paramètres de la salle (note : Jitsi Meet n’a pas de limite stricte, mais la performance peut varier).
- **Test** :
  - **Manuel** : Ouvrir la page d’une salle avec deux navigateurs (ou onglets) connectés avec des comptes différents, et vérifier que l’audio et la vidéo fonctionnent entre eux via Jitsi Meet.
  - **Automatisé** : Créer un test qui vérifie que le composant Jitsi Meet est correctement initialisé avec les bons paramètres.

---

### Étape 13 : Ajouter un bouton pour quitter la salle
- **Instructions** :
  - Ajouter un bouton sur la page des salles pour quitter la salle et revenir à la page d’accueil.
  - S’assurer que quitter la salle arrête proprement la session Jitsi Meet (en détruisant l’instance ou en rechargeant la page).
  - Mettre à jour le statut de présence de l’utilisateur dans la base de données Firebase.
- **Test** :
  - **Manuel** : Rejoindre une salle, cliquer sur le bouton quitter, et vérifier que vous revenez à la page d’accueil sans erreur dans la console.
  - **Automatisé** : Créer un test qui vérifie que les ressources sont correctement libérées et que l’utilisateur est redirigé vers la page d’accueil.

---

### Étape 14 : Gérer les autorisations et la confidentialité
- **Instructions** :
  - Puisque Jitsi Meet est utilisé via une instance publique, informer les utilisateurs que les données transitent par meet.jit.si.
  - Pour les salles privées, générer des noms de salle aléatoires ou utiliser des mots de passe pour limiter l’accès.
  - Ajouter une option pour que les administrateurs puissent définir un mot de passe pour les salles privées.
- **Test** :
  - **Manuel** : Créer une salle privée avec un mot de passe et vérifier que seuls les utilisateurs avec le mot de passe peuvent rejoindre la salle via Jitsi Meet.
  - **Automatisé** : Créer un test qui vérifie la génération correcte des liens de salle avec mot de passe.

---

### Étape 15 : Configurer le déploiement pour tests et production
- **Instructions** :
  - Configurer un environnement de test gratuit ou à faible coût (GitHub Pages, Netlify, Vercel).
  - Mettre en place une pipeline GitHub Actions pour le déploiement automatique.
  - Configurer les variables d’environnement pour les environnements de test et de production.
  - Documenter le processus de déploiement.
- **Test** :
  - **Manuel** : Effectuer un déploiement de test et vérifier que l’application fonctionne correctement dans l’environnement déployé.
  - **Automatisé** : Créer un test qui vérifie que le processus de déploiement se déroule sans erreur.

---

## Extensions futures (post-MVP)

### Fonctionnalités à développer ultérieurement
- **Partage d’écran** : Ajouter la possibilité pour les utilisateurs de partager leur écran dans une salle via Jitsi Meet.
- **Prise de notes** : Intégrer un outil collaboratif de prise de notes pendant les réunions.
- **Personnalisation d’espace** : Permettre aux entreprises de personnaliser leur espace de communication.
- **Amélioration mobile** : Optimiser l’expérience sur appareils mobiles.
- **Notifications** : Ajouter un système de notifications pour les réunions ou activités importantes.
- **Hébergement personnalisé** : Déployer une instance privée de Jitsi Meet pour plus de contrôle et de confidentialité.