<script>
  import { isLoggedIn, currentUser, authLoading } from '../stores/userStore';
</script>

<div class="user-status-bar">
  {#if $authLoading}
    <div class="loading-indicator">
      <div class="loading-spinner"></div>
      <span>Chargement de l'authentification...</span>
    </div>
  {:else if $isLoggedIn}
    <div class="user-logged-in">
      <div class="user-avatar">
        {#if $currentUser?.photoURL}
          <img src={$currentUser.photoURL} alt="Avatar" />
        {:else}
          <div class="avatar-placeholder">
            {$currentUser?.display_name?.[0]?.toUpperCase() || $currentUser?.email?.[0]?.toUpperCase() || '?'}
          </div>
        {/if}
      </div>
      <div class="user-info">
        <span class="user-name">{$currentUser?.display_name || $currentUser?.email || 'Utilisateur connecté'}</span>
      </div>
    </div>
  {:else}
    <div class="user-logged-out">
      <div class="avatar-placeholder anonymous"></div>
      <span>Non connecté</span>
    </div>
  {/if}
</div>

<style>
  .user-status-bar {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 1rem;
    border-radius: 2rem;
    background-color: var(--background);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    margin: 0 auto;
    max-width: fit-content;
  }
  
  .loading-indicator, .user-logged-in, .user-logged-out {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
  }
  
  .loading-spinner {
    width: 1rem;
    height: 1rem;
    border: 2px solid var(--primary-light);
    border-top: 2px solid var(--primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .user-avatar {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    overflow: hidden;
  }
  
  .user-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .avatar-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--primary);
    color: white;
    font-weight: bold;
  }
  
  .avatar-placeholder.anonymous {
    background-color: var(--foreground-alt);
  }
  
  .user-name {
    font-weight: 500;
    color: var(--foreground);
  }
</style> 