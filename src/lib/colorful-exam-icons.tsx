/**
 * COLORFUL Exam Icons using Noto Emoji Collection
 *
 * Each exam has a unique, contextually-appropriate, colorful icon
 * All icons from Google's Noto Emoji - professional quality
 */

import { Icon } from '@iconify/react';

// Colorful Category Icons - Using Noto Emoji
export const COLORFUL_CATEGORY_ICONS: Record<string, string> = {
  'engineering': 'noto:gear',                    // Orange gear
  'medical': 'noto:stethoscope',                 // Red stethoscope
  'government': 'noto:classical-building',       // Classical building
  'civil-services': 'noto:classical-building',   // Government
  'banking-ssc': 'noto:bank',                    // Bank building
  'banking': 'noto:bank',                        // Bank
  'management': 'noto:briefcase',                // Briefcase
  'mba': 'noto:briefcase',                       // MBA
  'law': 'noto:balance-scale',                   // Scales
  'teaching': 'noto:teacher-light-skin-tone',    // Teacher
  'more-teaching': 'noto:woman-teacher-light-skin-tone', // More teaching
  'defence': 'noto:shield',                      // Defence (UK spelling)
  'defense': 'noto:shield',                      // Defense
  'more-defense': 'noto:military-helmet',        // More defense
  'state': 'noto:round-pushpin',                 // Location
  'state-psc': 'noto:office-building',           // State PSC
  'more-state-exams': 'noto:round-pushpin',      // More state exams
  'commerce': 'noto:abacus',                     // Commerce & Accounts
  'hotel-management': 'noto:fork-and-knife-with-plate', // Hotel management
  'design': 'noto:artist-palette',               // Design
  'agriculture': 'noto:sheaf-of-rice',           // Agriculture
  'pharmacy': 'noto:pill',                       // Pharmacy
  'cuet': 'noto:graduation-cap',                 // Graduation
  'railways': 'noto:locomotive',                 // Railways
  'more-railways': 'noto:railway-car',           // More railways
  'insurance': 'noto:page-with-curl',            // Insurance (document/policy)
  'police': 'noto:police-car',                   // Police & Security
  'architecture': 'noto:triangular-ruler',       // Architecture
  'veterinary': 'noto:paw-prints',               // Veterinary
  'nursing': 'noto:woman-health-worker-light-skin-tone', // Nursing
  'judiciary': 'noto:balance-scale',             // Judiciary
  'judicial-services': 'noto:judge-light-skin-tone', // Judicial Services
  'forest': 'noto:evergreen-tree',               // Forest Service
  'post-office': 'noto:postbox',                 // Post Office
  'postal-assistant': 'noto:postbox',            // Postal Assistant
  'statistics': 'noto:chart-decreasing',         // Statistical Services
  'mass-comm': 'noto:microphone',                // Mass Communication
};

