// Ce fichier contient les configurations globales pour les tests avec Vitest
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/svelte';

// Nettoyage automatique après chaque test
afterEach(() => {
  cleanup();
}); 