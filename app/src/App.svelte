<script>
  import { onMount } from 'svelte';
  import { firebaseApp, auth, db } from './lib/firebase';
  import { isConfigValid, environment } from './lib/config';
  import { initUserStore } from './stores/userStore';
  import './styles/global.css';
  import Router from 'svelte-spa-router';
  import routes from './routes';
  import Toast from './components/ui/Toast.svelte';

  let appInitialized = false;

  onMount(() => {
    console.log('Environnement:', environment);
    console.log('Configuration valide:', isConfigValid);
    
    if (firebaseApp && auth && db) {
      console.log('Firebase initialisé avec succès');
      appInitialized = true;
      
      // Initialiser l'écoute de l'état d'authentification
      const unsubscribe = initUserStore();
      
      return () => {
        if (unsubscribe) unsubscribe();
      };
    } else {
      console.error('Erreur d\'initialisation de Firebase');
    }
  });
</script>

<main>
  <Router {routes} />
  <!-- Système de toast pour les notifications globales -->
  <Toast />
</main>

<style>
  main {
    width: 100%;
    min-height: 100vh;
  }
</style>
