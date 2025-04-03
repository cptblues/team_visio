/**
 * Configuration centralisée de l'application
 * Expose les variables d'environnement de façon sécurisée et avec validation
 */

// Firebase configuration
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Environnement
export const environment = import.meta.env.VITE_APP_ENV || 'development';
export const isDevelopment = environment === 'development';
export const isTesting = environment === 'testing';
export const isProduction = environment === 'production';

// Validation des variables d'environnement requises
function validateConfig() {
  const requiredVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
  ];

  const missingVars = requiredVars.filter(varName => !import.meta.env[varName]);

  if (missingVars.length > 0) {
    console.error(`Variables d'environnement manquantes : ${missingVars.join(', ')}`);
    return false;
  }
  
  return true;
}

export const isConfigValid = validateConfig(); 