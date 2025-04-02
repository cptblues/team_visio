<script>
  import svelteLogo from './assets/svelte.svg'
  import viteLogo from '/vite.svg'
  import Counter from './lib/Counter.svelte'
  import { firebaseConfig, environment, isConfigValid } from './lib/config'
  
  // Affichage des variables d'environnement dans la console
  console.log('Environnement actuel:', environment);
  console.log('Configuration valide:', isConfigValid);
  
  // Pour éviter d'exposer les clés API complètes en production
  if (!import.meta.env.PROD) {
    console.log('Firebase Project ID:', firebaseConfig.projectId);
  }
</script>

<main>
  <div>
    <a href="https://vite.dev" target="_blank" rel="noreferrer">
      <img src={viteLogo} class="logo" alt="Vite Logo" />
    </a>
    <a href="https://svelte.dev" target="_blank" rel="noreferrer">
      <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
    </a>
  </div>
  <h1>Team Visio</h1>
  <h2>Environnement: {environment}</h2>

  <div class="card">
    <Counter />
  </div>

  <p>
    Application de rencontre virtuelle simplifiée construite avec Svelte et Firebase.
  </p>

  <p class="read-the-docs">
    Configuration {isConfigValid ? 'valide' : 'invalide'}
  </p>
</main>

<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
  .read-the-docs {
    color: #888;
  }
</style>
