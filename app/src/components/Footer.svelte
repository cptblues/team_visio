<script>
  const currentYear = new Date().getFullYear();
</script>

<footer>
  <div class="container">
    <div class="footer-content">
      <div class="footer-logo">
        <h2>Team Visio</h2>
        <p>Communiquez simplement, rencontrez facilement</p>
      </div>
      
      <div class="footer-links">
        <div class="link-section">
          <h3>Liens Rapides</h3>
          <ul>
            <li><a href="/">Accueil</a></li>
            <li><a href="/">Salles Disponibles</a></li>
            <li><a href="/">Créer une Salle</a></li>
          </ul>
        </div>
        
        <div class="link-section">
          <h3>Assistance</h3>
          <ul>
            <li><a href="/">Guide d'Utilisation</a></li>
            <li><a href="/">FAQ</a></li>
            <li><a href="/">Nous Contacter</a></li>
          </ul>
        </div>
      </div>
    </div>
    
    <div class="footer-bottom">
      <p>&copy; {currentYear} Team Visio. Tous droits réservés.</p>
      <div class="social-links">
        <a href="/" class="social-link" aria-label="Twitter">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
          </svg>
        </a>
        <a href="/" class="social-link" aria-label="GitHub">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
          </svg>
        </a>
        <a href="/" class="social-link" aria-label="LinkedIn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
            <rect x="2" y="9" width="4" height="12"></rect>
            <circle cx="4" cy="4" r="2"></circle>
          </svg>
        </a>
      </div>
    </div>
  </div>
</footer>

<style>
  footer {
    background-color: var(--primary-light);
    padding: 4rem 0 2rem;
    color: var(--foreground);
  }
  
  .footer-content {
    display: flex;
    flex-wrap: wrap;
    gap: 2.5rem;
    margin-bottom: 3rem;
  }
  
  .footer-logo {
    flex: 1;
    min-width: 250px;
  }
  
  .footer-logo h2 {
    color: var(--primary-dark);
    margin-bottom: 0.5rem;
    font-size: 1.6rem;
  }
  
  .footer-logo p {
    color: var(--foreground-alt);
    font-size: 0.95rem;
  }
  
  .footer-links {
    flex: 2;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    gap: 2rem;
  }
  
  .link-section {
    min-width: 150px;
  }
  
  .link-section h3 {
    color: var(--primary-dark);
    margin-bottom: 1.25rem;
    font-size: 1.1rem;
    font-weight: 600;
    position: relative;
    padding-bottom: 0.5rem;
  }
  
  .link-section h3::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 30px;
    height: 3px;
    background-color: var(--primary);
    border-radius: 2px;
  }
  
  .link-section ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
  
  .link-section ul li {
    margin-bottom: 0.75rem;
  }
  
  .link-section ul li a {
    color: var(--foreground);
    text-decoration: none;
    transition: var(--transition);
    position: relative;
    padding-left: 0.5rem;
  }
  
  .link-section ul li a::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: var(--primary);
    opacity: 0.6;
    transition: var(--transition);
  }
  
  .link-section ul li a:hover {
    color: var(--primary);
    padding-left: 0.75rem;
  }
  
  .link-section ul li a:hover::before {
    opacity: 1;
  }
  
  .footer-bottom {
    padding-top: 2rem;
    border-top: 1px solid rgba(0,0,0,0.05);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .footer-bottom p {
    color: var(--foreground-alt);
    font-size: 0.9rem;
  }
  
  .social-links {
    display: flex;
    gap: 1rem;
  }
  
  .social-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background-color: white;
    border-radius: 50%;
    color: var(--primary);
    transition: var(--transition);
    box-shadow: 0 3px 10px var(--shadow);
  }
  
  .social-link:hover {
    transform: translateY(-3px);
    color: var(--primary-dark);
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  }
  
  @media (max-width: 768px) {
    footer {
      padding: 3rem 0 1.5rem;
    }
    
    .footer-content {
      flex-direction: column;
      gap: 2rem;
    }
    
    .footer-links {
      flex-direction: column;
      gap: 2rem;
    }
    
    .footer-bottom {
      flex-direction: column;
      text-align: center;
    }
  }
</style> 