/**
 * Syllabus Currency Configuration
 *
 * Purpose: Track which syllabus year each exam follows
 * Updates: Manually update this file once a year when new syllabi are announced
 *
 * How it works:
 * - Each exam has a current syllabus year
 * - Questions in database are tagged with syllabus_year
 * - Quiz generator prioritizes questions matching current syllabus
 * - Old questions are deprioritized but not deleted (backup)
 */

export interface SyllabusConfig {
  examId: string;
  examName: string;
  currentSyllabusYear: number;  // Year when syllabus became effective
  lastUpdated: string;          // ISO date of config update
  changes?: string;             // Brief description of changes
  officialNotice?: string;      // URL to official notification
}

/**
 * CURRENT SYLLABUS CONFIGURATION (2026)
 *
 * Update this annually when new syllabi are announced!
 * Usually happens: Jan-March for most exams
 */
export const CURRENT_SYLLABUS: SyllabusConfig[] = [
  // Engineering Entrance Exams
  {
    examId: "jee-main",
    examName: "JEE Main",
    currentSyllabusYear: 2024,  // JEE Main 2024 syllabus (current)
    lastUpdated: "2026-05-16",
    changes: "No major changes from 2024 syllabus",
    officialNotice: "https://jeemain.nta.nic.in/",
  },
  {
    examId: "jee-advanced",
    examName: "JEE Advanced",
    currentSyllabusYear: 2024,
    lastUpdated: "2026-05-16",
    changes: "No major changes from 2024 syllabus",
    officialNotice: "https://jeeadv.ac.in/",
  },
  {
    examId: "karnataka-cet",
    examName: "Karnataka CET",
    currentSyllabusYear: 2024,
    lastUpdated: "2026-05-16",
    changes: "Based on Karnataka PUC II syllabus 2024",
    officialNotice: "https://cetonline.karnataka.gov.in/",
  },
  {
    examId: "comedk-uget",
    examName: "COMEDK UGET",
    currentSyllabusYear: 2024,
    lastUpdated: "2026-05-16",
    changes: "Karnataka PUC II syllabus",
    officialNotice: "https://www.comedk.org/",
  },
  {
    examId: "mht-cet",
    examName: "MHT CET",
    currentSyllabusYear: 2024,
    lastUpdated: "2026-05-16",
    changes: "Maharashtra HSC syllabus 2024",
    officialNotice: "https://cetcell.mahacet.org/",
  },
  {
    examId: "ts-eamcet",
    examName: "TS EAMCET",
    currentSyllabusYear: 2024,
    lastUpdated: "2026-05-16",
    changes: "Telangana Inter syllabus",
    officialNotice: "https://eamcet.tsche.ac.in/",
  },
  {
    examId: "ap-eamcet",
    examName: "AP EAMCET",
    currentSyllabusYear: 2024,
    lastUpdated: "2026-05-16",
    changes: "AP Inter syllabus",
    officialNotice: "https://apeapcet.nic.in/",
  },
  {
    examId: "wbjee",
    examName: "WBJEE",
    currentSyllabusYear: 2024,
    lastUpdated: "2026-05-16",
    changes: "West Bengal Council syllabus",
    officialNotice: "https://wbjeeb.nic.in/",
  },
  {
    examId: "keam",
    examName: "KEAM",
    currentSyllabusYear: 2024,
    lastUpdated: "2026-05-16",
    changes: "Kerala Plus Two syllabus",
    officialNotice: "https://cee.kerala.gov.in/",
  },

  // Graduate Exams
  {
    examId: "gate",
    examName: "GATE",
    currentSyllabusYear: 2025,  // GATE 2025 syllabus
    lastUpdated: "2026-05-16",
    changes: "Minor updates in CS, EC subjects for GATE 2025",
    officialNotice: "https://gate.iitm.ac.in/",
  },

  // Medical Entrance
  {
    examId: "neet-ug",
    examName: "NEET UG",
    currentSyllabusYear: 2024,
    lastUpdated: "2026-05-16",
    changes: "NCERT-based syllabus, no major changes",
    officialNotice: "https://neet.nta.nic.in/",
  },
  {
    examId: "neet-pg",
    examName: "NEET PG",
    currentSyllabusYear: 2024,
    lastUpdated: "2026-05-16",
    changes: "NBE syllabus 2024",
    officialNotice: "https://natboard.edu.in/",
  },

  // Civil Services
  {
    examId: "upsc-cse",
    examName: "UPSC CSE",
    currentSyllabusYear: 2024,  // UPSC rarely changes syllabus
    lastUpdated: "2026-05-16",
    changes: "No changes to core syllabus",
    officialNotice: "https://www.upsc.gov.in/",
  },

  // Banking & SSC
  {
    examId: "sbi-po",
    examName: "SBI PO",
    currentSyllabusYear: 2024,
    lastUpdated: "2026-05-16",
    changes: "Standard banking exam pattern",
  },
  {
    examId: "ibps-po",
    examName: "IBPS PO",
    currentSyllabusYear: 2024,
    lastUpdated: "2026-05-16",
    changes: "Standard IBPS pattern",
  },
  {
    examId: "ssc-cgl",
    examName: "SSC CGL",
    currentSyllabusYear: 2024,
    lastUpdated: "2026-05-16",
    changes: "Standard SSC pattern",
  },
  {
    examId: "ssc-chsl",
    examName: "SSC CHSL",
    currentSyllabusYear: 2024,
    lastUpdated: "2026-05-16",
    changes: "Standard SSC pattern",
  },

  // Management
  {
    examId: "cat",
    examName: "CAT",
    currentSyllabusYear: 2024,
    lastUpdated: "2026-05-16",
    changes: "No specific syllabus, pattern-based",
  },

  // Railway
  {
    examId: "rrb-ntpc",
    examName: "RRB NTPC",
    currentSyllabusYear: 2024,
    lastUpdated: "2026-05-16",
    changes: "Standard RRB pattern",
  },
  {
    examId: "rrb-alp",
    examName: "RRB ALP",
    currentSyllabusYear: 2024,
    lastUpdated: "2026-05-16",
    changes: "Standard RRB pattern",
  },
];

