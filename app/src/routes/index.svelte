<script>
  import Header from '../components/Header.svelte';
  import Hero from '../components/Hero.svelte';
  import Features from '../components/Features.svelte';
  import CallToAction from '../components/CallToAction.svelte';
  import Footer from '../components/Footer.svelte';
</script>

<svelte:head>
  <title>Team Visio - Visioconférences simples et sécurisées</title>
  <meta name="description" content="Créez et rejoignez des visioconférences en un clic avec Team Visio. Aucune installation requise, entièrement sécurisé et gratuit.">
</svelte:head>

<div class="app-container">
  <Header />
  <main>
    <Hero />
    <Features />
    <CallToAction />
  </main>
  <Footer />
</div>

<style>
  :global(:root) {
    /* Importer les styles globaux */
    @import '../styles/global.css';
  }
  
  .app-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
  main {
    flex: 1;
  }
</style> 