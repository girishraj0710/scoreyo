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
  'viteee': '/images/exams/viteee-3d.svg',
  'srmjeee': '/images/exams/srmjeee-3d.svg',
  'comedk': '/images/exams/comedk-3d.svg',
  'iit-jam': '/images/exams/iit-jam-3d.svg',
  'iiit': '/images/exams/iiit-3d.svg',

  // State Engineering - unique icons based on cultural themes
  'kcet': '/images/exams/kcet-3d.svg',
  'mht-cet': '/images/exams/mht-cet-3d.svg',
  'ts-eamcet': '/images/exams/ts-eamcet-3d.svg',
  'ap-eamcet': '/images/exams/ap-eamcet-3d.svg',
  'wbjee': '/images/exams/wbjee-3d.svg',
  'keam': '/images/exams/keam-3d.svg',
  'upsee': '/images/exams/upsee-3d.svg',
  'bcece': '/images/exams/bcece-3d.svg',
  'ojee': '/images/exams/ojee-3d.svg',
  'tnea': '/images/exams/tnea-3d.svg',
  'gujcet': '/images/exams/gujcet-3d.svg',
  'reap': '/images/exams/reap-3d.svg',
  'jcece': '/images/exams/jcece-3d.svg',

  // Medical
  'neet-ug': '/images/exams/neet-3d.svg',
  'neet-pg': '/images/exams/neet-pg-3d.svg',
  'aiims': '/images/exams/aiims-3d.svg',
  'aiims-nursing': '/images/exams/aiims-nursing-3d.svg',
  'jipmer': '/images/exams/jipmer-3d.svg',
  'neet-ss': '/images/exams/neet-ss-3d.svg',
  'mbbs': '/images/exams/mbbs-3d.svg',
  'bds': '/images/exams/bds-3d.svg',
  'pharma': '/images/exams/pharmacy-3d.svg',
  'gpat': '/images/exams/gpat-3d.svg',
  'nursing': '/images/exams/nursing-3d.svg',
  'aipvt': '/images/exams/aipvt-3d.svg',

  // Civil Services & Government
  'upsc-cse': '/images/exams/upsc-3d.svg',
  'upsc': '/images/exams/upsc-3d.svg',
  'ssc-cgl': '/images/exams/ssc-3d.svg',
  'ssc-chsl': '/images/exams/ssc-chsl-3d.svg',
  'ssc-mts': '/images/exams/ssc-mts-3d.svg',
  'ias': '/images/exams/upsc-3d.svg',
  'ips': '/images/exams/police-3d.svg',
  'ifs': '/images/exams/upsc-3d.svg',
  'irs': '/images/exams/upsc-3d.svg',

  // Railways
  'rrb-ntpc': '/images/exams/railway-3d.svg',
  'rrb-alp': '/images/exams/rrb-alp-3d.svg',
  'rrb-group-d': '/images/exams/rrb-group-d-3d.svg',
  'rrb-je': '/images/exams/rrb-je-3d.svg',
  'rrb-asm': '/images/exams/rrb-asm-3d.svg',
  'rrb-tc': '/images/exams/rrb-tc-3d.svg',

  // Defense
  'nda': '/images/exams/defense-3d.svg',
  'cds': '/images/exams/cds-3d.svg',
  'afcat': '/images/exams/afcat-3d.svg',
  'indian-navy': '/images/exams/indian-navy-3d.svg',
  'indian-army': '/images/exams/indian-army-3d.svg',
  'cisf': '/images/exams/cisf-3d.svg',
  'delhi-police': '/images/exams/delhi-police-3d.svg',
  'up-police': '/images/exams/up-police-3d.svg',
  'assam-rifles': '/images/exams/assam-rifles-3d.svg',
  'capf': '/images/exams/capf-3d.svg',
  'crpf': '/images/exams/crpf-3d.svg',
  'bsf': '/images/exams/bsf-3d.svg',
  'itbp': '/images/exams/itbp-3d.svg',
  'ssb': '/images/exams/ssb-3d.svg',
  'agniveer': '/images/exams/agniveer-3d.svg',

  // Banking & Finance
  'ibps-po': '/images/exams/ibps-po-3d.svg',
  'ibps-clerk': '/images/exams/ibps-clerk-3d.svg',
  'sbi-po': '/images/exams/sbi-po-3d.svg',
  'sbi-clerk': '/images/exams/sbi-clerk-3d.svg',
  'rbi-grade-b': '/images/exams/rbi-grade-b-3d.svg',
  'nabard': '/images/exams/nabard-3d.svg',
  'sebi': '/images/exams/sebi-3d.svg',
  'lic-aao': '/images/exams/lic-aao-3d.svg',
  'lic-ado': '/images/exams/lic-ado-3d.svg',
  'niacl': '/images/exams/niacl-3d.svg',
  'postal-assistant': '/images/exams/postal-assistant-3d.svg',
  'gds': '/images/exams/gds-3d.svg',

  // MBA & Management
  'cat': '/images/exams/cat-3d.svg',
  'xat': '/images/exams/xat-3d.svg',
  'snap': '/images/exams/snap-3d.svg',
  'cmat': '/images/exams/cmat-3d.svg',
  'mat': '/images/exams/mat-3d.svg',
  'nmat': '/images/exams/nmat-3d.svg',
  'iift': '/images/exams/iift-3d.svg',
  'gmat': '/images/exams/gmat-3d.svg',
  'atma': '/images/exams/atma-3d.svg',
  'isi': '/images/exams/isi-3d.svg',
  'ipmat': '/images/exams/ipmat-3d.svg',

  // Law & Judiciary
  'clat': '/images/exams/law-3d.svg',
  'ailet': '/images/exams/ailet-3d.svg',
  'slat': '/images/exams/slat-3d.svg',
  'lsat': '/images/exams/lsat-3d.svg',
  'judiciary': '/images/exams/judiciary-3d.svg',
  'judicial-services': '/images/exams/judicial-services-3d.svg',
  'clat-pg': '/images/exams/law-3d.svg',
  'aibe': '/images/exams/law-3d.svg',

  // Teaching & Education
  'ctet': '/images/exams/ctet-3d.svg',
  'tet': '/images/exams/tet-3d.svg',
  'kvs': '/images/exams/kvs-3d.svg',
  'dsssb': '/images/exams/dsssb-3d.svg',
  'ugc-net': '/images/exams/ugc-net-3d.svg',
  'csir-net': '/images/exams/csir-net-3d.svg',
  'set': '/images/exams/set-3d.svg',
  'reet': '/images/exams/reet-3d.svg',
  'uptet': '/images/exams/uptet-3d.svg',
  'htet': '/images/exams/htet-3d.svg',
  'rtet': '/images/exams/rtet-3d.svg',
  'super-tet': '/images/exams/super-tet-3d.svg',

  // University Entrance
  'cuet-ug': '/images/exams/cuet-ug-3d.svg',
  'cuet-pg': '/images/exams/cuet-pg-3d.svg',
  'du-entrance': '/images/exams/du-entrance-3d.svg',
  'bhu-entrance': '/images/exams/bhu-entrance-3d.svg',
  'jnu-entrance': '/images/exams/jnu-entrance-3d.svg',
  'iimc': '/images/exams/iimc-3d.svg',

  // State PSC
  'tnpsc': '/images/exams/tnpsc-3d.svg',
  'uppsc': '/images/exams/uppsc-3d.svg',
  'mppsc': '/images/exams/mppsc-3d.svg',
  'bpsc': '/images/exams/bpsc-3d.svg',
  'rpsc': '/images/exams/rpsc-3d.svg',
  'kpsc': '/images/exams/kpsc-3d.svg',
  'wbpsc': '/images/exams/wbpsc-3d.svg',
  'appsc': '/images/exams/appsc-3d.svg',
  'tspsc': '/images/exams/tspsc-3d.svg',
  'gpsc': '/images/exams/gpsc-3d.svg',
  'hpsc': '/images/exams/hpsc-3d.svg',
  'jpsc': '/images/exams/jpsc-3d.svg',
  'cgpsc': '/images/exams/cgpsc-3d.svg',
  'ukpsc': '/images/exams/ukpsc-3d.svg',
  'ppsc': '/images/exams/ppsc-3d.svg',
  'opsc': '/images/exams/opsc-3d.svg',
  'jkpsc': '/images/exams/jkpsc-3d.svg',

  // Commerce & Accounts
  'ca-foundation': '/images/exams/ca-foundation-3d.svg',
  'ca-intermediate': '/images/exams/ca-intermediate-3d.svg',
  'ca-final': '/images/exams/ca-final-3d.svg',
  'cs-foundation': '/images/exams/cs-foundation-3d.svg',
  'cs-executive': '/images/exams/cs-executive-3d.svg',
  'cs-professional': '/images/exams/cs-professional-3d.svg',
  'cma-foundation': '/images/exams/cma-foundation-3d.svg',
  'cma-intermediate': '/images/exams/cma-intermediate-3d.svg',
  'cma-final': '/images/exams/cma-final-3d.svg',
  'icar-aieea': '/images/exams/icar-aieea-3d.svg',

  // Design & Architecture
  'nata': '/images/exams/nata-3d.svg',
  'ceed': '/images/exams/ceed-3d.svg',
  'uceed': '/images/exams/uceed-3d.svg',
  'nid': '/images/exams/nid-3d.svg',
  'nift': '/images/exams/nift-3d.svg',
  'barch': '/images/exams/barch-3d.svg',

  // Hotel Management
  'nchmct': '/images/exams/hotel-management-3d.svg',
  'nchm-jee': '/images/exams/hotel-management-3d.svg',
  'aihm': '/images/exams/hotel-management-3d.svg',
  'hotel-management': '/images/exams/hotel-management-3d.svg',

  // Veterinary & Animal Sciences
  'veterinary': '/images/exams/veterinary-3d.svg',
  'bvsc': '/images/exams/bvsc-3d.svg',

  // Paramedical
  'paramedical': '/images/exams/paramedical-3d.svg',

  // FCI & Other Govt
  'fci': '/images/exams/fci-3d.svg',
};

