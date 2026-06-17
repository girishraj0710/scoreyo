-- ============================================================================
-- MASTER INSERT SCRIPT: All English Tense Questions
-- Total: 722 questions (620 basic tenses + 102 advanced tenses)
-- ============================================================================
-- Execution order:
--   1. present-simple (100Q)
--   2. present-continuous (100Q)
--   3. present-perfect (120Q)
--   4. past-simple (100Q)
--   5. past-continuous (100Q)
--   6. future-simple (100Q)
--   7. tenses-advanced (102Q - Future Continuous + Present Perfect Continuous)
-- ============================================================================

-- Clear existing tense questions (if re-running)
DELETE FROM english_questions WHERE topic_id IN (
    'present-simple',
    'present-continuous',
    'present-perfect',
    'past-simple',
    'past-continuous',
    'future-simple',
    'tenses-advanced'
);

-- ============================================================================
-- Load all question files
-- ============================================================================

\echo 'Inserting present-simple questions (100)...'
\i /Users/girish.raj/prepgenie/scripts/output/CORRECT-present-simple-questions.sql

\echo 'Inserting present-continuous questions (100)...'
\i /Users/girish.raj/prepgenie/scripts/output/CORRECT-present-continuous-questions.sql

\echo 'Inserting present-perfect questions (120)...'
\i /Users/girish.raj/prepgenie/scripts/output/CORRECT-present-perfect-FULL.sql

\echo 'Inserting past-simple questions (100)...'
\i /Users/girish.raj/prepgenie/scripts/output/CORRECT-past-simple-FULL.sql

\echo 'Inserting past-continuous questions (100)...'
\i /Users/girish.raj/prepgenie/scripts/output/CORRECT-past-continuous-FULL.sql

\echo 'Inserting future-simple questions (100)...'
\i /Users/girish.raj/prepgenie/scripts/output/CORRECT-future-simple-FULL.sql

\echo 'Inserting tenses-advanced questions (102)...'
\i /Users/girish.raj/prepgenie/scripts/output/COMPLETE-tenses-advanced-ALL-510Q.sql

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

\echo ''
\echo '============================================================================'
\echo 'VERIFICATION RESULTS'
\echo '============================================================================'

SELECT
    topic_id,
    COUNT(*) as total_questions,
    SUM(CASE WHEN difficulty = 'easy' THEN 1 ELSE 0 END) as easy_count,
    SUM(CASE WHEN difficulty = 'medium' THEN 1 ELSE 0 END) as medium_count,
    SUM(CASE WHEN difficulty = 'hard' THEN 1 ELSE 0 END) as hard_count
FROM english_questions
WHERE topic_id IN (
    'present-simple',
    'present-continuous',
    'present-perfect',
    'past-simple',
    'past-continuous',
    'future-simple',
    'tenses-advanced'
)
GROUP BY topic_id
ORDER BY
    CASE topic_id
        WHEN 'present-simple' THEN 1
        WHEN 'present-continuous' THEN 2
        WHEN 'present-perfect' THEN 3
        WHEN 'past-simple' THEN 4
        WHEN 'past-continuous' THEN 5
        WHEN 'future-simple' THEN 6
        WHEN 'tenses-advanced' THEN 7
    END;

\echo ''
\echo 'Total questions inserted:'
SELECT COUNT(*) as grand_total FROM english_questions
WHERE topic_id IN (
    'present-simple',
    'present-continuous',
    'present-perfect',
    'past-simple',
    'past-continuous',
    'future-simple',
    'tenses-advanced'
);

\echo ''
\echo '============================================================================'
\echo 'EXPECTED TOTALS:'
\echo '  present-simple: 100 questions'
\echo '  present-continuous: 100 questions'
\echo '  present-perfect: 120 questions'
\echo '  past-simple: 100 questions'
\echo '  past-continuous: 100 questions'
\echo '  future-simple: 100 questions'
\echo '  tenses-advanced: 102 questions (2 subtopics complete)'
\echo '  GRAND TOTAL: 722 questions'
\echo '============================================================================'
