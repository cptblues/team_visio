<script>
  import { onMount, onDestroy, tick } from 'svelte';
  import { 
    initJitsiMeet, 
    disposeJitsiMeet, 
    isJitsiActive,
    setAudioMuted,
    setVideoMuted,
    toggleScreenSharing,
    toggleTileView,
    getAllParticipants,
    runJitsiDiagnostics,
    testJitsiAPI
  } from '../../lib/jitsi';
  import { currentUser, isLoggedIn } from '../../stores/userStore';
  import { joinRoom, leaveRoom } from '../../lib/firebase/rooms';
  import { getDocument, subscribeToDocument, COLLECTIONS } from '../../lib/firebase/firestore';
  import { 
    jitsiConference, 
    jitsiParticipants, 
    participantsCount,
    updateConferenceState,
    startParticipantsPolling,
    stopParticipantsPolling,
    resetJitsiStores
  } from '../../lib/stores/jitsiStore';
  
  // Props
  /** @type {string} */
  export let roomId;
  
  /** @type {boolean} */
  export let autoJoin = true;

  /** @type {boolean} */
  export let startWithAudioMuted = false;
  
  /** @type {boolean} */
  export let startWithVideoMuted = false;
  
  // État local
  let jitsiContainer;
  let isLoading = true;
  let hasError = false;
  let errorMessage = '';
  let isJoined = false;
  let firebaseParticipants = [];
  let roomData = null;
  let unsubscribe = null;
  let isJitsiAvailable = false;
  
  // États des contrôles
  let isAudioMuted = startWithAudioMuted;
  let isVideoMuted = startWithVideoMuted;
  let isScreenSharing = false;
  let isTileView = true;
  let showParticipantsList = false;
  
  // Initialiser Jitsi Meet quand le composant est monté
  onMount(async () => {
    // Attendre d'abord que le DOM soit complètement rendu
    await tick();
    
    // Vérifier la compatibilité du navigateur
    const isCompatible = checkBrowserCompatibility();
    if (!isCompatible.compatible) {
      hasError = true;
      errorMessage = `Votre navigateur pourrait ne pas être compatible avec Jitsi: ${isCompatible.message}`;
      isLoading = false;
      return;
    }
    
    // Attendre un court délai pour s'assurer que le DOM est stable
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Tester si l'API Jitsi est disponible et utilisable
    try {
      isJitsiAvailable = await testJitsiAPI();
      
      if (!isJitsiAvailable) {
        throw new Error("L'API Jitsi Meet n'est pas disponible. Vérifiez votre connexion et que le domaine Jitsi est accessible.");
      }
    } catch (apiTestError) {
      hasError = true;
      errorMessage = `Impossible d'initialiser Jitsi: ${apiTestError.message}`;
      isLoading = false;
      return;
    }
    
    // Vérifier si le conteneur est disponible après le tick
    if (!jitsiContainer) {
      hasError = true;
      errorMessage = "Erreur lors de l'initialisation: le conteneur n'est pas prêt";
      isLoading = false;
      return;
    }
    
    try {
      isLoading = true;
      hasError = false;
      
      // Charger les données de la salle depuis Firestore
      await loadRoomData();
      
      // Si l'option autoJoin est activée, rejoindre la salle dans Firebase
      if (autoJoin && $currentUser) {
        try {
          await joinRoom(roomId);
        } catch (error) {
          // On continue même si on ne peut pas rejoindre la salle dans Firebase
        }
      }
      
      if (autoJoin) {
        await initializeJitsiMeet();
        isJoined = true;
        
        // Démarrer le polling des participants via le store
        startParticipantsPolling();
        
        // Mettre à jour l'état de la conférence dans le store
        updateConferenceState({
          isActive: true,
          roomId,
          isAudioMuted,
          isVideoMuted
        });
      }
    } catch (error) {
      hasError = true;
      errorMessage = error.message || 'Erreur lors de l\'initialisation de la visioconférence';
    } finally {
      isLoading = false;
    }
  });
  
  // Nettoyer quand le composant est détruit
  onDestroy(async () => {
    // Arrêter la mise à jour des participants
    stopParticipantsPolling();
    
    // Se désabonner des mises à jour de la salle
    if (unsubscribe) {
      unsubscribe();
    }
    
    // Quitter la salle Jitsi Meet
    if (isJitsiActive()) {
      disposeJitsiMeet();
    }
    
    // Quitter la salle dans Firebase
    if (isJoined && $currentUser) {
      try {
        await leaveRoom(roomId);
      } catch (error) {
        // Ignorer les erreurs lors de la déconnexion
      }
    }
    
    // Réinitialiser les stores
    resetJitsiStores();
    
    isJoined = false;
  });
  
  // Charger les données de la salle
  async function loadRoomData() {
    try {
      // S'abonner aux changements de la salle
      unsubscribe = subscribeToDocument(
        COLLECTIONS.ROOMS,
        roomId,
        (data) => {
          if (data) {
            roomData = data;
            
            // Mettre à jour la liste des participants Firebase
            if (data.participants) {
              firebaseParticipants = data.participants;
            }
          }
        }
      );
    } catch (error) {
      // Ignorer les erreurs non critiques
    }
  }
  
  // Initialiser Jitsi Meet
  async function initializeJitsiMeet() {
    try {
      // Générer l'URL de la salle Jitsi
      const roomName = `teamvisio-${roomId}`;
      const safeRoomName = encodeURIComponent(roomName);
      
      // Créer l'URL avec les paramètres
      const jitsiDomain = import.meta.env.VITE_JITSI_DOMAIN || 'meet.jit.si';
      const jitsiBase = `https://${jitsiDomain}/${safeRoomName}`;
      
      // Construire les paramètres d'URL avec URLSearchParams pour une meilleure lisibilité
      const params = new URLSearchParams();
      
      // Paramètres de base
      if (isAudioMuted) params.append('config.startWithAudioMuted', 'true');
      if (isVideoMuted) params.append('config.startWithVideoMuted', 'true');
      
      // Paramètres d'interface
      params.append('config.prejoinPageEnabled', 'false');
      params.append('config.disableDeepLinking', 'true');
      params.append('config.disableInviteFunctions', 'true');
      params.append('config.enableWelcomePage', 'false');
      params.append('config.enableClosePage', 'false');
      
      // Information utilisateur
      if ($currentUser) {
        if ($currentUser.displayName) params.append('userInfo.displayName', $currentUser.displayName);
        if ($currentUser.email) params.append('userInfo.email', $currentUser.email);
      }
      
      // Paramètres de sécurité et de performance
      params.append('config.disableAudioLevels', 'true'); // Améliorer les performances
      params.append('config.disableSimulcast', 'true'); // Améliorer les performances
      params.append('config.channelLastN', '4'); // Limiter le nombre de flux vidéo actifs
      
      // Interface UI
      params.append('config.defaultLayout', 'tileview');
      params.append('config.hideConferenceTimer', 'false');
      params.append('config.requireDisplayName', 'false');
      params.append('config.defaultLanguage', 'fr');
      
      // URL finale
      const jitsiUrl = `${jitsiBase}?${params.toString()}`;
      
      // Vider le conteneur actuel
      if (jitsiContainer) {
        while (jitsiContainer.firstChild) {
          jitsiContainer.removeChild(jitsiContainer.firstChild);
        }
      }
      
      // Créer l'iframe directement
      const iframe = document.createElement('iframe');
      iframe.src = jitsiUrl;
      iframe.allow = 'camera; microphone; fullscreen; display-capture; autoplay; clipboard-write';
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';
      iframe.id = `jitsi-iframe-${roomId}`;
      
      // Ajouter l'iframe au conteneur
      jitsiContainer.appendChild(iframe);
      
      // Marquer comme joint
      isJoined = true;
      
      // Mettre à jour l'état de la conférence
      updateConferenceState({
        isActive: true,
        roomId,
        isAudioMuted,
        isVideoMuted
      });
      
      // Tentative d'accès à postMessage
      setupPostMessageCommunication(iframe);
      
    } catch (error) {
      hasError = true;
      errorMessage = error.message || "Erreur lors de l'initialisation de Jitsi";
      throw error;
    }
  }
  
  // Tentative de communication par postMessage (expérimental)
  function setupPostMessageCommunication(iframe) {
    try {
      // Écouter les messages de l'iframe
      window.addEventListener('message', (event) => {
        // Vérifier l'origine
        if (event.origin !== `https://${import.meta.env.VITE_JITSI_DOMAIN || 'meet.jit.si'}`) {
          return;
        }
        
        // Analyser les messages pour détecter les changements d'état
        if (event.data && event.data.type) {
          switch(event.data.type) {
            case 'audio-mute-status-changed':
              updateConferenceState({ isAudioMuted: event.data.muted });
              break;
            case 'video-mute-status-changed':
              updateConferenceState({ isVideoMuted: event.data.muted });
              break;
          }
        }
      });
    } catch (error) {
      // Ignorer les erreurs non critiques
    }
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
      
      // Attendre un bref délai pour s'assurer que tout est bien initialisé
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Initialiser Jitsi Meet
      await initializeJitsiMeet();
      
      isJoined = true;
      
      // Démarrer la mise à jour des participants via le store
      startParticipantsPolling();
      
      // Mettre à jour l'état de la conférence dans le store
      updateConferenceState({
        isActive: true,
        roomId,
        isAudioMuted,
        isVideoMuted
      });
    } catch (error) {
      hasError = true;
      errorMessage = error.message || 'Erreur lors de la connexion à la visioconférence';
    } finally {
      isLoading = false;
    }
  }
  
  // Quitter la visioconférence manuellement
  async function handleLeaveClick() {
    // Arrêter la mise à jour des participants
    stopParticipantsPolling();
    
    // Avec l'approche iframe, on supprime simplement l'iframe
    if (jitsiContainer && jitsiContainer.querySelector('iframe')) {
      jitsiContainer.removeChild(jitsiContainer.querySelector('iframe'));
    }
    
    if ($currentUser) {
      await leaveRoom(roomId);
    }
    
    // Réinitialiser les stores
    resetJitsiStores();
    
    isJoined = false;
  }
  
  // Recharger l'iframe avec de nouveaux paramètres
  function reloadJitsiIframe(newParams = {}) {
    const iframe = jitsiContainer.querySelector('iframe');
    if (!iframe) return;
    
    // Récupérer l'URL actuelle
    let currentUrl = new URL(iframe.src);
    
    // Mettre à jour les paramètres
    Object.entries(newParams).forEach(([key, value]) => {
      currentUrl.searchParams.set(key, value);
    });
    
    // Définir la nouvelle URL
    iframe.src = currentUrl.toString();
  }
  
  // Contrôles audio/vidéo (simulés par rechargement)
  function toggleAudio() {
    isAudioMuted = !isAudioMuted;
    
    // Mettre à jour le store
    updateConferenceState({ isAudioMuted });
    
    // Notifier l'utilisateur que cette fonctionnalité est limitée
    alert("Note: En utilisant l'iframe directe, les contrôles audio/vidéo ne sont disponibles qu'au sein de l'interface Jitsi.");
  }
  
  function toggleVideo() {
    isVideoMuted = !isVideoMuted;
    
    // Mettre à jour le store
    updateConferenceState({ isVideoMuted });
    
    // Notifier l'utilisateur que cette fonctionnalité est limitée
    alert("Note: En utilisant l'iframe directe, les contrôles audio/vidéo ne sont disponibles qu'au sein de l'interface Jitsi.");
  }
  
  function toggleScreenShare() {
    isScreenSharing = !isScreenSharing;
    toggleScreenSharing();
    
    // Mettre à jour le store
    updateConferenceState({ isScreenSharing });
  }
  
  function toggleTileViewMode() {
    isTileView = !isTileView;
    toggleTileView();
    
    // Mettre à jour le store
    updateConferenceState({ isTileView });
  }
  
  function toggleParticipantsList() {
    showParticipantsList = !showParticipantsList;
  }
  
  // Helper pour formater l'heure de connexion
  function formatJoinTime(date) {
    if (!date) return '';
    
    const now = new Date();
    const joinDate = new Date(date);
    // Conversion explicite en nombre pour l'opération arithmétique
    const diffMs = Number(now) - Number(joinDate);
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) {
      return 'à l\'instant';
    } else if (diffMins < 60) {
      return `il y a ${diffMins} min`;
    } else {
      const hours = joinDate.getHours().toString().padStart(2, '0');
      const mins = joinDate.getMinutes().toString().padStart(2, '0');
      return `à ${hours}:${mins}`;
    }
  }
  
  // Vérifier la compatibilité du navigateur avec WebRTC
  function checkBrowserCompatibility() {
    try {
      // Obtenir les informations du navigateur
      const userAgent = navigator.userAgent;
      const browserInfo = {
        isChrome: /Chrome/.test(userAgent) && !/Edge/.test(userAgent),
        isFirefox: /Firefox/.test(userAgent),
        isEdge: /Edg/.test(userAgent),
        isSafari: /Safari/.test(userAgent) && !/Chrome/.test(userAgent),
        isIE: /Trident/.test(userAgent) || /MSIE/.test(userAgent),
        isOpera: /OPR/.test(userAgent)
      };
      
      // Vérifier que getUserMedia est supporté
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return {
          compatible: false,
          message: "Votre navigateur ne supporte pas l'accès à la caméra et au microphone (getUserMedia)."
        };
      }
      
      // Vérifier les navigateurs connus pour être problématiques
      if (browserInfo.isIE) {
        return {
          compatible: false,
          message: "Internet Explorer n'est pas compatible avec les visioconférences WebRTC."
        };
      }
      
      return { compatible: true };
    } catch (error) {
      return { 
        compatible: true, 
        message: "Impossible de vérifier la compatibilité, mais nous allons essayer quand même."
      };
    }
  }
  
  // Afficher l'aide pour l'utilisation de Jitsi
  function showJitsiHelp() {
    alert(`Aide Jitsi Meet:
    
1. Si vous rencontrez des problèmes avec l'initialisation normale, utilisez le bouton "Utiliser l'Iframe Directe" qui charge Jitsi Meet directement.

2. En mode Iframe Directe, les contrôles audio/vidéo de notre interface ne fonctionneront pas directement. Utilisez plutôt les contrôles dans l'interface Jitsi Meet.

3. Pour une meilleure expérience:
   - Utilisez Chrome, Firefox, ou Edge
   - Autorisez l'accès à votre caméra et microphone
   - Assurez-vous d'avoir une connexion internet stable
   
4. Problèmes courants:
   - Blocage par un anti-virus ou pare-feu
   - Blocage des pop-ups
   - Mode de navigation privée
   
Si les problèmes persistent, essayez d'accéder directement à: https://meet.jit.si/`);
  }
