<script>
  import { onMount } from 'svelte';
  import { isLoggedIn } from '../../stores/userStore';
  
  // Liste statique de salles pour l'étape 7
  let rooms = [
    {
      id: 'room1',
      name: 'Salle Principale',
      description: 'Salle de réunion générale pour toute l\'équipe',
      isPublic: true,
      createdBy: 'admin',
      createdAt: new Date('2025-04-01T10:00:00'),
      capacity: 10,
      participants: []
    },
    {
      id: 'room2',
      name: 'Salle Marketing',
      description: 'Réunions et discussions pour l\'équipe marketing',
      isPublic: true,
      createdBy: 'admin',
      createdAt: new Date('2025-04-01T11:30:00'),
      capacity: 8,
      participants: []
    },
    {
      id: 'room3',
      name: 'Salle Développement',
      description: 'Espace dédié aux développeurs pour les discussions techniques',
      isPublic: true,
      createdBy: 'admin',
      createdAt: new Date('2025-04-01T14:15:00'),
      capacity: 12,
      participants: []
    },
    {
      id: 'room4',
      name: 'Salle Privée',
      description: 'Salle privée pour les réunions confidentielles',
      isPublic: false,
      createdBy: 'admin',
      createdAt: new Date('2025-04-02T09:00:00'),
      capacity: 5,
      participants: []
    }
  ];
  
  function formatDate(date) {
    return new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
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
  
  {#if rooms.length === 0}
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
          <p class="room-description">{room.description}</p>
          <div class="room-details">
            <span class="room-capacity">
              <i class="icon-users"></i> {room.capacity} participants max
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
  
  .empty-state {
    text-align: center;
    padding: 3rem;
    background-color: var(--background-alt);
    border-radius: 0.5rem;
    color: var(--foreground-alt);
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