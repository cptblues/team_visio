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
  import ConfirmModal from '../ui/ConfirmModal.svelte';
  import { toasts } from '../../stores/toastStore';
  
  // État des salles
  let rooms = [];
  let loading = true;
  let error = null;
  let unsubscribe;
  
  // État du formulaire d'édition
  let editing = false;
  let currentRoom = null;
  let showConfirmDelete = false;
  let showEditPanel = false;
  
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
    showEditPanel = false;
    formError = null;
    formSuccess = false;
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
    showEditPanel = true;
    formError = null;
    formSuccess = false;
  }
  
  // Fermer le volet d'édition
  function closeEditPanel() {
    showEditPanel = false;
    resetForm();
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
        // Afficher un toast de succès
        toasts.success('Salle mise à jour avec succès');
        closeEditPanel();
      } else {
        // Créer une nouvelle salle
        await createRoom(roomData);
        formSuccess = true;
        formSuccessMessage = 'Salle créée avec succès';
        // Afficher un toast de succès
        toasts.success('Salle créée avec succès');
        resetForm();
      }
      
      // Réinitialiser le message de succès après un délai
      setTimeout(() => {
        formSuccess = false;
      }, 3000);
    } catch (err) {
      console.error('Erreur lors de la sauvegarde de la salle:', err);
      formError = `Erreur: ${err.message}`;
      // Afficher un toast d'erreur
      toasts.error(`Erreur: ${err.message}`);
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
      // Afficher un toast de succès
      toasts.success(`La salle "${currentRoom.name}" a été supprimée avec succès`);
      resetForm();
      
    } catch (err) {
      console.error('Erreur lors de la suppression de la salle:', err);
      formError = `Erreur: ${err.message}`;
      // Afficher un toast d'erreur
      toasts.error(`Erreur lors de la suppression: ${err.message}`);
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
  function promptDeleteRoom(room) {
    currentRoom = room;
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
  {/if}

  <!-- Volet d'édition des salles -->
  <div class="edit-panel {showEditPanel ? 'edit-panel-open' : ''}" aria-hidden={!showEditPanel}>
    <div class="edit-panel-header">
      <h3>{editing ? 'Modifier la salle' : 'Créer une salle'}</h3>
      <button class="btn-close" on:click={closeEditPanel} aria-label="Fermer">×</button>
    </div>
    <div class="edit-panel-content">
      {#if formError}
        <div class="error-message">
          <p>{formError}</p>
        </div>
      {/if}
      
      <form class="edit-form" on:submit|preventDefault={handleSubmit}>
        <div class="form-group">
          <label for="room-name">Nom de la salle*</label>
          <input 
            type="text" 
            id="room-name" 
            bind:value={name} 
            placeholder="Nom de la salle"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="room-description">Description</label>
          <textarea 
            id="room-description" 
            bind:value={description} 
            placeholder="Description de la salle (optionnel)"
            rows="3"
          ></textarea>
        </div>
        
        <div class="form-group">
          <label for="room-capacity">Capacité (0 = illimité)</label>
          <input 
            type="number" 
            id="room-capacity" 
            bind:value={capacity} 
            min="0" 
            max="100"
          />
        </div>
        
        <div class="form-group checkbox-group">
          <label>
            <input type="checkbox" bind:checked={isPublic} />
            Salle publique
          </label>
          <small>Les salles publiques sont visibles par tous les utilisateurs</small>
        </div>
        
        <div class="form-actions">
          <button 
            type="button" 
            class="btn btn-secondary" 
            on:click={closeEditPanel}
            disabled={formLoading}
          >
            Annuler
          </button>
          <button 
            type="submit" 
            class="btn btn-primary" 
            disabled={formLoading}
          >
            {formLoading ? 'Chargement...' : (editing ? 'Mettre à jour' : 'Créer')}
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Liste des salles existantes -->
  <div class="admin-rooms-list">
    <div class="admin-rooms-header">
      <h3>Salles existantes ({rooms.length})</h3>
      <button class="btn btn-primary" on:click={() => { editing = false; showEditPanel = true; }}>
        Créer une salle
      </button>
    </div>
    
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
                  <button 
                    class="btn btn-small btn-danger" 
                    on:click={() => promptDeleteRoom(room)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>

  <!-- Modale de confirmation de suppression -->
  <ConfirmModal
    isOpen={showConfirmDelete}
    title="Confirmer la suppression"
    message={currentRoom ? `Êtes-vous sûr de vouloir supprimer la salle "${currentRoom.name}" ? Cette action est irréversible.` : 'Êtes-vous sûr de vouloir supprimer cette salle ?'}
    confirmText="Supprimer"
    cancelText="Annuler"
    confirmButtonClass="btn-danger"
    onConfirm={confirmDeleteRoom}
    onCancel={cancelDelete}
  />
  
  <!-- Overlay pour le volet d'édition -->
  {#if showEditPanel}
    <div 
      class="edit-panel-overlay" 
      on:click={closeEditPanel}
      on:keydown={(e) => e.key === 'Escape' && closeEditPanel()}
      role="button"
      tabindex="0"
      aria-label="Fermer le volet d'édition"
    ></div>
  {/if}
</section>

<style>
  .admin-room-manager {
    padding: 1rem 0;
    position: relative;
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
  
  .admin-rooms-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .admin-rooms-header h3 {
    margin: 0;
  }
  
  /* Volet d'édition */
  .edit-panel {
    position: fixed;
    top: 0;
    right: -450px;
    width: 450px;
    height: 100vh;
    background-color: var(--background);
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    transition: right 0.3s ease;
    overflow-y: auto;
  }
  
  .edit-panel-open {
    right: 0;
  }
  
  .edit-panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--border);
  }
  
  .edit-panel-header h3 {
    margin: 0;
    color: var(--primary);
  }
  
  .btn-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--foreground-alt);
    line-height: 1;
    padding: 0;
  }
  
  .btn-close:hover {
    color: var(--foreground);
  }
  
  .edit-panel-content {
    padding: 1.5rem;
  }
  
  .edit-panel-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 999;
  }
  
  .edit-form {
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
  
  .admin-room-table-container {
    overflow-x: auto;
    margin-top: 1rem;
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
  
  @media (max-width: 768px) {
    .edit-panel {
      width: 100%;
      right: -100%;
    }
  }
</style> 