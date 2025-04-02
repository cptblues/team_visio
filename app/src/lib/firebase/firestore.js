/**
 * Utilitaires pour interagir avec Firestore
 * Définit les collections et les fonctions CRUD de base
 */

import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query,
  where,
  onSnapshot
} from 'firebase/firestore';
import { db } from './index';

// Définition des collections principales
export const COLLECTIONS = {
  USERS: 'users',
  ROOMS: 'rooms',
  SETTINGS: 'settings'
};

// Fonctions utilitaires pour les collections

/**
 * Récupère une référence à une collection
 * @param {string} collectionName - Nom de la collection
 * @returns {import('firebase/firestore').CollectionReference} Référence à la collection
 */
export const getCollection = (collectionName) => {
  return collection(db, collectionName);
};

/**
 * Récupère un document par son ID
 * @param {string} collectionName - Nom de la collection
 * @param {string} docId - ID du document
 * @returns {Promise<Object|null>} Document récupéré ou null
 */
export const getDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log(`Aucun document trouvé avec l'ID ${docId} dans ${collectionName}`);
      return null;
    }
  } catch (error) {
    console.error(`Erreur lors de la récupération du document ${docId}:`, error);
    throw error;
  }
};

/**
 * Récupère tous les documents d'une collection
 * @param {string} collectionName - Nom de la collection
 * @returns {Promise<Array<Object>>} Liste des documents
 */
export const getAllDocuments = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error(`Erreur lors de la récupération des documents de ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Ajoute un document à une collection avec un ID généré automatiquement
 * @param {string} collectionName - Nom de la collection
 * @param {Object} data - Données du document
 * @returns {Promise<string>} ID du document créé
 */
export const addDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error(`Erreur lors de l'ajout du document dans ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Ajoute ou met à jour un document avec un ID spécifique
 * @param {string} collectionName - Nom de la collection
 * @param {string} docId - ID du document
 * @param {Object} data - Données du document
 * @returns {Promise<void>}
 */
export const setDocument = async (collectionName, docId, data) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, {
      ...data,
      updatedAt: new Date()
    }, { merge: true });
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du document ${docId}:`, error);
    throw error;
  }
};

/**
 * Met à jour un document existant
 * @param {string} collectionName - Nom de la collection
 * @param {string} docId - ID du document
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise<void>}
 */
export const updateDocument = async (collectionName, docId, data) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du document ${docId}:`, error);
    throw error;
  }
};

/**
 * Supprime un document
 * @param {string} collectionName - Nom de la collection
 * @param {string} docId - ID du document
 * @returns {Promise<void>}
 */
export const deleteDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Erreur lors de la suppression du document ${docId}:`, error);
    throw error;
  }
};

/**
 * S'abonne aux changements d'une collection
 * @param {string} collectionName - Nom de la collection
 * @param {function} callback - Fonction à appeler lors des changements
 * @param {Object} [queryParams] - Paramètres de requête optionnels
 * @returns {function} Fonction pour se désabonner
 */
export const subscribeToCollection = (collectionName, callback, queryParams = null) => {
  try {
    const collectionRef = collection(db, collectionName);
    
    if (queryParams && queryParams.where && queryParams.where.length > 0) {
      // Construire la requête si des paramètres sont fournis
      const constraints = queryParams.where.map(param => 
        where(param.field, param.operator, param.value)
      );
      
      const queryRef = query(collectionRef, ...constraints);
      return onSnapshot(queryRef, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(data);
      });
    }
    
    // Si pas de paramètres de requête, s'abonner à la collection entière
    return onSnapshot(collectionRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(data);
    });
  } catch (error) {
    console.error(`Erreur lors de l'abonnement à la collection ${collectionName}:`, error);
    throw error;
  }
};

/**
 * S'abonne aux changements d'un document
 * @param {string} collectionName - Nom de la collection
 * @param {string} docId - ID du document
 * @param {function} callback - Fonction à appeler lors des changements
 * @returns {function} Fonction pour se désabonner
 */
export const subscribeToDocument = (collectionName, docId, callback) => {
  try {
    const docRef = doc(db, collectionName, docId);
    return onSnapshot(docRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        callback({ id: docSnapshot.id, ...docSnapshot.data() });
      } else {
        callback(null);
      }
    });
  } catch (error) {
    console.error(`Erreur lors de l'abonnement au document ${docId}:`, error);
    throw error;
  }
}; 