<section class="cta">
  <div class="container">
    <div class="cta-content">
      <h2>Prêt à commencer ?</h2>
      <p>Essayez Team Visio dès maintenant et découvrez la simplicité des visioconférences.</p>
      <button class="btn btn-primary btn-large">Créer ma première salle</button>
    </div>
  </div>
</section>

<style>
  .cta {
    padding: 5rem 0;
    background-color: var(--background);
    position: relative;
    overflow: hidden;
  }
  
  .cta::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, var(--primary-light) 0%, transparent 50%);
    opacity: 0.4;
    z-index: 0;
  }
  
  .cta-content {
    position: relative;
    z-index: 1;
    text-align: center;
    max-width: 700px;
    margin: 0 auto;
  }
  
  h2 {
    font-size: 2.5rem;
    color: var(--foreground);
    margin-bottom: 1rem;
  }
  
  p {
    font-size: 1.2rem;
    color: var(--foreground-alt);
    margin-bottom: 2rem;
  }
  
  .btn-large {
    padding: 1rem 2rem;
    font-size: 1.1rem;
  }
  
  .btn-primary {
    background-color: var(--primary);
    color: white;
    border: none;
    border-radius: 0.25rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .btn-primary:hover {
    background-color: var(--primary-dark);
    transform: scale(1.05);
  }
  
  @media (max-width: 768px) {
    h2 {
      font-size: 2rem;
    }
    
    p {
      font-size: 1rem;
    }
  }
</style> 