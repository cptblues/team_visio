import { describe, it, expect, vi, beforeEach } from 'vitest';
import RoomList from '../components/rooms/RoomList.svelte';

// Mock des stores
vi.mock('../stores/userStore', () => {
  return {
    isLoggedIn: {
      subscribe: vi.fn((callback) => {
        callback(false);
        return () => {};
      })
    }
  };
});

describe('Composant Liste des Salles', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('peut être importé correctement', () => {
    expect(RoomList).toBeTruthy();
  });
}); 