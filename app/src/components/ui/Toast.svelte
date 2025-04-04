<script>
  import { onMount } from 'svelte';
  import { toasts, TOAST_TYPES } from '../../stores/toastStore';
  
  // Variables pour contrôler l'animation
  let enterTransition = false;
  
  onMount(() => {
    // Déclencher l'animation d'entrée après le rendu initial
    setTimeout(() => {
      enterTransition = true;
    }, 10);
  });
  
  // Fonction pour obtenir la classe de couleur selon le type
  function getTypeClass(type) {
    switch (type) {
      case TOAST_TYPES.SUCCESS:
        return 'toast-success';
      case TOAST_TYPES.ERROR:
        return 'toast-error';
      case TOAST_TYPES.WARNING:
        return 'toast-warning';
      case TOAST_TYPES.INFO:
      default:
        return 'toast-info';
    }
  }
  
  // Fonction pour obtenir l'icône selon le type
  function getTypeIcon(type) {
    switch (type) {
      case TOAST_TYPES.SUCCESS:
        return '✓';
      case TOAST_TYPES.ERROR:
        return '✕';
      case TOAST_TYPES.WARNING:
        return '⚠';
      case TOAST_TYPES.INFO:
      default:
        return 'ℹ';
    }
  }
</script>

<div class="toast-container" class:active={enterTransition} role="alert">
  {#each $toasts as toast (toast.id)}
    <div 
      class="toast {getTypeClass(toast.type)}" 
      role="status" 
      aria-live="polite"
    >
      <div class="toast-icon" aria-hidden="true">{getTypeIcon(toast.type)}</div>
      <div class="toast-content">{toast.message}</div>
      <button 
        class="toast-close" 
        on:click={() => toasts.removeToast(toast.id)}
        aria-label="Fermer la notification"
      >
        &times;
      </button>
    </div>
  {/each}
</div>

<style>
  .toast-container {
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-width: 300px;
    max-width: 400px;
    opacity: 0;
    transform: translateY(-20px);
    transition: opacity 0.3s ease, transform 0.3s ease;
  }
  
  .toast-container.active {
    opacity: 1;
    transform: translateY(0);
  }
  
  .toast {
    display: flex;
    align-items: center;
    padding: 0.75rem 1rem;
    border-radius: var(--radius-md);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    animation: slide-in 0.3s ease forwards;
    color: var(--foreground);
    background-color: var(--background);
  }
  
  .toast-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    margin-right: 0.75rem;
    font-weight: bold;
    flex-shrink: 0;
  }
  
  .toast-content {
    flex: 1;
    font-size: 0.9rem;
  }
  
  .toast-close {
    background: none;
    border: none;
    color: inherit;
    font-size: 1.25rem;
    cursor: pointer;
    padding: 0;
    margin-left: 0.5rem;
    opacity: 0.7;
    line-height: 1;
  }
  
  .toast-close:hover {
    opacity: 1;
  }
  
  .toast-success {
    background-color: var(--success-light);
    border-left: 4px solid var(--success);
  }
  
  .toast-success .toast-icon {
    background-color: var(--success);
    color: white;
  }
  
  .toast-error {
    background-color: var(--error-light);
    border-left: 4px solid var(--error);
  }
  
  .toast-error .toast-icon {
    background-color: var(--error);
    color: white;
  }
  
  .toast-warning {
    background-color: var(--warning-light);
    border-left: 4px solid var(--warning);
  }
  
  .toast-warning .toast-icon {
    background-color: var(--warning);
    color: white;
  }
  
  .toast-info {
    background-color: var(--info-light);
    border-left: 4px solid var(--info);
  }
  
  .toast-info .toast-icon {
    background-color: var(--info);
    color: white;
  }
  
  @keyframes slide-in {
    0% {
      opacity: 0;
      transform: translateX(100%);
    }
    100% {
      opacity: 1;
      transform: translateX(0);
    }
  }
</style> 