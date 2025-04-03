<script>
  import { onMount, onDestroy } from 'svelte';
  import { 
    initJitsiMeet, 
    disposeJitsiMeet, 
    isJitsiActive 
  } from '../../lib/jitsi';
  import { currentUser } from '../../stores/userStore';
  import { joinRoom, leaveRoom } from '../../lib/firebase/rooms';
  
  // Props
  /** @type {string} */
  export let roomId;
  
  /** @type {boolean} */
  export let autoJoin = true;
  
  // État local
  let jitsiContainer;
  let isLoading = true;
  let hasError = false;
  let errorMessage = '';
  let isJoined = false;
  let participants = [];
  
  // Initialiser Jitsi Meet quand le composant est monté
  onMount(async () => {
    try {
      isLoading = true;
      hasError = false;
      
      // Si l'option autoJoin est activée, rejoindre la salle dans Firebase
      if (autoJoin && $currentUser) {
        try {
          await joinRoom(roomId);
          console.log(`Rejoindre la salle Firebase: ${roomId}`);
        } catch (error) {
          console.warn(`Impossible de rejoindre la salle Firebase: ${error.message}`);
          // On continue même si on ne peut pas rejoindre la salle dans Firebase
        }
      }
      
      // Attendre que le conteneur soit prêt
      await initializeJitsiMeet();
      
      isJoined = true;
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de Jitsi Meet:', error);
      hasError = true;
      errorMessage = error.message || 'Erreur lors de l\'initialisation de la visioconférence';
    } finally {
      isLoading = false;
    }
  });
  
  // Nettoyer quand le composant est détruit
  onDestroy(async () => {
    // Quitter la salle Jitsi Meet
    if (isJitsiActive()) {
      disposeJitsiMeet();
    }
    
    // Quitter la salle dans Firebase
    if (isJoined && $currentUser) {
      try {
        await leaveRoom(roomId);
        console.log(`Quitter la salle Firebase: ${roomId}`);
      } catch (error) {
        console.warn(`Impossible de quitter la salle Firebase: ${error.message}`);
      }
    }
    
    isJoined = false;
  });
  
  // Initialiser Jitsi Meet
  async function initializeJitsiMeet() {
    if (!jitsiContainer) {
      throw new Error('Le conteneur Jitsi Meet n\'est pas prêt');
    }
    
    const options = {
      parentNode: jitsiContainer,
    };
    
    // Ajouter les informations utilisateur si disponibles
    if ($currentUser) {
      options.userDisplayName = $currentUser.displayName || $currentUser.email;
      options.userEmail = $currentUser.email;
    }
    
    await initJitsiMeet(roomId, options);
  }
  
  // Rejoindre la visioconférence manuellement (si autoJoin est false)
  async function handleJoinClick() {
    try {
      isLoading = true;
      hasError = false;
      
      // Rejoindre la salle dans Firebase
      if ($currentUser) {
        await joinRoom(roomId);
      }
      
      // Initialiser Jitsi Meet
      await initializeJitsiMeet();
      
      isJoined = true;
    } catch (error) {
      console.error('Erreur lors de la connexion à la visioconférence:', error);
      hasError = true;
      errorMessage = error.message || 'Erreur lors de la connexion à la visioconférence';
    } finally {
      isLoading = false;
    }
  }
  
  // Quitter la visioconférence manuellement
  async function handleLeaveClick() {
    if (isJitsiActive()) {
      disposeJitsiMeet();
    }
    
    if ($currentUser) {
      await leaveRoom(roomId);
    }
    
    isJoined = false;
  }
</script>

<div class="jitsi-room">
  {#if isLoading}
    <div class="loading-container">
      <div class="loading-spinner"></div>
      <p>Chargement de la visioconférence...</p>
    </div>
  {:else if hasError}
    <div class="error-container">
      <div class="error-icon">⚠️</div>
      <p class="error-message">{errorMessage}</p>
      <button class="btn btn-primary" on:click={initializeJitsiMeet}>
        Réessayer
      </button>
    </div>
  {:else if !isJoined && !autoJoin}
    <div class="join-container">
      <h3>Rejoindre la visioconférence</h3>
      <p>Cliquez sur le bouton ci-dessous pour rejoindre la visioconférence.</p>
      <button class="btn btn-primary" on:click={handleJoinClick}>
        Rejoindre
      </button>
    </div>
  {:else}
    <div class="jitsi-container" bind:this={jitsiContainer}></div>
  {/if}
  
  {#if isJoined}
    <div class="controls">
      <button class="btn btn-danger" on:click={handleLeaveClick}>
        Quitter la visioconférence
      </button>
    </div>
  {/if}
</div>

<style>
  .jitsi-room {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    min-height: 500px;
  }
  
  .jitsi-container {
    flex: 1;
    overflow: hidden;
    background-color: #202124;
    border-radius: 8px;
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 500px;
  }
  
  .loading-container,
  .error-container,
  .join-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    min-height: 300px;
    padding: 2rem;
    background-color: var(--background-alt);
    border-radius: 8px;
    text-align: center;
  }
  
  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid var(--primary-light);
    border-top: 4px solid var(--primary);
    border-radius: 50%;
    margin-bottom: 1rem;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .error-icon {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  
  .error-message {
    color: var(--error);
    margin-bottom: 1rem;
  }
  
  .controls {
    display: flex;
    justify-content: center;
    padding: 1rem;
    background-color: var(--background);
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
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
  
  .btn-danger {
    background-color: var(--error);
    color: white;
  }
  
  .btn-danger:hover {
    background-color: var(--error-dark);
  }
</style> 