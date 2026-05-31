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
  // National Level
  'jee-main': 'noto:gear',                       // ⚙️ Gear (engineering)
  'jee-advanced': 'noto:trophy',                 // 🏆 Gold trophy (advanced/excellence)
  'gate': 'noto:laptop',                         // 💻 Laptop (graduate engineering)
  'bitsat': 'noto:laptop',                       // 💻 Laptop (tech)
  'viteee': 'noto:dna',                          // 🧬 DNA (science/biotech)
  'srmjeee': 'noto:school',                      // 🏫 School
  'comedk': 'noto:microscope',                   // 🔬 Microscope (research)
  'iit-jam': 'noto:alembic',                     // ⚗️ Chemistry flask (science)
  'iiit': 'noto:desktop-computer',               // 🖥️ Computer (IT institutes)

  // State Engineering CETs (13 unique colorful icons)
  'kcet': 'noto:mage',                           // 🧙 Karnataka CET - mage/wizard (knowledge)
  'mht-cet': 'noto:factory',                     // 🏭 Maharashtra - industrial/factory
  'ts-eamcet': 'noto:mosque',                    // 🕌 Telangana - cultural landmark
  'ap-eamcet': 'noto:sunset',                    // 🌅 Andhra Pradesh - sunrise/progress
  'wbjee': 'noto:book',                          // 📖 West Bengal - education/books
  'keam': 'noto:elephant',                       // 🐘 Kerala - state symbol elephant
  'upsee': 'noto:diya-lamp',                     // 🪔 UP - traditional lamp (knowledge)
  'bcece': 'noto:bell',                          // 🔔 Bihar - temple bell (learning)
  'ojee': 'noto:wheel',                          // ☸️ Odisha - dharma wheel/konark
  'tnea': 'noto:temple',                         // 🛕 Tamil Nadu - temple architecture
  'gujcet': 'noto:lion',                         // 🦁 Gujarat - Asiatic lion (state animal)
  'reap': 'noto:camel',                          // 🐫 Rajasthan - desert camel
  'jcece': 'noto:mountain',                      // ⛰️ Jharkhand - mountains/plateaus

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

