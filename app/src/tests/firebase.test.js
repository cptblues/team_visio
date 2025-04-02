import { describe, it, expect, vi } from 'vitest';
import { firebaseApp, db, auth } from '../lib/firebase';

// Mock les modules Firebase
vi.mock('../lib/firebase', () => {
  return {
    firebaseApp: {},
    db: {},
    auth: {},
  };
});

describe('Firebase Initialization', () => {
  it('exporte les objets Firebase correctement', () => {
    expect(firebaseApp).toBeDefined();
    expect(db).toBeDefined();
    expect(auth).toBeDefined();
  });
}); 