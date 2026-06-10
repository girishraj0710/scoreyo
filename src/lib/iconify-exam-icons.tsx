/**
 * Iconify Icon System for Krakkify Exams
 *
 * Uses 200,000+ free open-source icons from Iconify
 * No downloads needed - icons loaded on-demand via CDN
 * Zero licensing issues - all MIT/Apache/CC BY licensed
 */

import { Icon } from '@iconify/react';

// Category Icon Mappings - For exam categories (Engineering, Medical, etc.)
export const CATEGORY_ICONIFY_ICONS: Record<string, string> = {
  'engineering': 'material-symbols:engineering',
  'medical': 'healthicons:stethoscope',
  'government': 'ri:government-fill',
  'banking': 'mdi:bank',
  'management': 'carbon:chart-line-smooth',
  'law': 'mdi:gavel',
  'teaching': 'mdi:teach',
  'defense': 'mdi:shield-star',
  'state': 'mdi:map-marker',
  'commerce': 'mdi:calculator-variant',
  'hotel': 'mdi:chef-hat',
  'design': 'carbon:pen',
  'agriculture': 'mdi:leaf',
  'pharmacy': 'healthicons:medicines',
  'cuet': 'fluent:hat-graduation-20-filled',
};

// Subject Icon Mappings - For subjects (Physics, Chemistry, Math, etc.)
export const SUBJECT_ICONIFY_ICONS: Record<string, string> = {
  // Science subjects
  'physics': 'mdi:atom',
  'chemistry': 'mdi:flask-outline',
  'maths': 'mdi:calculator',
  'mathematics': 'mdi:calculator',
  'biology': 'healthicons:dna',
  // Computer & Tech
  'computer': 'mdi:laptop',
  'cs': 'mdi:code-tags',
  'it': 'carbon:chip',
  // Reasoning & Aptitude
  'reasoning': 'carbon:cognitive',
  'aptitude': 'mdi:brain',
  'logical': 'carbon:chart-relationship',
  'quantitative': 'carbon:calculator',
  // Language & Communication
  'english': 'mdi:book-alphabet',
  'hindi': 'mdi:book-open-variant',
  'verbal': 'carbon:text-creation',
  // Social Sciences
  'history': 'mdi:book-clock',
  'geography': 'mdi:earth',
  'polity': 'ri:government-line',
  'economics': 'carbon:analytics',
  'gk': 'mdi:lightbulb-on',
  'current-affairs': 'mdi:newspaper',
  // Others
  'environment': 'mdi:leaf',
  'science': 'mdi:microscope',
  'arts': 'mdi:palette',
};

