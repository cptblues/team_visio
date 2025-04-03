<script>
  import { onMount } from 'svelte';
  import { firebaseConfig } from '../lib/config';
  import { firebaseApp, db, auth } from '../lib/firebase';
  
  let errors = [];
  let connectionStatus = 'Checking...';
  let originalFetch;
  
  // Intercepte les requêtes fetch pour surveiller celles de Firebase
  function monitorFirebaseRequests() {
    originalFetch = window.fetch;
    
    window.fetch = function(input, init) {
      const url = typeof input === 'string' ? input : input instanceof Request ? input.url : input.toString();
      
      if (url && url.includes('firestore.googleapis.com')) {
        console.log('Firebase request:', url);
        
        // Pour les réponses d'erreur
        return originalFetch(input, init).then(response => {
          if (!response.ok && response.status === 400) {
            const clonedResponse = response.clone();
            clonedResponse.text().then(text => {
              errors = [...errors, {
                url: url,
                status: response.status,
                timestamp: new Date().toISOString(),
                details: text
              }];
            });
          }
          return response;
        });
      }
      
      return originalFetch(input, init);
    };
  }
  
  // Teste la connexion à Firestore
  async function testFirestoreConnection() {
    try {
      // Cette méthode n'est pas utilisée actuellement car elle peut générer des erreurs supplémentaires
      connectionStatus = 'Test disabled';
    } catch (error) {
      connectionStatus = `Connection error: ${error.message}`;
      errors = [...errors, {
        type: 'Connection test',
        timestamp: new Date().toISOString(),
        details: error.message
      }];
    }
  }
  
  onMount(() => {
    monitorFirebaseRequests();
    
    return () => {
      // Restaurer la fonction fetch d'origine
      if (originalFetch) {
        window.fetch = originalFetch;
      }
    };
  });
</script>

<div class="debugger">
  <h2>Firebase Debugger</h2>
  
  <div class="section">
    <h3>Configuration actuelle</h3>
    <pre>
apiKey: {firebaseConfig.apiKey ? '✓ Défini' : '✗ Non défini'}
authDomain: {firebaseConfig.authDomain}
projectId: {firebaseConfig.projectId}
storageBucket: {firebaseConfig.storageBucket}
messagingSenderId: {firebaseConfig.messagingSenderId}
appId: {firebaseConfig.appId ? '✓ Défini' : '✗ Non défini'}
</pre>
  </div>
  
  <div class="section">
    <h3>État de l'initialisation</h3>
    <p>Firebase app: {firebaseApp ? '✓ Initialisé' : '✗ Non initialisé'}</p>
    <p>Firestore: {db ? '✓ Initialisé' : '✗ Non initialisé'}</p>
    <p>Auth: {auth ? '✓ Initialisé' : '✗ Non initialisé'}</p>
  </div>
  
  <div class="section">
    <h3>Erreurs capturées ({errors.length})</h3>
    {#if errors.length === 0}
      <p>Aucune erreur capturée pour le moment.</p>
    {:else}
      <div class="error-list">
        {#each errors as error}
          <div class="error-item">
            <p><strong>Timestamp:</strong> {error.timestamp}</p>
            {#if error.url}
              <p><strong>URL:</strong> {error.url}</p>
            {/if}
            {#if error.status}
              <p><strong>Status:</strong> {error.status}</p>
            {/if}
            <p><strong>Details:</strong> {error.details}</p>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .debugger {
    background-color: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 0.25rem;
    padding: 1rem;
    margin-top: 2rem;
    max-width: 800px;
    margin: 1rem auto;
  }
  
  h2 {
    color: #6c63ff;
    border-bottom: 1px solid #dee2e6;
    padding-bottom: 0.5rem;
    margin-top: 0;
  }
  
  .section {
    margin-bottom: 1.5rem;
  }
  
  h3 {
    color: #333;
    font-size: 1.1rem;
    margin-bottom: 0.75rem;
  }
  
  pre {
    background-color: #f1f3f5;
    padding: 0.5rem;
    border-radius: 0.25rem;
    overflow-x: auto;
  }
  
  .error-list {
    max-height: 300px;
    overflow-y: auto;
  }
  
  .error-item {
    background-color: #fff3f3;
    border-left: 3px solid #dc3545;
    padding: 0.75rem;
    margin-bottom: 0.75rem;
    border-radius: 0.25rem;
  }
  
  p {
    margin: 0.5rem 0;
  }
</style> 