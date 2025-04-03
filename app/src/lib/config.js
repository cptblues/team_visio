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
      // Configurer l'audio et la vidéo pour être activés par défaut
      startWithAudioMuted: false,
      startWithVideoMuted: false,
      prejoinPageEnabled: false, // Désactiver la page de pré-jonction
      disableDeepLinking: true, 
      disableInviteFunctions: true,
      enableWelcomePage: false,
      enableClosePage: false,
      // Activer la grille des participants (vue en mosaïque)
      defaultLayout: 'tileview',
      // Configurer la qualité vidéo selon les performances
      resolution: 720,
      constraints: {
        video: {
          height: {
            ideal: 720,
            max: 720,
            min: 240
          }
        }
      },
      // Liste complète des boutons disponibles dans la barre d'outils
      toolbarButtons: [
        'microphone', 'camera', 'desktop', 'fullscreen',
        'fodeviceselection', 'hangup', 'profile', 'chat', 
        'settings', 'raisehand', 'videoquality', 'filmstrip', 
        'tileview', 'participants-pane'
      ],
      // Options de débogage
      testing: {
        p2pTestMode: false // Activer si nécessaire pour le débogage
      },
      // Réduire la complexité pour le débogage initial
      disableAudioLevels: true,
      disableSimulcast: true
    },
    interfaceConfigOverwrite: {
      SHOW_JITSI_WATERMARK: false,
      SHOW_WATERMARK_FOR_GUESTS: false,
      MOBILE_APP_PROMO: false,
      HIDE_INVITE_MORE_HEADER: true,
      // Liste simplifiée des boutons pour une meilleure expérience utilisateur
      TOOLBAR_BUTTONS: [
        'microphone', 'camera', 'desktop', 'fullscreen', 'hangup',
        'chat', 'settings', 'raisehand', 'videoquality',
        'tileview', 'participants-pane'
      ],
      DEFAULT_BACKGROUND: '#3D3D3D',
      DEFAULT_LOGO_URL: '',
      DISABLE_JOIN_LEAVE_NOTIFICATIONS: false,
      DISABLE_VIDEO_BACKGROUND: false,
      ENABLE_FEEDBACK_ANIMATION: false,
      FILM_STRIP_MAX_HEIGHT: 120,
      VERTICAL_FILMSTRIP: true,
      TILE_VIEW_MAX_COLUMNS: 5
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