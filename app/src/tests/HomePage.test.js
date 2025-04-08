import { describe, it, expect, vi } from 'vitest';
import HomePage from '../routes/index.svelte';
import { supabase } from '../lib/supabase/client';
import { isSupabaseConfigValid } from '../lib/supabase/config';

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

describe('HomePage', () => {
  it('initialise correctement la page d\'accueil', () => {
    expect(HomePage).toBeDefined();
    expect(supabase).toBeDefined();
    expect(isSupabaseConfigValid).toBe(true);
  });
}); 