Voici un plan détaillé d’implémentation pour Cursor AI, en priorisant la création et la gestion des halls. Ce plan est conçu pour respecter votre stack actuel (Svelte, Firebase, Jitsi) avec des étapes petites, testables et documentées. Chaque étape inclut des tests unitaires et d’intégration, ainsi qu’une mise à jour du fichier de progression et de l’architecture.

---

## Plan d’Implémentation pour la Création et Gestion des Halls

### Objectif Général
Permettre aux utilisateurs authentifiés de créer un hall (espace regroupant des salles) et de le gérer, en devenant modérateur, tout en respectant les contraintes existantes.

### Prérequis
- L’utilisateur doit être authentifié via Firebase Authentication.
- Un utilisateur ne peut créer qu’un seul hall à la fois.

---

### Étape 1 : Modélisation des Halls dans Firestore
**Description** : Mettre en place la structure des données pour les halls dans Firestore.

**Tâches** :
- Créer une collection `halls` avec les champs suivants :
  - `creatorId` : ID de l’utilisateur créateur (chaîne).
  - `description` : Description textuelle du hall (chaîne).
  - `roomLimit` : Nombre maximum de salles de réunion (entier, par défaut 3).
  - `invitedUsers` : Liste d’IDs ou emails des utilisateurs invités (tableau, vide par défaut).
- Ajouter une sous-collection `rooms` vide pour chaque hall (sera remplie plus tard).

**Tests** :
- **Unitaire** : Vérifier qu’un hall peut être créé avec les champs obligatoires (`creatorId`, `description`).
- **Intégration** : Ajouter un hall via l’API Firestore et confirmer que les données sont correctement enregistrées.

**Documentation** :
- Ajouter une entrée dans le fichier de progression : "Collection `halls` créée avec champs de base."
- Mettre à jour l’architecture avec un schéma de la collection `halls`.

---

### Étape 2 : Vérification des Halls Existants
**Description** : S’assurer qu’un utilisateur ne peut créer qu’un seul hall actif.

**Tâches** :
- Implémenter une fonction `checkUserHall` qui interroge Firestore pour vérifier si un hall avec `creatorId` correspondant existe déjà.
- Retourner une erreur si un hall actif est trouvé.

**Tests** :
- **Unitaire** : Tester `checkUserHall` avec un utilisateur sans hall (retourne faux) et avec un hall existant (retourne vrai).
- **Intégration** : Simuler une tentative de création d’un second hall et vérifier que l’opération est bloquée.

**Documentation** :
- Ajouter dans le fichier de progression : "Vérification d’unicité du hall par utilisateur implémentée."
- Mettre à jour l’architecture avec la logique de vérification dans le flux de création.

---

### Étape 3 : Interface de Création de Hall
**Description** : Ajouter une interface Svelte pour créer un hall.

**Tâches** :
- Créer un composant `CreateHall.svelte` avec un formulaire contenant :
  - Champ `description` (texte).
  - Bouton "Créer".
- Appeler `checkUserHall` avant création et afficher une erreur si nécessaire.
- Envoyer les données à Firestore via une fonction `createHall`.

**Tests** :
- **Unitaire** : Tester que le formulaire soumet les données correctement.
- **Intégration** : Simuler la création d’un hall et vérifier son enregistrement dans Firestore.

**Documentation** :
- Ajouter au fichier de progression : "Composant `CreateHall.svelte` ajouté pour la création de halls."
- Mettre à jour l’architecture avec le nouveau composant et son lien avec Firestore.

---

### Étape 4 : Affichage du Hall Actif
**Description** : Permettre à l’utilisateur de voir son hall actif après création.

**Tâches** :
- Créer un composant `HallDashboard.svelte` affichant :
  - La description du hall.
  - Un message si aucun hall n’existe.
- Récupérer les données du hall via une requête Firestore basée sur `creatorId`.

**Tests** :
- **Unitaire** : Tester que le composant affiche correctement les données mockées.
- **Intégration** : Vérifier que le tableau de bord reflète les données réelles après création.

**Documentation** :
- Ajouter au fichier de progression : "Tableau de bord du hall ajouté via `HallDashboard.svelte`."
- Mettre à jour l’architecture avec le composant et le flux de données.

---

### Étape 5 : Ajout de Salles dans le Hall
**Description** : Permettre au créateur d’ajouter des salles de réunion dans son hall.

**Tâches** :
- Ajouter un formulaire dans `HallDashboard.svelte` pour créer une salle avec :
  - `name` : Nom de la salle (chaîne).
  - `capacity` : Capacité maximale (entier).
  - `type` : "meeting" (fixe pour cette étape).
- Enregistrer la salle dans la sous-collection `rooms` du hall.
- Vérifier que le nombre de salles ne dépasse pas `roomLimit`.

**Tests** :
- **Unitaire** : Tester la fonction de création de salle avec des données valides et invalides (limite dépassée).
- **Intégration** : Ajouter une salle et vérifier son enregistrement dans Firestore.

**Documentation** :
- Ajouter au fichier de progression : "Gestion des salles de réunion ajoutée dans le hall."
- Mettre à jour l’architecture avec la sous-collection `rooms`.

---

### Étape 6 : Salle d’Attente Automatique
**Description** : Ajouter une salle d’attente par défaut lors de la création d’un hall.

**Tâches** :
- Modifier `createHall` pour ajouter automatiquement une salle dans `rooms` avec :
  - `type` : "waiting".
  - `name` : "Salle d’attente".
  - `capacity` : Illimitée (ou valeur par défaut élevée).
- S’assurer que cette salle est créée en même temps que le hall.

**Tests** :
- **Unitaire** : Vérifier que la salle d’attente est incluse dans les données mockées.
- **Intégration** : Créer un hall et confirmer la présence de la salle d’attente dans Firestore.

**Documentation** :
- Ajouter au fichier de progression : "Salle d’attente créée automatiquement avec chaque hall."
- Mettre à jour l’architecture avec la logique de création automatique.

---

### Étape 7 : Gestion des Salles (Modification et Suppression)
**Description** : Permettre au créateur de modifier ou supprimer des salles existantes.

**Tâches** :
- Ajouter des boutons "Modifier" et "Supprimer" à côté de chaque salle dans `HallDashboard.svelte`.
- Implémenter des fonctions `updateRoom` et `deleteRoom` pour interagir avec Firestore.
- Restreindre la suppression à toutes les salles sauf la salle d’attente.
- Intégrer le composant `AdminRoomManager` dans la section de gestion des salles.

**Tests** :
- **Unitaire** : Tester `updateRoom` et `deleteRoom` avec des cas limites (ex. tentative de supprimer la salle d’attente).
- **Intégration** : Modifier/supprimer une salle et vérifier les mises à jour dans Firestore.

**Documentation** :
- Ajouter au fichier de progression : "Modification et suppression des salles implémentées."
- Mettre à jour l’architecture avec les nouvelles interactions Firestore.

---

### Conclusion
Ce plan en 7 étapes se concentre sur la création et la gestion des halls, en respectant votre stack (Svelte pour l’interface, Firebase pour les données, Jitsi à intégrer plus tard). Chaque étape est petite, testable avec des tests unitaires et d’intégration, et suivie d’une mise à jour du fichier de progression et de l’architecture. Les étapes suivantes pourraient inclure les invitations, l’intégration Jitsi, et la visualisation en temps réel, selon vos priorités.