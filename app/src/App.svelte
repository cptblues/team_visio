<script>
  import { onMount } from 'svelte';
  import { firebaseApp, auth, db } from './lib/firebase';
  import { isConfigValid, environment } from './lib/config';
  import './styles/global.css';
  import Router from 'svelte-spa-router';
  import routes from './routes';

  let appInitialized = false;

  onMount(() => {
    console.log('Environnement:', environment);
    console.log('Configuration valide:', isConfigValid);
    
    if (firebaseApp && auth && db) {
      console.log('Firebase initialisé avec succès');
      appInitialized = true;
    } else {
      console.error('Erreur d\'initialisation de Firebase');
    }
  });
</script>

<main>
  <Router {routes} />
</main>

<style>
  main {
    width: 100%;
    min-height: 100vh;
  }
</style>
