<script>
  import Header from '../components/Header.svelte';
  import Hero from '../components/Hero.svelte';
  import Features from '../components/Features.svelte';
  import CallToAction from '../components/CallToAction.svelte';
  import Footer from '../components/Footer.svelte';
  import AuthContainer from '../components/auth/AuthContainer.svelte';
  import UserProfile from '../components/auth/UserProfile.svelte';
  import RoomList from '../components/rooms/RoomList.svelte';
  import { currentUser } from '../stores/userStore';
  import FirebaseDebugger from '../components/FirebaseDebugger.svelte';
  
  let showAuthSection = false;
  
  function toggleAuthSection() {
    showAuthSection = !showAuthSection;
  }
  
  function handleAuthSuccess() {
    showAuthSection = false;
  }
</script>

<svelte:head>
  <title>Team Visio - Visioconférences simples et sécurisées</title>
  <meta name="description" content="Créez et rejoignez des visioconférences en un clic avec Team Visio. Aucune installation requise, entièrement sécurisé et gratuit.">
</svelte:head>

<div class="app-container">
  <Header />
  <main>
    <Hero onOpenAuth={toggleAuthSection} />
    
    {#if showAuthSection || $currentUser}
      <section class="user-section">
        <div class="container">
          {#if $currentUser}
            <div class="profile-container">
              <h2 class="section-title">Votre profil</h2>
              <UserProfile />
            </div>
          {:else}
            <AuthContainer onAuthSuccess={handleAuthSuccess} />
          {/if}
        </div>
      </section>
    {/if}
    
    <section class="rooms-section">
      <div class="container">
        <RoomList />
      </div>
    </section>
    
    <Features />
    <CallToAction />
    
    {#if import.meta.env.DEV}
      <FirebaseDebugger />
    {/if}
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
  
  .user-section {
    padding: 3rem 0;
    background-color: var(--background-alt);
  }
  
  .profile-container {
    max-width: 600px;
    margin: 0 auto;
  }
  
  .section-title {
    text-align: center;
    margin-bottom: 2rem;
    color: var(--foreground);
  }
  
  .rooms-section {
    padding: 3rem 0;
  }
  
  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }
</style> 