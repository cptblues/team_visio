/**
 * Utilitaires pour la gestion des salles
 * Fonctions spécifiques pour créer, récupérer et gérer les salles
 */

import { 
  addDocument, 
  getDocument, 
  updateDocument, 
  deleteDocument, 
  getAllDocuments, 
  subscribeToCollection,
  COLLECTIONS 
} from './firestore';

/**
 * Crée une nouvelle salle
 * @param {string} name - Nom de la salle
 * @param {string} createdBy - ID de l'utilisateur qui crée la salle
 * @param {boolean} isPublic - Si la salle est publique ou privée
 * @param {Object} options - Options additionnelles pour la salle
 * @returns {Promise<string>} ID de la salle créée
 */
export const createRoom = async (name, createdBy, isPublic = true, options = {}) => {
  const roomData = {
    name,
    createdBy,
    isPublic,
    participants: [],
    maxParticipants: options.maxParticipants || null,
    createdAt: new Date(),
    ...options
  };
  
  return await addDocument(COLLECTIONS.ROOMS, roomData);
};

/**
 * Récupère une salle par son ID
 * @param {string} roomId - ID de la salle
 * @returns {Promise<Object|null>} Données de la salle ou null si non trouvée
 */
export const getRoom = async (roomId) => {
  return await getDocument(COLLECTIONS.ROOMS, roomId);
};

/**
 * Récupère toutes les salles
 * @param {boolean} [publicOnly=false] - Récupérer uniquement les salles publiques
 * @returns {Promise<Array<Object>>} Liste des salles
 */
export const getAllRooms = async (publicOnly = false) => {
  const rooms = await getAllDocuments(COLLECTIONS.ROOMS);
  
  if (publicOnly) {
    return rooms.filter(room => room.isPublic);
  }
  
  return rooms;
};

/**
 * S'abonne aux changements de la liste des salles
 * @param {function} callback - Fonction à appeler avec la liste des salles mise à jour
 * @param {boolean} [publicOnly=false] - S'abonner uniquement aux salles publiques
 * @returns {function} Fonction pour se désabonner
 */
export const subscribeToRooms = (callback, publicOnly = false) => {
  const queryParams = publicOnly 
    ? { 
        where: [{ 
          field: 'isPublic', 
          operator: '==', 
          value: true 
        }] 
      } 
    : null;
  
  return subscribeToCollection(COLLECTIONS.ROOMS, callback, queryParams);
};

/**
 * Met à jour les informations d'une salle
 * @param {string} roomId - ID de la salle
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise<void>}
 */
export const updateRoom = async (roomId, data) => {
  await updateDocument(COLLECTIONS.ROOMS, roomId, data);
};

/**
 * Supprime une salle
 * @param {string} roomId - ID de la salle
 * @returns {Promise<void>}
 */
export const deleteRoom = async (roomId) => {
  await deleteDocument(COLLECTIONS.ROOMS, roomId);
};

/**
 * Ajoute un participant à une salle
 * @param {string} roomId - ID de la salle
 * @param {string} userId - ID de l'utilisateur
 * @param {string} displayName - Nom d'affichage de l'utilisateur
 * @returns {Promise<void>}
 */
export const joinRoom = async (roomId, userId, displayName) => {
  const room = await getRoom(roomId);
  
  if (!room) {
    throw new Error(`La salle avec l'ID ${roomId} n'existe pas`);
  }
  
  // Vérifier si l'utilisateur est déjà dans la salle
  if (room.participants.some(p => p.userId === userId)) {
    return; // L'utilisateur est déjà dans la salle
  }
  
  // Vérifier si la salle a atteint sa capacité maximale
  if (room.maxParticipants && room.participants.length >= room.maxParticipants) {
    throw new Error(`La salle ${room.name} est pleine`);
  }
  
  // Ajouter l'utilisateur à la liste des participants
  const participants = [...room.participants, {
    userId,
    displayName,
    joinedAt: new Date()
  }];
  
  await updateDocument(COLLECTIONS.ROOMS, roomId, { participants });
};

/**
 * Retire un participant d'une salle
 * @param {string} roomId - ID de la salle
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<void>}
 */
export const leaveRoom = async (roomId, userId) => {
  const room = await getRoom(roomId);
  
  if (!room) {
    throw new Error(`La salle avec l'ID ${roomId} n'existe pas`);
  }
  
  // Filtrer l'utilisateur de la liste des participants
  const participants = room.participants.filter(p => p.userId !== userId);
  
  await updateDocument(COLLECTIONS.ROOMS, roomId, { participants });
}; 