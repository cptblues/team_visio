/**
 * Script pour initialiser des données de démonstration dans Firestore
 * Utile pour les tests et le développement
 */

import { COLLECTIONS, addDocument, getAllDocuments } from './firestore';

/**
 * Initialise la base de données avec des salles de démonstration
 */
export async function seedRooms() {
  try {
    // Vérifier si des salles existent déjà
    const existingRooms = await getAllDocuments(COLLECTIONS.ROOMS);
    
    if (existingRooms.length > 0) {
      console.log(`${existingRooms.length} salles déjà présentes dans la base de données`);
      return;
    }
    
    // Salles de démonstration
    const demoRooms = [
      {
        name: 'Salle Principale',
        description: 'Salle de réunion générale pour toute l\'équipe',
        isPublic: true,
        createdBy: 'admin',
        createdAt: new Date(),
        capacity: 10,
        participants: []
      },
      {
        name: 'Salle Marketing',
        description: 'Réunions et discussions pour l\'équipe marketing',
        isPublic: true,
        createdBy: 'admin',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 jours avant
        capacity: 8,
        participants: []
      },
      {
        name: 'Salle Développement',
        description: 'Espace dédié aux développeurs pour les discussions techniques',
        isPublic: true,
        createdBy: 'admin',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 jour avant
        capacity: 12,
        participants: []
      },
      {
        name: 'Salle Privée',
        description: 'Salle privée pour les réunions confidentielles',
        isPublic: false,
        createdBy: 'admin',
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 heures avant
        capacity: 5,
        participants: []
      }
    ];
    
    // Ajouter les salles à Firestore
    for (const room of demoRooms) {
      await addDocument(COLLECTIONS.ROOMS, room);
      console.log(`Salle créée: ${room.name}`);
    }
    
    console.log(`${demoRooms.length} salles de démonstration ajoutées à la base de données`);
  } catch (error) {
    console.error('Erreur lors de l\'initialisation des données de démonstration:', error);
  }
} 