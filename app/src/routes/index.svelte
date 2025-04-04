<script>
  import Header from '../components/Header.svelte';
  import Hero from '../components/Hero.svelte';
  import Features from '../components/Features.svelte';
  import Footer from '../components/Footer.svelte';
  import AuthContainer from '../components/auth/AuthContainer.svelte';
  import { onMount } from 'svelte';
  import { initFirebase } from '../lib/firebase';
  import { initUserStore, isLoggedIn, currentUser } from '../stores/userStore';
  import MakeAdmin from '../components/admin/MakeAdmin.svelte';
  import { push } from 'svelte-spa-router';
  
  let showAuthSection = false;
  
  function toggleAuthSection() {
    showAuthSection = !showAuthSection;
  }
  
  function handleAuthSuccess() {
    showAuthSection = false;
  }

  function goToRoomsPage() {
    push('/rooms');
  }
  
  // Firebase initialization status
  let firebaseInitialized = false;
  
  onMount(async () => {
    try {
      await initFirebase();
      firebaseInitialized = true;
      
      // Initialize user authentication store
      initUserStore();
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
    
    <!-- Section authentification ou profil -->
    {#if showAuthSection || $currentUser}
      <section class="user-section">
        <div class="container">
          {#if !$currentUser}
            <AuthContainer onAuthSuccess={handleAuthSuccess} />
          {/if}
        </div>
      </section>
    {/if}
    
    <!-- Bouton pour accéder au hall des salles -->
    {#if $currentUser && isLoggedIn}
      <section class="cta-section">
        <div class="container">
          <div class="cta-card">
            <h2>Accédez au hall des salles</h2>
            <p>Découvrez toutes les salles disponibles, créez vos propres salles ou rejoignez une conversation en cours.</p>
            <button class="btn btn-primary btn-lg" on:click={goToRoomsPage}>
              Explorer les salles
              <span class="btn-icon">→</span>
            </button>
          </div>
        </div>
      </section>
    {/if}
    
    <!-- Sections informatives pour tous -->
    <Features />
    
    <!-- Débogueur Firebase (uniquement en développement) -->
    <!-- {#if import.meta.env.DEV}
      <div class="container">
        <FirebaseDebugger />
      </div>
    {/if} -->
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
  
  .cta-section {
    padding: 4rem 0;
    background-color: var(--background);
  }
  
  .cta-card {
    background-color: white;
    border-radius: var(--radius-lg);
    padding: 3rem 2rem;
    box-shadow: 0 8px 30px var(--shadow);
    text-align: center;
    max-width: 800px;
    margin: 0 auto;
  }
  
  .cta-card h2 {
    color: var(--primary-dark);
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  
  .cta-card p {
    color: var(--foreground);
    font-size: 1.1rem;
    margin-bottom: 2rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .btn-lg {
    font-size: 1.1rem;
    padding: 0.85rem 2rem;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .btn-icon {
    transition: transform 0.3s ease;
  }
  
  .btn-lg:hover .btn-icon {
    transform: translateX(5px);
  }
  
  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.5rem;
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
  
  @media (max-width: 768px) {
    .cta-card {
      padding: 2rem 1.5rem;
    }
    
    .cta-card h2 {
      font-size: 1.75rem;
    }
    
    .btn-lg {
      width: 100%;
      justify-content: center;
    }
  }
</style> 