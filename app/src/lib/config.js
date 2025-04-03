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

// Jitsi Meet configuration
export const jitsiConfig = {
  domain: import.meta.env.VITE_JITSI_DOMAIN || 'meet.jit.si',
  roomPrefix: import.meta.env.VITE_JITSI_ROOM_PREFIX || 'teamvisio-',
  options: {
    width: '100%',
    height: '100%',
    parentNode: null, // Doit être défini lors de l'initialisation
    configOverwrite: {
      startWithAudioMuted: false,
      startWithVideoMuted: false,
      disableDeepLinking: true,
      disableInviteFunctions: true,
      toolbarButtons: [
        'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
        'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
        'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
        'videoquality', 'filmstrip', 'feedback', 'stats', 'tileview', 'videobackgroundblur',
        'download', 'help', 'mute-everyone'
      ],
    },
    interfaceConfigOverwrite: {
      SHOW_JITSI_WATERMARK: false,
      SHOW_WATERMARK_FOR_GUESTS: false,
      TOOLBAR_BUTTONS: [
        'microphone', 'camera', 'desktop', 'fullscreen', 'hangup',
        'profile', 'chat', 'settings', 'raisehand', 'videoquality',
        'tileview'
      ],
    }
  }
};

// Environment information
export const environment = import.meta.env.MODE || 'development';

export const isDevelopment = environment === 'development';

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