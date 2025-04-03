<script>
  import { onMount } from 'svelte';
  import { makeSelfAdmin } from '../../lib/firebase/admin';
  import { isAdmin, currentUser } from '../../stores/userStore';
  
  let loading = false;
  let success = false;
  let error = null;
  
  async function handleMakeAdmin() {
    if (!$currentUser) {
      error = "Vous devez être connecté pour devenir administrateur";
      return;
    }
    
    try {
      loading = true;
      error = null;
      success = false;
      
      const result = await makeSelfAdmin();
      
      if (result.success) {
        success = true;
        // On affiche un message de succès mais on rappelle à l'utilisateur qu'il doit se reconnecter
      }
    } catch (err) {
      console.error("Erreur lors de la promotion en administrateur:", err);
      error = err.message || "Une erreur est survenue";
    } finally {
      loading = false;
    }
  }
</script>

<div class="make-admin-container">
  <h3>Devenir administrateur</h3>
  
  {#if $isAdmin}
    <div class="success-message">
      <p>Vous êtes déjà administrateur.</p>
    </div>
  {:else if !$currentUser}
    <div class="error-message">
      <p>Vous devez être connecté pour utiliser cette fonction.</p>
    </div>
  {:else}
    {#if error}
      <div class="error-message">
        <p>{error}</p>
      </div>
    {/if}
    
    {#if success}
      <div class="success-message">
        <p>Vous êtes maintenant administrateur! Veuillez vous reconnecter pour que les changements prennent effet.</p>
        <button class="btn btn-primary" on:click={() => window.location.reload()}>
          Rafraîchir la page
        </button>
      </div>
    {:else}
      <p class="info-text">
        Cette fonction est disponible uniquement en mode développement et vous permet de 
        transformer votre compte en compte administrateur pour tester les fonctionnalités réservées.
      </p>
      
      <button 
        class="btn btn-primary" 
        on:click={handleMakeAdmin} 
        disabled={loading}
      >
        {loading ? 'Traitement en cours...' : 'Devenir administrateur'}
      </button>
    {/if}
  {/if}
</div>

<style>
  .make-admin-container {
    background-color: var(--background-alt);
    border-radius: 0.5rem;
    padding: 1.5rem;
    margin: 1rem 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
  
  h3 {
    color: var(--primary);
    margin-top: 0;
    margin-bottom: 1rem;
  }
  
  .info-text {
    margin-bottom: 1.5rem;
    color: var(--foreground-alt);
    font-size: 0.9rem;
  }
  
  .error-message {
    padding: 0.75rem;
    background-color: var(--error-light);
    color: var(--error-dark);
    border-radius: 0.25rem;
    border-left: 3px solid var(--error);
    margin-bottom: 1rem;
  }
  
  .success-message {
    padding: 0.75rem;
    background-color: var(--success-light);
    color: var(--success-dark);
    border-radius: 0.25rem;
    border-left: 3px solid var(--success);
    margin-bottom: 1rem;
  }
</style> 