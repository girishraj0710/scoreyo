import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create Redis client - only if credentials are available
let redis: Redis | undefined;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
} else {
  console.warn('[Rate Limit] Redis not configured - rate limiting will be bypassed');
}

// Create rate limiters with Redis if available
// If Redis is not available, these will be undefined and calling code should handle gracefully

export const otpSendLimiter = redis ? new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "10 m"),
  analytics: true,
  prefix: "ratelimit:otp-send",
}) : undefined;

export const otpVerifyLimiter = redis ? new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "15 m"),
  analytics: true,
  prefix: "ratelimit:otp-verify",
}) : undefined;

export const quizGenerationLimiter = redis ? new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "1 h"), // 100 per hour (generous for testing)
  analytics: true,
  prefix: "ratelimit:quiz-gen",
}) : undefined;

export const paymentLimiter = redis ? new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "5 m"),
  analytics: true,
  prefix: "ratelimit:payment",
}) : undefined;
