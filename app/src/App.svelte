<script>
  import { onMount } from 'svelte';
  import { isSupabaseConfigValid } from './lib/supabase/config';
  import { initUserStore } from './stores/userStore';
  import './styles/global.css';
  import Router from 'svelte-spa-router';
  import routes from './routes';
  import Toast from './components/ui/Toast.svelte';

  let appInitialized = false;
  let unsubscribe = null;

  onMount(() => {
    console.log('Configuration Supabase valide:', isSupabaseConfigValid);
    
    if (isSupabaseConfigValid) {
      console.log('Supabase initialisé avec succès');
      appInitialized = true;
      
      // Initialiser l'écoute de l'état d'authentification
      initUserStore().then(unsub => {
        unsubscribe = unsub;
      });
    } else {
      console.error('Erreur d\'initialisation de Supabase');
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
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
