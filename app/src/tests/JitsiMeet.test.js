import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  generateRoomName, 
  isJitsiLoaded, 
  loadJitsiScript 
} from '../lib/jitsi';

describe('Module Jitsi Meet', () => {
  beforeEach(() => {
    // Nettoyer les mocks avant chaque test
    vi.resetAllMocks();
  });

  it('génère un nom de salle formaté correctement', () => {
    // Vérifier que la fonction generateRoomName ajoute le préfixe correctement
    const roomId = 'test-room';
    const roomName = generateRoomName(roomId);
    
    expect(roomName).toContain(roomId);
    expect(roomName.startsWith('teamvisio-')).toBe(true);
    expect(roomName).toBe('teamvisio-test-room');
  });
  
  it('détecte correctement si Jitsi Meet API est chargé', () => {
    // Mock de window pour simuler l'absence de l'API
    const originalWindow = global.window;
    
    // @ts-ignore - Propriété non reconnue par TypeScript mais utilisée dans le test
    global.window = { JitsiMeetExternalAPI: undefined };
    
    expect(isJitsiLoaded()).toBe(false);
    
    // Simuler l'API chargée
    // @ts-ignore - Propriété non reconnue par TypeScript mais utilisée dans le test
    global.window.JitsiMeetExternalAPI = function() {};
    
    expect(isJitsiLoaded()).toBe(true);
    
    // Restaurer window
    global.window = originalWindow;
  });
  
  it('charge le script Jitsi Meet si nécessaire', async () => {
    // Mock des objets DOM nécessaires
    const mockScript = {
      src: '',
      async: false,
      onload: null,
      onerror: null
    };
    
    // Mock de la fonction document.createElement
    document.createElement = vi.fn().mockImplementation((tag) => {
      if (tag === 'script') {
        return mockScript;
      }
    });
    
    // Mock de la fonction appendChild
    document.body.appendChild = vi.fn().mockImplementation((script) => {
      // Simuler le chargement réussi du script
      setTimeout(() => {
        // Définir JitsiMeetExternalAPI avant de déclencher l'événement onload
        // @ts-ignore - Propriété non reconnue par TypeScript mais utilisée dans le test
        window.JitsiMeetExternalAPI = function() {};
        
        // Ensuite déclencher l'événement onload
        script.onload();
      }, 100);
    });
    
    // Stocker l'état d'origine de window.JitsiMeetExternalAPI
    // @ts-ignore - Propriété non reconnue par TypeScript mais utilisée dans le test
    const originalJitsiMeetExternalAPI = window.JitsiMeetExternalAPI;
    // @ts-ignore - Propriété non reconnue par TypeScript mais utilisée dans le test
    window.JitsiMeetExternalAPI = undefined;
    
    // Exécuter le chargement du script
    const promise = loadJitsiScript();
    
    // Vérifier que createElement a été appelé avec 'script'
    expect(document.createElement).toHaveBeenCalledWith('script');
    
    // Vérifier que le script a été ajouté au DOM
    expect(document.body.appendChild).toHaveBeenCalled();
    
    // Vérifier que le script a l'attribut async à true
    expect(mockScript.async).toBe(true);
    
    // Vérifier que le src du script contient le domaine Jitsi
    expect(mockScript.src).toContain('meet.jit.si');
    
    // Attendre que la promesse soit résolue
    await promise;
    
    // Restaurer l'état d'origine
    // @ts-ignore - Propriété non reconnue par TypeScript mais utilisée dans le test
    window.JitsiMeetExternalAPI = originalJitsiMeetExternalAPI;
  });
}); 