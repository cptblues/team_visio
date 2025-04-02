import { describe, it, expect, vi } from 'vitest';
import { 
  COLLECTIONS,
  getCollection,
  getDocument,
  getAllDocuments,
  addDocument,
  setDocument,
  updateDocument,
  deleteDocument,
  subscribeToCollection,
  subscribeToDocument
} from '../lib/firebase/firestore';

// Flag pour différencier les appels à onSnapshot
let isDocumentSubscription = false;

// Mock Firestore
vi.mock('firebase/firestore', () => {
  return {
    collection: vi.fn(() => ({})),
    doc: vi.fn(() => ({})),
    getDoc: vi.fn(() => Promise.resolve({ exists: () => true, data: () => ({}), id: 'test-id' })),
    getDocs: vi.fn(() => Promise.resolve({ docs: [{ id: 'test-id', data: () => ({}) }] })),
    addDoc: vi.fn(() => Promise.resolve({ id: 'new-id' })),
    setDoc: vi.fn(() => Promise.resolve()),
    updateDoc: vi.fn(() => Promise.resolve()),
    deleteDoc: vi.fn(() => Promise.resolve()),
    query: vi.fn((collectionRef) => collectionRef),
    where: vi.fn(() => ({})),
    onSnapshot: vi.fn((ref, callback) => {
      if (isDocumentSubscription) {
        // Mock pour un document
        callback({
          exists: () => true,
          id: 'test-id',
          data: () => ({ name: 'Test' })
        });
      } else {
        // Mock pour une collection
        callback({ 
          docs: [{ id: 'test-id', data: () => ({}) }] 
        });
      }
      return vi.fn(); // Fonction pour se désabonner
    })
  };
});

// Mock l'instance Firestore de l'application
vi.mock('../lib/firebase/index', () => {
  return {
    db: {}
  };
});

describe('Firestore Utils', () => {
  it('définit les collections correctement', () => {
    expect(COLLECTIONS).toHaveProperty('USERS');
    expect(COLLECTIONS).toHaveProperty('ROOMS');
    expect(COLLECTIONS).toHaveProperty('SETTINGS');
  });
  
  it('peut récupérer une référence de collection', () => {
    const collectionRef = getCollection(COLLECTIONS.USERS);
    expect(collectionRef).toBeDefined();
  });
  
  it('peut récupérer un document', async () => {
    const doc = await getDocument(COLLECTIONS.USERS, 'test-id');
    expect(doc).toBeDefined();
    expect(doc.id).toBe('test-id');
  });
  
  it('peut récupérer tous les documents', async () => {
    const docs = await getAllDocuments(COLLECTIONS.USERS);
    expect(docs).toBeInstanceOf(Array);
    expect(docs.length).toBe(1);
  });
  
  it('peut ajouter un document', async () => {
    const id = await addDocument(COLLECTIONS.USERS, { name: 'Test User' });
    expect(id).toBe('new-id');
  });
  
  it('peut définir un document', async () => {
    await setDocument(COLLECTIONS.USERS, 'test-id', { name: 'Test User' });
    // Pas d'erreur = succès
  });
  
  it('peut mettre à jour un document', async () => {
    await updateDocument(COLLECTIONS.USERS, 'test-id', { name: 'Updated User' });
    // Pas d'erreur = succès
  });
  
  it('peut supprimer un document', async () => {
    await deleteDocument(COLLECTIONS.USERS, 'test-id');
    // Pas d'erreur = succès
  });
  
  it('peut s\'abonner à une collection', () => {
    isDocumentSubscription = false;
    const callback = vi.fn();
    const unsubscribe = subscribeToCollection(COLLECTIONS.USERS, callback);
    
    expect(callback).toHaveBeenCalled();
    expect(unsubscribe).toBeInstanceOf(Function);
  });
  
  it('peut s\'abonner à un document', () => {
    isDocumentSubscription = true;
    const callback = vi.fn();
    const unsubscribe = subscribeToDocument(COLLECTIONS.USERS, 'test-id', callback);
    
    expect(callback).toHaveBeenCalled();
    expect(unsubscribe).toBeInstanceOf(Function);
  });
}); 