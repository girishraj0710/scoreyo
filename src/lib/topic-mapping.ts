/**
 * Topic Mapping Layer
 *
 * Maps granular topic strings from exams.ts to actual database topic strings.
 * This fixes the 88.7% empty topic issue by leveraging existing 22K+ questions.
 *
 * Problem: exams.ts defines granular topics like "Kinematics", "Laws of Motion"
 * Reality: Database has broader topics like "Mechanics", "Electromagnetism"
 *
 * Solution: Map granular → broad to use existing questions immediately.
 */

interface TopicMapping {
  [key: string]: string;
}

interface ExamSubjectMappings {
  [examSubjectKey: string]: TopicMapping;
}

/**
 * Comprehensive topic mappings for all exams
 * Format: 'exam_id:subject_id' -> { 'Frontend Topic' -> 'Database Topic' }
 */
const topicMappings: ExamSubjectMappings = {
  // ═══════════════════════════════════════════════════════════════
  // JEE MAIN - PHYSICS
  // ═══════════════════════════════════════════════════════════════
  'jee-main:jee-physics': {
    // Mechanics grouping
    'Kinematics': 'Mechanics',
    'Laws of Motion': 'Mechanics',
    'Work Energy Power': 'Mechanics',
    'Rotational Motion': 'Mechanics',
    'Gravitation': 'Mechanics',
    'Fluid Mechanics': 'Mechanics',
    'Units & Measurements': 'Mechanics',

    // Electromagnetism grouping
    'Current Electricity': 'Electromagnetism',
    'Magnetism': 'Electromagnetism',
    'Electromagnetic Induction': 'Electromagnetism',
    'Electrostatics': 'Electromagnetism',

    // Optics grouping
    'Ray Optics': 'Optics',
    'Wave Optics': 'Optics',

    // Modern Physics grouping
    'Dual Nature of Radiation': 'Modern Physics',
    'Atomic Structure': 'Modern Physics',
    'Nuclear Physics': 'Modern Physics',

    // Semiconductors (exact match exists now)
    'Semiconductors': 'Semiconductors & Communication (Diodes, Transistors, Logic gates)',

    // Direct matches (leave as-is)
    'Thermodynamics': 'Thermodynamics',
    'Waves & Oscillations': 'Waves & Oscillations',
    'Optics': 'Optics',
    'Modern Physics': 'Modern Physics',
    'Mechanics': 'Mechanics',
  },

  // ═══════════════════════════════════════════════════════════════
  // JEE MAIN - CHEMISTRY
  // ═══════════════════════════════════════════════════════════════
  'jee-main:jee-chemistry': {
    // Physical Chemistry grouping
    'Thermodynamics': 'Physical Chemistry',
    'Equilibrium': 'Physical Chemistry',
    'Redox Reactions': 'Physical Chemistry',
    'Electrochemistry': 'Physical Chemistry',
    'Chemical Kinetics': 'Physical Chemistry',
    'Surface Chemistry': 'Physical Chemistry',
    'Atomic Structure': 'Physical Chemistry',
    'Chemical Bonding': 'Physical Chemistry',

    // Organic Chemistry grouping
    'Organic Chemistry Basics': 'Organic Chemistry',
    'Hydrocarbons': 'Organic Chemistry',
    'Polymers': 'Organic Chemistry',
    'Aldehydes & Ketones': 'Organic Chemistry',
    'Amines': 'Organic Chemistry',
    'Biomolecules': 'Organic Chemistry',
    'Alcohols Phenols Ethers': 'Organic Chemistry',
    'Carboxylic Acids': 'Organic Chemistry',

    // Inorganic Chemistry grouping
    'Periodic Table': 'Inorganic Chemistry',
    'Coordination Compounds': 'Inorganic Chemistry',
    'd-Block Elements': 'Inorganic Chemistry',
    'p-Block Elements': 'Inorganic Chemistry',
    's-Block Elements': 'Inorganic Chemistry',
    'Metallurgy': 'Inorganic Chemistry',
  },

  // ═══════════════════════════════════════════════════════════════
  // JEE MAIN - MATHEMATICS
  // ═══════════════════════════════════════════════════════════════
  'jee-main:jee-maths': {
    // Algebra grouping
    'Complex Numbers': 'Algebra',
    'Matrices & Determinants': 'Algebra',
    'Permutations & Combinations': 'Algebra',
    'Binomial Theorem': 'Algebra',
    'Sequences & Series': 'Algebra',
    'Quadratic Equations': 'Algebra',
    'Logarithms': 'Algebra',

    // Calculus grouping
    'Limits & Continuity': 'Calculus',
    'Differentiation': 'Calculus',
    'Integration': 'Calculus',
    'Differential Equations': 'Calculus',
    'Application of Derivatives': 'Calculus',
    'Application of Integrals': 'Calculus',

    // Coordinate Geometry grouping
    'Straight Lines': 'Coordinate Geometry',
    'Conic Sections': 'Coordinate Geometry',
    'Circles': 'Coordinate Geometry',
    'Parabola': 'Coordinate Geometry',
    'Ellipse': 'Coordinate Geometry',
    'Hyperbola': 'Coordinate Geometry',

    // Vectors & 3D grouping
    'Vectors & 3D Geometry': 'Vectors and 3D Geometry',
    'Vectors': 'Vectors and 3D Geometry',
    '3D Geometry': 'Vectors and 3D Geometry',

    // Trigonometry
    'Trigonometry': 'Trigonometry',
    'Inverse Trigonometry': 'Trigonometry',

    // Probability & Statistics
    'Probability': 'Probability and Statistics',
    'Statistics & Probability': 'Probability and Statistics',
    'Statistics': 'Probability and Statistics',

    // Sets & Relations
    'Sets & Relations': 'Sets Relations and Functions',
    'Functions': 'Sets Relations and Functions',
  },

  // ═══════════════════════════════════════════════════════════════
  // JEE ADVANCED - PHYSICS
  // ═══════════════════════════════════════════════════════════════
  'jee-advanced:jee-adv-physics': {
    'Mechanics (Kinematics, Dynamics, Gravitation)': 'Mechanics',
    'Electrodynamics': 'Electromagnetism',
    'Geometric Optics': 'Optics',
    'Physical Optics': 'Optics',
    'Wave Motion & Sound': 'Waves & Oscillations',
    'Heat & Thermodynamics': 'Thermodynamics',
    'Atomic Physics': 'Modern Physics',
    'Nuclear Physics': 'Modern Physics',
    'Semiconductors': 'Semiconductors & Communication (Diodes, Transistors, Logic gates)',
    'Rotational Dynamics': 'Mechanics',
    'Fluid Mechanics': 'Mechanics',
    'SHM & Waves': 'Waves & Oscillations',
    'Electrostatics & Capacitance': 'Electromagnetism',
    'Current Electricity & Circuits': 'Electromagnetism',
    'Magnetism & Electromagnetic Induction': 'Electromagnetism',
  },

  // ═══════════════════════════════════════════════════════════════
  // JEE ADVANCED - CHEMISTRY
  // ═══════════════════════════════════════════════════════════════
  'jee-advanced:jee-adv-chemistry': {
    'Physical Chemistry (Thermodynamics, Equilibrium)': 'Physical Chemistry',
    'Organic Chemistry (Advanced)': 'Organic Chemistry',
    'Inorganic Chemistry (Coordination, Transition)': 'Inorganic Chemistry',
    'Atomic Structure & Periodicity': 'Physical Chemistry',
    'Chemical Bonding': 'Physical Chemistry',
    'Chemical Kinetics & Equilibrium': 'Physical Chemistry',
    'Electrochemistry': 'Physical Chemistry',
    'Organic Reactions & Mechanisms': 'Organic Chemistry',
    'Stereochemistry': 'Organic Chemistry',
    'Coordination Compounds': 'Inorganic Chemistry',
    'Transition Elements': 'Inorganic Chemistry',
  },

  // ═══════════════════════════════════════════════════════════════
  // JEE ADVANCED - MATHEMATICS
  // ═══════════════════════════════════════════════════════════════
  'jee-advanced:jee-adv-maths': {
    'Algebra (Matrices, Determinants, Complex)': 'Algebra',
    'Calculus (Limits, Differentiation, Integration, DE)': 'Calculus',
    'Coordinate Geometry (Straight Lines, Circles, Conic Sections)': 'Coordinate Geometry',
    'Vectors & 3D Geometry': 'Vectors and 3D Geometry',
    'Probability & Statistics': 'Probability and Statistics',
    'Trigonometry & Inverse Trigonometry': 'Trigonometry',
    'Complex Numbers': 'Algebra',
    'Matrices & Determinants': 'Algebra',
    'Differential Equations': 'Calculus',
    'Integral Calculus': 'Calculus',
  },

  // ═══════════════════════════════════════════════════════════════
  // NEET UG - PHYSICS
  // ═══════════════════════════════════════════════════════════════
  'neet-ug:neet-physics': {
    'Mechanics (Kinematics, Laws of Motion, Work Energy Power, Rotational Motion)': 'Mechanics',
    'Kinematics': 'Mechanics',
    'Laws of Motion': 'Mechanics',
    'Work Energy Power': 'Mechanics',
    'Rotational Motion': 'Mechanics',
    'Gravitation (Universal law, Planetary motion, Satellites)': 'Mechanics',
    'Properties of Matter (Elasticity, Viscosity, Surface Tension)': 'Mechanics',

    'Heat & Thermodynamics (Laws of Thermodynamics, Kinetic Theory)': 'Thermodynamics',

    'Electrostatics (Coulomb\'s Law, Electric Field, Potential, Capacitance)': 'Electromagnetism',
    'Current Electricity (Ohm\'s Law, Kirchhoff\'s Laws, Heating effect)': 'Electromagnetism',
    'Magnetic Effects of Current (Biot-Savart, Ampere\'s Law)': 'Electromagnetism',
    'Electromagnetic Induction (Faraday\'s Law, Lenz\'s Law, AC)': 'Electromagnetism',

    'Optics (Ray Optics - Reflection, Refraction, Lenses; Wave Optics - Interference, Diffraction)': 'Optics',
    'Ray Optics': 'Optics',
    'Wave Optics': 'Optics',

    'Modern Physics (Photoelectric Effect, Bohr\'s Model, Radioactivity, Nuclear Physics)': 'Modern Physics',
    'Waves & Oscillations (SHM, Wave motion, Sound waves)': 'Waves & Oscillations',
    'Semiconductors & Communication (Diodes, Transistors, Logic gates)': 'Semiconductors & Communication (Diodes, Transistors, Logic gates)',
  },

  // ═══════════════════════════════════════════════════════════════
  // NEET UG - CHEMISTRY
  // ═══════════════════════════════════════════════════════════════
  'neet-ug:neet-chemistry': {
    // Physical Chemistry
    'Atomic Structure (Quantum numbers, Electronic configuration)': 'Physical Chemistry',
    'Chemical Bonding (Ionic, Covalent, Hydrogen bonding, Hybridization)': 'Physical Chemistry',
    'States of Matter (Gas laws, Liquid state)': 'Physical Chemistry',
    'Thermodynamics (Laws, Enthalpy, Entropy, Gibbs energy)': 'Physical Chemistry',
    'Equilibrium (Chemical equilibrium, Ionic equilibrium, pH)': 'Physical Chemistry',
    'Redox Reactions (Oxidation number, Balancing)': 'Physical Chemistry',
    'Electrochemistry (Cells, Nernst equation, Electrolysis)': 'Physical Chemistry',
    'Chemical Kinetics (Rate laws, Order, Arrhenius equation)': 'Physical Chemistry',
    'Surface Chemistry (Adsorption, Colloids, Emulsions)': 'Physical Chemistry',

    // Inorganic Chemistry
    'Periodic Table (Periodic properties, s-block, p-block, d-block, f-block)': 'Inorganic Chemistry',
    's-Block Elements': 'Inorganic Chemistry',
    'p-Block Elements': 'Inorganic Chemistry',
    'd-Block & f-Block Elements (Transition, Inner transition)': 'Inorganic Chemistry',
    'Coordination Compounds (Werner\'s theory, Nomenclature, Isomerism)': 'Inorganic Chemistry',
    'Metallurgy (Ores, Extraction, Refining)': 'Inorganic Chemistry',

    // Organic Chemistry
    'Organic Chemistry Basics (IUPAC, Isomerism, Reaction mechanisms)': 'Organic Chemistry',
    'Hydrocarbons (Alkanes, Alkenes, Alkynes, Aromatic)': 'Organic Chemistry',
    'Haloalkanes & Haloarenes': 'Organic Chemistry',
    'Alcohols, Phenols & Ethers': 'Organic Chemistry',
    'Aldehydes, Ketones & Carboxylic Acids': 'Organic Chemistry',
    'Amines': 'Organic Chemistry',
    'Biomolecules (Carbohydrates, Proteins, Nucleic acids, Vitamins)': 'Organic Chemistry',
    'Polymers (Addition, Condensation, Natural polymers)': 'Organic Chemistry',
    'Chemistry in Everyday Life (Drugs, Detergents)': 'Organic Chemistry',
  },

  // ═══════════════════════════════════════════════════════════════
  // NEET UG - BIOLOGY
  // ═══════════════════════════════════════════════════════════════
  'neet-ug:neet-biology': {
    // Botany
    'Plant Kingdom (Classification, Algae, Bryophytes, Pteridophytes, Gymnosperms, Angiosperms)': 'Botany',
    'Plant Anatomy (Tissues, Meristems, Root, Stem, Leaf)': 'Botany',
    'Plant Morphology (Root, Stem, Leaf, Flower, Fruit, Seed)': 'Botany',
    'Plant Physiology (Photosynthesis, Respiration, Plant hormones, Transport)': 'Botany',
    'Reproduction in Plants (Asexual, Sexual, Pollination, Fertilization)': 'Botany',

    // Zoology
    'Animal Kingdom (Classification, Invertebrates, Vertebrates)': 'Zoology',
    'Human Physiology (Digestion, Respiration, Circulation, Excretion, Nervous, Endocrine)': 'Zoology',
    'Reproduction (Human reproductive system, Fertilization, Pregnancy)': 'Zoology',

    // Genetics & Evolution
    'Genetics (Mendel\'s laws, Chromosomal theory, DNA, RNA, Protein synthesis)': 'Genetics',
    'Molecular Basis of Inheritance (DNA replication, Transcription, Translation)': 'Genetics',
    'Evolution (Origin of life, Darwin\'s theory, Natural selection, Speciation)': 'Evolution',

    // Ecology
    'Ecology (Ecosystem, Food chain, Biogeochemical cycles, Population ecology)': 'Ecology',
    'Biodiversity & Conservation (Biodiversity, Threats, Conservation)': 'Ecology',
    'Environmental Issues (Pollution, Climate change, Ozone depletion)': 'Ecology',
  },

  // ═══════════════════════════════════════════════════════════════
  // UPSC PRELIMS - GENERAL STUDIES
  // ═══════════════════════════════════════════════════════════════
  'upsc-prelims:upsc-gs': {
    'Indian History (Ancient, Medieval, Modern, Art & Culture)': 'History',
    'Ancient India': 'History',
    'Medieval India': 'History',
    'Modern India': 'History',
    'Art & Culture': 'History',

    'Indian Polity & Governance (Constitution, Political System, Governance)': 'Polity',
    'Constitution': 'Polity',
    'Political System': 'Polity',
    'Governance': 'Polity',

    'Indian Geography (Physical, Economic, Human)': 'Geography',
    'World Geography': 'Geography',
    'Physical Geography': 'Geography',
    'Economic Geography': 'Geography',

    'Indian Economy (Planning, Development, Finance)': 'Economy',
    'Economic Development': 'Economy',
    'Finance & Banking': 'Economy',

    'Science & Technology (General Science, Current S&T)': 'Science & Technology',
    'General Science': 'Science & Technology',

    'Environment & Ecology (Biodiversity, Climate Change, Conservation)': 'Environment',
    'Current Affairs (Last 12 months - dynamic content)': 'Current Affairs',
    'International Relations (Contemporary issues, Bilateral relations)': 'International Relations',
  },

  // ═══════════════════════════════════════════════════════════════
  // SSC CGL - SUBJECTS
  // ═══════════════════════════════════════════════════════════════
  'ssc-cgl:ssc-quant': {
    'Number Systems (HCF, LCM, Divisibility)': 'Quantitative Aptitude',
    'Simplification (BODMAS, Approximation)': 'Quantitative Aptitude',
    'Average': 'Quantitative Aptitude',
    'Percentage': 'Quantitative Aptitude',
    'Ratio and Proportion': 'Quantitative Aptitude',
    'Profit, Loss and Discount': 'Quantitative Aptitude',
    'Simple Interest and Compound Interest': 'Quantitative Aptitude',
    'Time and Work (Pipes & Cisterns)': 'Quantitative Aptitude',
    'Time, Speed and Distance (Boats & Streams)': 'Quantitative Aptitude',
    'Algebra (Equations, Inequalities)': 'Quantitative Aptitude',
    'Geometry (Triangles, Circles, Quadrilaterals)': 'Quantitative Aptitude',
    'Mensuration (Area, Volume)': 'Quantitative Aptitude',
    'Trigonometry (Heights & Distances)': 'Quantitative Aptitude',
    'Data Interpretation (Tables, Bar, Line, Pie Charts)': 'Quantitative Aptitude',
  },

  'ssc-cgl:ssc-reasoning': {
    'Verbal Reasoning (Analogies, Classification, Series)': 'Reasoning Ability',
    'Non-Verbal Reasoning (Pattern, Series, Analogy)': 'Reasoning Ability',
    'Seating Arrangement': 'Reasoning Ability',
    'Puzzle': 'Reasoning Ability',
    'Syllogism': 'Reasoning Ability',
    'Blood Relations': 'Reasoning Ability',
    'Direction Sense': 'Reasoning Ability',
    'Coding-Decoding': 'Reasoning Ability',
  },

  'ssc-cgl:ssc-english': {
    'Reading Comprehension': 'English Language',
    'Vocabulary (Synonyms, Antonyms, Idioms)': 'English Language',
    'Grammar (Tenses, Articles, Prepositions, etc.)': 'English Language',
    'Sentence Improvement': 'English Language',
    'Error Detection': 'English Language',
    'Fill in the Blanks': 'English Language',
    'Cloze Test': 'English Language',
  },

  'ssc-cgl:ssc-ga': {
    'Current Affairs (Last 6-12 months)': 'General Awareness',
    'Static GK (Geography, History, Polity, Economy, Science)': 'General Awareness',
    'Indian History': 'General Awareness',
    'Geography': 'General Awareness',
    'Polity': 'General Awareness',
    'Economy': 'General Awareness',
    'Science & Technology': 'General Awareness',
  },
};

