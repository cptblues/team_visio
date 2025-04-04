import Home from './routes/index.svelte';
import Room from './routes/room.svelte';
import Login from './routes/login.svelte';
import Rooms from './routes/rooms.svelte';

// Définition des routes de notre application
const routes = {
  // Page d'accueil
  '/': Home,
  
  // Route vers la page des salles
  '/rooms': Rooms,
  
  // Route vers la page de salle
  '/room/:id': Room,
  
  // Route vers la page de connexion/inscription
  '/login': Login,
  
  // Route par défaut - redirige vers la page d'accueil
  '*': Home
};

export default routes; 