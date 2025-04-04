import { writable, derived } from 'svelte/store';
import { onAuthChange, logoutUser } from '../lib/firebase/auth';

// Store pour l'état de l'utilisateur
export const currentUser = writable(null);

// Store pour l'état de chargement de l'authentification
export const authLoading = writable(true);

// Store pour les erreurs d'authentification
export const authError = writable(null);

// Store dérivé pour savoir si l'utilisateur est connecté
export const isLoggedIn = derived(currentUser, $currentUser => $currentUser !== null);

// Store dérivé pour savoir si l'utilisateur est administrateur
export const isAdmin = derived(currentUser, $currentUser => $currentUser?.isAdmin === true);

// Initialisation de l'écoute des changements d'état d'authentification
let unsubscribe;

// Fonction pour initialiser l'état de l'utilisateur
export function initUserStore() {
  // Éviter les écouteurs dupliqués
  if (unsubscribe) {
    console.log('UserStore: Nettoyage de l\'abonnement existant avant réinitialisation');
    unsubscribe();
    unsubscribe = null;
  }

  console.log('UserStore: Initialisation de l\'écoute des changements d\'authentification');
  
  unsubscribe = onAuthChange((user) => {
    console.log('UserStore: État d\'authentification changé', user ? `Utilisateur connecté: ${user.email}` : 'Aucun utilisateur');
    currentUser.set(user);
    authLoading.set(false);
  });

  return () => {
    console.log('UserStore: Nettoyage de l\'abonnement auth');
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
  };
}

// Déconnexion de l'utilisateur
export async function logout() {
  try {
    await logoutUser();
    // Le store sera automatiquement mis à jour par le listener onAuthChange
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
    authError.set(error.message);
    throw error;
  }
}

// Réinitialiser le store
export function resetUserStore() {
  console.log('UserStore: Réinitialisation du store utilisateur');
  currentUser.set(null);
} 