// Colorful Exam Icons - COMPLETE LIST with unique icons
export const COLORFUL_EXAM_ICONS: Record<string, string> = {
  // ─── ENGINEERING ───────────────────────────────────────
  'jee-main': 'noto:gear',                       // ⚙️ Gear (engineering)
  'jee-advanced': 'noto:trophy',                 // 🏆 Gold trophy (advanced/excellence)
  'gate': 'noto:laptop',                         // 💻 Laptop (graduate engineering)
  'bitsat': 'noto:laptop',                       // 💻 Laptop (tech)
  'viteee': 'noto:dna',                          // 🧬 DNA (science/biotech)
  'srmjeee': 'noto:school',                      // 🏫 School
  'comedk': 'noto:microscope',                   // 🔬 Microscope (research)
  'iit-jam': 'noto:alembic',                     // ⚗️ Chemistry flask (science)
  'iiit': 'noto:desktop-computer',               // 🖥️ Computer (IT institutes)

  // ─── MEDICAL ───────────────────────────────────────
  'neet-ug': 'noto:stethoscope',                 // 🩺 Stethoscope (medical)
  'neet-pg': 'noto:man-health-worker-light-skin-tone', // 👨‍⚕️ Doctor (postgrad)
  'aiims': 'noto:hospital',                      // 🏥 Hospital (AIIMS)
  'aiims-nursing': 'noto:woman-health-worker-light-skin-tone', // 👩‍⚕️ Female nurse
  'jipmer': 'noto:syringe',                      // 💉 Syringe (medical institute)
  'neet-ss': 'noto:pill',                        // 💊 Pill (super specialty)
  'mbbs': 'noto:anatomical-heart',               // ❤️ Heart (medicine)
  'bds': 'noto:tooth',                           // 🦷 Tooth (dental)
  'pharma': 'noto:petri-dish',                   // 🧫 Petri dish (pharmacy)
  'gpat': 'noto:test-tube',                      // 🧪 Test tube (pharmacy)
  'nursing': 'noto:woman-health-worker-light-skin-tone', // 👩‍⚕️ Nurse
  'veterinary': 'noto:paw-prints',               // 🐾 Paw (animal medicine)
  'aipvt': 'noto:dog-face',                      // 🐶 Dog (veterinary)

  // ─── GOVERNMENT & CIVIL SERVICES ───────────────────────────────────────
  'upsc-cse': 'noto:classical-building',         // 🏛️ Classical building (UPSC)
  'upsc': 'noto:classical-building',             // 🏛️ Government
  'ssc-cgl': 'noto:man-office-worker-light-skin-tone', // 👨‍💼 Office worker
  'ssc-chsl': 'noto:file-folder',                // 📁 Files (clerical)
  'ssc-mts': 'noto:office-building',             // 🏢 Office building
  'rrb-ntpc': 'noto:locomotive',                 // 🚂 Locomotive (railway)
  'rrb-alp': 'noto:railway-car',                 // 🚃 Railway car (assistant)
  'rrb-group-d': 'noto:railway-track',           // 🛤️ Railway track (group D)
  'rrb-je': 'noto:hammer-and-wrench',            // 🛠️ Tools (junior engineer)
  'nda': 'noto:military-helmet',                 // 🪖 Military helmet (defense academy)
  'cds': 'noto:crossed-swords',                  // ⚔️ Swords (defense services)
  'afcat': 'noto:airplane',                      // ✈️ Airplane (air force)
  'indian-navy': 'noto:ship',                    // 🚢 Ship (navy)
  'indian-army': 'noto:shield',                  // 🛡️ Shield (army)
  'cisf': 'noto:guard-light-skin-tone',          // 💂 Guard (security force)
  'delhi-police': 'noto:police-car-light',       // 🚓 Police car (Delhi)
  'up-police': 'noto:police-officer-light-skin-tone', // 👮 Police officer (UP)
  'ips': 'noto:police-car',                      // 🚔 Police car (IPS)
  'ifs': 'noto:evergreen-tree',                  // 🌲 Forest service
  'irs': 'noto:money-bag',                       // 💰 Money (revenue)
  'ias': 'noto:necktie',                         // 👔 Tie (admin service)

  // ─── BANKING & FINANCE ───────────────────────────────────────
  'ibps-po': 'noto:bank',                        // 🏦 Bank (IBPS PO)
  'ibps-clerk': 'noto:money-with-wings',         // 💸 Flying money (clerk)
  'sbi-po': 'noto:credit-card',                  // 💳 Credit card (SBI)
  'sbi-clerk': 'noto:receipt',                   // 🧾 Receipt (clerk)
  'rbi-grade-b': 'noto:money-bag',               // 💰 Money bag (RBI)
  'nabard': 'noto:sheaf-of-rice',                // 🌾 Rice (agriculture bank)
  'sebi': 'noto:chart-increasing',               // 📈 Chart (securities)
  'icar-aieea': 'noto:cow-face',                 // 🐮 Cow (agriculture entrance)
  'lic-aao': 'noto:memo',                        // 📝 Insurance memo/policy
  'lic-ado': 'noto:locked-with-key',             // 🔐 Locked (insurance)
  'niacl': 'noto:page-facing-up',                // 📄 Document (insurance)
  'postal-assistant': 'noto:postbox',            // 📮 Postbox (postal)
  'gds': 'noto:package',                         // 📦 Package (postal delivery)

  // ─── MBA & MANAGEMENT ───────────────────────────────────────
  'cat': 'noto:chart-increasing',                // 📈 Chart increasing (CAT)
  'xat': 'noto:briefcase',                       // 💼 Briefcase (XAT)
  'snap': 'noto:bar-chart',                      // 📊 Bar chart (SNAP)
  'cmat': 'noto:clipboard',                      // 📋 Clipboard (CMAT)
  'mat': 'noto:ledger',                          // 📒 Ledger (MAT)
  'nmat': 'noto:card-index-dividers',            // 🗂️ Card index (NMAT)
  'iift': 'noto:globe-showing-asia-australia',   // 🌏 Globe (international trade)
  'gmat': 'noto:airplane',                       // ✈️ Airplane (global MBA)
  'atma': 'noto:books',                          // 📚 Books (MBA)
  'isi': 'noto:chart-decreasing',                // 📉 Statistics chart

  // ─── LAW & JUDICIARY ───────────────────────────────────────
  'clat': 'noto:balance-scale',                  // ⚖️ Scales (CLAT)
  'ailet': 'noto:scroll',                        // 📜 Scroll (NLU Delhi)
  'slat': 'noto:judge-light-skin-tone',          // 🧑‍⚖️ Judge (Symbiosis)
  'lsat': 'noto:open-book',                      // 📖 Law book
  'judiciary': 'noto:classical-building',        // 🏛️ Court building
  'judicial-services': 'noto:hammer',            // 🔨 Gavel/hammer
  'clat-pg': 'noto:fountain-pen',                // 🖋️ Pen (postgrad law)
  'aibe': 'noto:memo',                           // 📝 Legal memo (bar exam)

  // ─── TEACHING & EDUCATION ───────────────────────────────────────
  'ctet': 'noto:teacher-light-skin-tone',        // 🧑‍🏫 Teacher (central)
  'tet': 'noto:woman-teacher-light-skin-tone',   // 👩‍🏫 Female teacher (state)
  'kvs': 'noto:school',                          // 🏫 School (Kendriya Vidyalaya)
  'dsssb': 'noto:man-teacher-light-skin-tone',   // 👨‍🏫 Male teacher (Delhi)
  'ugc-net': 'noto:graduation-cap',              // 🎓 Graduation (UGC)
  'csir-net': 'noto:dna',                        // 🧬 DNA (science research)
  'set': 'noto:bookmark',                        // 🔖 Bookmark (eligibility)
  'reet': 'noto:books',                          // 📚 Books (Rajasthan)
  'uptet': 'noto:open-book',                     // 📖 Open book (UP)
  'htet': 'noto:notebook',                       // 📓 Notebook (Haryana)
  'rtet': 'noto:closed-book',                    // 📕 Closed book (state TET)
  'super-tet': 'noto:trophy',                    // 🏆 Trophy (super TET)

  // ─── STATE EXAMS & UNIVERSITY ENTRANCE ───────────────────────────────────────
  'cuet-ug': 'noto:student-light-skin-tone',     // 🧑‍🎓 Student (CUET UG)
  'cuet-pg': 'noto:graduation-cap',              // 🎓 Graduation (CUET PG)
  'du-entrance': 'noto:classical-building',      // 🏛️ University (DU)
  'bhu-entrance': 'noto:hindu-temple',           // 🛕 Temple (BHU)
  'ipmat': 'noto:chart-increasing',              // 📈 Chart (IPM)
  'jnu-entrance': 'noto:books',                  // 📚 Books (JNU)
  'iimc': 'noto:microphone',                     // 🎤 Microphone (mass comm)
  'tnpsc': 'noto:lotus',                         // 🪷 Lotus (Tamil Nadu state flower)
  'uppsc': 'noto:pinching-hand-light-skin-tone', // 🤏 UP
  'mppsc': 'noto:tiger-face',                    // 🐯 Tiger (MP symbol)
  'bpsc': 'noto:herb',                           // 🌿 Bihar
  'rpsc': 'noto:desert',                         // 🏜️ Rajasthan
  'kpsc': 'noto:elephant',                       // 🐘 Elephant (Karnataka symbol)
  'wbpsc': 'noto:fish',                          // 🐟 Fish (West Bengal symbol)

  // ─── COMMERCE & ACCOUNTS ───────────────────────────────────────
  'ca-foundation': 'noto:abacus',                // 🧮 Abacus (CA foundation)
  'ca-intermediate': 'noto:ledger',              // 📒 Ledger (CA inter)
  'ca-final': 'noto:money-bag',                  // 💰 Money (CA final)
  'cs-foundation': 'noto:page-with-curl',        // 📃 Document (CS found)
  'cs-executive': 'noto:briefcase',              // 💼 Briefcase (CS exec)
  'cs-professional': 'noto:necktie',             // 👔 Tie (CS professional)
  'cma-foundation': 'noto:chart-decreasing',     // 📉 Chart (CMA found)
  'cma-intermediate': 'noto:bar-chart',          // 📊 Bar chart (CMA inter)
  'cma-final': 'noto:receipt',                   // 🧾 Receipt (CMA final)

  // ─── DESIGN & ARCHITECTURE ───────────────────────────────────────
  'nata': 'noto:triangular-ruler',               // 📐 Ruler (architecture)
  'ceed': 'noto:artist-palette',                 // 🎨 Palette (design)
  'uceed': 'noto:crayon',                        // 🖍️ Crayon (undergrad design)
  'nid': 'noto:framed-picture',                  // 🖼️ Picture (industrial design)
  'nift': 'noto:dress',                          // 👗 Dress (fashion institute)

  // ─── HOTEL MANAGEMENT ───────────────────────────────────────
  'nchmct': 'noto:fork-and-knife-with-plate',    // 🍽️ Hotel management
  'nchm-jee': 'noto:hot-beverage',               // ☕ Hospitality
  'aihm': 'noto:hotel',                          // 🏨 Hotel building
};

