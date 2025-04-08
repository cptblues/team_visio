# Suivi de la progression du projet

## 04/04/2023 - Implémentation de la structure de données des Halls

### Étape 1 : Modélisation des Halls dans Firestore

Objectif : Mettre en place la structure des données pour les halls dans Firestore.

Tâches accomplies :
- Ajout de la collection `HALLS` dans la constante `COLLECTIONS` du fichier `firestore.js`
- Création du fichier `halls.js` pour gérer les opérations CRUD sur les halls
- Implémentation des fonctions suivantes :
  - `createHall` : Création d'un nouveau hall avec les champs requis (creatorId, description, roomLimit, invitedUsers)
  - `checkUserHall` : Vérification si un utilisateur a déjà un hall existant
  - `getUserHall` : Récupération du hall d'un utilisateur
  - `getHallById` : Récupération d'un hall par son ID
  - `updateHall` : Mise à jour des informations d'un hall
  - `deleteHall` : Suppression d'un hall

Tests :
- Création d'un fichier de test complet `halls.test.js` couvrant toutes les fonctions implémentées
- Tests unitaires pour chaque fonction avec différents scénarios
- Tests de sécurité pour vérifier que seuls les créateurs peuvent modifier/supprimer leurs halls

Résultats des tests :
- 11 tests passés avec succès
- Couverture complète de la modélisation des halls dans Firestore

Prochaines étapes :
- Étape 2 : Vérification des Halls Existants (empêcher un utilisateur de créer plusieurs halls)
- Étape 3 : Interface de création de Hall en Svelte
- Intégration du composant `AdminRoomManager` pour la gestion des salles
