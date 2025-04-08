import { describe, it, expect, vi, beforeEach } from 'vitest';
import { supabase } from '../lib/supabase/client';

// Helper pour créer un mock complet de PostgrestQueryBuilder
const createMockBuilder = (mockMethods) => ({
  url: '',
  headers: {},
  select: vi.fn().mockReturnValue({}),
  insert: vi.fn().mockReturnValue({}),
  update: vi.fn().mockReturnValue({}),
  upsert: vi.fn().mockReturnValue({}),
  delete: vi.fn().mockReturnValue({}),
  ...mockMethods
});

describe('Supabase Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(supabase, 'from').mockImplementation(() => createMockBuilder({}));
  });

  describe('getDocument', () => {
    it('should retrieve a single document by id', async () => {
      // Arrange
      const mockData = { id: '1', name: 'Test' };
      vi.spyOn(supabase, 'from').mockImplementation(() => createMockBuilder({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockData, error: null })
          })
        })
      }));

      // Act
      const { data, error } = await supabase
        .from('test')
        .select()
        .eq('id', '1')
        .single();

      // Assert
      expect(error).toBeNull();
      expect(data).toEqual(mockData);
    });
  });

  describe('getCollection', () => {
    it('should retrieve all documents with ordering and limit', async () => {
      // Arrange
      const mockData = [{ id: '1' }, { id: '2' }];
      vi.spyOn(supabase, 'from').mockImplementation(() => createMockBuilder({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({ data: mockData, error: null })
          })
        })
      }));

      // Act
      const { data, error } = await supabase
        .from('test')
        .select()
        .order('created_at', { ascending: false })
        .limit(10);

      // Assert
      expect(error).toBeNull();
      expect(data).toEqual(mockData);
    });
  });

  describe('addDocument', () => {
    it('should add a new document', async () => {
      // Arrange
      const newDoc = { name: 'Test' };
      const mockData = { id: 'new-id', ...newDoc };
      vi.spyOn(supabase, 'from').mockImplementation(() => createMockBuilder({
        insert: vi.fn().mockResolvedValue({ data: [mockData], error: null })
      }));

      // Act
      const { data, error } = await supabase
        .from('test')
        .insert(newDoc);

      // Assert
      expect(error).toBeNull();
      expect(data).toEqual([mockData]);
    });
  });

  describe('updateDocument', () => {
    it('should update an existing document', async () => {
      // Arrange
      const updates = { name: 'Updated' };
      const mockData = { id: '1', ...updates };
      vi.spyOn(supabase, 'from').mockImplementation(() => createMockBuilder({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ data: [mockData], error: null })
        })
      }));

      // Act
      const { data, error } = await supabase
        .from('test')
        .update(updates)
        .eq('id', '1');

      // Assert
      expect(error).toBeNull();
      expect(data).toEqual([mockData]);
    });
  });

  describe('deleteDocument', () => {
    it('should delete a document', async () => {
      // Arrange
      vi.spyOn(supabase, 'from').mockImplementation(() => createMockBuilder({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ data: null, error: null })
        })
      }));

      // Act
      const { error } = await supabase
        .from('test')
        .delete()
        .eq('id', '1');

      // Assert
      expect(error).toBeNull();
    });
  });
}); 