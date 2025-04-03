<script>
  import { createRoom } from '../../lib/firebase/rooms';
  import { isLoggedIn, authLoading } from '../../stores/userStore';
  
  let name = '';
  let description = '';
  let capacity = 10;
  let isPublic = true;
  let loading = false;
  let error = null;
  let success = false;
  
  const resetForm = () => {
    name = '';
    description = '';
    capacity = 10;
    isPublic = true;
    error = null;
    success = false;
  };
  
  const handleSubmit = async () => {
    // Validation basique
    if (!name.trim()) {
      error = 'Le nom de la salle est requis';
      return;
    }
    
    loading = true;
    error = null;
    success = false;
    
    try {
      // Préparer les données de la salle
      const roomData = {
        name: name.trim(),
        description: description.trim(),
        capacity: capacity > 0 ? capacity : null,
        isPublic
      };
      
      // Créer la salle dans Firestore
      await createRoom(roomData);
      
      // Réinitialiser le formulaire après succès
      resetForm();
      success = true;
      
      // Réinitialiser le message de succès après 3 secondes
      setTimeout(() => {
        success = false;
      }, 3000);
    } catch (err) {
      console.error('Erreur lors de la création de la salle:', err);
      error = `Erreur: ${err.message}`;
    } finally {
      loading = false;
    }
  };
</script>

<div class="add-room-form-container">
  <h3>Créer une nouvelle salle</h3>
  
  {#if !$isLoggedIn}
    <div class="info-message">
      <p>Vous devez être connecté pour créer une salle.</p>
    </div>
  {:else if $authLoading}
    <div class="loading-state">
      <div class="loading-spinner"></div>
      <p>Chargement...</p>
    </div>
  {:else}
    <form on:submit|preventDefault={handleSubmit} class="add-room-form">
      {#if error}
        <div class="error-message">
          <p>{error}</p>
        </div>
      {/if}
      
      {#if success}
        <div class="success-message">
          <p>Salle créée avec succès!</p>
        </div>
      {/if}
      
      <div class="form-group">
        <label for="room-name">Nom de la salle*</label>
        <input 
          type="text" 
          id="room-name" 
          bind:value={name} 
          placeholder="Entrez le nom de la salle"
          required
          disabled={loading}
        />
      </div>
      
      <div class="form-group">
        <label for="room-description">Description</label>
        <textarea 
          id="room-description" 
          bind:value={description} 
          placeholder="Décrivez l'objectif de cette salle"
          rows="3"
          disabled={loading}
        ></textarea>
      </div>
      
      <div class="form-group">
        <label for="room-capacity">Capacité (nombre max. de participants)</label>
        <input 
          type="number" 
          id="room-capacity" 
          bind:value={capacity} 
          min="1"
          disabled={loading}
        />
        <small>Laissez 0 pour une capacité illimitée</small>
      </div>
      
      <div class="form-group checkbox-group">
        <label>
          <input 
            type="checkbox" 
            bind:checked={isPublic} 
            disabled={loading}
          />
          Salle publique (accessible à tous)
        </label>
        <small>Si désactivé, seuls les utilisateurs invités pourront rejoindre la salle</small>
      </div>
      
      <div class="form-actions">
        <button 
          type="button" 
          class="btn btn-secondary" 
          on:click={resetForm}
          disabled={loading}
        >
          Réinitialiser
        </button>
        <button 
          type="submit" 
          class="btn btn-primary"
          disabled={loading || !name.trim()}
        >
          {loading ? 'Création en cours...' : 'Créer la salle'}
        </button>
      </div>
    </form>
  {/if}
</div>

<style>
  .add-room-form-container {
    background-color: var(--background);
    border-radius: 0.5rem;
    padding: 1.5rem;
    margin-bottom: 2rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
  
  h3 {
    color: var(--primary);
    margin-top: 0;
    margin-bottom: 1.5rem;
  }
  
  .add-room-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .form-group label {
    font-weight: 500;
    color: var(--foreground);
  }
  
  .form-group small {
    font-size: 0.8rem;
    color: var(--foreground-alt);
  }
  
  .checkbox-group {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .checkbox-group label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }
  
  input[type="text"],
  input[type="number"],
  textarea {
    padding: 0.75rem;
    border: 1px solid var(--border);
    border-radius: 0.25rem;
    background-color: var(--background);
    color: var(--foreground);
    font-family: inherit;
    transition: border-color 0.2s;
  }
  
  input[type="text"]:focus,
  input[type="number"]:focus,
  textarea:focus {
    border-color: var(--primary);
    outline: none;
  }
  
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1rem;
  }
  
  .error-message {
    padding: 0.75rem;
    background-color: var(--error-light);
    color: var(--error-dark);
    border-radius: 0.25rem;
    border-left: 3px solid var(--error);
  }
  
  .success-message {
    padding: 0.75rem;
    background-color: var(--success-light);
    color: var(--success-dark);
    border-radius: 0.25rem;
    border-left: 3px solid var(--success);
  }
  
  .info-message {
    padding: 0.75rem;
    background-color: var(--info-light);
    color: var(--info-dark);
    border-radius: 0.25rem;
    border-left: 3px solid var(--info);
  }
  
  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.5rem;
  }
  
  .loading-spinner {
    width: 30px;
    height: 30px;
    border: 3px solid var(--primary-light);
    border-top: 3px solid var(--primary);
    border-radius: 50%;
    margin-bottom: 0.75rem;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style> 