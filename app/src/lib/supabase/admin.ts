import { supabase } from './client';

export async function makeSelfAdmin(): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user?.id) {
      throw new Error('Utilisateur non connecté');
    }

    // Vérifier si l'utilisateur est déjà admin
    const { data: existingAdmin } = await supabase
      .from('admins')
      .select('id')
      .eq('user_id', user.user.id)
      .single();

    if (existingAdmin) {
      return { success: true };
    }

    // Ajouter l'utilisateur comme admin
    const { error } = await supabase
      .from('admins')
      .insert([{ user_id: user.user.id }]);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Erreur lors de la promotion en administrateur:', error);
    return { success: false, error: error.message };
  }
} 