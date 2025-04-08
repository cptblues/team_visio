<script>
  import { onMount } from 'svelte';
  import { isSupabaseConfigValid } from '../lib/supabase/config';
  import { initUserStore } from '../stores/userStore';
  import Header from '../components/Header.svelte';
  import Footer from '../components/Footer.svelte';
  import RoomList from '../components/rooms/RoomList.svelte';
  import { seedRooms } from '../lib/supabase/seedData';
  
  // Supabase initialization status
  let supabaseInitialized = false;
  let loading = true;
  
  onMount(async () => {
    try {
      supabaseInitialized = isSupabaseConfigValid;
      
      // Initialize user authentication store
      initUserStore();
      
      // Initialiser des données de démonstration si on est en mode développement
      if (import.meta.env.DEV) {
        await seedRooms();
      }
      
      loading = false;
    } catch (error) {
      console.error('Error initializing Supabase:', error);
      loading = false;
    }
  });
</script>

<svelte:head>
  <title>Salles de conférence | Team Visio</title>
  <meta name="description" content="Explorez les salles de conférence disponibles, créez vos propres salles ou rejoignez une conversation en cours.">
</svelte:head>

<div class="app-container">
  <Header />
  <main>
     
    {#if loading}
      <div class="loading-container">
        <div class="spinner"></div>
        <p>Chargement des salles...</p>
      </div>
    {:else}      
      <!-- Liste des salles disponibles -->
      <section class="rooms-section">
        <div class="container">
          <RoomList />
        </div>
      </section>
    {/if}
  </main>
  <Footer />
</div>

<style>
  .app-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
  main {
    flex: 1;
  }
  
  .status-section {
    padding: 1rem 0;
    background-color: var(--background-alt);
    text-align: center;
  }
  
  .debug-status {
    margin-top: 0.5rem;
  }
  
  .status {
    display: inline-block;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }
  
  .success {
    background-color: var(--success-light);
    color: var(--success-dark);
  }
  
  .error {
    background-color: var(--error-light);
    color: var(--error-dark);
  }
  
  .page-header {
    background-color: var(--primary);
    color: white;
    padding: 3rem 0;
    text-align: center;
  }
  
  .page-header h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
  
  .page-header p {
    font-size: 1.2rem;
    max-width: 800px;
    margin: 0 auto;
    opacity: 0.9;
  }
  
  .section-title {
    margin-bottom: 2rem;
    color: var(--foreground);
    font-size: 1.75rem;
    text-align: center;
  }
  
  .admin-section {
    padding: 3rem 0;
    background-color: var(--background);
    border-bottom: 1px solid var(--border);
  }
  
  .add-room-section {
    padding: 3rem 0;
    background-color: var(--background);
    border-bottom: 1px solid var(--border);
  }
  
  .rooms-section {
    padding: 3rem 0;
    background-color: var(--background-alt);
  }
  
  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.5rem;
  }
  
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 5rem 0;
    background-color: var(--background-alt);
  }
  
  .spinner {
    width: 50px;
    height: 50px;
    border: 5px solid var(--background);
    border-top: 5px solid var(--primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @media (max-width: 768px) {
    .page-header h1 {
      font-size: 2rem;
    }
    
    .page-header p {
      font-size: 1rem;
    }
    
    .section-title {
      font-size: 1.5rem;
    }
  }
</style> 