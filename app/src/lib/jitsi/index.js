/**
 * Utilitaires pour l'intégration avec Jitsi Meet
 * Gère la connexion et l'initialisation des salles de visioconférence
 */

import { jitsiConfig } from '../config';

// Déclaration pour l'API Jitsi Meet
// En JavaScript, nous utilisons des commentaires JSDoc au lieu de déclarations TypeScript
/**
 * @typedef {Object} JitsiMeetExternalAPI
 */

/**
 * Déclarations globales pour TypeScript dans les commentaires JSDoc
 * @typedef {Object} Window
 * @property {function} JitsiMeetExternalAPI - Constructeur de l'API Jitsi Meet
 */

/**
 * @type {any|null}
 */
let api = null;
let isApiLoaded = false;
let jitsiScriptLoaded = false;

// Store local des participants pour éviter des appels répétés
const participantsStore = new Map();

/**
 * Fonction de diagnostic pour Jitsi Meet
 * @param {HTMLElement} element - Élément conteneur Jitsi
 * @returns {string} - Rapport de diagnostic
 */
export function runJitsiDiagnostics(element) {
  try {
    let report = '=== DIAGNOSTIC JITSI MEET ===\n';
    
    // Vérifier l'environnement
    report += `Environnement: ${typeof window !== 'undefined' ? 'Browser' : 'SSR'}\n`;
    report += `API Jitsi chargée: ${isJitsiLoaded()}\n`;
    report += `Instance API existante: ${api !== null}\n`;
    
    // Vérifier la configuration
    report += `Domaine configuré: ${jitsiConfig.domain}\n`;
    
    // Vérifier l'élément fourni
    if (element) {
      report += '\n=== ÉLÉMENT CONTENEUR ===\n';
      report += `Type: ${element.constructor.name}\n`;
      report += `ID: ${element.id}\n`;
      report += `Classes: ${element.className}\n`;
      report += `Dans le DOM: ${document.body.contains(element)}\n`;
      report += `Dimensions: ${element.offsetWidth}x${element.offsetHeight}\n`;
      report += `Style display: ${window.getComputedStyle(element).display}\n`;
      report += `Style visibility: ${window.getComputedStyle(element).visibility}\n`;
      report += `Style opacity: ${window.getComputedStyle(element).opacity}\n`;
      
      // Vérifier les parents
      let parent = element.parentElement;
      let parentChain = '';
      while (parent) {
        parentChain += `${parent.tagName}${parent.id ? '#' + parent.id : ''} > `;
        parent = parent.parentElement;
      }
      report += `Chaîne de parents: ${parentChain || 'aucun'}\n`;
    } else {
      report += '\n=== PAS D\'ÉLÉMENT CONTENEUR FOURNI ===\n';
    }
    
    return report;
  } catch (error) {
    return `Erreur de diagnostic: ${error.message}`;
  }
}

/**
 * Vérifie si le script Jitsi Meet API est chargé et utilisable
 * @returns {boolean} - True si le script est chargé et l'API est disponible
 */
