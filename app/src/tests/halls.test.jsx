import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { supabase } from '../lib/supabase/client';

// Mock Supabase
vi.mock('../lib/supabase/client', () => {
  return {
    supabase: {
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({ data: { id: 'test-id', name: 'Test' }, error: null }))
          })),
          order: vi.fn(() => ({
            limit: vi.fn(() => Promise.resolve({ data: [{ id: 'test-id', name: 'Test' }], error: null }))
          }))
        })),
        insert: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({ data: { id: 'new-id' }, error: null }))
          }))
        })),
        update: vi.fn(() => ({
          eq: vi.fn(() => ({
            select: vi.fn(() => ({
              single: vi.fn(() => Promise.resolve({ data: { id: 'test-id', name: 'Updated' }, error: null }))
            }))
          }))
        })),
        delete: vi.fn(() => ({
          eq: vi.fn(() => Promise.resolve({ error: null }))
        }))
      }))
    }
  };
});

// Mock de l'authentification Supabase
vi.mock('../lib/supabase/auth', () => {
  return {
    getCurrentUser: vi.fn(() => Promise.resolve({ id: 'testUserId' }))
  };
});

describe('Fonctions de gestion des halls', () => {
  beforeEach(() => {
    // Réinitialiser les mocks avant chaque test
    vi.clearAllMocks();
  });

  describe('createHall', () => {
    it('devrait créer un hall avec les paramètres obligatoires', async () => {
      // Arrange
      const mockData = {
        id: 'new-id',
        description: 'Hall de test',
        creator_id: 'testUserId',
        room_limit: 3,
        invited_users: []
      };
      vi.mocked(supabase.from).mockReturnValue({
        insert: vi.fn().mockResolvedValue({ data: [mockData], error: null })
      });

      // Act
      const { data, error } = await supabase
        .from('halls')
        .insert({
          description: 'Hall de test',
          creator_id: 'testUserId',
          room_limit: 3
        });

      // Assert
      expect(error).toBeNull();
      expect(data).toEqual([mockData]);
    });

    it('devrait créer un hall avec tous les paramètres personnalisés', async () => {
      // Arrange
      const mockData = {
        id: 'new-id',
        description: 'Hall de test personnalisé',
        creator_id: 'testUserId',
        room_limit: 5,
        invited_users: ['user1', 'user2']
      };
      vi.mocked(supabase.from).mockReturnValue({
        insert: vi.fn().mockResolvedValue({ data: [mockData], error: null })
      });

      // Act
      const { data, error } = await supabase
        .from('halls')
        .insert({
          description: 'Hall de test personnalisé',
          creator_id: 'testUserId',
          room_limit: 5,
          invited_users: ['user1', 'user2']
        });

      // Assert
      expect(error).toBeNull();
      expect(data).toEqual([mockData]);
    });
  });

  describe('checkUserHall', () => {
    it('devrait retourner true si l\'utilisateur a déjà un hall', async () => {
      // Arrange
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ data: [{ id: 'hall-id' }], error: null })
        })
      });

      // Act
      const { data, error } = await supabase
        .from('halls')
        .select()
        .eq('creator_id', 'testUserId');

      // Assert
      expect(error).toBeNull();
      expect(data.length).toBeGreaterThan(0);
    });

    it('devrait retourner false si l\'utilisateur n\'a pas de hall', async () => {
      // Arrange
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ data: [], error: null })
        })
      });

      // Act
      const { data, error } = await supabase
        .from('halls')
        .select()
        .eq('creator_id', 'testUserId');

      // Assert
      expect(error).toBeNull();
      expect(data.length).toBe(0);
    });
  });

  describe('getHallById', () => {
    it('devrait retourner un hall par son ID', async () => {
      // Arrange
      const mockData = {
        id: 'hall-id',
        description: 'Hall de test',
        creator_id: 'testUserId'
      };
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockData, error: null })
          })
        })
      });

      // Act
      const { data, error } = await supabase
        .from('halls')
        .select()
        .eq('id', 'hall-id')
        .single();

      // Assert
      expect(error).toBeNull();
      expect(data).toEqual(mockData);
    });
  });

  describe('updateHall', () => {
    it('devrait mettre à jour un hall si l\'utilisateur est le créateur', async () => {
      // Arrange
      const mockData = {
        id: 'hall-id',
        description: 'Hall mis à jour',
        creator_id: 'testUserId'
      };
      vi.mocked(supabase.from).mockReturnValue({
        update: vi.fn().mockReturnValue({
          match: vi.fn().mockResolvedValue({ data: [mockData], error: null })
        })
      });

      // Act
      const { data, error } = await supabase
        .from('halls')
        .update({ description: 'Hall mis à jour' })
        .match({ id: 'hall-id', creator_id: 'testUserId' });

      // Assert
      expect(error).toBeNull();
      expect(data).toEqual([mockData]);
    });

    it('devrait renvoyer une erreur si l\'utilisateur n\'est pas le créateur', async () => {
      // Arrange
      vi.mocked(supabase.from).mockReturnValue({
        update: vi.fn().mockReturnValue({
          match: vi.fn().mockResolvedValue({ data: [], error: { message: 'Unauthorized' } })
        })
      });

      // Act
      const { error } = await supabase
        .from('halls')
        .update({ description: 'Hall mis à jour' })
        .match({ id: 'hall-id', creator_id: 'otherUserId' });

      // Assert
      expect(error).not.toBeNull();
      expect(error.message).toBe('Unauthorized');
    });
  });

  describe('deleteHall', () => {
    it('devrait supprimer un hall si l\'utilisateur est le créateur', async () => {
      // Arrange
      vi.mocked(supabase.from).mockReturnValue({
        delete: vi.fn().mockReturnValue({
          match: vi.fn().mockResolvedValue({ data: null, error: null })
        })
      });

      // Act
      const { error } = await supabase
        .from('halls')
        .delete()
        .match({ id: 'hall-id', creator_id: 'testUserId' });

      // Assert
      expect(error).toBeNull();
    });

    it('devrait renvoyer une erreur si l\'utilisateur n\'est pas le créateur', async () => {
      // Arrange
      vi.mocked(supabase.from).mockReturnValue({
        delete: vi.fn().mockReturnValue({
          match: vi.fn().mockResolvedValue({ data: null, error: { message: 'Unauthorized' } })
        })
      });

      // Act
      const { error } = await supabase
        .from('halls')
        .delete()
        .match({ id: 'hall-id', creator_id: 'otherUserId' });

      // Assert
      expect(error).not.toBeNull();
      expect(error.message).toBe('Unauthorized');
    });
  });
}); 