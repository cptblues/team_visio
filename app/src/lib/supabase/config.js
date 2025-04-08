/**
 * Configuration Supabase
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Vérification de la configuration
const isConfigValid = () => {
    if (!supabaseUrl || !supabaseAnonKey) {
        console.error('Configuration Supabase manquante');
        return false;
    }
    return true;
};

// Création du client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
});

export const isSupabaseConfigValid = isConfigValid(); 