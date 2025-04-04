<script>
  import { onMount } from 'svelte';
  import { initFirebase } from '../lib/firebase';
  import { initUserStore, isLoggedIn, isAdmin, currentUser } from '../stores/userStore';
  import Header from '../components/Header.svelte';
  import Footer from '../components/Footer.svelte';
  import UserStatusBar from '../components/UserStatusBar.svelte';
  import AdminRoomManager from '../components/rooms/AdminRoomManager.svelte';
  import AddRoomForm from '../components/rooms/AddRoomForm.svelte';
  import { push } from 'svelte-spa-router';
  
  // Firebase initialization status
  let firebaseInitialized = false;
  let loading = true;
  
  // Sections d'administration
  let activeSection = 'rooms'; // Par défaut, on affiche la gestion des salles
  
  onMount(async () => {
    try {
      await initFirebase();
      firebaseInitialized = true;
      
      // Initialize user authentication store
      initUserStore();
      loading = false;
    } catch (error) {
      console.error('Error initializing Firebase:', error);
      loading = false;
    }
  });
  
  // Rediriger l'utilisateur s'il n'est pas admin
  $: {
    if (!loading && $isLoggedIn && !$isAdmin) {
      push('/');
    }
  }
  
  function setActiveSection(section) {
    activeSection = section;
  }
</script>

<svelte:head>
  <title>Administration | Team Visio</title>
  <meta name="description" content="Panel d'administration pour la gestion de Team Visio">
</svelte:head>

<div class="app-container">
  <Header />
  <main>    
    <!-- Entête de page -->
    <div class="page-header">
      <div class="container">
        <h1>Administration</h1>
        <p>Gérez les ressources de la plateforme Team Visio</p>
      </div>
    </div>
    
    {#if loading}
      <div class="loading-container">
        <div class="spinner"></div>
        <p>Chargement...</p>
      </div>
    {:else if !$isLoggedIn}
      <div class="container access-denied">
        <p>Vous devez être connecté pour accéder à cette page.</p>
        <button class="btn btn-primary" on:click={() => push('/login')}>Se connecter</button>
      </div>
    {:else if !$isAdmin}
      <div class="container access-denied">
        <p>Accès réservé aux administrateurs.</p>
        <button class="btn btn-primary" on:click={() => push('/')}>Retour à l'accueil</button>
      </div>
    {:else}
      <!-- Menu de navigation de l'administration -->
      <div class="admin-nav-container">
        <div class="container">
          <nav class="admin-nav">
            <button 
              class="admin-nav-item" 
              class:active={activeSection === 'rooms'} 
              on:click={() => setActiveSection('rooms')}
            >
              Gestion des salles
            </button>
            <button 
              class="admin-nav-item" 
              class:active={activeSection === 'users'} 
              on:click={() => setActiveSection('users')}
            >
              Gestion des utilisateurs
            </button>
            <button 
              class="admin-nav-item" 
              class:active={activeSection === 'settings'} 
              on:click={() => setActiveSection('settings')}
            >
              Paramètres
            </button>
          </nav>
        </div>
      </div>
      
      <!-- Contenu de l'administration -->
      <div class="admin-content">
        <div class="container">
          {#if activeSection === 'rooms'}
            <div class="admin-section">
              <h2 class="section-title">Gestion des salles</h2>
              <AdminRoomManager />
            </div>
            
            <div class="admin-section">
              <h2 class="section-title">Création rapide de salle</h2>
              <AddRoomForm />
            </div>
          {:else if activeSection === 'users'}
            <div class="admin-section">
              <h2 class="section-title">Gestion des utilisateurs</h2>
              <p class="coming-soon">Cette fonctionnalité sera disponible prochainement.</p>
            </div>
          {:else if activeSection === 'settings'}
            <div class="admin-section">
              <h2 class="section-title">Paramètres de la plateforme</h2>
              <p class="coming-soon">Cette fonctionnalité sera disponible prochainement.</p>
            </div>
          {/if}
        </div>
      </div>
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
  
  .access-denied {
    text-align: center;
    padding: 5rem 0;
  }
  
  .access-denied p {
    font-size: 1.2rem;
    margin-bottom: 1.5rem;
    color: var(--foreground);
  }
  
  .admin-nav-container {
    background-color: var(--background);
    border-bottom: 1px solid var(--border);
    position: sticky;
    top: 70px;
    z-index: 10;
  }
  
  .admin-nav {
    display: flex;
    gap: 0.5rem;
    overflow-x: auto;
    padding: 1rem 0;
  }
  
  .admin-nav-item {
    background: none;
    border: none;
    padding: 0.75rem 1.25rem;
    font-size: 1rem;
    font-weight: 500;
    color: var(--foreground);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: var(--transition);
    white-space: nowrap;
  }
  
  .admin-nav-item:hover {
    background-color: var(--background-alt);
  }
  
  .admin-nav-item.active {
    background-color: var(--primary-light);
    color: var(--primary-dark);
    font-weight: 600;
  }
  
  .admin-content {
    padding: 2rem 0;
    background-color: var(--background-alt);
  }
  
  .admin-section {
    background-color: var(--background);
    border-radius: var(--radius-lg);
    padding: 2rem;
    margin-bottom: 2rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
  
  .section-title {
    margin-bottom: 1.5rem;
    color: var(--foreground);
    font-size: 1.5rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--border);
  }
  
  .coming-soon {
    color: var(--foreground-alt);
    font-style: italic;
    text-align: center;
    padding: 3rem 0;
  }
  
  @media (max-width: 768px) {
    .page-header h1 {
      font-size: 2rem;
    }
    
    .page-header p {
      font-size: 1rem;
    }
    
    .admin-nav {
      justify-content: flex-start;
      padding: 0.75rem 0;
    }
    
    .admin-nav-item {
      padding: 0.6rem 1rem;
      font-size: 0.9rem;
    }
    
    .admin-section {
      padding: 1.5rem;
    }
  }
</style> 