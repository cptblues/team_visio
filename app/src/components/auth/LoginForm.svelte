<script>
  import { signInWithEmail } from '../../lib/supabase/auth';
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
      const { user } = await signInWithEmail(email, password);
      currentUser.set(user);
      onSuccess();
    } catch (err) {
      console.error('Erreur de connexion:', err);
      if (err.message?.includes('Invalid login credentials')) {
        error = 'Email ou mot de passe incorrect';
      } else if (err.message?.includes('Invalid email')) {
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
    padding: 0; /* Pas de padding ici car il est déjà fourni par le conteneur parent */
    width: 100%;
    margin: 0 auto;
  }
  
  h2 {
    color: var(--primary-dark);
    margin-bottom: 2rem;
    text-align: center;
    font-size: 1.8rem;
    font-weight: 700;
    position: relative;
    padding-bottom: 0.75rem;
  }
  
  h2::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 4px;
    background: linear-gradient(90deg, var(--primary), var(--primary-light));
    border-radius: 2px;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
    position: relative;
  }
  
  label {
    display: block;
    margin-bottom: 0.6rem;
    font-weight: 500;
    color: var(--foreground);
    font-size: 0.95rem;
  }
  
  input {
    padding: 0.85rem 1rem;
    border-radius: var(--radius-md);
  }
  
  input:focus {
    border-color: var(--primary);
    outline: none;
    box-shadow: 0 0 0 3px var(--primary-light);
  }
  
  .btn-block {
    width: 100%;
    margin-top: 1.5rem;
    padding: 0.85rem;
    font-size: 1.05rem;
    font-weight: 600;
    border-radius: var(--radius-md);
    box-shadow: 0 4px 15px rgba(164, 153, 255, 0.25);
    transition: var(--transition);
  }
  
  .btn-block:hover:not([disabled]) {
    transform: translateY(-3px);
    box-shadow: 0 6px 18px rgba(164, 153, 255, 0.35);
  }
  
  .btn-block:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  .error-message {
    background-color: var(--error-light);
    color: var(--error-dark);
    padding: 0.85rem;
    border-radius: var(--radius-md);
    margin-bottom: 1.25rem;
    text-align: center;
    font-weight: 500;
    border-left: 4px solid var(--error);
    animation: shake 0.5s ease-in-out;
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%, 60% { transform: translateX(-5px); }
    40%, 80% { transform: translateX(5px); }
  }
  
  .auth-switch {
    margin-top: 2rem;
    text-align: center;
    padding-top: 1.5rem;
    border-top: 1px solid var(--border);
  }
  
  .auth-switch p {
    color: var(--foreground-alt);
    font-size: 0.95rem;
  }
  
  .text-button {
    background: none;
    border: none;
    color: var(--primary);
    cursor: pointer;
    font-weight: 600;
    padding: 0.25rem 0.5rem;
    margin-left: 0.25rem;
    border-radius: var(--radius-sm);
    transition: var(--transition);
  }
  
  .text-button:hover {
    color: var(--primary-dark);
    background-color: var(--primary-light);
    text-decoration: none;
  }
</style> 