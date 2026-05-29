// Simple script to sync a specific user from Redis to Supabase
import { getRedis } from '../src/lib/redis';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'db.zomcofptwlumqkeffbht.supabase.co',
  port: 5432,
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'PrepGenie2026Secure!@#',
  database: process.env.POSTGRES_DATABASE || 'postgres',
  ssl: { rejectUnauthorized: false }
});

async function syncUser(email: string) {
  console.log(`🔄 Syncing user: ${email}\n`);

  const redis = getRedis();
  const key = `user:data:${email.toLowerCase().trim()}`;

  try {
    // Get user from Redis
    const userData = await redis.get(key);

    if (!userData) {
      console.log(`❌ User not found in Redis cache`);
      return;
    }

    const user = typeof userData === 'string' ? JSON.parse(userData) : userData;
    console.log(`Found user in Redis:`, user.name);

    // Check if already in database
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [user.email]);

    if (existing.rows.length > 0) {
      console.log(`✅ User already exists in database`);
      await pool.end();
      return;
    }

    // Insert into database
    await pool.query(
      `INSERT INTO users (id, name, email, age, location, phone_number, exam_preparing_for, avatar_color, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())`,
      [
        user.id,
        user.name,
        user.email,
        user.age || null,
        user.location || '',
        user.phone_number || '',
        user.exam_preparing_for || '',
        user.avatar_color || '#6366f1'
      ]
    );

    console.log(`✅ User synced to Supabase!`);

    // Clear the cache entry so it checks database next time
    await redis.del(`user:exists:${user.email}`);
    console.log(`✅ Cleared user cache`);

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

const email = process.argv[2] || 'girish.raj0710@gmail.com';
syncUser(email).catch(console.error);
