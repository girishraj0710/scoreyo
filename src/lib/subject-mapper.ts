/**
 * Subject Mapper - Maps exam-specific subjects to shared subjects
 *
 * During migration from exam-prefixed subjects (jee-physics) to shared subjects (physics),
 * this mapper ensures backward compatibility and consistent data access.
 *
 * Usage:
 *   const sharedSubject = toSharedSubject("jee-physics"); // Returns "physics"
 */

export const SUBJECT_MAP: Record<string, string> = {
  // AFCAT (Air Force Common Admission Test)
  'afcat-ekt': 'elementary-knowledge-test',
  'afcat-gk': 'general-knowledge',
  'afcat-numerical': 'numerical-ability',
  'afcat-reasoning': 'logical-reasoning',
  'afcat-verbal': 'verbal-ability',

  // AILET (All India Law Entrance Test)
  'ailet-english': 'english',
  'ailet-gk': 'general-knowledge',
  'ailet-legal': 'legal-reasoning',
  'ailet-logical': 'logical-reasoning',
  'ailet-maths': 'mathematics',
  'ailet-reasoning': 'logical-reasoning',

  // AIPVT (All India Pre-Veterinary Test)
  'aipvt-biology': 'biology',
  'aipvt-chemistry': 'chemistry',
  'aipvt-physics': 'physics',

  // AP (Andhra Pradesh State Exams)
  'ap-chemistry': 'chemistry',
  'ap-maths': 'mathematics',
  'ap-physics': 'physics',

  // Army Exams
  'army-chemistry': 'chemistry',
  'army-maths': 'mathematics',
  'army-physics': 'physics',

  // BCECE (Bihar Combined Entrance Competitive Examination)
  'bcece-chemistry': 'chemistry',
  'bcece-maths': 'mathematics',
  'bcece-physics': 'physics',

  // BPSC (Bihar Public Service Commission)
  'bpsc-gs': 'general-studies',

  // CA (Chartered Accountant)
  'ca-accounts': 'accounting',
  'ca-economics': 'economics',
  'ca-law': 'business-law',
  'ca-maths': 'mathematics',
  'ca-paper1-accounting': 'accounting',
  'ca-paper2-law-correspondence': 'business-law',
  'ca-paper3a-maths': 'mathematics',
  'ca-paper3b-logical': 'logical-reasoning',
  'ca-paper3c-statistics': 'statistics',
  'ca-paper4a-economics': 'economics',
  'ca-paper4b-bck': 'business-management',

  // CAT (Common Admission Test)
  'cat-dilr': 'data-interpretation',
  'cat-quant': 'quantitative-aptitude',
  'cat-varc': 'verbal-ability',

  // CDS (Combined Defence Services)
  'cds-english': 'english',
  'cds-gk': 'general-knowledge',
  'cds-maths': 'mathematics',

  // CISF (Central Industrial Security Force)
  'cisf-gk': 'general-knowledge',
  'cisf-numerical': 'numerical-ability',
  'cisf-reasoning': 'logical-reasoning',

  // CLAT (Common Law Admission Test)
  'clat-english': 'english',
  'clat-gk': 'general-knowledge',
  'clat-legal': 'legal-reasoning',
  'clat-logical': 'logical-reasoning',
  'clat-quant': 'quantitative-aptitude',

  // COMEDK (Consortium of Medical, Engineering and Dental Colleges of Karnataka)
  'comedk-chemistry': 'chemistry',
  'comedk-maths': 'mathematics',
  'comedk-physics': 'physics',

  // CS (Company Secretary)
  'cs-business-economics': 'business-economics',
  'cs-business-env': 'business-environment',
  'cs-business-mgmt': 'business-management',
  'cs-fundamentals': 'business-management',

  // CTET (Central Teacher Eligibility Test)
  'ctet-child-dev': 'child-development',
  'ctet-english': 'english',
  'ctet-evs': 'environmental-studies',
  'ctet-hindi': 'hindi',
  'ctet-language-1': 'english',
  'ctet-language-2': 'hindi',
  'ctet-maths': 'mathematics',
  'ctet-pedagogy': 'pedagogy',
  'ctet-science': 'biology',
  'ctet-social': 'general-knowledge',

  // DP (Delhi Police)
  'dp-computer': 'computer',
  'dp-gk': 'general-knowledge',
  'dp-numerical': 'numerical-ability',
  'dp-reasoning': 'logical-reasoning',

  // DSSSB (Delhi Subordinate Services Selection Board)
  'dsssb-arithmetic': 'numerical-ability',
  'dsssb-english': 'english',
  'dsssb-gs': 'general-studies',
  'dsssb-hindi': 'hindi',
  'dsssb-reasoning': 'logical-reasoning',

  // GATE (Graduate Aptitude Test in Engineering)
  'gate-aptitude': 'quantitative-aptitude',
  'gate-cn': 'computer-networks',
  'gate-cs': 'computer-science',
  'gate-dbms': 'database-management',
  'gate-ds': 'data-structures',
  'gate-electronics': 'electronics',
  'gate-engineering-math': 'engineering-mathematics',
  'gate-os': 'operating-systems',
  'gate-toc': 'theory-of-computation',

  // GDS (Gramin Dak Sevak / India Post)
  'gds-gk': 'general-knowledge',
  'gds-maths': 'mathematics',
  'gds-reasoning': 'logical-reasoning',

  // GPAT (Graduate Pharmacy Aptitude Test)
  'gpat-chem': 'pharmaceutical-chemistry',
  'gpat-pharma': 'pharmacology',
  'gpat-pharma-analysis': 'pharmaceutical-analysis',
  'gpat-pharmaco': 'pharmacology',

  // GUJCET (Gujarat Common Entrance Test)
  'gujcet-chemistry': 'chemistry',
  'gujcet-maths': 'mathematics',
  'gujcet-physics': 'physics',

  // HTET (Haryana Teacher Eligibility Test)
  'htet-cdp': 'child-development',
  'htet-english': 'english',
  'htet-env': 'environmental-studies',

  // JEE (Joint Entrance Examination)
  'jee-chemistry': 'chemistry',
  'jee-maths': 'mathematics',
  'jee-physics': 'physics',

  // NEET (National Eligibility cum Entrance Test)
  'neet-biology': 'biology',
  'neet-chemistry': 'chemistry',
  'neet-physics': 'physics',

  // UPSC (Union Public Service Commission)
  'upsc-chemistry': 'chemistry',
  'upsc-economics': 'economics',
  'upsc-geography': 'geography',
  'upsc-gs': 'general-studies',
  'upsc-history': 'history',
  'upsc-maths': 'mathematics',
  'upsc-physics': 'physics',
  'upsc-polity': 'political-science',

  // SSC (Staff Selection Commission)
  'ssc-english': 'english',
  'ssc-gk': 'general-knowledge',
  'ssc-maths': 'mathematics',
  'ssc-reasoning': 'logical-reasoning',

  // Banking Exams (IBPS, SBI, RBI, etc.)
  'banking-english': 'english',
  'banking-gk': 'general-knowledge',
  'banking-quant': 'quantitative-aptitude',
  'banking-reasoning': 'logical-reasoning',

  // CUET (Common University Entrance Test)
  'cuet-biology': 'biology',
  'cuet-chemistry': 'chemistry',
  'cuet-english': 'english',
  'cuet-physics': 'physics',
};

