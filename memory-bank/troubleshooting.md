# Guide de résolution de problèmes

Ce document répertorie les problèmes courants rencontrés lors du développement et leurs solutions.

## Problèmes de connexion Firebase

### Erreur : Bad Request (400) dans les requêtes Firestore

**Symptômes :** 
- Erreurs 400 Bad Request dans les requêtes à `https://firestore.googleapis.com/google.firestore.v1.Firestore/Listen/channel`
- Message dans la console : `WebChannelConnection RPC 'Listen' stream transport errored`

**Causes possibles :**
1. Configuration Firebase incorrecte (apiKey, projectId, etc.)
2. URL du bucket de stockage mal formatée
3. Règles de sécurité Firestore trop restrictives
4. Base de données Firestore non créée

**Solutions :**
1. Vérifier et corriger les paramètres dans le fichier `.env`
2. Utiliser le format standard pour le bucket de stockage : `[projectId].appspot.com`
3. Configurer des règles de sécurité permissives pour le développement
4. Créer une base de données Firestore en mode test

### Erreur : Missing or insufficient permissions

**Symptômes :**
- Message d'erreur : `Erreur lors de la récupération du document [id]: FirebaseError: Missing or insufficient permissions.`

**Causes possibles :**
1. Règles de sécurité Firestore bloquant l'accès
2. Tentative d'accès à un document sans authentification requise

**Solutions :**
1. Modifier les règles de sécurité Firestore pour permettre l'accès :
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```
2. S'assurer que l'utilisateur est correctement authentifié avant de tenter d'accéder à des documents protégés

## Problèmes d'interface utilisateur

### Écouteurs d'événements Firebase dupliqués

**Symptômes :**
- Les callbacks sont exécutés plusieurs fois
- Messages en double dans la console
- Comportement erratique de l'interface

**Causes possibles :**
1. Multiples appels à `onAuthChange` sans désabonnement
2. Réinitialisation des composants sans nettoyage des écouteurs

**Solutions :**
1. S'assurer que la fonction de désabonnement est appelée dans la fonction de nettoyage retournée par `onMount`
2. Vérifier si un écouteur existe déjà avant d'en ajouter un nouveau
3. Utiliser une variable globale pour stocker la fonction de désabonnement

## Conseils généraux de débogage

1. Utiliser la console du navigateur pour surveiller les requêtes réseau et les erreurs
2. Ajouter des logs stratégiques pour suivre le flux d'exécution
3. Créer des composants de débogage temporaires comme `FirebaseDebugger`
4. Vérifier les règles de sécurité Firebase pour s'assurer qu'elles correspondent aux besoins de l'application 