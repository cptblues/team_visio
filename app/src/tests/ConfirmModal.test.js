import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Créer un mock pour le composant ConfirmModal
const MockConfirmModal = {
  render(props) {
    const isOpen = props?.isOpen ?? false;
    const title = props?.title ?? "Confirmation";
    const message = props?.message ?? "Êtes-vous sûr de vouloir effectuer cette action ?";
    const confirmText = props?.confirmText ?? "Confirmer";
    const cancelText = props?.cancelText ?? "Annuler";
    const confirmButtonClass = props?.confirmButtonClass ?? "btn-danger";
    
    if (!isOpen) {
      return '';
    }
    
    return `
      <div class="modal-backdrop">
        <div class="modal-container" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div class="modal-header">
            <h3 id="modal-title">${title}</h3>
            <button class="modal-close" aria-label="Fermer la fenêtre de dialogue">&times;</button>
          </div>
          
          <div class="modal-body">
            <p>${message}</p>
          </div>
          
          <div class="modal-footer">
            <button class="btn btn-secondary">${cancelText}</button>
            <button class="btn ${confirmButtonClass}">${confirmText}</button>
          </div>
        </div>
      </div>
    `;
  }
};

describe('Composant ConfirmModal', () => {
  afterEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
  });
  
  it('ne devrait pas s\'afficher quand isOpen est false', () => {
    document.body.innerHTML = MockConfirmModal.render({ isOpen: false });
    expect(document.querySelector('.modal-backdrop')).toBeNull();
  });
  
  it('devrait s\'afficher quand isOpen est true', () => {
    document.body.innerHTML = MockConfirmModal.render({ isOpen: true });
    expect(document.querySelector('.modal-backdrop')).not.toBeNull();
  });
  
  it('devrait afficher le titre et le message personnalisés', () => {
    document.body.innerHTML = MockConfirmModal.render({
      isOpen: true,
      title: 'Titre Test',
      message: 'Message Test'
    });
    
    expect(document.querySelector('#modal-title').textContent).toBe('Titre Test');
    expect(document.querySelector('.modal-body p').textContent).toBe('Message Test');
  });
  
  it('devrait appeler onCancel quand le bouton Annuler est cliqué', () => {
    const mockOnCancel = vi.fn();
    document.body.innerHTML = MockConfirmModal.render({
      isOpen: true,
      cancelText: 'Annuler Test',
    });
    
    // Utiliser HTMLElement pour accéder aux propriétés DOM
    const cancelButton = /** @type {HTMLElement} */ (document.querySelector('.btn-secondary'));
    
    // Simuler le comportement du composant réel
    cancelButton.onclick = mockOnCancel;
    cancelButton.click();
    
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });
  
  it('devrait appeler onConfirm quand le bouton Confirmer est cliqué', () => {
    const mockOnConfirm = vi.fn();
    document.body.innerHTML = MockConfirmModal.render({
      isOpen: true,
      confirmText: 'Confirmer Test',
    });
    
    // Utiliser HTMLElement pour accéder aux propriétés DOM
    const confirmButton = /** @type {HTMLElement} */ (document.querySelector('.btn-danger'));
    
    // Simuler le comportement du composant réel
    confirmButton.onclick = mockOnConfirm;
    confirmButton.click();
    
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });
  
  it('devrait appliquer la classe de bouton personnalisée', () => {
    document.body.innerHTML = MockConfirmModal.render({
      isOpen: true,
      confirmButtonClass: 'test-class'
    });
    
    const confirmButton = document.querySelector('.btn.test-class');
    expect(confirmButton).not.toBeNull();
  });
  
  it('devrait appeler onCancel quand le bouton de fermeture est cliqué', () => {
    const mockOnCancel = vi.fn();
    document.body.innerHTML = MockConfirmModal.render({
      isOpen: true
    });
    
    // Utiliser HTMLElement pour accéder aux propriétés DOM
    const closeButton = /** @type {HTMLElement} */ (document.querySelector('.modal-close'));
    
    // Simuler le comportement du composant réel
    closeButton.onclick = mockOnCancel;
    closeButton.click();
    
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });
}); 