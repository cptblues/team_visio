<script>
  import { onMount } from 'svelte';
  import LoginForm from './LoginForm.svelte';
  import RegisterForm from './RegisterForm.svelte';
  import { currentUser, authLoading, initUserStore } from '../../stores/userStore';
  
  export let onAuthSuccess = () => {};
  
  let isLoginMode = true;
  
  function toggleAuthMode() {
    isLoginMode = !isLoginMode;
  }
  
  onMount(() => {
    // Initialiser l'écoute de l'état d'authentification
    const unsubscribe = initUserStore();
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  });
</script>

<section class="auth-container">
  <div class="container">
    {#if $authLoading}
      <div class="loading-indicator">
        <div class="spinner"></div>
        <p>Chargement...</p>
      </div>
    {:else if $currentUser}
      <div class="auth-success">
        <h2>Vous êtes connecté</h2>
        <p>Bienvenue, {$currentUser.displayName || $currentUser.email}!</p>
      </div>
    {:else}
      {#if isLoginMode}
        <LoginForm onSuccess={onAuthSuccess} onToggleForm={toggleAuthMode} />
      {:else}
        <RegisterForm onSuccess={onAuthSuccess} onToggleForm={toggleAuthMode} />
      {/if}
    {/if}
  </div>
</section>

<style>
  .auth-container {
    padding: 3rem 0;
    background-color: var(--background-alt);
  }
  
  .loading-indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid var(--primary-light);
    border-top: 4px solid var(--primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .auth-success {
    background-color: var(--success);
    color: white;
    padding: 2rem;
    border-radius: 0.5rem;
    text-align: center;
    max-width: 400px;
    margin: 0 auto;
  }
  
  .auth-success h2 {
    color: white;
    margin-bottom: 1rem;
  }
</style> 