// Exam Icon Mappings - Professional illustrated icons from various Iconify collections
export const EXAM_ICONIFY_ICONS: Record<string, string> = {
  // ─── ENGINEERING ───────────────────────────────────────
  'jee-main': 'fluent:hat-graduation-20-filled', // Graduation with gear
  'jee-advanced': 'material-symbols:engineering', // Engineering symbol
  'gate': 'mdi:cog-outline', // Gear/mechanism
  'bitsat': 'mdi:chip', // Computer chip for tech
  'viteee': 'carbon:chip', // Another chip variant
  'srmjeee': 'mdi:school', // School building
  'comedk': 'material-symbols:engineering-outline', // Engineering outline
  'iit-jam': 'mdi:flask-outline', // Lab flask
  'iiit': 'mdi:school-outline', // Institution building
  'manipal': 'carbon:education', // Education symbol

  // ─── MEDICAL ───────────────────────────────────────
  'neet-ug': 'healthicons:stethoscope', // Medical stethoscope
  'neet-pg': 'medical-icon:i-doctor', // Doctor icon
  'aiims': 'healthicons:health-worker', // Healthcare worker
  'jipmer': 'healthicons:i-training-class', // Medical training
  'neet-ss': 'medical-icon:i-surgery', // Surgery/specialist
  'mbbs': 'healthicons:doctor', // Doctor symbol
  'bds': 'healthicons:tooth', // Dental
  'pharma': 'healthicons:medicines', // Pharmacy
  'nursing': 'healthicons:nurse', // Nursing
  'veterinary': 'mdi:paw', // Veterinary

  // ─── GOVERNMENT & CIVIL SERVICES ───────────────────────────────────────
  'upsc': 'ri:government-fill', // Government building
  'ssc-cgl': 'mdi:account-tie', // Officer/professional
  'ssc-chsl': 'carbon:user-certification', // Certified professional
  'ssc-mts': 'mdi:briefcase-account', // Office worker
  'railway-rrb': 'mdi:train', // Train/railway
  'railway-ntpc': 'mdi:train-variant', // Train variant
  'railway-group-d': 'carbon:railway', // Railway symbol
  'nda': 'mdi:shield-star', // Defense/military
  'cds': 'mdi:shield-sword', // Defense services
  'capf': 'mdi:shield-account', // Police/security
  'ips': 'material-symbols:shield-person', // Police officer
  'ifs': 'mdi:tree', // Forest service
  'irs': 'mdi:finance', // Revenue service
  'ias': 'mingcute:government-fill', // Administrative service

  // ─── BANKING & FINANCE ───────────────────────────────────────
  'ibps-po': 'mdi:bank', // Bank building
  'ibps-clerk': 'carbon:account', // Bank clerk
  'sbi-po': 'mdi:bank-outline', // SBI bank
  'sbi-clerk': 'carbon:user-profile', // Clerk profile
  'rbi-grade-b': 'mdi:currency-inr', // Reserve bank
  'nabard': 'mdi:bank-transfer', // Agricultural banking
  'sebi': 'mdi:finance', // Securities
  'lic-aao': 'mdi:shield-check', // Insurance
  'lic-ado': 'carbon:document-protected', // Insurance document
  'niacl': 'mdi:file-document-check', // Insurance file

  // ─── MBA & MANAGEMENT ───────────────────────────────────────
  'cat': 'carbon:chart-line-smooth', // Analytics/strategy
  'xat': 'carbon:presenter', // Executive presenter
  'snap': 'mdi:briefcase-outline', // Professional briefcase
  'cmat': 'carbon:analytics', // Management analytics
  'mat': 'mdi:briefcase-variant', // Management case
  'nmat': 'carbon:graph', // Business graph
  'iift': 'mdi:earth', // International trade
  'gmat': 'mdi:airplane-takeoff', // Global MBA
  'atma': 'carbon:education', // Academic management
  'tiss-net': 'mdi:account-group', // Social sciences

  // ─── LAW & JUDICIARY ───────────────────────────────────────
  'clat': 'mdi:gavel', // Judge gavel
  'ailet': 'carbon:law', // Law symbol
  'slat': 'mdi:scale-balance', // Justice scales
  'lsat': 'mdi:book-open-variant', // Law books
  'judiciary': 'material-symbols:balance', // Balance/justice
  'judicial-services': 'mdi:gavel', // Judicial gavel
  'clat-pg': 'carbon:certificate', // Law certificate
  'aibe': 'mdi:briefcase-account-outline', // Advocate briefcase

  // ─── TEACHING & EDUCATION ───────────────────────────────────────
  'ctet': 'mdi:teach', // Teaching symbol
  'tet': 'carbon:education', // Teacher education
  'kvs': 'mdi:school', // School teaching
  'dsssb': 'mdi:account-school', // School staff
  'ugc-net': 'fluent:hat-graduation-16-filled', // Professor/UGC
  'csir-net': 'mdi:flask', // Science research
  'set': 'mdi:certificate-outline', // Teaching certificate
  'reet': 'carbon:classroom', // Classroom teaching
  'super-tet': 'mdi:account-star', // Super teacher

  // ─── STATE EXAMS ───────────────────────────────────────
  'tnpsc': 'mdi:map-marker', // Tamil Nadu
  'mppsc': 'mdi:map-marker-outline', // Madhya Pradesh
  'uppsc': 'mdi:city-variant', // Uttar Pradesh
  'bpsc': 'mdi:city-variant-outline', // Bihar
  'rpsc': 'mdi:account-tie-outline', // Rajasthan
  'gpsc': 'mdi:account-tie-voice', // Gujarat
  'kpsc': 'mdi:briefcase-outline', // Karnataka
  'appsc': 'mdi:briefcase', // Andhra Pradesh
  'wbpsc': 'mdi:domain', // West Bengal

  // ─── COMMERCE & ACCOUNTS ───────────────────────────────────────
  'ca-foundation': 'mdi:calculator-variant', // Accounting calculator
  'ca-intermediate': 'carbon:finance', // Finance symbol
  'ca-final': 'mdi:certificate', // CA certificate
  'cs-executive': 'carbon:certificate-check', // Company secretary
  'cs-professional': 'mdi:briefcase-check', // CS professional
  'cma-foundation': 'mdi:chart-line', // Cost accounting
  'cma-intermediate': 'carbon:report', // Management accounting
  'cma-final': 'mdi:file-certificate', // CMA certificate
  'cfa': 'mdi:chart-bell-curve', // Financial analyst

  // ─── HOTEL MANAGEMENT ───────────────────────────────────────
  'nchmct': 'mdi:chef-hat', // Hotel management
  'nchm-jee': 'carbon:restaurant', // Hospitality
  'aihm': 'mdi:home-city', // Hotel industry

  // ─── DESIGN & ARCHITECTURE ───────────────────────────────────────
  'nata': 'carbon:tools-alt', // Architecture tools
  'ceed': 'carbon:pen', // Design pen
  'uceed': 'mdi:palette', // Design palette
  'nid': 'carbon:chart-3d', // Industrial design
  'nift': 'mdi:hanger', // Fashion design

  // ─── AGRICULTURE ───────────────────────────────────────
  'icar-aieea': 'mdi:leaf', // Agriculture leaf
  'agriculture': 'carbon:agriculture', // Farming symbol
  'veterinary-science': 'mdi:paw', // Animal science
  'forestry': 'mdi:pine-tree', // Forestry

  // ─── PHARMACY ───────────────────────────────────────
  'gpat': 'healthicons:medicines', // Pharmacy medicines
  'pharmacy-entrance': 'mdi:pill', // Pharmaceutical pill
  'd-pharma': 'healthicons:pharmacy', // Pharmacy symbol
  'b-pharma': 'mdi:flask-outline', // Pharma flask

  // ─── DEFENSE & POLICE ───────────────────────────────────────
  'afcat': 'mdi:airplane-takeoff', // Air force
  'navy-ssr': 'mdi:ferry', // Navy ship
  'army-tgc': 'mdi:shield', // Army shield
  'capf-ac': 'mdi:security', // Police security
  'state-police': 'mdi:shield-check-outline', // State police
  'police-sub-inspector': 'material-symbols:shield-person-outline', // Police officer
  'police-constable': 'mdi:shield-account-outline', // Police constable

  // ─── CUET & UNIVERSITY ENTRANCE ───────────────────────────────────────
  'cuet-ug': 'fluent:hat-graduation-20-regular', // Undergrad
  'cuet-pg': 'fluent:hat-graduation-20-filled', // Postgrad
  'du-entrance': 'mdi:university', // Delhi University
  'bhu-entrance': 'mdi:school-outline', // BHU
  'ipmat': 'carbon:education', // IPM
  'jnu-entrance': 'mdi:library', // JNU library
};

