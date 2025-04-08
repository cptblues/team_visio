import { writable, derived } from 'svelte/store';
import { supabase } from '../lib/supabase/client';

// Store pour l'état de l'utilisateur
export const currentUser = writable(null);

// Store pour l'état de chargement de l'authentification
export const authLoading = writable(true);

// Store pour les erreurs d'authentification
export const authError = writable(null);

// Store dérivé pour savoir si l'utilisateur est connecté
export const isLoggedIn = derived(currentUser, $currentUser => $currentUser !== null);

// Store dérivé pour savoir si l'utilisateur est administrateur
export const isAdmin = derived(currentUser, $currentUser => $currentUser?.is_admin === true);

// Initialisation de l'écoute des changements d'état d'authentification
let unsubscribe;

// Fonction pour initialiser l'état de l'utilisateur
export async function initUserStore() {
  // Éviter les écouteurs dupliqués
  if (unsubscribe) {
    console.log('UserStore: Nettoyage de l\'abonnement existant avant réinitialisation');
    unsubscribe();
    unsubscribe = null;
  }

  console.log('UserStore: Initialisation de l\'écoute des changements d\'authentification');
  
  // Récupérer la session initiale
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user) {
    console.log('UserStore: Récupération des données utilisateur pour', session.user.id);
    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id);
    
    if (error) {
      console.error('UserStore: Erreur lors de la récupération des données utilisateur:', error);
      currentUser.set(null);
    } else if (userData && userData.length > 0) {
      console.log('UserStore: Données utilisateur trouvées:', userData[0]);
      currentUser.set(userData[0]);
    } else {
      console.log('UserStore: Aucune donnée utilisateur trouvée');
      currentUser.set(null);
    }
  }
  authLoading.set(false);

  // S'abonner aux changements d'authentification
  const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
    console.log('UserStore: État d\'authentification changé', event, session?.user?.email);
    
    if (event === 'SIGNED_IN' && session?.user) {
      console.log('UserStore: Récupération des données utilisateur pour', session.user.id);
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id);
      
      if (error) {
        console.error('UserStore: Erreur lors de la récupération des données utilisateur:', error);
        currentUser.set(null);
      } else if (userData && userData.length > 0) {
        console.log('UserStore: Données utilisateur trouvées:', userData[0]);
        currentUser.set(userData[0]);
      } else {
        console.log('UserStore: Aucune donnée utilisateur trouvée');
        currentUser.set(null);
      }
    } else if (event === 'SIGNED_OUT') {
      currentUser.set(null);
    }
    authLoading.set(false);
  });

  unsubscribe = subscription;

  return () => {
    console.log('UserStore: Nettoyage de l\'abonnement auth');
    if (unsubscribe) {
      unsubscribe.unsubscribe();
      unsubscribe = null;
    }
  };
}

// Déconnexion de l'utilisateur
export async function logout() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    // Le store sera automatiquement mis à jour par le listener onAuthStateChange
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