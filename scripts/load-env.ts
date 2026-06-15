/**
 * Load environment variables from .env.local
 * This ensures scripts can access POSTGRES_URL
 */
import { readFileSync } from 'fs';
import { join } from 'path';

export function loadEnv() {
  try {
    const envPath = join(process.cwd(), '.env.local');
    const envContent = readFileSync(envPath, 'utf-8');

    // Parse .env.local file
    envContent.split('\n').forEach(line => {
      // Skip comments and empty lines
      if (line.trim().startsWith('#') || !line.trim()) return;

      // Parse KEY=VALUE or KEY="VALUE"
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        let value = match[2].trim();

        // Remove quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }

        // Always set in process.env (override any previous value)
        // This ensures scripts use the latest .env.local values
        process.env[key] = value;
      }
    });

    console.log('✅ Environment variables loaded from .env.local');
    return true;
  } catch (err: any) {
    console.error('⚠️  Could not load .env.local:', err.message);
    return false;
  }
}

// Auto-load when imported
if (require.main !== module) {
  loadEnv();
}
