<script>
  import Header from '../components/Header.svelte';
  import Hero from '../components/Hero.svelte';
  import Features from '../components/Features.svelte';
  import CallToAction from '../components/CallToAction.svelte';
  import Footer from '../components/Footer.svelte';
  import AuthContainer from '../components/auth/AuthContainer.svelte';
  import UserProfile from '../components/auth/UserProfile.svelte';
  import RoomList from '../components/rooms/RoomList.svelte';
  import { onMount } from 'svelte';
  import { initFirebase } from '../lib/firebase';
  import { initUserStore, isLoggedIn, currentUser, isAdmin } from '../stores/userStore';
  import UserStatusBar from '../components/UserStatusBar.svelte';
  import AddRoomForm from '../components/rooms/AddRoomForm.svelte';
  import AdminRoomManager from '../components/rooms/AdminRoomManager.svelte';
  import FirebaseDebugger from '../components/FirebaseDebugger.svelte';
  import { seedRooms } from '../lib/firebase/seedData';
  import MakeAdmin from '../components/admin/MakeAdmin.svelte';
  
  let showAuthSection = false;
  
  function toggleAuthSection() {
    showAuthSection = !showAuthSection;
  }
  
  function handleAuthSuccess() {
    showAuthSection = false;
  }
  
  // Firebase initialization status
  let firebaseInitialized = false;
  
  onMount(async () => {
    try {
      await initFirebase();
      firebaseInitialized = true;
      
      // Initialize user authentication store
      initUserStore();
      
      // Initialiser des données de démonstration si on est en mode développement
      if (import.meta.env.DEV) {
        await seedRooms();
      }
    } catch (error) {
      console.error('Error initializing Firebase:', error);
    }
  });
</script>

<svelte:head>
  <title>Team Visio - Visioconférences simples et sécurisées</title>
  <meta name="description" content="Créez et rejoignez des visioconférences en un clic avec Team Visio. Aucune installation requise, entièrement sécurisé et gratuit.">
</svelte:head>

<div class="app-container">
  <Header />
  <main>
    <Hero onOpenAuth={toggleAuthSection} />
    
    <!-- Status utilisateur -->
    <section class="status-section">
      <div class="container">
        <UserStatusBar />
        
        <!-- Affichage du statut Firebase (pour debug) -->
        {#if import.meta.env.DEV}
          <div class="debug-status">
            {#if firebaseInitialized}
              <div class="status success">Firebase initialisé avec succès</div>
            {:else}
              <div class="status error">Firebase non initialisé</div>
            {/if}
          </div>
        {/if}
      </div>
    </section>
    
    <!-- Section authentification ou profil -->
    {#if showAuthSection || $currentUser}
      <section class="user-section">
        <div class="container">
          {#if $currentUser}
            <div class="profile-container">
              <h2 class="section-title">Votre profil</h2>
              <UserProfile />
            </div>
          {:else}
            <AuthContainer onAuthSuccess={handleAuthSuccess} />
          {/if}
        </div>
      </section>
    {/if}
    
    <!-- Panneau d'administration des salles (pour administrateurs uniquement) -->
    {#if $isLoggedIn && $isAdmin}
      <section class="admin-section">
        <div class="container">
          <AdminRoomManager />
        </div>
      </section>
    {:else if $isLoggedIn}
      <!-- Formulaire d'ajout de salle (pour utilisateurs connectés non-administrateurs) -->
      <section class="add-room-section">
        <div class="container">
          <AddRoomForm />
        </div>
      </section>
    {/if}
    
    <!-- Liste des salles disponibles -->
    <section class="rooms-section">
      <div class="container">
        <RoomList />
      </div>
    </section>
    
    <!-- Sections informatives pour les non-connectés -->
    {#if !$isLoggedIn}
      <Features />
      <CallToAction />
    {/if}
    
    <!-- Débogueur Firebase (uniquement en développement) -->
    {#if import.meta.env.DEV}
      <div class="container">
        <FirebaseDebugger />
        
        <!-- Module pour devenir administrateur en développement -->
        {#if $isLoggedIn}
          <MakeAdmin />
        {/if}
      </div>
    {/if}
  </main>
  <Footer />
</div>

<style>
  :global(:root) {
    /* Importer les styles globaux */
    @import '../styles/global.css';
  }
  
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
  
  .user-section {
    padding: 3rem 0;
    background-color: var(--background-alt);
  }
  
  .profile-container {
    max-width: 600px;
    margin: 0 auto;
  }
  
  .section-title {
    text-align: center;
    margin-bottom: 2rem;
    color: var(--foreground);
  }
  
  .admin-section {
    padding: 2rem 0;
    background-color: var(--background);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
  }
  
  .add-room-section {
    padding: 2rem 0;
    background-color: var(--background);
  }
  
  .rooms-section {
    padding: 3rem 0;
    background-color: var(--background-alt);
  }
  
  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
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
  
  .demo-link-container {
    margin-top: 2rem;
    padding: 1.5rem;
    background-color: var(--background);
    border-radius: 0.5rem;
    border: 1px solid var(--primary-light);
  }
  
  .demo-link-container h3 {
    color: var(--primary);
    margin-top: 0;
    margin-bottom: 0.5rem;
  }
  
  .demo-link {
    display: inline-block;
    margin-top: 1rem;
    padding: 0.75rem 1.5rem;
    background-color: var(--primary);
    color: white;
    text-decoration: none;
    border-radius: 0.25rem;
    font-weight: 500;
    transition: background-color 0.2s;
  }
  
  .demo-link:hover {
    background-color: var(--primary-dark);
  }
  
  @media (max-width: 768px) {
    .container {
      padding: 0 1rem;
    }
  }
</style> 