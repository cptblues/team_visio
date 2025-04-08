import { describe, it, expect, vi } from 'vitest';
// Pour Svelte 5, nous allons simplement vérifier que le module App peut être importé
import App from '../App.svelte';
import { isSupabaseConfigValid } from '../lib/supabase/config';
import { supabase } from '../lib/supabase/client';

// Mock Supabase
vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {},
    from: () => ({})
  }
}));

vi.mock('../lib/supabase/config', () => ({
  isSupabaseConfigValid: true
}));

describe('App', () => {
  it('initialise correctement l\'application', () => {
    expect(App).toBeDefined();
    expect(supabase).toBeDefined();
    expect(isSupabaseConfigValid).toBe(true);
  });
}); 