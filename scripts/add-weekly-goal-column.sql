-- Add weekly_goal_hours column to users table
-- Default: 8 hours per week

ALTER TABLE users
ADD COLUMN IF NOT EXISTS weekly_goal_hours INTEGER DEFAULT 8;