export const ColorfulExamIcon: React.FC<ColorfulExamIconProps> = ({
  examId,
  size = 24,
  className = ''
}) => {
  // Check if this exam has a specific 3D illustration
  const premiumIllustration = PREMIUM_3D_EXAMS[examId];

  // Always use 3D icons - use specific icon or default exam icon
  const iconPath = premiumIllustration || '/images/exams/default-exam-3d.svg';

  return (
    <img
      src={iconPath}
      alt={examId}
      width={size}
      height={size}
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
};

// Premium 3D illustrations for categories
const PREMIUM_3D_CATEGORIES: Record<string, string> = {
  'engineering': '/images/categories/engineering-3d.svg',
  'medical': '/images/categories/medical-3d.svg',
  'civil-services': '/images/categories/civil-services-3d.svg',
  'government': '/images/categories/civil-services-3d.svg',
  'banking': '/images/categories/banking-3d.svg',
  'banking-ssc': '/images/categories/banking-3d.svg',
  'law': '/images/categories/law-3d.svg',
  'mba': '/images/categories/mba-3d.svg',
  'management': '/images/categories/mba-3d.svg',
  'defence': '/images/categories/defence-3d.svg',
  'defense': '/images/categories/defence-3d.svg',
  'teaching': '/images/categories/teaching-3d.svg',
  'more-teaching': '/images/categories/state-teaching-3d.svg',
  'design': '/images/categories/design-3d.svg',
  'railways': '/images/categories/railways-3d.svg',
  'more-railways': '/images/categories/railways-3d.svg',
  'insurance': '/images/categories/insurance-3d.svg',
  'police': '/images/categories/police-3d.svg',
  'state': '/images/categories/state-psc-3d.svg',
  'state-psc': '/images/categories/state-psc-3d.svg',
  'more-state-exams': '/images/categories/more-state-exams-3d.svg',
  'hotel-management': '/images/categories/hotel-management-3d.svg',
  'architecture': '/images/categories/architecture-3d.svg',
  'commerce': '/images/categories/commerce-3d.svg',
  'agriculture': '/images/categories/agriculture-3d.svg',
  'veterinary': '/images/categories/veterinary-3d.svg',
  'pharmacy': '/images/categories/pharmacy-3d.svg',
  'nursing': '/images/categories/nursing-3d.svg',
  'more-defense': '/images/categories/defence-3d.svg',
  'forest': '/images/categories/forest-3d.svg',
  'judiciary': '/images/categories/judiciary-3d.svg',
  'judicial-services': '/images/categories/judiciary-3d.svg',
  'post-office': '/images/categories/postal-3d.svg',
  'postal-assistant': '/images/categories/postal-3d.svg',
  'statistics': '/images/categories/statistics-3d.svg',
  'mass-comm': '/images/categories/mass-comm-3d.svg',
};

export const ColorfulCategoryIcon: React.FC<ColorfulCategoryIconProps> = ({
  categoryId,
  size = 24,
  className = ''
}) => {
  // Check if this category has a specific 3D illustration
  const premiumIllustration = PREMIUM_3D_CATEGORIES[categoryId];

  // Always use 3D icons - use specific icon or default category icon
  const iconPath = premiumIllustration || '/images/categories/default-category-3d.svg';

  return (
    <img
      src={iconPath}
      alt={categoryId}
      width={size}
      height={size}
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
};

// Premium 3D illustrations for subjects
const PREMIUM_3D_SUBJECTS: Record<string, string> = {
  // Core Science subjects
  'physics': '/images/subjects/physics-3d.svg',
  'jee-physics': '/images/subjects/physics-3d.svg',
  'jee-adv-physics': '/images/subjects/physics-3d.svg',
  'neet-physics': '/images/subjects/physics-3d.svg',
  'gate-physics': '/images/subjects/physics-3d.svg',
  'kcet-physics': '/images/subjects/physics-3d.svg',
  'mht-physics': '/images/subjects/physics-3d.svg',
  'ts-physics': '/images/subjects/physics-3d.svg',
  'ap-physics': '/images/subjects/physics-3d.svg',

  'chemistry': '/images/subjects/chemistry-3d.svg',
  'jee-chemistry': '/images/subjects/chemistry-3d.svg',
  'jee-adv-chemistry': '/images/subjects/chemistry-3d.svg',
  'neet-chemistry': '/images/subjects/chemistry-3d.svg',
  'kcet-chemistry': '/images/subjects/chemistry-3d.svg',
  'mht-chemistry': '/images/subjects/chemistry-3d.svg',
  'ts-chemistry': '/images/subjects/chemistry-3d.svg',
  'ap-chemistry': '/images/subjects/chemistry-3d.svg',

  'maths': '/images/subjects/maths-3d.svg',
  'mathematics': '/images/subjects/maths-3d.svg',
  'jee-maths': '/images/subjects/maths-3d.svg',
  'jee-adv-maths': '/images/subjects/maths-3d.svg',
  'gate-engineering-math': '/images/subjects/maths-3d.svg',
  'kcet-maths': '/images/subjects/maths-3d.svg',
  'mht-maths': '/images/subjects/maths-3d.svg',
  'ts-maths': '/images/subjects/maths-3d.svg',
  'ap-maths': '/images/subjects/maths-3d.svg',
  'htet-maths': '/images/subjects/maths-3d.svg',
  'ctet-maths': '/images/subjects/maths-3d.svg',
  'uptet-maths': '/images/subjects/maths-3d.svg',
  'rtet-maths': '/images/subjects/maths-3d.svg',
  'kvs-maths': '/images/subjects/maths-3d.svg',
  'dsssb-maths': '/images/subjects/maths-3d.svg',
  'isi-maths': '/images/subjects/maths-3d.svg',

  'biology': '/images/subjects/biology-3d.svg',
  'neet-biology': '/images/subjects/biology-3d.svg',
  'botany': '/images/subjects/biology-3d.svg',
  'zoology': '/images/subjects/biology-3d.svg',

  'science': '/images/subjects/science-3d.svg',
  'general-science': '/images/subjects/science-3d.svg',
  'upsc-science': '/images/subjects/science-3d.svg',
  'htet-science': '/images/subjects/science-3d.svg',
  'ctet-science': '/images/subjects/science-3d.svg',
  'uptet-science': '/images/subjects/science-3d.svg',
  'rtet-science': '/images/subjects/science-3d.svg',
  'kvs-science': '/images/subjects/science-3d.svg',
  'dsssb-science': '/images/subjects/science-3d.svg',
  'evs': '/images/subjects/science-3d.svg',

  // Languages
  'english': '/images/subjects/english-3d.svg',
  'sbi-english': '/images/subjects/english-3d.svg',
  'ibps-english': '/images/subjects/english-3d.svg',
  'pa-english': '/images/subjects/english-3d.svg',
  'iimc-english': '/images/subjects/english-3d.svg',
  'htet-english': '/images/subjects/english-3d.svg',
  'ctet-english': '/images/subjects/english-3d.svg',
  'rtet-english': '/images/subjects/english-3d.svg',
  'uptet-english': '/images/subjects/english-3d.svg',
  'dsssb-english': '/images/subjects/english-3d.svg',
  'kvs-english': '/images/subjects/english-3d.svg',

  'hindi': '/images/subjects/hindi-3d.svg',
  'htet-hindi': '/images/subjects/hindi-3d.svg',
  'ctet-hindi': '/images/subjects/hindi-3d.svg',
  'rtet-hindi': '/images/subjects/hindi-3d.svg',
  'uptet-hindi': '/images/subjects/hindi-3d.svg',
  'dsssb-hindi': '/images/subjects/hindi-3d.svg',
  'up-hindi': '/images/subjects/hindi-3d.svg',
  'kvs-hindi': '/images/subjects/hindi-3d.svg',
  'hindi-language': '/images/subjects/hindi-3d.svg',

  // Aptitude & Reasoning
  'reasoning': '/images/subjects/reasoning-3d.svg',
  'reasoning-ability': '/images/subjects/reasoning-3d.svg',
  'aptitude': '/images/subjects/reasoning-3d.svg',
  'logical': '/images/subjects/reasoning-3d.svg',
  'sbi-reasoning': '/images/subjects/reasoning-3d.svg',
  'ibps-reasoning': '/images/subjects/reasoning-3d.svg',
  'ibps-clerk-reasoning': '/images/subjects/reasoning-3d.svg',
  'rbi-reasoning': '/images/subjects/reasoning-3d.svg',
  'lic-reasoning': '/images/subjects/reasoning-3d.svg',
  'dp-reasoning': '/images/subjects/reasoning-3d.svg',
  'cisf-reasoning': '/images/subjects/reasoning-3d.svg',
  'pa-reasoning': '/images/subjects/reasoning-3d.svg',
  'gds-reasoning': '/images/subjects/reasoning-3d.svg',
  'iimc-reasoning': '/images/subjects/reasoning-3d.svg',
  'gate-aptitude': '/images/subjects/reasoning-3d.svg',
  'nda-gat': '/images/subjects/reasoning-3d.svg',
  'nift-gat': '/images/subjects/reasoning-3d.svg',
  'ca-paper3b-logical': '/images/subjects/reasoning-3d.svg',
  'general-ability': '/images/subjects/reasoning-3d.svg',
  'general-intelligence': '/images/subjects/reasoning-3d.svg',
  'sbi-quant': '/images/subjects/quantitative-3d.svg',
  'ibps-quant': '/images/subjects/quantitative-3d.svg',
  'ibps-clerk-quant': '/images/subjects/quantitative-3d.svg',
  'pa-quant': '/images/subjects/quantitative-3d.svg',
  'gds-maths': '/images/subjects/quantitative-3d.svg',
  'up-numerical': '/images/subjects/quantitative-3d.svg',
  'numerical-ability': '/images/subjects/quantitative-3d.svg',
  'dp-numerical': '/images/subjects/quantitative-3d.svg',
  'cisf-numerical': '/images/subjects/quantitative-3d.svg',
  'afcat-numerical': '/images/subjects/quantitative-3d.svg',
  'arithmetical-ability': '/images/subjects/quantitative-3d.svg',
  'mental-ability': '/images/subjects/reasoning-3d.svg',
  'up-reasoning': '/images/subjects/reasoning-3d.svg',

  // Social Sciences
  'history': '/images/subjects/history-3d.svg',
  'upsc-history': '/images/subjects/history-3d.svg',

  'geography': '/images/subjects/geography-3d.svg',
  'upsc-geography': '/images/subjects/geography-3d.svg',

  'general-studies': '/images/subjects/gk-3d.svg',
  'gs': '/images/subjects/gk-3d.svg',
  'uppsc-gs': '/images/subjects/gk-3d.svg',
  'mppsc-gs': '/images/subjects/gk-3d.svg',
  'bpsc-gs': '/images/subjects/gk-3d.svg',
  'rpsc-gs': '/images/subjects/gk-3d.svg',
  'kpsc-gs': '/images/subjects/gk-3d.svg',
  'tnpsc-gs': '/images/subjects/gk-3d.svg',
  'wbpsc-gs': '/images/subjects/gk-3d.svg',
  'ifs-gs': '/images/subjects/gk-3d.svg',

  'economics': '/images/subjects/economics-3d.svg',
  'economy': '/images/subjects/economics-3d.svg',
  'upsc-economy': '/images/subjects/economics-3d.svg',

  // General Knowledge
  'gk': '/images/subjects/gk-3d.svg',
  'general-knowledge': '/images/subjects/gk-3d.svg',
  'general-awareness': '/images/subjects/gk-3d.svg',
  'sbi-ga': '/images/subjects/gk-3d.svg',
  'ibps-ga': '/images/subjects/gk-3d.svg',
  'pa-gk': '/images/subjects/gk-3d.svg',
  'gds-gk': '/images/subjects/gk-3d.svg',
  'iimc-ga': '/images/subjects/gk-3d.svg',
  'dp-gk': '/images/subjects/gk-3d.svg',
  'up-gk': '/images/subjects/gk-3d.svg',
  'nursing-gk': '/images/subjects/gk-3d.svg',
  'general-knowledge-awareness': '/images/subjects/gk-3d.svg',

  // Computer Science
  'computer': '/images/subjects/computer-3d.svg',
  'computer-fundamentals': '/images/subjects/computer-3d.svg',
  'cs': '/images/subjects/computer-3d.svg',
  'gate-cs': '/images/subjects/computer-3d.svg',
  'it': '/images/subjects/computer-3d.svg',
  'ibps-computer': '/images/subjects/computer-3d.svg',
  'dp-computer': '/images/subjects/computer-3d.svg',
  'computer-awareness': '/images/subjects/computer-3d.svg',
  'computer-aptitude': '/images/subjects/computer-3d.svg',

  // Social Studies (Teaching exams)
  'social-studies': '/images/subjects/social-studies-3d.svg',
  'htet-social': '/images/subjects/social-studies-3d.svg',
  'ctet-social': '/images/subjects/social-studies-3d.svg',
  'uptet-social': '/images/subjects/social-studies-3d.svg',
  'rtet-social': '/images/subjects/social-studies-3d.svg',
  'kvs-social': '/images/subjects/social-studies-3d.svg',

  // Pedagogy subjects (use appropriate book)
  'pedagogy': '/images/subjects/cdp-3d.svg',
  'teaching-methodology': '/images/subjects/cdp-3d.svg',

  // Accounting & Finance - NEW DISTINCTIVE ICON
  'accounting': '/images/subjects/accounting-3d.svg',
  'finance': '/images/subjects/accounting-3d.svg',
  'banking-awareness': '/images/subjects/accounting-3d.svg',
  'ca-accounting': '/images/subjects/accounting-3d.svg',
  'ca-paper1-accounting': '/images/subjects/accounting-3d.svg',
  'ca-foundation-accounting': '/images/subjects/accounting-3d.svg',
  'ca-intermediate-accounting': '/images/subjects/accounting-3d.svg',
  'ca-final-accounting': '/images/subjects/accounting-3d.svg',
  'cs-accounting': '/images/subjects/accounting-3d.svg',
  'cma-accounting': '/images/subjects/accounting-3d.svg',
  'financial-accounting': '/images/subjects/accounting-3d.svg',
  'cost-accounting': '/images/subjects/accounting-3d.svg',

  // Child Development & Pedagogy - NEW DISTINCTIVE ICON
  'cdp': '/images/subjects/cdp-3d.svg',
  'child-development': '/images/subjects/cdp-3d.svg',
  'htet-cdp': '/images/subjects/cdp-3d.svg',
  'ctet-cdp': '/images/subjects/cdp-3d.svg',
  'uptet-cdp': '/images/subjects/cdp-3d.svg',
  'rtet-cdp': '/images/subjects/cdp-3d.svg',
  'kvs-cdp': '/images/subjects/cdp-3d.svg',
  'dsssb-cdp': '/images/subjects/cdp-3d.svg',
  'child-psychology': '/images/subjects/cdp-3d.svg',

  // Law & Legal Reasoning - NEW DISTINCTIVE ICON
  'law': '/images/subjects/law-3d.svg',
  'legal-reasoning': '/images/subjects/law-3d.svg',
  'jud-law': '/images/subjects/law-3d.svg',
  'clat-legal': '/images/subjects/law-3d.svg',
  'ailet-legal': '/images/subjects/law-3d.svg',
  'slat-legal': '/images/subjects/law-3d.svg',
  'constitutional-law': '/images/subjects/law-3d.svg',
  'judiciary-law': '/images/subjects/law-3d.svg',
  'legal-aptitude': '/images/subjects/law-3d.svg',

  // Polity & Government - NEW DISTINCTIVE ICON
  'polity': '/images/subjects/polity-3d.svg',
  'upsc-polity': '/images/subjects/polity-3d.svg',
  'indian-polity': '/images/subjects/polity-3d.svg',
  'governance': '/images/subjects/polity-3d.svg',
  'constitution': '/images/subjects/polity-3d.svg',
  'political-science': '/images/subjects/polity-3d.svg',

  // Data Interpretation & Logical Reasoning - NEW DISTINCTIVE ICON
  'dilr': '/images/subjects/data-interpretation-3d.svg',
  'data-interpretation': '/images/subjects/data-interpretation-3d.svg',
  'cat-dilr': '/images/subjects/data-interpretation-3d.svg',
  'xat-dilr': '/images/subjects/data-interpretation-3d.svg',
  'snap-dilr': '/images/subjects/data-interpretation-3d.svg',
  'cmat-dilr': '/images/subjects/data-interpretation-3d.svg',
  'di': '/images/subjects/data-interpretation-3d.svg',
  'lr': '/images/subjects/data-interpretation-3d.svg',

  // Verbal Ability & Comprehension - NEW DISTINCTIVE ICON
  'verbal': '/images/subjects/verbal-3d.svg',
  'verbal-ability': '/images/subjects/verbal-3d.svg',
  'cat-verbal': '/images/subjects/verbal-3d.svg',
  'xat-verbal': '/images/subjects/verbal-3d.svg',
  'snap-verbal': '/images/subjects/verbal-3d.svg',
  'cmat-verbal': '/images/subjects/verbal-3d.svg',
  'varc': '/images/subjects/verbal-3d.svg',
  'comprehension': '/images/subjects/verbal-3d.svg',
  'reading-comprehension': '/images/subjects/verbal-3d.svg',

  // Quantitative Aptitude - NEW DISTINCTIVE ICON
  'quantitative': '/images/subjects/quantitative-3d.svg',
  'quantitative-aptitude': '/images/subjects/quantitative-3d.svg',
  'cat-quant': '/images/subjects/quantitative-3d.svg',
  'xat-quant': '/images/subjects/quantitative-3d.svg',
  'snap-quant': '/images/subjects/quantitative-3d.svg',
  'cmat-quant': '/images/subjects/quantitative-3d.svg',
  'qa': '/images/subjects/quantitative-3d.svg',
  'quant': '/images/subjects/quantitative-3d.svg',

  // Current Affairs - NEW DISTINCTIVE ICON
  'current-affairs': '/images/subjects/current-affairs-3d.svg',
  'upsc-current': '/images/subjects/current-affairs-3d.svg',
  'current-events': '/images/subjects/current-affairs-3d.svg',
  'news': '/images/subjects/current-affairs-3d.svg',
  'daily-current-affairs': '/images/subjects/current-affairs-3d.svg',

  // Agriculture - NEW DISTINCTIVE ICON
  'agriculture': '/images/subjects/agriculture-3d.svg',
  'icar-agriculture': '/images/subjects/agriculture-3d.svg',
  'nabard-agriculture': '/images/subjects/agriculture-3d.svg',
  'agricultural-sciences': '/images/subjects/agriculture-3d.svg',
  'farming': '/images/subjects/agriculture-3d.svg',

  // Pharmacy & Medical Sciences - NEW DISTINCTIVE ICON
  'pharmacy': '/images/subjects/pharmacy-3d.svg',
  'pharma': '/images/subjects/pharmacy-3d.svg',
  'gpat-pharmacy': '/images/subjects/pharmacy-3d.svg',
  'pharmaceutics': '/images/subjects/pharmacy-3d.svg',
  'pharmacology': '/images/subjects/pharmacy-3d.svg',
  'pharmaceutical-chemistry': '/images/subjects/pharmacy-3d.svg',
  'nursing-anatomy': '/images/subjects/pharmacy-3d.svg',
  'nursing-physiology': '/images/subjects/pharmacy-3d.svg',

  // Ethics & Integrity - NEW DISTINCTIVE ICON
  'ethics': '/images/subjects/ethics-3d.svg',
  'upsc-ethics': '/images/subjects/ethics-3d.svg',
  'ethics-integrity': '/images/subjects/ethics-3d.svg',
  'moral-philosophy': '/images/subjects/ethics-3d.svg',
  'case-studies': '/images/subjects/ethics-3d.svg',

  // Environment & Ecology - NEW DISTINCTIVE ICON
  'environment': '/images/subjects/environment-3d.svg',
  'ecology': '/images/subjects/environment-3d.svg',
  'upsc-environment': '/images/subjects/environment-3d.svg',
  'environmental-studies': '/images/subjects/environment-3d.svg',
  'biodiversity': '/images/subjects/environment-3d.svg',
  'climate-change': '/images/subjects/environment-3d.svg',

  // Technology & Innovation - NEW DISTINCTIVE ICON
  'technology': '/images/subjects/technology-3d.svg',
  'science-technology': '/images/subjects/technology-3d.svg',
  'upsc-science-tech': '/images/subjects/technology-3d.svg',
  'innovation': '/images/subjects/technology-3d.svg',
  'emerging-tech': '/images/subjects/technology-3d.svg',

  // Art & Culture - NEW DISTINCTIVE ICON
  'art-culture': '/images/subjects/art-culture-3d.svg',
  'indian-culture': '/images/subjects/art-culture-3d.svg',
  'upsc-art-culture': '/images/subjects/art-culture-3d.svg',
  'heritage': '/images/subjects/art-culture-3d.svg',
  'cultural-studies': '/images/subjects/art-culture-3d.svg',
  'indian-art': '/images/subjects/art-culture-3d.svg',

  // Statistics & Data Analysis - NEW DISTINCTIVE ICON
  'statistics': '/images/subjects/statistics-3d.svg',
  'isi-stats': '/images/subjects/statistics-3d.svg',
  'data-analysis': '/images/subjects/statistics-3d.svg',
  'probability': '/images/subjects/statistics-3d.svg',
  'statistical-methods': '/images/subjects/statistics-3d.svg',

  // Additional exam-specific subject mappings to eliminate remaining duplicates
  'afcat-gk': '/images/subjects/gk-3d.svg',
  'ailet-english': '/images/subjects/english-3d.svg',
  'aipvt-physics': '/images/subjects/physics-3d.svg',
  'army-maths': '/images/subjects/maths-3d.svg',
  'bcece-physics': '/images/subjects/physics-3d.svg',
  'cds-english': '/images/subjects/english-3d.svg',
  'cisf-gk': '/images/subjects/gk-3d.svg',
  'clat-english': '/images/subjects/english-3d.svg',
  'comedk-physics': '/images/subjects/physics-3d.svg',
  'cs-business-env': '/images/subjects/economics-3d.svg',
  'ctet-pedagogy': '/images/subjects/cdp-3d.svg',
  'dsssb-gs': '/images/subjects/gk-3d.svg',
  'gpat-pharma': '/images/subjects/pharmacy-3d.svg',
  'gujcet-physics': '/images/subjects/physics-3d.svg',
  'icar-physics': '/images/subjects/physics-3d.svg',
  'icar-chemistry': '/images/subjects/chemistry-3d.svg',
  'icar-biology': '/images/subjects/biology-3d.svg',
  'icar-maths': '/images/subjects/maths-3d.svg',
  'jcece-physics': '/images/subjects/physics-3d.svg',
  'keam-physics': '/images/subjects/physics-3d.svg',
  'kvs-gs': '/images/subjects/gk-3d.svg',
  'nata-maths': '/images/subjects/maths-3d.svg',
  'navy-maths': '/images/subjects/maths-3d.svg',
  'nchmct-english': '/images/subjects/english-3d.svg',
  'nda-maths': '/images/subjects/maths-3d.svg',
  'neet-pg-preclinical': '/images/subjects/biology-3d.svg',
  'nid-gk': '/images/subjects/gk-3d.svg',
  'ojee-physics': '/images/subjects/physics-3d.svg',
  'rbi-ga': '/images/subjects/gk-3d.svg',
  'reap-physics': '/images/subjects/physics-3d.svg',
  'rrb-alp-maths': '/images/subjects/maths-3d.svg',
  'rrb-d-maths': '/images/subjects/maths-3d.svg',
  'rrb-je-gen': '/images/subjects/gk-3d.svg',
  'rrb-maths': '/images/subjects/maths-3d.svg',
  'ssc-chsl-quant': '/images/subjects/quantitative-3d.svg',
  'ssc-quant': '/images/subjects/quantitative-3d.svg',
  'tnea-physics': '/images/subjects/physics-3d.svg',
  'ugc-paper1': '/images/subjects/gk-3d.svg',
  'upsee-physics': '/images/subjects/physics-3d.svg',
  'wbjee-physics': '/images/subjects/physics-3d.svg',
};

export const ColorfulSubjectIcon: React.FC<ColorfulSubjectIconProps> = ({
  subjectId,
  size = 24,
  className = ''
}) => {
  // Check if this subject has a specific 3D illustration
  const premiumIllustration = PREMIUM_3D_SUBJECTS[subjectId];

  // Always use 3D icons - use specific icon or default book icon
  const iconPath = premiumIllustration || '/images/subjects/default-book-3d.svg';

  return (
    <img
      src={iconPath}
      alt={subjectId}
      width={size}
      height={size}
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
};
