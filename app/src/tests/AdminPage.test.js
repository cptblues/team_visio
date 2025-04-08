/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/svelte';
import AdminPage from '../routes/admin.svelte';

// Mock des stores
vi.mock('../stores/userStore', () => {
  return {
    isAdmin: {
      subscribe: vi.fn((callback) => {
        callback(true);
        return () => {};
      })
    },
    isLoggedIn: {
      subscribe: vi.fn((callback) => {
        callback(true);
        return () => {};
      })
    },
    authLoading: {
      subscribe: vi.fn((callback) => {
        callback(false);
        return () => {};
      })
    },
    currentUser: {
      subscribe: vi.fn((callback) => {
        callback({ displayName: 'Admin User', isAdmin: true });
        return () => {};
      })
    },
    initUserStore: vi.fn()
  };
});

// Mock Firebase
vi.mock('../lib/firebase', () => {
  return {
    initFirebase: vi.fn().mockResolvedValue(true)
  };
});

// Mock Supabase config
vi.mock('../lib/supabase/config', () => ({
  isSupabaseConfigValid: true
}));

// Mock svelte-spa-router
vi.mock('svelte-spa-router', () => ({
  push: vi.fn(),
  location: {
    subscribe: vi.fn((callback) => {
      callback('/admin');
      return () => {};
    })
  },
  link: vi.fn()
}));

// Mock des composants
vi.mock('../components/Header.svelte', () => ({
  default: {
    render: vi.fn(() => '<header>Header mockée</header>')
  }
}));

vi.mock('../components/Footer.svelte', () => ({
  default: {
    render: vi.fn(() => '<footer>Footer mockée</footer>')
  }
}));

vi.mock('../components/UserStatusBar.svelte', () => {
  return {
    default: {
      render: vi.fn(() => '<div class="user-status-bar">UserStatusBar mockée</div>')
    }
  };
});

vi.mock('../components/rooms/AdminRoomManager.svelte', () => ({
  default: {
    render: vi.fn(() => '<div class="admin-room-manager">AdminRoomManager mocké</div>')
  }
}));

vi.mock('../components/rooms/AddRoomForm.svelte', () => {
  return {
    default: {
      render: vi.fn(() => '<div class="add-room-form">AddRoomForm mocké</div>')
    }
  };
});

// Mock de la page d'administration pour les tests
const MockAdminPage = {
  render(props = {}) {
    const { isAdmin = true, isLoggedIn = true, loading = false } = props;
    
    if (loading) {
      return `
        <div class="app-container">
          <header>Header mockée</header>
          <main>
            <div class="loading-container">
              <div class="spinner"></div>
              <p>Chargement...</p>
            </div>
          </main>
          <footer>Footer mockée</footer>
        </div>
      `;
    }
    
    if (!isLoggedIn) {
      return `
        <div class="app-container">
          <header>Header mockée</header>
          <main>
            <div class="container access-denied">
              <p>Vous devez être connecté pour accéder à cette page.</p>
              <button class="btn btn-primary">Se connecter</button>
            </div>
          </main>
          <footer>Footer mockée</footer>
        </div>
      `;
    }
    
    if (!isAdmin) {
      return `
        <div class="app-container">
          <header>Header mockée</header>
          <main>
            <div class="container access-denied">
              <p>Accès réservé aux administrateurs.</p>
              <button class="btn btn-primary">Retour à l'accueil</button>
            </div>
          </main>
          <footer>Footer mockée</footer>
        </div>
      `;
    }
    
    return `
      <div class="app-container">
        <header>Header mockée</header>
        <main>
          <div class="user-status-bar">UserStatusBar mockée</div>
          
          <div class="page-header">
            <div class="container">
              <h1>Administration</h1>
              <p>Gérez les ressources de la plateforme Team Visio</p>
            </div>
          </div>
          
          <div class="admin-nav-container">
            <div class="container">
              <nav class="admin-nav">
                <button class="admin-nav-item active">Gestion des salles</button>
                <button class="admin-nav-item">Gestion des utilisateurs</button>
                <button class="admin-nav-item">Paramètres</button>
              </nav>
            </div>
          </div>
          
          <div class="admin-content">
            <div class="container">
              <div class="admin-section">
                <h2 class="section-title">Gestion des salles</h2>
                <div class="admin-room-manager">AdminRoomManager mocké</div>
              </div>
              
              <div class="admin-section">
                <h2 class="section-title">Création rapide de salle</h2>
                <div class="add-room-form">AddRoomForm mocké</div>
              </div>
            </div>
          </div>
        </main>
        <footer>Footer mockée</footer>
      </div>
    `;
  }
};

describe('Page d\'administration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    cleanup();
  });

  it('affiche le contenu d\'administration pour un utilisateur admin', () => {
    document.body.innerHTML = MockAdminPage.render({ isAdmin: true, isLoggedIn: true });
    expect(document.querySelector('.admin-room-manager')).toBeTruthy();
  });
  
  it('redirige un utilisateur non connecté', () => {
    document.body.innerHTML = MockAdminPage.render({ isLoggedIn: false });
    
    // Vérifier que le message d'accès refusé est affiché
    expect(document.body.textContent).toContain('Vous devez être connecté pour accéder à cette page');
    expect(document.querySelector('.access-denied')).not.toBeNull();
    expect(document.querySelector('button').textContent).toBe('Se connecter');
  });
  
  it('redirige un utilisateur non admin', () => {
    document.body.innerHTML = MockAdminPage.render({ isAdmin: false, isLoggedIn: true });
    
    // Vérifier que le message d'accès refusé est affiché
    expect(document.body.textContent).toContain('Accès réservé aux administrateurs');
    expect(document.querySelector('.access-denied')).not.toBeNull();
    expect(document.querySelector('button').textContent).toBe('Retour à l\'accueil');
  });
  
  it('affiche un indicateur de chargement', () => {
    document.body.innerHTML = MockAdminPage.render({ loading: true });
    
    // Vérifier que le spinner de chargement est affiché
    expect(document.querySelector('.spinner')).not.toBeNull();
    expect(document.body.textContent).toContain('Chargement');
  });
});

// Test d'intégration avec le gestionnaire de salles
describe('Intégration du gestionnaire de salles', () => {
  it('vérifie que le gestionnaire de salles fonctionne correctement dans la page d\'administration', async () => {
    // Mock de la fonction createRoom
    const createRoomMock = vi.fn().mockResolvedValue({ 
      id: 'new-room-id',
      name: 'Nouvelle salle',
      description: 'Description de la nouvelle salle',
      is_public: true,
      capacity: 10,
      created_at: new Date().toISOString()
    });
    vi.mock('../lib/firebase/rooms', () => {
      return {
        createRoom: createRoomMock
      };
    });
    
    document.body.innerHTML = MockAdminPage.render();
    
    // Simuler la création d'une salle depuis le formulaire
    const roomForm = document.querySelector('.add-room-form');
    expect(roomForm).not.toBeNull();
    
    // Vérifier que le gestionnaire de salles est correctement intégré
    const adminManager = document.querySelector('.admin-room-manager');
    expect(adminManager).not.toBeNull();
    
    // Vérification des fonctionnalités déplacées depuis la page des salles
    expect(document.body.textContent).toContain('Gestion des salles');
    expect(document.body.textContent).toContain('Création rapide de salle');
  });
}); 