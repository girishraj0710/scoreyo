-- Group Study Schema (Phase 1: groups + invite/join)
-- Students create a study group, invite friends via a join code/link, and join.
-- Sharing of decks/materials/quizzes and group leaderboards come in later phases.
-- Created: 2026-07-23

-- A study group. Any user can create one (feature is free for all).
CREATE TABLE IF NOT EXISTS study_groups (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  owner_id TEXT NOT NULL,
  join_code TEXT NOT NULL UNIQUE, -- short shareable code (nanoid, 8 chars)
  exam_id TEXT,                   -- optional: group focused on a specific exam
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Membership join table (models user_enrolled_exams). One row per user per group.
CREATE TABLE IF NOT EXISTS group_members (
  id TEXT PRIMARY KEY,
  group_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member', -- 'owner' | 'member'
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (group_id, user_id),
  FOREIGN KEY (group_id) REFERENCES study_groups(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Lookups
CREATE INDEX IF NOT EXISTS idx_study_groups_join_code ON study_groups(join_code);
CREATE INDEX IF NOT EXISTS idx_study_groups_owner ON study_groups(owner_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user ON group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_group_members_group ON group_members(group_id);

-- Comments
COMMENT ON TABLE study_groups IS 'Student-created study groups; joined via short invite code';
COMMENT ON COLUMN study_groups.join_code IS 'Short unique nanoid code used in invite links (/groups/join/<code>)';
COMMENT ON TABLE group_members IS 'Membership of users in study groups (owner + members)';