// Colorful Subject Icons - More comprehensive with actual IDs
export const COLORFUL_SUBJECT_ICONS: Record<string, string> = {
  // Science subjects - Physics variations
  'physics': 'noto:atom-symbol',                 // ⚛️ Atom
  'jee-physics': 'noto:atom-symbol',             // ⚛️ JEE Physics
  'jee-adv-physics': 'noto:magnet',              // 🧲 Advanced Physics
  'neet-physics': 'noto:high-voltage',           // ⚡ NEET Physics
  'upsc-science': 'noto:microscope',             // 🔬 Science

  // Chemistry variations
  'chemistry': 'noto:alembic',                   // ⚗️ Chemistry flask
  'jee-chemistry': 'noto:alembic',               // ⚗️ JEE Chemistry
  'jee-adv-chemistry': 'noto:test-tube',         // 🧪 Advanced Chemistry
  'neet-chemistry': 'noto:petri-dish',           // 🧫 NEET Chemistry

  // Math variations
  'maths': 'noto:abacus',                        // 🧮 Abacus
  'mathematics': 'noto:abacus',                  // 🧮 Math
  'jee-maths': 'noto:triangular-ruler',          // 📐 JEE Math
  'jee-adv-maths': 'noto:straight-ruler',        // 📏 Advanced Math
  'gate-engineering-math': 'noto:chart-decreasing', // 📉 Engineering Math

  // Biology variations
  'biology': 'noto:dna',                         // 🧬 DNA
  'neet-biology': 'noto:microbe',                // 🦠 NEET Biology
  'botany': 'noto:seedling',                     // 🌱 Plant
  'zoology': 'noto:paw-prints',                  // 🐾 Animal
  'neet-pg-preclinical': 'noto:anatomical-heart', // ❤️ Preclinical
  'neet-pg-clinical': 'noto:stethoscope',        // 🩺 Clinical

  // Computer & Tech
  'computer': 'noto:desktop-computer',           // 🖥️ Computer
  'cs': 'noto:laptop',                           // 💻 CS
  'gate-cs': 'noto:keyboard',                    // ⌨️ GATE CS
  'it': 'noto:mobile-phone',                     // 📱 IT
  'ibps-computer': 'noto:computer-disk',         // 💽 Computer awareness

  // Reasoning & Aptitude
  'reasoning': 'noto:brain',                     // 🧠 Brain
  'aptitude': 'noto:thought-balloon',            // 💭 Thinking
  'gate-aptitude': 'noto:light-bulb',            // 💡 GATE Aptitude
  'logical': 'noto:jigsaw',                      // 🧩 Logic puzzle
  'quantitative': 'noto:input-numbers',          // 🔢 Numbers
  'sbi-reasoning': 'noto:puzzle-piece',          // 🧩 Reasoning
  'ibps-reasoning': 'noto:crystal-ball',         // 🔮 Analytical
  'sbi-quant': 'noto:abacus',                    // 🧮 Quantitative
  'ibps-quant': 'noto:input-numbers',            // 🔢 Quant

  // Language & Communication
  'english': 'noto:books',                       // 📚 Books
  'sbi-english': 'noto:open-book',               // 📖 English
  'ibps-english': 'noto:closed-book',            // 📕 English
  'hindi': 'noto:notebook',                      // 📓 Hindi
  'verbal': 'noto:speech-balloon',               // 💬 Speech

  // Social Sciences & Current Affairs
  'history': 'noto:scroll',                      // 📜 History scroll
  'upsc-history': 'noto:classical-building',     // 🏛️ UPSC History
  'geography': 'noto:globe-showing-americas',    // 🌎 Globe
  'upsc-geography': 'noto:world-map',            // 🗺️ Geography
  'polity': 'noto:balance-scale',                // ⚖️ Polity
  'upsc-polity': 'noto:classical-building',      // 🏛️ Government
  'economics': 'noto:chart-increasing',          // 📈 Economics
  'economy': 'noto:chart-increasing',            // 📈 Economy
  'upsc-economy': 'noto:money-with-wings',       // 💸 UPSC Economics
  'gk': 'noto:globe-showing-europe-africa',      // 🌍 GK
  'sbi-ga': 'noto:newspaper',                    // 📰 General Awareness
  'ibps-ga': 'noto:globe-showing-asia-australia', // 🌏 GA
  'current-affairs': 'noto:newspaper',           // 📰 News
  'upsc-current': 'noto:rolled-up-newspaper',    // 🗞️ Current Affairs
  'ethics': 'noto:handshake',                    // 🤝 Ethics
  'upsc-ethics': 'noto:folded-hands',            // 🙏 Ethics & Integrity

  // Others
  'environment': 'noto:evergreen-tree',          // 🌲 Environment
  'science': 'noto:microscope',                  // 🔬 Science
  'arts': 'noto:artist-palette',                 // 🎨 Art
};

