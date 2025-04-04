<script>
  import { onMount } from 'svelte';
  import { push } from 'svelte-spa-router';
  import { initFirebase } from '../lib/firebase';
  import { initUserStore, currentUser, isLoggedIn } from '../stores/userStore';
  import LoginForm from '../components/auth/LoginForm.svelte';
  import RegisterForm from '../components/auth/RegisterForm.svelte';
  import Header from '../components/Header.svelte';
  import Footer from '../components/Footer.svelte';

  // État pour gérer l'affichage du formulaire (connexion ou inscription)
  let isLoginMode = true;
  let firebaseInitialized = false;
  
  // Fonction pour basculer entre les modes connexion et inscription
  function toggleAuthMode() {
    isLoginMode = !isLoginMode;
  }
  
  // Fonction appelée après une authentification réussie
  function handleAuthSuccess() {
    // Rediriger vers la page d'accueil
    push('/');
  }
  
  onMount(async () => {
    try {
      // Initialiser Firebase
      await initFirebase();
      firebaseInitialized = true;
      
      // Initialiser le store utilisateur
      initUserStore();
      
      // Si l'utilisateur est déjà connecté, le rediriger vers la page d'accueil
      if ($isLoggedIn) {
        push('/');
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation:', error);
    }
  });
</script>

<svelte:head>
  <title>{isLoginMode ? 'Connexion' : 'Inscription'} - Team Visio</title>
  <meta name="description" content="Connectez-vous ou inscrivez-vous à Team Visio pour rejoindre ou créer des salles de visioconférence." />
</svelte:head>

<div class="auth-page">
  <Header />
  
  <main>
    <section class="auth-section">
      <div class="container">
        <div class="auth-card">
          <div class="auth-header">
            <div class="auth-tabs">
              <button 
                class="auth-tab {isLoginMode ? 'active' : ''}" 
                on:click={() => isLoginMode = true}
              >
                Connexion
              </button>
              <button 
                class="auth-tab {!isLoginMode ? 'active' : ''}" 
                on:click={() => isLoginMode = false}
              >
                Inscription
              </button>
            </div>
          </div>
          
          <div class="auth-body">
            {#if $currentUser}
              <div class="auth-success">
                <h2>Vous êtes connecté</h2>
                <p>Bienvenue, {$currentUser.displayName || $currentUser.email}!</p>
                <button class="btn btn-primary" on:click={() => push('/')}>
                  Aller à l'accueil
                </button>
              </div>
            {:else}
              {#if isLoginMode}
                <LoginForm onSuccess={handleAuthSuccess} onToggleForm={toggleAuthMode} />
              {:else}
                <RegisterForm onSuccess={handleAuthSuccess} onToggleForm={toggleAuthMode} />
              {/if}
            {/if}
          </div>
        </div>
      </div>
    </section>
  </main>
  
  <Footer />
</div>

<style>
  .auth-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  main {
    flex: 1;
    display: flex;
    align-items: center;
  }
  
  .auth-section {
    width: 100%;
    padding: 4rem 0;
    background-color: var(--background-alt);
  }
  
  .container {
    max-width: 500px;
  }
  
  .auth-card {
    background-color: white;
    border-radius: var(--radius-lg);
    box-shadow: 0 10px 30px var(--shadow);
    overflow: hidden;
  }
  
  .auth-header {
    padding: 0 2rem;
    background-color: var(--background);
  }
  
  .auth-tabs {
    display: flex;
    margin-top: -1px;
  }
  
  .auth-tab {
    flex: 1;
    padding: 1.25rem 0;
    background: none;
    border: none;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--foreground-alt);
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: var(--transition);
  }
  
  .auth-tab:hover {
    color: var(--primary);
  }
  
  .auth-tab.active {
    color: var(--primary);
    border-bottom: 2px solid var(--primary);
  }
  
  .auth-body {
    padding: 2.5rem;
  }
  
  .auth-success {
    text-align: center;
    padding: 2rem 1rem;
  }
  
  .auth-success h2 {
    color: var(--primary-dark);
    margin-bottom: 1rem;
  }
  
  .auth-success p {
    color: var(--foreground);
    margin-bottom: 2rem;
  }
  
  @media (max-width: 576px) {
    .auth-section {
      padding: 2rem 0;
    }
    
    .auth-body {
      padding: 1.5rem;
    }
    
    .auth-tab {
      padding: 1rem 0;
      font-size: 1rem;
    }
  }
</style> 