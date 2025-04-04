<script>
  import { isLoggedIn, currentUser, logout } from '../stores/userStore';
  import { push, location, link } from 'svelte-spa-router';
  import { onMount } from 'svelte';
  
  export let title = 'Team Visio';
  
  // État du menu mobile
  let mobileMenuOpen = false;
  let isMenuOpen = false;
  let scrolled = false;
  let logoUrl = '/images/logo.svg';
  
  // Fonction pour basculer l'état du menu mobile
  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }
  
  // Fonction pour détecter le défilement de la page
  function handleScroll() {
    scrolled = window.scrollY > 50;
  }
  
  // Fermer le menu mobile après la navigation
  function navigateTo(path) {
    push(path);
    mobileMenuOpen = false;
  }
  
  // Vérifier si un lien est actif
  function isActive(path) {
    if (path === '/') {
      return $location === '/';
    }
    return $location.startsWith(path);
  }
  
  onMount(() => {
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Vérifier l'état initial du défilement
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });
  
  async function handleLogout() {
    await logout();
    isMenuOpen = false; // Fermer le menu après la déconnexion
  }
</script>

<header class:scrolled={scrolled}>
  <div class="container">
    <div class="logo-container">
      <a href="/" use:link>
        <img src={logoUrl} alt="Team Visio Logo" class="logo" />
        <span class="logo-text">Team Visio</span>
      </a>
    </div>
    
    <nav class:open={isMenuOpen}>
      <ul class="nav-links">
        {#if !isActive('/')}
          <li><a href="/" use:link class:active={isActive('/')} on:click={() => isMenuOpen = false}>Accueil</a></li>
        {/if}
        {#if $isLoggedIn}
          <li><a href="/rooms" use:link class:active={isActive('/rooms')} on:click={() => isMenuOpen = false}>Salles</a></li>
          <li class="user-menu">
            <div class="user-info">
              <img 
                src={$currentUser?.photoURL || '/images/avatar-placeholder.png'} 
                alt="Photo de profil" 
                class="user-avatar"
              />
              <span class="user-name">{$currentUser?.displayName || 'Utilisateur'}</span>
            </div>
            <div class="dropdown-menu">
              <a href="/" class="dropdown-item" on:click|preventDefault={handleLogout}>
                Déconnexion
              </a>
            </div>
          </li>
        {:else}
          <li class="auth-button">
            <a href="/login" use:link class="btn btn-login" on:click={() => isMenuOpen = false}>
              Connexion
            </a>
          </li>
        {/if}
      </ul>
    </nav>
    
    <button class="menu-toggle" aria-label="Toggle menu" on:click={toggleMenu}>
      <span class="bar"></span>
      <span class="bar"></span>
      <span class="bar"></span>
    </button>
  </div>
</header>

<style>
  header {
    position: sticky;
    top: 0;
    z-index: 100;
    background-color: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }
  
  header.scrolled {
    padding: 0.5rem 0;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }
  
  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .logo-container a {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: var(--foreground);
  }
  
  .logo {
    height: 40px;
    margin-right: 0.5rem;
  }
  
  .logo-text {
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--primary-dark);
  }
  
  nav {
    display: flex;
  }
  
  .nav-links {
    display: flex;
    align-items: center;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  
  .nav-links li {
    margin: 0 0.5rem;
  }
  
  .nav-links a {
    display: block;
    padding: 0.5rem 1rem;
    color: var(--foreground);
    text-decoration: none;
    font-weight: 500;
    border-radius: var(--radius-md);
    transition: all 0.2s ease;
  }
  
  .nav-links a:hover,
  .nav-links a.active {
    color: var(--primary);
    background-color: var(--primary-light);
  }
  
  .auth-button {
    margin-left: 1rem;
  }
  
  .btn-login {
    background-color: var(--primary);
    color: white !important;
    padding: 0.5rem 1.5rem !important;
    border-radius: var(--radius-md);
    transition: all 0.3s ease;
  }
  
  .btn-login:hover {
    background-color: var(--primary-dark) !important;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(var(--primary-rgb), 0.3);
  }
  
  .user-menu {
    position: relative;
    margin-left: 1rem;
  }
  
  .user-info {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: var(--radius-md);
    transition: background-color 0.2s ease;
  }
  
  .user-info:hover {
    background-color: var(--background-alt);
  }
  
  .user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid var(--primary-light);
    object-fit: cover;
  }
  
  .user-name {
    margin-left: 0.5rem;
    font-weight: 500;
    max-width: 120px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0;
    width: 200px;
    background-color: white;
    border-radius: var(--radius-md);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    padding: 0.5rem 0;
    margin-top: 0.5rem;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: all 0.3s ease;
    z-index: 10;
  }
  
  .user-menu:hover .dropdown-menu {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
  
  .dropdown-item {
    display: block;
    padding: 0.75rem 1rem;
    color: var(--foreground);
    text-decoration: none;
    transition: background-color 0.2s ease;
  }
  
  .dropdown-item:hover {
    background-color: var(--background-alt);
  }
  
  .menu-toggle {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
  }
  
  .menu-toggle .bar {
    display: block;
    width: 25px;
    height: 3px;
    margin: 5px auto;
    background-color: var(--foreground);
    border-radius: 3px;
    transition: all 0.3s ease;
  }
  
  @media (max-width: 768px) {
    .container {
      padding: 1rem;
    }
    
    .menu-toggle {
      display: block;
      z-index: 20;
    }
    
    nav {
      position: fixed;
      top: 0;
      right: -100%;
      width: 80%;
      max-width: 300px;
      height: 100vh;
      background-color: white;
      box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
      transition: right 0.3s ease;
      padding: 5rem 2rem 2rem;
    }
    
    nav.open {
      right: 0;
    }
    
    .nav-links {
      flex-direction: column;
      align-items: flex-start;
      width: 100%;
    }
    
    .nav-links li {
      margin: 0.5rem 0;
      width: 100%;
    }
    
    .auth-button {
      margin: 1rem 0 0 0;
      width: 100%;
    }
    
    .btn-login {
      width: 100%;
      text-align: center;
    }
    
    .open .bar:nth-child(1) {
      transform: rotate(-45deg) translate(-5px, 6px);
    }
    
    .open .bar:nth-child(2) {
      opacity: 0;
    }
    
    .open .bar:nth-child(3) {
      transform: rotate(45deg) translate(-5px, -6px);
    }
    
    .user-menu {
      width: 100%;
      margin-left: 0;
    }
    
    .dropdown-menu {
      position: static;
      box-shadow: none;
      margin-top: 0.5rem;
      opacity: 1;
      visibility: visible;
      transform: none;
      width: 100%;
    }
  }
</style> 