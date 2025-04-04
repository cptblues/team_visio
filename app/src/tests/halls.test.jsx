import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock des modules Firebase avant d'importer quoi que ce soit d'autre
vi.mock('../lib/firebase/firestore', () => {
  return {
    COLLECTIONS: {
      HALLS: 'halls'
    },
    addDocument: vi.fn(),
    getDocument: vi.fn(),
    updateDocument: vi.fn(),
    deleteDocument: vi.fn(),
    getAllDocuments: vi.fn(),
    subscribeToCollection: vi.fn(),
    subscribeToDocument: vi.fn(),
    getCollection: vi.fn()
  };
});

// Mock de Firebase Auth
vi.mock('../lib/firebase/index', () => {
  return {
    auth: {
      currentUser: {
        uid: 'testUserId'
      }
    }
  };
});

// Ensuite, importer les modules qui dépendent des mocks
import { COLLECTIONS } from '../lib/firebase/firestore';
import { 
  createHall, 
  checkUserHall, 
  getUserHall,
  getHallById,
  updateHall,
  deleteHall
} from '../lib/firebase/halls';
import { 
  addDocument, 
  getDocument, 
  updateDocument, 
  deleteDocument, 
  getAllDocuments 
} from '../lib/firebase/firestore';

describe('Fonctions de gestion des halls', () => {
  beforeEach(() => {
    // Réinitialiser les mocks avant chaque test
    vi.clearAllMocks();
  });

  describe('createHall', () => {
    it('devrait créer un hall avec les paramètres obligatoires', async () => {
      // Arrange
      const hallData = {
        description: 'Hall de test'
      };
      addDocument.mockResolvedValue('testHallId');

      // Act
      const result = await createHall(hallData);

      // Assert
      expect(addDocument).toHaveBeenCalledWith(COLLECTIONS.HALLS, expect.objectContaining({
        description: 'Hall de test',
        creatorId: 'testUserId',
        roomLimit: 3,
        invitedUsers: []
      }));
      expect(result).toBe('testHallId');
    });

    it('devrait créer un hall avec tous les paramètres personnalisés', async () => {
      // Arrange
      const hallData = {
        description: 'Hall de test personnalisé',
        roomLimit: 5,
        invitedUsers: ['user1', 'user2']
      };
      addDocument.mockResolvedValue('testHallId');

      // Act
      const result = await createHall(hallData);

      // Assert
      expect(addDocument).toHaveBeenCalledWith(COLLECTIONS.HALLS, expect.objectContaining({
        description: 'Hall de test personnalisé',
        creatorId: 'testUserId',
        roomLimit: 5,
        invitedUsers: ['user1', 'user2']
      }));
      expect(result).toBe('testHallId');
    });
  });

  describe('checkUserHall', () => {
    it('devrait retourner true si l\'utilisateur a déjà un hall', async () => {
      // Arrange
      const userId = 'testUserId';
      getAllDocuments.mockResolvedValue([
        { id: 'hall1', creatorId: 'anotherUserId', description: 'Another hall' },
        { id: 'hall2', creatorId: 'testUserId', description: 'User hall' }
      ]);

      // Act
      const result = await checkUserHall(userId);

      // Assert
      expect(getAllDocuments).toHaveBeenCalledWith(COLLECTIONS.HALLS);
      expect(result).toBe(true);
    });

    it('devrait retourner false si l\'utilisateur n\'a pas de hall', async () => {
      // Arrange
      const userId = 'testUserId';
      getAllDocuments.mockResolvedValue([
        { id: 'hall1', creatorId: 'anotherUserId', description: 'Another hall' }
      ]);

      // Act
      const result = await checkUserHall(userId);

      // Assert
      expect(getAllDocuments).toHaveBeenCalledWith(COLLECTIONS.HALLS);
      expect(result).toBe(false);
    });
  });

  describe('getUserHall', () => {
    it('devrait retourner le hall de l\'utilisateur s\'il existe', async () => {
      // Arrange
      const userId = 'testUserId';
      const userHall = { id: 'hall2', creatorId: 'testUserId', description: 'User hall' };
      getAllDocuments.mockResolvedValue([
        { id: 'hall1', creatorId: 'anotherUserId', description: 'Another hall' },
        userHall
      ]);

      // Act
      const result = await getUserHall(userId);

      // Assert
      expect(getAllDocuments).toHaveBeenCalledWith(COLLECTIONS.HALLS);
      expect(result).toEqual(userHall);
    });

    it('devrait retourner null si l\'utilisateur n\'a pas de hall', async () => {
      // Arrange
      const userId = 'testUserId';
      getAllDocuments.mockResolvedValue([
        { id: 'hall1', creatorId: 'anotherUserId', description: 'Another hall' }
      ]);

      // Act
      const result = await getUserHall(userId);

      // Assert
      expect(getAllDocuments).toHaveBeenCalledWith(COLLECTIONS.HALLS);
      expect(result).toBeNull();
    });
  });

  describe('getHallById', () => {
    it('devrait retourner un hall par son ID', async () => {
      // Arrange
      const hallId = 'testHallId';
      const hall = { id: hallId, creatorId: 'testUserId', description: 'Test hall' };
      getDocument.mockResolvedValue(hall);

      // Act
      const result = await getHallById(hallId);

      // Assert
      expect(getDocument).toHaveBeenCalledWith(COLLECTIONS.HALLS, hallId);
      expect(result).toEqual(hall);
    });
  });

  describe('updateHall', () => {
    it('devrait mettre à jour un hall si l\'utilisateur est le créateur', async () => {
      // Arrange
      const hallId = 'testHallId';
      const updateData = { description: 'Updated description' };
      getDocument.mockResolvedValue({ id: hallId, creatorId: 'testUserId' });

      // Act
      await updateHall(hallId, updateData);

      // Assert
      expect(getDocument).toHaveBeenCalledWith(COLLECTIONS.HALLS, hallId);
      expect(updateDocument).toHaveBeenCalledWith(COLLECTIONS.HALLS, hallId, updateData);
    });

    it('devrait renvoyer une erreur si l\'utilisateur n\'est pas le créateur', async () => {
      // Arrange
      const hallId = 'testHallId';
      const updateData = { description: 'Updated description' };
      getDocument.mockResolvedValue({ id: hallId, creatorId: 'anotherUserId' });

      // Act & Assert
      await expect(updateHall(hallId, updateData))
        .rejects.toThrow('Vous n\'avez pas les droits pour modifier ce hall');
      expect(updateDocument).not.toHaveBeenCalled();
    });
  });

  describe('deleteHall', () => {
    it('devrait supprimer un hall si l\'utilisateur est le créateur', async () => {
      // Arrange
      const hallId = 'testHallId';
      getDocument.mockResolvedValue({ id: hallId, creatorId: 'testUserId' });

      // Act
      await deleteHall(hallId);

      // Assert
      expect(getDocument).toHaveBeenCalledWith(COLLECTIONS.HALLS, hallId);
      expect(deleteDocument).toHaveBeenCalledWith(COLLECTIONS.HALLS, hallId);
    });

    it('devrait renvoyer une erreur si l\'utilisateur n\'est pas le créateur', async () => {
      // Arrange
      const hallId = 'testHallId';
      getDocument.mockResolvedValue({ id: hallId, creatorId: 'anotherUserId' });

      // Act & Assert
      await expect(deleteHall(hallId))
        .rejects.toThrow('Vous n\'avez pas les droits pour supprimer ce hall');
      expect(deleteDocument).not.toHaveBeenCalled();
    });
  });
}); 