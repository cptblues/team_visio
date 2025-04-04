import { writable } from 'svelte/store';

// Types de toast
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning'
};

// Création du store pour les toasts
const createToastStore = () => {
  // ID auto-incrémenté pour identifier chaque toast
  let nextId = 0;
  
  // Store qui contiendra la liste des toasts actifs
  const { subscribe, update } = writable([]);
  
  // Fonction pour ajouter un toast
  const addToast = (message, type = TOAST_TYPES.INFO, timeout = 3000) => {
    const id = nextId++;
    const toast = {
      id,
      message,
      type,
      timestamp: new Date()
    };
    
    // Ajouter le toast à la liste
    update(toasts => [...toasts, toast]);
    
    // Supprimer automatiquement le toast après le délai
    if (timeout > 0) {
      setTimeout(() => {
        removeToast(id);
      }, timeout);
    }
    
    return id;
  };
  
  // Fonction pour supprimer un toast par son ID
  const removeToast = (id) => {
    update(toasts => toasts.filter(toast => toast.id !== id));
  };
  
  // Fonctions spécifiques pour chaque type de toast
  const success = (message, timeout = 3000) => 
    addToast(message, TOAST_TYPES.SUCCESS, timeout);
  
  const error = (message, timeout = 5000) => 
    addToast(message, TOAST_TYPES.ERROR, timeout);
  
  const info = (message, timeout = 3000) => 
    addToast(message, TOAST_TYPES.INFO, timeout);
  
  const warning = (message, timeout = 4000) => 
    addToast(message, TOAST_TYPES.WARNING, timeout);
  
  // Fonction pour supprimer tous les toasts
  const clearAll = () => {
    update(() => []);
  };
  
  return {
    subscribe,
    addToast,
    removeToast,
    success,
    error,
    info,
    warning,
    clearAll
  };
};

// Export du store
export const toasts = createToastStore(); 