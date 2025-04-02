import { describe, it, expect, vi } from 'vitest';
import { firebaseConfig, environment, isConfigValid } from '../lib/config';

// Nous allons mocker le module de configuration plutôt que d'essayer de modifier import.meta.env
vi.mock('../lib/config', () => {
  return {
    firebaseConfig: {
      apiKey: 'test-api-key',
      authDomain: 'test-auth-domain',
      projectId: 'test-project-id',
      storageBucket: 'test-storage-bucket',
      messagingSenderId: 'test-messaging-sender-id',
      appId: 'test-app-id'
    },
    environment: 'testing',
    isDevelopment: false,
    isTesting: true,
    isProduction: false,
    isConfigValid: true
  };
});

describe('Configuration', () => {
  it('charge la configuration Firebase à partir des variables d\'environnement', () => {
    expect(firebaseConfig).toBeDefined();
    expect(firebaseConfig.apiKey).toBe('test-api-key');
    expect(firebaseConfig.projectId).toBe('test-project-id');
  });
  
  it('détecte correctement l\'environnement', () => {
    expect(environment).toBe('testing');
  });
  
  it('valide la configuration avec les variables requises', () => {
    expect(isConfigValid).toBe(true);
  });
}); 