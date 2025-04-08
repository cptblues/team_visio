<script>
  import Header from '../components/Header.svelte';
  import Hero from '../components/Hero.svelte';
  import Features from '../components/Features.svelte';
  import Footer from '../components/Footer.svelte';
  import { onMount } from 'svelte';
  import { isSupabaseConfigValid } from '../lib/supabase/config';
  import { initUserStore } from '../stores/userStore';
  
  // Supabase initialization status
  let supabaseInitialized = false;
  
  onMount(async () => {
    try {
      if (isSupabaseConfigValid) {
        supabaseInitialized = true;
        
        // Initialize user authentication store
        initUserStore();
      }
    } catch (error) {
      console.error('Error initializing Supabase:', error);
    }
  });
</script>

<svelte:head>
  <title>Team Visio - Visioconférences simples et sécurisées</title>
  <meta name="description" content="Créez et rejoignez des visioconférences en un clic avec Team Visio. Aucune installation requise, entièrement sécurisé et gratuit.">
</svelte:head>

<div class="app">
  <Header />
  
  <main>
    <Hero />
    <Features />
  </main>
  
  <Footer />
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
  main {
    flex: 1;
    width: 100%;
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 0 var(--spacing);
  }
  
  @media (max-width: 768px) {
    main {
      padding: 0 var(--spacing-sm);
    }
  }
</style> 