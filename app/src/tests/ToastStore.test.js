import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { toasts, TOAST_TYPES } from '../stores/toastStore';
import { get } from 'svelte/store';

describe('Toast Store', () => {
  // Réinitialiser le store avant chaque test
  beforeEach(() => {
    toasts.clearAll();
    vi.useFakeTimers();
  });
  
  afterEach(() => {
    vi.useRealTimers();
  });

  it('devrait commencer avec un tableau vide', () => {
    const toastList = get(toasts);
    expect(toastList).toEqual([]);
  });

  it('devrait ajouter un toast', () => {
    const id = toasts.addToast('Test message', TOAST_TYPES.INFO);
    const toastList = get(toasts);
    
    expect(toastList.length).toBe(1);
    expect(toastList[0].id).toBe(id);
    expect(toastList[0].message).toBe('Test message');
    expect(toastList[0].type).toBe(TOAST_TYPES.INFO);
  });
  
  it('devrait supprimer un toast', () => {
    const id = toasts.addToast('Test message');
    
    expect(get(toasts).length).toBe(1);
    
    toasts.removeToast(id);
    
    expect(get(toasts).length).toBe(0);
  });
  
  it('devrait supprimer automatiquement un toast après un délai', () => {
    const id = toasts.addToast('Test message', TOAST_TYPES.SUCCESS, 2000);
    
    expect(get(toasts).length).toBe(1);
    
    // Avancer le temps de 2000ms
    vi.advanceTimersByTime(2000);
    
    expect(get(toasts).length).toBe(0);
  });
  
  it('devrait pouvoir ajouter plusieurs types de toasts', () => {
    toasts.success('Success message');
    toasts.error('Error message');
    toasts.info('Info message');
    toasts.warning('Warning message');
    
    const toastList = get(toasts);
    
    expect(toastList.length).toBe(4);
    expect(toastList[0].type).toBe(TOAST_TYPES.SUCCESS);
    expect(toastList[1].type).toBe(TOAST_TYPES.ERROR);
    expect(toastList[2].type).toBe(TOAST_TYPES.INFO);
    expect(toastList[3].type).toBe(TOAST_TYPES.WARNING);
  });
  
  it('devrait supprimer tous les toasts avec clearAll', () => {
    toasts.success('Success 1');
    toasts.success('Success 2');
    toasts.error('Error');
    
    expect(get(toasts).length).toBe(3);
    
    toasts.clearAll();
    
    expect(get(toasts).length).toBe(0);
  });
  
  it('devrait générer des IDs uniques pour chaque toast', () => {
    const id1 = toasts.addToast('Message 1');
    const id2 = toasts.addToast('Message 2');
    const id3 = toasts.addToast('Message 3');
    
    expect(id1).not.toBe(id2);
    expect(id2).not.toBe(id3);
    expect(id1).not.toBe(id3);
  });
}); 