// Helper functions
export const getColorfulCategoryIcon = (categoryId: string): string => {
  return COLORFUL_CATEGORY_ICONS[categoryId] || 'noto:folder';
};

export const getColorfulSubjectIcon = (subjectIdOrName: string): string => {
  const key = subjectIdOrName.toLowerCase().replace(/[_\s-]/g, '');

  if (COLORFUL_SUBJECT_ICONS[key]) {
    return COLORFUL_SUBJECT_ICONS[key];
  }

  for (const [subjectKey, icon] of Object.entries(COLORFUL_SUBJECT_ICONS)) {
    if (key.includes(subjectKey) || subjectKey.includes(key)) {
      return icon;
    }
  }

  return 'noto:open-book';
};

export const getColorfulExamIcon = (examId: string): string => {
  return COLORFUL_EXAM_ICONS[examId] || 'noto:graduation-cap';
};

// React Components
interface ColorfulIconProps {
  size?: number | string;
  className?: string;
}

interface ColorfulExamIconProps extends ColorfulIconProps {
  examId: string;
}

interface ColorfulCategoryIconProps extends ColorfulIconProps {
  categoryId: string;
}

interface ColorfulSubjectIconProps extends ColorfulIconProps {
  subjectId: string;
}

export const ColorfulExamIcon: React.FC<ColorfulExamIconProps> = ({
  examId,
  size = 24,
  className = ''
}) => {
  const iconName = getColorfulExamIcon(examId);
  return <Icon icon={iconName} width={size} height={size} className={className} />;
};

export const ColorfulCategoryIcon: React.FC<ColorfulCategoryIconProps> = ({
  categoryId,
  size = 24,
  className = ''
}) => {
  const iconName = getColorfulCategoryIcon(categoryId);
  return <Icon icon={iconName} width={size} height={size} className={className} />;
};

export const ColorfulSubjectIcon: React.FC<ColorfulSubjectIconProps> = ({
  subjectId,
  size = 24,
  className = ''
}) => {
  const iconName = getColorfulSubjectIcon(subjectId);
  return <Icon icon={iconName} width={size} height={size} className={className} />;
};