/**
 * Convert exam-specific subject ID to shared subject ID
 *
 * @param examSubjectId - Exam-specific subject like "jee-physics"
 * @returns Shared subject like "physics"
 *
 * @example
 * toSharedSubject("jee-physics") // Returns "physics"
 * toSharedSubject("cat-dilr") // Returns "data-interpretation"
 * toSharedSubject("physics") // Returns "physics" (already shared)
 */
export function toSharedSubject(examSubjectId: string): string {
  // If it's in the map, return the mapped value
  if (SUBJECT_MAP[examSubjectId]) {
    return SUBJECT_MAP[examSubjectId];
  }

  // If it's already a shared subject (no dash or doesn't start with exam prefix), return as-is
  if (!examSubjectId.includes('-')) {
    return examSubjectId;
  }

  // Fallback: try to extract base subject by removing exam prefix
  return extractBaseSubject(examSubjectId);
}

/**
 * Extract base subject from exam-specific ID (fallback method)
 * Strips exam prefix and attempts to normalize
 *
 * @param examSubjectId - Exam-specific subject like "jee-physics"
 * @returns Base subject like "physics"
 *
 * @example
 * extractBaseSubject("jee-physics") // Returns "physics"
 * extractBaseSubject("comedk-maths") // Returns "mathematics"
 */
export function extractBaseSubject(examSubjectId: string): string {
  // Remove exam prefix (everything before first dash)
  const withoutPrefix = examSubjectId.replace(/^[a-z]+-/, '');

  // Normalize common variations
  const normalized = withoutPrefix
    .replace('maths', 'mathematics')
    .replace('gs', 'general-studies')
    .replace('gk', 'general-knowledge')
    .replace('quant', 'quantitative-aptitude')
    .replace('varc', 'verbal-ability')
    .replace('dilr', 'data-interpretation');

  return normalized;
}

/**
 * Check if a subject ID is exam-specific (has exam prefix)
 *
 * @param subjectId - Subject ID to check
 * @returns true if exam-specific, false if shared
 *
 * @example
 * isExamSpecific("jee-physics") // Returns true
 * isExamSpecific("physics") // Returns false
 */
export function isExamSpecific(subjectId: string): boolean {
  return subjectId in SUBJECT_MAP;
}

/**
 * Get all exam-specific subject IDs for a shared subject
 * Useful for reverse mapping
 *
 * @param sharedSubject - Shared subject like "physics"
 * @returns Array of exam-specific subjects that map to it
 *
 * @example
 * getExamSpecificSubjects("physics") // Returns ["jee-physics", "neet-physics", ...]
 */
export function getExamSpecificSubjects(sharedSubject: string): string[] {
  return Object.entries(SUBJECT_MAP)
    .filter(([, shared]) => shared === sharedSubject)
    .map(([examSpecific]) => examSpecific);
}
