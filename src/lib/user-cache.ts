// User existence cache in Redis - bypasses database during Turso migration
import { getRedis } from './redis';

// Cache user existence to avoid database hits during migration
export async function cacheUserExists(email: string, exists: boolean): Promise<void> {
  const redis = getRedis();
  const key = `user:exists:${email.toLowerCase().trim()}`;
  // Cache for 7 days
  await redis.setex(key, 604800, exists ? 'true' : 'false');
}

export async function checkUserExistsInCache(email: string): Promise<boolean | null> {
  const redis = getRedis();
  const key = `user:exists:${email.toLowerCase().trim()}`;
  const cached = await redis.get(key);

  if (cached === null) return null; // Not in cache
  return cached === 'true';
}

// During migration: allow all OTPs (emergency mode)
export async function isEmergencyAuthMode(): Promise<boolean> {
  const redis = getRedis();
  const mode = await redis.get('auth:emergency_mode');
  return mode === 'true';
}

export async function enableEmergencyAuthMode(): Promise<void> {
  const redis = getRedis();
  await redis.setex('auth:emergency_mode', 86400, 'true'); // 24 hours
  console.log('[Auth] 🚨 Emergency mode ENABLED - allowing all logins during migration');
}

export async function disableEmergencyAuthMode(): Promise<void> {
  const redis = getRedis();
  await redis.del('auth:emergency_mode');
  console.log('[Auth] ✅ Emergency mode DISABLED - normal auth checks restored');
}
