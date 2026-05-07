// Mock test configurations for each exam
// Defines how many questions per subject and total time

export interface MockTestConfig {
  examId: string;
  examName: string;
  totalQuestions: number;
  timeLimitMinutes: number;
  sections: {
    subjectId: string;
    subjectName: string;
    questionCount: number;
  }[];
}

export const mockTestConfigs: MockTestConfig[] = [
  {
    examId: "jee-main",
    examName: "JEE Main",
    totalQuestions: 30,
    timeLimitMinutes: 60,
    sections: [
      { subjectId: "jee-physics", subjectName: "Physics", questionCount: 10 },
      { subjectId: "jee-chemistry", subjectName: "Chemistry", questionCount: 10 },
      { subjectId: "jee-maths", subjectName: "Mathematics", questionCount: 10 },
    ],
  },
  {
    examId: "jee-advanced",
    examName: "JEE Advanced",
    totalQuestions: 30,
    timeLimitMinutes: 60,
    sections: [
      { subjectId: "jee-adv-physics", subjectName: "Physics", questionCount: 10 },
      { subjectId: "jee-adv-chemistry", subjectName: "Chemistry", questionCount: 10 },
      { subjectId: "jee-adv-maths", subjectName: "Mathematics", questionCount: 10 },
    ],
  },
  {
    examId: "neet-ug",
    examName: "NEET UG",
    totalQuestions: 30,
    timeLimitMinutes: 60,
    sections: [
      { subjectId: "neet-physics", subjectName: "Physics", questionCount: 10 },
      { subjectId: "neet-chemistry", subjectName: "Chemistry", questionCount: 10 },
      { subjectId: "neet-biology", subjectName: "Biology", questionCount: 10 },
    ],
  },
  {
    examId: "upsc-cse",
    examName: "UPSC CSE Prelims",
    totalQuestions: 25,
    timeLimitMinutes: 50,
    sections: [
      { subjectId: "upsc-polity", subjectName: "Polity", questionCount: 5 },
      { subjectId: "upsc-history", subjectName: "History", questionCount: 5 },
      { subjectId: "upsc-geography", subjectName: "Geography", questionCount: 5 },
      { subjectId: "upsc-economy", subjectName: "Economy", questionCount: 5 },
      { subjectId: "upsc-science", subjectName: "Science", questionCount: 5 },
    ],
  },
  {
    examId: "gate",
    examName: "GATE CS",
    totalQuestions: 20,
    timeLimitMinutes: 40,
    sections: [
      { subjectId: "gate-cs", subjectName: "Computer Science", questionCount: 14 },
      { subjectId: "gate-aptitude", subjectName: "General Aptitude", questionCount: 3 },
      { subjectId: "gate-engineering-math", subjectName: "Engineering Math", questionCount: 3 },
    ],
  },
  {
    examId: "ssc-cgl",
    examName: "SSC CGL",
    totalQuestions: 25,
    timeLimitMinutes: 40,
    sections: [
      { subjectId: "ssc-quant", subjectName: "Quantitative Aptitude", questionCount: 7 },
      { subjectId: "ssc-reasoning", subjectName: "Reasoning", questionCount: 6 },
      { subjectId: "ssc-english", subjectName: "English", questionCount: 6 },
      { subjectId: "ssc-gk", subjectName: "General Knowledge", questionCount: 6 },
    ],
  },
  {
    examId: "ibps-po",
    examName: "IBPS PO",
    totalQuestions: 25,
    timeLimitMinutes: 40,
    sections: [
      { subjectId: "ibps-quant", subjectName: "Quantitative Aptitude", questionCount: 6 },
      { subjectId: "ibps-reasoning", subjectName: "Reasoning", questionCount: 6 },
      { subjectId: "ibps-english", subjectName: "English", questionCount: 7 },
      { subjectId: "ibps-gk", subjectName: "General Awareness", questionCount: 6 },
    ],
  },
  {
    examId: "cat",
    examName: "CAT",
    totalQuestions: 20,
    timeLimitMinutes: 40,
    sections: [
      { subjectId: "cat-quant", subjectName: "Quantitative Aptitude", questionCount: 7 },
      { subjectId: "cat-varc", subjectName: "Verbal Ability & RC", questionCount: 7 },
      { subjectId: "cat-dilr", subjectName: "Data Interpretation & LR", questionCount: 6 },
    ],
  },
  {
    examId: "neet-pg",
    examName: "NEET PG",
    totalQuestions: 30,
    timeLimitMinutes: 60,
    sections: [
      { subjectId: "neet-pg-medicine", subjectName: "Medicine", questionCount: 10 },
      { subjectId: "neet-pg-surgery", subjectName: "Surgery", questionCount: 10 },
      { subjectId: "neet-pg-obs-gyn", subjectName: "Obs & Gynae", questionCount: 10 },
    ],
  },
  {
    examId: "ssc-chsl",
    examName: "SSC CHSL",
    totalQuestions: 25,
    timeLimitMinutes: 40,
    sections: [
      { subjectId: "ssc-quant", subjectName: "Quantitative Aptitude", questionCount: 7 },
      { subjectId: "ssc-reasoning", subjectName: "Reasoning", questionCount: 6 },
      { subjectId: "ssc-english", subjectName: "English", questionCount: 6 },
      { subjectId: "ssc-gk", subjectName: "General Knowledge", questionCount: 6 },
    ],
  },
  {
    examId: "sbi-po",
    examName: "SBI PO",
    totalQuestions: 25,
    timeLimitMinutes: 40,
    sections: [
      { subjectId: "sbi-quant", subjectName: "Quantitative Aptitude", questionCount: 6 },
      { subjectId: "sbi-reasoning", subjectName: "Reasoning", questionCount: 6 },
      { subjectId: "sbi-english", subjectName: "English", questionCount: 7 },
      { subjectId: "sbi-gk", subjectName: "General Awareness", questionCount: 6 },
    ],
  },
  {
    examId: "ibps-clerk",
    examName: "IBPS Clerk",
    totalQuestions: 25,
    timeLimitMinutes: 40,
    sections: [
      { subjectId: "ibps-quant", subjectName: "Quantitative Aptitude", questionCount: 7 },
      { subjectId: "ibps-reasoning", subjectName: "Reasoning", questionCount: 6 },
      { subjectId: "ibps-english", subjectName: "English", questionCount: 6 },
      { subjectId: "ibps-gk", subjectName: "General Awareness", questionCount: 6 },
    ],
  },
  {
    examId: "rbi-grade-b",
    examName: "RBI Grade B",
    totalQuestions: 25,
    timeLimitMinutes: 50,
    sections: [
      { subjectId: "rbi-quant", subjectName: "Quantitative Aptitude", questionCount: 6 },
      { subjectId: "rbi-reasoning", subjectName: "Reasoning", questionCount: 6 },
      { subjectId: "rbi-english", subjectName: "English", questionCount: 7 },
      { subjectId: "rbi-gk", subjectName: "General Awareness", questionCount: 6 },
    ],
  },
  {
    examId: "clat",
    examName: "CLAT",
    totalQuestions: 25,
    timeLimitMinutes: 50,
    sections: [
      { subjectId: "clat-english", subjectName: "English", questionCount: 6 },
      { subjectId: "clat-gk", subjectName: "Current Affairs & GK", questionCount: 6 },
      { subjectId: "clat-legal", subjectName: "Legal Reasoning", questionCount: 7 },
      { subjectId: "clat-logical", subjectName: "Logical Reasoning", questionCount: 6 },
    ],
  },
  {
    examId: "xat",
    examName: "XAT",
    totalQuestions: 20,
    timeLimitMinutes: 40,
    sections: [
      { subjectId: "xat-quant", subjectName: "Quantitative Aptitude", questionCount: 7 },
      { subjectId: "xat-verbal", subjectName: "Verbal Ability", questionCount: 7 },
      { subjectId: "xat-decision", subjectName: "Decision Making", questionCount: 6 },
    ],
  },
  {
    examId: "nda",
    examName: "NDA",
    totalQuestions: 25,
    timeLimitMinutes: 50,
    sections: [
      { subjectId: "nda-maths", subjectName: "Mathematics", questionCount: 13 },
      { subjectId: "nda-gat", subjectName: "General Ability Test", questionCount: 12 },
    ],
  },
  {
    examId: "cds",
    examName: "CDS",
    totalQuestions: 25,
    timeLimitMinutes: 50,
    sections: [
      { subjectId: "cds-english", subjectName: "English", questionCount: 9 },
      { subjectId: "cds-gk", subjectName: "General Knowledge", questionCount: 8 },
      { subjectId: "cds-maths", subjectName: "Elementary Mathematics", questionCount: 8 },
    ],
  },
  {
    examId: "ugc-net",
    examName: "UGC NET",
    totalQuestions: 25,
    timeLimitMinutes: 50,
    sections: [
      { subjectId: "ugc-teaching", subjectName: "Teaching Aptitude", questionCount: 8 },
      { subjectId: "ugc-reasoning", subjectName: "Reasoning", questionCount: 9 },
      { subjectId: "ugc-comprehension", subjectName: "Comprehension", questionCount: 8 },
    ],
  },
  {
    examId: "ctet",
    examName: "CTET",
    totalQuestions: 25,
    timeLimitMinutes: 45,
    sections: [
      { subjectId: "ctet-child-dev", subjectName: "Child Development", questionCount: 8 },
      { subjectId: "ctet-language-1", subjectName: "Language I", questionCount: 9 },
      { subjectId: "ctet-language-2", subjectName: "Language II", questionCount: 8 },
    ],
  },
  {
    examId: "rrb-ntpc",
    examName: "RRB NTPC",
    totalQuestions: 25,
    timeLimitMinutes: 40,
    sections: [
      { subjectId: "rrb-maths", subjectName: "Mathematics", questionCount: 8 },
      { subjectId: "rrb-reasoning", subjectName: "Reasoning", questionCount: 9 },
      { subjectId: "rrb-gk", subjectName: "General Awareness", questionCount: 8 },
    ],
  },
  {
    examId: "rrb-group-d",
    examName: "RRB Group D",
    totalQuestions: 25,
    timeLimitMinutes: 40,
    sections: [
      { subjectId: "rrb-maths", subjectName: "Mathematics", questionCount: 8 },
      { subjectId: "rrb-reasoning", subjectName: "Reasoning", questionCount: 9 },
      { subjectId: "rrb-gk", subjectName: "General Awareness", questionCount: 8 },
    ],
  },
  {
    examId: "uppsc",
    examName: "UPPSC",
    totalQuestions: 25,
    timeLimitMinutes: 50,
    sections: [
      { subjectId: "uppsc-history", subjectName: "History", questionCount: 6 },
      { subjectId: "uppsc-polity", subjectName: "Polity", questionCount: 6 },
      { subjectId: "uppsc-geography", subjectName: "Geography", questionCount: 7 },
      { subjectId: "uppsc-gk", subjectName: "General Knowledge", questionCount: 6 },
    ],
  },
  {
    examId: "mppsc",
    examName: "MPPSC",
    totalQuestions: 25,
    timeLimitMinutes: 50,
    sections: [
      { subjectId: "mppsc-history", subjectName: "History", questionCount: 6 },
      { subjectId: "mppsc-polity", subjectName: "Polity", questionCount: 6 },
      { subjectId: "mppsc-geography", subjectName: "Geography", questionCount: 7 },
      { subjectId: "mppsc-gk", subjectName: "General Knowledge", questionCount: 6 },
    ],
  },
  {
    examId: "delhi-police",
    examName: "Delhi Police",
    totalQuestions: 25,
    timeLimitMinutes: 40,
    sections: [
      { subjectId: "police-reasoning", subjectName: "Reasoning", questionCount: 9 },
      { subjectId: "police-gk", subjectName: "General Knowledge", questionCount: 8 },
      { subjectId: "police-numerical", subjectName: "Numerical Ability", questionCount: 8 },
    ],
  },
  {
    examId: "nift",
    examName: "NIFT",
    totalQuestions: 20,
    timeLimitMinutes: 40,
    sections: [
      { subjectId: "nift-gat", subjectName: "General Ability Test", questionCount: 10 },
      { subjectId: "nift-creative", subjectName: "Creative Ability Test", questionCount: 10 },
    ],
  },
  {
    examId: "ca-foundation",
    examName: "CA Foundation",
    totalQuestions: 25,
    timeLimitMinutes: 50,
    sections: [
      { subjectId: "ca-accounts", subjectName: "Accounting", questionCount: 9 },
      { subjectId: "ca-law", subjectName: "Business Laws", questionCount: 8 },
      { subjectId: "ca-maths", subjectName: "Business Mathematics", questionCount: 8 },
    ],
  },
  {
    examId: "ailet",
    examName: "AILET",
    totalQuestions: 25,
    timeLimitMinutes: 50,
    sections: [
      { subjectId: "ailet-english", subjectName: "English", questionCount: 6 },
      { subjectId: "ailet-gk", subjectName: "General Knowledge", questionCount: 6 },
      { subjectId: "ailet-legal", subjectName: "Legal Aptitude", questionCount: 7 },
      { subjectId: "ailet-reasoning", subjectName: "Reasoning", questionCount: 6 },
    ],
  },
  {
    examId: "cs-foundation",
    examName: "CS Foundation",
    totalQuestions: 25,
    timeLimitMinutes: 50,
    sections: [
      { subjectId: "cs-business-economics", subjectName: "Business Economics", questionCount: 9 },
      { subjectId: "cs-business-env", subjectName: "Business Environment", questionCount: 8 },
      { subjectId: "cs-fundamentals", subjectName: "Fundamentals of Accounting", questionCount: 8 },
    ],
  },
  {
    examId: "nid",
    examName: "NID DAT",
    totalQuestions: 20,
    timeLimitMinutes: 40,
    sections: [
      { subjectId: "nid-analytical", subjectName: "Analytical Ability", questionCount: 10 },
      { subjectId: "nid-gk", subjectName: "General Knowledge", questionCount: 10 },
    ],
  },
  {
    examId: "nata",
    examName: "NATA",
    totalQuestions: 20,
    timeLimitMinutes: 40,
    sections: [
      { subjectId: "nata-maths", subjectName: "Mathematics", questionCount: 10 },
      { subjectId: "nata-aptitude", subjectName: "General Aptitude", questionCount: 10 },
    ],
  },
  {
    examId: "nchmct",
    examName: "NCHMCT JEE",
    totalQuestions: 25,
    timeLimitMinutes: 40,
    sections: [
      { subjectId: "nchmct-numerical", subjectName: "Numerical Ability", questionCount: 7 },
      { subjectId: "nchmct-reasoning", subjectName: "Reasoning", questionCount: 6 },
      { subjectId: "nchmct-gk", subjectName: "General Knowledge", questionCount: 6 },
      { subjectId: "nchmct-english", subjectName: "English", questionCount: 6 },
    ],
  },
  {
    examId: "htet",
    examName: "HTET",
    totalQuestions: 25,
    timeLimitMinutes: 40,
    sections: [
      { subjectId: "htet-cdp", subjectName: "Child Development", questionCount: 9 },
      { subjectId: "htet-english", subjectName: "English", questionCount: 8 },
      { subjectId: "htet-hindi", subjectName: "Hindi", questionCount: 8 },
    ],
  },
  {
    examId: "uptet",
    examName: "UPTET",
    totalQuestions: 25,
    timeLimitMinutes: 40,
    sections: [
      { subjectId: "uptet-cdp", subjectName: "Child Development", questionCount: 8 },
      { subjectId: "uptet-english", subjectName: "English", questionCount: 9 },
      { subjectId: "uptet-hindi", subjectName: "Hindi", questionCount: 8 },
    ],
  },
  {
    examId: "rtet",
    examName: "RTET",
    totalQuestions: 25,
    timeLimitMinutes: 40,
    sections: [
      { subjectId: "rtet-cdp", subjectName: "Child Development", questionCount: 9 },
      { subjectId: "rtet-maths", subjectName: "Mathematics", questionCount: 8 },
      { subjectId: "rtet-science", subjectName: "Science", questionCount: 8 },
    ],
  },
  {
    examId: "kvs",
    examName: "KVS",
    totalQuestions: 25,
    timeLimitMinutes: 45,
    sections: [
      { subjectId: "kvs-gs", subjectName: "General Studies", questionCount: 9 },
      { subjectId: "kvs-reasoning", subjectName: "Reasoning", questionCount: 8 },
      { subjectId: "kvs-subject", subjectName: "Subject Knowledge", questionCount: 8 },
    ],
  },
  {
    examId: "dsssb",
    examName: "DSSSB",
    totalQuestions: 25,
    timeLimitMinutes: 40,
    sections: [
      { subjectId: "dsssb-gs", subjectName: "General Studies", questionCount: 7 },
      { subjectId: "dsssb-reasoning", subjectName: "Reasoning", questionCount: 6 },
      { subjectId: "dsssb-english", subjectName: "English", questionCount: 6 },
      { subjectId: "dsssb-arithmetic", subjectName: "Arithmetic", questionCount: 6 },
    ],
  },
  {
    examId: "up-police",
    examName: "UP Police",
    totalQuestions: 25,
    timeLimitMinutes: 40,
    sections: [
      { subjectId: "up-gk", subjectName: "General Knowledge", questionCount: 9 },
      { subjectId: "up-reasoning", subjectName: "Reasoning", questionCount: 8 },
      { subjectId: "up-numerical", subjectName: "Numerical Ability", questionCount: 8 },
    ],
  },
  {
    examId: "cisf",
    examName: "CISF",
    totalQuestions: 25,
    timeLimitMinutes: 40,
    sections: [
      { subjectId: "cisf-gk", subjectName: "General Knowledge", questionCount: 9 },
      { subjectId: "cisf-reasoning", subjectName: "Reasoning", questionCount: 8 },
      { subjectId: "cisf-numerical", subjectName: "Numerical Ability", questionCount: 8 },
    ],
  },
  {
    examId: "bpsc",
    examName: "BPSC",
    totalQuestions: 25,
    timeLimitMinutes: 50,
    sections: [
      { subjectId: "bpsc-gs", subjectName: "General Studies", questionCount: 13 },
      { subjectId: "bpsc-aptitude", subjectName: "Mental Ability", questionCount: 12 },
    ],
  },
  {
    examId: "rpsc",
    examName: "RPSC",
    totalQuestions: 25,
    timeLimitMinutes: 50,
    sections: [
      { subjectId: "rpsc-gs", subjectName: "General Studies", questionCount: 13 },
      { subjectId: "rpsc-aptitude", subjectName: "Aptitude", questionCount: 12 },
    ],
  },
  {
    examId: "lic-aao",
    examName: "LIC AAO",
    totalQuestions: 25,
    timeLimitMinutes: 40,
    sections: [
      { subjectId: "lic-quant", subjectName: "Quantitative Aptitude", questionCount: 6 },
      { subjectId: "lic-reasoning", subjectName: "Reasoning", questionCount: 6 },
      { subjectId: "lic-english", subjectName: "English", questionCount: 7 },
      { subjectId: "lic-ga", subjectName: "General Awareness", questionCount: 6 },
    ],
  },
  {
    examId: "afcat",
    examName: "AFCAT",
    totalQuestions: 25,
    timeLimitMinutes: 50,
    sections: [
      { subjectId: "afcat-gk", subjectName: "General Knowledge", questionCount: 7 },
      { subjectId: "afcat-verbal", subjectName: "Verbal Ability", questionCount: 6 },
      { subjectId: "afcat-numerical", subjectName: "Numerical Ability", questionCount: 6 },
      { subjectId: "afcat-reasoning", subjectName: "Reasoning", questionCount: 6 },
    ],
  },
  {
    examId: "indian-navy",
    examName: "Indian Navy",
    totalQuestions: 25,
    timeLimitMinutes: 50,
    sections: [
      { subjectId: "navy-maths", subjectName: "Mathematics", questionCount: 9 },
      { subjectId: "navy-physics", subjectName: "Physics", questionCount: 8 },
      { subjectId: "navy-gk", subjectName: "General Knowledge", questionCount: 8 },
    ],
  },
  {
    examId: "rrb-alp",
    examName: "RRB ALP",
    totalQuestions: 25,
    timeLimitMinutes: 40,
    sections: [
      { subjectId: "rrb-alp-maths", subjectName: "Mathematics", questionCount: 7 },
      { subjectId: "rrb-alp-reasoning", subjectName: "Reasoning", questionCount: 6 },
      { subjectId: "rrb-alp-ga", subjectName: "General Awareness", questionCount: 6 },
      { subjectId: "rrb-alp-science", subjectName: "General Science", questionCount: 6 },
    ],
  },
  {
    examId: "rrb-je",
    examName: "RRB JE",
    totalQuestions: 25,
    timeLimitMinutes: 45,
    sections: [
      { subjectId: "rrb-je-maths", subjectName: "Mathematics", questionCount: 9 },
      { subjectId: "rrb-je-reasoning", subjectName: "Reasoning", questionCount: 8 },
      { subjectId: "rrb-je-technical", subjectName: "Technical", questionCount: 8 },
    ],
  },
  {
    examId: "postal-assistant",
    examName: "Postal Assistant",
    totalQuestions: 25,
    timeLimitMinutes: 40,
    sections: [
      { subjectId: "pa-reasoning", subjectName: "Reasoning", questionCount: 7 },
      { subjectId: "pa-gk", subjectName: "General Knowledge", questionCount: 6 },
      { subjectId: "pa-quant", subjectName: "Quantitative Aptitude", questionCount: 6 },
      { subjectId: "pa-english", subjectName: "English", questionCount: 6 },
    ],
  },
  {
    examId: "gds",
    examName: "GDS",
    totalQuestions: 25,
    timeLimitMinutes: 40,
    sections: [
      { subjectId: "gds-maths", subjectName: "Mathematics", questionCount: 9 },
      { subjectId: "gds-reasoning", subjectName: "Reasoning", questionCount: 8 },
      { subjectId: "gds-gk", subjectName: "General Knowledge", questionCount: 8 },
    ],
  },
  {
    examId: "tnpsc",
    examName: "TNPSC",
    totalQuestions: 25,
    timeLimitMinutes: 50,
    sections: [
      { subjectId: "tnpsc-gs", subjectName: "General Studies", questionCount: 13 },
      { subjectId: "tnpsc-aptitude", subjectName: "Aptitude", questionCount: 12 },
    ],
  },
  {
    examId: "kpsc",
    examName: "KPSC",
    totalQuestions: 25,
    timeLimitMinutes: 50,
    sections: [
      { subjectId: "kpsc-gs", subjectName: "General Studies", questionCount: 13 },
      { subjectId: "kpsc-aptitude", subjectName: "Aptitude", questionCount: 12 },
    ],
  },
  {
    examId: "wbpsc",
    examName: "WBPSC",
    totalQuestions: 25,
    timeLimitMinutes: 50,
    sections: [
      { subjectId: "wbpsc-gs", subjectName: "General Studies", questionCount: 25 },
    ],
  },
  {
    examId: "ifs",
    examName: "IFS (Indian Forest Service)",
    totalQuestions: 25,
    timeLimitMinutes: 50,
    sections: [
      { subjectId: "ifs-gs", subjectName: "General Studies", questionCount: 13 },
      { subjectId: "ifs-csat", subjectName: "CSAT", questionCount: 12 },
    ],
  },
  {
    examId: "judicial-services",
    examName: "Judicial Services",
    totalQuestions: 25,
    timeLimitMinutes: 50,
    sections: [
      { subjectId: "jud-law", subjectName: "Law", questionCount: 15 },
      { subjectId: "jud-gk", subjectName: "General Knowledge", questionCount: 10 },
    ],
  },
  {
    examId: "iimc",
    examName: "IIMC",
    totalQuestions: 20,
    timeLimitMinutes: 40,
    sections: [
      { subjectId: "iimc-ga", subjectName: "General Awareness", questionCount: 10 },
      { subjectId: "iimc-english", subjectName: "English", questionCount: 10 },
    ],
  },
  {
    examId: "aiims-nursing",
    examName: "AIIMS Nursing",
    totalQuestions: 25,
    timeLimitMinutes: 45,
    sections: [
      { subjectId: "nursing-subject", subjectName: "Nursing", questionCount: 15 },
      { subjectId: "nursing-gk", subjectName: "General Knowledge", questionCount: 10 },
    ],
  },
  {
    examId: "gpat",
    examName: "GPAT",
    totalQuestions: 25,
    timeLimitMinutes: 50,
    sections: [
      { subjectId: "gpat-pharma", subjectName: "Pharmaceutics", questionCount: 9 },
      { subjectId: "gpat-pharmaco", subjectName: "Pharmacology", questionCount: 8 },
      { subjectId: "gpat-chem", subjectName: "Pharmaceutical Chemistry", questionCount: 8 },
    ],
  },
  {
    examId: "icar-aieea",
    examName: "ICAR AIEEA",
    totalQuestions: 25,
    timeLimitMinutes: 50,
    sections: [
      { subjectId: "icar-physics", subjectName: "Physics", questionCount: 9 },
      { subjectId: "icar-chemistry", subjectName: "Chemistry", questionCount: 8 },
      { subjectId: "icar-biology", subjectName: "Biology", questionCount: 8 },
    ],
  },
  {
    examId: "isi",
    examName: "ISI Admission Test",
    totalQuestions: 20,
    timeLimitMinutes: 50,
    sections: [
      { subjectId: "isi-maths", subjectName: "Mathematics", questionCount: 10 },
      { subjectId: "isi-stats", subjectName: "Statistics", questionCount: 10 },
    ],
  },
];

export function getMockTestConfig(examId: string): MockTestConfig | undefined {
  return mockTestConfigs.find((c) => c.examId === examId);
}

export function getAllMockTestConfigs(): MockTestConfig[] {
  return mockTestConfigs;
}
