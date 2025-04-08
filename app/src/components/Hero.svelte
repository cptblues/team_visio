<script>
  import { currentUser, authLoading } from '../stores/userStore';
  import { push } from 'svelte-spa-router';
  
  function goToLogin() {
    push('/login');
  }
</script>

<section class="hero">
  <div class="container">
    <div class="hero-content">
      <h2>Visioconférences simples et sécurisées</h2>
      <p>Rejoignez une réunion en un clic ou créez votre propre salle de visioconférence. Aucune installation requise.</p>
      <div class="cta-buttons">
        {#if $authLoading}
          <div class="loading-indicator">Chargement...</div>
        {:else if $currentUser}
          <button class="btn btn-primary">Créer une salle</button>
          <button class="btn btn-outline">Rejoindre une salle</button>
        {:else}
          <button class="btn btn-primary" on:click={goToLogin}>Se connecter</button>
          <button class="btn btn-outline" on:click={goToLogin}>S'inscrire</button>
        {/if}
      </div>
    </div>
    <div class="hero-image">
      <div class="placeholder-image">
        <div class="image-text">Illustration de visioconférence</div>
      </div>
    </div>
  </div>
</section>

<style>
  .hero {
    padding: 3rem 0;
    background-color: var(--background);
  }
  
  .container {
    display: flex;
    align-items: center;
    gap: 2rem;
  }
  
  .hero-content {
    flex: 1;
  }
  
  h2 {
    color: var(--foreground);
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
  
  p {
    color: var(--foreground-alt);
    font-size: 1.2rem;
    margin-bottom: 2rem;
    line-height: 1.5;
  }
  
  .cta-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }
  
  .btn {
    padding: 0.75rem 1.5rem;
    border-radius: 0.25rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .btn-primary {
    background-color: var(--primary);
    color: white;
    border: none;
  }
  
  .btn-primary:hover {
    background-color: var(--primary-dark);
  }
  
  .btn-outline {
    background-color: transparent;
    color: var(--primary);
    border: 1px solid var(--primary);
  }
  
  .btn-outline:hover {
    background-color: var(--primary-light);
  }
  
  .hero-image {
    flex: 1;
  }
  
  .placeholder-image {
    width: 100%;
    height: 300px;
    background-color: var(--primary-light);
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary-dark);
    font-weight: 500;
  }
  
  .user-welcome {
    margin-top: 1rem;
    padding: 0.5rem;
    background-color: var(--primary-light);
    border-radius: 0.25rem;
    display: inline-block;
  }
  
  .user-welcome p {
    margin: 0;
    font-size: 0.9rem;
    color: var(--primary-dark);
  }
  
  .loading-indicator {
    color: var(--foreground-alt);
    font-size: 0.9rem;
  }
  
  @media (max-width: 768px) {
    .container {
      flex-direction: column;
    }
    
    .hero-content {
      text-align: center;
    }
    
    h2 {
      font-size: 2rem;
    }
    
    .cta-buttons {
      justify-content: center;
    }
    
    .hero-image {
      width: 100%;
    }
    
    .user-welcome {
      margin: 1rem auto 0;
    }
  }
</style> 