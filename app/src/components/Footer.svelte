<script>
  const currentYear = new Date().getFullYear();
</script>

<footer>
  <div class="container">
    <div class="footer-content">
      <p>&copy; {currentYear} Team Visio. Tous droits réservés.</p>
      <div class="footer-links">
        <a href="/conditions">Conditions d'utilisation</a>
        <a href="/confidentialite">Politique de confidentialité</a>
        <a href="/contact">Contact</a>
      </div>
    </div>
  </div>
</footer>

<style>
  footer {
    background-color: var(--background-alt);
    padding: 1.5rem 0;
    margin-top: auto;
    border-top: 1px solid var(--border);
  }
  
  .footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  p {
    margin: 0;
    color: var(--foreground-alt);
  }
  
  .footer-links {
    display: flex;
    gap: 1.5rem;
  }
  
  a {
    color: var(--primary);
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.2s ease;
  }
  
  a:hover {
    color: var(--primary-dark);
    text-decoration: underline;
  }
  
  @media (max-width: 768px) {
    .footer-content {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }
    
    .footer-links {
      flex-direction: column;
      gap: 0.5rem;
    }
  }
</style> 