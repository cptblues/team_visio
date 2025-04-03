import Home from './routes/index.svelte';
import Room from './routes/room.svelte';

// Définition des routes de notre application
const routes = {
  // Page d'accueil
  '/': Home,
  
  // Route vers la page de salle
  '/room/:id': Room,
  
  // Route par défaut - redirige vers la page d'accueil
  '*': Home
};

export default routes; 