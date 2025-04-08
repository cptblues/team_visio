import { describe, it, expect, vi } from 'vitest';
import { signInWithEmail, signUpWithEmail, signOut } from '../lib/supabase/auth';
import { currentUser } from '../stores/userStore';

// Mock des fonctions d'authentification Supabase
vi.mock('../lib/supabase', () => ({
  signInWithEmail: vi.fn(),
  signUpWithEmail: vi.fn(),
  signOut: vi.fn()
}));

describe('Composants d\'authentification', () => {
  it('Le store utilisateur est défini et initialisable', () => {
    expect(currentUser).toBeDefined();
    expect(typeof currentUser.subscribe).toBe('function');
  });

  it('Les fonctions d\'authentification sont disponibles', () => {
    expect(signInWithEmail).toBeDefined();
    expect(signUpWithEmail).toBeDefined();
    expect(signOut).toBeDefined();
  });
}); 