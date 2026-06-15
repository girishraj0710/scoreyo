-- Quick update to reload present-tenses content with fixed markdown
-- Run this in Supabase SQL Editor

DELETE FROM topic_study_content WHERE topic_id IN (
  'present-tenses',
  'present-simple', 
  'present-continuous',
  'present-perfect',
  'present-perfect-continuous'
);
