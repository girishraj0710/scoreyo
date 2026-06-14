-- ============================================================================
-- DIMENSIONAL MODEL MIGRATION: Exam-Specific → Shared Subjects
-- Date: June 14, 2026
-- Purpose: Migrate from exam-prefixed subjects (jee-physics) to shared (physics)
-- ============================================================================

-- STEP 0: BACKUP FIRST! (Run outside this script)
-- pg_dump -h [HOST] -U postgres -d postgres > backup_before_migration.sql

BEGIN;

-- ============================================================================
-- STEP 1: Create Shared Subject Taxonomy
-- ============================================================================

-- Insert shared subjects (if they don't exist yet)
INSERT INTO dim_subjects (subject_code, subject_name, category)
VALUES
  -- Core Sciences
  ('physics', 'Physics', 'science'),
  ('chemistry', 'Chemistry', 'science'),  -- Already exists
  ('biology', 'Biology', 'science'),      -- Already exists
  ('mathematics', 'Mathematics', 'science'),

  -- Languages
  ('english', 'English', 'language'),
  ('hindi', 'Hindi', 'language'),

  -- Aptitude & Reasoning
  ('quantitative-aptitude', 'Quantitative Aptitude', 'aptitude'),
  ('numerical-ability', 'Numerical Ability', 'aptitude'),
  ('logical-reasoning', 'Logical Reasoning', 'aptitude'),
  ('verbal-reasoning', 'Verbal Reasoning', 'aptitude'),
  ('analytical-reasoning', 'Analytical Reasoning', 'aptitude'),
  ('data-interpretation', 'Data Interpretation', 'aptitude'),
  ('verbal-ability', 'Verbal Ability', 'language'),

  -- General Knowledge & Current Affairs
  ('general-knowledge', 'General Knowledge', 'general-knowledge'),
  ('current-affairs', 'Current Affairs', 'general-knowledge'),
  ('general-studies', 'General Studies', 'general-knowledge'),

  -- Legal
  ('legal-reasoning', 'Legal Reasoning', 'legal'),
  ('legal-aptitude', 'Legal Aptitude', 'legal'),

  -- Computer Science
  ('computer-science', 'Computer Science', 'technology'),
  ('computer-networks', 'Computer Networks', 'technology'),
  ('operating-systems', 'Operating Systems', 'technology'),
  ('database-management', 'Database Management Systems', 'technology'),
  ('data-structures', 'Data Structures', 'technology'),
  ('algorithms', 'Algorithms', 'technology'),
  ('theory-of-computation', 'Theory of Computation', 'technology'),

  -- Engineering
  ('engineering-mathematics', 'Engineering Mathematics', 'science'),
  ('electronics', 'Electronics', 'technology'),

  -- Teaching/Education
  ('child-development', 'Child Development & Pedagogy', 'education'),
  ('pedagogy', 'Pedagogy', 'education'),
  ('environmental-studies', 'Environmental Studies', 'science'),

  -- Commerce & Accounts
  ('accounting', 'Accounting', 'commerce'),
  ('economics', 'Economics', 'commerce'),
  ('business-law', 'Business Law', 'commerce'),
  ('statistics', 'Statistics', 'science'),
  ('business-economics', 'Business Economics', 'commerce'),
  ('business-environment', 'Business Environment', 'commerce'),
  ('business-management', 'Business Management', 'commerce'),

  -- Pharmacy
  ('pharmaceutical-chemistry', 'Pharmaceutical Chemistry', 'pharmacy'),
  ('pharmacology', 'Pharmacology', 'pharmacy'),
  ('pharmaceutical-analysis', 'Pharmaceutical Analysis', 'pharmacy'),

  -- Others
  ('computer', 'Computer', 'technology'),
  ('elementary-knowledge-test', 'Elementary Knowledge Test', 'general-knowledge')
ON CONFLICT (subject_code) DO NOTHING;


-- ============================================================================
-- STEP 2: Create Subject Mapping Table (for migration tracking)
-- ============================================================================

CREATE TABLE IF NOT EXISTS subject_migration_map (
  old_subject_code TEXT PRIMARY KEY,
  new_subject_code TEXT NOT NULL,
  exam_prefix TEXT NOT NULL,
  notes TEXT
);

-- Insert all mappings
INSERT INTO subject_migration_map (old_subject_code, new_subject_code, exam_prefix, notes) VALUES
  -- AFCAT (Air Force Common Admission Test)
  ('afcat-ekt', 'elementary-knowledge-test', 'afcat', 'EKT - Elementary Knowledge Test'),
  ('afcat-gk', 'general-knowledge', 'afcat', NULL),
  ('afcat-numerical', 'numerical-ability', 'afcat', NULL),
  ('afcat-reasoning', 'logical-reasoning', 'afcat', NULL),
  ('afcat-verbal', 'verbal-ability', 'afcat', NULL),

  -- AILET (All India Law Entrance Test)
  ('ailet-english', 'english', 'ailet', NULL),
  ('ailet-gk', 'general-knowledge', 'ailet', NULL),
  ('ailet-legal', 'legal-reasoning', 'ailet', NULL),
  ('ailet-logical', 'logical-reasoning', 'ailet', NULL),
  ('ailet-maths', 'mathematics', 'ailet', NULL),
  ('ailet-reasoning', 'logical-reasoning', 'ailet', 'Duplicate with logical'),

  -- AIPVT (All India Pre-Veterinary Test)
  ('aipvt-biology', 'biology', 'aipvt', NULL),
  ('aipvt-chemistry', 'chemistry', 'aipvt', NULL),
  ('aipvt-physics', 'physics', 'aipvt', NULL),

  -- AP (Andhra Pradesh State Exams)
  ('ap-chemistry', 'chemistry', 'ap', NULL),
  ('ap-maths', 'mathematics', 'ap', NULL),
  ('ap-physics', 'physics', 'ap', NULL),

  -- Army Exams
  ('army-chemistry', 'chemistry', 'army', NULL),
  ('army-maths', 'mathematics', 'army', NULL),
  ('army-physics', 'physics', 'army', NULL),

  -- BCECE (Bihar Combined Entrance Competitive Examination)
  ('bcece-chemistry', 'chemistry', 'bcece', NULL),
  ('bcece-maths', 'mathematics', 'bcece', NULL),
  ('bcece-physics', 'physics', 'bcece', NULL),

  -- BPSC (Bihar Public Service Commission)
  ('bpsc-gs', 'general-studies', 'bpsc', NULL),

  -- CA (Chartered Accountant)
  ('ca-accounts', 'accounting', 'ca', NULL),
  ('ca-economics', 'economics', 'ca', NULL),
  ('ca-law', 'business-law', 'ca', NULL),
  ('ca-maths', 'mathematics', 'ca', NULL),
  ('ca-paper1-accounting', 'accounting', 'ca', 'Paper 1 specific'),
  ('ca-paper2-law-correspondence', 'business-law', 'ca', 'Paper 2 specific'),
  ('ca-paper3a-maths', 'mathematics', 'ca', 'Paper 3A specific'),
  ('ca-paper3b-logical', 'logical-reasoning', 'ca', 'Paper 3B specific'),
  ('ca-paper3c-statistics', 'statistics', 'ca', 'Paper 3C specific'),
  ('ca-paper4a-economics', 'economics', 'ca', 'Paper 4A specific'),
  ('ca-paper4b-bck', 'business-management', 'ca', 'Paper 4B - Business Commercial Knowledge'),

  -- CAT (Common Admission Test)
  ('cat-dilr', 'data-interpretation', 'cat', 'Data Interpretation & Logical Reasoning'),
  ('cat-quant', 'quantitative-aptitude', 'cat', NULL),
  ('cat-varc', 'verbal-ability', 'cat', 'Verbal Ability & Reading Comprehension'),

  -- CDS (Combined Defence Services)
  ('cds-english', 'english', 'cds', NULL),
  ('cds-gk', 'general-knowledge', 'cds', NULL),
  ('cds-maths', 'mathematics', 'cds', NULL),

  -- CISF (Central Industrial Security Force)
  ('cisf-gk', 'general-knowledge', 'cisf', NULL),
  ('cisf-numerical', 'numerical-ability', 'cisf', NULL),
  ('cisf-reasoning', 'logical-reasoning', 'cisf', NULL),

  -- CLAT (Common Law Admission Test)
  ('clat-english', 'english', 'clat', NULL),
  ('clat-gk', 'general-knowledge', 'clat', NULL),
  ('clat-legal', 'legal-reasoning', 'clat', NULL),
  ('clat-logical', 'logical-reasoning', 'clat', NULL),
  ('clat-quant', 'quantitative-aptitude', 'clat', NULL),

  -- COMEDK (Consortium of Medical, Engineering and Dental Colleges of Karnataka)
  ('comedk-chemistry', 'chemistry', 'comedk', NULL),
  ('comedk-maths', 'mathematics', 'comedk', NULL),
  ('comedk-physics', 'physics', 'comedk', NULL),

  -- CS (Company Secretary)
  ('cs-business-economics', 'business-economics', 'cs', NULL),
  ('cs-business-env', 'business-environment', 'cs', NULL),
  ('cs-business-mgmt', 'business-management', 'cs', NULL),
  ('cs-fundamentals', 'business-management', 'cs', 'Fundamentals of Business'),

  -- CTET (Central Teacher Eligibility Test)
  ('ctet-child-dev', 'child-development', 'ctet', NULL),
  ('ctet-english', 'english', 'ctet', NULL),
  ('ctet-evs', 'environmental-studies', 'ctet', NULL),
  ('ctet-hindi', 'hindi', 'ctet', NULL),
  ('ctet-language-1', 'english', 'ctet', 'Language 1'),
  ('ctet-language-2', 'hindi', 'ctet', 'Language 2'),
  ('ctet-maths', 'mathematics', 'ctet', NULL),
  ('ctet-pedagogy', 'pedagogy', 'ctet', NULL),
  ('ctet-science', 'biology', 'ctet', 'Science (maps to biology)'),
  ('ctet-social', 'general-knowledge', 'ctet', 'Social Studies'),

  -- DP (Delhi Police)
  ('dp-computer', 'computer', 'dp', NULL),
  ('dp-gk', 'general-knowledge', 'dp', NULL),
  ('dp-numerical', 'numerical-ability', 'dp', NULL),
  ('dp-reasoning', 'logical-reasoning', 'dp', NULL),

  -- DSSSB (Delhi Subordinate Services Selection Board)
  ('dsssb-arithmetic', 'numerical-ability', 'dsssb', NULL),
  ('dsssb-english', 'english', 'dsssb', NULL),
  ('dsssb-gs', 'general-studies', 'dsssb', NULL),
  ('dsssb-hindi', 'hindi', 'dsssb', NULL),
  ('dsssb-reasoning', 'logical-reasoning', 'dsssb', NULL),

  -- GATE (Graduate Aptitude Test in Engineering)
  ('gate-aptitude', 'quantitative-aptitude', 'gate', NULL),
  ('gate-cn', 'computer-networks', 'gate', NULL),
  ('gate-cs', 'computer-science', 'gate', NULL),
  ('gate-dbms', 'database-management', 'gate', NULL),
  ('gate-ds', 'data-structures', 'gate', NULL),
  ('gate-electronics', 'electronics', 'gate', NULL),
  ('gate-engineering-math', 'engineering-mathematics', 'gate', NULL),
  ('gate-os', 'operating-systems', 'gate', NULL),
  ('gate-toc', 'theory-of-computation', 'gate', NULL),

  -- GDS (Gramin Dak Sevak / India Post)
  ('gds-gk', 'general-knowledge', 'gds', NULL),
  ('gds-maths', 'mathematics', 'gds', NULL),
  ('gds-reasoning', 'logical-reasoning', 'gds', NULL),

  -- GPAT (Graduate Pharmacy Aptitude Test)
  ('gpat-chem', 'pharmaceutical-chemistry', 'gpat', NULL),
  ('gpat-pharma', 'pharmacology', 'gpat', NULL),
  ('gpat-pharma-analysis', 'pharmaceutical-analysis', 'gpat', NULL),
  ('gpat-pharmaco', 'pharmacology', 'gpat', 'Duplicate with pharma'),

  -- GUJCET (Gujarat Common Entrance Test)
  ('gujcet-chemistry', 'chemistry', 'gujcet', NULL),
  ('gujcet-maths', 'mathematics', 'gujcet', NULL),
  ('gujcet-physics', 'physics', 'gujcet', NULL),

  -- HTET (Haryana Teacher Eligibility Test)
  ('htet-cdp', 'child-development', 'htet', NULL),
  ('htet-english', 'english', 'htet', NULL),
  ('htet-env', 'environmental-studies', 'htet', NULL)
ON CONFLICT (old_subject_code) DO NOTHING;


-- ============================================================================
-- STEP 3: Create New Bridge Entries with Shared Subjects
-- ============================================================================

-- This creates new bridge entries that point to shared subjects
-- while keeping the old ones intact (for safety)

INSERT INTO bridge_exam_subject_topic (exam_id, subject_id, topic_id, is_mandatory, weightage)
SELECT DISTINCT
  b.exam_id,
  ns.id AS new_subject_id,    -- Points to shared subject
  b.topic_id,                  -- Keep same topic (already shared)
  b.is_mandatory,
  b.weightage
FROM bridge_exam_subject_topic b
JOIN dim_subjects os ON b.subject_id = os.id  -- Old exam-specific subject
JOIN subject_migration_map m ON os.subject_code = m.old_subject_code
JOIN dim_subjects ns ON m.new_subject_code = ns.subject_code  -- New shared subject
WHERE NOT EXISTS (
  -- Don't create duplicates
  SELECT 1 FROM bridge_exam_subject_topic b2
  WHERE b2.exam_id = b.exam_id
    AND b2.subject_id = ns.id
    AND b2.topic_id = b.topic_id
);

-- Show how many new bridge entries were created
SELECT 'Bridge entries created with shared subjects' AS status, COUNT(*) AS count
FROM bridge_exam_subject_topic b
JOIN dim_subjects s ON b.subject_id = s.id
WHERE s.subject_code NOT LIKE '%-%';


-- ============================================================================
-- STEP 4: Verification Queries
-- ============================================================================

-- Verify that all exams still have their subjects mapped
SELECT
  e.exam_code,
  e.exam_name,
  COUNT(DISTINCT b.subject_id) as subject_count,
  COUNT(DISTINCT b.topic_id) as topic_count
FROM dim_exams e
LEFT JOIN bridge_exam_subject_topic b ON e.id = b.exam_id
JOIN dim_subjects s ON b.subject_id = s.id
WHERE s.subject_code NOT LIKE '%-%'  -- Only count shared subjects
GROUP BY e.exam_code, e.exam_name
ORDER BY e.exam_code;

-- Show shared subjects now being used
SELECT
  s.subject_code,
  s.subject_name,
  COUNT(DISTINCT b.exam_id) as exam_count,
  COUNT(DISTINCT b.topic_id) as topic_count
FROM dim_subjects s
LEFT JOIN bridge_exam_subject_topic b ON s.id = b.subject_id
WHERE s.subject_code NOT LIKE '%-%'  -- Shared subjects only
GROUP BY s.subject_code, s.subject_name
HAVING COUNT(DISTINCT b.exam_id) > 0
ORDER BY exam_count DESC, s.subject_code;

COMMIT;

-- ============================================================================
-- STEP 5: AFTER TESTING - Cleanup Old Exam-Specific Subjects (OPTIONAL)
-- ============================================================================

-- IMPORTANT: Only run this after thoroughly testing the new structure!
-- Uncomment and run separately after verification

/*
BEGIN;

-- Delete old bridge entries pointing to exam-specific subjects
DELETE FROM bridge_exam_subject_topic
WHERE subject_id IN (
  SELECT id FROM dim_subjects
  WHERE subject_code IN (SELECT old_subject_code FROM subject_migration_map)
);

-- Delete old exam-specific subjects
DELETE FROM dim_subjects
WHERE subject_code IN (SELECT old_subject_code FROM subject_migration_map);

-- Drop temporary mapping table
DROP TABLE subject_migration_map;

COMMIT;
*/
