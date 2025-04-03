import { writable } from 'svelte/store';
import { onAuthChange } from '../lib/firebase/auth';

// Store pour l'état de l'utilisateur
export const currentUser = writable(null);

// Store pour l'état de chargement de l'authentification
export const authLoading = writable(true);

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

// Réinitialiser le store
export function resetUserStore() {
  console.log('UserStore: Réinitialisation du store utilisateur');
  currentUser.set(null);
} 