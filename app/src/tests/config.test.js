import { describe, it, expect, vi } from 'vitest';
import { environment, isProduction } from '../lib/config';

describe('Configuration de l\'application', () => {
  it('définit correctement l\'environnement', () => {
    expect(environment).toBeDefined();
    expect(['development', 'testing', 'production']).toContain(environment);
  });

  it('détecte correctement l\'environnement de production', () => {
    expect(isProduction).toBeDefined();
    expect(typeof isProduction).toBe('boolean');
  });
}); 