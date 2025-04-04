/**
 * Utilitaires pour la gestion des halls
 * Fonctions spécifiques pour créer, récupérer et gérer les halls
 */

import { 
  addDocument, 
  getDocument, 
  updateDocument, 
  deleteDocument, 
  getAllDocuments, 
  subscribeToCollection,
  subscribeToDocument,
  COLLECTIONS,
  getCollection
} from './firestore';
import { auth } from './index';

/**
 * Crée un nouveau hall dans Firestore
 * @param {Object} hallData - Les données du hall
 * @returns {Promise<string>} - L'ID du nouveau hall
 */
export async function createHall(hallData) {
  if (!auth.currentUser) {
    throw new Error('Utilisateur non connecté');
  }

  const newHall = {
    ...hallData,
    creatorId: auth.currentUser.uid,
    createdAt: new Date(),
    roomLimit: hallData.roomLimit || 3,
    invitedUsers: hallData.invitedUsers || [],
  };

  try {
    const hallId = await addDocument(COLLECTIONS.HALLS, newHall);
    console.log(`Hall créé avec succès: ${hallId}`);
    return hallId;
  } catch (error) {
    console.error('Erreur lors de la création du hall:', error);
    throw error;
  }
}

/**
 * Vérifie si un utilisateur a déjà un hall actif
 * @param {string} userId - L'ID de l'utilisateur
 * @returns {Promise<boolean>} - true si l'utilisateur a déjà un hall, false sinon
 */
export async function checkUserHall(userId) {
  try {
    const halls = await getAllDocuments(COLLECTIONS.HALLS);
    return halls.some(hall => hall.creatorId === userId);
  } catch (error) {
    console.error(`Erreur lors de la vérification des halls de l'utilisateur ${userId}:`, error);
    throw error;
  }
}

/**
 * Récupère le hall créé par un utilisateur spécifique
 * @param {string} userId - L'ID de l'utilisateur
 * @returns {Promise<Object|null>} - Le hall de l'utilisateur ou null s'il n'en a pas
 */
export async function getUserHall(userId) {
  try {
    const halls = await getAllDocuments(COLLECTIONS.HALLS);
    return halls.find(hall => hall.creatorId === userId) || null;
  } catch (error) {
    console.error(`Erreur lors de la récupération du hall de l'utilisateur ${userId}:`, error);
    throw error;
  }
}

/**
 * Récupère les détails d'un hall par son ID
 * @param {string} hallId - L'ID du hall
 * @returns {Promise<Object>} - Les données du hall
 */
export async function getHallById(hallId) {
  try {
    return await getDocument(COLLECTIONS.HALLS, hallId);
  } catch (error) {
    console.error(`Erreur lors de la récupération du hall ${hallId}:`, error);
    throw error;
  }
}

/**
 * Met à jour les informations d'un hall
 * @param {string} hallId - L'ID du hall à mettre à jour
 * @param {Object} updateData - Les données à mettre à jour
 * @returns {Promise<void>}
 */
export async function updateHall(hallId, updateData) {
  if (!auth.currentUser) {
    throw new Error('Utilisateur non connecté');
  }

  try {
    const hallData = await getDocument(COLLECTIONS.HALLS, hallId);
    
    // Vérifier si l'utilisateur est le créateur du hall
    if (hallData.creatorId !== auth.currentUser.uid) {
      throw new Error('Vous n\'avez pas les droits pour modifier ce hall');
    }

    await updateDocument(COLLECTIONS.HALLS, hallId, updateData);
    console.log(`Hall ${hallId} mis à jour avec succès`);
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du hall ${hallId}:`, error);
    throw error;
  }
}

/**
 * Supprime un hall
 * @param {string} hallId - L'ID du hall à supprimer
 * @returns {Promise<void>}
 */
export async function deleteHall(hallId) {
  if (!auth.currentUser) {
    throw new Error('Utilisateur non connecté');
  }

  try {
    const hallData = await getDocument(COLLECTIONS.HALLS, hallId);
    
    // Vérifier si l'utilisateur est le créateur du hall
    if (hallData.creatorId !== auth.currentUser.uid) {
      throw new Error('Vous n\'avez pas les droits pour supprimer ce hall');
    }

    await deleteDocument(COLLECTIONS.HALLS, hallId);
    console.log(`Hall ${hallId} supprimé avec succès`);
  } catch (error) {
    console.error(`Erreur lors de la suppression du hall ${hallId}:`, error);
    throw error;
  }
}

/**
 * S'abonne aux changements de la liste des halls
 * @param {function} callback - Fonction à appeler avec la liste des halls mise à jour
 * @returns {function} Fonction pour se désabonner
 */
export const subscribeToHalls = (callback) => {
  return subscribeToCollection(COLLECTIONS.HALLS, callback);
};

/**
 * S'abonne aux changements d'un hall spécifique
 * @param {string} hallId - L'ID du hall
 * @param {function} callback - Fonction à appeler avec le hall mis à jour
 * @returns {function} Fonction pour se désabonner
 */
export const subscribeToHall = (hallId, callback) => {
  return subscribeToDocument(COLLECTIONS.HALLS, hallId, callback);
}; 