// Sync users created in Redis (during emergency mode) to Supabase database
import { getRedis } from '../src/lib/redis';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
});

async function syncUsers() {
  console.log('🔄 Syncing Redis cached users to Supabase...\n');

  const redis = getRedis();

  // Scan for all user data keys
  let cursor = 0;
  const userKeys: string[] = [];

  do {
    const result = await redis.scan(cursor, { match: 'user:data:*', count: 100 });
    cursor = result[0];
    userKeys.push(...result[1]);
  } while (cursor !== 0);

  console.log(`Found ${userKeys.length} cached users in Redis\n`);

  if (userKeys.length === 0) {
    console.log('✅ No users to sync');
    return;
  }

  let synced = 0;
  let skipped = 0;
  let errors = 0;

  for (const key of userKeys) {
    try {
      const userData = await redis.get(key);
      if (!userData) {
        skipped++;
        continue;
      }

      const user = typeof userData === 'string' ? JSON.parse(userData) : userData;
      console.log(`Processing: ${user.email}`);

      // Check if user already exists in database
      const existing = await pool.query('SELECT id FROM users WHERE email = $1', [user.email]);

      if (existing.rows.length > 0) {
        console.log(`  ⚠️  Already exists in database, skipping`);
        skipped++;
        continue;
      }

      // Insert user into database
      await pool.query(
        `INSERT INTO users (id, name, email, age, location, phone_number, exam_preparing_for, avatar_color, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          user.id,
          user.name,
          user.email,
          user.age,
          user.location,
          user.phone_number,
          user.exam_preparing_for,
          user.avatar_color,
          user.created_at,
          user.updated_at
        ]
      );

      console.log(`  ✅ Synced to database`);
      synced++;

      // Update cache to indicate user exists
      await redis.setex(`user:exists:${user.email}`, 604800, 'true');

    } catch (error: any) {
      console.error(`  ❌ Error:`, error.message);
      errors++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 Sync Summary:');
  console.log(`✅ Synced: ${synced}`);
  console.log(`⚠️  Skipped: ${skipped}`);
  console.log(`❌ Errors: ${errors}`);
  console.log('='.repeat(60));

  await pool.end();

  console.log('\n✅ Sync complete!');
  console.log('\nNext: Clear Redis cache and disable emergency mode');
}

syncUsers().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
