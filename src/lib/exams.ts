// PrepGenie - Complete Exam Database for India
// Covers all major competitive exams across categories

export interface Subject {
  id: string;
  name: string;
  icon: string;
  topics: string[];
}

export interface Exam {
  id: string;
  name: string;
  fullName: string;
  category: string;
  icon: string;
  color: string;
  description: string;
  subjects: Subject[];
}

export interface ExamCategory {
  id: string;
  name: string;
  icon: string;
  exams: Exam[];
}

export const examCategories: ExamCategory[] = [
  // ─── ENGINEERING ───────────────────────────────────────
  {
    id: "engineering",
    name: "Engineering",
    icon: "⚙️",
    exams: [
      {
        id: "jee-main",
        name: "JEE Main",
        fullName: "Joint Entrance Examination - Main",
        category: "engineering",
        icon: "🔧",
        color: "#3B82F6",
        description: "For admission to NITs, IIITs & GFTIs",
        subjects: [
          {
            id: "jee-physics",
            name: "Physics",
            icon: "⚡",
            topics: [
              "Mechanics", "Thermodynamics", "Waves & Oscillations",
              "Optics", "Electrostatics", "Current Electricity",
              "Magnetism", "Electromagnetic Induction", "Modern Physics",
              "Semiconductors", "Units & Measurements", "Kinematics",
              "Laws of Motion", "Work Energy Power", "Rotational Motion",
              "Gravitation", "Fluid Mechanics", "Ray Optics",
              "Wave Optics", "Dual Nature of Radiation"
            ],
          },
          {
            id: "jee-chemistry",
            name: "Chemistry",
            icon: "🧪",
            topics: [
              "Atomic Structure", "Chemical Bonding", "States of Matter",
              "Thermodynamics", "Equilibrium", "Redox Reactions",
              "Organic Chemistry Basics", "Hydrocarbons", "Polymers",
              "Electrochemistry", "Chemical Kinetics", "Surface Chemistry",
              "Periodic Table", "Coordination Compounds", "d-Block Elements",
              "p-Block Elements", "s-Block Elements", "Aldehydes & Ketones",
              "Amines", "Biomolecules"
            ],
          },
          {
            id: "jee-maths",
            name: "Mathematics",
            icon: "📐",
            topics: [
              "Algebra", "Trigonometry", "Calculus",
              "Coordinate Geometry", "Vectors & 3D Geometry", "Statistics & Probability",
              "Sets & Relations", "Complex Numbers", "Matrices & Determinants",
              "Permutations & Combinations", "Binomial Theorem", "Sequences & Series",
              "Limits & Continuity", "Differentiation", "Integration",
              "Differential Equations", "Straight Lines", "Conic Sections",
              "Probability", "Mathematical Reasoning"
            ],
          },
        ],
      },
      {
        id: "jee-advanced",
        name: "JEE Advanced",
        fullName: "Joint Entrance Examination - Advanced",
        category: "engineering",
        icon: "🏆",
        color: "#8B5CF6",
        description: "For admission to IITs",
        subjects: [
          {
            id: "jee-adv-physics",
            name: "Physics",
            icon: "⚡",
            topics: [
              "Mechanics (Advanced)", "Electromagnetism (Advanced)",
              "Optics (Advanced)", "Modern Physics (Advanced)",
              "Thermal Physics", "Waves (Advanced)", "Fluid Dynamics",
              "Rotational Dynamics", "Electromagnetic Waves",
              "Nuclear Physics", "Error Analysis", "Dimensional Analysis"
            ],
          },
          {
            id: "jee-adv-chemistry",
            name: "Chemistry",
            icon: "🧪",
            topics: [
              "Physical Chemistry (Advanced)", "Organic Chemistry (Advanced)",
              "Inorganic Chemistry (Advanced)", "Qualitative Analysis",
              "Reaction Mechanisms", "Stereochemistry",
              "Thermochemistry", "Ionic Equilibrium",
              "Solid State", "Solutions & Colligative Properties"
            ],
          },
          {
            id: "jee-adv-maths",
            name: "Mathematics",
            icon: "📐",
            topics: [
              "Calculus (Advanced)", "Algebra (Advanced)",
              "Coordinate Geometry (Advanced)", "Vectors (Advanced)",
              "Complex Numbers (Advanced)", "Differential Equations (Advanced)",
              "Number Theory", "Combinatorics (Advanced)",
              "Definite Integrals", "Area Under Curves"
            ],
          },
        ],
      },
      {
        id: "gate",
        name: "GATE",
        fullName: "Graduate Aptitude Test in Engineering",
        category: "engineering",
        icon: "🎓",
        color: "#059669",
        description: "For M.Tech admission & PSU recruitment",
        subjects: [
          {
            id: "gate-cs",
            name: "Computer Science",
            icon: "💻",
            topics: [
              "Data Structures", "Algorithms", "Operating Systems",
              "DBMS", "Computer Networks", "Theory of Computation",
              "Compiler Design", "Digital Logic", "Computer Organization",
              "Discrete Mathematics", "Programming in C", "Software Engineering"
            ],
          },
          {
            id: "gate-aptitude",
            name: "General Aptitude",
            icon: "🧠",
            topics: [
              "Verbal Ability", "Numerical Ability",
              "Logical Reasoning", "Data Interpretation",
              "Analytical Aptitude", "Spatial Aptitude"
            ],
          },
          {
            id: "gate-engineering-math",
            name: "Engineering Mathematics",
            icon: "📊",
            topics: [
              "Linear Algebra", "Calculus", "Probability & Statistics",
              "Differential Equations", "Complex Analysis",
              "Numerical Methods", "Graph Theory", "Transform Theory"
            ],
          },
        ],
      },
    ],
  },

  // ─── MEDICAL ───────────────────────────────────────────
  {
    id: "medical",
    name: "Medical",
    icon: "🏥",
    exams: [
      {
        id: "neet-ug",
        name: "NEET UG",
        fullName: "National Eligibility cum Entrance Test (UG)",
        category: "medical",
        icon: "🩺",
        color: "#EF4444",
        description: "For MBBS & BDS admission across India",
        subjects: [
          {
            id: "neet-physics",
            name: "Physics",
            icon: "⚡",
            topics: [
              "Mechanics", "Thermodynamics", "Optics",
              "Electrostatics", "Current Electricity", "Magnetism",
              "Modern Physics", "Semiconductors", "Waves",
              "Gravitation", "Properties of Matter", "Ray Optics"
            ],
          },
          {
            id: "neet-chemistry",
            name: "Chemistry",
            icon: "🧪",
            topics: [
              "Physical Chemistry", "Organic Chemistry", "Inorganic Chemistry",
              "Chemical Bonding", "Coordination Compounds", "Electrochemistry",
              "Chemical Kinetics", "Biomolecules", "Polymers",
              "Environmental Chemistry", "Surface Chemistry", "Solutions"
            ],
          },
          {
            id: "neet-biology",
            name: "Biology",
            icon: "🧬",
            topics: [
              "Cell Biology", "Genetics & Evolution", "Human Physiology",
              "Plant Physiology", "Ecology & Environment", "Biotechnology",
              "Reproduction", "Animal Kingdom", "Plant Kingdom",
              "Morphology of Flowering Plants", "Microbes in Human Welfare",
              "Body Fluids & Circulation", "Neural Control", "Molecular Basis of Inheritance",
              "Principles of Inheritance", "Human Reproduction", "Reproductive Health"
            ],
          },
        ],
      },
      {
        id: "neet-pg",
        name: "NEET PG",
        fullName: "National Eligibility cum Entrance Test (PG)",
        category: "medical",
        icon: "👨‍⚕️",
        color: "#DC2626",
        description: "For MD/MS admission",
        subjects: [
          {
            id: "neet-pg-preclinical",
            name: "Pre-Clinical",
            icon: "🔬",
            topics: [
              "Anatomy", "Physiology", "Biochemistry",
              "Pathology", "Microbiology", "Pharmacology"
            ],
          },
          {
            id: "neet-pg-clinical",
            name: "Clinical",
            icon: "🏨",
            topics: [
              "Medicine", "Surgery", "Obstetrics & Gynecology",
              "Pediatrics", "Orthopedics", "Ophthalmology",
              "ENT", "Dermatology", "Psychiatry", "Radiology",
              "Anesthesia", "Forensic Medicine"
            ],
          },
        ],
      },
    ],
  },

  // ─── CIVIL SERVICES ────────────────────────────────────
  {
    id: "civil-services",
    name: "Civil Services",
    icon: "🏛️",
    exams: [
      {
        id: "upsc-cse",
        name: "UPSC CSE",
        fullName: "Union Public Service Commission - Civil Services",
        category: "civil-services",
        icon: "🇮🇳",
        color: "#F59E0B",
        description: "For IAS, IPS, IFS & other Group A services",
        subjects: [
          {
            id: "upsc-polity",
            name: "Indian Polity",
            icon: "📜",
            topics: [
              "Constitution of India", "Fundamental Rights & Duties",
              "Parliament & State Legislatures", "Judiciary",
              "Federalism", "Local Governance", "Constitutional Bodies",
              "Emergency Provisions", "Amendment Process",
              "Election Commission", "Panchayati Raj", "Union & State Executive"
            ],
          },
          {
            id: "upsc-history",
            name: "History",
            icon: "📚",
            topics: [
              "Ancient India", "Medieval India", "Modern India",
              "Indian National Movement", "Art & Culture",
              "World History", "Post-Independence India",
              "Mughal Empire", "British Rule", "Freedom Struggle",
              "Social Reform Movements", "Cultural Heritage"
            ],
          },
          {
            id: "upsc-geography",
            name: "Geography",
            icon: "🌍",
            topics: [
              "Physical Geography", "Indian Geography",
              "World Geography", "Climatology", "Oceanography",
              "Economic Geography", "Human Geography",
              "Resource Distribution", "Agriculture",
              "Disaster Management", "Environmental Geography"
            ],
          },
          {
            id: "upsc-economy",
            name: "Economy",
            icon: "💰",
            topics: [
              "Indian Economy Basics", "Planning & NITI Aayog",
              "Banking & Finance", "Fiscal Policy", "Monetary Policy",
              "International Trade", "Agriculture Economics",
              "Industrial Policy", "Budget & Taxation",
              "Poverty & Unemployment", "Economic Reforms", "GDP & Growth"
            ],
          },
          {
            id: "upsc-science",
            name: "Science & Technology",
            icon: "🔬",
            topics: [
              "Space Technology (ISRO)", "Defence Technology",
              "Biotechnology", "Nuclear Technology", "IT & Computers",
              "Health & Medicine", "Agriculture Technology",
              "Environment & Ecology", "Nanotechnology",
              "Artificial Intelligence", "Renewable Energy"
            ],
          },
          {
            id: "upsc-current",
            name: "Current Affairs",
            icon: "📰",
            topics: [
              "National Events", "International Relations",
              "Government Schemes", "Awards & Honours",
              "Sports Events", "Economic Developments",
              "Science Discoveries", "Environmental Issues",
              "Social Issues", "Legal Developments"
            ],
          },
        ],
      },
    ],
  },

  // ─── BANKING & SSC ─────────────────────────────────────
  {
    id: "banking-ssc",
    name: "Banking & SSC",
    icon: "🏦",
    exams: [
      {
        id: "sbi-po",
        name: "SBI PO",
        fullName: "State Bank of India - Probationary Officer",
        category: "banking-ssc",
        icon: "🏦",
        color: "#1E40AF",
        description: "For Probationary Officer in SBI",
        subjects: [
          {
            id: "sbi-quant",
            name: "Quantitative Aptitude",
            icon: "🔢",
            topics: [
              "Number Series", "Simplification", "Percentage",
              "Profit & Loss", "Simple & Compound Interest",
              "Time & Work", "Time Speed Distance", "Ratio & Proportion",
              "Average", "Mixture & Alligation", "Data Interpretation",
              "Probability", "Mensuration", "Permutation & Combination"
            ],
          },
          {
            id: "sbi-reasoning",
            name: "Reasoning",
            icon: "🧩",
            topics: [
              "Syllogism", "Coding-Decoding", "Blood Relations",
              "Seating Arrangement", "Puzzles", "Inequality",
              "Direction Sense", "Order & Ranking", "Machine Input-Output",
              "Data Sufficiency", "Logical Reasoning", "Critical Reasoning"
            ],
          },
          {
            id: "sbi-english",
            name: "English Language",
            icon: "📝",
            topics: [
              "Reading Comprehension", "Cloze Test", "Error Spotting",
              "Fill in the Blanks", "Sentence Rearrangement",
              "Vocabulary", "Idioms & Phrases", "Grammar",
              "Para Jumbles", "Sentence Completion"
            ],
          },
          {
            id: "sbi-ga",
            name: "General Awareness",
            icon: "🌐",
            topics: [
              "Banking Awareness", "Financial Awareness",
              "Current Affairs", "Static GK", "RBI Policies",
              "Government Schemes", "Awards", "International Organizations",
              "Indian Economy", "Budget & Banking Terms"
            ],
          },
        ],
      },
      {
        id: "ibps-po",
        name: "IBPS PO",
        fullName: "Institute of Banking Personnel Selection - PO",
        category: "banking-ssc",
        icon: "💼",
        color: "#7C3AED",
        description: "For PO in public sector banks",
        subjects: [
          {
            id: "ibps-quant",
            name: "Quantitative Aptitude",
            icon: "🔢",
            topics: [
              "Number Series", "Simplification", "Percentage",
              "Profit & Loss", "Interest", "Time & Work",
              "Speed & Distance", "Ratio", "Data Interpretation",
              "Quadratic Equations", "Average", "Mensuration"
            ],
          },
          {
            id: "ibps-reasoning",
            name: "Reasoning",
            icon: "🧩",
            topics: [
              "Syllogism", "Coding-Decoding", "Puzzles",
              "Seating Arrangement", "Blood Relations",
              "Inequality", "Direction Sense", "Input-Output",
              "Data Sufficiency", "Statement & Assumptions"
            ],
          },
          {
            id: "ibps-english",
            name: "English Language",
            icon: "📝",
            topics: [
              "Reading Comprehension", "Cloze Test",
              "Error Spotting", "Fill in the Blanks",
              "Sentence Rearrangement", "Vocabulary", "Grammar"
            ],
          },
          {
            id: "ibps-ga",
            name: "General Awareness",
            icon: "🌐",
            topics: [
              "Banking Awareness", "Current Affairs",
              "Static GK", "Financial Awareness", "Economy"
            ],
          },
        ],
      },
      {
        id: "ibps-clerk",
        name: "IBPS Clerk",
        fullName: "IBPS Clerical Cadre",
        category: "banking-ssc",
        icon: "📋",
        color: "#2563EB",
        description: "For Clerk in public sector banks",
        subjects: [
          {
            id: "ibps-clerk-quant",
            name: "Numerical Ability",
            icon: "🔢",
            topics: [
              "Number Series", "Simplification", "Percentage",
              "Profit & Loss", "Interest", "Time & Work",
              "Ratio", "Average", "Data Interpretation"
            ],
          },
          {
            id: "ibps-clerk-reasoning",
            name: "Reasoning",
            icon: "🧩",
            topics: [
              "Syllogism", "Coding-Decoding", "Puzzles",
              "Seating Arrangement", "Blood Relations",
              "Inequality", "Alphabet Test", "Direction Sense"
            ],
          },
          {
            id: "ibps-clerk-english",
            name: "English Language",
            icon: "📝",
            topics: [
              "Reading Comprehension", "Cloze Test",
              "Error Spotting", "Sentence Improvement", "Vocabulary"
            ],
          },
        ],
      },
      {
        id: "rbi-grade-b",
        name: "RBI Grade B",
        fullName: "Reserve Bank of India - Grade B Officer",
        category: "banking-ssc",
        icon: "🏛️",
        color: "#0369A1",
        description: "For Officer in RBI",
        subjects: [
          {
            id: "rbi-ga",
            name: "General Awareness",
            icon: "🌐",
            topics: [
              "RBI Functions", "Monetary Policy", "Banking Regulation",
              "Financial Markets", "Economic Survey", "Budget",
              "International Finance", "Indian Economy", "Current Affairs"
            ],
          },
          {
            id: "rbi-quant",
            name: "Quantitative Aptitude",
            icon: "🔢",
            topics: [
              "Data Interpretation", "Number Series",
              "Quadratic Equations", "Approximation",
              "Percentage", "Profit & Loss", "Interest"
            ],
          },
          {
            id: "rbi-reasoning",
            name: "Reasoning",
            icon: "🧩",
            topics: [
              "Analytical Reasoning", "Puzzles", "Syllogism",
              "Coding-Decoding", "Seating Arrangement",
              "Data Sufficiency", "Critical Reasoning"
            ],
          },
          {
            id: "rbi-english",
            name: "English Language",
            icon: "📝",
            topics: [
              "Reading Comprehension", "Grammar",
              "Vocabulary", "Essay Writing", "Precis Writing"
            ],
          },
        ],
      },
      {
        id: "ssc-cgl",
        name: "SSC CGL",
        fullName: "Staff Selection Commission - Combined Graduate Level",
        category: "banking-ssc",
        icon: "📊",
        color: "#B45309",
        description: "For Group B & C posts in central govt",
        subjects: [
          {
            id: "ssc-quant",
            name: "Quantitative Aptitude",
            icon: "🔢",
            topics: [
              "Number System", "Percentage", "Ratio & Proportion",
              "Profit & Loss", "Interest", "Time & Work",
              "Speed & Distance", "Algebra", "Geometry",
              "Trigonometry", "Mensuration", "Data Interpretation",
              "Statistics"
            ],
          },
          {
            id: "ssc-reasoning",
            name: "General Intelligence & Reasoning",
            icon: "🧩",
            topics: [
              "Analogy", "Classification", "Series",
              "Coding-Decoding", "Matrix", "Word Formation",
              "Venn Diagram", "Blood Relations", "Mirror Image",
              "Paper Folding", "Embedded Figures", "Pattern Completion"
            ],
          },
          {
            id: "ssc-english",
            name: "English Language",
            icon: "📝",
            topics: [
              "Error Spotting", "Fill in the Blanks",
              "Synonyms & Antonyms", "Idioms & Phrases",
              "One Word Substitution", "Sentence Improvement",
              "Reading Comprehension", "Cloze Test", "Spelling Correction"
            ],
          },
          {
            id: "ssc-gk",
            name: "General Knowledge",
            icon: "🌐",
            topics: [
              "History", "Geography", "Indian Polity",
              "Economics", "Science", "Current Affairs",
              "Static GK", "Computer Knowledge"
            ],
          },
        ],
      },
      {
        id: "ssc-chsl",
        name: "SSC CHSL",
        fullName: "SSC Combined Higher Secondary Level",
        category: "banking-ssc",
        icon: "✏️",
        color: "#D97706",
        description: "For LDC, DEO & other posts",
        subjects: [
          {
            id: "ssc-chsl-quant",
            name: "Quantitative Aptitude",
            icon: "🔢",
            topics: [
              "Number System", "Percentage", "Ratio",
              "Profit & Loss", "Interest", "Time & Work",
              "Geometry", "Trigonometry", "Mensuration", "Algebra"
            ],
          },
          {
            id: "ssc-chsl-reasoning",
            name: "Reasoning",
            icon: "🧩",
            topics: [
              "Analogy", "Classification", "Series",
              "Coding-Decoding", "Blood Relations",
              "Mirror Image", "Venn Diagram", "Pattern"
            ],
          },
          {
            id: "ssc-chsl-english",
            name: "English",
            icon: "📝",
            topics: [
              "Error Spotting", "Synonyms & Antonyms",
              "Idioms", "One Word Substitution",
              "Reading Comprehension", "Sentence Improvement"
            ],
          },
          {
            id: "ssc-chsl-gk",
            name: "General Knowledge",
            icon: "🌐",
            topics: [
              "History", "Geography", "Polity",
              "Science", "Current Affairs", "Economics"
            ],
          },
        ],
      },
    ],
  },

  // ─── LAW ───────────────────────────────────────────────
  {
    id: "law",
    name: "Law",
    icon: "⚖️",
    exams: [
      {
        id: "clat",
        name: "CLAT",
        fullName: "Common Law Admission Test",
        category: "law",
        icon: "⚖️",
        color: "#7C2D12",
        description: "For admission to National Law Universities",
        subjects: [
          {
            id: "clat-english",
            name: "English Language",
            icon: "📝",
            topics: [
              "Reading Comprehension", "Grammar", "Vocabulary",
              "Critical Reasoning", "Inference", "Sentence Correction"
            ],
          },
          {
            id: "clat-gk",
            name: "General Knowledge & Current Affairs",
            icon: "🌐",
            topics: [
              "Current Affairs", "Static GK", "Legal GK",
              "Awards & Honours", "International Events",
              "Books & Authors", "Government Policies"
            ],
          },
          {
            id: "clat-legal",
            name: "Legal Reasoning",
            icon: "📜",
            topics: [
              "Legal Principles", "Legal Maxims", "Constitutional Law Basics",
              "Criminal Law Basics", "Contract Law Basics",
              "Tort Law Basics", "Legal Logical Reasoning"
            ],
          },
          {
            id: "clat-logical",
            name: "Logical Reasoning",
            icon: "🧩",
            topics: [
              "Syllogism", "Analogies", "Logical Sequences",
              "Blood Relations", "Direction Sense",
              "Assumptions & Conclusions", "Cause & Effect"
            ],
          },
          {
            id: "clat-quant",
            name: "Quantitative Techniques",
            icon: "🔢",
            topics: [
              "Number System", "Percentage", "Ratio & Proportion",
              "Profit & Loss", "Time Speed Distance",
              "Data Interpretation", "Average", "Simple & Compound Interest"
            ],
          },
        ],
      },
    ],
  },

  // ─── MBA ───────────────────────────────────────────────
  {
    id: "mba",
    name: "MBA",
    icon: "💼",
    exams: [
      {
        id: "cat",
        name: "CAT",
        fullName: "Common Admission Test",
        category: "mba",
        icon: "📈",
        color: "#9333EA",
        description: "For admission to IIMs & top B-schools",
        subjects: [
          {
            id: "cat-quant",
            name: "Quantitative Aptitude",
            icon: "🔢",
            topics: [
              "Number System", "Algebra", "Geometry",
              "Arithmetic", "Modern Math", "Permutation & Combination",
              "Probability", "Mensuration", "Trigonometry",
              "Set Theory", "Functions", "Logarithms"
            ],
          },
          {
            id: "cat-varc",
            name: "Verbal Ability & Reading Comprehension",
            icon: "📝",
            topics: [
              "Reading Comprehension", "Para Jumbles", "Para Summary",
              "Odd One Out", "Sentence Completion",
              "Critical Reasoning", "Vocabulary in Context"
            ],
          },
          {
            id: "cat-dilr",
            name: "Data Interpretation & Logical Reasoning",
            icon: "📊",
            topics: [
              "Tables", "Bar Graphs", "Line Graphs", "Pie Charts",
              "Caselets", "Seating Arrangement", "Puzzles",
              "Binary Logic", "Games & Tournaments",
              "Networks & Routes", "Venn Diagrams"
            ],
          },
        ],
      },
      {
        id: "xat",
        name: "XAT",
        fullName: "Xavier Aptitude Test",
        category: "mba",
        icon: "🎯",
        color: "#A855F7",
        description: "For admission to XLRI & XAT-associated institutes",
        subjects: [
          {
            id: "xat-verbal",
            name: "Verbal & Logical Ability",
            icon: "📝",
            topics: [
              "Reading Comprehension", "Vocabulary", "Grammar",
              "Para Jumbles", "Critical Reasoning", "Analogies"
            ],
          },
          {
            id: "xat-decision",
            name: "Decision Making",
            icon: "🤔",
            topics: [
              "Ethical Dilemmas", "Business Situations",
              "Analytical Reasoning", "Situational Judgement",
              "Data-Based Decision Making"
            ],
          },
          {
            id: "xat-quant",
            name: "Quantitative Ability & Data Interpretation",
            icon: "🔢",
            topics: [
              "Arithmetic", "Algebra", "Geometry",
              "Number System", "Data Interpretation",
              "Probability", "Permutation & Combination"
            ],
          },
        ],
      },
    ],
  },

  // ─── DEFENCE ───────────────────────────────────────────
  {
    id: "defence",
    name: "Defence",
    icon: "🎖️",
    exams: [
      {
        id: "nda",
        name: "NDA",
        fullName: "National Defence Academy",
        category: "defence",
        icon: "🎖️",
        color: "#166534",
        description: "For admission to Army, Navy & Air Force academies",
        subjects: [
          {
            id: "nda-maths",
            name: "Mathematics",
            icon: "📐",
            topics: [
              "Algebra", "Trigonometry", "Calculus",
              "Matrices & Determinants", "Analytical Geometry",
              "Vectors", "Statistics & Probability",
              "Differential Equations"
            ],
          },
          {
            id: "nda-gat",
            name: "General Ability Test",
            icon: "🧠",
            topics: [
              "English", "General Knowledge", "Physics",
              "Chemistry", "Biology", "History",
              "Geography", "Current Affairs", "Freedom Movement"
            ],
          },
        ],
      },
      {
        id: "cds",
        name: "CDS",
        fullName: "Combined Defence Services",
        category: "defence",
        icon: "⭐",
        color: "#15803D",
        description: "For officer-level entry in armed forces",
        subjects: [
          {
            id: "cds-english",
            name: "English",
            icon: "📝",
            topics: [
              "Comprehension", "Grammar", "Vocabulary",
              "Sentence Correction", "Ordering of Sentences",
              "Synonyms & Antonyms", "Idioms & Phrases"
            ],
          },
          {
            id: "cds-gk",
            name: "General Knowledge",
            icon: "🌐",
            topics: [
              "History", "Geography", "Polity",
              "Economics", "Science", "Defence & Security",
              "Current Affairs", "Awards", "Sports"
            ],
          },
          {
            id: "cds-maths",
            name: "Elementary Mathematics",
            icon: "🔢",
            topics: [
              "Number System", "HCF & LCM", "Percentage",
              "Profit & Loss", "Interest", "Time & Work",
              "Algebra", "Geometry", "Trigonometry", "Statistics"
            ],
          },
        ],
      },
    ],
  },

  // ─── TEACHING ──────────────────────────────────────────
  {
    id: "teaching",
    name: "Teaching",
    icon: "👩‍🏫",
    exams: [
      {
        id: "ugc-net",
        name: "UGC NET",
        fullName: "University Grants Commission - National Eligibility Test",
        category: "teaching",
        icon: "🎓",
        color: "#B91C1C",
        description: "For Assistant Professor & JRF eligibility",
        subjects: [
          {
            id: "ugc-paper1",
            name: "Paper 1 (General)",
            icon: "📝",
            topics: [
              "Teaching Aptitude", "Research Methodology",
              "Comprehension", "Communication", "Mathematical Reasoning",
              "Logical Reasoning", "Data Interpretation",
              "ICT", "People & Environment", "Higher Education System"
            ],
          },
        ],
      },
      {
        id: "ctet",
        name: "CTET",
        fullName: "Central Teacher Eligibility Test",
        category: "teaching",
        icon: "👨‍🏫",
        color: "#DC2626",
        description: "For teaching positions in central government schools",
        subjects: [
          {
            id: "ctet-pedagogy",
            name: "Child Development & Pedagogy",
            icon: "👶",
            topics: [
              "Child Development", "Learning Theories",
              "Piaget & Vygotsky", "Intelligence Theories",
              "Inclusive Education", "Assessment & Evaluation",
              "Motivation & Learning", "Gender Issues"
            ],
          },
          {
            id: "ctet-maths",
            name: "Mathematics",
            icon: "🔢",
            topics: [
              "Number System", "Geometry", "Algebra",
              "Data Handling", "Measurement", "Mathematics Pedagogy"
            ],
          },
          {
            id: "ctet-science",
            name: "Science",
            icon: "🔬",
            topics: [
              "Food & Nutrition", "Materials", "Living World",
              "Moving Things", "Natural Phenomena", "Natural Resources",
              "Science Pedagogy"
            ],
          },
          {
            id: "ctet-english",
            name: "English Language",
            icon: "📝",
            topics: [
              "Reading Comprehension", "Grammar",
              "Language Pedagogy", "Teaching English"
            ],
          },
        ],
      },
    ],
  },

  // ─── DESIGN ────────────────────────────────────────────
  {
    id: "design",
    name: "Design",
    icon: "🎨",
    exams: [
      {
        id: "nid",
        name: "NID DAT",
        fullName: "National Institute of Design - Design Aptitude Test",
        category: "design",
        icon: "🎨",
        color: "#EC4899",
        description: "For admission to National Institute of Design",
        subjects: [
          {
            id: "nid-gk",
            name: "General Knowledge & Current Affairs",
            icon: "🌐",
            topics: [
              "Design History", "Art & Culture", "Famous Designers",
              "Current Affairs", "Environment & Social Awareness",
              "Indian Heritage & Craft"
            ],
          },
          {
            id: "nid-analytical",
            name: "Analytical & Logical Reasoning",
            icon: "🧩",
            topics: [
              "Visual Reasoning", "Spatial Reasoning",
              "Pattern Recognition", "Analogies",
              "Observation Skills", "Logical Sequences"
            ],
          },
        ],
      },
      {
        id: "nift",
        name: "NIFT",
        fullName: "National Institute of Fashion Technology",
        category: "design",
        icon: "👗",
        color: "#F472B6",
        description: "For fashion design & technology courses",
        subjects: [
          {
            id: "nift-gat",
            name: "General Ability Test",
            icon: "🧠",
            topics: [
              "Quantitative Ability", "Communication Ability",
              "Analytical Ability", "English Comprehension",
              "General Knowledge", "Current Affairs"
            ],
          },
          {
            id: "nift-creative",
            name: "Creative Ability Test",
            icon: "🎨",
            topics: [
              "Design Thinking", "Color Theory", "Composition",
              "Visual Perception", "Innovation & Creativity",
              "Fashion Awareness"
            ],
          },
        ],
      },
    ],
  },

  // ─── RAILWAYS ──────────────────────────────────────────
  {
    id: "railways",
    name: "Railways",
    icon: "🚂",
    exams: [
      {
        id: "rrb-ntpc",
        name: "RRB NTPC",
        fullName: "Railway Recruitment Board - Non Technical Popular Categories",
        category: "railways",
        icon: "🚂",
        color: "#0891B2",
        description: "For non-technical railway posts",
        subjects: [
          {
            id: "rrb-maths",
            name: "Mathematics",
            icon: "🔢",
            topics: [
              "Number System", "Percentage", "Ratio & Proportion",
              "Profit & Loss", "Interest", "Time & Work",
              "Time & Distance", "Algebra", "Geometry",
              "Trigonometry", "Mensuration", "Statistics"
            ],
          },
          {
            id: "rrb-reasoning",
            name: "General Intelligence & Reasoning",
            icon: "🧩",
            topics: [
              "Analogies", "Classification", "Number Series",
              "Coding-Decoding", "Syllogism", "Blood Relations",
              "Direction Sense", "Statement & Conclusion",
              "Mirror Image", "Venn Diagram"
            ],
          },
          {
            id: "rrb-ga",
            name: "General Awareness",
            icon: "🌐",
            topics: [
              "History", "Geography", "Polity",
              "Economics", "Science", "Current Affairs",
              "Railway GK", "Computer Basics"
            ],
          },
        ],
      },
      {
        id: "rrb-group-d",
        name: "RRB Group D",
        fullName: "Railway Recruitment Board - Group D",
        category: "railways",
        icon: "🛤️",
        color: "#0E7490",
        description: "For Group D railway posts",
        subjects: [
          {
            id: "rrb-d-maths",
            name: "Mathematics",
            icon: "🔢",
            topics: [
              "Number System", "Percentage", "Ratio",
              "Profit & Loss", "Interest", "Time & Work",
              "Geometry", "Mensuration", "Trigonometry"
            ],
          },
          {
            id: "rrb-d-reasoning",
            name: "General Intelligence & Reasoning",
            icon: "🧩",
            topics: [
              "Analogies", "Series", "Coding-Decoding",
              "Syllogism", "Venn Diagram", "Blood Relations",
              "Mirror Image", "Classification"
            ],
          },
          {
            id: "rrb-d-science",
            name: "General Science",
            icon: "🔬",
            topics: [
              "Physics Basics", "Chemistry Basics", "Biology Basics",
              "Environmental Science", "Health & Nutrition"
            ],
          },
          {
            id: "rrb-d-ga",
            name: "General Awareness & Current Affairs",
            icon: "🌐",
            topics: [
              "Current Affairs", "Static GK", "History",
              "Geography", "Polity", "Economy"
            ],
          },
        ],
      },
    ],
  },

  // ─── INSURANCE ─────────────────────────────────────────
  {
    id: "insurance",
    name: "Insurance",
    icon: "🛡️",
    exams: [
      {
        id: "lic-aao",
        name: "LIC AAO",
        fullName: "Life Insurance Corporation - Assistant Administrative Officer",
        category: "insurance",
        icon: "🛡️",
        color: "#4338CA",
        description: "For AAO in LIC",
        subjects: [
          {
            id: "lic-reasoning",
            name: "Reasoning Ability",
            icon: "🧩",
            topics: [
              "Syllogism", "Coding-Decoding", "Blood Relations",
              "Seating Arrangement", "Puzzles", "Inequality",
              "Direction Sense", "Input-Output", "Data Sufficiency"
            ],
          },
          {
            id: "lic-quant",
            name: "Quantitative Aptitude",
            icon: "🔢",
            topics: [
              "Number Series", "Simplification", "Percentage",
              "Profit & Loss", "Interest", "Time & Work",
              "Data Interpretation", "Ratio & Proportion"
            ],
          },
          {
            id: "lic-english",
            name: "English Language",
            icon: "📝",
            topics: [
              "Reading Comprehension", "Cloze Test",
              "Error Spotting", "Sentence Rearrangement", "Vocabulary"
            ],
          },
          {
            id: "lic-ga",
            name: "General Knowledge & Current Affairs",
            icon: "🌐",
            topics: [
              "Insurance Awareness", "Financial Awareness",
              "Current Affairs", "Static GK", "Economy"
            ],
          },
        ],
      },
    ],
  },
];

// Helper functions
export function getAllExams(): Exam[] {
  return examCategories.flatMap((cat) => cat.exams);
}

export function getExamById(id: string): Exam | undefined {
  return getAllExams().find((exam) => exam.id === id);
}

export function getSubjectById(
  examId: string,
  subjectId: string
): Subject | undefined {
  const exam = getExamById(examId);
  return exam?.subjects.find((s) => s.id === subjectId);
}

export function getExamCount(): number {
  return getAllExams().length;
}

export function getTopicCount(): number {
  return getAllExams()
    .flatMap((e) => e.subjects)
    .flatMap((s) => s.topics).length;
}
