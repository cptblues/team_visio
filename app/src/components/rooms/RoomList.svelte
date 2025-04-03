<script>
  import { onMount, onDestroy } from 'svelte';
  import { isLoggedIn } from '../../stores/userStore';
  import { 
    COLLECTIONS, 
    subscribeToCollection, 
    addDocument 
  } from '../../lib/firebase/firestore';
  
  let rooms = [];
  let loading = true;
  let error = null;
  let unsubscribe;
  
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
  
  function formatDate(date) {
    if (!date) return 'Date inconnue';
    
    // Si c'est un timestamp Firestore, le convertir en Date
    const dateObj = date && date.toDate ? date.toDate() : new Date(date);
    
    return new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(dateObj);
  }
  
  function handleRoomClick(room) {
    if (!$isLoggedIn && !room.isPublic) {
      alert('Vous devez être connecté pour accéder à cette salle privée.');
      return;
    }
    
    // Pour l'instant, on affiche juste une alerte
    // Dans l'étape 11, cela sera remplacé par une navigation vers la page de la salle
    alert(`Vous rejoignez la salle : ${room.name}`);
  }
</script>

<section class="room-list-section">
  <div class="room-list-header">
    <h2>Salles disponibles</h2>
    <p class="subtitle">Rejoignez une salle existante pour commencer une visioconférence</p>
  </div>
  
  {#if loading}
    <div class="loading-state">
      <div class="loading-spinner"></div>
      <p>Chargement des salles...</p>
    </div>
  {:else if error}
    <div class="error-state">
      <p>{error}</p>
      <button class="btn btn-primary" on:click={() => window.location.reload()}>Réessayer</button>
    </div>
  {:else if rooms.length === 0}
    <div class="empty-state">
      <p>Aucune salle disponible pour le moment.</p>
      <p>Créez une nouvelle salle pour commencer.</p>
    </div>
  {:else}
    <div class="room-grid">
      {#each rooms as room (room.id)}
        <div 
          class="room-card {room.isPublic ? 'public' : 'private'}" 
          on:click={() => handleRoomClick(room)}
          role="button"
          tabindex="0"
          on:keydown={(e) => e.key === 'Enter' && handleRoomClick(room)}
        >
          <div class="room-header">
            <h3>{room.name}</h3>
            <span class="room-badge {room.isPublic ? 'public-badge' : 'private-badge'}">
              {room.isPublic ? 'Public' : 'Privé'}
            </span>
          </div>
          <p class="room-description">{room.description || 'Aucune description'}</p>
          <div class="room-details">
            <span class="room-capacity">
              <i class="icon-users"></i> {room.capacity || '∞'} participants max
            </span>
            <span class="room-created">
              Créée le {formatDate(room.createdAt)}
            </span>
          </div>
          <div class="room-footer">
            <button class="btn btn-primary btn-join">Rejoindre</button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</section>

<style>
  .room-list-section {
    padding: 2rem 0;
  }
  
  .room-list-header {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .room-list-header h2 {
    color: var(--primary);
    margin-bottom: 0.5rem;
  }
  
  .subtitle {
    color: var(--foreground-alt);
    font-size: 1.1rem;
  }
  
  .loading-state, .empty-state, .error-state {
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
  
  .error-state {
    border-left: 4px solid var(--error);
    background-color: var(--error-light);
    color: var(--error-dark);
    text-align: left;
  }
  
  .error-state button {
    margin-top: 1rem;
  }
  
  .room-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }
  
  .room-card {
    background-color: var(--background);
    border-radius: 0.5rem;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    cursor: pointer;
    display: flex;
    flex-direction: column;
  }
  
  .room-card:hover, .room-card:focus {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    outline: none;
  }
  
  .room-card.public {
    border-left: 4px solid var(--success);
  }
  
  .room-card.private {
    border-left: 4px solid var(--warning);
  }
  
  .room-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.75rem;
  }
  
  .room-header h3 {
    font-size: 1.25rem;
    margin: 0;
    color: var(--foreground);
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
  
  .room-description {
    color: var(--foreground-alt);
    font-size: 0.9rem;
    margin-bottom: 1rem;
    flex-grow: 1;
  }
  
  .room-details {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    font-size: 0.8rem;
    color: var(--foreground-alt);
    margin-bottom: 1rem;
  }
  
  .room-footer {
    display: flex;
    justify-content: flex-end;
  }
  
  .btn-join {
    font-size: 0.9rem;
    padding: 0.4rem 1rem;
  }
  
  @media (max-width: 768px) {
    .room-grid {
      grid-template-columns: 1fr;
    }
  }
  
  /* Icônes temporaires (à remplacer par de vraies icônes) */
  .icon-users:before {
    content: "👤";
    margin-right: 0.25rem;
  }
</style> 