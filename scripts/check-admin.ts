#!/usr/bin/env tsx
import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';
import { join } from 'path';

const envFile = readFileSync(join(process.cwd(), '.env.local'), 'utf-8');
envFile.split('\n').forEach((line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const [, key, value] = match;
    process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, '');
  }
});

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function main() {
  const result = await db.execute('SELECT id, email, name FROM users LIMIT 5');
  console.log('User emails in database:');
  result.rows.forEach(r => {
    console.log(`- ${r.email} (${r.name})`);
  });

  console.log('\nTo make yourself admin, update this line in:');
  console.log('src/app/api/admin/questions/route.ts');
  console.log('\nconst ADMIN_EMAILS = ["your-email@example.com"];');
}

main();
