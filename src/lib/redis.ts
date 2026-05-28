import { Redis } from '@upstash/redis';

// Upstash Redis (FREE tier: 10K requests/day)
// Sign up: https://console.upstash.com/
let redis: Redis | null = null;

export function getRedis(): Redis {
  if (!redis) {
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      console.warn('[Redis] Not configured - running without cache');
      // Return a mock redis that does nothing
      return {
        get: async () => null,
        set: async () => 'OK',
        setex: async () => 'OK',
        del: async () => 1,
        incr: async () => 1,
        expire: async () => 1,
      } as any;
    }

    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
  return redis;
}

// ─── Cache Keys ────────────────────────────────────────────
export const CacheKeys = {
  // Questions cache - 24 hours
  questions: (examId: string, subjectId: string, topic: string, difficulty: string, limit: number) =>
    `q:${examId}:${subjectId}:${topic}:${difficulty}:${limit}`,

  // User stats cache - 5 minutes
  userStats: (userId: string) => `stats:${userId}`,

  // Topic mastery cache - 10 minutes
  topicMastery: (userId: string, examId: string) => `mastery:${userId}:${examId}`,

  // Leaderboard cache - 1 hour
  leaderboard: () => `leaderboard:global`,

  // Question count cache - 1 hour
  questionCount: (examId: string, subjectId: string, topic: string) =>
    `count:${examId}:${subjectId}:${topic}`,

  // User quiz limit cache - resets daily
  quizLimit: (userId: string) => `limit:${userId}:${new Date().toISOString().split('T')[0]}`,
};

// ─── Cache Helpers ─────────────────────────────────────────
export async function getCached<T>(key: string): Promise<T | null> {
  try {
    const redis = getRedis();
    const cached = await redis.get(key);
    if (!cached) return null;

    // Upstash returns parsed JSON automatically
    return cached as T;
  } catch (error) {
    console.error('[Redis] Get error:', error);
    return null;
  }
}

export async function setCached<T>(
  key: string,
  value: T,
  ttlSeconds: number = 3600
): Promise<void> {
  try {
    const redis = getRedis();
    await redis.setex(key, ttlSeconds, JSON.stringify(value));
  } catch (error) {
    console.error('[Redis] Set error:', error);
  }
}

export async function deleteCached(key: string): Promise<void> {
  try {
    const redis = getRedis();
    await redis.del(key);
  } catch (error) {
    console.error('[Redis] Delete error:', error);
  }
}

export async function incrementCached(key: string, ttlSeconds: number = 86400): Promise<number> {
  try {
    const redis = getRedis();
    const count = await redis.incr(key);
    if (count === 1) {
      // First increment - set TTL
      await redis.expire(key, ttlSeconds);
    }
    return count;
  } catch (error) {
    console.error('[Redis] Increment error:', error);
    return 0;
  }
}

// ─── Cache Warming (Background Job) ────────────────────────
export async function warmQuestionCache(
  examId: string,
  subjectId: string,
  topics: string[],
  difficulties: string[] = ['easy', 'medium', 'hard', 'mixed']
) {
  console.log(`[Redis] Warming cache for ${examId}/${subjectId} - ${topics.length} topics`);

  // Import here to avoid circular dependency
  const { getExamQuestions } = await import('./db');

  let warmed = 0;
  for (const topic of topics) {
    for (const difficulty of difficulties) {
      for (const limit of [5, 10, 20]) {
        try {
          const cacheKey = CacheKeys.questions(examId, subjectId, topic, difficulty, limit);

          // Check if already cached
          const existing = await getCached(cacheKey);
          if (existing) {
            console.log(`[Redis] ✓ Already cached: ${cacheKey}`);
            continue;
          }

          // Fetch from DB and cache
          const questions = await getExamQuestions(examId, subjectId, topic, difficulty, limit);
          if (questions && questions.length > 0) {
            await setCached(cacheKey, questions, 86400); // 24 hours
            warmed++;
            console.log(`[Redis] ✓ Cached ${questions.length} questions: ${cacheKey}`);
          }

          // Rate limit to avoid overwhelming DB
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.error(`[Redis] Warm cache error for ${topic}:`, error);
        }
      }
    }
  }

  console.log(`[Redis] Cache warming complete: ${warmed} keys cached`);
  return warmed;
}
