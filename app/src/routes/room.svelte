<script>
  import { onMount, onDestroy } from 'svelte';
  import { location, push } from 'svelte-spa-router';
  import { initFirebase } from '../lib/firebase';
  import { initUserStore, currentUser, isLoggedIn } from '../stores/userStore';
  import { getDocument, subscribeToDocument, COLLECTIONS } from '../lib/firebase/firestore';
  import { joinRoom, leaveRoom } from '../lib/firebase/rooms';
  import JitsiRoom from '../components/conference/JitsiRoom.svelte';
  import Header from '../components/Header.svelte';
  import UserStatusBar from '../components/UserStatusBar.svelte';
  import AuthContainer from '../components/auth/AuthContainer.svelte';
  import Footer from '../components/Footer.svelte';
  
  // Extraire l'ID de la salle depuis les paramètres d'URL
  $: roomId = $location.split('/').pop();
  
  // État local
  let room = null;
  let loading = true;
  let error = null;
  let unsubscribe = null;
  let firebaseInitialized = false;
  let showAuthSection = false;
  let participants = [];
  let isExiting = false;
  
  function toggleAuthSection() {
    showAuthSection = !showAuthSection;
  }
  
  function handleAuthSuccess() {
    showAuthSection = false;
  }
  
  onMount(async () => {
    try {
      // Initialiser Firebase
      await initFirebase();
      firebaseInitialized = true;
      
      // Initialiser le store utilisateur
      initUserStore();
      
      // S'abonner aux mises à jour de la salle
      loadRoomData();
    } catch (error) {
      console.error('Erreur lors de l\'initialisation:', error);
      setError('Erreur lors de l\'initialisation de l\'application');
    }
  });
  
  onDestroy(() => {
    // Se désabonner des mises à jour de la salle
    if (unsubscribe) {
      unsubscribe();
    }
  });
  
  function setError(message) {
    error = message;
    loading = false;
  }
  
  async function loadRoomData() {
    try {
      if (!roomId) {
        return setError('Identifiant de salle non valide');
      }
      
      loading = true;
      error = null;
      
      // S'abonner aux changements de la salle
      unsubscribe = subscribeToDocument(
        COLLECTIONS.ROOMS, 
        roomId, 
        (roomData) => {
          if (!roomData) {
            return setError('Cette salle n\'existe pas');
          }
          
          room = roomData;
          
          // Extraire les participants
          participants = room.participants || [];
          
          loading = false;
        }
      );
    } catch (err) {
      console.error('Erreur lors du chargement de la salle:', err);
      setError(`Erreur lors du chargement de la salle: ${err.message}`);
    }
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
  
  function goBack() {
    window.history.back();
  }
  
  // Fonction pour quitter la salle et revenir à l'accueil
  async function exitRoom() {
    try {
      isExiting = true;
      
      // Si l'utilisateur est connecté, mettre à jour son statut dans Firebase
      if ($isLoggedIn && $currentUser) {
        await leaveRoom(roomId);
      }
      
      // Rediriger vers la page d'accueil
      push('/');
    } catch (error) {
      console.error('Erreur lors de la sortie de la salle:', error);
    }
  }
</script>

<svelte:head>
  <title>{room ? room.name : 'Chargement...'} - Team Visio</title>
  <meta name="description" content="Rejoignez la visioconférence dans cette salle" />
</svelte:head>

<div class="room-page">
  <Header />
  
  <main>
    <!-- Barre de statut utilisateur -->
    <section class="status-section">
      <div class="container">
        <UserStatusBar />
      </div>
    </section>
    
    <!-- Section authentification -->
    {#if showAuthSection}
      <section class="auth-section">
        <div class="container">
          <AuthContainer onAuthSuccess={handleAuthSuccess} />
        </div>
      </section>
    {/if}
    
    <section class="room-section">
      <div class="container">
        <div class="room-header">
          <button class="btn btn-back" on:click={goBack}>
            &larr; Retour
          </button>
          
          <div class="header-actions">
            {#if !$isLoggedIn}
              <button class="btn btn-primary" on:click={toggleAuthSection}>
                Se connecter
              </button>
            {:else}
              <button class="btn btn-exit" on:click={exitRoom} disabled={isExiting}>
                {isExiting ? 'Sortie en cours...' : 'Quitter la salle'}
              </button>
            {/if}
          </div>
        </div>
        
        {#if loading}
          <div class="loading-container">
            <div class="loading-spinner"></div>
            <p>Chargement de la salle...</p>
          </div>
        {:else if error}
          <div class="error-container">
            <h2>Erreur</h2>
            <p>{error}</p>
            <button class="btn btn-primary" on:click={loadRoomData}>
              Réessayer
            </button>
          </div>
        {:else if room}
          <div class="room-details">
            <div class="room-info">
              <h1 class="room-title">{room.name}</h1>
              <span class="room-badge {room.isPublic ? 'public-badge' : 'private-badge'}">
                {room.isPublic ? 'Public' : 'Privé'}
              </span>
              
              {#if !room.isPublic && !$isLoggedIn}
                <div class="private-room-notice">
                  <p>Cette salle est privée. Veuillez vous connecter pour y accéder.</p>
                  <button class="btn btn-primary" on:click={toggleAuthSection}>
                    Se connecter
                  </button>
                </div>
              {:else}
                <div class="room-metadata">
                  <p class="room-description">{room.description || 'Aucune description'}</p>
                  <p class="room-created">Créée le {formatDate(room.createdAt)}</p>
                  <p class="room-capacity">
                    Capacité maximale: {room.capacity ? `${room.capacity} participants` : 'Illimitée'}
                  </p>
                </div>
                
                <div class="participants-list">
                  <h3>Participants ({participants.length})</h3>
                  {#if participants.length === 0}
                    <p>Aucun participant dans cette salle pour le moment.</p>
                  {:else}
                    <ul>
                      {#each participants as participantId}
                        <li>{participantId}</li>
                      {/each}
                    </ul>
                  {/if}
                </div>
                
                <div class="conference-container">
                  {#if !$isLoggedIn && !room.isPublic}
                    <div class="auth-notice">
                      <p>Vous devez être connecté pour rejoindre cette salle privée.</p>
                      <button class="btn btn-primary" on:click={toggleAuthSection}>
                        Se connecter
                      </button>
                    </div>
                  {:else}
                    <JitsiRoom roomId={roomId} autoJoin={true} />
                  {/if}
                </div>
              {/if}
            </div>
          </div>
        {/if}
      </div>
    </section>
  </main>
  
  <Footer />
</div>

<style>
  .room-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  main {
    flex: 1;
  }
  
  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }
  
  .status-section {
    padding: 1rem 0;
    background-color: var(--background-alt);
    text-align: center;
  }
  
  .auth-section {
    padding: 2rem 0;
    background-color: var(--background);
  }
  
  .room-section {
    padding: 2rem 0;
    background-color: var(--background-alt);
  }
  
  .room-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }
  
  .btn-back {
    background: none;
    border: none;
    color: var(--primary);
    font-size: 1rem;
    cursor: pointer;
    padding: 0.5rem 1rem;
    display: flex;
    align-items: center;
  }
  
  .btn-back:hover {
    text-decoration: underline;
  }
  
  .header-actions {
    display: flex;
    gap: 1rem;
  }
  
  .loading-container, 
  .error-container {
    text-align: center;
    padding: 3rem;
    background-color: var(--background);
    border-radius: 0.5rem;
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
  
  .error-container {
    border-left: 4px solid var(--error);
    color: var(--error);
    text-align: left;
  }
  
  .room-details {
    background-color: var(--background);
    border-radius: 0.5rem;
    padding: 2rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
  
  .room-title {
    font-size: 2rem;
    color: var(--foreground);
    margin: 0 0 1rem 0;
    display: inline-block;
    margin-right: 1rem;
  }
  
  .room-badge {
    font-size: 0.9rem;
    padding: 0.3rem 0.6rem;
    border-radius: 0.25rem;
    font-weight: 500;
    vertical-align: middle;
  }
  
  .public-badge {
    background-color: var(--success-light);
    color: var(--success-dark);
  }
  
  .private-badge {
    background-color: var(--warning-light);
    color: var(--warning-dark);
  }
  
  .room-metadata {
    margin: 1.5rem 0;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    padding: 1rem 0;
  }
  
  .room-description {
    font-size: 1.1rem;
    margin-bottom: 1rem;
    color: var(--foreground);
  }
  
  .room-created, 
  .room-capacity {
    font-size: 0.9rem;
    color: var(--foreground-alt);
    margin: 0.5rem 0;
  }
  
  .participants-list {
    margin: 1.5rem 0;
  }
  
  .participants-list h3 {
    font-size: 1.2rem;
    color: var(--foreground);
    margin-bottom: 1rem;
  }
  
  .participants-list ul {
    list-style: none;
    padding: 0;
  }
  
  .participants-list li {
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--border-light);
  }
  
  .conference-container {
    margin-top: 2rem;
    height: 600px;
    border-radius: 0.5rem;
    overflow: hidden;
  }
  
  .private-room-notice,
  .auth-notice {
    background-color: var(--warning-light);
    color: var(--warning-dark);
    padding: 1.5rem;
    border-radius: 0.5rem;
    margin: 1.5rem 0;
    text-align: center;
  }
  
  .private-room-notice p,
  .auth-notice p {
    margin-bottom: 1rem;
  }
  
  .btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.2s;
  }
  
  .btn-primary {
    background-color: var(--primary);
    color: white;
  }
  
  .btn-primary:hover {
    background-color: var(--primary-dark);
  }
  
  .btn-exit {
    background-color: var(--error);
    color: white;
  }
  
  .btn-exit:hover {
    background-color: var(--error-dark);
  }
  
  .btn-exit:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  @media (max-width: 768px) {
    .conference-container {
      height: 400px;
    }
    
    .room-title {
      font-size: 1.5rem;
    }
    
    .room-details {
      padding: 1rem;
    }
  }
</style> 