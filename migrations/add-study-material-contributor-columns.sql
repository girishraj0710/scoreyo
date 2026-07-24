-- Add contributor reward columns used by approveStudyMaterial() in src/lib/db.ts.
-- Without these, approving a study material throws (column does not exist) and
-- the approve transaction rolls back with a 500.
-- Idempotent: safe to run against an existing DB.

ALTER TABLE users ADD COLUMN IF NOT EXISTS materials_contributed INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_points INTEGER DEFAULT 0;
