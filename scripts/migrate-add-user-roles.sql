-- Migration: Add user roles support
-- Purpose: Enable role-based access control (student vs teacher/contributor)

-- Add role column to users table
ALTER TABLE users
  ADD COLUMN role TEXT DEFAULT 'student'
  CHECK (role IN ('student', 'teacher', 'contributor', 'admin'));

-- Create index for role-based queries (e.g., finding all teachers)
CREATE INDEX idx_users_role ON users(role);

-- Add index for contribution leaderboard queries
CREATE INDEX idx_users_contribution_points ON users(contribution_points DESC NULLS LAST)
  WHERE contribution_points > 0;

-- For existing users, set role to 'student' (already set by DEFAULT but being explicit)
UPDATE users SET role = 'student' WHERE role IS NULL;

-- Add NOT NULL constraint after populating data
ALTER TABLE users ALTER COLUMN role SET NOT NULL;

-- Verification queries:
-- SELECT id, name, email, role, questions_contributed, contribution_points FROM users ORDER BY created_at DESC LIMIT 10;
-- SELECT role, COUNT(*) as count FROM users GROUP BY role;
-- SELECT * FROM pg_indexes WHERE tablename = 'users' AND indexname LIKE 'idx_users%';
