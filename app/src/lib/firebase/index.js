/**
 * Point d'entrée pour l'intégration Firebase
 * Initialise l'application Firebase et exporte les services
 */

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firebaseConfig, isConfigValid } from '../config';

// Initialiser Firebase seulement si la configuration est valide
let firebaseApp;
let db;
let auth;

if (isConfigValid) {
  try {
    // Initialiser l'application Firebase
    firebaseApp = initializeApp(firebaseConfig);
    
    // Initialiser Firestore
    db = getFirestore(firebaseApp);
    
    // Initialiser Authentication
    auth = getAuth(firebaseApp);
    
    console.log('Firebase initialisé avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de Firebase:', error);
  }
} else {
  console.error('Firebase non initialisé : configuration invalide');
}

export { firebaseApp, db, auth }; 