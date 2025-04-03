/**
 * Store pour gérer l'état de Jitsi Meet
 */

import { writable, derived } from 'svelte/store';
import { getAllParticipants, isJitsiActive } from '../jitsi';

// Store principal pour la conférence Jitsi
export const jitsiConference = writable({
  isActive: false,
  roomId: null,
  isAudioMuted: false,
  isVideoMuted: false,
  isScreenSharing: false,
  isTileView: false
});

// Store pour les participants
export const jitsiParticipants = writable([]);

// Store dérivé pour le nombre de participants
export const participantsCount = derived(
  jitsiParticipants,
  $participants => $participants.length
);

// Mettre à jour l'état de la conférence
export function updateConferenceState(state) {
  jitsiConference.update(current => ({
    ...current,
    ...state
  }));
}

// Mettre à jour les participants
export function updateParticipants() {
  if (isJitsiActive()) {
    const participants = getAllParticipants();
    jitsiParticipants.set(participants);
    return participants;
  }
  return [];
}

// Réinitialiser les stores
export function resetJitsiStores() {
  jitsiConference.set({
    isActive: false,
    roomId: null,
    isAudioMuted: false,
    isVideoMuted: false,
    isScreenSharing: false,
    isTileView: false
  });
  jitsiParticipants.set([]);
}

// Démarrer le polling des participants
let participantsInterval = null;

export function startParticipantsPolling(intervalMs = 5000) {
  stopParticipantsPolling();
  
  // Mise à jour immédiate
  updateParticipants();
  
  // Puis toutes les X millisecondes
  participantsInterval = setInterval(updateParticipants, intervalMs);
  
  return () => stopParticipantsPolling();
}

export function stopParticipantsPolling() {
  if (participantsInterval) {
    clearInterval(participantsInterval);
    participantsInterval = null;
  }
} 