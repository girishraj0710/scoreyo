/**
 * Subject Mapper - Maps exam-specific subjects to shared subjects
 *
 * COMPLETE mapping for ALL 295 subjects across 50+ exams.
 * During migration from exam-prefixed subjects (jee-physics) to shared subjects (physics),
 * this mapper ensures backward compatibility and consistent data access.
 *
 * Usage:
 *   const sharedSubject = toSharedSubject("jee-physics"); // Returns "physics"
 *   const sharedSubject = toSharedSubject("neet-physics"); // Returns "physics" (same!)
 */

export const SUBJECT_MAP: Record<string, string> = {
  // ============================================================================
  // AFCAT (Air Force Common Admission Test)
  // ============================================================================
  'afcat-ekt': 'elementary-knowledge-test',
  'afcat-gk': 'general-knowledge',
  'afcat-numerical': 'quantitative-aptitude',
  'afcat-reasoning': 'logical-reasoning',
  'afcat-verbal': 'verbal-ability',

  // ============================================================================
  // AIIMS (All India Institute of Medical Sciences) - Nursing
  // ============================================================================
  'aiims-nursing': 'nursing-science',

  // ============================================================================
  // AILET (All India Law Entrance Test)
  // ============================================================================
  'ailet-english': 'english',
  'ailet-gk': 'general-knowledge',
  'ailet-legal': 'legal-reasoning',
  'ailet-logical': 'logical-reasoning',
  'ailet-maths': 'mathematics',

  // ============================================================================
  // AIPVT (All India Pre-Veterinary Test)
  // ============================================================================
  'aipvt-biology': 'biology',
  'aipvt-chemistry': 'chemistry',
  'aipvt-physics': 'physics',

  // ============================================================================
  // AP EAMCET (Andhra Pradesh Engineering, Agriculture & Medical Common Entrance)
  // ============================================================================
  'ap-chemistry': 'chemistry',
  'ap-maths': 'mathematics',
  'ap-physics': 'physics',

  // ============================================================================
  // Army Technical Entry Scheme
  // ============================================================================
  'army-chemistry': 'chemistry',
  'army-maths': 'mathematics',
  'army-physics': 'physics',

  // ============================================================================
  // Banking Exams (Generic)
  // ============================================================================
  'banking-ssc': 'banking-awareness',

  // ============================================================================
  // BCECE (Bihar Combined Entrance Competitive Examination)
  // ============================================================================
  'bcece-chemistry': 'chemistry',
  'bcece-maths': 'mathematics',
  'bcece-physics': 'physics',

  // ============================================================================
  // BPSC (Bihar Public Service Commission)
  // ============================================================================
  'bpsc-gs': 'general-studies',

  // ============================================================================
  // CA (Chartered Accountant) Foundation & Intermediate
  // ============================================================================
  'ca-paper1-accounting': 'accounting',
  'ca-paper2-law-correspondence': 'business-law',
  'ca-paper3a-maths': 'mathematics',
  'ca-paper3b-logical': 'logical-reasoning',
  'ca-paper3c-statistics': 'statistics',
  'ca-paper4a-economics': 'economics',
  'ca-paper4b-bck': 'business-communication',

  // ============================================================================
  // CAT (Common Admission Test) - MBA
  // ============================================================================
  'cat-dilr': 'data-interpretation',
  'cat-quant': 'quantitative-aptitude',
  'cat-varc': 'verbal-ability',

  // ============================================================================
  // CDS (Combined Defence Services)
  // ============================================================================
  'cds-english': 'english',
  'cds-gk': 'general-knowledge',
  'cds-maths': 'mathematics',

  // ============================================================================
  // CISF (Central Industrial Security Force)
  // ============================================================================
  'cisf-gk': 'general-knowledge',
  'cisf-numerical': 'quantitative-aptitude',
  'cisf-reasoning': 'logical-reasoning',

  // ============================================================================
  // UPSC Civil Services (IAS/IPS/IFS)
  // ============================================================================
  'upsc-current': 'current-affairs',
  'upsc-economy': 'economics',
  'upsc-ethics': 'ethics-integrity',
  'upsc-geography': 'geography',
  'upsc-history': 'history',
  'upsc-polity': 'political-science',
  'upsc-science': 'general-science',
  'uppsc-csat': 'general-studies',
  'uppsc-gs': 'general-studies',
  'ifs-csat': 'general-studies',
  'ifs-gs': 'general-studies',

  // ============================================================================
  // CLAT (Common Law Admission Test)
  // ============================================================================
  'clat-english': 'english',
  'clat-gk': 'general-knowledge',
  'clat-legal': 'legal-reasoning',
  'clat-logical': 'logical-reasoning',
  'clat-quant': 'quantitative-aptitude',

  // ============================================================================
  // COMEDK (Consortium of Medical, Engineering and Dental Colleges of Karnataka)
  // ============================================================================
  'comedk-chemistry': 'chemistry',
  'comedk-maths': 'mathematics',
  'comedk-physics': 'physics',

  // ============================================================================
  // CS (Company Secretary)
  // ============================================================================
  'cs-business-economics': 'economics',
  'cs-business-env': 'business-environment',
  'cs-business-mgmt': 'business-management',
  'cs-fundamentals': 'cs-fundamentals',

  // ============================================================================
  // CTET (Central Teacher Eligibility Test)
  // ============================================================================
  'ctet-english': 'english',
  'ctet-hindi': 'hindi',
  'ctet-maths': 'mathematics',
  'ctet-pedagogy': 'child-development-pedagogy',
  'ctet-science': 'general-science',
  'ctet-social': 'social-studies',

  // ============================================================================
  // CUET (Common University Entrance Test)
  // ============================================================================
  'cuet-biology': 'biology',
  'cuet-chemistry': 'chemistry',
  'cuet-english': 'english',
  'cuet-physics': 'physics',

  // ============================================================================
  // Delhi Police
  // ============================================================================
  'dp-computer': 'computer-science',
  'dp-gk': 'general-knowledge',
  'dp-numerical': 'quantitative-aptitude',
  'dp-reasoning': 'logical-reasoning',

  // ============================================================================
  // DSSSB (Delhi Subordinate Services Selection Board)
  // ============================================================================
  'dsssb-arithmetic': 'quantitative-aptitude',
  'dsssb-english': 'english',
  'dsssb-gs': 'general-studies',
  'dsssb-hindi': 'hindi',
  'dsssb-reasoning': 'logical-reasoning',

  // ============================================================================
  // GATE (Graduate Aptitude Test in Engineering)
  // ============================================================================
  'gate-aptitude': 'general-aptitude',
  'gate-engineering-math': 'engineering-mathematics',

  // ============================================================================
  // GDS (Gramin Dak Sevak) - Postal
  // ============================================================================
  'gds-gk': 'general-knowledge',
  'gds-maths': 'mathematics',
  'gds-reasoning': 'logical-reasoning',

  // ============================================================================
  // GPAT (Graduate Pharmacy Aptitude Test)
  // ============================================================================
  'gpat-chem': 'pharmaceutical-chemistry',
  'gpat-pharma': 'pharmaceutics',
  'gpat-pharma-analysis': 'pharmaceutical-analysis',
  'gpat-pharmaco': 'pharmacology',

  // ============================================================================
  // GUJCET (Gujarat Common Entrance Test)
  // ============================================================================
  'gujcet-chemistry': 'chemistry',
  'gujcet-maths': 'mathematics',
  'gujcet-physics': 'physics',

  // ============================================================================
  // Hotel Management Entrance (NCHMCT)
  // ============================================================================
  'nchmct-english': 'english',
  'nchmct-gk': 'general-knowledge',
  'nchmct-numerical': 'quantitative-aptitude',
  'nchmct-reasoning': 'logical-reasoning',
  'nchmct-service': 'service-aptitude',

  // ============================================================================
  // HTET (Haryana Teacher Eligibility Test)
  // ============================================================================
  'htet-cdp': 'child-development-pedagogy',
  'htet-english': 'english',
  'htet-hindi': 'hindi',
  'htet-maths': 'mathematics',
  'htet-science': 'general-science',
  'htet-social': 'social-studies',

  // ============================================================================
  // IBPS (Institute of Banking Personnel Selection)
  // ============================================================================
  'ibps-computer': 'computer-science',
  'ibps-english': 'english',
  'ibps-ga': 'general-knowledge',
  'ibps-quant': 'quantitative-aptitude',
  'ibps-reasoning': 'logical-reasoning',
  'ibps-clerk-computer': 'computer-science',
  'ibps-clerk-english': 'english',
  'ibps-clerk-quant': 'quantitative-aptitude',
  'ibps-clerk-reasoning': 'logical-reasoning',

  // ============================================================================
  // ICAR AIEEA (Indian Council of Agricultural Research)
  // ============================================================================
  'icar-biology': 'biology',
  'icar-chemistry': 'chemistry',
  'icar-maths': 'mathematics',
  'icar-physics': 'physics',

  // ============================================================================
  // IIMC (Indian Institute of Mass Communication)
  // ============================================================================
  'iimc-english': 'english',
  'iimc-ga': 'general-knowledge',
  'iimc-reasoning': 'logical-reasoning',

  // ============================================================================
  // Indian Navy
  // ============================================================================
  'navy-english': 'english',
  'navy-gk': 'general-knowledge',
  'navy-maths': 'mathematics',
  'navy-physics': 'physics',

  // ============================================================================
  // ISI (Indian Statistical Institute)
  // ============================================================================
  'isi-maths': 'mathematics',
  'isi-stats': 'statistics',

  // ============================================================================
  // JCECE (Jharkhand Combined Entrance Competitive Examination)
  // ============================================================================
  'jcece-chemistry': 'chemistry',
  'jcece-maths': 'mathematics',
  'jcece-physics': 'physics',

  // ============================================================================
  // JEE (Joint Entrance Examination) - Main & Advanced
  // ============================================================================
  'jee-chemistry': 'chemistry',
  'jee-maths': 'mathematics',
  'jee-physics': 'physics',
  'jee-adv-chemistry': 'chemistry',
  'jee-adv-maths': 'mathematics',
  'jee-adv-physics': 'physics',

  // ============================================================================
  // Judicial Services
  // ============================================================================
  'jud-gk': 'general-knowledge',
  'jud-law': 'legal-reasoning',

  // ============================================================================
  // KCET (Karnataka Common Entrance Test)
  // ============================================================================
  'kcet-chemistry': 'chemistry',
  'kcet-maths': 'mathematics',
  'kcet-physics': 'physics',

  // ============================================================================
  // KEAM (Kerala Engineering Architecture Medical)
  // ============================================================================
  'keam-chemistry': 'chemistry',
  'keam-maths': 'mathematics',
  'keam-physics': 'physics',

  // ============================================================================
  // KPSC (Karnataka Public Service Commission)
  // ============================================================================
  'kpsc-aptitude': 'general-aptitude',
  'kpsc-gs': 'general-studies',

  // ============================================================================
  // KVS (Kendriya Vidyalaya Sangathan)
  // ============================================================================
  'kvs-gs': 'general-studies',
  'kvs-hindi': 'hindi',
  'kvs-reasoning': 'logical-reasoning',
  'kvs-subject': 'subject-knowledge',

  // ============================================================================
  // LIC (Life Insurance Corporation)
  // ============================================================================
  'lic-computer': 'computer-science',
  'lic-english': 'english',
  'lic-ga': 'general-knowledge',
  'lic-quant': 'quantitative-aptitude',
  'lic-reasoning': 'logical-reasoning',

  // ============================================================================
  // MHT CET (Maharashtra Common Entrance Test)
  // ============================================================================
  'mht-chemistry': 'chemistry',
  'mht-maths': 'mathematics',
  'mht-physics': 'physics',

  // ============================================================================
  // MPPSC (Madhya Pradesh Public Service Commission)
  // ============================================================================
  'mppsc-aptitude': 'general-aptitude',
  'mppsc-gs': 'general-studies',

  // ============================================================================
  // NATA (National Aptitude Test in Architecture)
  // ============================================================================
  'nata-aptitude': 'architectural-aptitude',
  'nata-drawing': 'drawing',
  'nata-maths': 'mathematics',

  // ============================================================================
  // NDA (National Defence Academy)
  // ============================================================================
  'nda-gat': 'general-ability-test',
  'nda-maths': 'mathematics',

  // ============================================================================
  // NEET (National Eligibility cum Entrance Test) - UG & PG
  // ============================================================================
  'neet-biology': 'biology',
  'neet-chemistry': 'chemistry',
  'neet-physics': 'physics',
  'neet-pg-clinical': 'clinical-medicine',
  'neet-pg-preclinical': 'preclinical-medicine',

  // ============================================================================
  // NID (National Institute of Design)
  // ============================================================================
  'nid-analytical': 'analytical-ability',
  'nid-gk': 'general-knowledge',

  // ============================================================================
  // NIFT (National Institute of Fashion Technology)
  // ============================================================================
  'nift-creative': 'creative-ability',
  'nift-gat': 'general-ability-test',

  // ============================================================================
  // Nursing Entrance
  // ============================================================================
  'nursing-gk': 'general-knowledge',
  'nursing-reasoning': 'logical-reasoning',
  'nursing-subject': 'nursing-science',

  // ============================================================================
  // OJEE (Odisha Joint Entrance Examination)
  // ============================================================================
  'ojee-chemistry': 'chemistry',
  'ojee-maths': 'mathematics',
  'ojee-physics': 'physics',

  // ============================================================================
  // Postal Assistant / Post Office
  // ============================================================================
  'pa-english': 'english',
  'pa-gk': 'general-knowledge',
  'pa-quant': 'quantitative-aptitude',
  'pa-reasoning': 'logical-reasoning',

  // ============================================================================
  // RBI (Reserve Bank of India)
  // ============================================================================
  'rbi-english': 'english',
  'rbi-esi': 'economic-social-issues',
  'rbi-finance': 'finance-management',
  'rbi-ga': 'general-knowledge',
  'rbi-quant': 'quantitative-aptitude',
  'rbi-reasoning': 'logical-reasoning',

  // ============================================================================
  // REAP (Rajasthan Engineering Admission Process)
  // ============================================================================
  'reap-chemistry': 'chemistry',
  'reap-maths': 'mathematics',
  'reap-physics': 'physics',

  // ============================================================================
  // RPSC (Rajasthan Public Service Commission)
  // ============================================================================
  'rpsc-aptitude': 'general-aptitude',
  'rpsc-gs': 'general-studies',

  // ============================================================================
  // RRB (Railway Recruitment Board) - Multiple Exams
  // ============================================================================
  'rrb-ga': 'general-knowledge',
  'rrb-maths': 'mathematics',
  'rrb-reasoning': 'logical-reasoning',
  'rrb-alp-ga': 'general-knowledge',
  'rrb-alp-maths': 'mathematics',
  'rrb-alp-reasoning': 'logical-reasoning',
  'rrb-alp-science': 'general-science',
  'rrb-d-ga': 'general-knowledge',
  'rrb-d-maths': 'mathematics',
  'rrb-d-reasoning': 'logical-reasoning',
  'rrb-d-science': 'general-science',
  'rrb-je-gen': 'general-knowledge',
  'rrb-je-maths': 'mathematics',
  'rrb-je-reasoning': 'logical-reasoning',
  'rrb-je-technical': 'technical-abilities',

  // ============================================================================
  // RTET (Rajasthan Teacher Eligibility Test)
  // ============================================================================
  'rtet-cdp': 'child-development-pedagogy',
  'rtet-english': 'english',
  'rtet-hindi': 'hindi',
  'rtet-maths': 'mathematics',
  'rtet-science': 'general-science',
  'rtet-social': 'social-studies',

  // ============================================================================
  // SBI (State Bank of India)
  // ============================================================================
  'sbi-english': 'english',
  'sbi-ga': 'general-knowledge',
  'sbi-quant': 'quantitative-aptitude',
  'sbi-reasoning': 'logical-reasoning',

  // ============================================================================
  // SSC (Staff Selection Commission) - CGL, CHSL, etc.
  // ============================================================================
  'ssc-english': 'english',
  'ssc-gk': 'general-knowledge',
  'ssc-quant': 'quantitative-aptitude',
  'ssc-reasoning': 'logical-reasoning',
  'ssc-statistics': 'statistics',
  'ssc-chsl-english': 'english',
  'ssc-chsl-gk': 'general-knowledge',
  'ssc-chsl-quant': 'quantitative-aptitude',
  'ssc-chsl-reasoning': 'logical-reasoning',

  // ============================================================================
  // TNEA (Tamil Nadu Engineering Admissions)
  // ============================================================================
  'tnea-chemistry': 'chemistry',
  'tnea-maths': 'mathematics',
  'tnea-physics': 'physics',

  // ============================================================================
  // TNPSC (Tamil Nadu Public Service Commission)
  // ============================================================================
  'tnpsc-aptitude': 'general-aptitude',
  'tnpsc-gs': 'general-studies',

  // ============================================================================
  // TS EAMCET (Telangana State Engineering, Agriculture & Medical Common Entrance)
  // ============================================================================
  'ts-chemistry': 'chemistry',
  'ts-maths': 'mathematics',
  'ts-physics': 'physics',

  // ============================================================================
  // UGC NET (University Grants Commission National Eligibility Test)
  // ============================================================================
  'ugc-paper1': 'teaching-research-aptitude',

  // ============================================================================
  // UP Police / Uttar Pradesh Police
  // ============================================================================
  'up-gk': 'general-knowledge',
  'up-hindi': 'hindi',
  'up-numerical': 'quantitative-aptitude',
  'up-reasoning': 'logical-reasoning',

  // ============================================================================
  // UPSEE (Uttar Pradesh State Entrance Examination)
  // ============================================================================
  'upsee-chemistry': 'chemistry',
  'upsee-maths': 'mathematics',
  'upsee-physics': 'physics',

  // ============================================================================
  // UPTET (Uttar Pradesh Teacher Eligibility Test)
  // ============================================================================
  'uptet-cdp': 'child-development-pedagogy',
  'uptet-english': 'english',
  'uptet-hindi': 'hindi',
  'uptet-maths': 'mathematics',
  'uptet-science': 'general-science',
  'uptet-social': 'social-studies',

  // ============================================================================
  // WBJEE (West Bengal Joint Entrance Examination)
  // ============================================================================
  'wbjee-chemistry': 'chemistry',
  'wbjee-maths': 'mathematics',
  'wbjee-physics': 'physics',

  // ============================================================================
  // WBPSC (West Bengal Public Service Commission)
  // ============================================================================
  'wbpsc-gs': 'general-studies',

  // ============================================================================
  // XAT (Xavier Aptitude Test) - MBA
  // ============================================================================
  'xat-decision': 'data-interpretation',
  'xat-gk': 'general-knowledge',
  'xat-quant': 'quantitative-aptitude',
  'xat-verbal': 'verbal-ability',
};

/**
 * Convert exam-specific subject ID to shared subject ID
 *
 * @param examSubjectId - Exam-specific subject like "jee-physics"
 * @returns Shared subject like "physics"
 *
 * @example
 * toSharedSubject("jee-physics") // Returns "physics"
 * toSharedSubject("neet-physics") // Returns "physics" (same!)
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
    .replace(/^ga$/, 'general-knowledge')
    .replace('quant', 'quantitative-aptitude')
    .replace('varc', 'verbal-ability')
    .replace('dilr', 'data-interpretation')
    .replace(/^cdp$/, 'child-development-pedagogy')
    .replace('reasoning', 'logical-reasoning')
    .replace('logical', 'logical-reasoning')
    .replace('numerical', 'quantitative-aptitude')
    .replace('aptitude', 'general-aptitude');

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
 * getExamSpecificSubjects("physics")
 * // Returns ["jee-physics", "neet-physics", "jee-adv-physics", ...]
 */
export function getExamSpecificSubjects(sharedSubject: string): string[] {
  return Object.entries(SUBJECT_MAP)
    .filter(([, shared]) => shared === sharedSubject)
    .map(([examSpecific]) => examSpecific);
}
