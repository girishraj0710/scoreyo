-- Add subscription status columns to users table
-- These columns track Pro subscription status

ALTER TABLE users
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'pro'));

ALTER TABLE users
ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMP;

-- Set existing users to free tier
UPDATE users SET subscription_status = 'free' WHERE subscription_status IS NULL;

-- Create index for fast subscription lookups
CREATE INDEX IF NOT EXISTS idx_users_subscription_status ON users(subscription_status);
