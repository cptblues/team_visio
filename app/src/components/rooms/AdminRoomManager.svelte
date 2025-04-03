<script>
  import { onMount, onDestroy } from 'svelte';
  import { isAdmin, isLoggedIn, authLoading } from '../../stores/userStore';
  import { 
    COLLECTIONS, 
    subscribeToCollection
  } from '../../lib/firebase/firestore';
  import { 
    createRoom, 
    updateRoom, 
    deleteRoom 
  } from '../../lib/firebase/rooms';
  
  // État des salles
  let rooms = [];
  let loading = true;
  let error = null;
  let unsubscribe;
  
  // État du formulaire d'édition
  let editing = false;
  let currentRoom = null;
  let showConfirmDelete = false;
  
  // Valeurs du formulaire
  let name = '';
  let description = '';
  let capacity = 10;
  let isPublic = true;
  let formLoading = false;
  let formSuccess = false;
  let formErrorMessage = '';
  let formSuccessMessage = '';
  let formError = null;
  
  onMount(() => {
    // S'abonner aux changements dans la collection ROOMS
    try {
      unsubscribe = subscribeToCollection(
        COLLECTIONS.ROOMS,
        (roomsData) => {
          // Traiter les données et mettre à jour la liste
          rooms = roomsData;
          loading = false;
        }
      );
    } catch (err) {
      console.error('Erreur lors de l\'abonnement à la collection des salles:', err);
      error = `Erreur lors du chargement des salles: ${err.message}`;
      loading = false;
    }
  });
  
  onDestroy(() => {
    // Se désabonner lors de la destruction du composant
    if (unsubscribe) {
      unsubscribe();
    }
  });
  
  // Réinitialiser le formulaire
  function resetForm() {
    name = '';
    description = '';
    capacity = 10;
    isPublic = true;
    editing = false;
    currentRoom = null;
    showConfirmDelete = false;
    formError = null;
    formSuccess = false;
    formSuccessMessage = '';
  }
  
  // Ouvrir le formulaire pour éditer une salle
  function editRoom(room) {
    currentRoom = room;
    name = room.name;
    description = room.description || '';
    capacity = room.capacity || 10;
    isPublic = room.isPublic;
    editing = true;
    showConfirmDelete = false;
    formError = null;
    formSuccess = false;
  }
  
  // Traiter le formulaire de création/édition
  async function handleSubmit() {
    // Validation basique
    if (!name.trim()) {
      formError = 'Le nom de la salle est requis';
      return;
    }
    
    formLoading = true;
    formError = null;
    formSuccess = false;
    formSuccessMessage = '';
    
    try {
      const roomData = {
        name: name.trim(),
        description: description.trim(),
        capacity: capacity > 0 ? capacity : null,
        isPublic
      };
      
      if (editing && currentRoom) {
        // Mettre à jour une salle existante
        await updateRoom(currentRoom.id, roomData);
        formSuccess = true;
        formSuccessMessage = 'Salle mise à jour avec succès';
      } else {
        // Créer une nouvelle salle
        await createRoom(roomData);
        formSuccess = true;
        formSuccessMessage = 'Salle créée avec succès';
        resetForm();
      }
      
      // Réinitialiser le message de succès après un délai
      setTimeout(() => {
        formSuccess = false;
      }, 3000);
    } catch (err) {
      console.error('Erreur lors de la sauvegarde de la salle:', err);
      formError = `Erreur: ${err.message}`;
    } finally {
      formLoading = false;
    }
  }
  
  // Supprimer une salle après confirmation
  async function confirmDeleteRoom() {
    if (!currentRoom) return;
    
    formLoading = true;
    formError = null;
    
    try {
      await deleteRoom(currentRoom.id);
      formSuccess = true;
      formSuccessMessage = 'Salle supprimée avec succès';
      resetForm();
      
      // Réinitialiser le message de succès après un délai
      setTimeout(() => {
        formSuccess = false;
      }, 3000);
    } catch (err) {
      console.error('Erreur lors de la suppression de la salle:', err);
      formError = `Erreur: ${err.message}`;
    } finally {
      formLoading = false;
      showConfirmDelete = false;
    }
  }
  
  // Annuler la suppression
  function cancelDelete() {
    showConfirmDelete = false;
  }
  
  // Demander confirmation avant suppression
  function promptDeleteRoom() {
    showConfirmDelete = true;
  }
  
  function formatDate(date) {
    if (!date) return 'Date inconnue';
    
    // Si c'est un timestamp Firestore, le convertir en Date
    const dateObj = date && date.toDate ? date.toDate() : new Date(date);
    
    return new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(dateObj);
  }
