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
              "Mechanics (Kinematics - 2D & 3D motion, Relative velocity; Laws of Motion - Advanced problems, Friction; Work Energy Power - Conservative forces; Rotational Dynamics - Moment of inertia, Angular momentum; Gravitation - Orbital motion, Escape velocity)",
              "Thermal Physics (Thermodynamics - Laws, Carnot engine, Entropy; Kinetic Theory - Maxwell distribution, Mean free path; Heat Transfer - Conduction, Convection, Radiation)",
              "Electromagnetism (Electrostatics - Gauss law, Capacitors; Current Electricity - Complex circuits, Kirchhoff; Magnetism - Magnetic materials, Hysteresis; Electromagnetic Induction - Faraday, Lenz, Self & Mutual inductance; AC Circuits - LCR, Resonance)",
              "Optics (Wave Optics - Interference, Diffraction, Polarization; Ray Optics - Lenses, Mirrors, Prisms, Optical instruments)",
              "Modern Physics (Photoelectric effect, Compton effect, Matter waves, Bohr model, X-rays, Radioactivity, Nuclear reactions)",
              "Waves (SHM, Wave motion, Superposition, Standing waves, Doppler effect)",
              "Fluid Mechanics (Pressure, Buoyancy, Bernoulli's theorem, Viscosity)",
              "Error Analysis & Experiments", "Dimensional Analysis"
            ],
          },
          {
            id: "jee-adv-chemistry",
            name: "Chemistry",
            icon: "🧪",
            topics: [
              "Physical Chemistry (Atomic Structure - Quantum numbers, Orbitals; Chemical Bonding - MOT, VSEPR, Hybridization; Gaseous State - Real gases; Solid State - Crystal lattices, Defects; Thermodynamics - Laws, Hess law, Entropy, Gibbs energy; Equilibrium - Chemical & Ionic equilibrium; Electrochemistry - Nernst equation, Electrolysis; Chemical Kinetics - Order, Rate laws, Activation energy; Surface Chemistry - Adsorption, Catalysis, Colloids; Solutions - Colligative properties, Raoult's law)",
              "Inorganic Chemistry (Periodic Table - Trends, Exceptions; Hydrogen & its compounds; s-Block - Alkali & Alkaline earth metals; p-Block - Group 13-18 elements; d-Block - Transition metals, Coordination compounds - Nomenclature, Isomerism, Bonding, CFT; f-Block - Lanthanides, Actinides; Metallurgy - Extraction principles; Qualitative Analysis - Salt analysis)",
              "Organic Chemistry (Basic concepts - GOC, Resonance, Hyperconjugation, Inductive effect; Nomenclature & Isomerism - Structural, Stereoisomerism; Reaction Mechanisms - SN1, SN2, E1, E2, Electrophilic & Nucleophilic; Hydrocarbons - Alkanes, Alkenes, Alkynes, Aromatic; Oxygen containing - Alcohols, Phenols, Ethers, Aldehydes, Ketones, Carboxylic acids; Nitrogen containing - Amines, Diazonium salts; Biomolecules - Carbohydrates, Amino acids, Proteins, Nucleic acids; Polymers - Addition, Condensation; Practical Organic - Purification, Detection of elements)"
            ],
          },
          {
            id: "jee-adv-maths",
            name: "Mathematics",
            icon: "📐",
            topics: [
              "Algebra (Complex Numbers - De Moivre, Roots of unity; Quadratic Equations - Relations between roots; Sequences & Series - AP, GP, HP, AGP; Permutations & Combinations; Binomial Theorem - Properties, Applications; Matrices - Operations, Determinants, Inverse, System of equations; Probability - Conditional, Bayes, Binomial, Mean & Variance)",
              "Trigonometry (Ratios, Identities, Equations, Inverse functions, Heights & Distances, Properties of triangles)",
              "Coordinate Geometry (Straight Lines - Angle, Distance, Area; Circles - Tangent, Normal, Chord, Family; Parabola, Ellipse, Hyperbola - Standard forms, Properties, Tangent, Normal)",
              "Calculus (Limits - L'Hospital rule; Continuity & Differentiability; Derivatives - Chain rule, Implicit, Parametric; Applications - Tangent, Normal, Maxima-Minima, Rate of change; Indefinite Integration - Methods, Partial fractions; Definite Integration - Properties, Leibnitz rule; Applications - Area, Volume; Differential Equations - Formation, Solution of first order)",
              "Vectors & 3D Geometry (Vectors - Operations, Scalar & Vector products, Triple products; 3D - Direction cosines, Equation of line & plane, Distance, Angle)",
              "Functions (Types, Composition, Inverse, Domain & Range)",
              "Mathematical Reasoning & Induction"
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
            name: "Computer Science & IT",
            icon: "💻",
            topics: [
              "Data Structures (Arrays, Stacks, Queues, Trees, Graphs, Hashing)",
              "Algorithms (Sorting, Searching, Greedy, Dynamic Programming, Graph algorithms)",
              "Operating Systems (Process, Threads, CPU Scheduling, Deadlock, Memory Management)",
              "Database Management Systems (ER Model, SQL, Normalization, Transactions, Indexing)",
              "Computer Networks (OSI & TCP/IP, Routing, Network Security, Application Layer)",
              "Theory of Computation (Automata, Regular Languages, Context-Free Grammars, Turing Machines)",
              "Compiler Design (Lexical Analysis, Parsing, Code Generation, Optimization)",
              "Digital Logic (Boolean Algebra, K-maps, Combinational & Sequential Circuits)",
              "Computer Organization & Architecture (Pipelining, Memory Hierarchy, Cache, I/O)",
              "Discrete Mathematics (Set Theory, Relations, Functions, Graph Theory, Combinatorics)",
              "Programming & Data Structures in C", "Software Engineering (SDLC, Testing, UML)"
            ],
          },
          {
            id: "gate-aptitude",
            name: "General Aptitude",
            icon: "🧠",
            topics: [
              "Verbal Ability (Grammar, Sentence Completion, Antonyms, Synonyms)",
              "Reading Comprehension", "Critical Reasoning",
              "Numerical Ability (Percentages, Ratios, Speed-Time-Distance, Profit-Loss)",
              "Data Interpretation (Tables, Graphs, Charts)",
              "Analytical Aptitude", "Spatial Aptitude (Visualization, Shape matching)",
              "Logical Reasoning (Syllogisms, Puzzles, Venn diagrams)"
            ],
          },
          {
            id: "gate-engineering-math",
            name: "Engineering Mathematics",
            icon: "📊",
            topics: [
              "Linear Algebra (Matrices, Determinants, Eigenvalues, Vector spaces)",
              "Calculus (Limits, Continuity, Differentiation, Integration, Multivariable calculus)",
              "Probability & Statistics (Random variables, Distributions, Mean, Variance, Hypothesis testing)",
              "Differential Equations (First & Second order, Linear equations)",
              "Complex Analysis (Complex numbers, Analytic functions, Cauchy theorem)",
              "Numerical Methods (Root finding, Interpolation, Integration, Differential equations)",
              "Graph Theory (Connectivity, Spanning trees, Shortest paths)",
              "Transform Theory (Fourier, Laplace, Z-transforms)"
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
              "Mechanics (Kinematics, Laws of Motion, Work Energy Power, Rotational Motion)",
              "Thermodynamics (Laws, Heat Transfer, Kinetic Theory of Gases)",
              "Electrostatics (Coulomb's Law, Electric Field, Potential, Capacitance)",
              "Current Electricity (Ohm's Law, Kirchhoff's Laws, Circuits, Meters)",
              "Magnetism & Magnetic Effects of Current (Biot-Savart, Ampere's Law)",
              "Electromagnetic Induction (Faraday's Law, Lenz's Law, AC circuits)",
              "Optics (Ray Optics - Reflection, Refraction, Lenses; Wave Optics - Interference, Diffraction)",
              "Modern Physics (Photoelectric Effect, Bohr's Model, Radioactivity, Nuclear Physics)",
              "Waves & Oscillations (SHM, Wave motion, Sound waves)",
              "Gravitation (Universal law, Planetary motion, Satellites)",
              "Properties of Matter (Elasticity, Viscosity, Surface Tension)",
              "Semiconductors & Communication (Diodes, Transistors, Logic gates)"
            ],
          },
          {
            id: "neet-chemistry",
            name: "Chemistry",
            icon: "🧪",
            topics: [
              "Physical Chemistry (Atomic Structure, Chemical Bonding, Thermodynamics, Equilibrium, Electrochemistry, Chemical Kinetics, Surface Chemistry, Solutions, Solid State)",
              "Inorganic Chemistry (Periodic Table, Hydrogen, s-Block Elements, p-Block Elements, d & f-Block Elements, Coordination Compounds, Environmental Chemistry)",
              "Organic Chemistry (Basic concepts, Hydrocarbons - Alkanes, Alkenes, Alkynes, Aromatic; Haloalkanes & Haloarenes, Alcohols Phenols Ethers, Aldehydes Ketones Carboxylic acids, Amines, Biomolecules - Carbohydrates Proteins Nucleic acids, Polymers, Chemistry in Everyday Life)",
              "Redox Reactions & Stoichiometry", "States of Matter (Gas, Liquid, Solid)",
              "Purification & Characterisation of Organic Compounds",
              "Some Basic Principles of Organic Chemistry (Nomenclature, Isomerism, Electronic effects)"
            ],
          },
          {
            id: "neet-biology",
            name: "Biology (Botany & Zoology)",
            icon: "🧬",
            topics: [
              "Diversity in Living World (Classification, Taxonomy, Plant Kingdom, Animal Kingdom)",
              "Cell: Structure & Function (Cell theory, Biomolecules, Cell organelles, Cell division)",
              "Plant Physiology (Transport, Mineral Nutrition, Photosynthesis, Respiration, Plant Growth)",
              "Human Physiology (Digestion, Breathing, Circulation, Excretion, Locomotion, Neural control, Chemical coordination)",
              "Reproduction (Reproduction in organisms, Sexual reproduction in plants & animals, Human reproduction, Reproductive health)",
              "Genetics & Evolution (Heredity, Molecular basis of inheritance, Principles of inheritance, Evolution)",
              "Biotechnology (Principles, Applications in health & agriculture, GMO)",
              "Ecology & Environment (Organisms & populations, Ecosystem, Biodiversity, Environmental issues)",
              "Structural Organisation (Morphology of flowering plants, Anatomy, Animal tissues)",
              "Body Fluids & Circulation", "Excretory products & elimination",
              "Locomotion & Movement", "Neural control & coordination",
              "Chemical coordination & integration", "Immune System"
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
            name: "Pre-Clinical Sciences",
            icon: "🔬",
            topics: [
              "Anatomy (Gross anatomy, Histology, Embryology, Neuroanatomy)",
              "Physiology (General physiology, Cardiovascular, Respiratory, Renal, Neurophysiology, Endocrine)",
              "Biochemistry (Clinical biochemistry, Metabolism, Molecular biology, Nutrition)",
              "Pathology (General pathology, Systemic pathology, Clinical pathology, Hematology)",
              "Microbiology (Bacteriology, Virology, Mycology, Parasitology, Immunology)",
              "Pharmacology (General pharmacology, Systemic pharmacology, Toxicology, Clinical pharmacology)"
            ],
          },
          {
            id: "neet-pg-clinical",
            name: "Clinical Sciences",
            icon: "🏨",
            topics: [
              "General Medicine (Cardiology, Respiratory, Gastroenterology, Nephrology, Endocrinology, Infectious diseases)",
              "General Surgery (Principles, GI surgery, Trauma, Urology, Vascular surgery)",
              "Obstetrics & Gynecology (Obstetrics, High-risk pregnancy, Gynecological disorders, Contraception)",
              "Pediatrics (Neonatology, Growth & development, Common pediatric disorders, Immunization)",
              "Orthopedics (Fractures, Joint disorders, Bone infections, Trauma)",
              "Ophthalmology (Refraction, Eye diseases, Ocular emergencies)",
              "ENT (Ear diseases, Nose & sinus disorders, Throat conditions, Head & neck)",
              "Dermatology (Skin infections, Inflammatory conditions, STDs)",
              "Psychiatry (Psychotic disorders, Mood disorders, Anxiety, Substance abuse)",
              "Radiology (X-ray interpretation, CT, MRI, Ultrasound)",
              "Anesthesia (General anesthesia, Regional anesthesia, Pain management, ICU)",
              "Forensic Medicine & Toxicology (Medical jurisprudence, Post-mortem, Toxicology)",
              "Community Medicine (Epidemiology, Public health, Vital statistics, Health programs)",
              "Preventive & Social Medicine"
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
            name: "Indian Polity & Governance",
            icon: "📜",
            topics: [
              "Constitution of India (Historical background, Preamble, Salient features)",
              "Fundamental Rights, Duties & Directive Principles",
              "Union Government (President, Prime Minister, Council of Ministers, Parliament - Lok Sabha & Rajya Sabha)",
              "State Government (Governor, Chief Minister, State Legislature)",
              "Judiciary (Supreme Court, High Courts, Subordinate courts, Judicial review)",
              "Federalism & Centre-State Relations", "Local Governance (Panchayati Raj, Municipalities)",
              "Constitutional Bodies (Election Commission, CAG, UPSC, Finance Commission)",
              "Statutory Bodies (NHRC, CIC, Lokpal)", "Emergency Provisions",
              "Amendment Process", "Schedules of Constitution",
              "Constitutional Developments & Landmark Judgements"
            ],
          },
          {
            id: "upsc-history",
            name: "Indian History & Culture",
            icon: "📚",
            topics: [
              "Ancient India (Indus Valley, Vedic period, Mauryas, Guptas, South Indian kingdoms)",
              "Medieval India (Delhi Sultanate, Mughal Empire, Vijayanagara, Bhakti & Sufi movements)",
              "Modern India (British expansion, 1857 Revolt, Social reform movements, Indian National Movement)",
              "Freedom Struggle (Gandhi, Extremists, Revolutionary movements, Quit India)",
              "Post-Independence India (Integration, Reorganization, Five Year Plans)",
              "World History (Industrial revolution, World Wars, Cold War, Decolonization)",
              "Art & Culture (Architecture, Sculptures, Paintings, Music, Dance, Literature)",
              "UNESCO World Heritage Sites in India"
            ],
          },
          {
            id: "upsc-geography",
            name: "Geography",
            icon: "🌍",
            topics: [
              "Physical Geography (Earth, Landforms, Climate, Vegetation, Soils)",
              "Indian Geography (Physical features - Himalayas, Rivers, Plateaus, Coasts)",
              "Indian Climate (Monsoon, Seasons, Climate zones)",
              "Natural Resources (Minerals, Energy resources, Water, Forests)",
              "Agriculture in India (Cropping patterns, Green revolution, Issues)",
              "Industries & Infrastructure (Types, Location, Transport, Energy)",
              "World Geography (Continents, Oceans, Major geographical phenomena)",
              "Climatology & Oceanography", "Environmental Geography",
              "Disaster Management (Types, Mitigation, National Disaster Management Authority)"
            ],
          },
          {
            id: "upsc-economy",
            name: "Indian Economy",
            icon: "💰",
            topics: [
              "Indian Economy Basics (Sectors, Economic indicators, National income)",
              "Economic Planning (Five Year Plans, NITI Aayog)", "Indian Budget (Components, Budget process)",
              "Banking & Finance (RBI, Commercial banks, Payment systems, Financial inclusion)",
              "Fiscal Policy & Monetary Policy", "Taxation (Direct & Indirect, GST)",
              "Agriculture Economics (Land reforms, Pricing, MSP, Food security)",
              "Industrial Policy (Public sector, Privatization, FDI, SEZs)",
              "International Trade (Balance of Payments, WTO, Trade agreements)",
              "Poverty & Unemployment (Measurement, Government schemes)",
              "Economic Reforms (1991 reforms, Liberalization, Privatization, Globalization)",
              "GDP, GNP, Inflation, Fiscal deficit"
            ],
          },
          {
            id: "upsc-science",
            name: "Science & Technology",
            icon: "🔬",
            topics: [
              "General Science (Physics, Chemistry, Biology basics)",
              "Space Technology (ISRO missions, Satellites, Space exploration)",
              "Defence Technology (Missiles, Aircraft, Naval systems)",
              "Biotechnology & Genetic Engineering", "Nuclear Technology (Nuclear power, NPT)",
              "Information Technology (AI, Machine Learning, Blockchain, Cyber security)",
              "Health & Medicine (Diseases, Vaccines, Healthcare initiatives)",
              "Agriculture Technology (GM crops, Precision farming)",
              "Environment & Ecology (Climate change, Biodiversity, Pollution, Conservation)",
              "Nanotechnology", "Renewable Energy (Solar, Wind, Bio-energy)",
              "Scientific Research & Developments"
            ],
          },
          {
            id: "upsc-current",
            name: "Current Affairs & General Studies",
            icon: "📰",
            topics: [
              "National Affairs (Government schemes, Policy changes, Political developments)",
              "International Relations (India's foreign policy, Bilateral relations, International organizations - UN, WTO, IMF)",
              "Economy Current Affairs (Budget highlights, Economic survey, Major economic events)",
              "Science & Technology Updates", "Environmental Issues & Summits",
              "Social Issues (Education, Health, Gender, Poverty)", "Internal Security (Terrorism, Naxalism, Border management)",
              "Awards & Honours (Nobel, Padma, International awards)",
              "Sports Events (Olympics, Commonwealth, Asian Games)",
              "Books & Authors", "Important Days & Events",
              "Government Schemes & Programs"
            ],
          },
          {
            id: "upsc-ethics",
            name: "Ethics, Integrity & Aptitude",
            icon: "⚖️",
            topics: [
              "Ethics & Human Values", "Attitude, Aptitude & Civil Service Values",
              "Emotional Intelligence", "Integrity & Probity in Public Life",
              "Ethics in Governance", "Case Studies on Ethics"
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
            name: "Quantitative Aptitude & Data Interpretation",
            icon: "🔢",
            topics: [
              "Number Systems (HCF, LCM, Divisibility)", "Simplification and Approximation",
              "Average", "Percentage", "Ratio and Proportion",
              "Profit, Loss and Discount", "Simple Interest and Compound Interest",
              "Time and Work (Pipes & Cisterns)", "Time, Speed and Distance (Boats & Streams, Trains)",
              "Problems on Ages", "Mensuration (Area, Perimeter, Volume)",
              "Data Interpretation (Tables, Bar, Line, Pie Charts, Mixed Graphs)",
              "Number Series", "Quadratic Equations", "Permutation and Combination",
              "Probability", "Partnership", "Mixture and Alligation", "Data Sufficiency"
            ],
          },
          {
            id: "sbi-reasoning",
            name: "Reasoning Ability & Computer Aptitude",
            icon: "🧩",
            topics: [
              "Seating Arrangement (Linear, Circular, Complex)", "Puzzles (Floor-based, Box-based)",
              "Syllogism (Advanced)", "Coding-Decoding", "Blood Relations",
              "Inequality (Complex chained)", "Direction Sense",
              "Order and Ranking", "Machine Input-Output", "Data Sufficiency",
              "Logical Reasoning", "Critical Reasoning", "Statement-Conclusion",
              "Computer Fundamentals", "MS Office", "Internet & Networking",
              "Computer Security", "Operating Systems basics"
            ],
          },
          {
            id: "sbi-english",
            name: "English Language",
            icon: "📝",
            topics: [
              "Reading Comprehension (Complex passages)", "Cloze Test",
              "Fill in the Blanks (Multiple blanks)", "Para Jumbles",
              "Error Spotting (Grammatical)", "Sentence Correction/Improvement",
              "Phrase Replacement", "Vocabulary (Synonyms, Antonyms)",
              "Idioms and Phrases", "One Word Substitution",
              "Grammar (Tenses, Articles, Prepositions)", "Sentence Connectors",
              "Essay Writing", "Letter Writing", "Precis Writing"
            ],
          },
          {
            id: "sbi-ga",
            name: "Banking & General Awareness",
            icon: "🌐",
            topics: [
              "Banking System Overview", "RBI Functions & Monetary Policy",
              "Banking Terms and Products", "Types of Banks (PSU, Private, Payment Banks)",
              "Digital Banking (UPI, NEFT, RTGS, IMPS)", "Financial Inclusion",
              "NBFCs", "Basel Norms", "NPA (Non-Performing Assets)",
              "Indian Economy", "Union Budget", "GDP, Inflation, Fiscal Policy",
              "Current Affairs (Last 6 months)", "Static GK", "Awards and Honours",
              "Government Schemes", "International Organizations", "Sports Events"
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
            name: "Quantitative Aptitude & Data Interpretation",
            icon: "🔢",
            topics: [
              "Number Systems (HCF, LCM, Divisibility)", "Simplification (BODMAS, Approximation)",
              "Average", "Percentage", "Ratio and Proportion",
              "Profit, Loss and Discount", "Simple Interest and Compound Interest",
              "Time and Work (Pipes & Cisterns)", "Time, Speed and Distance (Boats & Streams)",
              "Problems on Ages", "Mensuration", "Quadratic Equations",
              "Data Interpretation (Tables, Bar, Line, Pie Charts)", "Number Series",
              "Permutation and Combination", "Probability", "Partnership",
              "Mixture and Alligation", "Data Sufficiency"
            ],
          },
          {
            id: "ibps-reasoning",
            name: "Reasoning Ability",
            icon: "🧩",
            topics: [
              "Seating Arrangement (Linear, Circular, Square, Schedule-based)",
              "Puzzle (Floor-based, Box-based, Designation-based)",
              "Syllogism (Advanced patterns)", "Inequality (Complex chained)",
              "Blood Relations (Complex family trees)", "Direction Sense",
              "Order and Ranking", "Coding-Decoding", "Alphanumeric Series",
              "Input-Output (Complex patterns)", "Data Sufficiency",
              "Logical Reasoning", "Statement-Conclusion", "Statement-Assumption"
            ],
          },
          {
            id: "ibps-english",
            name: "English Language",
            icon: "📝",
            topics: [
              "Reading Comprehension (Complex passages)", "Cloze Test (Advanced)",
              "Fill in the Blanks", "Para Jumbles (Sentence Rearrangement)",
              "Phrase Replacement/Sentence Correction", "Error Spotting",
              "Sentence Improvement", "Synonyms and Antonyms",
              "Idioms and Phrases", "One Word Substitution",
              "Vocabulary", "Grammar (Tenses, Articles, Prepositions)",
              "Sentence Connectors", "Column Match", "Essay Writing", "Letter Writing"
            ],
          },
          {
            id: "ibps-computer",
            name: "Computer Aptitude",
            icon: "💻",
            topics: [
              "Computer Fundamentals", "Hardware and Software",
              "Input/Output Devices", "Memory (RAM, ROM, Cache)",
              "Operating Systems (Windows, Linux basics)", "MS Office (Word, Excel, PowerPoint)",
              "Internet and Networking (LAN, WAN, VPN, Protocols)",
              "Database Management (DBMS basics, SQL)", "Computer Security (Virus, Firewall)",
              "Number Systems (Binary, Octal, Hexadecimal)", "Internet Terminology (HTTP, FTP, URL)",
              "Cloud Computing basics", "Cyber Security"
            ],
          },
          {
            id: "ibps-ga",
            name: "Banking & General Awareness",
            icon: "🌐",
            topics: [
              "Indian Banking System", "RBI Functions & Policies",
              "Banking Terms and Definitions", "Types of Banks (PSU, Private, Foreign)",
              "Banking Products (Loans, Deposits, Cards)", "Digital Banking (UPI, NEFT, RTGS, IMPS)",
              "Payment Banks & Small Finance Banks", "NBFCs", "Basel Norms",
              "NPA (Non-Performing Assets)", "Monetary Policy & Fiscal Policy",
              "Indian Economy Overview", "Union Budget", "GDP, GNP, Inflation",
              "Current Affairs (Last 6 months)", "Static GK", "Awards and Honours",
              "Sports", "Important Days", "Financial Awareness"
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
              "Number Systems", "Simplification (BODMAS, Approximation)",
              "Average", "Percentage", "Ratio and Proportion",
              "Profit and Loss", "Simple Interest and Compound Interest",
              "Time and Work", "Time, Speed and Distance",
              "Problems on Ages", "Number Series", "Data Interpretation (Tables, Charts)",
              "Mensuration basics", "Mixture and Alligation"
            ],
          },
          {
            id: "ibps-clerk-reasoning",
            name: "Reasoning Ability",
            icon: "🧩",
            topics: [
              "Syllogism", "Coding-Decoding", "Blood Relations",
              "Seating Arrangement (Linear, Circular)", "Puzzles (Basic)",
              "Inequality", "Alphabet Test", "Direction Sense",
              "Order and Ranking", "Input-Output", "Data Sufficiency",
              "Analogies", "Classification", "Series"
            ],
          },
          {
            id: "ibps-clerk-english",
            name: "English Language",
            icon: "📝",
            topics: [
              "Reading Comprehension", "Cloze Test",
              "Fill in the Blanks", "Error Spotting",
              "Sentence Improvement", "Sentence Rearrangement",
              "Vocabulary (Synonyms, Antonyms)", "Idioms and Phrases",
              "Grammar basics", "Spelling Errors"
            ],
          },
          {
            id: "ibps-clerk-computer",
            name: "Computer Knowledge",
            icon: "💻",
            topics: [
              "Computer Fundamentals", "Hardware and Software basics",
              "Input/Output Devices", "Memory types", "MS Office basics",
              "Internet basics", "Computer Security", "Operating Systems basics",
              "Networking basics", "Email and Web browsing"
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
              "RBI Functions & Organization", "Monetary Policy & Tools",
              "Banking Regulation & Supervision", "Financial Markets (Money, Capital, Forex)",
              "Economic Survey", "Union Budget", "International Finance & Organizations",
              "Indian Economy (GDP, Inflation, Fiscal Policy)", "Current Affairs (National & International)",
              "Banking Sector Developments", "Payment Systems", "Financial Inclusion",
              "Basel Norms", "NPA Management", "Government Schemes"
            ],
          },
          {
            id: "rbi-quant",
            name: "Quantitative Aptitude",
            icon: "🔢",
            topics: [
              "Data Interpretation (Advanced - Tables, Charts, Graphs, Caselet)",
              "Number Series (Complex patterns)", "Quadratic Equations",
              "Simplification and Approximation", "Percentage and Its Applications",
              "Profit, Loss and Discount", "Simple Interest and Compound Interest",
              "Time and Work", "Time, Speed and Distance", "Average",
              "Ratio and Proportion", "Mensuration", "Probability"
            ],
          },
          {
            id: "rbi-reasoning",
            name: "Reasoning Ability",
            icon: "🧩",
            topics: [
              "Analytical Reasoning (Complex)", "Puzzles (Multi-layered)",
              "Syllogism (Advanced)", "Coding-Decoding (Complex patterns)",
              "Seating Arrangement (Multi-variable)", "Blood Relations (Complex family trees)",
              "Data Sufficiency (Advanced)", "Critical Reasoning",
              "Inequality (Complex chained)", "Input-Output (Advanced patterns)",
              "Direction Sense", "Statement-Conclusion", "Logical Deduction"
            ],
          },
          {
            id: "rbi-english",
            name: "English Language",
            icon: "📝",
            topics: [
              "Reading Comprehension (Complex, lengthy passages)", "Grammar (Advanced)",
              "Vocabulary (Synonyms, Antonyms, Contextual usage)", "Error Spotting",
              "Sentence Correction", "Para Jumbles", "Fill in the Blanks",
              "Cloze Test", "Idioms and Phrases", "One Word Substitution",
              "Essay Writing (250-300 words)", "Precis Writing",
              "Letter Writing (Official correspondence)"
            ],
          },
          {
            id: "rbi-esi",
            name: "Economic & Social Issues",
            icon: "📊",
            topics: [
              "Indian Economy Overview", "Economic Reforms in India",
              "Poverty & Unemployment", "Social Justice & Governance",
              "Sustainable Development", "Infrastructure Development",
              "Human Development Index", "Income Inequality",
              "Agricultural Economics", "Industrial Policy", "Trade Policy"
            ],
          },
          {
            id: "rbi-finance",
            name: "Finance & Management",
            icon: "💼",
            topics: [
              "Financial Management", "Cost Accounting", "Management Accounting",
              "Corporate Finance", "Financial Analysis", "Working Capital Management",
              "Capital Budgeting", "Risk Management", "Financial Markets",
              "Organizational Behavior", "HRM basics", "Marketing Management basics"
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
              "Number System (HCF, LCM, Divisibility, Remainders)", "Percentage and Its Applications",
              "Ratio and Proportion", "Profit, Loss and Discount",
              "Simple Interest and Compound Interest", "Time and Work (Pipes & Cisterns)",
              "Time, Speed and Distance (Trains, Boats & Streams)", "Average and Weighted Average",
              "Algebra (Linear equations, Quadratic equations)", "Geometry (Lines, Angles, Triangles, Circles)",
              "Trigonometry (Heights & Distances, Identities)", "Mensuration (Area, Perimeter, Volume)",
              "Data Interpretation (Tables, Bar, Line, Pie Charts)",
              "Statistics (Mean, Median, Mode, Frequency Distribution)",
              "Permutation and Combination", "Probability"
            ],
          },
          {
            id: "ssc-reasoning",
            name: "General Intelligence & Reasoning",
            icon: "🧩",
            topics: [
              "Analogies (Verbal & Non-verbal)", "Classification (Odd One Out)",
              "Series (Number, Letter, Mixed)", "Coding-Decoding (Letter, Number, Substitution)",
              "Blood Relations", "Direction Sense and Distance",
              "Ranking and Order", "Venn Diagram", "Syllogism",
              "Statement and Conclusion", "Statement and Assumption",
              "Matrix (Missing Character)", "Word Formation",
              "Mirror Image and Water Image", "Paper Folding and Cutting",
              "Embedded Figures", "Figure Completion", "Cube and Dice",
              "Counting Figures"
            ],
          },
          {
            id: "ssc-english",
            name: "English Language & Comprehension",
            icon: "📝",
            topics: [
              "Reading Comprehension (Multiple passages)", "Error Spotting (Grammatical errors)",
              "Fill in the Blanks (Grammar & Vocabulary)", "Synonyms and Antonyms",
              "Idioms and Phrases", "One Word Substitution",
              "Sentence Improvement", "Active and Passive Voice",
              "Direct and Indirect Speech", "Cloze Test",
              "Sentence Rearrangement", "Spelling Correction",
              "Para Jumbles", "Phrase Replacement"
            ],
          },
          {
            id: "ssc-gk",
            name: "General Awareness",
            icon: "🌐",
            topics: [
              "Indian History (Ancient, Medieval, Modern)", "Indian Geography (Physical, Economic)",
              "Indian Polity & Constitution", "Indian Economy & Budget",
              "General Science (Physics, Chemistry, Biology)", "Current Affairs (National & International)",
              "Static GK (Books, Authors, Awards, Sports)", "Science & Technology",
              "Environment & Ecology", "Art & Culture",
              "International Organizations", "Computer Fundamentals",
              "Indian National Movement", "Important Days & Events"
            ],
          },
          {
            id: "ssc-statistics",
            name: "Statistics (Tier-II for Statistical Investigator)",
            icon: "📊",
            topics: [
              "Collection & Presentation of Data", "Measures of Central Tendency",
              "Measures of Dispersion", "Correlation & Regression",
              "Probability Theory", "Random Variables", "Sampling Theory",
              "Statistical Inference", "Index Numbers", "Time Series Analysis"
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
              "Number Systems (HCF, LCM, Divisibility)", "Simplification (BODMAS, Decimals, Fractions)",
              "Average", "Percentage", "Ratio and Proportion",
              "Profit, Loss and Discount", "Simple Interest and Compound Interest",
              "Time and Work (Pipes & Cisterns)", "Time, Speed and Distance (Trains, Boats & Streams)",
              "Problems on Ages", "Mensuration (Area, Volume, Perimeter)",
              "Geometry (Lines, Angles, Triangles, Circles)", "Trigonometry (Basic identities, Heights & Distances)",
              "Algebra (Linear Equations, Polynomials)", "Data Interpretation (Tables, Bar, Line, Pie Charts)",
              "Number Series", "Permutation and Combination", "Probability",
              "Partnership", "Mixture and Alligation"
            ],
          },
          {
            id: "ssc-chsl-reasoning",
            name: "General Intelligence & Reasoning",
            icon: "🧩",
            topics: [
              "Analogies (Verbal & Non-verbal)", "Classification (Odd One Out)",
              "Series Completion (Number, Letter, Figure)", "Coding-Decoding (Letter, Number, Substitution)",
              "Blood Relations", "Direction Sense Test", "Ranking & Time Sequence",
              "Mathematical Operations", "Arithmetical Reasoning", "Syllogism",
              "Statement and Conclusions", "Statement and Arguments", "Statement and Assumptions",
              "Venn Diagrams", "Alphabet Test & Number Ranking",
              "Mirror Images & Water Images", "Paper Folding & Cutting",
              "Embedded Figures", "Figure Matrix", "Cube & Dice",
              "Counting Figures", "Missing Number"
            ],
          },
          {
            id: "ssc-chsl-english",
            name: "English Language & Comprehension",
            icon: "📝",
            topics: [
              "Reading Comprehension (Passages)", "Error Spotting (Grammatical errors)",
              "Fill in the Blanks (Grammar & Vocabulary)", "Synonyms and Antonyms",
              "Idioms and Phrases", "One Word Substitution",
              "Sentence Improvement", "Active and Passive Voice",
              "Direct and Indirect Speech", "Cloze Test",
              "Sentence Rearrangement", "Spelling Correction",
              "Para Jumbles", "Parts of Speech", "Tenses",
              "Articles (A, An, The)", "Prepositions", "Conjunctions"
            ],
          },
          {
            id: "ssc-chsl-gk",
            name: "General Awareness",
            icon: "🌐",
            topics: [
              "Indian History (Ancient, Medieval, Modern, Freedom Struggle)",
              "Indian Geography (Physical, Economic, Indian States & UTs)",
              "Indian Polity & Constitution (Fundamental Rights, DPSPs, Parliament)",
              "Indian Economy (Budget, Five Year Plans, Banking, Currency)",
              "General Science (Physics - Laws, Motion, Energy; Chemistry - Elements, Reactions; Biology - Human body, Plants)",
              "Current Affairs (National & International events, last 6 months)",
              "Static GK (Books & Authors, Awards, Sports, Capitals, Important Days)",
              "Science & Technology (Space, IT, Defense)", "Environment & Ecology",
              "Art & Culture (Dances, Music, Monuments)", "International Organizations (UN, WHO, WTO)",
              "Computer Fundamentals (Hardware, Software, Internet)", "Famous Personalities"
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
            name: "English Language & Comprehension",
            icon: "📝",
            topics: [
              "Reading Comprehension (Passages from contemporary & classical fiction, Non-fiction)",
              "Grammar (Parts of speech, Tenses, Voice, Subject-verb agreement)",
              "Vocabulary (Synonyms, Antonyms, Contextual meaning)", "Inference from passages",
              "Critical Reasoning based on passages", "Sentence Correction & Improvement",
              "Fill in the Blanks", "Para Jumbles", "Fact vs Opinion"
            ],
          },
          {
            id: "clat-gk",
            name: "General Knowledge & Current Affairs",
            icon: "🌐",
            topics: [
              "Current Affairs (National & International events, last 12-18 months)",
              "Static GK (Important events in history, Geography, Economics, Polity)",
              "Legal Current Affairs (Landmark judgments, New laws, Legal reforms)",
              "Awards & Honours (National & International)", "International Events & Organizations (UN, WHO, WTO)",
              "Books & Authors (Recent publications)", "Sports Events & Achievements",
              "Government Policies & Schemes", "Science & Technology Developments",
              "Art & Culture", "Environmental Issues"
            ],
          },
          {
            id: "clat-legal",
            name: "Legal Reasoning",
            icon: "📜",
            topics: [
              "Legal Principles & their Application", "Legal Maxims (Latin maxims)",
              "Constitutional Law Basics (Fundamental Rights, DPSPs, Judiciary)",
              "Criminal Law Basics (IPC provisions, Crimes, Punishment)",
              "Contract Law Basics (Agreement, Consideration, Breach)",
              "Tort Law Basics (Negligence, Nuisance, Defamation)",
              "Legal Logical Reasoning (Applying principles to factual situations)",
              "Case-based Reasoning", "Legal Fact Scenarios"
            ],
          },
          {
            id: "clat-logical",
            name: "Logical Reasoning",
            icon: "🧩",
            topics: [
              "Syllogism (Categorical, Venn diagrams)", "Analogies (Word, Number, Letter)",
              "Logical Sequences & Series", "Blood Relations (Family trees)",
              "Direction Sense & Distance", "Coding-Decoding",
              "Assumptions, Conclusions & Inferences", "Cause & Effect",
              "Statement & Arguments", "Critical Reasoning",
              "Seating Arrangement (Linear, Circular)", "Puzzles & Games",
              "Calendar & Clock problems", "Binary Logic"
            ],
          },
          {
            id: "clat-quant",
            name: "Quantitative Techniques",
            icon: "🔢",
            topics: [
              "Number System (HCF, LCM, Divisibility, Factors)", "Percentage & Applications",
              "Ratio, Proportion & Variation", "Average (Simple, Weighted)",
              "Profit, Loss & Discount", "Simple Interest & Compound Interest",
              "Time, Speed & Distance (Trains, Boats)", "Time & Work",
              "Data Interpretation (Tables, Bar, Line, Pie charts)", "Algebra (Linear equations)",
              "Geometry (Triangles, Circles, Quadrilaterals)", "Mensuration (Area, Volume)",
              "Probability (Basic)", "Permutation & Combination"
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
            name: "Quantitative Aptitude (QA)",
            icon: "🔢",
            topics: [
              "Number System (Properties, HCF, LCM, Remainders, Divisibility, Base system)",
              "Algebra (Linear & Quadratic equations, Inequalities, Functions, Polynomials, Progressions - AP, GP, HP)",
              "Geometry (Triangles, Circles, Quadrilaterals, Coordinate geometry, Mensuration 2D & 3D)",
              "Arithmetic (Percentages, Profit & Loss, Ratio & Proportion, Mixtures & Alligations, Time-Speed-Distance, Time & Work, Averages, Simple & Compound Interest)",
              "Modern Mathematics (Permutation & Combination, Probability, Set Theory, Venn diagrams)",
              "Trigonometry (Ratios, Identities, Heights & Distances)", "Logarithms",
              "Mensuration (Area, Volume, Surface area)", "Special Numbers (Surds, Indices)"
            ],
          },
          {
            id: "cat-varc",
            name: "Verbal Ability & Reading Comprehension (VARC)",
            icon: "📝",
            topics: [
              "Reading Comprehension (Long passages from diverse topics - Economics, Philosophy, Science, Literature)",
              "Para Jumbles (Arranging 4-5 sentences in logical order)",
              "Para Summary (Choosing best summary for a given paragraph)",
              "Odd One Out (Identifying sentence that doesn't fit)",
              "Sentence Completion & Fill in the Blanks",
              "Critical Reasoning (Inference, Assumption, Strengthen/Weaken arguments)",
              "Vocabulary in Context (Understanding word meaning from passage)",
              "Paragraph Completion", "Fact-Inference-Judgement"
            ],
          },
          {
            id: "cat-dilr",
            name: "Data Interpretation & Logical Reasoning (DILR)",
            icon: "📊",
            topics: [
              "Data Interpretation (Tables - Complex multi-row/column, Bar Graphs - Stacked/Grouped, Line Graphs - Multiple lines, Pie Charts, Caselets - Paragraph based data)",
              "Data Sufficiency", "Data Comparison & Calculation",
              "Logical Reasoning (Seating Arrangement - Linear/Circular/Complex, Puzzles - Grid/Floor/Team based, Binary Logic - Truth/Lies)",
              "Games & Tournaments", "Blood Relations (Complex)",
              "Network Diagrams & Routes", "Venn Diagrams (3-4 sets)",
              "Scheduling Problems", "Coding-Decoding patterns",
              "Syllogisms", "Set-based Reasoning"
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
              "Reading Comprehension (Long passages from diverse topics)",
              "Vocabulary (Synonyms, Antonyms, Contextual usage)", "Grammar (Sentence correction, Error identification)",
              "Para Jumbles (Rearranging sentences)", "Fill in the Blanks",
              "Critical Reasoning (Assumptions, Inferences, Strengthening/Weakening arguments)",
              "Analogies (Word relationships)", "Sentence Completion"
            ],
          },
          {
            id: "xat-decision",
            name: "Decision Making",
            icon: "🤔",
            topics: [
              "Ethical Dilemmas (Moral & ethical choices in given scenarios)",
              "Business Situations (Decision-making in corporate context)",
              "Analytical Reasoning (Analyzing complex situations)",
              "Situational Judgement (Best course of action in given situations)",
              "Data-Based Decision Making (Using given data to make decisions)",
              "Trade-off Analysis", "Risk Assessment scenarios"
            ],
          },
          {
            id: "xat-quant",
            name: "Quantitative Ability & Data Interpretation",
            icon: "🔢",
            topics: [
              "Arithmetic (Percentages, Profit & Loss, Ratio & Proportion, Time-Speed-Distance, Time & Work, Simple & Compound Interest, Averages, Mixtures & Alligations)",
              "Algebra (Linear equations, Quadratic equations, Inequalities, Functions, Logarithms, Progressions)",
              "Geometry (Triangles, Circles, Quadrilaterals, Mensuration 2D & 3D, Coordinate geometry)",
              "Number System (Properties, HCF, LCM, Divisibility, Remainders)",
              "Data Interpretation (Tables, Bar graphs, Line graphs, Pie charts, Caselets, Data Sufficiency)",
              "Probability (Basic probability, Conditional probability)",
              "Permutation & Combination", "Set Theory"
            ],
          },
          {
            id: "xat-gk",
            name: "General Knowledge",
            icon: "🌐",
            topics: [
              "Current Affairs (National & International, last 12 months)",
              "Business & Economy (Major business events, Companies, Mergers)",
              "Awards & Honors", "Sports Events", "Books & Authors",
              "Science & Technology", "Government Policies & Schemes",
              "International Relations"
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
              "Algebra (Complex Numbers, Quadratic Equations, Logarithms, AP, GP, HP)",
              "Matrices and Determinants (Types, Properties, Operations, Inverse)",
              "Trigonometry (Ratios, Identities, Heights & Distances, Inverse Functions)",
              "Analytical Geometry (2D: Lines, Circles, Parabola, Ellipse, Hyperbola; 3D: Direction Cosines, Lines, Planes)",
              "Differential Calculus (Limits, Continuity, Derivatives, Maxima & Minima)",
              "Integral Calculus (Integration techniques, Definite Integrals, Area under curves)",
              "Differential Equations (First order, Linear equations)",
              "Vector Algebra (Addition, Scalar & Vector products)",
              "Statistics (Measures of Central Tendency, Dispersion)",
              "Probability (Basic probability, Conditional probability, Bayes theorem)",
              "Sets, Relations and Functions", "Binomial Theorem", "Permutation and Combination"
            ],
          },
          {
            id: "nda-gat",
            name: "General Ability Test",
            icon: "🧠",
            topics: [
              "English (Grammar, Vocabulary, Comprehension, Synonyms, Antonyms, Error Spotting)",
              "Physics (Physical quantities, Motion, Force, Work Energy Power, Gravitation, Properties of Matter, Heat, Light, Sound, Electricity, Magnetism, Modern Physics)",
              "Chemistry (Physical & Chemical changes, Elements Compounds Mixtures, Atomic Structure, Periodic Table, Chemical Bonding, Acids Bases Salts, Oxidation Reduction, Metals Non-metals, Carbon compounds)",
              "General Science (Scientific terms, Inventions, Discoveries, Diseases, Nutrition)",
              "History (Ancient India - Indus Valley, Vedic period; Medieval India - Delhi Sultanate, Mughal Empire; Modern India - British Rule, Freedom Movement)",
              "Geography (Earth - Solar system, Atmosphere, Hydrosphere, Lithosphere; Indian Geography - Physical features, Climate, Natural resources, Agriculture, Industries)",
              "Indian Polity & Constitution (Preamble, Fundamental Rights & Duties, Union & State Government, Parliament, Judiciary)",
              "Indian Economy (Planning, Budget, Banking, Currency, GST, Agriculture, Industry)",
              "Current Affairs (National & International events, Defence news, Awards, Sports)",
              "General Knowledge (Books & Authors, Famous Personalities, Important Days, UN & International Organizations)"
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
              "Reading Comprehension (Passages, Inference, Main idea)",
              "Grammar (Parts of Speech, Tenses, Articles, Prepositions, Conjunctions)",
              "Vocabulary (Synonyms, Antonyms, One-word Substitution)",
              "Sentence Correction & Improvement", "Error Spotting",
              "Ordering of Sentences & Para Jumbles", "Idioms and Phrases",
              "Fill in the Blanks", "Active & Passive Voice", "Direct & Indirect Speech",
              "Spotting Errors", "Cloze Test"
            ],
          },
          {
            id: "cds-gk",
            name: "General Knowledge",
            icon: "🌐",
            topics: [
              "Indian History (Ancient, Medieval, Modern, Freedom Struggle, Post-Independence)",
              "Geography (Indian & World - Physical, Economic, Climate, Resources)",
              "Indian Polity & Constitution (Preamble, Fundamental Rights & Duties, Parliament, Judiciary, President, PM)",
              "Indian Economy (Planning, Budget, Banking, Currency, Agriculture, Industry, Trade)",
              "General Science (Physics - Motion, Force, Energy, Light, Sound; Chemistry - Elements, Compounds, Reactions; Biology - Human body, Plants, Animals)",
              "Defence & Security (Indian Armed Forces, Defence organizations, Wars, Military operations)",
              "Current Affairs (National & International events, last 6-12 months)",
              "Sports (Major tournaments, Olympics, Asian Games, Commonwealth Games, Awards)",
              "Awards & Honors (Padma Awards, Bharat Ratna, Nobel Prize, Booker Prize)",
              "Books & Authors", "Famous Personalities", "Art & Culture",
              "International Organizations (UN, WHO, WTO, IMF, World Bank)",
              "Science & Technology (Space, IT, Defence technology)", "Environment & Ecology"
            ],
          },
          {
            id: "cds-maths",
            name: "Elementary Mathematics",
            icon: "🔢",
            topics: [
              "Number Systems (Natural, Whole, Integers, Rational, Real numbers)",
              "HCF and LCM (Finding HCF & LCM, Word problems)",
              "Fractions, Decimals and Percentages", "Percentage (Applications, Percentage change)",
              "Ratio and Proportion (Direct, Inverse, Continued proportion)",
              "Average (Simple average, Weighted average)", "Profit, Loss and Discount",
              "Simple Interest and Compound Interest", "Time and Work", "Time, Speed and Distance",
              "Algebra (Linear Equations, Simultaneous equations, Factorization, Polynomials)",
              "Geometry (Lines, Angles, Triangles, Quadrilaterals, Circles, Congruence, Similarity)",
              "Mensuration (Area and Perimeter of 2D figures, Volume and Surface Area of 3D figures)",
              "Trigonometry (Ratios, Identities, Heights and Distances)",
              "Statistics (Mean, Median, Mode, Bar graphs, Pie charts, Frequency distribution)",
              "Square roots and Cube roots", "Exponents and Powers"
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
            name: "Paper 1 (Teaching & Research Aptitude)",
            icon: "📝",
            topics: [
              "Teaching Aptitude (Teaching methods, Evaluation systems, Student-centered learning, Teaching-learning process)",
              "Research Methodology (Research types - Qualitative/Quantitative, Research design, Sampling, Hypothesis testing, Data collection methods, Research ethics, Thesis writing)",
              "Reading Comprehension (Understanding passages, Inference, Main idea, Summary)",
              "Communication (Verbal & Non-verbal, Barriers, Classroom communication, Effective communication)",
              "Mathematical Reasoning & Aptitude (Number series, Coding-decoding, Relationships, Venn diagrams)",
              "Logical Reasoning (Inductive & Deductive reasoning, Analogies, Syllogism, Statement-conclusion)",
              "Data Interpretation (Tables, Graphs, Charts - Bar, Pie, Line)",
              "Information & Communication Technology (ICT) (Computer basics, Internet, E-learning, Digital initiatives in education, Cyber security)",
              "People, Development & Environment (Sustainable development, Climate change, Pollution, Biodiversity, Environmental laws)",
              "Higher Education System (Institutions - UGC, NAAC, NIRF; NEP 2020, Governance, Quality initiatives)"
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
            name: "Child Development & Pedagogy (CDP)",
            icon: "👶",
            topics: [
              "Child Development (Principles, Stages - Infancy to adolescence, Factors affecting development)",
              "Learning Theories (Behaviorism, Cognitivism, Constructivism)",
              "Piaget's Theory (Stages of cognitive development)", "Vygotsky's Theory (Zone of proximal development, Scaffolding)",
              "Intelligence & Theories (Gardner's Multiple Intelligence, Emotional Intelligence)",
              "Inclusive Education (Children with special needs - Learning disabilities, ADHD, Giftedness; Inclusive classroom)",
              "Assessment & Evaluation (Types, CCE, Formative & Summative)",
              "Motivation & Learning (Intrinsic & Extrinsic motivation)", "Gender Issues in Education",
              "Individual Differences", "Socialization & Concept of Society"
            ],
          },
          {
            id: "ctet-maths",
            name: "Mathematics & Pedagogy",
            icon: "🔢",
            topics: [
              "Number System (Natural, Whole, Integers, Rational numbers, Operations)",
              "Geometry (Shapes, Lines, Angles, Triangles, Quadrilaterals, Circles, Symmetry)",
              "Algebra (Introduction to variables, Simple equations)",
              "Data Handling (Collection, Organization, Bar graphs, Pictographs, Pie charts)",
              "Measurement (Length, Weight, Capacity, Time, Money, Area, Perimeter)",
              "Fractions & Decimals", "Ratio & Proportion", "Percentage",
              "Mathematics Pedagogy (Nature of mathematics, Teaching-learning methods, Curriculum, Remedial teaching, Evaluation, NCF 2005 guidelines)"
            ],
          },
          {
            id: "ctet-science",
            name: "Science & Pedagogy (Environmental Studies)",
            icon: "🔬",
            topics: [
              "Food & Nutrition (Sources, Nutrients, Balanced diet, Food preservation, Diseases)",
              "Materials (Types, Properties, States of matter, Mixtures & Separation)",
              "Living World (Plants, Animals, Human body systems, Microorganisms)",
              "Moving Things (Motion, Force, Work & Energy, Simple machines)",
              "Natural Phenomena (Light, Sound, Rain, Thunder, Lightning)",
              "Natural Resources (Air, Water, Soil, Forests, Conservation)",
              "Environmental Studies Pedagogy (EVS concepts, Integrated approach, Teaching methods, Activities, Assessment, NCF 2005)"
            ],
          },
          {
            id: "ctet-english",
            name: "English Language & Pedagogy",
            icon: "📝",
            topics: [
              "Reading Comprehension (Unseen passages - Prose & Poetry, Inference, Vocabulary)",
              "Grammar (Parts of speech, Tenses, Articles, Prepositions, Voice, Modals, Sentence structure)",
              "Vocabulary (Synonyms, Antonyms, Phrasal verbs, Idioms)",
              "Language Pedagogy (Principles of language learning, Teaching methods, Listening-Speaking-Reading-Writing skills, Language assessment, Remedial teaching, Role of grammar)",
              "Comprehension strategies", "Teaching-Learning materials"
            ],
          },
          {
            id: "ctet-hindi",
            name: "Hindi Bhasha & Shikshan Vidhi",
            icon: "📖",
            topics: [
              "Apathit Gadyansh (Unseen prose comprehension)", "Apathit Padyansh (Unseen poetry)",
              "Vyakaran (Grammar - Sangya, Sarvanam, Visheshan, Kriya, Kaal, Vakya, Sandhi, Samas)",
              "Bhasha Shikshan Vidhi (Language teaching pedagogy, Teaching methods, Assessment)"
            ],
          },
          {
            id: "ctet-social",
            name: "Social Studies & Pedagogy",
            icon: "🌍",
            topics: [
              "History (Ancient, Medieval, Modern India, Freedom struggle)",
              "Geography (Earth, Solar system, Maps, Natural resources, Climate, India & World geography)",
              "Civics (Indian Constitution, Government, Democracy, Rights & Duties)",
              "Economics (Basic concepts, Money, Banking)",
              "Social Studies Pedagogy (Teaching methods, Projects, Inquiry-based learning, Assessment)"
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
              "Design History (Art movements, Design evolution)", "Art & Culture", "Famous Designers & Artists",
              "Current Affairs", "Environment & Social Awareness",
              "Indian Heritage & Craft traditions"
            ],
          },
          {
            id: "nid-analytical",
            name: "Analytical & Logical Reasoning",
            icon: "🧩",
            topics: [
              "Visual Reasoning & Perception", "Spatial Reasoning",
              "Pattern Recognition & Completion", "Analogies",
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
              "Quantitative Ability (Arithmetic, Data interpretation)", "Communication Ability (English comprehension, Grammar)",
              "Analytical Ability (Logical reasoning, Pattern recognition)", "English Comprehension",
              "General Knowledge (History, Geography, Current affairs)", "Current Affairs"
            ],
          },
          {
            id: "nift-creative",
            name: "Creative Ability Test",
            icon: "🎨",
            topics: [
              "Design Thinking & Innovation", "Color Theory & Application", "Composition & Layout",
              "Visual Perception", "Creativity & Originality",
              "Fashion Awareness (Trends, Designers, History)"
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
              "Number Systems (HCF, LCM, Divisibility, Factors)", "Simplification (BODMAS, Surds, Indices)",
              "Decimals and Fractions", "Percentage", "Ratio and Proportion", "Average",
              "Profit, Loss and Discount", "Simple Interest and Compound Interest",
              "Time and Work (Pipes & Cisterns)", "Time, Speed and Distance (Trains, Boats & Streams)",
              "Problems on Ages", "Mensuration (Area, Volume, Perimeter)",
              "Algebra (Linear Equations, Quadratic Equations, Polynomials)",
              "Geometry (Lines, Angles, Triangles, Circles, Quadrilaterals)",
              "Trigonometry (Ratios, Identities, Heights & Distances)",
              "Data Interpretation (Tables, Bar, Line, Pie Charts)",
              "Number Series", "Permutation and Combination", "Probability",
              "Partnership", "Mixture and Alligation", "Percentage Change"
            ],
          },
          {
            id: "rrb-reasoning",
            name: "General Intelligence & Reasoning",
            icon: "🧩",
            topics: [
              "Analogies (Number, Letter, Meaning based)", "Odd One Out (Classification)",
              "Number Series", "Letter Series", "Alpha-numeric Series",
              "Coding-Decoding (Letter, Number, Substitution, Mixed)", "Syllogism",
              "Blood Relations", "Direction and Distance Test", "Ranking & Time Sequence",
              "Mathematical Operations", "Arithmetical Reasoning",
              "Statement and Conclusions", "Statement and Arguments", "Statement and Assumptions",
              "Venn Diagrams", "Alphabet Test", "Number Ranking",
              "Mirror Images & Water Images", "Paper Folding & Paper Cutting",
              "Embedded Figures", "Figure Matrix", "Cube and Dice",
              "Counting of Figures", "Seating Arrangement (Linear, Circular)",
              "Puzzle Test", "Missing Number in Series or Matrix"
            ],
          },
          {
            id: "rrb-ga",
            name: "General Awareness & Current Affairs",
            icon: "🌐",
            topics: [
              "Indian History (Ancient, Medieval, Modern, Freedom Struggle)",
              "Indian Geography (Physical, Economic, States & Capitals)",
              "Indian Polity & Constitution (Fundamental Rights, Parliament, Judiciary)",
              "Indian Economy (Budget, Banking, Currency, GST)",
              "General Science (Physics, Chemistry, Biology basics)",
              "Current Affairs (National & International, last 6 months)",
              "Static GK (Books, Authors, Awards, Sports)",
              "Indian Railway History & Organization", "Railway Zones and Headquarters",
              "Important Railway Projects", "Computer Basics (Hardware, Software, Internet)",
              "Science & Technology", "Environment & Ecology", "Famous Personalities",
              "Indian Art & Culture", "International Organizations"
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
              "Number Systems (HCF, LCM, Divisibility)", "Simplification (BODMAS, Decimals, Fractions)",
              "Percentage", "Ratio and Proportion", "Average",
              "Profit, Loss and Discount", "Simple Interest and Compound Interest",
              "Time and Work", "Time, Speed and Distance (Trains, Boats)",
              "Problems on Ages", "Mensuration (Area, Volume)",
              "Geometry (Lines, Angles, Triangles, Circles)",
              "Trigonometry (Basic Ratios, Heights & Distances)",
              "Algebra (Linear Equations)", "Data Interpretation (Tables, Charts)"
            ],
          },
          {
            id: "rrb-d-reasoning",
            name: "General Intelligence & Reasoning",
            icon: "🧩",
            topics: [
              "Analogies (Number, Letter, Word)", "Classification (Odd One Out)",
              "Number Series", "Letter Series", "Missing Numbers",
              "Coding-Decoding (Letter, Number, Symbol)", "Syllogism",
              "Venn Diagrams", "Blood Relations", "Direction and Distance",
              "Ranking & Ordering", "Mirror and Water Images",
              "Paper Folding & Cutting", "Pattern Recognition",
              "Cubes and Dice", "Figure Completion", "Embedded Figures"
            ],
          },
          {
            id: "rrb-d-science",
            name: "General Science",
            icon: "🔬",
            topics: [
              "Physics (Motion, Force, Energy, Light, Sound, Electricity, Magnetism)",
              "Chemistry (Acids, Bases, Salts, Metals, Non-metals, Chemical Reactions)",
              "Biology (Human Body Systems, Diseases, Nutrition, Plants, Animals)",
              "Environmental Science (Pollution, Climate Change, Conservation)",
              "Health & Hygiene", "Food & Nutrition", "Scientific Inventions & Discoveries"
            ],
          },
          {
            id: "rrb-d-ga",
            name: "General Awareness & Current Affairs",
            icon: "🌐",
            topics: [
              "Current Affairs (National & International, last 6 months)",
              "Static GK (Books, Authors, Awards, Sports, Capitals)",
              "Indian History (Ancient, Medieval, Modern)", "Indian Geography (Physical, Economic)",
              "Indian Polity & Constitution", "Indian Economy (Budget, Banking)",
              "Indian Railway History", "Railway Zones & Divisions",
              "Famous Personalities", "Art & Culture", "Science & Technology"
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
              "Syllogism (All forms, Venn diagrams)", "Coding-Decoding (Letter, Number, Mixed)",
              "Blood Relations (Complex family trees)", "Seating Arrangement (Linear, Circular, Complex)",
              "Puzzles (Floor-based, Month-based, Box-based)", "Inequality (Coded inequalities)",
              "Direction and Distance", "Machine Input-Output (Advanced patterns)",
              "Data Sufficiency", "Logical Reasoning", "Alpha-numeric Series",
              "Order and Ranking"
            ],
          },
          {
            id: "lic-quant",
            name: "Quantitative Aptitude & Data Interpretation",
            icon: "🔢",
            topics: [
              "Number Series & Wrong Number Series", "Simplification & Approximation",
              "Percentage & Percentage Change", "Average (Simple, Weighted)",
              "Profit, Loss and Discount", "Simple Interest and Compound Interest",
              "Ratio and Proportion", "Partnership", "Mixture and Alligation",
              "Time and Work (Including Pipes & Cisterns)", "Time, Speed and Distance (Trains, Boats & Streams)",
              "Problems on Ages", "Mensuration (Area, Volume)",
              "Data Interpretation (Tables, Bar, Line, Pie Charts, Caselets, Missing DI)",
              "Quadratic Equations", "Permutation and Combination", "Probability"
            ],
          },
          {
            id: "lic-english",
            name: "English Language",
            icon: "📝",
            topics: [
              "Reading Comprehension (Complex passages)", "Cloze Test (Fill in the blanks in passage)",
              "Error Spotting (Grammatical errors)", "Sentence Rearrangement (Para Jumbles)",
              "Fill in the Blanks (Single, Double, Multiple)", "Phrase Replacement",
              "Vocabulary (Synonyms, Antonyms, One word substitution)",
              "Idioms and Phrases", "Sentence Improvement",
              "Para Completion", "Word Usage"
            ],
          },
          {
            id: "lic-ga",
            name: "General Knowledge, Current Affairs & Insurance Awareness",
            icon: "🌐",
            topics: [
              "Insurance Awareness (Types of insurance - Life, General, Health; Insurance terms, LIC products & schemes, IRDAI, Insurance sector developments)",
              "Financial Awareness (Banking system, RBI, Monetary policy, Financial institutions, Payment systems, Budget)",
              "Current Affairs (National & International events, last 6 months)",
              "Static GK (Books, Authors, Awards, Sports, Capitals, Important Days)",
              "Indian Economy (GDP, Inflation, Banking, Trade)",
              "Government Schemes & Policies"
            ],
          },
          {
            id: "lic-computer",
            name: "Computer Knowledge",
            icon: "💻",
            topics: [
              "Computer Fundamentals", "Hardware & Software", "Operating Systems",
              "MS Office (Word, Excel, PowerPoint)", "Internet & Networking",
              "Computer Security (Virus, Firewall, Encryption)", "Database basics"
            ],
          },
        ],
      },
    ],
  },

  // ─── POLICE & SECURITY ─────────────────────────────────
  {
    id: "police",
    name: "Police & Security",
    icon: "👮",
    exams: [
      {
        id: "delhi-police",
        name: "Delhi Police",
        fullName: "Delhi Police Constable",
        category: "police",
        icon: "👮",
        color: "#1E40AF",
        description: "For Delhi Police Constable posts",
        subjects: [
          {
            id: "dp-reasoning",
            name: "Reasoning Ability",
            icon: "🧩",
            topics: [
              "Analogies (Verbal & Non-verbal)", "Series (Number, Letter, Figure)",
              "Coding-Decoding", "Blood Relations", "Direction and Distance",
              "Alphabet Test", "Number Ranking & Time Sequence",
              "Mathematical Operations", "Venn Diagrams", "Missing Numbers"
            ],
          },
          {
            id: "dp-gk",
            name: "General Knowledge & Awareness",
            icon: "🌐",
            topics: [
              "Current Affairs (National & International)", "Indian History", "Indian Geography",
              "Indian Polity & Constitution", "Indian Economy",
              "General Science (Physics, Chemistry, Biology)", "Sports & Awards",
              "Delhi-specific GK (Administration, Culture, Important places)"
            ],
          },
          {
            id: "dp-numerical",
            name: "Numerical Ability",
            icon: "🔢",
            topics: [
              "Number System (HCF, LCM)", "Simplification", "Percentage",
              "Profit & Loss", "Simple & Compound Interest", "Ratio & Proportion",
              "Average", "Time & Work", "Time & Distance", "Data Interpretation"
            ],
          },
          {
            id: "dp-computer",
            name: "Computer Fundamentals",
            icon: "💻",
            topics: [
              "Computer Basics (Hardware, Software)", "MS Office (Word, Excel, PowerPoint)",
              "Internet Basics (Browsers, Email, Search)", "Operating Systems (Windows basics)",
              "Computer Abbreviations", "Input/Output devices"
            ],
          },
        ],
      },
      {
        id: "up-police",
        name: "UP Police",
        fullName: "Uttar Pradesh Police Constable",
        category: "police",
        icon: "👮",
        color: "#1E3A8A",
        description: "For UP Police Constable posts",
        subjects: [
          {
            id: "up-gk",
            name: "General Knowledge & Awareness",
            icon: "🌐",
            topics: [
              "Indian History", "Indian Constitution & Polity", "Indian Geography",
              "Indian Economy", "General Science (Physics, Chemistry, Biology)",
              "Current Affairs (National & International)", "UP-specific GK (History, Culture, Administration)",
              "Sports, Awards & Culture", "Important Days & Events"
            ],
          },
          {
            id: "up-numerical",
            name: "Numerical & Mental Ability",
            icon: "🔢",
            topics: [
              "Number System", "Percentage", "Profit & Loss", "Interest",
              "Ratio & Proportion", "Average", "Time & Work", "Time & Distance",
              "Simplification", "Data Interpretation"
            ],
          },
          {
            id: "up-reasoning",
            name: "Mental Ability & IQ",
            icon: "🧩",
            topics: [
              "Series (Number, Letter)", "Coding-Decoding", "Analogies",
              "Blood Relations", "Direction Sense", "Ranking & Ordering",
              "Logical Venn Diagrams", "Missing Numbers"
            ],
          },
          {
            id: "up-hindi",
            name: "Hindi Language",
            icon: "📝",
            topics: [
              "Vyakaran (Grammar - Sandhi, Samas, Sangya, Sarvanam, Visheshan, Kriya)",
              "Vocabulary (Paryayvachi, Vilom, Muhavare)", "Apathit Gadyansh (Comprehension)",
              "Sentence Formation", "Error Correction"
            ],
          },
        ],
      },
      {
        id: "cisf",
        name: "CISF",
        fullName: "Central Industrial Security Force",
        category: "police",
        icon: "🛡️",
        color: "#1E293B",
        description: "For CISF Constable posts",
        subjects: [
          {
            id: "cisf-gk",
            name: "General Awareness & Intelligence",
            icon: "🌐",
            topics: [
              "Current Affairs (National & International)", "Indian History", "Indian Geography",
              "Indian Polity", "Indian Economy", "General Science",
              "Sports & Awards", "Important Days"
            ],
          },
          {
            id: "cisf-reasoning",
            name: "Reasoning",
            icon: "🧩",
            topics: [
              "Analogies", "Series (Number, Letter)", "Coding-Decoding",
              "Blood Relations", "Syllogism", "Venn Diagrams",
              "Direction Sense", "Ranking"
            ],
          },
          {
            id: "cisf-numerical",
            name: "Numerical Ability",
            icon: "🔢",
            topics: [
              "Number System", "Percentage", "Ratio & Proportion",
              "Profit & Loss", "Interest", "Average",
              "Time & Work", "Simplification"
            ],
          },
        ],
      },
    ],
  },

  // ─── STATE PSC ─────────────────────────────────────────
  {
    id: "state-psc",
    name: "State PSC",
    icon: "🏛️",
    exams: [
      {
        id: "uppsc",
        name: "UPPSC",
        fullName: "Uttar Pradesh Public Service Commission",
        category: "state-psc",
        icon: "🏛️",
        color: "#7C2D12",
        description: "For UP state civil services",
        subjects: [
          {
            id: "uppsc-gs",
            name: "General Studies",
            icon: "📚",
            topics: [
              "Indian History (Ancient, Medieval, Modern, Freedom struggle)",
              "Indian Geography & UP Geography (Physical features, Resources, Climate)",
              "Indian Polity & Constitution (Fundamental Rights, Parliament, Judiciary)",
              "Indian Economy & UP Economy (Agriculture, Industry, Budget)",
              "Environment & Ecology (Biodiversity, Climate change, Pollution)",
              "Science & Technology (Space, IT, Biotechnology)",
              "Current Affairs (National & International, last 12 months)",
              "UP-specific Topics (History, Culture, Administration, Development programs)",
              "Art & Culture (Indian & UP heritage)", "International Relations"
            ],
          },
          {
            id: "uppsc-csat",
            name: "CSAT (Aptitude Test)",
            icon: "🧩",
            topics: [
              "Reading Comprehension", "Logical Reasoning & Analytical Ability",
              "Decision Making & Problem Solving", "Data Interpretation (Tables, Graphs)",
              "Basic Numeracy (Number system, Percentages, Ratios)",
              "Mental Ability", "Interpersonal skills"
            ],
          },
        ],
      },
      {
        id: "mppsc",
        name: "MPPSC",
        fullName: "Madhya Pradesh Public Service Commission",
        category: "state-psc",
        icon: "🏛️",
        color: "#92400E",
        description: "For MP state civil services",
        subjects: [
          {
            id: "mppsc-gs",
            name: "General Studies",
            icon: "📚",
            topics: [
              "Indian History & MP History (Ancient, Medieval, Modern, Freedom movement)",
              "Indian Geography & MP Geography (Physical, Economic, Resources)",
              "Indian Polity & MP Administration",
              "Indian Economy & MP Economy", "Environment & Ecology",
              "Science & Technology", "Current Affairs (National & International)",
              "MP-specific Topics (Culture, Tribes, Tourism, Development schemes)",
              "Art & Culture", "Sports"
            ],
          },
          {
            id: "mppsc-aptitude",
            name: "Aptitude Test",
            icon: "🧩",
            topics: [
              "Reading Comprehension", "Logical Reasoning", "Analytical Ability",
              "Decision Making", "Problem Solving", "Data Interpretation",
              "Basic Numeracy"
            ],
          },
        ],
      },
      {
        id: "bpsc",
        name: "BPSC",
        fullName: "Bihar Public Service Commission",
        category: "state-psc",
        icon: "🏛️",
        color: "#78350F",
        description: "For Bihar state civil services",
        subjects: [
          {
            id: "bpsc-gs",
            name: "General Studies",
            icon: "📚",
            topics: [
              "Indian History & Bihar History (Ancient, Medieval, Modern, National Movement)",
              "Indian Geography & Bihar Geography (Physical features, Rivers, Resources)",
              "Indian Polity & Bihar Administration (Constitution, Governance)",
              "Indian Economy & Bihar Economy (Agriculture, Industry, Development)",
              "Science & Technology (General science, Recent developments)",
              "Current Affairs (National & International events)",
              "Bihar-specific Topics (Culture, Literature, Personalities, Government schemes)",
              "Environment & Ecology", "Art & Culture"
            ],
          },
        ],
      },
      {
        id: "rpsc",
        name: "RPSC",
        fullName: "Rajasthan Public Service Commission",
        category: "state-psc",
        icon: "🏛️",
        color: "#A16207",
        description: "For Rajasthan state civil services",
        subjects: [
          {
            id: "rpsc-gs",
            name: "General Studies",
            icon: "📚",
            topics: [
              "Indian History & Rajasthan History (Ancient, Medieval, Modern, Rajput history)",
              "Indian Geography & Rajasthan Geography (Deserts, Rivers, Climate, Resources)",
              "Indian Polity & Rajasthan Administration",
              "Indian Economy & Rajasthan Economy (Agriculture, Minerals, Industries)",
              "Science & Technology", "Current Affairs (National & International)",
              "Rajasthan-specific Topics (Art, Culture, Fairs & Festivals, Folk music, Handicrafts, Tourism)",
              "Environment & Ecology", "Famous personalities from Rajasthan"
            ],
          },
          {
            id: "rpsc-aptitude",
            name: "Aptitude Test",
            icon: "🧩",
            topics: [
              "Logical Reasoning", "Analytical Ability",
              "Mental Ability", "Data Interpretation",
              "Basic Numeracy", "Reading Comprehension"
            ],
          },
        ],
      },
    ],
  },

  // ─── LAW ENTRANCE ──────────────────────────────────────
  {
    id: "law",
    name: "Law Entrance",
    icon: "⚖️",
    exams: [
      {
        id: "clat",
        name: "CLAT",
        fullName: "Common Law Admission Test",
        category: "law",
        icon: "⚖️",
        color: "#9F1239",
        description: "For admission to National Law Universities",
        subjects: [
          {
            id: "clat-english",
            name: "English Language",
            icon: "📝",
            topics: [
              "Reading Comprehension", "Grammar", "Vocabulary",
              "Verbal Ability", "Error Correction", "Sentence Completion"
            ],
          },
          {
            id: "clat-gk",
            name: "Current Affairs & GK",
            icon: "🌐",
            topics: [
              "Current Affairs", "Static GK", "National Affairs",
              "International Affairs", "Legal Affairs", "Constitutional Developments"
            ],
          },
          {
            id: "clat-legal",
            name: "Legal Reasoning",
            icon: "⚖️",
            topics: [
              "Legal Principles", "Legal Maxims", "Case Studies",
              "Application of Law", "Legal Aptitude"
            ],
          },
          {
            id: "clat-logical",
            name: "Logical Reasoning",
            icon: "🧩",
            topics: [
              "Critical Reasoning", "Analytical Reasoning",
              "Syllogisms", "Assumptions", "Conclusions",
              "Arguments", "Inferences"
            ],
          },
          {
            id: "clat-quant",
            name: "Quantitative Techniques",
            icon: "🔢",
            topics: [
              "Percentage", "Ratio & Proportion", "Profit & Loss",
              "Interest", "Average", "Data Interpretation"
            ],
          },
        ],
      },
      {
        id: "ailet",
        name: "AILET",
        fullName: "All India Law Entrance Test",
        category: "law",
        icon: "⚖️",
        color: "#BE123C",
        description: "For admission to National Law University Delhi",
        subjects: [
          {
            id: "ailet-english",
            name: "English Language",
            icon: "📝",
            topics: [
              "Reading Comprehension", "Grammar (Parts of speech, Tenses, Voice)",
              "Vocabulary (Synonyms, Antonyms)", "Sentence Correction",
              "Verbal Ability", "Idioms & Phrases"
            ],
          },
          {
            id: "ailet-gk",
            name: "General Knowledge & Current Affairs",
            icon: "🌐",
            topics: [
              "Current Affairs (National & International, last 12 months)",
              "Indian History, Geography & Polity", "Legal Affairs (Landmark judgments, New laws)",
              "National & International Events", "Awards & Honors", "Sports"
            ],
          },
          {
            id: "ailet-reasoning",
            name: "Logical & Legal Reasoning",
            icon: "🧩",
            topics: [
              "Logical Reasoning (Syllogisms, Analogies, Series)",
              "Analytical Reasoning (Puzzles, Arrangements)", "Critical Thinking",
              "Legal Reasoning (Legal principles, Case-based reasoning)"
            ],
          },
          {
            id: "ailet-maths",
            name: "Elementary Mathematics",
            icon: "🔢",
            topics: [
              "Arithmetic (Percentage, Profit & Loss, Ratio, Average)",
              "Algebra (Linear equations)", "Geometry (Basic mensuration)",
              "Data Interpretation (Tables, Charts)"
            ],
          },
        ],
      },
    ],
  },

  // ─── MORE TEACHING ─────────────────────────────────────
  {
    id: "more-teaching",
    name: "State Teaching",
    icon: "👨‍🏫",
    exams: [
      {
        id: "htet",
        name: "HTET",
        fullName: "Haryana Teacher Eligibility Test",
        category: "more-teaching",
        icon: "👨‍🏫",
        color: "#15803D",
        description: "For teaching in Haryana schools",
        subjects: [
          {
            id: "htet-cdp",
            name: "Child Development & Pedagogy",
            icon: "👶",
            topics: [
              "Child Development (Principles, Stages)", "Learning Theories (Piaget, Vygotsky)",
              "Individual Differences", "Assessment & Evaluation", "Inclusive Education",
              "Motivation & Learning", "Intelligence Theories"
            ],
          },
          {
            id: "htet-lang1",
            name: "Language I (Hindi)",
            icon: "📝",
            topics: [
              "Apathit Gadyansh (Comprehension)", "Vyakaran (Grammar)", "Language Pedagogy",
              "Vocabulary", "Rachana (Writing Skills)"
            ],
          },
          {
            id: "htet-lang2",
            name: "Language II (English)",
            icon: "📖",
            topics: [
              "Reading Comprehension", "Grammar", "Language Pedagogy",
              "Vocabulary", "Writing Skills"
            ],
          },
          {
            id: "htet-env",
            name: "Environmental Studies & Pedagogy",
            icon: "🌍",
            topics: [
              "Family & Friends", "Food & Nutrition", "Shelter", "Water",
              "Travel & Transport", "Things We Make & Do", "EVS Pedagogy"
            ],
          },
        ],
      },
      {
        id: "rtet",
        name: "RTET",
        fullName: "Rajasthan Teacher Eligibility Test",
        category: "more-teaching",
        icon: "👨‍🏫",
        color: "#166534",
        description: "For teaching in Rajasthan schools",
        subjects: [
          {
            id: "rtet-cdp",
            name: "Child Development & Pedagogy",
            icon: "👶",
            topics: [
              "Child Development (Stages, Principles)", "Learning Theories",
              "Individual Differences", "Assessment & Evaluation", "Inclusive Education"
            ],
          },
          {
            id: "rtet-maths",
            name: "Mathematics & Pedagogy",
            icon: "🔢",
            topics: [
              "Number System", "Algebra (Basic)", "Geometry",
              "Mensuration", "Data Handling", "Mathematics Pedagogy"
            ],
          },
          {
            id: "rtet-science",
            name: "Science & Pedagogy",
            icon: "🔬",
            topics: [
              "Physics (Motion, Force, Energy)", "Chemistry (Matter, Elements)", "Biology (Living organisms)",
              "Environmental Science", "Science Pedagogy"
            ],
          },
          {
            id: "rtet-social",
            name: "Social Studies & Pedagogy",
            icon: "🌐",
            topics: [
              "History (Indian & World)", "Geography", "Polity & Civics", "Economics (Basic)",
              "Rajasthan-specific Topics (History, Culture, Geography)", "Social Studies Pedagogy"
            ],
          },
        ],
      },
      {
        id: "uptet",
        name: "UPTET",
        fullName: "Uttar Pradesh Teacher Eligibility Test",
        category: "more-teaching",
        icon: "👨‍🏫",
        color: "#14532D",
        description: "For teaching in UP schools",
        subjects: [
          {
            id: "uptet-cdp",
            name: "Child Development & Pedagogy",
            icon: "👶",
            topics: [
              "Child Development (Principles, Stages)", "Learning Theories (Piaget, Vygotsky)",
              "Individual Differences", "Assessment & Evaluation", "Inclusive Education"
            ],
          },
          {
            id: "uptet-hindi",
            name: "Hindi Bhasha & Pedagogy",
            icon: "📝",
            topics: [
              "Apathit Gadyansh (Unseen passages)", "Vyakaran (Grammar)", "Bhasha Shikshan Vidhi",
              "Shabdavali (Vocabulary)", "Rachana (Composition)"
            ],
          },
          {
            id: "uptet-english",
            name: "English Language & Pedagogy",
            icon: "📖",
            topics: [
              "Reading Comprehension", "Grammar (Tenses, Articles, Prepositions)", "Language Pedagogy",
              "Vocabulary (Synonyms, Antonyms)", "Writing Skills"
            ],
          },
          {
            id: "uptet-maths",
            name: "Mathematics & Pedagogy",
            icon: "🔢",
            topics: [
              "Number System", "Algebra (Basic)", "Geometry (Shapes, Angles)",
              "Mensuration", "Data Handling", "Mathematics Pedagogy"
            ],
          },
          {
            id: "uptet-env",
            name: "Environmental Studies & Pedagogy",
            icon: "🌍",
            topics: [
              "Family & Friends", "Food & Nutrition", "Shelter", "Water & Sanitation",
              "Travel & Communication", "Things We Make & Do", "EVS Pedagogy"
            ],
          },
        ],
      },
      {
        id: "kvs",
        name: "KVS",
        fullName: "Kendriya Vidyalaya Sangathan",
        category: "more-teaching",
        icon: "🏫",
        color: "#16A34A",
        description: "For teaching in Kendriya Vidyalayas",
        subjects: [
          {
            id: "kvs-gs",
            name: "General Awareness & Current Affairs",
            icon: "🌐",
            topics: [
              "Current Affairs (National & International)", "Indian History", "Indian Geography",
              "Indian Polity", "Indian Economy", "General Science", "Sports & Awards"
            ],
          },
          {
            id: "kvs-reasoning",
            name: "Reasoning Ability",
            icon: "🧩",
            topics: [
              "Analogies", "Series (Number, Letter)", "Coding-Decoding",
              "Blood Relations", "Direction Sense", "Syllogism", "Ranking"
            ],
          },
          {
            id: "kvs-subject",
            name: "Subject Knowledge & Pedagogy",
            icon: "📚",
            topics: [
              "Subject-specific Concepts", "Teaching Pedagogy",
              "Teaching Methodology", "Classroom Management", "Assessment & Evaluation"
            ],
          },
          {
            id: "kvs-hindi",
            name: "Hindi Language",
            icon: "📝",
            topics: [
              "Apathit Gadyansh (Comprehension)", "Vyakaran (Grammar)", "Shabdavali (Vocabulary)"
            ],
          },
        ],
      },
      {
        id: "dsssb",
        name: "DSSSB",
        fullName: "Delhi Subordinate Services Selection Board",
        category: "more-teaching",
        icon: "🏫",
        color: "#22C55E",
        description: "For teaching in Delhi government schools",
        subjects: [
          {
            id: "dsssb-gs",
            name: "General Awareness",
            icon: "🌐",
            topics: [
              "Current Affairs (National & International)", "Indian History", "Indian Geography",
              "Indian Polity", "Indian Economy", "General Science",
              "Delhi-specific GK (Administration, Culture, Important places)", "Sports & Awards"
            ],
          },
          {
            id: "dsssb-reasoning",
            name: "General Intelligence & Reasoning",
            icon: "🧩",
            topics: [
              "Analogies", "Series (Number, Letter)", "Coding-Decoding",
              "Blood Relations", "Syllogism", "Venn Diagrams",
              "Direction Sense", "Ranking"
            ],
          },
          {
            id: "dsssb-arithmetic",
            name: "Arithmetical & Numerical Ability",
            icon: "🔢",
            topics: [
              "Number System (HCF, LCM)", "Percentage", "Ratio & Proportion",
              "Profit & Loss", "Simple & Compound Interest", "Average",
              "Time & Work", "Time & Distance", "Data Interpretation"
            ],
          },
          {
            id: "dsssb-hindi",
            name: "Hindi Language",
            icon: "📝",
            topics: [
              "Apathit Gadyansh (Comprehension)", "Vyakaran (Grammar)", "Shabdavali (Vocabulary)"
            ],
          },
          {
            id: "dsssb-english",
            name: "English Language",
            icon: "📖",
            topics: [
              "Reading Comprehension", "Grammar (Tenses, Articles)", "Vocabulary (Synonyms, Antonyms)"
            ],
          },
        ],
      },
    ],
  },

  // ─── HOTEL MANAGEMENT ──────────────────────────────────
  {
    id: "hotel-management",
    name: "Hotel Management",
    icon: "🏨",
    exams: [
      {
        id: "nchmct",
        name: "NCHMCT JEE",
        fullName: "National Council for Hotel Management - Joint Entrance Exam",
        category: "hotel-management",
        icon: "🏨",
        color: "#EA580C",
        description: "For admission to hotel management courses",
        subjects: [
          {
            id: "nchmct-english",
            name: "English Language",
            icon: "📝",
            topics: [
              "Grammar (Tenses, Articles, Prepositions)", "Vocabulary (Synonyms, Antonyms)",
              "Reading Comprehension", "Sentence Formation", "Error Correction"
            ],
          },
          {
            id: "nchmct-numerical",
            name: "Numerical Ability & Analytical Aptitude",
            icon: "🔢",
            topics: [
              "Arithmetic (Percentage, Profit & Loss, Ratio, Interest)", "Algebra (Equations)",
              "Geometry (Mensuration)", "Data Interpretation (Tables, Charts)",
              "Logical Reasoning & Problem Solving"
            ],
          },
          {
            id: "nchmct-reasoning",
            name: "Reasoning & Logical Deduction",
            icon: "🧩",
            topics: [
              "Analogies", "Series (Number, Letter)", "Coding-Decoding",
              "Blood Relations", "Direction Sense", "Syllogism", "Venn Diagrams"
            ],
          },
          {
            id: "nchmct-gk",
            name: "General Knowledge & Current Affairs",
            icon: "🌐",
            topics: [
              "Current Affairs (National & International)", "Indian History", "Geography",
              "Polity", "General Science", "Sports", "Hospitality Industry awareness"
            ],
          },
          {
            id: "nchmct-service",
            name: "Service Aptitude",
            icon: "🤝",
            topics: [
              "Customer Service principles", "Communication Skills",
              "Hospitality Awareness", "Situational Judgment & Ethics"
            ],
          },
        ],
      },
    ],
  },

  // ─── ARCHITECTURE ──────────────────────────────────────
  {
    id: "architecture",
    name: "Architecture",
    icon: "🏗️",
    exams: [
      {
        id: "nata",
        name: "NATA",
        fullName: "National Aptitude Test in Architecture",
        category: "architecture",
        icon: "🏗️",
        color: "#D97706",
        description: "For admission to architecture courses",
        subjects: [
          {
            id: "nata-maths",
            name: "Mathematics",
            icon: "🔢",
            topics: [
              "Algebra (Equations, Progressions)", "Trigonometry (Ratios, Identities)",
              "Coordinate Geometry (2D & 3D)", "Calculus (Differentiation, Integration)",
              "Matrices & Determinants", "Probability", "Statistics (Mean, Median, Mode)"
            ],
          },
          {
            id: "nata-drawing",
            name: "Drawing Test",
            icon: "✏️",
            topics: [
              "Drawing Aptitude", "Perspective Drawing (1-point, 2-point)",
              "Sketching (Objects, Buildings)", "Shading & Rendering",
              "Texture representation", "Composition & Layout"
            ],
          },
          {
            id: "nata-aptitude",
            name: "General Aptitude",
            icon: "🧩",
            topics: [
              "Visual Perception & Observation", "Analytical Reasoning",
              "Spatial Ability (3D visualization)", "Architectural Awareness (Buildings, Styles)",
              "Environmental Awareness", "Objects & Texture"
            ],
          },
        ],
      },
    ],
  },

  // ─── COMMERCE & ACCOUNTS ───────────────────────────────
  {
    id: "commerce",
    name: "Commerce & Accounts",
    icon: "💼",
    exams: [
      {
        id: "ca-foundation",
        name: "CA Foundation",
        fullName: "Chartered Accountant Foundation",
        category: "commerce",
        icon: "💼",
        color: "#059669",
        description: "Entry level exam for CA course",
        subjects: [
          {
            id: "ca-accounts",
            name: "Principles & Practice of Accounting",
            icon: "📊",
            topics: [
              "Accounting Principles & Concepts", "Double Entry System", "Journal Entries",
              "Ledger & Trial Balance", "Final Accounts (Trading, P&L, Balance Sheet)",
              "Bank Reconciliation Statement", "Bills of Exchange & Promissory Notes",
              "Consignment Accounts", "Joint Venture Accounts", "Depreciation",
              "Accounting for Special Transactions"
            ],
          },
          {
            id: "ca-law",
            name: "Business Laws & Business Correspondence",
            icon: "⚖️",
            topics: [
              "Indian Contract Act 1872 (Offer, Acceptance, Consideration, Breach)",
              "Sale of Goods Act 1930", "Partnership Act 1932",
              "Business Communication principles", "Letter Writing (Business letters, Applications)",
              "Elements of Company Law"
            ],
          },
          {
            id: "ca-maths",
            name: "Business Mathematics & Statistics",
            icon: "🔢",
            topics: [
              "Ratio, Proportion & Variation", "Indices & Logarithms", "Equations (Linear, Quadratic)",
              "Algebra (Sets, Functions)", "Matrices & Determinants", "Basic Calculus",
              "Statistics (Measures of Central Tendency, Dispersion)", "Probability",
              "Correlation & Regression", "Index Numbers", "Time Series", "Permutation & Combination"
            ],
          },
          {
            id: "ca-economics",
            name: "Business Economics & Business & Commercial Knowledge",
            icon: "💰",
            topics: [
              "Microeconomics (Demand, Supply, Elasticity, Consumer Behavior)", "Macroeconomics (National Income, Money, Banking)",
              "Business Environment", "Production & Costs", "Market Structure (Perfect competition, Monopoly)",
              "Business & Commercial Knowledge (Current business affairs, Indian economy basics)"
            ],
          },
        ],
      },
      {
        id: "cs-foundation",
        name: "CS Foundation",
        fullName: "Company Secretary Foundation",
        category: "commerce",
        icon: "📋",
        color: "#10B981",
        description: "Entry level exam for CS course",
        subjects: [
          {
            id: "cs-business-env",
            name: "Business Environment & Entrepreneurship",
            icon: "🌐",
            topics: [
              "Business Environment (Economic, Social, Political, Legal)",
              "Entrepreneurship Development", "Business Organizations (Sole proprietorship, Partnership, Company)",
              "Forms of Business Entities"
            ],
          },
          {
            id: "cs-business-mgmt",
            name: "Business Management, Ethics & Communication",
            icon: "💼",
            topics: [
              "Management Functions (Planning, Organizing, Directing, Controlling)",
              "Leadership styles", "Motivation theories",
              "Business Ethics & Corporate Governance", "Business Communication (Oral, Written)"
            ],
          },
          {
            id: "cs-business-economics",
            name: "Business Economics",
            icon: "💰",
            topics: [
              "Microeconomics (Demand, Supply, Elasticity)", "Macroeconomics (National Income, Money, Banking)",
              "Market Structure", "Economic policies"
            ],
          },
          {
            id: "cs-fundamentals",
            name: "Fundamentals of Accounting & Auditing",
            icon: "📊",
            topics: [
              "Accounting Principles & Concepts", "Double Entry System",
              "Final Accounts (Trading, P&L, Balance Sheet)", "Auditing Basics & Concepts",
              "Trial Balance & Ledger"
            ],
          },
        ],
      },
    ],
  },

  // ─── AGRICULTURE ───────────────────────────────────────
  {
    id: "agriculture",
    name: "Agriculture",
    icon: "🌾",
    exams: [
      {
        id: "icar-aieea",
        name: "ICAR AIEEA",
        fullName: "Indian Council of Agricultural Research - All India Entrance Exam",
        category: "agriculture",
        icon: "🌾",
        color: "#65A30D",
        description: "For admission to agriculture courses",
        subjects: [
          {
            id: "icar-physics",
            name: "Physics",
            icon: "⚛️",
            topics: [
              "Mechanics (Motion, Force, Work Energy)", "Thermodynamics", "Optics (Ray & Wave)",
              "Electricity & Magnetism (Current, Circuits, Electromagnetic induction)", "Modern Physics (Atoms, Nuclei)"
            ],
          },
          {
            id: "icar-chemistry",
            name: "Chemistry",
            icon: "🧪",
            topics: [
              "Physical Chemistry (Atomic structure, Bonding, Thermodynamics, Equilibrium)",
              "Inorganic Chemistry (Periodic table, s-block, p-block, d-block elements)",
              "Organic Chemistry (Hydrocarbons, Functional groups, Biomolecules)",
              "Environmental Chemistry"
            ],
          },
          {
            id: "icar-biology",
            name: "Biology (Botany & Zoology)",
            icon: "🧬",
            topics: [
              "Plant Physiology", "Genetics & Evolution", "Ecology & Environment",
              "Biotechnology & Applications", "Agriculture (Crop production, Plant breeding)",
              "Animal Husbandry", "Cell Biology"
            ],
          },
          {
            id: "icar-maths",
            name: "Mathematics (Optional)",
            icon: "🔢",
            topics: [
              "Algebra (Equations, Progressions)", "Trigonometry", "Coordinate Geometry",
              "Calculus (Differentiation, Integration)", "Statistics", "Probability"
            ],
          },
        ],
      },
    ],
  },

  // ─── VETERINARY ────────────────────────────────────────
  {
    id: "veterinary",
    name: "Veterinary",
    icon: "🐾",
    exams: [
      {
        id: "aipvt",
        name: "AIPVT",
        fullName: "All India Pre-Veterinary Test",
        category: "veterinary",
        icon: "🐾",
        color: "#DC2626",
        description: "For admission to veterinary courses",
        subjects: [
          {
            id: "aipvt-physics",
            name: "Physics",
            icon: "⚛️",
            topics: [
              "Mechanics", "Thermodynamics", "Optics",
              "Electricity & Magnetism", "Modern Physics (Atoms, Nuclei)"
            ],
          },
          {
            id: "aipvt-chemistry",
            name: "Chemistry",
            icon: "🧪",
            topics: [
              "Physical Chemistry (Thermodynamics, Equilibrium)", "Inorganic Chemistry (Periodic table, Elements)",
              "Organic Chemistry (Hydrocarbons, Functional groups)", "Environmental Chemistry"
            ],
          },
          {
            id: "aipvt-biology",
            name: "Biology (Zoology focus)",
            icon: "🧬",
            topics: [
              "Zoology (Animal diversity, Classification)", "Animal Physiology", "Genetics & Evolution",
              "Ecology", "Animal Husbandry & Veterinary Science basics"
            ],
          },
        ],
      },
    ],
  },

  // ─── PHARMACY ──────────────────────────────────────────
  {
    id: "pharmacy",
    name: "Pharmacy",
    icon: "💊",
    exams: [
      {
        id: "gpat",
        name: "GPAT",
        fullName: "Graduate Pharmacy Aptitude Test",
        category: "pharmacy",
        icon: "💊",
        color: "#7C3AED",
        description: "For admission to pharmacy postgraduate courses",
        subjects: [
          {
            id: "gpat-pharma",
            name: "Pharmaceutics",
            icon: "💊",
            topics: [
              "Drug Delivery Systems", "Dosage Form Design", "Biopharmaceutics (Absorption, Distribution)",
              "Pharmacokinetics (ADME)", "Novel Drug Delivery", "Pharmaceutical formulation"
            ],
          },
          {
            id: "gpat-chem",
            name: "Pharmaceutical Chemistry",
            icon: "🧪",
            topics: [
              "Medicinal Chemistry (Drug design, SAR)", "Organic Chemistry (Reactions, Mechanisms)",
              "Inorganic Chemistry (Pharmaceutical inorganics)", "Analytical Chemistry",
              "Biochemistry (Metabolism, Enzymes)"
            ],
          },
          {
            id: "gpat-pharma-analysis",
            name: "Pharmaceutical Analysis",
            icon: "🔬",
            topics: [
              "Analytical Methods (Titrations, Spectroscopy)", "Instrumentation (HPLC, GC, UV-Vis)",
              "Quality Control & Assurance", "Drug Testing & Analysis"
            ],
          },
          {
            id: "gpat-pharmaco",
            name: "Pharmacology & Pharmacognosy",
            icon: "💉",
            topics: [
              "General Pharmacology (Drug action)", "Systemic Pharmacology (Drug classes)",
              "Clinical Pharmacy", "Toxicology", "Pharmacognosy (Natural products)"
            ],
          },
        ],
      },
    ],
  },

  // ─── NURSING ───────────────────────────────────────────
  {
    id: "nursing",
    name: "Nursing",
    icon: "⚕️",
    exams: [
      {
        id: "aiims-nursing",
        name: "AIIMS Nursing",
        fullName: "AIIMS - Nursing Officer Exam",
        category: "nursing",
        icon: "⚕️",
        color: "#0891B2",
        description: "For nursing positions at AIIMS",
        subjects: [
          {
            id: "nursing-gk",
            name: "General Knowledge & Awareness",
            icon: "🌐",
            topics: [
              "Current Affairs", "Indian History", "Geography",
              "Polity", "General Science", "Medical & Health Awareness",
              "Healthcare schemes"
            ],
          },
          {
            id: "nursing-reasoning",
            name: "Reasoning Ability",
            icon: "🧩",
            topics: [
              "Logical Reasoning", "Analytical Ability",
              "Verbal Reasoning", "Non-Verbal Reasoning", "Numerical Ability"
            ],
          },
          {
            id: "nursing-subject",
            name: "Nursing & Medical Subjects",
            icon: "💉",
            topics: [
              "Anatomy & Physiology", "Fundamentals of Nursing",
              "Medical-Surgical Nursing", "Community Health Nursing",
              "Mental Health Nursing", "Child Health Nursing (Pediatrics)",
              "Midwifery & Obstetrical Nursing"
            ],
          },
        ],
      },
    ],
  },

  // ─── MORE DEFENSE ──────────────────────────────────────
  {
    id: "more-defense",
    name: "Defense & Armed Forces",
    icon: "⚔️",
    exams: [
      {
        id: "afcat",
        name: "AFCAT",
        fullName: "Air Force Common Admission Test",
        category: "more-defense",
        icon: "✈️",
        color: "#0369A1",
        description: "For Indian Air Force officer positions",
        subjects: [
          {
            id: "afcat-gk",
            name: "General Awareness",
            icon: "🌐",
            topics: [
              "Current Affairs (National & International, last 12 months, Defense news)",
              "Indian History (Ancient, Medieval, Modern, Freedom struggle)",
              "Geography (Indian & World, Physical, Political, Economic)",
              "Indian Polity & Constitution", "Indian Economy",
              "Defense (Indian Air Force - History, Aircraft, Ranks, Organization; Indian Armed Forces)",
              "Sports (National & International events, Awards)",
              "General Science (Physics, Chemistry, Biology basics)",
              "Art & Culture", "Famous Personalities", "Awards & Honors"
            ],
          },
          {
            id: "afcat-verbal",
            name: "Verbal Ability in English",
            icon: "📝",
            topics: [
              "Reading Comprehension (Passages from various topics)",
              "Error Detection (Grammatical errors in sentences)",
              "Synonyms & Antonyms", "Sentence Completion",
              "Idioms & Phrases", "One Word Substitution",
              "Sentence Improvement", "Ordering of Words/Sentences"
            ],
          },
          {
            id: "afcat-numerical",
            name: "Numerical Ability",
            icon: "🔢",
            topics: [
              "Arithmetic (Percentage, Profit & Loss, Ratio & Proportion, Time-Speed-Distance, Time & Work, Simple & Compound Interest, Average)",
              "Algebra (Linear equations, Quadratic equations)",
              "Geometry (Triangles, Circles, Mensuration)",
              "Data Interpretation (Tables, Graphs, Charts)",
              "Number System (Divisibility, HCF, LCM)", "Simplification"
            ],
          },
          {
            id: "afcat-reasoning",
            name: "Reasoning & Military Aptitude",
            icon: "🧩",
            topics: [
              "Spatial Ability (Figure completion, Pattern recognition, Paper folding)",
              "Verbal Reasoning (Analogies, Series, Coding-Decoding, Blood Relations, Direction)",
              "Non-Verbal Reasoning (Figure series, Figure classification, Figure matrix)",
              "Military Aptitude (Defense terminology, Ranks, Aircraft identification, Defense organization)",
              "Numerical Reasoning (Number series)"
            ],
          },
          {
            id: "afcat-ekt",
            name: "EKT - Engineering Knowledge Test",
            icon: "⚙️",
            topics: [
              "Mechanical Engineering (Thermodynamics, Mechanics, Manufacturing, Strength of Materials)",
              "Electrical Engineering (Circuits, Machines, Power systems, Control systems)",
              "Electronics Engineering (Analog & Digital circuits, Signals, Communication)",
              "Computer Science (Data structures, Programming, DBMS, Operating systems)"
            ],
          },
        ],
      },
      {
        id: "indian-navy",
        name: "Indian Navy",
        fullName: "Indian Navy Entrance Exam",
        category: "more-defense",
        icon: "⚓",
        color: "#075985",
        description: "For Indian Navy officer positions",
        subjects: [
          {
            id: "navy-maths",
            name: "Mathematics",
            icon: "🔢",
            topics: [
              "Algebra (Quadratic equations, Polynomials, Logarithms, Progressions)",
              "Trigonometry (Ratios, Identities, Equations, Heights & Distances)",
              "Calculus (Differentiation, Integration, Applications)",
              "Coordinate Geometry (Lines, Circles, Parabola)",
              "Vectors & 3D Geometry", "Matrices & Determinants",
              "Statistics & Probability"
            ],
          },
          {
            id: "navy-physics",
            name: "Physics",
            icon: "⚛️",
            topics: [
              "Mechanics (Kinematics, Laws of Motion, Work Energy Power)",
              "Thermodynamics (Laws, Heat transfer)", "Optics (Ray & Wave optics)",
              "Electricity (Current, Circuits, Magnetism)",
              "Electromagnetism (Electromagnetic induction)",
              "Modern Physics (Atoms, Nuclei, Semiconductors)"
            ],
          },
          {
            id: "navy-english",
            name: "English",
            icon: "📝",
            topics: [
              "Grammar (Tenses, Articles, Prepositions, Voice, Narration)",
              "Vocabulary (Synonyms, Antonyms, One word substitution)",
              "Reading Comprehension", "Error Correction",
              "Sentence Formation & Completion", "Idioms & Phrases"
            ],
          },
          {
            id: "navy-gk",
            name: "General Knowledge & Reasoning",
            icon: "🌐",
            topics: [
              "Current Affairs (National & International, Defense news)",
              "Indian History, Geography & Polity",
              "Defense (Indian Navy - Ships, Ranks, Organization; Armed Forces)",
              "Naval Affairs (Maritime security, Naval operations)",
              "Reasoning (Verbal & Non-verbal, Spatial ability)"
            ],
          },
        ],
      },
      {
        id: "indian-army",
        name: "Indian Army",
        fullName: "Indian Army Technical Entry Scheme",
        category: "more-defense",
        icon: "🎖️",
        color: "#064E3B",
        description: "For Indian Army technical positions",
        subjects: [
          {
            id: "army-maths",
            name: "Mathematics",
            icon: "🔢",
            topics: [
              "Algebra (Equations, Inequalities, Functions, Logarithms, Progressions)",
              "Trigonometry (Ratios, Identities, Equations, Properties of triangles)",
              "Calculus (Limits, Differentiation, Integration, Applications)",
              "Coordinate Geometry (2D - Lines, Circles, Conic sections)",
              "Vectors & 3D Geometry", "Matrices & Determinants",
              "Probability & Statistics"
            ],
          },
          {
            id: "army-physics",
            name: "Physics",
            icon: "⚛️",
            topics: [
              "Mechanics (Motion, Force, Work Energy Power, Rotational motion)",
              "Thermodynamics (Laws, Kinetic theory)", "Waves & Oscillations",
              "Optics (Reflection, Refraction, Interference, Diffraction)",
              "Electricity & Magnetism (Electrostatics, Current electricity, Magnetism, Electromagnetic induction)",
              "Modern Physics (Atoms, Nuclei, Semiconductors)"
            ],
          },
          {
            id: "army-chemistry",
            name: "Chemistry",
            icon: "🧪",
            topics: [
              "Physical Chemistry (Atomic structure, Chemical bonding, States of matter, Thermodynamics, Equilibrium, Electrochemistry, Kinetics)",
              "Inorganic Chemistry (Periodic table, s-block, p-block, d-block, f-block elements, Coordination compounds)",
              "Organic Chemistry (Hydrocarbons, Haloalkanes, Alcohols Phenols Ethers, Aldehydes Ketones, Carboxylic acids, Amines, Biomolecules)"
            ],
          },
        ],
      },
    ],
  },

  // ─── MORE RAILWAYS ─────────────────────────────────────
  {
    id: "more-railways",
    name: "Railway Engineering",
    icon: "🚄",
    exams: [
      {
        id: "rrb-je",
        name: "RRB JE",
        fullName: "Railway Recruitment Board - Junior Engineer",
        category: "more-railways",
        icon: "🔧",
        color: "#0C4A6E",
        description: "For railway junior engineer posts",
        subjects: [
          {
            id: "rrb-je-gen",
            name: "General Awareness",
            icon: "🌐",
            topics: [
              "Current Affairs (National & International, last 6 months)",
              "Indian History (Ancient, Medieval, Modern)",
              "Indian Geography (Physical, Economic)",
              "Indian Polity & Constitution", "Indian Economy",
              "Railway-specific GK (History, Zones, Projects)",
              "Science & Technology", "Sports"
            ],
          },
          {
            id: "rrb-je-reasoning",
            name: "General Intelligence & Reasoning",
            icon: "🧩",
            topics: [
              "Analogies (Verbal & Non-verbal)", "Classification",
              "Series (Number, Letter, Figure)", "Coding-Decoding",
              "Syllogism", "Venn Diagrams", "Blood Relations",
              "Direction and Distance", "Ranking", "Puzzles"
            ],
          },
          {
            id: "rrb-je-maths",
            name: "Mathematics & General Science",
            icon: "🔢",
            topics: [
              "Number System (HCF, LCM, Divisibility)", "Percentage", "Ratio & Proportion",
              "Algebra (Equations, Polynomials)", "Geometry (Triangles, Circles)",
              "Mensuration", "Trigonometry basics",
              "Physics (Mechanics, Heat, Light, Sound, Electricity)",
              "Chemistry (Elements, Compounds, Acids, Bases, Metals)",
              "Biology (Human body, Plants, Diseases)"
            ],
          },
          {
            id: "rrb-je-technical",
            name: "Technical Ability (Branch-wise)",
            icon: "⚙️",
            topics: [
              "Civil Engineering (Building materials, Surveying, Strength of materials, RCC, Soil mechanics, Hydraulics, Transportation)",
              "Mechanical Engineering (Thermodynamics, Strength of materials, Manufacturing, Theory of machines, Fluid mechanics, Heat transfer)",
              "Electrical Engineering (Basic circuits, Machines - DC & AC, Power systems, Measurements, Control systems)",
              "Electronics Engineering (Analog circuits, Digital electronics, Signals & systems, Communication, Microprocessors)"
            ],
          },
        ],
      },
      {
        id: "rrb-alp",
        name: "RRB ALP",
        fullName: "Railway Recruitment Board - Assistant Loco Pilot",
        category: "more-railways",
        icon: "🚂",
        color: "#0E7490",
        description: "For assistant loco pilot posts",
        subjects: [
          {
            id: "rrb-alp-maths",
            name: "Mathematics",
            icon: "🔢",
            topics: [
              "Number System (HCF, LCM, Divisibility, Factors)", "Simplification",
              "Percentage", "Ratio and Proportion", "Average",
              "Profit, Loss & Discount", "Simple & Compound Interest",
              "Time and Work (Pipes & Cisterns)", "Time, Speed and Distance (Trains, Boats)",
              "Problems on Ages", "Algebra (Linear equations)",
              "Geometry (Lines, Angles, Triangles)", "Mensuration (Area, Volume)",
              "Trigonometry basics"
            ],
          },
          {
            id: "rrb-alp-reasoning",
            name: "General Intelligence & Reasoning",
            icon: "🧩",
            topics: [
              "Analogies (Number, Letter, Word)", "Classification (Odd One Out)",
              "Series (Number, Letter, Figure)", "Coding-Decoding",
              "Blood Relations", "Direction and Distance", "Ranking & Time Sequence",
              "Syllogism", "Venn Diagrams", "Mirror & Water Images",
              "Paper Folding & Cutting", "Embedded Figures", "Cubes & Dice"
            ],
          },
          {
            id: "rrb-alp-science",
            name: "General Science",
            icon: "🔬",
            topics: [
              "Physics (Motion, Force, Energy, Heat, Light, Sound, Electricity, Magnetism)",
              "Chemistry (Elements, Compounds, Metals, Non-metals, Acids, Bases, Salts, Chemical reactions)",
              "Biology (Human body systems, Diseases, Nutrition, Plants, Animals)",
              "Life Sciences", "Environmental Science (Pollution, Ecology)"
            ],
          },
          {
            id: "rrb-alp-ga",
            name: "General Awareness & Current Affairs",
            icon: "🌐",
            topics: [
              "Current Affairs (National & International, last 6 months)",
              "Static GK (Books, Authors, Awards, Sports, Capitals, Important Days)",
              "Indian History (Ancient, Medieval, Modern)",
              "Indian Geography (Physical, Economic, States)",
              "Indian Polity & Constitution", "Indian Economy",
              "Railway GK (History, Zones, Important projects)"
            ],
          },
        ],
      },
    ],
  },

  // ─── JUDICIARY ─────────────────────────────────────────
  {
    id: "judiciary",
    name: "Judicial Services",
    icon: "⚖️",
    exams: [
      {
        id: "judicial-services",
        name: "Judicial Services",
        fullName: "State Judicial Services Examination",
        category: "judiciary",
        icon: "⚖️",
        color: "#7C2D12",
        description: "For state judicial service positions",
        subjects: [
          {
            id: "jud-law",
            name: "Law",
            icon: "📚",
            topics: [
              "Constitution of India (Fundamental Rights, DPSPs, Parliamentary system)",
              "Criminal Law (IPC, CrPC, Evidence Act)", "Civil Law (Contract Act, Sale of Goods Act, Specific Relief)",
              "Family Law (Hindu Law, Muslim Law, Succession)", "Property Law (Transfer of Property Act)",
              "Law of Torts", "CPC (Civil Procedure Code)", "Jurisprudence (Legal theories, Interpretation)"
            ],
          },
          {
            id: "jud-gk",
            name: "General Knowledge & Current Affairs",
            icon: "🌐",
            topics: [
              "Current Affairs (National & International)", "Legal Current Affairs (Landmark judgments, New laws)",
              "Indian History", "Geography", "Polity", "Constitutional Developments"
            ],
          },
        ],
      },
    ],
  },

  // ─── FOREST SERVICE ────────────────────────────────────
  {
    id: "forest",
    name: "Forest Service",
    icon: "🌲",
    exams: [
      {
        id: "ifs",
        name: "IFS",
        fullName: "Indian Forest Service",
        category: "forest",
        icon: "🌲",
        color: "#15803D",
        description: "For Indian Forest Service positions",
        subjects: [
          {
            id: "ifs-gs",
            name: "General Studies (Same as UPSC CSE)",
            icon: "📚",
            topics: [
              "Indian History", "Geography", "Indian Polity & Constitution", "Indian Economy",
              "Environment & Ecology (Biodiversity, Climate change, Wildlife conservation)",
              "Forestry (Forest types, Management, Conservation)", "Science & Technology",
              "Current Affairs", "Ethics & Integrity"
            ],
          },
          {
            id: "ifs-csat",
            name: "CSAT (Aptitude Test)",
            icon: "🧩",
            topics: [
              "Reading Comprehension", "Logical Reasoning", "Analytical Ability",
              "Decision Making", "Problem Solving", "Data Interpretation",
              "Basic Numeracy"
            ],
          },
        ],
      },
    ],
  },

  // ─── POST OFFICE ───────────────────────────────────────
  {
    id: "post-office",
    name: "Postal Services",
    icon: "📮",
    exams: [
      {
        id: "gds",
        name: "GDS",
        fullName: "Gramin Dak Sevak (India Post)",
        category: "post-office",
        icon: "📮",
        color: "#DC2626",
        description: "For India Post GDS positions",
        subjects: [
          {
            id: "gds-maths",
            name: "Mathematics",
            icon: "🔢",
            topics: [
              "Number System (HCF, LCM)", "Percentage", "Ratio & Proportion",
              "Profit & Loss", "Simple & Compound Interest", "Average",
              "Time & Work"
            ],
          },
          {
            id: "gds-reasoning",
            name: "Reasoning Ability",
            icon: "🧩",
            topics: [
              "Analogies", "Series (Number, Letter)", "Coding-Decoding",
              "Blood Relations", "Direction Sense", "Ranking"
            ],
          },
          {
            id: "gds-gk",
            name: "General Knowledge",
            icon: "🌐",
            topics: [
              "Current Affairs", "Indian History", "Indian Geography",
              "Indian Polity", "Postal Services & India Post",
              "General Science"
            ],
          },
        ],
      },
      {
        id: "postal-assistant",
        name: "Postal Assistant",
        fullName: "India Post - Postal Assistant/Sorting Assistant",
        category: "post-office",
        icon: "✉️",
        color: "#EF4444",
        description: "For postal/sorting assistant posts",
        subjects: [
          {
            id: "pa-reasoning",
            name: "Reasoning Ability",
            icon: "🧩",
            topics: [
              "Syllogism", "Coding-Decoding", "Blood Relations",
              "Seating Arrangement (Linear, Circular)", "Puzzles", "Inequality",
              "Direction Sense", "Ranking"
            ],
          },
          {
            id: "pa-quant",
            name: "Quantitative Aptitude",
            icon: "🔢",
            topics: [
              "Number Series", "Simplification & Approximation", "Percentage",
              "Profit & Loss", "Simple & Compound Interest", "Data Interpretation (Tables, Charts)",
              "Ratio & Proportion", "Average"
            ],
          },
          {
            id: "pa-english",
            name: "English Language",
            icon: "📝",
            topics: [
              "Reading Comprehension", "Cloze Test",
              "Error Spotting", "Vocabulary (Synonyms, Antonyms)",
              "Sentence Improvement"
            ],
          },
          {
            id: "pa-gk",
            name: "General Knowledge & Current Affairs",
            icon: "🌐",
            topics: [
              "Current Affairs (National & International)", "Banking Awareness",
              "Postal Services & India Post", "Static GK (History, Geography, Polity)"
            ],
          },
        ],
      },
    ],
  },

  // ─── MORE STATE EXAMS ──────────────────────────────────
  {
    id: "more-state-exams",
    name: "More State Exams",
    icon: "🏢",
    exams: [
      {
        id: "kpsc",
        name: "KPSC",
        fullName: "Karnataka Public Service Commission",
        category: "more-state-exams",
        icon: "🏛️",
        color: "#B45309",
        description: "For Karnataka state civil services",
        subjects: [
          {
            id: "kpsc-gs",
            name: "General Studies",
            icon: "📚",
            topics: [
              "Indian History & Karnataka History", "Indian Geography & Karnataka Geography",
              "Indian Polity & Karnataka Administration", "Indian Economy & Karnataka Economy",
              "Science & Technology", "Current Affairs (National & International)",
              "Karnataka-specific Topics (Culture, Literature, Freedom fighters, Development)"
            ],
          },
          {
            id: "kpsc-aptitude",
            name: "Aptitude Test",
            icon: "🧩",
            topics: [
              "Logical Reasoning", "Analytical Ability", "Mental Ability",
              "Data Interpretation", "Basic Numeracy", "Comprehension"
            ],
          },
        ],
      },
      {
        id: "tnpsc",
        name: "TNPSC",
        fullName: "Tamil Nadu Public Service Commission",
        category: "more-state-exams",
        icon: "🏛️",
        color: "#CA8A04",
        description: "For Tamil Nadu state civil services",
        subjects: [
          {
            id: "tnpsc-gs",
            name: "General Studies",
            icon: "📚",
            topics: [
              "Indian History & Tamil Nadu History (Sangam age, Chola, Pandya, Vijayanagara)",
              "Indian Geography & Tamil Nadu Geography", "Indian Polity & Tamil Nadu Administration",
              "Indian Economy & Tamil Nadu Economy", "Science & Technology", "Current Affairs",
              "Tamil Nadu-specific Topics (Culture, Literature, Temples, Freedom movement)",
              "Art & Culture"
            ],
          },
          {
            id: "tnpsc-aptitude",
            name: "Aptitude & Mental Ability",
            icon: "🧩",
            topics: [
              "Logical Reasoning", "Analytical Ability", "Mental Ability",
              "Numerical Ability", "Data Interpretation"
            ],
          },
        ],
      },
      {
        id: "wbpsc",
        name: "WBPSC",
        fullName: "West Bengal Public Service Commission",
        category: "more-state-exams",
        icon: "🏛️",
        color: "#D97706",
        description: "For West Bengal state civil services",
        subjects: [
          {
            id: "wbpsc-gs",
            name: "General Studies",
            icon: "📚",
            topics: [
              "Indian History & West Bengal History (Ancient Bengal, Colonial period, Renaissance)",
              "Indian Geography & West Bengal Geography", "Indian Polity & West Bengal Administration",
              "Indian Economy & West Bengal Economy", "Science & Technology", "Current Affairs",
              "West Bengal-specific Topics"
            ],
          },
        ],
      },
    ],
  },

  // ─── STATISTICAL SERVICES ──────────────────────────────
  {
    id: "statistics",
    name: "Statistical Services",
    icon: "📊",
    exams: [
      {
        id: "isi",
        name: "ISI",
        fullName: "Indian Statistical Institute Admission Test",
        category: "statistics",
        icon: "📊",
        color: "#7C3AED",
        description: "For admission to ISI programs",
        subjects: [
          {
            id: "isi-maths",
            name: "Mathematics",
            icon: "🔢",
            topics: [
              "Algebra (Groups, Rings, Fields, Polynomials)", "Calculus (Limits, Continuity, Differentiation, Integration, Series)",
              "Linear Algebra (Vector spaces, Matrices, Determinants, Eigenvalues)",
              "Probability (Basic probability, Conditional probability, Bayes theorem)",
              "Statistics basics", "Real Analysis (Sequences, Series, Continuity)",
              "Analytical Geometry"
            ],
          },
          {
            id: "isi-stats",
            name: "Statistics",
            icon: "📊",
            topics: [
              "Descriptive Statistics (Measures of central tendency, Dispersion)",
              "Probability Theory (Random variables, Distributions - Binomial, Poisson, Normal)",
              "Inferential Statistics", "Sampling distributions",
              "Hypothesis Testing (t-test, Chi-square)", "Estimation",
              "Regression Analysis (Simple, Multiple)", "Correlation"
            ],
          },
        ],
      },
    ],
  },

  // ─── MASS COMMUNICATION ────────────────────────────────
  {
    id: "mass-comm",
    name: "Mass Communication",
    icon: "📺",
    exams: [
      {
        id: "iimc",
        name: "IIMC",
        fullName: "Indian Institute of Mass Communication",
        category: "mass-comm",
        icon: "📺",
        color: "#F59E0B",
        description: "For admission to IIMC journalism courses",
        subjects: [
          {
            id: "iimc-ga",
            name: "General Awareness & Current Affairs",
            icon: "🌐",
            topics: [
              "Current Affairs (National & International, last 12 months)", "Media Industry (Journalism, Broadcasting, Digital media)",
              "National Affairs (Politics, Economy, Social issues)", "International Affairs (Global events, Relations)",
              "Indian History", "Geography", "Indian Polity & Constitution",
              "Indian Economy", "Social Issues", "Science & Technology"
            ],
          },
          {
            id: "iimc-english",
            name: "English Language & Comprehension",
            icon: "📝",
            topics: [
              "Grammar (Tenses, Articles, Prepositions)", "Vocabulary (Synonyms, Antonyms, Idioms)",
              "Reading Comprehension", "Writing Skills (Essay, Precis)",
              "Communication (Effective writing for media)"
            ],
          },
          {
            id: "iimc-reasoning",
            name: "Reasoning & Aptitude",
            icon: "🧩",
            topics: [
              "Logical Reasoning (Syllogisms, Analogies)", "Analytical Ability",
              "Verbal Reasoning", "Numerical Ability (Basic arithmetic, Data interpretation)",
              "Critical Thinking"
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
