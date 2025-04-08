import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Test de configuration du déploiement', () => {
  it('vérifie que les fichiers de configuration Supabase existent', () => {
    // Vérifier que le fichier .env.example contient les variables Supabase
    const envExamplePath = path.join(__dirname, '../../.env.example');
    const envExampleContent = fs.readFileSync(envExamplePath, 'utf8');
    
    expect(envExampleContent).toContain('VITE_SUPABASE_URL');
    expect(envExampleContent).toContain('VITE_SUPABASE_ANON_KEY');
  });

  it('vérifie que les scripts de déploiement sont définis dans package.json', () => {
    const packageJsonPath = path.join(__dirname, '../../package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Vérifier les scripts de base
    expect(packageJson).toHaveProperty('scripts');
    expect(packageJson.scripts).toHaveProperty('dev');
    expect(packageJson.scripts).toHaveProperty('build');
    expect(packageJson.scripts).toHaveProperty('preview');
  });
}); 