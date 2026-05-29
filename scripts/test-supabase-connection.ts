import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function testConnection() {
  console.log('Testing Supabase connection...\n');

  // Try different connection methods
  const configs = [
    {
      name: 'Direct with encoded password',
      config: {
        host: 'db.zomcofptwlumqkeffbht.supabase.co',
        port: 5432,
        user: 'postgres',
        password: 'PrepGenie2026Secure!@#',
        database: 'postgres',
        ssl: { rejectUnauthorized: false }
      }
    },
    {
      name: 'Connection string (env)',
      config: {
        connectionString: process.env.POSTGRES_URL_NON_POOLING,
        ssl: { rejectUnauthorized: false }
      }
    }
  ];

  for (const { name, config } of configs) {
    console.log(`Trying: ${name}`);
    const client = new Client(config);

    try {
      await client.connect();
      console.log('✅ Connected successfully!');

      const result = await client.query('SELECT version()');
      console.log('PostgreSQL version:', result.rows[0].version.substring(0, 50) + '...');

      await client.end();
      console.log('\n✅ Connection works! You can proceed with import.\n');
      return;
    } catch (error: any) {
      console.log(`❌ Failed: ${error.message}\n`);
      try {
        await client.end();
      } catch {}
    }
  }

  console.log('\n⚠️  All connection attempts failed.');
  console.log('\nPossible solutions:');
  console.log('1. Wait 5-10 minutes for DNS propagation');
  console.log('2. Check if Supabase project is paused/inactive');
  console.log('3. Use Supabase SQL Editor for direct import');
  console.log('4. Contact Supabase support\n');
}

testConnection();