// Premium 3D illustrations for exams (covers all major categories)
const PREMIUM_3D_EXAMS: Record<string, string> = {
  // Engineering
  'jee-main': '/images/exams/jee-3d.svg',
  'jee-advanced': '/images/exams/jee-advanced-3d.svg',
  'gate': '/images/exams/gate-3d.svg',
  'bitsat': '/images/exams/bitsat-3d.svg',
  'viteee': '/images/exams/gate-3d.svg',
  'srmjeee': '/images/exams/university-3d.svg',
  'comedk': '/images/exams/university-3d.svg',
  'iit-jam': '/images/exams/jee-advanced-3d.svg',
  'iiit': '/images/exams/gate-3d.svg',

  // State Engineering - vary icons to reduce duplicates
  'kcet': '/images/exams/state-engineering-3d.svg',
  'mht-cet': '/images/exams/jee-3d.svg',
  'ts-eamcet': '/images/exams/gate-3d.svg',
  'ap-eamcet': '/images/exams/bitsat-3d.svg',
  'wbjee': '/images/exams/state-engineering-3d.svg',
  'keam': '/images/exams/jee-3d.svg',
  'upsee': '/images/exams/gate-3d.svg',
  'bcece': '/images/exams/bitsat-3d.svg',
  'ojee': '/images/exams/state-engineering-3d.svg',
  'tnea': '/images/exams/jee-3d.svg',
  'gujcet': '/images/exams/gate-3d.svg',
  'reap': '/images/exams/bitsat-3d.svg',
  'jcece': '/images/exams/state-engineering-3d.svg',

  // Medical
  'neet-ug': '/images/exams/neet-3d.svg',
  'neet-pg': '/images/exams/neet-3d.svg',
  'aiims': '/images/exams/neet-3d.svg',
  'aiims-nursing': '/images/exams/neet-3d.svg',
  'jipmer': '/images/exams/neet-3d.svg',
  'neet-ss': '/images/exams/neet-3d.svg',
  'mbbs': '/images/exams/neet-3d.svg',
  'bds': '/images/exams/neet-3d.svg',
  'pharma': '/images/exams/pharmacy-3d.svg',
  'gpat': '/images/exams/pharmacy-3d.svg',
  'nursing': '/images/exams/neet-3d.svg',
  'veterinary': '/images/exams/agriculture-3d.svg',
  'aipvt': '/images/exams/agriculture-3d.svg',

  // Civil Services & Government
  'upsc-cse': '/images/exams/upsc-3d.svg',
  'upsc': '/images/exams/upsc-3d.svg',
  'ssc-cgl': '/images/exams/ssc-3d.svg',
  'ssc-chsl': '/images/exams/ssc-3d.svg',
  'ssc-mts': '/images/exams/ssc-3d.svg',
  'ias': '/images/exams/upsc-3d.svg',
  'ips': '/images/exams/upsc-3d.svg',
  'ifs': '/images/exams/upsc-3d.svg',
  'irs': '/images/exams/upsc-3d.svg',

  // Railways
  'rrb-ntpc': '/images/exams/railway-3d.svg',
  'rrb-alp': '/images/exams/railway-3d.svg',
  'rrb-group-d': '/images/exams/railway-3d.svg',
  'rrb-je': '/images/exams/railway-3d.svg',

  // Defense
  'nda': '/images/exams/defense-3d.svg',
  'cds': '/images/exams/defense-3d.svg',
  'afcat': '/images/exams/defense-3d.svg',
  'indian-navy': '/images/exams/defense-3d.svg',
  'indian-army': '/images/exams/defense-3d.svg',
  'cisf': '/images/exams/police-3d.svg',
  'delhi-police': '/images/exams/police-3d.svg',
  'up-police': '/images/exams/police-3d.svg',

  // Banking & Finance
  'ibps-po': '/images/exams/banking-3d.svg',
  'ibps-clerk': '/images/exams/banking-3d.svg',
  'sbi-po': '/images/exams/banking-3d.svg',
  'sbi-clerk': '/images/exams/banking-3d.svg',
  'rbi-grade-b': '/images/exams/banking-3d.svg',
  'nabard': '/images/exams/banking-3d.svg',
  'sebi': '/images/exams/banking-3d.svg',
  'lic-aao': '/images/exams/banking-3d.svg',
  'lic-ado': '/images/exams/banking-3d.svg',
  'niacl': '/images/exams/banking-3d.svg',
  'postal-assistant': '/images/exams/banking-3d.svg',
  'gds': '/images/exams/banking-3d.svg',

  // MBA & Management
  'cat': '/images/exams/cat-3d.svg',
  'xat': '/images/exams/cat-3d.svg',
  'snap': '/images/exams/cat-3d.svg',
  'cmat': '/images/exams/cat-3d.svg',
  'mat': '/images/exams/cat-3d.svg',
  'nmat': '/images/exams/cat-3d.svg',
  'iift': '/images/exams/cat-3d.svg',
  'gmat': '/images/exams/cat-3d.svg',
  'atma': '/images/exams/cat-3d.svg',
  'isi': '/images/exams/cat-3d.svg',
  'ipmat': '/images/exams/cat-3d.svg',

  // Law & Judiciary
  'clat': '/images/exams/law-3d.svg',
  'ailet': '/images/exams/law-3d.svg',
  'slat': '/images/exams/law-3d.svg',
  'lsat': '/images/exams/law-3d.svg',
  'judiciary': '/images/exams/law-3d.svg',
  'judicial-services': '/images/exams/law-3d.svg',
  'clat-pg': '/images/exams/law-3d.svg',
  'aibe': '/images/exams/law-3d.svg',

  // Teaching & Education
  'ctet': '/images/exams/teaching-3d.svg',
  'tet': '/images/exams/teaching-3d.svg',
  'kvs': '/images/exams/teaching-3d.svg',
  'dsssb': '/images/exams/teaching-3d.svg',
  'ugc-net': '/images/exams/teaching-3d.svg',
  'csir-net': '/images/exams/teaching-3d.svg',
  'set': '/images/exams/teaching-3d.svg',
  'reet': '/images/exams/teaching-3d.svg',
  'uptet': '/images/exams/teaching-3d.svg',
  'htet': '/images/exams/teaching-3d.svg',
  'rtet': '/images/exams/teaching-3d.svg',
  'super-tet': '/images/exams/teaching-3d.svg',

  // University Entrance
  'cuet-ug': '/images/exams/university-3d.svg',
  'cuet-pg': '/images/exams/university-3d.svg',
  'du-entrance': '/images/exams/university-3d.svg',
  'bhu-entrance': '/images/exams/university-3d.svg',
  'jnu-entrance': '/images/exams/university-3d.svg',
  'iimc': '/images/exams/university-3d.svg',

  // State PSC
  'tnpsc': '/images/exams/ssc-3d.svg',
  'uppsc': '/images/exams/ssc-3d.svg',
  'mppsc': '/images/exams/ssc-3d.svg',
  'bpsc': '/images/exams/ssc-3d.svg',
  'rpsc': '/images/exams/ssc-3d.svg',
  'kpsc': '/images/exams/ssc-3d.svg',
  'wbpsc': '/images/exams/ssc-3d.svg',

  // Commerce & Accounts
  'ca-foundation': '/images/exams/commerce-3d.svg',
  'ca-intermediate': '/images/exams/commerce-3d.svg',
  'ca-final': '/images/exams/commerce-3d.svg',
  'cs-foundation': '/images/exams/commerce-3d.svg',
  'cs-executive': '/images/exams/commerce-3d.svg',
  'cs-professional': '/images/exams/commerce-3d.svg',
  'cma-foundation': '/images/exams/commerce-3d.svg',
  'cma-intermediate': '/images/exams/commerce-3d.svg',
  'cma-final': '/images/exams/commerce-3d.svg',
  'icar-aieea': '/images/exams/agriculture-3d.svg',

  // Design & Architecture
  'nata': '/images/exams/design-3d.svg',
  'ceed': '/images/exams/design-3d.svg',
  'uceed': '/images/exams/design-3d.svg',
  'nid': '/images/exams/design-3d.svg',
  'nift': '/images/exams/design-3d.svg',

  // Hotel Management
  'nchmct': '/images/exams/hotel-3d.svg',
  'nchm-jee': '/images/exams/hotel-3d.svg',
  'aihm': '/images/exams/hotel-3d.svg',
};

export const ColorfulExamIcon: React.FC<ColorfulExamIconProps> = ({
  examId,
  size = 24,
  className = ''
}) => {
  // Check if this exam has a premium 3D illustration
  const premiumIllustration = PREMIUM_3D_EXAMS[examId];

  if (premiumIllustration) {
    return (
      <img
        src={premiumIllustration}
        alt={examId}
        width={size}
        height={size}
        className={className}
        style={{ objectFit: 'contain' }}
      />
    );
  }

  // Fall back to emoji icons for other exams
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
