<script>
  import { registerUser } from '../../lib/firebase/auth';
  import { currentUser } from '../../stores/userStore';
  
  export let onSuccess = () => {};
  export let onToggleForm = () => {};
  
  let email = '';
  let password = '';
  let confirmPassword = '';
  let displayName = '';
  let error = '';
  let loading = false;
  
  async function handleRegister() {
    if (!email || !password || !confirmPassword || !displayName) {
      error = 'Veuillez remplir tous les champs';
      return;
    }
    
    if (password !== confirmPassword) {
      error = 'Les mots de passe ne correspondent pas';
      return;
    }
    
    if (password.length < 6) {
      error = 'Le mot de passe doit contenir au moins 6 caractères';
      return;
    }
    
    try {
      loading = true;
      error = '';
      const user = await registerUser(email, password, displayName);
      currentUser.set(user);
      onSuccess();
    } catch (err) {
      console.error('Erreur d\'inscription:', err);
      if (err.code === 'auth/email-already-in-use') {
        error = 'Cet email est déjà utilisé';
      } else if (err.code === 'auth/invalid-email') {
        error = 'Format d\'email invalide';
      } else if (err.code === 'auth/weak-password') {
        error = 'Le mot de passe est trop faible';
      } else {
        error = 'Erreur lors de l\'inscription. Veuillez réessayer.';
      }
    } finally {
      loading = false;
    }
  }
</script>

<div class="auth-form">
  <h2>Inscription</h2>
  
  <form on:submit|preventDefault={handleRegister}>
    <div class="form-group">
      <label for="displayName">Nom d'utilisateur</label>
      <input 
        type="text" 
        id="displayName" 
        bind:value={displayName} 
        placeholder="Votre nom d'utilisateur" 
        disabled={loading}
        required
      />
    </div>
    
    <div class="form-group">
      <label for="email">Email</label>
      <input 
        type="email" 
        id="email" 
        bind:value={email} 
        placeholder="votre@email.com" 
        disabled={loading}
        required
      />
    </div>
    
    <div class="form-group">
      <label for="password">Mot de passe</label>
      <input 
        type="password" 
        id="password" 
        bind:value={password} 
        placeholder="Minimum 6 caractères" 
        disabled={loading}
        required
      />
    </div>
    
    <div class="form-group">
      <label for="confirmPassword">Confirmer le mot de passe</label>
      <input 
        type="password" 
        id="confirmPassword" 
        bind:value={confirmPassword} 
        placeholder="Confirmez votre mot de passe" 
        disabled={loading}
        required
      />
    </div>
    
    {#if error}
      <div class="error-message">{error}</div>
    {/if}
    
    <button type="submit" class="btn btn-primary btn-block" disabled={loading}>
      {loading ? 'Inscription en cours...' : 'S\'inscrire'}
    </button>
  </form>
  
  <div class="auth-switch">
    <p>Déjà un compte ? <button class="text-button" on:click={onToggleForm}>Se connecter</button></p>
  </div>
</div>

<style>
  .auth-form {
    background-color: var(--background);
    padding: 2rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    width: 100%;
    margin: 0 auto;
  }
  
  h2 {
    color: var(--primary);
    margin-bottom: 1.5rem;
    text-align: center;
  }
  
  .form-group {
    margin-bottom: 1.25rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
  
  input {
    padding: 0.75rem;
    border-radius: 0.25rem;
  }
  
  input:focus {
    border-color: var(--primary);
    outline: none;
    box-shadow: 0 0 0 2px var(--primary-light);
  }
  
  .btn-block {
    width: 100%;
    margin-top: 1rem;
    padding: 0.75rem;
  }
  
  .error-message {
    background-color: var(--error);
    color: white;
    padding: 0.5rem;
    border-radius: 0.25rem;
    margin-bottom: 1rem;
    text-align: center;
  }
  
  .auth-switch {
    margin-top: 1.5rem;
    text-align: center;
  }
  
  .text-button {
    background: none;
    border: none;
    color: var(--primary);
    cursor: pointer;
    font-weight: 500;
    padding: 0;
    text-decoration: underline;
  }
  
  .text-button:hover {
    color: var(--primary-dark);
  }
</style> 