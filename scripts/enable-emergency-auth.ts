// Enable emergency auth mode - allows all OTPs during Turso migration
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { enableEmergencyAuthMode } from '../src/lib/user-cache';

async function enable() {
  console.log('🚨 Enabling Emergency Auth Mode...');
  console.log('This allows all users to login/signup during database migration.');
  console.log('');

  await enableEmergencyAuthMode();

  console.log('✅ Emergency mode ENABLED for 24 hours');
  console.log('');
  console.log('What this does:');
  console.log('  - Bypasses database user checks');
  console.log('  - Allows all OTPs to be sent');
  console.log('  - Users can login/signup normally');
  console.log('  - Lasts 24 hours (auto-expires)');
  console.log('');
  console.log('After migration, run: npx tsx scripts/disable-emergency-auth.ts');
}

enable();
