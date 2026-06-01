/**
 * Exam Calendar Data - 2026 Upcoming Exams
 * Source: Official exam conducting authority websites
 */

export interface ExamCalendarEvent {
  id: string;
  examId: string;
  examName: string;
  examFullName: string;
  phase?: string; // e.g., "Session 1", "Tier 1", "Prelims"
  date: string; // Format: "22nd Jan 2026" or "June 2026"
  month: string; // For sorting
  registrationStart?: string;
  registrationEnd?: string;
  admitCardDate?: string;
  resultDate?: string;
  officialWebsite: string;
  notificationUrl?: string;
  category: 'engineering' | 'medical' | 'government' | 'banking' | 'management' | 'law' | 'defense' | 'teaching' | 'railway';
}

export const upcomingExams: ExamCalendarEvent[] = [
  // January 2026
  {
    id: 'jee-main-jan-2026',
    examId: 'jee-main',
    examName: 'JEE Main',
    examFullName: 'Joint Entrance Examination Main',
    phase: 'Session 1',
    date: '22nd - 31st Jan 2026',
    month: '2026-01',
    registrationStart: 'November 2025',
    registrationEnd: 'December 2025',
    admitCardDate: 'January 2026',
    resultDate: 'February 2026',
    officialWebsite: 'https://jeemain.nta.nic.in',
    notificationUrl: 'https://jeemain.nta.nic.in',
    category: 'engineering',
  },
  {
    id: 'gate-2026',
    examId: 'gate',
    examName: 'GATE',
    examFullName: 'Graduate Aptitude Test in Engineering',
    date: '1st - 16th Feb 2026',
    month: '2026-02',
    registrationStart: 'August 2025',
    registrationEnd: 'September 2025',
    admitCardDate: 'January 2026',
    resultDate: 'March 2026',
    officialWebsite: 'https://gate.iitd.ac.in',
    notificationUrl: 'https://gate.iitd.ac.in',
    category: 'engineering',
  },

  // February 2026
  {
    id: 'cat-2026',
    examId: 'cat',
    examName: 'CAT',
    examFullName: 'Common Admission Test',
    date: '27th Nov 2026',
    month: '2026-11',
    registrationStart: 'August 2026',
    registrationEnd: 'September 2026',
    admitCardDate: 'November 2026',
    resultDate: 'January 2027',
    officialWebsite: 'https://iimcat.ac.in',
    notificationUrl: 'https://iimcat.ac.in',
    category: 'management',
  },

  // March-April 2026
  {
    id: 'jee-advanced-2026',
    examId: 'jee-advanced',
    examName: 'JEE Advanced',
    examFullName: 'Joint Entrance Examination Advanced',
    date: '24th May 2026',
    month: '2026-05',
    registrationStart: 'May 2026',
    registrationEnd: 'May 2026',
    admitCardDate: 'May 2026',
    resultDate: 'June 2026',
    officialWebsite: 'https://jeeadv.ac.in',
    notificationUrl: 'https://jeeadv.ac.in',
    category: 'engineering',
  },
  {
    id: 'neet-ug-2026',
    examId: 'neet-ug',
    examName: 'NEET UG',
    examFullName: 'National Eligibility cum Entrance Test',
    phase: 'Medical Entrance',
    date: '3rd May 2026',
    month: '2026-05',
    registrationStart: 'February 2026',
    registrationEnd: 'March 2026',
    admitCardDate: 'April 2026',
    resultDate: 'June 2026',
    officialWebsite: 'https://neet.nta.nic.in',
    notificationUrl: 'https://neet.nta.nic.in',
    category: 'medical',
  },

  // May 2026
  {
    id: 'upsc-cse-prelims-2026',
    examId: 'upsc-cse',
    examName: 'UPSC CSE',
    examFullName: 'Union Public Service Commission Civil Services Examination',
    phase: 'Prelims',
    date: '31st May 2026',
    month: '2026-05',
    registrationStart: 'February 2026',
    registrationEnd: 'March 2026',
    admitCardDate: 'May 2026',
    resultDate: 'July 2026',
    officialWebsite: 'https://upsc.gov.in',
    notificationUrl: 'https://upsc.gov.in/examinations/recruitment',
    category: 'government',
  },
  {
    id: 'clat-2026',
    examId: 'clat',
    examName: 'CLAT',
    examFullName: 'Common Law Admission Test',
    date: '12th May 2026',
    month: '2026-05',
    registrationStart: 'January 2026',
    registrationEnd: 'April 2026',
    admitCardDate: 'May 2026',
    resultDate: 'May 2026',
    officialWebsite: 'https://consortiumofnlus.ac.in',
    notificationUrl: 'https://consortiumofnlus.ac.in',
    category: 'law',
  },

  // June 2026
  {
    id: 'ssc-cgl-tier1-2026',
    examId: 'ssc-cgl',
    examName: 'SSC CGL',
    examFullName: 'Staff Selection Commission Combined Graduate Level',
    phase: 'Tier 1',
    date: 'June - July 2026',
    month: '2026-06',
    registrationStart: 'April 2026',
    registrationEnd: 'May 2026',
    admitCardDate: 'June 2026',
    resultDate: 'August 2026',
    officialWebsite: 'https://ssc.nic.in',
    notificationUrl: 'https://ssc.nic.in',
    category: 'government',
  },
  {
    id: 'ctet-june-2026',
    examId: 'ctet',
    examName: 'CTET',
    examFullName: 'Central Teacher Eligibility Test',
    date: 'June 2026',
    month: '2026-06',
    registrationStart: 'April 2026',
    registrationEnd: 'May 2026',
    admitCardDate: 'June 2026',
    resultDate: 'August 2026',
    officialWebsite: 'https://ctet.nic.in',
    notificationUrl: 'https://ctet.nic.in',
    category: 'teaching',
  },

  // July 2026
  {
    id: 'nda-2026-1',
    examId: 'nda',
    examName: 'NDA',
    examFullName: 'National Defence Academy',
    phase: 'Exam I',
    date: '18th April 2026',
    month: '2026-04',
    registrationStart: 'January 2026',
    registrationEnd: 'February 2026',
    admitCardDate: 'April 2026',
    resultDate: 'May 2026',
    officialWebsite: 'https://upsc.gov.in',
    notificationUrl: 'https://upsc.gov.in/examinations/recruitment',
    category: 'defense',
  },
  {
    id: 'ibps-po-prelims-2026',
    examId: 'ibps-po',
    examName: 'IBPS PO',
    examFullName: 'Institute of Banking Personnel Selection Probationary Officer',
    phase: 'Prelims',
    date: 'October 2026',
    month: '2026-10',
    registrationStart: 'August 2026',
    registrationEnd: 'September 2026',
    admitCardDate: 'September 2026',
    resultDate: 'October 2026',
    officialWebsite: 'https://ibps.in',
    notificationUrl: 'https://ibps.in',
    category: 'banking',
  },

  // August 2026
  {
    id: 'rrb-ntpc-2026',
    examId: 'rrb-ntpc',
    examName: 'RRB NTPC',
    examFullName: 'Railway Recruitment Board Non-Technical Popular Categories',
    date: 'To be announced',
    month: '2026-08',
    registrationStart: 'To be announced',
    registrationEnd: 'To be announced',
    officialWebsite: 'https://rrbcdg.gov.in',
    notificationUrl: 'https://rrbcdg.gov.in',
    category: 'railway',
  },

  // September 2026
  {
    id: 'sbi-po-prelims-2026',
    examId: 'sbi-po',
    examName: 'SBI PO',
    examFullName: 'State Bank of India Probationary Officer',
    phase: 'Prelims',
    date: 'December 2026',
    month: '2026-12',
    registrationStart: 'October 2026',
    registrationEnd: 'November 2026',
    admitCardDate: 'December 2026',
    resultDate: 'January 2027',
    officialWebsite: 'https://sbi.co.in/careers',
    notificationUrl: 'https://sbi.co.in/careers',
    category: 'banking',
  },

  // Additional prominent exams
  {
    id: 'neet-pg-2026',
    examId: 'neet-pg',
    examName: 'NEET PG',
    examFullName: 'National Eligibility cum Entrance Test Postgraduate',
    date: 'August 2026',
    month: '2026-08',
    registrationStart: 'June 2026',
    registrationEnd: 'July 2026',
    admitCardDate: 'July 2026',
    resultDate: 'September 2026',
    officialWebsite: 'https://nbe.edu.in',
    notificationUrl: 'https://nbe.edu.in',
    category: 'medical',
  },
  {
    id: 'ugc-net-june-2026',
    examId: 'ugc-net',
    examName: 'UGC NET',
    examFullName: 'University Grants Commission National Eligibility Test',
    date: 'June 2026',
    month: '2026-06',
    registrationStart: 'March 2026',
    registrationEnd: 'April 2026',
    admitCardDate: 'May 2026',
    resultDate: 'July 2026',
    officialWebsite: 'https://ugcnet.nta.nic.in',
    notificationUrl: 'https://ugcnet.nta.nic.in',
    category: 'teaching',
  },
];

// Get next 6 upcoming exams sorted by date
export const getUpcomingExams = (limit = 6): ExamCalendarEvent[] => {
  const now = new Date();
  const currentMonth = now.toISOString().slice(0, 7); // "2026-01"

  return upcomingExams
    .filter(exam => exam.month >= currentMonth)
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(0, limit);
};

// Get exams by category
export const getExamsByCategory = (category: string): ExamCalendarEvent[] => {
  return upcomingExams.filter(exam => exam.category === category);
};
