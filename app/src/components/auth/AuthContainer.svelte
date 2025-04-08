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
    initUserStore();
    return () => {};
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
        <p>Bienvenue, {$currentUser.display_name || $currentUser.email}!</p>
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
    background-color: var(--background);
  }
  
  .container {
    max-width: 500px;
    margin: 0 auto;
    padding: 2.5rem;
    background-color: white;
    border-radius: var(--radius-lg);
    box-shadow: 0 10px 30px var(--shadow);
  }
  
  .loading-indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }
  
  .spinner {
    width: 50px;
    height: 50px;
    border: 4px solid var(--primary-light);
    border-top: 4px solid var(--primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1.5rem;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .auth-success {
    background: linear-gradient(135deg, var(--success), var(--success-light));
    color: white;
    padding: 2.5rem;
    border-radius: var(--radius-md);
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  
  .auth-success::before {
    content: '✓';
    position: absolute;
    font-size: 10rem;
    opacity: 0.1;
    top: -2rem;
    right: -2rem;
    color: white;
    transform: rotate(15deg);
  }
  
  .auth-success h2 {
    color: white;
    margin-bottom: 1rem;
    font-size: 1.8rem;
    font-weight: 700;
    position: relative;
  }
  
  .auth-success p {
    font-size: 1.1rem;
    position: relative;
  }
  
  @media (max-width: 768px) {
    .container {
      padding: 1.5rem;
      margin: 0 1rem;
    }
  }
</style> 