</script>

<section class="admin-room-manager">
  <div class="admin-header">
    <h2>Gestion des salles (Admin)</h2>
    <p class="subtitle">Créez, modifiez ou supprimez des salles</p>
  </div>
  
  {#if !$isLoggedIn || $authLoading}
    <div class="loading-state">
      <div class="loading-spinner"></div>
      <p>Chargement de l'authentification...</p>
    </div>
  {:else if !$isAdmin}
    <div class="error-message">
      <p>Cette section est réservée aux administrateurs.</p>
    </div>
  {:else if loading}
    <div class="loading-state">
      <div class="loading-spinner"></div>
      <p>Chargement des salles...</p>
    </div>
  {:else if error}
    <div class="error-message">
      <p>{error}</p>
      <button class="btn btn-primary" on:click={() => window.location.reload()}>Réessayer</button>
    </div>
  {:else}
    <!-- Formulaire de création/édition de salle -->
    <div class="admin-form-container">
      <h3>{editing ? 'Modifier la salle' : 'Créer une nouvelle salle'}</h3>
      
      {#if formError}
        <div class="error-message">
          <p>{formError}</p>
        </div>
      {/if}
      
      {#if formSuccess}
        <div class="success-message">
          <p>{formSuccessMessage}</p>
        </div>
      {/if}
      
      {#if showConfirmDelete}
        <div class="confirm-delete">
          <p>Êtes-vous sûr de vouloir supprimer cette salle ?</p>
          <div class="form-actions">
            <button 
              type="button" 
              class="btn btn-secondary" 
              on:click={cancelDelete}
              disabled={formLoading}
            >
              Annuler
            </button>
            <button 
              type="button" 
              class="btn btn-danger"
              on:click={confirmDeleteRoom}
              disabled={formLoading}
            >
              {formLoading ? 'Suppression en cours...' : 'Supprimer définitivement'}
            </button>
          </div>
        </div>
      {:else}
        <form on:submit|preventDefault={handleSubmit} class="admin-form">
          <div class="form-group">
            <label for="room-name">Nom de la salle*</label>
            <input 
              type="text" 
              id="room-name" 
              bind:value={name} 
              placeholder="Entrez le nom de la salle"
              required
              disabled={formLoading}
            />
          </div>
          
          <div class="form-group">
            <label for="room-description">Description</label>
            <textarea 
              id="room-description" 
              bind:value={description} 
              placeholder="Décrivez l'objectif de cette salle"
              rows="3"
              disabled={formLoading}
            ></textarea>
          </div>
          
          <div class="form-group">
            <label for="room-capacity">Capacité (nombre max. de participants)</label>
            <input 
              type="number" 
              id="room-capacity" 
              bind:value={capacity} 
              min="0"
              disabled={formLoading}
            />
            <small>Laissez 0 pour une capacité illimitée</small>
          </div>
          
          <div class="form-group checkbox-group">
            <label>
              <input 
                type="checkbox" 
                bind:checked={isPublic} 
                disabled={formLoading}
              />
              Salle publique (accessible à tous)
            </label>
            <small>Si désactivé, seuls les utilisateurs invités pourront rejoindre la salle</small>
          </div>
          
          <div class="form-actions">
            {#if editing}
              <button 
                type="button" 
                class="btn btn-danger" 
                on:click={promptDeleteRoom}
                disabled={formLoading}
              >
                Supprimer
              </button>
            {/if}
            
            <button 
              type="button" 
              class="btn btn-secondary" 
              on:click={resetForm}
              disabled={formLoading}
            >
              {editing ? 'Annuler' : 'Réinitialiser'}
            </button>
            
            <button 
              type="submit" 
              class="btn btn-primary"
              disabled={formLoading || !name.trim()}
            >
              {formLoading 
                ? (editing ? 'Mise à jour...' : 'Création...') 
                : (editing ? 'Mettre à jour' : 'Créer')}
            </button>
          </div>
        </form>
      {/if}
    </div>
    
    <!-- Liste des salles existantes -->
    <div class="admin-rooms-list">
      <h3>Salles existantes ({rooms.length})</h3>
      
      {#if rooms.length === 0}
        <div class="empty-state">
          <p>Aucune salle n'a encore été créée.</p>
        </div>
      {:else}
        <div class="admin-room-table-container">
          <table class="admin-room-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Statut</th>
                <th>Capacité</th>
                <th>Créée le</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {#each rooms as room (room.id)}
                <tr>
                  <td>
                    <div class="room-name-cell">
                      <span class="room-name">{room.name}</span>
                      {#if room.description}
                        <span class="room-description">{room.description}</span>
                      {/if}
                    </div>
                  </td>
                  <td>
                    <span class="room-badge {room.isPublic ? 'public-badge' : 'private-badge'}">
                      {room.isPublic ? 'Public' : 'Privé'}
                    </span>
                  </td>
                  <td>{room.capacity || '∞'}</td>
                  <td>{formatDate(room.createdAt)}</td>
                  <td>
                    <button 
                      class="btn btn-small btn-primary" 
                      on:click={() => editRoom(room)}
                    >
                      Modifier
                    </button>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </div>
  {/if}
</section>

<style>
  .admin-room-manager {
    padding: 1rem 0;
  }
  
  .admin-header {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .admin-header h2 {
    color: var(--primary);
    margin-bottom: 0.5rem;
  }
  
  .subtitle {
    color: var(--foreground-alt);
    font-size: 1.1rem;
  }
  
  .admin-form-container {
    background-color: var(--background);
    border-radius: 0.5rem;
    padding: 1.5rem;
    margin-bottom: 2rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
  
  .admin-form-container h3 {
    color: var(--primary);
    margin-top: 0;
    margin-bottom: 1.5rem;
  }
  
  .admin-form {
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
  
  .admin-rooms-list {
    margin-top: 2rem;
  }
  
  .admin-rooms-list h3 {
    color: var(--primary);
    margin-bottom: 1rem;
  }
  
  .admin-room-table-container {
    overflow-x: auto;
  }
  
  .admin-room-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;
  }
  
  .admin-room-table th,
  .admin-room-table td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid var(--border);
  }
  
  .admin-room-table th {
    font-weight: 600;
    color: var(--foreground);
    background-color: var(--background-alt);
  }
  
  .room-name-cell {
    display: flex;
    flex-direction: column;
  }
  
  .room-name {
    font-weight: 500;
  }
  
  .room-description {
    font-size: 0.8rem;
    color: var(--foreground-alt);
    max-width: 20rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .room-badge {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-weight: 500;
  }
  
  .public-badge {
    background-color: var(--success-light);
    color: var(--success-dark);
  }
  
  .private-badge {
    background-color: var(--warning-light);
    color: var(--warning-dark);
  }
  
  .btn-small {
    font-size: 0.8rem;
    padding: 0.25rem 0.5rem;
  }
  
  .btn-danger {
    background-color: var(--error);
    color: white;
  }
  
  .btn-danger:hover {
    background-color: var(--error-dark);
  }
  
  .confirm-delete {
    background-color: var(--error-light);
    border-left: 4px solid var(--error);
    padding: 1rem;
    border-radius: 0.25rem;
    margin-bottom: 1rem;
  }
  
  .confirm-delete p {
    margin-bottom: 1rem;
    font-weight: 500;
    color: var(--error-dark);
  }
  
  .loading-state, .empty-state {
    text-align: center;
    padding: 3rem;
    background-color: var(--background-alt);
    border-radius: 0.5rem;
    color: var(--foreground-alt);
  }
  
  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid var(--primary-light);
    border-top: 4px solid var(--primary);
    border-radius: 50%;
    margin: 0 auto 1rem;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
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