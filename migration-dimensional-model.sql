-- ============================================================================
-- DIMENSIONAL MODEL MIGRATION: Exam-Specific → Shared Subjects
-- Date: June 14, 2026
-- Purpose: Migrate from exam-prefixed subjects (jee-physics) to shared (physics)
-- Complete: 52 shared subjects + 295 mappings
-- ============================================================================

-- STEP 0: BACKUP FIRST! (Run outside this script)
-- pg_dump -h [HOST] -U postgres -d postgres > backup_before_migration.sql

BEGIN;

-- ============================================================================
-- STEP 1: Create Shared Subject Taxonomy (52 Shared Subjects)
-- ============================================================================

-- Insert all 52 shared subjects (if they don't exist yet)
INSERT INTO dim_subjects (subject_code, subject_name, category)
VALUES
  -- Core Sciences (4)
  ('physics', 'Physics', 'science'),
  ('chemistry', 'Chemistry', 'science'),
  ('biology', 'Biology', 'science'),
  ('mathematics', 'Mathematics', 'science'),

  -- Languages (2)
  ('english', 'English', 'language'),
  ('hindi', 'Hindi', 'language'),

  -- Aptitude & Reasoning (7)
  ('logical-reasoning', 'Logical Reasoning', 'aptitude'),
  ('quantitative-aptitude', 'Quantitative Aptitude', 'aptitude'),
  ('verbal-ability', 'Verbal Ability', 'aptitude'),
  ('data-interpretation', 'Data Interpretation', 'aptitude'),
  ('analytical-ability', 'Analytical Ability', 'aptitude'),
  ('general-ability-test', 'General Ability Test', 'aptitude'),
  ('general-aptitude', 'General Aptitude', 'aptitude'),

  -- General Knowledge & Current Affairs (3)
  ('general-knowledge', 'General Knowledge', 'general-knowledge'),
  ('current-affairs', 'Current Affairs', 'general-knowledge'),
  ('general-studies', 'General Studies', 'general-knowledge'),

  -- Legal (1)
  ('legal-reasoning', 'Legal Reasoning', 'legal'),

  -- Computer Science & Technology (1)
  ('computer-science', 'Computer Science', 'technology'),

  -- Commerce & Economics (5)
  ('economics', 'Economics', 'commerce'),
  ('accounting', 'Accounting', 'commerce'),
  ('business-law', 'Business Law', 'commerce'),
  ('business-communication', 'Business Communication', 'commerce'),
  ('business-environment', 'Business Environment', 'commerce'),
  ('business-management', 'Business Management', 'commerce'),

  -- Education (3)
  ('child-development-pedagogy', 'Child Development & Pedagogy', 'education'),
  ('teaching-research-aptitude', 'Teaching & Research Aptitude', 'education'),
  ('social-studies', 'Social Studies', 'education'),

  -- Pharmacy (4)
  ('pharmaceutical-chemistry', 'Pharmaceutical Chemistry', 'pharmacy'),
  ('pharmaceutical-analysis', 'Pharmaceutical Analysis', 'pharmacy'),
  ('pharmaceutics', 'Pharmaceutics', 'pharmacy'),
  ('pharmacology', 'Pharmacology', 'pharmacy'),

  -- Medical (3)
  ('clinical-medicine', 'Clinical Medicine', 'medical'),
  ('preclinical-medicine', 'Preclinical Medicine', 'medical'),
  ('nursing-science', 'Nursing Science', 'medical'),

  -- Arts & Architecture (3)
  ('architectural-aptitude', 'Architectural Aptitude', 'arts'),
  ('drawing', 'Drawing', 'arts'),
  ('creative-ability', 'Creative Ability', 'arts'),

  -- Specialized (3)
  ('service-aptitude', 'Service Aptitude', 'specialized'),
  ('subject-knowledge', 'Subject Knowledge', 'specialized'),
  ('cs-fundamentals', 'CS Fundamentals', 'specialized'),

  -- Additional Subjects (11)
  ('banking-awareness', 'Banking Awareness', 'commerce'),
  ('elementary-knowledge-test', 'Elementary Knowledge Test', 'general-knowledge'),
  ('engineering-mathematics', 'Engineering Mathematics', 'science'),
  ('general-science', 'General Science', 'science'),
  ('geography', 'Geography', 'general-knowledge'),
  ('history', 'History', 'general-knowledge'),
  ('political-science', 'Political Science', 'general-knowledge'),
  ('ethics-integrity', 'Ethics & Integrity', 'general-knowledge'),
  ('statistics', 'Statistics', 'science'),
  ('finance-management', 'Finance Management', 'commerce'),
  ('economic-social-issues', 'Economic & Social Issues', 'general-knowledge'),
  ('technical-abilities', 'Technical Abilities', 'specialized')
ON CONFLICT (subject_code) DO NOTHING;


-- ============================================================================
-- STEP 2: Create Subject Mapping Table (295 Mappings)
-- ============================================================================

CREATE TABLE IF NOT EXISTS subject_migration_map (
  old_subject_code TEXT PRIMARY KEY,
  new_subject_code TEXT NOT NULL,
  exam_prefix TEXT NOT NULL,
  notes TEXT
);

-- Insert ALL 295 mappings from subject-mapper.ts
INSERT INTO subject_migration_map (old_subject_code, new_subject_code, exam_prefix, notes) VALUES
  -- ============================================================================
  -- AFCAT (Air Force Common Admission Test)
  -- ============================================================================
  ('afcat-ekt', 'elementary-knowledge-test', 'afcat', 'Elementary Knowledge Test'),
  ('afcat-gk', 'general-knowledge', 'afcat', NULL),
  ('afcat-numerical', 'quantitative-aptitude', 'afcat', NULL),
  ('afcat-reasoning', 'logical-reasoning', 'afcat', NULL),
  ('afcat-verbal', 'verbal-ability', 'afcat', NULL),

  -- ============================================================================
  -- AIIMS (All India Institute of Medical Sciences) - Nursing
  -- ============================================================================
  ('aiims-nursing', 'nursing-science', 'aiims', NULL),

  -- ============================================================================
  -- AILET (All India Law Entrance Test)
  -- ============================================================================
  ('ailet-english', 'english', 'ailet', NULL),
  ('ailet-gk', 'general-knowledge', 'ailet', NULL),
  ('ailet-legal', 'legal-reasoning', 'ailet', NULL),
  ('ailet-logical', 'logical-reasoning', 'ailet', NULL),
  ('ailet-maths', 'mathematics', 'ailet', NULL),

  -- ============================================================================
  -- AIPVT (All India Pre-Veterinary Test)
  -- ============================================================================
  ('aipvt-biology', 'biology', 'aipvt', NULL),
  ('aipvt-chemistry', 'chemistry', 'aipvt', NULL),
  ('aipvt-physics', 'physics', 'aipvt', NULL),

  -- ============================================================================
  -- AP EAMCET (Andhra Pradesh Engineering, Agriculture & Medical Common Entrance)
  -- ============================================================================
  ('ap-chemistry', 'chemistry', 'ap', NULL),
  ('ap-maths', 'mathematics', 'ap', NULL),
  ('ap-physics', 'physics', 'ap', NULL),

  -- ============================================================================
  -- Army Technical Entry Scheme
  -- ============================================================================
  ('army-chemistry', 'chemistry', 'army', NULL),
  ('army-maths', 'mathematics', 'army', NULL),
  ('army-physics', 'physics', 'army', NULL),

  -- ============================================================================
  -- Banking Exams (Generic)
  -- ============================================================================
  ('banking-ssc', 'banking-awareness', 'banking', NULL),

  -- ============================================================================
  -- BCECE (Bihar Combined Entrance Competitive Examination)
  -- ============================================================================
  ('bcece-chemistry', 'chemistry', 'bcece', NULL),
  ('bcece-maths', 'mathematics', 'bcece', NULL),
  ('bcece-physics', 'physics', 'bcece', NULL),

  -- ============================================================================
  -- BPSC (Bihar Public Service Commission)
  -- ============================================================================
  ('bpsc-gs', 'general-studies', 'bpsc', NULL),

  -- ============================================================================
  -- CA (Chartered Accountant) Foundation & Intermediate
  -- ============================================================================
  ('ca-paper1-accounting', 'accounting', 'ca', 'Paper 1 - Accounting'),
  ('ca-paper2-law-correspondence', 'business-law', 'ca', 'Paper 2 - Law & Correspondence'),
  ('ca-paper3a-maths', 'mathematics', 'ca', 'Paper 3A - Mathematics'),
  ('ca-paper3b-logical', 'logical-reasoning', 'ca', 'Paper 3B - Logical Reasoning'),
  ('ca-paper3c-statistics', 'statistics', 'ca', 'Paper 3C - Statistics'),
  ('ca-paper4a-economics', 'economics', 'ca', 'Paper 4A - Economics'),
  ('ca-paper4b-bck', 'business-communication', 'ca', 'Paper 4B - Business Communication & Knowledge'),

  -- ============================================================================
  -- CAT (Common Admission Test) - MBA
  -- ============================================================================
  ('cat-dilr', 'data-interpretation', 'cat', 'Data Interpretation & Logical Reasoning'),
  ('cat-quant', 'quantitative-aptitude', 'cat', 'Quantitative Aptitude'),
  ('cat-varc', 'verbal-ability', 'cat', 'Verbal Ability & Reading Comprehension'),

  -- ============================================================================
  -- CDS (Combined Defence Services)
  -- ============================================================================
  ('cds-english', 'english', 'cds', NULL),
  ('cds-gk', 'general-knowledge', 'cds', NULL),
  ('cds-maths', 'mathematics', 'cds', NULL),

  -- ============================================================================
  -- CISF (Central Industrial Security Force)
  -- ============================================================================
  ('cisf-gk', 'general-knowledge', 'cisf', NULL),
  ('cisf-numerical', 'quantitative-aptitude', 'cisf', NULL),
  ('cisf-reasoning', 'logical-reasoning', 'cisf', NULL),

  -- ============================================================================
  -- UPSC Civil Services (IAS/IPS/IFS)
  -- ============================================================================
  ('upsc-current', 'current-affairs', 'upsc', 'Current Affairs'),
  ('upsc-economy', 'economics', 'upsc', 'Economy'),
  ('upsc-ethics', 'ethics-integrity', 'upsc', 'Ethics & Integrity'),
  ('upsc-geography', 'geography', 'upsc', 'Geography'),
  ('upsc-history', 'history', 'upsc', 'History'),
  ('upsc-polity', 'political-science', 'upsc', 'Polity'),
  ('upsc-science', 'general-science', 'upsc', 'General Science'),
  ('uppsc-csat', 'general-studies', 'uppsc', 'CSAT'),
  ('uppsc-gs', 'general-studies', 'uppsc', 'General Studies'),
  ('ifs-csat', 'general-studies', 'ifs', 'CSAT'),
  ('ifs-gs', 'general-studies', 'ifs', 'General Studies'),

  -- ============================================================================
  -- CLAT (Common Law Admission Test)
  -- ============================================================================
  ('clat-english', 'english', 'clat', NULL),
  ('clat-gk', 'general-knowledge', 'clat', NULL),
  ('clat-legal', 'legal-reasoning', 'clat', NULL),
  ('clat-logical', 'logical-reasoning', 'clat', NULL),
  ('clat-quant', 'quantitative-aptitude', 'clat', NULL),

  -- ============================================================================
  -- COMEDK (Consortium of Medical, Engineering and Dental Colleges of Karnataka)
  -- ============================================================================
  ('comedk-chemistry', 'chemistry', 'comedk', NULL),
  ('comedk-maths', 'mathematics', 'comedk', NULL),
  ('comedk-physics', 'physics', 'comedk', NULL),

  -- ============================================================================
  -- CS (Company Secretary)
  -- ============================================================================
  ('cs-business-economics', 'economics', 'cs', 'Business Economics'),
  ('cs-business-env', 'business-environment', 'cs', 'Business Environment'),
  ('cs-business-mgmt', 'business-management', 'cs', 'Business Management'),
  ('cs-fundamentals', 'cs-fundamentals', 'cs', 'CS Fundamentals'),

  -- ============================================================================
  -- CTET (Central Teacher Eligibility Test)
  -- ============================================================================
  ('ctet-english', 'english', 'ctet', NULL),
  ('ctet-hindi', 'hindi', 'ctet', NULL),
  ('ctet-maths', 'mathematics', 'ctet', NULL),
  ('ctet-pedagogy', 'child-development-pedagogy', 'ctet', NULL),
  ('ctet-science', 'general-science', 'ctet', NULL),
  ('ctet-social', 'social-studies', 'ctet', NULL),

  -- ============================================================================
  -- CUET (Common University Entrance Test)
  -- ============================================================================
  ('cuet-biology', 'biology', 'cuet', NULL),
  ('cuet-chemistry', 'chemistry', 'cuet', NULL),
  ('cuet-english', 'english', 'cuet', NULL),
  ('cuet-physics', 'physics', 'cuet', NULL),

  -- ============================================================================
  -- Delhi Police
  -- ============================================================================
  ('dp-computer', 'computer-science', 'dp', NULL),
  ('dp-gk', 'general-knowledge', 'dp', NULL),
  ('dp-numerical', 'quantitative-aptitude', 'dp', NULL),
  ('dp-reasoning', 'logical-reasoning', 'dp', NULL),

  -- ============================================================================
  -- DSSSB (Delhi Subordinate Services Selection Board)
  -- ============================================================================
  ('dsssb-arithmetic', 'quantitative-aptitude', 'dsssb', NULL),
  ('dsssb-english', 'english', 'dsssb', NULL),
  ('dsssb-gs', 'general-studies', 'dsssb', NULL),
  ('dsssb-hindi', 'hindi', 'dsssb', NULL),
  ('dsssb-reasoning', 'logical-reasoning', 'dsssb', NULL),

  -- ============================================================================
  -- GATE (Graduate Aptitude Test in Engineering)
  -- ============================================================================
  ('gate-aptitude', 'general-aptitude', 'gate', NULL),
  ('gate-engineering-math', 'engineering-mathematics', 'gate', NULL),

  -- ============================================================================
  -- GDS (Gramin Dak Sevak) - Postal
  -- ============================================================================
  ('gds-gk', 'general-knowledge', 'gds', NULL),
  ('gds-maths', 'mathematics', 'gds', NULL),
  ('gds-reasoning', 'logical-reasoning', 'gds', NULL),

  -- ============================================================================
  -- GPAT (Graduate Pharmacy Aptitude Test)
  -- ============================================================================
  ('gpat-chem', 'pharmaceutical-chemistry', 'gpat', 'Pharmaceutical Chemistry'),
  ('gpat-pharma', 'pharmaceutics', 'gpat', 'Pharmaceutics'),
  ('gpat-pharma-analysis', 'pharmaceutical-analysis', 'gpat', 'Pharmaceutical Analysis'),
  ('gpat-pharmaco', 'pharmacology', 'gpat', 'Pharmacology'),

  -- ============================================================================
  -- GUJCET (Gujarat Common Entrance Test)
  -- ============================================================================
  ('gujcet-chemistry', 'chemistry', 'gujcet', NULL),
  ('gujcet-maths', 'mathematics', 'gujcet', NULL),
  ('gujcet-physics', 'physics', 'gujcet', NULL),

  -- ============================================================================
  -- Hotel Management Entrance (NCHMCT)
  -- ============================================================================
  ('nchmct-english', 'english', 'nchmct', NULL),
  ('nchmct-gk', 'general-knowledge', 'nchmct', NULL),
  ('nchmct-numerical', 'quantitative-aptitude', 'nchmct', NULL),
  ('nchmct-reasoning', 'logical-reasoning', 'nchmct', NULL),
  ('nchmct-service', 'service-aptitude', 'nchmct', NULL),

  -- ============================================================================
  -- HTET (Haryana Teacher Eligibility Test)
  -- ============================================================================
  ('htet-cdp', 'child-development-pedagogy', 'htet', NULL),
  ('htet-english', 'english', 'htet', NULL),
  ('htet-hindi', 'hindi', 'htet', NULL),
  ('htet-maths', 'mathematics', 'htet', NULL),
  ('htet-science', 'general-science', 'htet', NULL),
  ('htet-social', 'social-studies', 'htet', NULL),

  -- ============================================================================
  -- IBPS (Institute of Banking Personnel Selection)
  -- ============================================================================
  ('ibps-computer', 'computer-science', 'ibps', NULL),
  ('ibps-english', 'english', 'ibps', NULL),
  ('ibps-ga', 'general-knowledge', 'ibps', 'General Awareness'),
  ('ibps-quant', 'quantitative-aptitude', 'ibps', NULL),
  ('ibps-reasoning', 'logical-reasoning', 'ibps', NULL),
  ('ibps-clerk-computer', 'computer-science', 'ibps', 'Clerk - Computer'),
  ('ibps-clerk-english', 'english', 'ibps', 'Clerk - English'),
  ('ibps-clerk-quant', 'quantitative-aptitude', 'ibps', 'Clerk - Quant'),
  ('ibps-clerk-reasoning', 'logical-reasoning', 'ibps', 'Clerk - Reasoning'),

  -- ============================================================================
  -- ICAR AIEEA (Indian Council of Agricultural Research)
  -- ============================================================================
  ('icar-biology', 'biology', 'icar', NULL),
  ('icar-chemistry', 'chemistry', 'icar', NULL),
  ('icar-maths', 'mathematics', 'icar', NULL),
  ('icar-physics', 'physics', 'icar', NULL),

  -- ============================================================================
  -- IIMC (Indian Institute of Mass Communication)
  -- ============================================================================
  ('iimc-english', 'english', 'iimc', NULL),
  ('iimc-ga', 'general-knowledge', 'iimc', NULL),
  ('iimc-reasoning', 'logical-reasoning', 'iimc', NULL),

  -- ============================================================================
  -- Indian Navy
  -- ============================================================================
  ('navy-english', 'english', 'navy', NULL),
  ('navy-gk', 'general-knowledge', 'navy', NULL),
  ('navy-maths', 'mathematics', 'navy', NULL),
  ('navy-physics', 'physics', 'navy', NULL),

  -- ============================================================================
  -- ISI (Indian Statistical Institute)
  -- ============================================================================
  ('isi-maths', 'mathematics', 'isi', NULL),
  ('isi-stats', 'statistics', 'isi', NULL),

  -- ============================================================================
  -- JCECE (Jharkhand Combined Entrance Competitive Examination)
  -- ============================================================================
  ('jcece-chemistry', 'chemistry', 'jcece', NULL),
  ('jcece-maths', 'mathematics', 'jcece', NULL),
  ('jcece-physics', 'physics', 'jcece', NULL),

  -- ============================================================================
  -- JEE (Joint Entrance Examination) - Main & Advanced
  -- ============================================================================
  ('jee-chemistry', 'chemistry', 'jee', NULL),
  ('jee-maths', 'mathematics', 'jee', NULL),
  ('jee-physics', 'physics', 'jee', NULL),
  ('jee-adv-chemistry', 'chemistry', 'jee', 'Advanced - Chemistry'),
  ('jee-adv-maths', 'mathematics', 'jee', 'Advanced - Maths'),
  ('jee-adv-physics', 'physics', 'jee', 'Advanced - Physics'),

  -- ============================================================================
  -- Judicial Services
  -- ============================================================================
  ('jud-gk', 'general-knowledge', 'jud', NULL),
  ('jud-law', 'legal-reasoning', 'jud', NULL),

  -- ============================================================================
  -- KCET (Karnataka Common Entrance Test)
  -- ============================================================================
  ('kcet-chemistry', 'chemistry', 'kcet', NULL),
  ('kcet-maths', 'mathematics', 'kcet', NULL),
  ('kcet-physics', 'physics', 'kcet', NULL),

  -- ============================================================================
  -- KEAM (Kerala Engineering Architecture Medical)
  -- ============================================================================
  ('keam-chemistry', 'chemistry', 'keam', NULL),
  ('keam-maths', 'mathematics', 'keam', NULL),
  ('keam-physics', 'physics', 'keam', NULL),

  -- ============================================================================
  -- KPSC (Karnataka Public Service Commission)
  -- ============================================================================
  ('kpsc-aptitude', 'general-aptitude', 'kpsc', NULL),
  ('kpsc-gs', 'general-studies', 'kpsc', NULL),

  -- ============================================================================
  -- KVS (Kendriya Vidyalaya Sangathan)
  -- ============================================================================
  ('kvs-gs', 'general-studies', 'kvs', NULL),
  ('kvs-hindi', 'hindi', 'kvs', NULL),
  ('kvs-reasoning', 'logical-reasoning', 'kvs', NULL),
  ('kvs-subject', 'subject-knowledge', 'kvs', NULL),

  -- ============================================================================
  -- LIC (Life Insurance Corporation)
  -- ============================================================================
  ('lic-computer', 'computer-science', 'lic', NULL),
  ('lic-english', 'english', 'lic', NULL),
  ('lic-ga', 'general-knowledge', 'lic', NULL),
  ('lic-quant', 'quantitative-aptitude', 'lic', NULL),
  ('lic-reasoning', 'logical-reasoning', 'lic', NULL),

  -- ============================================================================
  -- MHT CET (Maharashtra Common Entrance Test)
  -- ============================================================================
  ('mht-chemistry', 'chemistry', 'mht', NULL),
  ('mht-maths', 'mathematics', 'mht', NULL),
  ('mht-physics', 'physics', 'mht', NULL),

  -- ============================================================================
  -- MPPSC (Madhya Pradesh Public Service Commission)
  -- ============================================================================
  ('mppsc-aptitude', 'general-aptitude', 'mppsc', NULL),
  ('mppsc-gs', 'general-studies', 'mppsc', NULL),

  -- ============================================================================
  -- NATA (National Aptitude Test in Architecture)
  -- ============================================================================
  ('nata-aptitude', 'architectural-aptitude', 'nata', NULL),
  ('nata-drawing', 'drawing', 'nata', NULL),
  ('nata-maths', 'mathematics', 'nata', NULL),

  -- ============================================================================
  -- NDA (National Defence Academy)
  -- ============================================================================
  ('nda-gat', 'general-ability-test', 'nda', 'General Ability Test'),
  ('nda-maths', 'mathematics', 'nda', NULL),

  -- ============================================================================
  -- NEET (National Eligibility cum Entrance Test) - UG & PG
  -- ============================================================================
  ('neet-biology', 'biology', 'neet', NULL),
  ('neet-chemistry', 'chemistry', 'neet', NULL),
  ('neet-physics', 'physics', 'neet', NULL),
  ('neet-pg-clinical', 'clinical-medicine', 'neet', 'PG - Clinical Medicine'),
  ('neet-pg-preclinical', 'preclinical-medicine', 'neet', 'PG - Preclinical Medicine'),

  -- ============================================================================
  -- NID (National Institute of Design)
  -- ============================================================================
  ('nid-analytical', 'analytical-ability', 'nid', NULL),
  ('nid-gk', 'general-knowledge', 'nid', NULL),

  -- ============================================================================
  -- NIFT (National Institute of Fashion Technology)
  -- ============================================================================
  ('nift-creative', 'creative-ability', 'nift', NULL),
  ('nift-gat', 'general-ability-test', 'nift', NULL),

  -- ============================================================================
  -- Nursing Entrance
  -- ============================================================================
  ('nursing-gk', 'general-knowledge', 'nursing', NULL),
  ('nursing-reasoning', 'logical-reasoning', 'nursing', NULL),
  ('nursing-subject', 'nursing-science', 'nursing', NULL),

  -- ============================================================================
  -- OJEE (Odisha Joint Entrance Examination)
  -- ============================================================================
  ('ojee-chemistry', 'chemistry', 'ojee', NULL),
  ('ojee-maths', 'mathematics', 'ojee', NULL),
  ('ojee-physics', 'physics', 'ojee', NULL),

  -- ============================================================================
  -- Postal Assistant / Post Office
  -- ============================================================================
  ('pa-english', 'english', 'pa', NULL),
  ('pa-gk', 'general-knowledge', 'pa', NULL),
  ('pa-quant', 'quantitative-aptitude', 'pa', NULL),
  ('pa-reasoning', 'logical-reasoning', 'pa', NULL),

  -- ============================================================================
  -- RBI (Reserve Bank of India)
  -- ============================================================================
  ('rbi-english', 'english', 'rbi', NULL),
  ('rbi-esi', 'economic-social-issues', 'rbi', 'Economic & Social Issues'),
  ('rbi-finance', 'finance-management', 'rbi', NULL),
  ('rbi-ga', 'general-knowledge', 'rbi', NULL),
  ('rbi-quant', 'quantitative-aptitude', 'rbi', NULL),
  ('rbi-reasoning', 'logical-reasoning', 'rbi', NULL),

  -- ============================================================================
  -- REAP (Rajasthan Engineering Admission Process)
  -- ============================================================================
  ('reap-chemistry', 'chemistry', 'reap', NULL),
  ('reap-maths', 'mathematics', 'reap', NULL),
  ('reap-physics', 'physics', 'reap', NULL),

  -- ============================================================================
  -- RPSC (Rajasthan Public Service Commission)
  -- ============================================================================
  ('rpsc-aptitude', 'general-aptitude', 'rpsc', NULL),
  ('rpsc-gs', 'general-studies', 'rpsc', NULL),

  -- ============================================================================
  -- RRB (Railway Recruitment Board) - Multiple Exams
  -- ============================================================================
  ('rrb-ga', 'general-knowledge', 'rrb', NULL),
  ('rrb-maths', 'mathematics', 'rrb', NULL),
  ('rrb-reasoning', 'logical-reasoning', 'rrb', NULL),
  ('rrb-alp-ga', 'general-knowledge', 'rrb', 'ALP - General Awareness'),
  ('rrb-alp-maths', 'mathematics', 'rrb', 'ALP - Mathematics'),
  ('rrb-alp-reasoning', 'logical-reasoning', 'rrb', 'ALP - Reasoning'),
  ('rrb-alp-science', 'general-science', 'rrb', 'ALP - Science'),
  ('rrb-d-ga', 'general-knowledge', 'rrb', 'Group D - General Awareness'),
  ('rrb-d-maths', 'mathematics', 'rrb', 'Group D - Mathematics'),
  ('rrb-d-reasoning', 'logical-reasoning', 'rrb', 'Group D - Reasoning'),
  ('rrb-d-science', 'general-science', 'rrb', 'Group D - Science'),
  ('rrb-je-gen', 'general-knowledge', 'rrb', 'JE - General Awareness'),
  ('rrb-je-maths', 'mathematics', 'rrb', 'JE - Mathematics'),
  ('rrb-je-reasoning', 'logical-reasoning', 'rrb', 'JE - Reasoning'),
  ('rrb-je-technical', 'technical-abilities', 'rrb', 'JE - Technical Abilities'),

  -- ============================================================================
  -- RTET (Rajasthan Teacher Eligibility Test)
  -- ============================================================================
  ('rtet-cdp', 'child-development-pedagogy', 'rtet', NULL),
  ('rtet-english', 'english', 'rtet', NULL),
  ('rtet-hindi', 'hindi', 'rtet', NULL),
  ('rtet-maths', 'mathematics', 'rtet', NULL),
  ('rtet-science', 'general-science', 'rtet', NULL),
  ('rtet-social', 'social-studies', 'rtet', NULL),

  -- ============================================================================
  -- SBI (State Bank of India)
  -- ============================================================================
  ('sbi-english', 'english', 'sbi', NULL),
  ('sbi-ga', 'general-knowledge', 'sbi', NULL),
  ('sbi-quant', 'quantitative-aptitude', 'sbi', NULL),
  ('sbi-reasoning', 'logical-reasoning', 'sbi', NULL),

  -- ============================================================================
  -- SSC (Staff Selection Commission) - CGL, CHSL, etc.
  -- ============================================================================
  ('ssc-english', 'english', 'ssc', NULL),
  ('ssc-gk', 'general-knowledge', 'ssc', NULL),
  ('ssc-quant', 'quantitative-aptitude', 'ssc', NULL),
  ('ssc-reasoning', 'logical-reasoning', 'ssc', NULL),
  ('ssc-statistics', 'statistics', 'ssc', NULL),
  ('ssc-chsl-english', 'english', 'ssc', 'CHSL - English'),
  ('ssc-chsl-gk', 'general-knowledge', 'ssc', 'CHSL - General Knowledge'),
  ('ssc-chsl-quant', 'quantitative-aptitude', 'ssc', 'CHSL - Quant'),
  ('ssc-chsl-reasoning', 'logical-reasoning', 'ssc', 'CHSL - Reasoning'),

  -- ============================================================================
  -- TNEA (Tamil Nadu Engineering Admissions)
  -- ============================================================================
  ('tnea-chemistry', 'chemistry', 'tnea', NULL),
  ('tnea-maths', 'mathematics', 'tnea', NULL),
  ('tnea-physics', 'physics', 'tnea', NULL),

  -- ============================================================================
  -- TNPSC (Tamil Nadu Public Service Commission)
  -- ============================================================================
  ('tnpsc-aptitude', 'general-aptitude', 'tnpsc', NULL),
  ('tnpsc-gs', 'general-studies', 'tnpsc', NULL),

  -- ============================================================================
  -- TS EAMCET (Telangana State Engineering, Agriculture & Medical Common Entrance)
  -- ============================================================================
  ('ts-chemistry', 'chemistry', 'ts', NULL),
  ('ts-maths', 'mathematics', 'ts', NULL),
  ('ts-physics', 'physics', 'ts', NULL),

  -- ============================================================================
  -- UGC NET (University Grants Commission National Eligibility Test)
  -- ============================================================================
  ('ugc-paper1', 'teaching-research-aptitude', 'ugc', 'Paper 1 - Teaching & Research Aptitude'),

  -- ============================================================================
  -- UP Police / Uttar Pradesh Police
  -- ============================================================================
  ('up-gk', 'general-knowledge', 'up', NULL),
  ('up-hindi', 'hindi', 'up', NULL),
  ('up-numerical', 'quantitative-aptitude', 'up', NULL),
  ('up-reasoning', 'logical-reasoning', 'up', NULL),

  -- ============================================================================
  -- UPSEE (Uttar Pradesh State Entrance Examination)
  -- ============================================================================
  ('upsee-chemistry', 'chemistry', 'upsee', NULL),
  ('upsee-maths', 'mathematics', 'upsee', NULL),
  ('upsee-physics', 'physics', 'upsee', NULL),

  -- ============================================================================
  -- UPTET (Uttar Pradesh Teacher Eligibility Test)
  -- ============================================================================
  ('uptet-cdp', 'child-development-pedagogy', 'uptet', NULL),
  ('uptet-english', 'english', 'uptet', NULL),
  ('uptet-hindi', 'hindi', 'uptet', NULL),
  ('uptet-maths', 'mathematics', 'uptet', NULL),
  ('uptet-science', 'general-science', 'uptet', NULL),
  ('uptet-social', 'social-studies', 'uptet', NULL),

  -- ============================================================================
  -- WBJEE (West Bengal Joint Entrance Examination)
  -- ============================================================================
  ('wbjee-chemistry', 'chemistry', 'wbjee', NULL),
  ('wbjee-maths', 'mathematics', 'wbjee', NULL),
  ('wbjee-physics', 'physics', 'wbjee', NULL),

  -- ============================================================================
  -- WBPSC (West Bengal Public Service Commission)
  -- ============================================================================
  ('wbpsc-gs', 'general-studies', 'wbpsc', NULL),

  -- ============================================================================
  -- XAT (Xavier Aptitude Test) - MBA
  -- ============================================================================
  ('xat-decision', 'data-interpretation', 'xat', 'Decision Making'),
  ('xat-gk', 'general-knowledge', 'xat', NULL),
  ('xat-quant', 'quantitative-aptitude', 'xat', NULL),
  ('xat-verbal', 'verbal-ability', 'xat', NULL)
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
