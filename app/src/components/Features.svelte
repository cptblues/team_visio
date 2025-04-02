<script>
  const features = [
    {
      title: "Simplicité d'utilisation",
      description: "Aucune inscription ou installation requise. Créez votre salle en un clic."
    },
    {
      title: "Communications sécurisées",
      description: "Toutes les communications sont chiffrées de bout en bout pour garantir votre confidentialité."
    },
    {
      title: "Partage d'écran",
      description: "Partagez votre écran, des applications ou des onglets spécifiques avec les participants."
    },
    {
      title: "Chat intégré",
      description: "Communiquez via le chat textuel pendant vos réunions et partagez des liens."
    }
  ];
</script>

<section class="features">
  <div class="container">
    <h2 class="section-title">Pourquoi choisir Team Visio ?</h2>
    <div class="features-grid">
      {#each features as feature}
        <div class="feature-card">
          <div class="feature-icon">
            <div class="icon-placeholder"></div>
          </div>
          <h3>{feature.title}</h3>
          <p>{feature.description}</p>
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  .features {
    padding: 4rem 0;
    background-color: var(--background-alt);
  }
  
  .section-title {
    text-align: center;
    font-size: 2rem;
    margin-bottom: 3rem;
    color: var(--foreground);
  }
  
  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
  }
  
  .feature-card {
    background-color: var(--background);
    border-radius: 0.5rem;
    padding: 1.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .feature-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  }
  
  .feature-icon {
    margin-bottom: 1rem;
  }
  
  .icon-placeholder {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: var(--primary-light);
  }
  
  h3 {
    color: var(--primary);
    margin-bottom: 0.75rem;
    font-size: 1.25rem;
  }
  
  p {
    color: var(--foreground-alt);
    line-height: 1.5;
  }
  
  @media (max-width: 768px) {
    .features-grid {
      grid-template-columns: 1fr;
    }
  }
</style> 