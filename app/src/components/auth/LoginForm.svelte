<script>
  import { loginUser } from '../../lib/firebase/auth';
  import { currentUser } from '../../stores/userStore';
  
  export let onSuccess = () => {};
  export let onToggleForm = () => {};
  
  let email = '';
  let password = '';
  let error = '';
  let loading = false;
  
  async function handleLogin() {
    if (!email || !password) {
      error = 'Veuillez remplir tous les champs';
      return;
    }
    
    try {
      loading = true;
      error = '';
      const user = await loginUser(email, password);
      currentUser.set(user);
      onSuccess();
    } catch (err) {
      console.error('Erreur de connexion:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        error = 'Email ou mot de passe incorrect';
      } else if (err.code === 'auth/invalid-email') {
        error = 'Format d\'email invalide';
      } else {
        error = 'Erreur lors de la connexion. Veuillez réessayer.';
      }
    } finally {
      loading = false;
    }
  }
</script>

<div class="auth-form">
  <h2>Connexion</h2>
  
  <form on:submit|preventDefault={handleLogin}>
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
        placeholder="Votre mot de passe" 
        disabled={loading}
        required
      />
    </div>
    
    {#if error}
      <div class="error-message">{error}</div>
    {/if}
    
    <button type="submit" class="btn btn-primary btn-block" disabled={loading}>
      {loading ? 'Connexion en cours...' : 'Se connecter'}
    </button>
  </form>
  
  <div class="auth-switch">
    <p>Pas encore de compte ? <button class="text-button" on:click={onToggleForm}>S'inscrire</button></p>
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
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--border);
    border-radius: 0.25rem;
    font-size: 1rem;
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