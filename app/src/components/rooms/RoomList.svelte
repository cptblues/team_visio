<script>
  import { onMount, onDestroy } from 'svelte';
  import { isLoggedIn } from '../../stores/userStore';
  import { supabase } from '../../lib/supabase/client';
  import { push } from 'svelte-spa-router';
  
  let rooms = [];
  let loading = true;
  let error = null;
  let unsubscribe;
  
  onMount(() => {
    // S'abonner aux changements dans la table rooms
    try {
      unsubscribe = supabase
        .channel('rooms')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'rooms'
        }, (payload) => {
          // Mettre à jour la liste des salles
          const { eventType, new: newRoom, old: oldRoom } = payload;
          
          if (eventType === 'INSERT') {
            rooms = [...rooms, newRoom];
          } else if (eventType === 'DELETE') {
            rooms = rooms.filter(room => room.id !== oldRoom.id);
          } else if (eventType === 'UPDATE') {
            rooms = rooms.map(room => room.id === newRoom.id ? newRoom : room);
          }
          
          loading = false;
        })
        .subscribe();
      
      // Charger les salles initiales
      const loadInitialRooms = async () => {
        const { data, error: err } = await supabase
          .from('rooms')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (err) throw err;
        rooms = data;
        loading = false;
      };
      
      loadInitialRooms();
    } catch (err) {
      console.error('Erreur lors de l\'abonnement aux salles:', err);
      error = err.message || 'Une erreur est survenue lors du chargement des salles';
      loading = false;
    }
  });
  
  onDestroy(() => {
    // Se désabonner lors de la destruction du composant
    if (unsubscribe) {
      unsubscribe.unsubscribe();
    }
  });
  
  function formatDate(date) {
    if (!date) return 'Date inconnue';
    return new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(new Date(date));
  }
  
  function handleRoomClick(room) {
    if (!$isLoggedIn && !room.is_public) {
      alert('Vous devez être connecté pour accéder à cette salle privée.');
      return;
    }
    
    // Naviguer vers la page de la salle
    push(`/room/${room.id}`);
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
          class="room-card {room.is_public ? 'public' : 'private'}" 
          on:click={() => handleRoomClick(room)}
          role="button"
          tabindex="0"
          on:keydown={(e) => e.key === 'Enter' && handleRoomClick(room)}
        >
          <div class="room-header">
            <h3>{room.name}</h3>
            <span class="room-badge {room.is_public ? 'public-badge' : 'private-badge'}">
              {room.is_public ? 'Public' : 'Privé'}
            </span>
          </div>
          <p class="room-description">{room.description || 'Aucune description'}</p>
          <div class="room-details">
            <span class="room-capacity">
              <i class="icon-users"></i> {room.capacity || '∞'} participants max
            </span>
            <span class="room-created">
              Créée le {formatDate(room.created_at)}
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
    margin-bottom: 3rem;
  }
  
  .room-list-header h2 {
    color: var(--primary);
    margin-bottom: 0.75rem;
    font-size: 2.2rem;
    font-weight: 600;
  }
  
  .subtitle {
    color: var(--foreground-alt);
    font-size: 1.1rem;
    max-width: 600px;
    margin: 0 auto;
  }
  
  .loading-state, .empty-state, .error-state {
    text-align: center;
    padding: 3rem;
    background-color: var(--background);
    border-radius: var(--radius-lg);
    box-shadow: 0 5px 20px var(--shadow);
    margin: 2rem auto;
    max-width: 600px;
  }
  
  .loading-spinner {
    width: 50px;
    height: 50px;
    border: 4px solid var(--primary-light);
    border-top: 4px solid var(--primary);
    border-radius: 50%;
    margin: 0 auto 1.5rem;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .error-state {
    border-left: 6px solid var(--error);
    text-align: left;
    color: var(--error-dark);
    background-color: var(--error-light);
  }
  
  .error-state button {
    margin-top: 1.5rem;
  }
  
  .room-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 2rem;
  }
  
  .room-card {
    background-color: white;
    border-radius: var(--radius-lg);
    padding: 1.75rem;
    box-shadow: 0 8px 30px var(--shadow);
    transition: var(--transition);
    cursor: pointer;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
  }
  
  .room-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 8px;
    transition: var(--transition);
  }
  
  .room-card.public::before {
    background: linear-gradient(90deg, var(--success), var(--success-light));
  }
  
  .room-card.private::before {
    background: linear-gradient(90deg, var(--warning), var(--warning-light));
  }
  
  .room-card:hover, .room-card:focus {
    transform: translateY(-8px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
    outline: none;
  }
  
  .room-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1.25rem;
  }
  
  .room-header h3 {
    margin: 0;
    font-size: 1.4rem;
    color: var(--foreground);
    font-weight: 600;
    flex: 1;
  }
  
  .room-badge {
    font-size: 0.8rem;
    padding: 0.4rem 0.75rem;
    border-radius: 50px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    margin-left: 1rem;
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
    margin-bottom: 1.5rem;
    font-size: 1rem;
    line-height: 1.6;
    flex-grow: 1;
  }
  
  .room-details {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1.5rem;
    font-size: 0.9rem;
    color: var(--foreground-alt);
  }
  
  .room-capacity, .room-created {
    display: flex;
    align-items: center;
  }
  
  .room-capacity i, .room-created i {
    margin-right: 0.5rem;
    color: var(--primary);
  }
  
  .room-footer {
    margin-top: auto;
  }
  
  .btn-join {
    width: 100%;
    padding: 0.85rem;
    font-size: 1rem;
    font-weight: 600;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: var(--transition);
  }
  
  .btn-join:hover {
    transform: translateY(-3px);
  }
  
  .btn-join::after {
    content: '→';
    margin-left: 0.5rem;
    transition: var(--transition);
  }
  
  .btn-join:hover::after {
    transform: translateX(5px);
  }
  
  @media (max-width: 768px) {
    .room-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
    
    .room-card {
      padding: 1.5rem;
    }
    
    .room-details {
      flex-direction: column;
      gap: 0.75rem;
    }
  }
  
  /* Icônes temporaires (à remplacer par de vraies icônes) */
  .icon-users:before {
    content: "👤";
    margin-right: 0.25rem;
  }
</style> 