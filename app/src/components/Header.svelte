<script>
  import { environment, isConfigValid } from '../lib/config';
  import { firebaseApp } from '../lib/firebase';
  
  export let title = 'Team Visio';
</script>

<header>
  <div class="container">
    <div class="header-content">
      <div class="logo">
        <h1>{title}</h1>
        <p class="tagline">Communiquez simplement, rencontrez facilement</p>
      </div>
      <div class="env-info">
        <span class="env-badge">Environnement: {environment}</span>
        {#if import.meta.env.DEV}
          <span class="status-badge {isConfigValid ? 'status-success' : 'status-error'}">
            Config: {isConfigValid ? 'OK' : 'Erreur'}
          </span>
          <span class="status-badge {firebaseApp ? 'status-success' : 'status-error'}">
            Firebase: {firebaseApp ? 'OK' : 'Erreur'}
          </span>
        {/if}
      </div>
    </div>
  </div>
</header>

<style>
  header {
    background-color: var(--primary-light);
    padding: 1.5rem 0;
    border-bottom: 1px solid var(--primary);
  }
  
  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .logo h1 {
    color: var(--primary-dark);
    margin-bottom: 0.25rem;
  }
  
  .tagline {
    color: var(--foreground);
    font-size: 1rem;
    margin-bottom: 0;
    opacity: 0.8;
  }
  
  .env-info {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.5rem;
  }
  
  .env-badge {
    background-color: var(--info);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: 500;
  }
  
  .status-badge {
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: 500;
  }
  
  .status-success {
    background-color: var(--success);
  }
  
  .status-error {
    background-color: var(--error);
  }
  
  @media (max-width: 768px) {
    .header-content {
      flex-direction: column;
      text-align: center;
      gap: 1rem;
    }
    
    .env-info {
      align-items: center;
    }
  }
</style> 