// Clear Redis user existence cache (user:exists:*) so it checks database
import { getRedis } from '../src/lib/redis';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function clearCache() {
  console.log('🧹 Clearing Redis user cache...\n');

  const redis = getRedis();

  // Delete all user:exists:* keys
  let cursor = 0;
  let deleted = 0;

  do {
    const result = await redis.scan(cursor, { match: 'user:exists:*', count: 100 });
    cursor = result[0];

    for (const key of result[1]) {
      await redis.del(key);
      deleted++;
    }
  } while (cursor !== 0);

  console.log(`✅ Deleted ${deleted} user cache entries\n`);
  console.log('Now the app will check Supabase database for user existence');
}

clearCache().catch(console.error);
