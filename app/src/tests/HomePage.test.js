import { describe, it, expect, vi } from 'vitest';
import Home from '../routes/index.svelte';

describe('Page d\'accueil', () => {
  it('Devrait être définie correctement', () => {
    expect(Home).toBeDefined();
  });
}); 