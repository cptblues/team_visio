<script>
  import { onMount } from 'svelte';
  import JitsiRoom from '../components/conference/JitsiRoom.svelte';
  import { initFirebase } from '../lib/firebase';
  import { initUserStore, currentUser } from '../stores/userStore';
  import UserStatusBar from '../components/UserStatusBar.svelte';
  import AuthContainer from '../components/auth/AuthContainer.svelte';
  
  let roomId = 'demo-room';
  let firebaseInitialized = false;
  let showAuthSection = false;
  
  function toggleAuthSection() {
    showAuthSection = !showAuthSection;
  }
  
  function handleAuthSuccess() {
    showAuthSection = false;
  }
  
  onMount(async () => {
    try {
      await initFirebase();
      firebaseInitialized = true;
      
      // Initialiser le store utilisateur
      initUserStore();
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de Firebase:', error);
    }
  });
</script>

<svelte:head>
  <title>Démo Jitsi Meet - Team Visio</title>
  <meta name="description" content="Démonstration de l'intégration de Jitsi Meet dans Team Visio" />
</svelte:head>

<div class="demo-page">
  <header class="demo-header">
    <div class="container">
      <h1>Démo Jitsi Meet</h1>
      <div class="auth-buttons">
        {#if $currentUser}
          <p>Connecté en tant que: <strong>{$currentUser.displayName || $currentUser.email}</strong></p>
        {:else}
          <button class="btn btn-primary" on:click={toggleAuthSection}>
            Se connecter
          </button>
        {/if}
      </div>
    </div>
  </header>
  
  <main>
    <section class="status-section">
      <div class="container">
        <UserStatusBar />
      </div>
    </section>
    
    {#if showAuthSection}
      <section class="auth-section">
        <div class="container">
          <AuthContainer onAuthSuccess={handleAuthSuccess} />
        </div>
      </section>
    {/if}
    
    <section class="demo-section">
      <div class="container">
        <div class="room-info">
          <h2>Salle de démonstration Jitsi Meet</h2>
          <p>Cette page démontre l'intégration de Jitsi Meet dans Team Visio. Vous pouvez tester la visioconférence ci-dessous.</p>
          <p>ID de la salle: <strong>{roomId}</strong></p>
          
          {#if !$currentUser}
            <div class="auth-notice">
              <p>⚠️ Pour une expérience complète, veuillez vous connecter.</p>
              <button class="btn btn-primary" on:click={toggleAuthSection}>
                Se connecter
              </button>
            </div>
          {/if}
        </div>
        
        <div class="jitsi-demo">
          <JitsiRoom {roomId} autoJoin={true} />
        </div>
      </div>
    </section>
  </main>
  
  <footer class="demo-footer">
    <div class="container">
      <p>&copy; 2025 Team Visio - Démonstration de l'intégration Jitsi Meet</p>
    </div>
  </footer>
</div>

<style>
  .demo-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  .demo-header {
    background-color: var(--primary);
    color: white;
    padding: 1rem 0;
  }
  
  .demo-header .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }
  
  main {
    flex: 1;
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
  
  .demo-section {
    padding: 2rem 0;
    background-color: var(--background-alt);
  }
  
  .room-info {
    margin-bottom: 2rem;
    text-align: center;
  }
  
  .auth-notice {
    background-color: var(--warning-light);
    color: var(--warning-dark);
    padding: 1rem;
    border-radius: 0.5rem;
    margin: 1rem 0;
    text-align: center;
  }
  
  .jitsi-demo {
    height: 600px;
    max-width: 1000px;
    margin: 0 auto;
    border-radius: 0.5rem;
    overflow: hidden;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }
  
  .demo-footer {
    background-color: var(--primary-dark);
    color: white;
    padding: 1rem 0;
    text-align: center;
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
    background-color: var(--secondary);
    color: white;
  }
  
  .btn-primary:hover {
    background-color: var(--secondary-dark);
  }
  
  @media (max-width: 768px) {
    .jitsi-demo {
      height: 400px;
    }
    
    .demo-header .container {
      flex-direction: column;
      text-align: center;
    }
    
    .auth-buttons {
      margin-top: 1rem;
    }
  }
</style> 