/**
 * Get current syllabus year for an exam
 */
export function getCurrentSyllabusYear(examId: string): number {
  const config = CURRENT_SYLLABUS.find(s => s.examId === examId);
  return config?.currentSyllabusYear || 2024; // Default to 2024 if not found
}

/**
 * Get syllabus config for an exam
 */
export function getSyllabusConfig(examId: string): SyllabusConfig | undefined {
  return CURRENT_SYLLABUS.find(s => s.examId === examId);
}

/**
 * Check if a question is from current syllabus
 */
export function isCurrentSyllabus(examId: string, questionSyllabusYear?: number): boolean {
  if (!questionSyllabusYear) return false; // Old questions without syllabus_year
  const currentYear = getCurrentSyllabusYear(examId);
  return questionSyllabusYear === currentYear;
}

/**
 * Get all exams that need syllabus updates
 * (Compare with what's in the database)
 */
export function getExamsNeedingUpdate(): SyllabusConfig[] {
  // This will be used by the annual update cron
  return CURRENT_SYLLABUS;
}

/**
 * ANNUAL UPDATE CHECKLIST (Run every January)
 *
 * 1. Check official notifications:
 *    - NTA (JEE, NEET): Usually Jan-Feb
 *    - State CETs: Feb-March
 *    - GATE: August (for next year)
 *    - UPSC: Rarely changes
 *    - Banking/SSC: Check official sites
 *
 * 2. Update this file:
 *    - Increment currentSyllabusYear if syllabus changed
 *    - Update lastUpdated date
 *    - Add changes description
 *    - Update officialNotice URL
 *
 * 3. Run migration:
 *    - npx tsx scripts/migrate-add-syllabus-year.ts
 *
 * 4. Run annual update:
 *    - npx tsx scripts/annual-syllabus-update.ts
 *
 * 5. Verify:
 *    - Check quiz generator picks current syllabus first
 *    - Test a few quizzes
 *    - Monitor analytics
 */