// Get Iconify icon for category
export const getCategoryIconifyIcon = (categoryId: string): string => {
  return CATEGORY_ICONIFY_ICONS[categoryId] || 'mdi:folder'; // Default: folder
};

// Get Iconify icon for subject (tries to match by subject name/ID)
export const getSubjectIconifyIcon = (subjectIdOrName: string): string => {
  const key = subjectIdOrName.toLowerCase().replace(/[_\s-]/g, '');

  // Try direct match first
  if (SUBJECT_ICONIFY_ICONS[key]) {
    return SUBJECT_ICONIFY_ICONS[key];
  }

  // Try partial match
  for (const [subjectKey, icon] of Object.entries(SUBJECT_ICONIFY_ICONS)) {
    if (key.includes(subjectKey) || subjectKey.includes(key)) {
      return icon;
    }
  }

  return 'mdi:book-open-variant'; // Default: open book
};

// Get Iconify icon component for an exam
export const getExamIconifyIcon = (examId: string): string => {
  return EXAM_ICONIFY_ICONS[examId] || 'mdi:book-open-variant'; // Default: open book
};

// Icon Component Wrappers for easy use
interface IconifyProps {
  size?: number | string;
  className?: string;
  color?: string;
}

interface ExamIconifyProps extends IconifyProps {
  examId: string;
}

interface CategoryIconifyProps extends IconifyProps {
  categoryId: string;
}

interface SubjectIconifyProps extends IconifyProps {
  subjectId: string;
}

export const ExamIconify: React.FC<ExamIconifyProps> = ({
  examId,
  size = 24,
  className = '',
  color
}) => {
  const iconName = getExamIconifyIcon(examId);

  return (
    <Icon
      icon={iconName}
      width={size}
      height={size}
      className={className}
      style={color ? { color } : undefined}
    />
  );
};

export const CategoryIconify: React.FC<CategoryIconifyProps> = ({
  categoryId,
  size = 24,
  className = '',
  color
}) => {
  const iconName = getCategoryIconifyIcon(categoryId);

  return (
    <Icon
      icon={iconName}
      width={size}
      height={size}
      className={className}
      style={color ? { color } : undefined}
    />
  );
};

export const SubjectIconify: React.FC<SubjectIconifyProps> = ({
  subjectId,
  size = 24,
  className = '',
  color
}) => {
  const iconName = getSubjectIconifyIcon(subjectId);

  return (
    <Icon
      icon={iconName}
      width={size}
      height={size}
      className={className}
      style={color ? { color } : undefined}
    />
  );
};

// Batch load icons for performance (optional)
export const preloadExamIcons = async (examIds: string[]) => {
  const iconNames = examIds.map(id => getExamIconifyIcon(id));
  // Iconify automatically caches icons, so just rendering them preloads
  return iconNames;
};
