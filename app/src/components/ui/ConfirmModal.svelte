<script>
  export let isOpen = false;
  export let title = "Confirmation";
  export let message = "Êtes-vous sûr de vouloir effectuer cette action ?";
  export let confirmText = "Confirmer";
  export let cancelText = "Annuler";
  export let confirmButtonClass = "btn-danger";
  export let onConfirm = () => {};
  export let onCancel = () => {};
  
  // Fermer la modale en cas d'appui sur Echap ou clic en dehors
  function handleKeydown(event) {
    if (event.key === 'Escape' && isOpen) {
      onCancel();
    }
  }
  
  function handleBackdropClick(event) {
    // Vérifier que le clic est bien sur le backdrop et non sur le contenu
    if (event.target === event.currentTarget && isOpen) {
      onCancel();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
  <div 
    class="modal-backdrop" 
    on:click={handleBackdropClick}
    on:keydown={event => {
      if (event.key === 'Enter' || event.key === ' ') {
        handleBackdropClick(event);
      }
    }}
    role="presentation"
  >
    <div class="modal-container" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="modal-header">
        <h3 id="modal-title">{title}</h3>
        <button 
          class="modal-close" 
          on:click={onCancel} 
          aria-label="Fermer la fenêtre de dialogue"
        >&times;</button>
      </div>
      
      <div class="modal-body">
        <p>{message}</p>
      </div>
      
      <div class="modal-footer">
        <button class="btn btn-secondary" on:click={onCancel}>{cancelText}</button>
        <button class="btn {confirmButtonClass}" on:click={onConfirm}>{confirmText}</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fade-in 0.2s ease;
  }
  
  .modal-container {
    background-color: var(--background);
    border-radius: var(--radius-md);
    width: 100%;
    max-width: 450px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    animation: slide-up 0.3s ease;
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--border);
  }
  
  .modal-header h3 {
    margin: 0;
    font-size: 1.25rem;
    color: var(--foreground);
  }
  
  .modal-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--foreground-alt);
    line-height: 1;
    padding: 0;
  }
  
  .modal-close:hover {
    color: var(--foreground);
  }
  
  .modal-body {
    padding: 1.5rem;
  }
  
  .modal-body p {
    margin: 0;
    color: var(--foreground);
    line-height: 1.5;
  }
  
  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    padding: 1rem 1.5rem;
    border-top: 1px solid var(--border);
  }
  
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slide-up {
    from { 
      opacity: 0;
      transform: translateY(20px); 
    }
    to { 
      opacity: 1;
      transform: translateY(0); 
    }
  }
</style> 