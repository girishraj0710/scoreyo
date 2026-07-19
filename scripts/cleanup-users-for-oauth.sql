-- Phase 1: Database Cleanup and OAuth Schema Updates
-- Date: 2026-07-19
-- Purpose: Prepare database for OAuth integration

-- Step 1: Add OAuth support columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_provider TEXT DEFAULT 'email';
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_picture TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Step 2: Create indexes for faster OAuth lookups
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_auth_provider ON users(auth_provider);

-- Step 3: Clean up users - KEEP ONLY TWO
-- Admin: girish.raj0710@gmail.com
-- Student: grgowda07.1992@gmail.com
DELETE FROM users WHERE email NOT IN ('girish.raj0710@gmail.com', 'grgowda07.1992@gmail.com');

-- Step 4: Verify remaining users
SELECT id, name, email, role, auth_provider, created_at FROM users;
