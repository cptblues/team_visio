/**
 * Utilitaires d'administration pour Firebase
 * Fonctions pour gérer les droits administrateur
 */

import { COLLECTIONS, updateDocument, getDocument } from './firestore';
import { auth } from './index';
import { isCurrentUserAdmin } from './auth';

/**
 * Met à jour le statut administrateur d'un utilisateur
 * @param {string} userId - L'ID de l'utilisateur à mettre à jour
 * @param {boolean} isAdmin - Le nouveau statut administrateur
 * @returns {Promise<void>}
 */
export async function updateUserAdminStatus(userId, isAdmin) {
  // Vérifier que l'utilisateur courant est bien admin
  const currentUserIsAdmin = await isCurrentUserAdmin();
  
  if (!currentUserIsAdmin) {
    throw new Error('Vous devez être administrateur pour effectuer cette action');
  }
  
  try {
    // Vérifier que l'utilisateur existe
    const userData = await getDocument(COLLECTIONS.USERS, userId);
    
    if (!userData) {
      throw new Error(`L'utilisateur avec l'ID ${userId} n'existe pas`);
    }
    
    // Mettre à jour le statut admin
    await updateDocument(COLLECTIONS.USERS, userId, {
      isAdmin: Boolean(isAdmin)
    });
    
    console.log(`Statut administrateur de l'utilisateur ${userId} mis à jour : ${isAdmin}`);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut administrateur :', error);
    throw error;
  }
}

/**
 * Permet de se mettre soi-même en administrateur
 * Fonction à utiliser uniquement en développement pour tester les fonctionnalités d'administration
 * @returns {Promise<{success: boolean, userId: string}>} Résultat de l'opération
 */
export async function makeSelfAdmin() {
  if (!auth.currentUser) {
    throw new Error('Vous devez être connecté pour effectuer cette action');
  }
  
  const userId = auth.currentUser.uid;
  
  try {
    // Vérifier si l'utilisateur existe déjà dans Firestore
    const userData = await getDocument(COLLECTIONS.USERS, userId);
    
    if (userData) {
      // Mettre à jour le document existant
      await updateDocument(COLLECTIONS.USERS, userId, {
        isAdmin: true
      });
    } else {
      // Créer un nouveau document utilisateur
      await updateDocument(COLLECTIONS.USERS, userId, {
        email: auth.currentUser.email,
        displayName: auth.currentUser.displayName || '',
        isAdmin: true,
        createdAt: new Date()
      });
    }
    
    console.log(`Vous êtes maintenant administrateur (userId: ${userId})`);
    console.log('Veuillez vous reconnecter pour que les changements prennent effet');
    
    return { success: true, userId };
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut administrateur :', error);
    throw error;
  }
} 