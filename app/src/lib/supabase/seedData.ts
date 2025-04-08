import { supabase } from './client';

const DEMO_ROOMS = [
  {
    name: 'Salle de démonstration 1',
    description: 'Une salle pour tester les fonctionnalités de base',
    is_public: true,
    capacity: 10,
    participants: []
  },
  {
    name: 'Salle privée de test',
    description: 'Une salle privée pour tester les restrictions d\'accès',
    is_public: false,
    capacity: 5,
    participants: []
  }
];

export async function seedRooms(): Promise<void> {
  try {
    // Vérifier si des salles existent déjà
    const { data: existingRooms } = await supabase
      .from('rooms')
      .select('id');

    if (existingRooms && existingRooms.length > 0) {
      console.log('Des salles existent déjà, pas besoin de seed');
      return;
    }

    // Insérer les salles de démonstration
    const { error } = await supabase
      .from('rooms')
      .insert(DEMO_ROOMS);

    if (error) {
      throw error;
    }

    console.log('Données de démonstration initialisées avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation des données de démonstration:', error);
  }
} 