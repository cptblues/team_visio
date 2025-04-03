import { describe, it, expect, vi } from 'vitest';
import { registerUser, loginUser, logoutUser } from '../lib/firebase/auth';
import { currentUser, initUserStore, resetUserStore } from '../stores/userStore';
import LoginForm from '../components/auth/LoginForm.svelte';
import RegisterForm from '../components/auth/RegisterForm.svelte';
import AuthContainer from '../components/auth/AuthContainer.svelte';
import UserProfile from '../components/auth/UserProfile.svelte';

// Mock des fonctions d'authentification Firebase
vi.mock('../lib/firebase/auth', () => ({
  registerUser: vi.fn(),
  loginUser: vi.fn(),
  logoutUser: vi.fn(),
  onAuthChange: vi.fn((callback) => {
    // Appeler le callback immédiatement avec un utilisateur null
    callback(null);
    return vi.fn(); // Retourner une fonction de désabonnement mock
  })
}));

describe('Composants d\'authentification', () => {
  it('Les composants d\'authentification sont définis correctement', () => {
    expect(LoginForm).toBeDefined();
    expect(RegisterForm).toBeDefined();
    expect(AuthContainer).toBeDefined();
    expect(UserProfile).toBeDefined();
  });
  
  it('Les fonctions d\'authentification sont définies correctement', () => {
    expect(registerUser).toBeDefined();
    expect(loginUser).toBeDefined();
    expect(logoutUser).toBeDefined();
  });
  
  it('Le store utilisateur est défini et initialisable', () => {
    expect(currentUser).toBeDefined();
    expect(initUserStore).toBeDefined();
    expect(resetUserStore).toBeDefined();
    
    const unsubscribe = initUserStore();
    expect(unsubscribe).toBeDefined();
  });
}); 