export function isJitsiLoaded() {
  try {
    // Vérifier que window existe (pour éviter les erreurs en SSR)
    if (typeof window === 'undefined') {
      return false;
    }
    
    // Vérifier que JitsiMeetExternalAPI existe
    // @ts-ignore
    if (typeof window.JitsiMeetExternalAPI === 'undefined') {
      return false;
    }
    
    // Vérifier que c'est bien une fonction constructeur
    // @ts-ignore
    if (typeof window.JitsiMeetExternalAPI !== 'function') {
      return false;
    }
    
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Test explicite pour vérifier si l'API Jitsi est correctement chargée et utilisable
 * @returns {Promise<boolean>} - Résultat du test
 */
export async function testJitsiAPI() {
  try {
    // 1. Vérifier que le script est chargé
    if (!isJitsiLoaded()) {
      await loadJitsiScript();
      
      // Vérifier à nouveau après le chargement
      if (!isJitsiLoaded()) {
        return false;
      }
    }
    
    // 2. Tester la création d'un élément temporaire
    try {
      const testContainer = document.createElement('div');
      testContainer.id = 'jitsi-test-container';
      testContainer.style.position = 'absolute';
      testContainer.style.top = '-9999px';
      testContainer.style.left = '-9999px';
      testContainer.style.width = '400px';
      testContainer.style.height = '300px';
      document.body.appendChild(testContainer);
      
      // 3. Tenter de créer une instance minimale
      const testOptions = {
        roomName: 'test-room-' + Date.now(),
        parentNode: testContainer,
        width: '100%',
        height: '100%'
      };
      
      // @ts-ignore
      const testApi = new window.JitsiMeetExternalAPI(jitsiConfig.domain, testOptions);
      
      // 4. Si on arrive ici, c'est que la création a réussi. Nettoyer.
      setTimeout(() => {
        try {
          testApi.dispose();
          document.body.removeChild(testContainer);
        } catch (e) {
          // Ignorer les erreurs de nettoyage
        }
      }, 1000);
      
      return true;
    } catch (testError) {
      return false;
    }
  } catch (error) {
    return false;
  }
}

/**
 * Charge le script Jitsi Meet API si nécessaire
 * @returns {Promise<void>}
 */
export function loadJitsiScript() {
  if (jitsiScriptLoaded || isJitsiLoaded()) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    try {
      // Vérifier si le script existe déjà
      const existingScript = document.querySelector(`script[src*="${jitsiConfig.domain}/external_api.js"]`);
      if (existingScript) {
        jitsiScriptLoaded = true;
        // Attendre un peu pour s'assurer que le script est exécuté
        setTimeout(resolve, 500);
        return;
      }
      
      // Créer un élément script
      const script = document.createElement('script');
      script.src = `https://${jitsiConfig.domain}/external_api.js`;
      script.async = true;
      
      // Ajouter des gestionnaires d'événements plus robustes
      script.onload = () => {
        jitsiScriptLoaded = true;
        
        // Vérifier après un court délai que l'API est bien définie
        setTimeout(() => {
          // @ts-ignore
          if (typeof window.JitsiMeetExternalAPI === 'function') {
            resolve();
          } else {
            const error = new Error('Le script Jitsi a été chargé mais JitsiMeetExternalAPI n\'est pas disponible');
            reject(error);
          }
        }, 500);
      };
      
      script.onerror = (error) => {
        reject(error);
      };

      // Ajouter le script au document
      document.body.appendChild(script);
      
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Génère un identifiant unique pour une salle Jitsi Meet
 * @param {string} roomId - Identifiant de la salle dans Firestore
 * @returns {string} - Identifiant de la salle Jitsi Meet
 */
export function generateRoomName(roomId) {
  return `${jitsiConfig.roomPrefix}${roomId}`;
}

/**
 * Type définissant les options pour l'initialisation de Jitsi Meet
 * @typedef {Object} JitsiMeetOptions
 * @property {HTMLElement} [parentNode] - Élément conteneur pour Jitsi Meet
 * @property {string} [userDisplayName] - Nom d'affichage de l'utilisateur
 * @property {string} [userEmail] - Email de l'utilisateur
 * @property {boolean} [startWithAudioMuted] - Démarrer avec micro désactivé
 * @property {boolean} [startWithVideoMuted] - Démarrer avec caméra désactivée
 * @property {Object} [customOptions] - Options personnalisées à transmettre à l'API Jitsi Meet
 */

/**
 * Initialise et connecte à une salle Jitsi Meet
 * @param {string} roomId - Identifiant de la salle dans Firestore
 * @param {JitsiMeetOptions} options - Options supplémentaires
 * @returns {Promise<any>} - Instance de l'API Jitsi Meet
 */
export async function initJitsiMeet(roomId, options = {}) {
  // Si une instance existe déjà, la détruire
  if (api) {
    disposeJitsiMeet();
  }

  try {
    // S'assurer que le script est chargé
    if (!isJitsiLoaded()) {
      await loadJitsiScript();
    }

    // Vérifier que l'élément parent est fourni
    if (!options.parentNode) {
      throw new Error('L\'élément parent est requis pour initialiser Jitsi Meet');
    }
    
    // Vérifier si l'élément est correctement initialisé
    // Si l'élément n'est pas dans le DOM ou ses dimensions sont nulles,
    // créer un élément de secours attaché au body
    if (!document.body.contains(options.parentNode) || 
        options.parentNode.offsetWidth === 0 || 
        options.parentNode.offsetHeight === 0) {
      
      // Créer un conteneur de secours
      const fallbackContainer = document.createElement('div');
      fallbackContainer.id = `jitsi-fallback-${Date.now()}`;
      fallbackContainer.style.position = 'fixed';
      fallbackContainer.style.top = '0';
      fallbackContainer.style.left = '0';
      fallbackContainer.style.width = '100%';
      fallbackContainer.style.height = '100%';
      fallbackContainer.style.zIndex = '9999';
      fallbackContainer.style.background = '#000';
      document.body.appendChild(fallbackContainer);
      
      // Remplacer le conteneur original
      options.parentNode = fallbackContainer;
    }
    
    // Générer le nom de la salle
    const roomName = generateRoomName(roomId);

    // Créer un objet d'options qui peut être modifié sans contrainte de type
    /** @type {any} */
    const apiOptions = {
      roomName,
      parentNode: options.parentNode,
    };

    // Copier les options de configuration de base
    Object.assign(apiOptions, JSON.parse(JSON.stringify(jitsiConfig.options)));

    // Ajouter les informations utilisateur si disponibles
    if (options.userDisplayName || options.userEmail) {
      apiOptions.userInfo = {
        displayName: options.userDisplayName || 'Utilisateur anonyme'
      };
      
      if (options.userEmail) {
        apiOptions.userInfo.email = options.userEmail;
      }
    }

    // Appliquer des configurations personnalisées pour l'audio et la vidéo
    if (typeof options.startWithAudioMuted === 'boolean' ||
        typeof options.startWithVideoMuted === 'boolean') {
      
      if (!apiOptions.configOverwrite) {
        apiOptions.configOverwrite = {};
      } else {
        // Clone profond pour éviter de modifier l'objet original
        apiOptions.configOverwrite = JSON.parse(JSON.stringify(apiOptions.configOverwrite));
      }

      if (typeof options.startWithAudioMuted === 'boolean') {
        apiOptions.configOverwrite.startWithAudioMuted = options.startWithAudioMuted;
      }

      if (typeof options.startWithVideoMuted === 'boolean') {
        apiOptions.configOverwrite.startWithVideoMuted = options.startWithVideoMuted;
      }
    }

    // Ajouter des options personnalisées si fournies
    if (options.customOptions) {
      if (!apiOptions.configOverwrite) {
        apiOptions.configOverwrite = {};
      }
      
      apiOptions.configOverwrite = {
        ...apiOptions.configOverwrite,
        ...options.customOptions
      };
    }

    // Vider le store des participants
    participantsStore.clear();
    
    // Initialiser l'API Jitsi Meet
    // @ts-ignore
    api = new window.JitsiMeetExternalAPI(jitsiConfig.domain, apiOptions);
    isApiLoaded = true;

    // Ajouter des écouteurs d'événements
    api.addEventListeners({
      videoConferenceJoined: (event) => {
        // L'utilisateur a rejoint la conférence
      },
      participantJoined: (participant) => {
        // Stocker le participant
        participantsStore.set(participant.id, {
          id: participant.id,
          displayName: participant.displayName,
          joinedAt: new Date()
        });
      },
      participantLeft: (participant) => {
        // Retirer le participant du store
        participantsStore.delete(participant.id);
      },
      audioMuteStatusChanged: (muted) => {
        // Statut audio changé
      },
      videoMuteStatusChanged: (muted) => {
        // Statut vidéo changé
      },
      readyToClose: () => {
        disposeJitsiMeet();
      }
    });

    return api;
  } catch (error) {
    // Si le problème est spécifiquement lié à appendChild null
    if (error.message && error.message.includes('appendChild') && error.message.includes('null')) {
      throw new Error('Erreur critique - Le conteneur parent n\'est pas correctement initialisé dans le DOM.');
    }
    
    throw error;
  }
}

/**
 * Libère les ressources de l'API Jitsi Meet
 */
export function disposeJitsiMeet() {
  if (api && isApiLoaded) {
    try {
      // Vider le store des participants
      participantsStore.clear();
      
      api.dispose();
    } catch (error) {
      // Ignorer les erreurs de nettoyage
    } finally {
      api = null;
      isApiLoaded = false;
    }
  }
}

/**
 * Vérifie si une instance Jitsi Meet est active
 * @returns {boolean} - True si une instance est active
 */
export function isJitsiActive() {
  return api !== null && isApiLoaded;
}

/**
 * Récupère l'instance actuelle de l'API Jitsi Meet
 * @returns {any|null} - Instance de l'API Jitsi Meet ou null si aucune instance n'est active
 */
export function getJitsiApi() {
  return api;
}

/**
 * Active ou désactive le microphone
 * @param {boolean} mute - True pour désactiver, False pour activer
 * @returns {boolean} - Succès de l'opération
 */
export function setAudioMuted(mute) {
  if (!isJitsiActive()) {
    return false;
  }

  try {
    api.executeCommand('toggleAudio');
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Active ou désactive la caméra
 * @param {boolean} mute - True pour désactiver, False pour activer
 * @returns {boolean} - Succès de l'opération
 */
export function setVideoMuted(mute) {
  if (!isJitsiActive()) {
    return false;
  }

  try {
    api.executeCommand('toggleVideo');
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Récupère tous les participants de la salle
 * @returns {Array} - Liste des participants
 */
export function getAllParticipants() {
  if (!isJitsiActive()) {
    return [];
  }

  try {
    // Convertir la Map en tableau
    return Array.from(participantsStore.values());
  } catch (error) {
    return [];
  }
}

/**
 * Active le mode plein écran
 * @returns {boolean} - Succès de l'opération
 */
export function toggleFullScreen() {
  if (!isJitsiActive()) {
    return false;
  }

  try {
    api.executeCommand('toggleFilmStrip');
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Active le partage d'écran
 * @returns {boolean} - Succès de l'opération
 */
export function toggleScreenSharing() {
  if (!isJitsiActive()) {
    return false;
  }

  try {
    api.executeCommand('toggleShareScreen');
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Active le mode vue en mosaïque (tile view)
 * @returns {boolean} - Succès de l'opération
 */
export function toggleTileView() {
  if (!isJitsiActive()) {
    return false;
  }

  try {
    api.executeCommand('toggleTileView');
    return true;
  } catch (error) {
    return false;
  }
} 