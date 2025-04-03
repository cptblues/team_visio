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

## Problèmes avec l'intégration Jitsi Meet

### Erreur : "Le conteneur Jitsi Meet n'est pas prêt"

**Symptômes :**
- Message d'erreur : "Le conteneur Jitsi Meet n'est pas prêt" ou "Le conteneur n'est pas prêt"
- L'iframe Jitsi n'apparaît pas dans l'interface
- Erreur dans la console : "TypeError: Cannot read properties of null (reading 'appendChild')"

**Causes possibles :**
1. L'élément DOM du conteneur Jitsi n'est pas correctement initialisé avant l'appel à l'API
2. Le conteneur est masqué par CSS (display: none)
3. Le conteneur est présent mais a une taille de 0x0 pixels
4. Le script de l'API Jitsi Meet est chargé mais l'objet JitsiMeetExternalAPI n'est pas disponible

**Solutions :**
1. Utiliser `await tick()` de Svelte pour attendre que le DOM soit mis à jour avant d'initialiser Jitsi
2. S'assurer que le conteneur est visible dans le DOM avec `display: block` et des dimensions non nulles
3. Utiliser une approche par iframe direct au lieu de l'API Jitsi Meet externe :
   ```javascript
   // Générer l'URL Jitsi Meet avec les paramètres
   const jitsiUrl = `https://meet.jit.si/${roomName}?${params.toString()}`;
   
   // Créer l'iframe manuellement
   const iframe = document.createElement('iframe');
   iframe.src = jitsiUrl;
   iframe.allow = 'camera; microphone; fullscreen; display-capture; autoplay';
   iframe.style.width = '100%';
   iframe.style.height = '100%';
   
   // Ajouter l'iframe au conteneur
   jitsiContainer.appendChild(iframe);
   ```

### Erreur : "Failed to execute 'appendChild' on 'Node': parameter 1 is not of type 'Node'"

**Symptômes :**
- La visioconférence ne démarre pas
- Erreur dans la console concernant `appendChild` et `Node`
- L'API Jitsi Meet semble chargée mais ne peut pas créer l'iframe

**Causes possibles :**
1. L'API Jitsi Meet tente de créer un iframe dans un conteneur qui n'est pas encore dans le DOM
2. Le DOM n'est pas entièrement chargé lors de l'initialisation
3. Une incompatibilité avec certains navigateurs ou versions

**Solutions :**
1. Implémenter une vérification plus stricte du conteneur avant l'initialisation :
   ```javascript
   if (!document.body.contains(parentNode) || parentNode.offsetWidth === 0) {
     throw new Error("Le conteneur parent n'est pas correctement initialisé dans le DOM");
   }
   ```
2. Utiliser l'approche par iframe direct qui évite les complexités de l'API externe

### Problèmes de performances ou de compatibilité

**Symptômes :**
- Latence élevée pendant les visioconférences
- Problèmes audio/vidéo sur certains navigateurs
- Consommation excessive de ressources système

**Causes possibles :**
1. Configuration par défaut trop gourmande en ressources
2. Incompatibilité avec certains navigateurs ou appareils
3. Connexion internet instable

**Solutions :**
1. Optimiser les paramètres de configuration Jitsi Meet :
   ```javascript
   // Paramètres de performance
   params.append('config.disableAudioLevels', 'true');
   params.append('config.disableSimulcast', 'true');
   params.append('config.channelLastN', '4');
   ```
2. Implémenter une vérification de compatibilité du navigateur avant de lancer Jitsi
3. Offrir une option de basculement vers un mode basse consommation 