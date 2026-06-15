#!/usr/bin/env tsx
/**
 * Test Database Connection - Diagnostic Script
 */

// Load environment variables FIRST
import './load-env';

console.log('\n🔍 Diagnosing Database Connection\n');
console.log('='.repeat(70));

// Check what POSTGRES_URL is loaded
console.log('\n1️⃣  Environment Variable Check:');
console.log('   POSTGRES_URL:', process.env.POSTGRES_URL);

if (process.env.POSTGRES_URL) {
  const url = new URL(process.env.POSTGRES_URL);
  console.log('\n2️⃣  Parsed Connection String:');
  console.log('   Protocol:', url.protocol);
  console.log('   Hostname:', url.hostname);
  console.log('   Port:', url.port);
  console.log('   Username:', url.username);
  console.log('   Database:', url.pathname.slice(1));
}

// Try to connect
console.log('\n3️⃣  Testing Connection...');
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

pool.query('SELECT NOW() as time, current_database() as db, version() as version')
  .then(result => {
    console.log('\n✅ CONNECTION SUCCESS!\n');
    console.log('   Server Time:', result.rows[0].time);
    console.log('   Database:', result.rows[0].db);
    console.log('   Version:', result.rows[0].version.split(' ')[0]);
    pool.end();
    process.exit(0);
  })
  .catch(err => {
    console.log('\n❌ CONNECTION FAILED!\n');
    console.log('   Error:', err.message);
    console.log('   Code:', err.code);
    if (err.hostname) {
      console.log('   Tried hostname:', err.hostname);
    }
    pool.end();
    process.exit(1);
  });
