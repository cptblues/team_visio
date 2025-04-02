import { describe, it, expect } from 'vitest';
// Pour Svelte 5, nous allons simplement vérifier que le module App peut être importé
import App from '../App.svelte';

describe('App', () => {
  it('peut être importé correctement', () => {
    expect(App).toBeTruthy();
  });
}); 