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
  COLLECTIONS,
  getCollection
} from './firestore';
import { auth } from './index';
import { get } from 'svelte/store';
import { isAdmin as isAdminStore } from '../../stores/userStore';

/**
 * Crée une nouvelle salle dans Firestore
 * @param {Object} roomData - Les données de la salle
 * @returns {Promise<string>} - L'ID de la nouvelle salle
 */
export async function createRoom(roomData) {
  if (!auth.currentUser) {
    throw new Error('Utilisateur non connecté');
  }

  const newRoom = {
    ...roomData,
    createdBy: auth.currentUser.uid,
    createdAt: new Date(),
    participants: [],
    isPublic: roomData.isPublic ?? true, // Par défaut, les salles sont publiques
  };

  try {
    const roomId = await addDocument(COLLECTIONS.ROOMS, newRoom);
    console.log(`Salle créée avec succès: ${roomId}`);
    return roomId;
  } catch (error) {
    console.error('Erreur lors de la création de la salle:', error);
    throw error;
  }
}

/**
 * Récupère les détails d'une salle par son ID
 * @param {string} roomId - L'ID de la salle
 * @returns {Promise<Object>} - Les données de la salle
 */
export async function getRoomById(roomId) {
  try {
    return await getDocument(COLLECTIONS.ROOMS, roomId);
  } catch (error) {
    console.error(`Erreur lors de la récupération de la salle ${roomId}:`, error);
    throw error;
  }
}

/**
 * Met à jour les informations d'une salle
 * @param {string} roomId - L'ID de la salle à mettre à jour
 * @param {Object} updateData - Les données à mettre à jour
 * @returns {Promise<void>}
 */
export async function updateRoom(roomId, updateData) {
  if (!auth.currentUser) {
    throw new Error('Utilisateur non connecté');
  }

  try {
    const roomData = await getDocument(COLLECTIONS.ROOMS, roomId);
    
    // Vérifier si l'utilisateur est le créateur de la salle ou administrateur
    const isAdmin = get(isAdminStore);
    console.log('isAdmin', isAdmin, auth.currentUser);
    if (roomData.createdBy !== auth.currentUser.uid && !isAdmin) {
      throw new Error('Vous n\'avez pas les droits pour modifier cette salle');
    }

    await updateDocument(COLLECTIONS.ROOMS, roomId, updateData);
    console.log(`Salle ${roomId} mise à jour avec succès`);
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de la salle ${roomId}:`, error);
    throw error;
  }
}

/**
 * Supprime une salle
 * @param {string} roomId - L'ID de la salle à supprimer
 * @returns {Promise<void>}
 */
export async function deleteRoom(roomId) {
  if (!auth.currentUser) {
    throw new Error('Utilisateur non connecté');
  }

  try {
    const roomData = await getDocument(COLLECTIONS.ROOMS, roomId);
    
    // Vérifier si l'utilisateur est le créateur de la salle ou administrateur
    const isAdmin = get(isAdminStore);
    if (roomData.createdBy !== auth.currentUser.uid && !isAdmin) {
      throw new Error('Vous n\'avez pas les droits pour supprimer cette salle');
    }

    await deleteDocument(COLLECTIONS.ROOMS, roomId);
    console.log(`Salle ${roomId} supprimée avec succès`);
  } catch (error) {
    console.error(`Erreur lors de la suppression de la salle ${roomId}:`, error);
    throw error;
  }
}

/**
 * Rejoindre une salle
 * @param {string} roomId - L'ID de la salle à rejoindre
 * @returns {Promise<void>}
 */
export async function joinRoom(roomId) {
  if (!auth.currentUser) {
    throw new Error('Utilisateur non connecté');
  }

  try {
    const roomData = await getDocument(COLLECTIONS.ROOMS, roomId);
    
    // Vérifier si la salle est privée
    if (!roomData.isPublic) {
      // Pour l'instant, on vérifie juste si l'utilisateur est connecté
      // Plus tard, on pourrait implémenter une logique d'invitation
    }

    // Ajouter l'utilisateur à la liste des participants s'il n'y est pas déjà
    if (!roomData.participants.includes(auth.currentUser.uid)) {
      await updateDocument(COLLECTIONS.ROOMS, roomId, {
        participants: [...roomData.participants, auth.currentUser.uid]
      });
    }
    
    console.log(`Vous avez rejoint la salle ${roomId}`);
  } catch (error) {
    console.error(`Erreur lors de la tentative de rejoindre la salle ${roomId}:`, error);
    throw error;
  }
}

/**
 * Quitter une salle
 * @param {string} roomId - L'ID de la salle à quitter
 * @returns {Promise<void>}
 */
export async function leaveRoom(roomId) {
  if (!auth.currentUser) {
    throw new Error('Utilisateur non connecté');
  }

  try {
    const roomData = await getDocument(COLLECTIONS.ROOMS, roomId);
    
    // Retirer l'utilisateur de la liste des participants
    const updatedParticipants = roomData.participants.filter(
      participantId => participantId !== auth.currentUser.uid
    );
    
    await updateDocument(COLLECTIONS.ROOMS, roomId, {
      participants: updatedParticipants
    });
    
    console.log(`Vous avez quitté la salle ${roomId}`);
  } catch (error) {
    console.error(`Erreur lors de la tentative de quitter la salle ${roomId}:`, error);
    throw error;
  }
}

/**
 * Récupère les salles créées par l'utilisateur actuel
 * @returns {Promise<Array>} - Liste des salles créées par l'utilisateur
 */
export async function getUserRooms() {
  if (!auth.currentUser) {
    throw new Error('Utilisateur non connecté');
  }

  try {
    // Récupérer toutes les salles puis filtrer côté client
    const allRooms = await getAllDocuments(COLLECTIONS.ROOMS);
    return allRooms.filter(room => room.createdBy === auth.currentUser.uid);
  } catch (error) {
    console.error('Erreur lors de la récupération des salles de l\'utilisateur:', error);
    throw error;
  }
}

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