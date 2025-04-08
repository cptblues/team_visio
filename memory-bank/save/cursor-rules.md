En tant que développeur senior expérimenté, je vais vous fournir une liste de 6 à 10 règles pour Cursor AI, adaptées à la stack que j’ai précédemment recommandée : **Svelte**, **Firebase**, et **Agora.io**. Ces règles sont conçues pour être utilisées comme **Project Rules** dans Cursor AI, stockées dans le répertoire `.cursor/rules`, afin de guider l’IA dans la génération de code cohérent avec les conventions et les meilleures pratiques de ce projet spécifique. Voici une liste de 8 règles qui couvrent les aspects clés de cette stack :

### 1. Génération de code Svelte
- **Description** : Lorsque vous générez du code Svelte, utilisez les déclarations réactives de Svelte (par exemple, `$:`, `let`), les stores pour la gestion d’état, et la syntaxe déclarative pour les événements (par exemple, `on:click`). Évitez d’incorporer des motifs ou des concepts provenant d’autres frameworks comme React (ex. : Virtual DOM) ou Angular.
- **Objectif** : Assurer que l’IA respecte les spécificités de Svelte et produit un code idiomatique.

### 2. Intégration avec Firebase
- **Description** : Pour les opérations de base de données, utilisez Firebase Firestore avec le SDK officiel. Respectez les conventions de modélisation de données du projet, telles que l’utilisation de collections spécifiques (par exemple, `users`, `sessions`) et de structures de documents prédéfinies. Utilisez Firebase Authentication pour la gestion des utilisateurs.
- **Objectif** : Garantir une utilisation cohérente et sécurisée des services Firebase dans le projet.

### 3. Utilisation d’Agora.io
- **Description** : Pour implémenter des fonctionnalités de communication en temps réel, utilisez le SDK Web d’Agora.io. Assurez-vous que le client est correctement initialisé avec l’App ID et le token, et gérez proprement l’entrée dans les canaux, la publication de flux et la souscription aux flux.
- **Objectif** : Faciliter l’intégration fiable des fonctionnalités audio/vidéo en temps réel.

### 4. Gestion d’état
- **Description** : Utilisez les stores Svelte pour gérer l’état de l’application, en particulier pour les données provenant de Firebase (par exemple, données Firestore) et d’Agora.io (par exemple, états des flux). Assurez-vous que les stores sont mis à jour de manière réactive lorsque les données changent.
- **Objectif** : Maintenir une gestion d’état centralisée et réactive entre le frontend et les services backend.

### 5. Pratiques de sécurité
- **Description** : Ne codez jamais en dur des informations sensibles comme les clés API, les tokens ou les identifiants dans le code. Utilisez des variables d’environnement ou des méthodes sécurisées (comme les Firebase Cloud Functions) pour gérer ces données.
- **Objectif** : Protéger le projet contre les fuites de données sensibles.

### 6. Optimisation des performances
- **Description** : Rédigez des requêtes Firestore efficaces pour minimiser les lectures de données (par exemple, utilisez `where` pour filtrer). Exploitez la réactivité de Svelte pour mettre à jour l’interface utilisateur uniquement lorsque cela est nécessaire, en évitant les re-rendus inutiles.
- **Objectif** : Améliorer les performances, notamment pour les applications en temps réel.

### 7. Organisation du code
- **Description** : Structurez le code selon les conventions du projet : placez les composants Svelte dans `src/components`, les fonctions utilitaires dans `src/lib`, et les routes (si SvelteKit est utilisé) dans `src/routes`.
- **Objectif** : Maintenir une base de code organisée et facile à naviguer pour les développeurs.

### 8. Tests
- **Description** : Encouragez l’écriture de tests unitaires pour les composants Svelte et les fonctions utilitaires, en utilisant des bibliothèques comme Vitest ou Jest. Simulez (mock) les services externes comme Firebase et Agora.io dans les tests.
- **Objectif** : Garantir la fiabilité et la robustesse du code généré.

Ces règles sont conçues pour aider Cursor AI à comprendre les spécificités de la stack Svelte, Firebase et Agora.io, tout en respectant les meilleures pratiques de développement. Elles peuvent être affinées davantage en fonction des besoins spécifiques du projet, mais elles offrent une base solide pour guider l’IA dans la génération de code pertinent et de haute qualité.