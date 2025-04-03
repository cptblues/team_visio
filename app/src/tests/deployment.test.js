import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Test de configuration du déploiement', () => {
  it('vérifie que les fichiers de configuration Firebase existent', () => {
    // Vérifier si firebase.json existe
    const firebaseJsonPath = path.resolve(process.cwd(), '../app/firebase.json');
    expect(fs.existsSync(firebaseJsonPath)).toBe(true);
    
    // Vérifier si .firebaserc existe
    const firebaseRcPath = path.resolve(process.cwd(), './.firebaserc');
    expect(fs.existsSync(firebaseRcPath)).toBe(true);
    
    // Vérifier le contenu de firebase.json
    const firebaseJson = JSON.parse(fs.readFileSync(firebaseJsonPath, 'utf8'));
    expect(firebaseJson).toHaveProperty('hosting');
    expect(firebaseJson.hosting).toHaveProperty('public', 'dist');
    
    // Vérifier le contenu de .firebaserc
    const firebaseRc = JSON.parse(fs.readFileSync(firebaseRcPath, 'utf8'));
    expect(firebaseRc).toHaveProperty('projects');
    expect(firebaseRc.projects).toHaveProperty('default');
  });
  
  it('vérifie que les workflows GitHub Actions sont configurés correctement', () => {
    // Vérifier si le dossier des workflows existe
    const workflowsPath = path.resolve(process.cwd(), '../.github/workflows');
    expect(fs.existsSync(workflowsPath)).toBe(true);
    
    // Vérifier si les fichiers de workflow existent
    const mergeWorkflowPath = path.resolve(workflowsPath, 'firebase-hosting-merge.yml');
    const prWorkflowPath = path.resolve(workflowsPath, 'firebase-hosting-pull-request.yml');
    
    expect(fs.existsSync(mergeWorkflowPath)).toBe(true);
    expect(fs.existsSync(prWorkflowPath)).toBe(true);
    
    // Vérifier le contenu des fichiers de workflow
    const mergeWorkflow = fs.readFileSync(mergeWorkflowPath, 'utf8');
    const prWorkflow = fs.readFileSync(prWorkflowPath, 'utf8');
    
    // Vérifier que les workflows contiennent les étapes essentielles
    expect(mergeWorkflow).toContain('actions/checkout');
    expect(mergeWorkflow).toContain('actions/setup-node');
    expect(mergeWorkflow).toContain('FirebaseExtended/action-hosting-deploy');
    
    expect(prWorkflow).toContain('actions/checkout');
    expect(prWorkflow).toContain('actions/setup-node');
    expect(prWorkflow).toContain('FirebaseExtended/action-hosting-deploy');
  });
  
  it('vérifie que les scripts de déploiement sont définis dans package.json', () => {
    // Charger package.json
    const packageJsonPath = path.resolve(process.cwd(), './package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Vérifier les scripts de déploiement
    expect(packageJson).toHaveProperty('scripts');
    expect(packageJson.scripts).toHaveProperty('deploy');
    expect(packageJson.scripts).toHaveProperty('deploy:preview');
    
    // Vérifier le contenu des scripts
    expect(packageJson.scripts.deploy).toContain('firebase deploy');
    expect(packageJson.scripts['deploy:preview']).toContain('firebase hosting:channel:deploy');
  });
}); 