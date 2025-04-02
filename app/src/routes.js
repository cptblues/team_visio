import Home from './routes/index.svelte';

// Définition des routes de notre application
const routes = {
  // Page d'accueil
  '/': Home,
  
  // Route par défaut - redirige vers la page d'accueil
  '*': Home
};

export default routes; 