/**
 * Maps a granular topic to its database equivalent
 * @param examId - The exam identifier
 * @param subjectId - The subject identifier
 * @param topic - The granular topic string from exams.ts
 * @returns Mapped database topic string, or original if no mapping exists
 */
export function mapTopicToDatabase(
  examId: string,
  subjectId: string,
  topic: string
): string {
  const key = `${examId}:${subjectId}`;
  const mapping = topicMappings[key];

  if (!mapping) {
    // No mapping defined for this exam:subject combination
    return topic;
  }

  const mappedTopic = mapping[topic];

  if (mappedTopic) {
    console.log(`[Topic Mapping] ${examId}:${subjectId} | "${topic}" → "${mappedTopic}"`);
    return mappedTopic;
  }

  // No specific mapping for this topic, return original
  return topic;
}

/**
 * Checks if a topic has a mapping defined
 */
export function hasTopicMapping(
  examId: string,
  subjectId: string,
  topic: string
): boolean {
  const key = `${examId}:${subjectId}`;
  return topicMappings[key]?.[topic] !== undefined;
}

/**
 * Gets all mappings for an exam:subject combination
 */
export function getExamSubjectMappings(
  examId: string,
  subjectId: string
): TopicMapping | undefined {
  const key = `${examId}:${subjectId}`;
  return topicMappings[key];
}

/**
 * Statistics about topic mappings
 */
export function getMappingStats() {
  let totalExamSubjects = 0;
  let totalMappings = 0;

  for (const key in topicMappings) {
    totalExamSubjects++;
    totalMappings += Object.keys(topicMappings[key]).length;
  }

  return {
    examSubjectCombinations: totalExamSubjects,
    totalTopicMappings: totalMappings,
    averageMappingsPerSubject: Math.round(totalMappings / totalExamSubjects),
  };
}
