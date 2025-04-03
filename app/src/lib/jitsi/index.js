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
 * @type {JitsiMeetExternalAPI|null}
 */
let api = null;
let isApiLoaded = false;
let jitsiScriptLoaded = false;

/**
 * Vérifie si le script Jitsi Meet API est chargé
 * @returns {boolean} - True si le script est chargé
 */
export function isJitsiLoaded() {
  return typeof window !== 'undefined' && typeof window.JitsiMeetExternalAPI !== 'undefined';
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
    // Créer un élément script
    const script = document.createElement('script');
    script.src = `https://${jitsiConfig.domain}/external_api.js`;
    script.async = true;
    script.onload = () => {
      jitsiScriptLoaded = true;
      console.log('Script Jitsi Meet chargé avec succès');
      resolve();
    };
    script.onerror = (error) => {
      console.error('Erreur lors du chargement du script Jitsi Meet:', error);
      reject(error);
    };

    // Ajouter le script au document
    document.body.appendChild(script);
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

    // Générer le nom de la salle
    const roomName = generateRoomName(roomId);

    // Préparer les options de base
    const apiOptions = {
      ...jitsiConfig.options,
      roomName,
      parentNode: options.parentNode,
    };

    // Ajouter les informations utilisateur si disponibles
    if (options.userDisplayName) {
      // Utiliser une approche plus sûre pour ajouter des propriétés
      const userInfo = {
        displayName: options.userDisplayName
      };
      
      if (options.userEmail) {
        userInfo.email = options.userEmail;
      }
      
      // Ajouter userInfo aux options de l'API
      apiOptions.userInfo = userInfo;
    }

    // Initialiser l'API Jitsi Meet
    api = new window.JitsiMeetExternalAPI(jitsiConfig.domain, apiOptions);
    isApiLoaded = true;

    // Ajouter des écouteurs d'événements
    api.addEventListeners({
      videoConferenceJoined: () => {
        console.log(`Vous avez rejoint la salle Jitsi Meet: ${roomName}`);
      },
      participantJoined: (participant) => {
        console.log(`Participant rejoint: ${participant.displayName}`);
      },
      participantLeft: (participant) => {
        console.log(`Participant parti: ${participant.displayName}`);
      },
      readyToClose: () => {
        console.log('Session Jitsi Meet terminée');
        disposeJitsiMeet();
      }
    });

    console.log(`Instance Jitsi Meet initialisée pour la salle: ${roomName}`);
    return api;
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de Jitsi Meet:', error);
    throw error;
  }
}

/**
 * Libère les ressources de l'API Jitsi Meet
 */
export function disposeJitsiMeet() {
  if (api && isApiLoaded) {
    try {
      api.dispose();
      console.log('Instance Jitsi Meet détruite');
    } catch (error) {
      console.error('Erreur lors de la destruction de l\'instance Jitsi Meet:', error);
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