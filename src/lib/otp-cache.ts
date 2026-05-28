// OTP caching in Redis - eliminates database reads for OTP
import { getRedis } from './redis';

export interface OTPData {
  code: string;
  email: string;
  expiresAt: number;
  verified: boolean;
}

// Save OTP to Redis instead of database
export async function saveOTPToCache(email: string, code: string, expiresMinutes: number = 10): Promise<void> {
  const redis = getRedis();
  const key = `otp:${email.toLowerCase().trim()}`;
  const expiresAt = Date.now() + (expiresMinutes * 60 * 1000);

  const otpData: OTPData = {
    code,
    email: email.toLowerCase().trim(),
    expiresAt,
    verified: false,
  };

  // Store in Redis with TTL
  await redis.setex(key, expiresMinutes * 60, JSON.stringify(otpData));
  console.log(`[OTP Cache] Saved OTP for ${email} (expires in ${expiresMinutes}min)`);
}

// Verify OTP from Redis
export async function verifyOTPFromCache(email: string, code: string): Promise<boolean> {
  const redis = getRedis();
  const key = `otp:${email.toLowerCase().trim()}`;

  const cached = await redis.get(key);
  if (!cached) {
    console.log(`[OTP Cache] No OTP found for ${email}`);
    return false;
  }

  const otpData: OTPData = JSON.parse(cached as string);

  // Check if expired
  if (Date.now() > otpData.expiresAt) {
    await redis.del(key);
    console.log(`[OTP Cache] OTP expired for ${email}`);
    return false;
  }

  // Check if already verified
  if (otpData.verified) {
    console.log(`[OTP Cache] OTP already used for ${email}`);
    return false;
  }

  // Check if code matches
  if (otpData.code !== code) {
    console.log(`[OTP Cache] Invalid OTP for ${email}`);
    return false;
  }

  // Mark as verified
  otpData.verified = true;
  const remainingTTL = Math.floor((otpData.expiresAt - Date.now()) / 1000);
  await redis.setex(key, remainingTTL, JSON.stringify(otpData));

  console.log(`[OTP Cache] ✅ OTP verified for ${email}`);
  return true;
}

// Check if OTP is verified (for session validation)
export async function isOTPVerifiedInCache(email: string): Promise<boolean> {
  const redis = getRedis();
  const key = `otp:${email.toLowerCase().trim()}`;

  const cached = await redis.get(key);
  if (!cached) return false;

  const otpData: OTPData = JSON.parse(cached as string);

  // Check if expired
  if (Date.now() > otpData.expiresAt) {
    await redis.del(key);
    return false;
  }

  return otpData.verified;
}

// Delete OTP from cache
export async function deleteOTPFromCache(email: string): Promise<void> {
  const redis = getRedis();
  const key = `otp:${email.toLowerCase().trim()}`;
  await redis.del(key);
  console.log(`[OTP Cache] Deleted OTP for ${email}`);
}
