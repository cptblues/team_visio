/**
 * Utilitaires pour l'authentification Firebase
 * Gère la connexion, l'inscription et la déconnexion des utilisateurs
 */

import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from './index';
import { COLLECTIONS, getDocument, setDocument } from './firestore';

/**
 * Inscrit un nouvel utilisateur
 * @param {string} email - Email de l'utilisateur
 * @param {string} password - Mot de passe de l'utilisateur
 * @param {string} displayName - Nom d'affichage de l'utilisateur
 * @param {boolean} isAdmin - Si l'utilisateur est administrateur
 * @returns {Promise<Object>} Informations sur l'utilisateur créé
 */
export const registerUser = async (email, password, displayName, isAdmin = false) => {
  try {
    // Créer l'utilisateur dans Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Mettre à jour le profil avec le nom d'affichage
    await updateProfile(user, { displayName });
    
    // Créer un document dans Firestore pour stocker des informations supplémentaires
    await setDocument(COLLECTIONS.USERS, user.uid, {
      email,
      displayName,
      isAdmin,
      createdAt: new Date()
    });
    
    return {
      uid: user.uid,
      email: user.email,
      displayName,
      isAdmin
    };
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    throw error;
  }
};

/**
 * Connecte un utilisateur
 * @param {string} email - Email de l'utilisateur
 * @param {string} password - Mot de passe de l'utilisateur
 * @returns {Promise<Object>} Informations sur l'utilisateur connecté
 */
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Récupérer les informations additionnelles de l'utilisateur depuis Firestore
    const userData = await getDocument(COLLECTIONS.USERS, user.uid);
    
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || userData?.displayName,
      isAdmin: userData?.isAdmin || false
    };
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    throw error;
  }
};

/**
 * Déconnecte l'utilisateur actuel
 * @returns {Promise<void>}
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    throw error;
  }
};

/**
 * Récupère l'utilisateur actuellement connecté
 * @returns {Object|null} Utilisateur connecté ou null
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * S'abonne aux changements d'état d'authentification
 * @param {function} callback - Fonction à appeler lors des changements
 * @returns {function} Fonction pour se désabonner
 */
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Récupérer les informations additionnelles de l'utilisateur depuis Firestore
      const userData = await getDocument(COLLECTIONS.USERS, user.uid);
      
      callback({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || userData?.displayName,
        isAdmin: userData?.isAdmin || false
      });
    } else {
      callback(null);
    }
  });
};

/**
 * Vérifie si l'utilisateur actuel est un administrateur
 * @returns {Promise<boolean>} Vrai si l'utilisateur est administrateur
 */
export const isCurrentUserAdmin = async () => {
  const user = getCurrentUser();
  
  if (!user) {
    return false;
  }
  
  const userData = await getDocument(COLLECTIONS.USERS, user.uid);
  return userData?.isAdmin || false;
}; 