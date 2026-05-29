-- Fix question_attempts table to have auto-incrementing ID
-- Run this in Supabase SQL Editor

-- Check current structure
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'question_attempts' AND column_name = 'id';

-- Drop the existing primary key constraint
ALTER TABLE question_attempts DROP CONSTRAINT IF EXISTS question_attempts_pkey;

-- Make id a SERIAL (auto-incrementing)
-- First, create a sequence if it doesn't exist
CREATE SEQUENCE IF NOT EXISTS question_attempts_id_seq;

-- Set the column to use the sequence
ALTER TABLE question_attempts
ALTER COLUMN id SET DEFAULT nextval('question_attempts_id_seq');

-- Set the sequence to start from the max existing id + 1
SELECT setval('question_attempts_id_seq', COALESCE((SELECT MAX(id) FROM question_attempts), 0) + 1, false);

-- Add back the primary key
ALTER TABLE question_attempts ADD PRIMARY KEY (id);

-- Verify the fix
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'question_attempts' AND column_name = 'id';
