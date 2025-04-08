import { supabase } from './client';
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export interface Room {
  id: string;
  name: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  owner_id: string;
}

export async function getRoom(roomId: string): Promise<Room | null> {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', roomId)
    .single();

  if (error) {
    console.error('Error fetching room:', error);
    return null;
  }

  return data;
}

export function subscribeToRoom(roomId: string, callback: (room: Room) => void): () => void {
  const channel = supabase
    .channel(`room:${roomId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'rooms',
        filter: `id=eq.${roomId}`
      },
      (payload: RealtimePostgresChangesPayload<Room>) => {
        if (payload.new && 'id' in payload.new) {
          callback(payload.new);
        }
      }
    )
    .subscribe();

  // Charger les données initiales
  getRoom(roomId).then(callback);

  // Retourner la fonction de nettoyage
  return () => {
    channel.unsubscribe();
  };
}

export function subscribeToRooms(callback: (rooms: Room[]) => void): () => void {
  const channel = supabase
    .channel('rooms')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'rooms'
      },
      async () => {
        // Recharger toutes les salles
        const { data } = await supabase
          .from('rooms')
          .select('*')
          .order('created_at', { ascending: false });
        
        callback(data || []);
      }
    )
    .subscribe();

  // Charger les données initiales
  supabase
    .from('rooms')
    .select('*')
    .order('created_at', { ascending: false })
    .then(({ data }) => callback(data || []));

  // Retourner la fonction de nettoyage
  return () => {
    channel.unsubscribe();
  };
}

export async function createRoom(roomData: Partial<Room>): Promise<Room> {
  const { data, error } = await supabase
    .from('rooms')
    .insert([{
      ...roomData,
      created_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateRoom(roomId: string, roomData: Partial<Room>): Promise<Room> {
  const { data, error } = await supabase
    .from('rooms')
    .update(roomData)
    .eq('id', roomId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteRoom(roomId: string): Promise<void> {
  const { error } = await supabase
    .from('rooms')
    .delete()
    .eq('id', roomId);

  if (error) {
    throw error;
  }
}

export async function joinRoom(roomId: string): Promise<void> {
  const { data: user } = await supabase.auth.getUser();
  if (!user?.user?.id) {
    throw new Error('User not authenticated');
  }

  const { error } = await supabase
    .from('room_participants')
    .insert([{
      room_id: roomId,
      user_id: user.user.id,
      joined_at: new Date().toISOString()
    }]);

  if (error) {
    throw error;
  }
}

export async function leaveRoom(roomId: string): Promise<void> {
  const { data: user } = await supabase.auth.getUser();
  if (!user?.user?.id) {
    throw new Error('User not authenticated');
  }

  const { error } = await supabase
    .from('room_participants')
    .delete()
    .eq('room_id', roomId)
    .eq('user_id', user.user.id);

  if (error) {
    throw error;
  }
}

export function subscribeToRoomParticipants(roomId: string, callback: (payload: any) => void): () => void {
  const channel = supabase
    .channel(`room_participants:${roomId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'room_participants',
        filter: `room_id=eq.${roomId}`
      },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();

  return () => {
    channel.unsubscribe();
  };
} 