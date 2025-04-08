<script>
  import { signOut } from '../../lib/supabase';
  import { currentUser, resetUserStore } from '../../stores/userStore';
  
  let loading = false;
  
  async function handleLogout() {
    try {
      loading = true;
      await signOut();
      resetUserStore();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      loading = false;
    }
  }
</script>

<div class="user-profile">
  {#if $currentUser}
    <div class="profile-content">
      <div class="user-info">
        <div class="avatar">
          <div class="avatar-placeholder">
            {$currentUser.display_name ? $currentUser.display_name[0].toUpperCase() : 'U'}
          </div>
        </div>
        <div class="user-details">
          <h3>{$currentUser.display_name || 'Utilisateur'}</h3>
          <p class="user-email">{$currentUser.email}</p>
          {#if $currentUser.is_admin}
            <span class="admin-badge">Administrateur</span>
          {/if}
        </div>
      </div>
      <div class="profile-actions">
        <button 
          class="btn btn-outline"
          on:click={handleLogout}
          disabled={loading}
        >
          {loading ? 'Déconnexion...' : 'Se déconnecter'}
        </button>
      </div>
    </div>
  {:else}
    <p>Veuillez vous connecter pour voir votre profil.</p>
  {/if}
</div>

<style>
  .user-profile {
    background-color: var(--background);
    padding: 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }
  
  .profile-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .user-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .avatar {
    flex-shrink: 0;
  }
  
  .avatar-placeholder {
    width: 50px;
    height: 50px;
    background-color: var(--primary);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: bold;
  }
  
  .user-details h3 {
    margin: 0;
    color: var(--foreground);
  }
  
  .user-email {
    margin: 0.25rem 0 0.5rem;
    color: var(--foreground-alt);
    font-size: 0.9rem;
  }
  
  .admin-badge {
    display: inline-block;
    background-color: var(--primary-light);
    color: var(--primary-dark);
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    font-weight: 500;
  }
  
  @media (max-width: 768px) {
    .profile-content {
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .user-info {
      flex-direction: column;
      text-align: center;
    }
    
    .profile-actions {
      width: 100%;
    }
    
    .profile-actions button {
      width: 100%;
    }
  }
</style> 