</script>

<div class="jitsi-room">
  <!-- Le conteneur est toujours visible et accessible dans le DOM -->
  <div class="jitsi-container" bind:this={jitsiContainer}></div>
  
  <!-- Les couches d'interface utilisateur sont affichées par-dessus le conteneur Jitsi -->
  {#if isLoading}
    <div class="loading-container overlay">
      <div class="loading-spinner"></div>
      <p>Chargement de la visioconférence...</p>
    </div>
  {:else if hasError}
    <div class="error-container overlay">
      <div class="error-icon">⚠️</div>
      <p class="error-message">{errorMessage}</p>
      <div class="error-actions">
        <button class="btn btn-primary" on:click={initializeJitsiMeet}>
          Réessayer
        </button>
        
        <button class="btn btn-secondary" on:click={async () => {
          try {
            isLoading = true;
            const testResult = await testJitsiAPI();
            isJitsiAvailable = testResult;
            alert(`Test de l'API Jitsi: ${testResult ? 'SUCCÈS' : 'ÉCHEC'}\nVérifiez la console pour plus de détails.`);
          } catch (e) {
            alert(`Erreur lors du test: ${e.message}`);
          } finally {
            isLoading = false;
          }
        }}>
          Tester l'API Jitsi
        </button>
        
        <button class="btn btn-alt" on:click={() => {
          // Marquer l'API comme non disponible pour forcer l'utilisation de l'iframe
          isJitsiAvailable = false;
          // Réinitialiser l'erreur
          hasError = false;
          errorMessage = '';
          // Initialiser en mode iframe
          isLoading = true;
          initializeJitsiMeet().catch(e => {
            console.error("Erreur avec l'approche iframe:", e);
          }).finally(() => {
            isLoading = false;
          });
        }}>
          Utiliser l'Iframe Directe
        </button>
        
        <button class="btn btn-help" on:click={showJitsiHelp}>
          <i class="help-icon">?</i> Aide
        </button>
      </div>
      <p class="error-note">
        Si vous rencontrez des problèmes persistants, vous pouvez accéder directement à la conférence en visitant:<br>
        <a href={`https://${import.meta.env.VITE_JITSI_DOMAIN || 'meet.jit.si'}/teamvisio-${roomId}`} target="_blank" rel="noopener noreferrer">
          https://{import.meta.env.VITE_JITSI_DOMAIN || 'meet.jit.si'}/teamvisio-{roomId}
        </a>
      </p>
    </div>
  {:else if !isJoined && !autoJoin}
    <div class="join-container overlay">
      <h3>Rejoindre la visioconférence</h3>
      <p>Cliquez sur le bouton ci-dessous pour rejoindre la visioconférence.</p>
      
      <div class="pre-join-options">
        <label class="toggle-option">
          <input type="checkbox" bind:checked={isAudioMuted}>
          <span>{isAudioMuted ? 'Microphone désactivé' : 'Microphone activé'}</span>
        </label>
        
        <label class="toggle-option">
          <input type="checkbox" bind:checked={isVideoMuted}>
          <span>{isVideoMuted ? 'Caméra désactivée' : 'Caméra activée'}</span>
        </label>
      </div>
      
      <button class="btn btn-primary" on:click={handleJoinClick}>
        Rejoindre
      </button>
    </div>
  {/if}
  
  {#if isJoined}
    <div class="controls">
      <!-- Contrôles audio/vidéo -->
      <div class="control-buttons">
        <button 
          class="btn btn-control {isAudioMuted ? 'muted' : ''}" 
          on:click={toggleAudio}
          title={isAudioMuted ? 'Activer le microphone' : 'Désactiver le microphone'}
        >
          <i class="control-icon">{isAudioMuted ? '🔇' : '🎤'}</i>
        </button>
        
        <button 
          class="btn btn-control {isVideoMuted ? 'muted' : ''}" 
          on:click={toggleVideo}
          title={isVideoMuted ? 'Activer la caméra' : 'Désactiver la caméra'}
        >
          <i class="control-icon">{isVideoMuted ? '📵' : '📹'}</i>
        </button>
        
        <button 
          class="btn btn-control {isScreenSharing ? 'active' : ''}" 
          on:click={toggleScreenShare}
          title={isScreenSharing ? 'Arrêter le partage d\'écran' : 'Partager mon écran'}
        >
          <i class="control-icon">💻</i>
        </button>
        
        <button 
          class="btn btn-control {isTileView ? 'active' : ''}" 
          on:click={toggleTileViewMode}
          title={isTileView ? 'Vue standard' : 'Vue en mosaïque'}
        >
          <i class="control-icon">🔲</i>
        </button>
        
        <button 
          class="btn btn-control {showParticipantsList ? 'active' : ''}" 
          on:click={toggleParticipantsList}
          title="Afficher/masquer la liste des participants"
        >
          <i class="control-icon">👥</i>
          {#if $participantsCount > 0}
            <span class="badge">{$participantsCount}</span>
          {/if}
        </button>
      </div>
      
      <button class="btn btn-danger" on:click={handleLeaveClick}>
        Quitter la visioconférence
      </button>
    </div>
    
    {#if showParticipantsList && isJoined}
      <div class="participants-panel">
        <div class="panel-header">
          <h3>Participants ({$participantsCount || 0})</h3>
          <button class="btn-close" on:click={toggleParticipantsList}>×</button>
        </div>
        
        {#if $participantsCount === 0}
          <p class="empty-list">Aucun participant</p>
        {:else}
          <ul class="participants-list">
            {#each $jitsiParticipants as participant}
              <li class="participant-item">
                <div class="participant-info">
                  <div class="participant-name">
                    {participant.displayName}
                    {#if participant.isLocal}
                      <span class="local-badge">vous</span>
                    {/if}
                  </div>
                  <div class="participant-time">
                    {formatJoinTime(participant.joinedAt)}
                  </div>
                </div>
                <div class="participant-status">
                  {#if participant.audioMuted}
                    <span class="status-icon muted" title="Micro désactivé">🔇</span>
                  {:else}
                    <span class="status-icon" title="Micro activé">🎤</span>
                  {/if}
                  
                  {#if participant.videoMuted}
                    <span class="status-icon muted" title="Caméra désactivée">📵</span>
                  {:else}
                    <span class="status-icon" title="Caméra activée">📹</span>
                  {/if}
                </div>
              </li>
            {/each}
          </ul>
        {/if}
      </div>
    {/if}
  {/if}
  
  {#if roomData && roomData.capacity}
    <div class="capacity-indicator" class:is-full={$participantsCount >= roomData.capacity}>
      {$participantsCount} / {roomData.capacity} participants
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
    position: relative;
  }
  
  .jitsi-container {
    flex: 1;
    overflow: hidden;
    background-color: #202124;
    border-radius: 8px;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    min-height: 500px;
    z-index: 1;
  }
  
  /* Classe commune pour les superpositions */
  .overlay {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    min-height: 500px;
    padding: 2rem;
    background-color: var(--background-alt);
    border-radius: 8px;
    text-align: center;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
  }
  
  .loading-container,
  .error-container,
  .join-container {
    /* Les propriétés spécifiques sont conservées ici */
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
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background-color: var(--background);
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    position: relative;
    z-index: 2;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .control-buttons {
    display: flex;
    gap: 0.5rem;
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
  
  .btn-control {
    width: 40px;
    height: 40px;
    padding: 0;
    border-radius: 50%;
    background-color: var(--background-alt);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    position: relative;
  }
  
  .btn-control:hover {
    transform: scale(1.1);
  }
  
  .btn-control.muted {
    background-color: var(--error-light);
    color: var(--error);
  }
  
  .btn-control.active {
    background-color: var(--primary-light);
    color: var(--primary);
  }
  
  .control-icon {
    font-style: normal;
    font-size: 1.2rem;
  }
  
  .badge {
    position: absolute;
    top: -5px;
    right: -5px;
    background-color: var(--primary);
    color: white;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    font-size: 0.7rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
  }
  
  .pre-join-options {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin: 1rem 0;
    padding: 1rem;
    background-color: var(--background);
    border-radius: 0.5rem;
    width: 100%;
    max-width: 300px;
  }
  
  .toggle-option {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  
  .toggle-option input {
    margin-right: 0.5rem;
  }
  
  .participants-panel {
    position: absolute;
    top: 0;
    right: 0;
    background-color: var(--background);
    width: 250px;
    height: calc(100% - 70px);
    border-left: 1px solid var(--border);
    overflow-y: auto;
    z-index: 3;
    padding: 0;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  }
  
  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 1rem;
    border-bottom: 1px solid var(--border);
    background-color: var(--background-alt);
  }
  
  .panel-header h3 {
    margin: 0;
    font-size: 1rem;
  }
  
  .btn-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--foreground);
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }
  
  .btn-close:hover {
    background-color: var(--background);
  }
  
  .participants-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .participant-item {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--border-light);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .participant-info {
    flex: 1;
    min-width: 0;
  }
  
  .participant-name {
    font-weight: 500;
    margin-bottom: 0.25rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .local-badge {
    background-color: var(--primary-light);
    color: var(--primary);
    font-size: 0.7rem;
    padding: 0.1rem 0.3rem;
    border-radius: 3px;
    font-weight: 600;
  }
  
  .participant-time {
    font-size: 0.75rem;
    color: var(--foreground-alt);
  }
  
  .participant-status {
    display: flex;
    gap: 0.5rem;
  }
  
  .status-icon {
    font-size: 0.9rem;
  }
  
  .status-icon.muted {
    color: var(--error);
  }
  
  .empty-list {
    color: var(--foreground-alt);
    font-style: italic;
    padding: 1rem;
    text-align: center;
  }
  
  .capacity-indicator {
    position: absolute;
    top: 0.5rem;
    left: 0.5rem;
    background-color: var(--background);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
    z-index: 3;
    color: var(--foreground);
  }
  
  .is-full {
    background-color: var(--warning-light);
    color: var(--warning-dark);
  }
  
  @media (max-width: 768px) {
    .controls {
      flex-direction: column;
      gap: 1rem;
    }
    
    .participants-panel {
      width: 100%;
      height: 200px;
      border-left: none;
      border-top: 1px solid var(--border);
      top: auto;
      bottom: 70px;
    }
  }
  
  .error-actions {
    display: flex;
    flex-direction: row;
    gap: 0.75rem;
    margin-top: 1rem;
  }
  
  .btn-secondary {
    background-color: var(--foreground-alt);
    color: var(--background);
  }
  
  .btn-secondary:hover {
    background-color: var(--foreground);
  }
  
  .btn-alt {
    background-color: var(--foreground-alt);
    color: var(--background);
  }
  
  .btn-alt:hover {
    background-color: var(--foreground);
  }
  
  .btn-help {
    background-color: var(--foreground-alt);
    color: var(--background);
  }
  
  .btn-help:hover {
    background-color: var(--foreground);
  }
  
  .help-icon {
    font-style: normal;
    font-size: 1.2rem;
  }
  
  .error-note {
    color: var(--foreground-alt);
    font-size: 0.8rem;
    margin-top: 1rem;
  }
</style> 