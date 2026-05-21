#!/usr/bin/env tsx
/**
 * COMPREHENSIVE EXAM TOPIC VALIDATION
 *
 * This script validates that each exam has the CORRECT topics according to
 * official syllabi. It will:
 * 1. Load official syllabus for each exam
 * 2. Compare with current topics in exams.ts
 * 3. Identify missing topics
 * 4. Identify irrelevant topics
 * 5. Generate a cleanup/update plan
 */

import { examCategories } from "../src/lib/exams";

// Official syllabus references
const officialSyllabi: Record<string, {
  name: string;
  subjects: Record<string, {
    name: string;
    officialTopics: string[];
    notes?: string;
  }>;
}> = {
  "jee-main": {
    name: "JEE Main",
    subjects: {
      "jee-physics": {
        name: "Physics",
        officialTopics: [
          // Section A: Mechanics
          "Units & Measurements",
          "Kinematics",
          "Laws of Motion",
          "Work Energy Power",
          "Rotational Motion",
          "Gravitation",
          "Properties of Solids & Liquids",
          "Fluid Mechanics",

          // Section B: Thermal & Kinetic Theory
          "Thermodynamics",
          "Kinetic Theory of Gases",

          // Section C: Oscillations & Waves
          "Oscillations",
          "Waves",

          // Section D: Optics
          "Ray Optics",
          "Wave Optics",

          // Section E: Electricity & Magnetism
          "Electrostatics",
          "Current Electricity",
          "Magnetic Effects of Current",
          "Magnetism & Matter",
          "Electromagnetic Induction",
          "Alternating Current",
          "Electromagnetic Waves",

          // Section F: Modern Physics
          "Dual Nature of Radiation",
          "Atoms & Nuclei",
          "Electronic Devices",
          "Communication Systems"
        ],
        notes: "Based on NTA JEE Main 2024 syllabus"
      },
      "jee-chemistry": {
        name: "Chemistry",
        officialTopics: [
          // Physical Chemistry
          "Atomic Structure",
          "Chemical Bonding",
          "States of Matter",
          "Thermodynamics",
          "Chemical Equilibrium",
          "Ionic Equilibrium",
          "Redox Reactions",
          "Electrochemistry",
          "Chemical Kinetics",
          "Surface Chemistry",
          "Solutions",

          // Inorganic Chemistry
          "Periodic Table",
          "s-Block Elements",
          "p-Block Elements",
          "d-Block & f-Block Elements",
          "Coordination Compounds",
          "Metallurgy",
          "Hydrogen",
          "Environmental Chemistry",

          // Organic Chemistry
          "Organic Chemistry Basics",
          "Hydrocarbons",
          "Haloalkanes & Haloarenes",
          "Alcohols Phenols Ethers",
          "Aldehydes Ketones",
          "Carboxylic Acids",
          "Amines",
          "Biomolecules",
          "Polymers",
          "Chemistry in Everyday Life"
        ],
        notes: "Based on NTA JEE Main 2024 syllabus"
      },
      "jee-maths": {
        name: "Mathematics",
        officialTopics: [
          // Algebra
          "Sets Relations Functions",
          "Complex Numbers",
          "Quadratic Equations",
          "Sequences & Series",
          "Permutations & Combinations",
          "Binomial Theorem",
          "Matrices & Determinants",

          // Calculus
          "Limits Continuity",
          "Differentiation",
          "Applications of Derivatives",
          "Integration",
          "Applications of Integrals",
          "Differential Equations",

          // Coordinate Geometry
          "Straight Lines",
          "Circles",
          "Conic Sections",
          "3D Geometry",

          // Vector Algebra & Trigonometry
          "Vectors",
          "Trigonometry",
          "Inverse Trigonometry",

          // Statistics & Probability
          "Statistics",
          "Probability",
          "Mathematical Reasoning"
        ],
        notes: "Based on NTA JEE Main 2024 syllabus"
      }
    }
  },

  "neet-ug": {
    name: "NEET UG",
    subjects: {
      "neet-physics": {
        name: "Physics",
        officialTopics: [
          // Class XI
          "Units & Measurements",
          "Kinematics",
          "Laws of Motion",
          "Work Energy Power",
          "Rotational Motion",
          "Gravitation",
          "Properties of Solids",
          "Properties of Liquids",
          "Thermodynamics",
          "Kinetic Theory of Gases",
          "Oscillations",
          "Waves",

          // Class XII
          "Electrostatics",
          "Current Electricity",
          "Magnetic Effects of Current",
          "Magnetism & Matter",
          "Electromagnetic Induction",
          "Alternating Current",
          "Electromagnetic Waves",
          "Ray Optics",
          "Wave Optics",
          "Dual Nature of Radiation",
          "Atoms & Nuclei",
          "Electronic Devices",
          "Communication Systems"
        ],
        notes: "Based on NTA NEET 2024 syllabus (NCERT XI & XII)"
      },
      "neet-chemistry": {
        name: "Chemistry",
        officialTopics: [
          // Class XI Physical
          "Basic Concepts of Chemistry",
          "Atomic Structure",
          "Chemical Bonding",
          "States of Matter",
          "Thermodynamics",
          "Chemical Equilibrium",
          "Redox Reactions",

          // Class XI Inorganic
          "Periodic Table",
          "s-Block Elements",
          "p-Block Elements",
          "Hydrogen",
          "Environmental Chemistry",

          // Class XI Organic
          "Organic Chemistry Basics",
          "Hydrocarbons",

          // Class XII Physical
          "Solutions",
          "Electrochemistry",
          "Chemical Kinetics",
          "Surface Chemistry",

          // Class XII Inorganic
          "d-Block & f-Block Elements",
          "Coordination Compounds",
          "Metallurgy",

          // Class XII Organic
          "Haloalkanes & Haloarenes",
          "Alcohols Phenols Ethers",
          "Aldehydes Ketones",
          "Carboxylic Acids",
          "Amines",
          "Biomolecules",
          "Polymers",
          "Chemistry in Everyday Life"
        ],
        notes: "Based on NTA NEET 2024 syllabus (NCERT XI & XII)"
      },
      "neet-biology": {
        name: "Biology (Botany & Zoology)",
        officialTopics: [
          // Botany XI
          "Living World",
          "Biological Classification",
          "Plant Kingdom",
          "Morphology of Flowering Plants",
          "Anatomy of Flowering Plants",
          "Cell Structure",
          "Cell Division",
          "Plant Physiology",
          "Photosynthesis",
          "Respiration",
          "Plant Growth",

          // Botany XII
          "Reproduction in Plants",
          "Sexual Reproduction in Plants",
          "Plant Genetics",
          "Molecular Basis of Inheritance",
          "Evolution",
          "Plant Biotechnology",
          "Plant Ecology",

          // Zoology XI
          "Animal Kingdom",
          "Structural Organization in Animals",
          "Cell Biology",
          "Biomolecules",
          "Digestion & Absorption",
          "Breathing & Respiration",
          "Body Fluids & Circulation",
          "Excretory System",
          "Locomotion & Movement",
          "Neural Control",
          "Chemical Coordination",

          // Zoology XII
          "Reproduction in Organisms",
          "Sexual Reproduction in Humans",
          "Reproductive Health",
          "Genetics & Inheritance",
          "Molecular Genetics",
          "Evolution",
          "Human Health & Disease",
          "Microbes in Human Welfare",
          "Biotechnology",
          "Ecology & Environment",
          "Biodiversity & Conservation"
        ],
        notes: "Based on NTA NEET 2024 syllabus (NCERT XI & XII)"
      }
    }
  },

  "upsc-cse": {
    name: "UPSC Civil Services",
    subjects: {
      "upsc-history": {
        name: "Indian History & Culture",
        officialTopics: [
          "Ancient India - Indus Valley",
          "Ancient India - Vedic Period",
          "Ancient India - Mauryan Empire",
          "Ancient India - Post-Mauryan Period",
          "Medieval India - Delhi Sultanate",
          "Medieval India - Mughal Empire",
          "Medieval India - Regional Kingdoms",
          "Modern India - British Rule",
          "Modern India - Indian National Movement",
          "Modern India - Freedom Struggle",
          "Modern India - Post Independence",
          "Art & Culture - Architecture",
          "Art & Culture - Literature",
          "Art & Culture - Painting & Music",
          "World History - Renaissance",
          "World History - Industrial Revolution",
          "World History - World Wars",
          "World History - Cold War"
        ],
        notes: "Based on UPSC CSE GS Paper 1 syllabus"
      },
      "upsc-polity": {
        name: "Indian Polity & Governance",
        officialTopics: [
          "Constitution - Preamble",
          "Constitution - Fundamental Rights",
          "Constitution - Directive Principles",
          "Constitution - Fundamental Duties",
          "Constitution - Union Government",
          "Constitution - State Government",
          "Constitution - Local Government",
          "Constitution - Constitutional Bodies",
          "Judiciary - Supreme Court",
          "Judiciary - High Courts",
          "Judiciary - Public Interest Litigation",
          "Parliament - Structure & Functions",
          "Parliament - Parliamentary Procedures",
          "Federalism - Centre-State Relations",
          "Elections - Electoral System",
          "Elections - Election Commission",
          "Governance - e-Governance",
          "Governance - Transparency & Accountability",
          "Social Justice - Rights Issues",
          "Social Justice - Welfare Schemes"
        ],
        notes: "Based on UPSC CSE GS Paper 2 syllabus"
      },
      "upsc-geography": {
        name: "Geography",
        officialTopics: [
          "Physical Geography - Earth Structure",
          "Physical Geography - Landforms",
          "Physical Geography - Climate",
          "Physical Geography - Oceanography",
          "Physical Geography - Biogeography",
          "World Geography - Continents",
          "World Geography - Major Countries",
          "World Geography - Resources",
          "Indian Geography - Physical Features",
          "Indian Geography - Climate & Monsoon",
          "Indian Geography - Rivers & Water Resources",
          "Indian Geography - Agriculture",
          "Indian Geography - Industries",
          "Indian Geography - Transport",
          "Indian Geography - Natural Resources",
          "Environmental Geography - Ecology",
          "Environmental Geography - Conservation",
          "Environmental Geography - Climate Change"
        ],
        notes: "Based on UPSC CSE GS Paper 1 syllabus"
      },
      "upsc-economy": {
        name: "Indian Economy",
        officialTopics: [
          "Economic Concepts - National Income",
          "Economic Concepts - GDP & GNP",
          "Economic Concepts - Inflation",
          "Indian Economy - Planning",
          "Indian Economy - Five Year Plans",
          "Indian Economy - NITI Aayog",
          "Sectors - Agriculture",
          "Sectors - Industry",
          "Sectors - Services",
          "Banking & Finance - RBI",
          "Banking & Finance - Monetary Policy",
          "Banking & Finance - Fiscal Policy",
          "Budget - Union Budget",
          "Budget - Tax System",
          "International Trade - WTO",
          "International Trade - Foreign Trade Policy",
          "Economic Reforms - LPG Reforms",
          "Economic Reforms - GST",
          "Social Sector - Poverty & Unemployment",
          "Social Sector - Government Schemes"
        ],
        notes: "Based on UPSC CSE GS Paper 3 syllabus"
      },
      "upsc-science": {
        name: "Science & Technology",
        officialTopics: [
          "Physics - Mechanics",
          "Physics - Heat & Thermodynamics",
          "Physics - Optics",
          "Physics - Electricity & Magnetism",
          "Chemistry - Matter & States",
          "Chemistry - Acids Bases Salts",
          "Chemistry - Metals & Non-metals",
          "Biology - Cell Biology",
          "Biology - Genetics",
          "Biology - Human Body",
          "Biology - Diseases",
          "Technology - Information Technology",
          "Technology - Space Technology",
          "Technology - Defense Technology",
          "Technology - Biotechnology",
          "Technology - Nanotechnology",
          "Environment - Pollution",
          "Environment - Climate Change",
          "Environment - Conservation"
        ],
        notes: "Based on UPSC CSE GS Paper 3 syllabus"
      },
      "upsc-current": {
        name: "Current Affairs & General Studies",
        officialTopics: [
          "National Affairs - Government Policies",
          "National Affairs - Schemes",
          "National Affairs - Social Issues",
          "International Affairs - Foreign Policy",
          "International Affairs - International Organizations",
          "International Affairs - Global Issues",
          "Economics - Economic Developments",
          "Economics - Budget Updates",
          "Science & Tech - Recent Innovations",
          "Science & Tech - Space Missions",
          "Environment - Recent Issues",
          "Environment - Conservation Efforts",
          "Sports - Major Events",
          "Sports - Indian Achievements",
          "Awards & Honors - National Awards",
          "Awards & Honors - International Awards"
        ],
        notes: "Dynamic - updated monthly"
      },
      "upsc-ethics": {
        name: "Ethics, Integrity & Aptitude",
        officialTopics: [
          "Ethics - Basic Concepts",
          "Ethics - Moral Philosophy",
          "Ethics - Public Service Values",
          "Ethics - Probity in Governance",
          "Case Studies - Ethical Dilemmas",
          "Case Studies - Administrative Issues",
          "Attitude - Emotional Intelligence",
          "Attitude - Aptitude & Foundational Values",
          "Integrity - Anti-Corruption",
          "Integrity - Transparency & Accountability"
        ],
        notes: "Based on UPSC CSE GS Paper 4 syllabus"
      }
    }
  },

  "ssc-cgl": {
    name: "SSC CGL",
    subjects: {
      "ssc-quant": {
        name: "Quantitative Aptitude",
        officialTopics: [
          "Arithmetic - Number System",
          "Arithmetic - HCF & LCM",
          "Arithmetic - Percentage",
          "Arithmetic - Profit & Loss",
          "Arithmetic - Ratio & Proportion",
          "Arithmetic - Time & Work",
          "Arithmetic - Time & Distance",
          "Arithmetic - Simple Interest",
          "Arithmetic - Compound Interest",
          "Arithmetic - Average",
          "Arithmetic - Mixtures & Alligations",
          "Algebra - Basic Algebra",
          "Algebra - Linear Equations",
          "Algebra - Quadratic Equations",
          "Geometry - Lines & Angles",
          "Geometry - Triangles",
          "Geometry - Circles",
          "Geometry - Quadrilaterals",
          "Mensuration - Area & Perimeter",
          "Mensuration - Volume & Surface Area",
          "Trigonometry - Basic Trigonometry",
          "Trigonometry - Heights & Distances",
          "Statistics - Mean Median Mode",
          "Statistics - Data Interpretation"
        ],
        notes: "Based on SSC CGL 2024 syllabus"
      },
      "ssc-reasoning": {
        name: "General Intelligence & Reasoning",
        officialTopics: [
          "Analogies",
          "Similarities & Differences",
          "Coding-Decoding",
          "Series - Number Series",
          "Series - Letter Series",
          "Classification",
          "Direction Sense",
          "Blood Relations",
          "Syllogism",
          "Venn Diagrams",
          "Puzzles",
          "Seating Arrangement",
          "Statement & Conclusions",
          "Statement & Assumptions",
          "Logical Reasoning",
          "Non-Verbal Reasoning"
        ],
        notes: "Based on SSC CGL 2024 syllabus"
      },
      "ssc-english": {
        name: "English Language & Comprehension",
        officialTopics: [
          "Grammar - Parts of Speech",
          "Grammar - Tenses",
          "Grammar - Voice",
          "Grammar - Narration",
          "Grammar - Subject-Verb Agreement",
          "Vocabulary - Synonyms",
          "Vocabulary - Antonyms",
          "Vocabulary - One Word Substitution",
          "Vocabulary - Idioms & Phrases",
          "Comprehension - Reading Comprehension",
          "Comprehension - Para Jumbles",
          "Sentence Improvement",
          "Error Detection",
          "Fill in the Blanks",
          "Cloze Test"
        ],
        notes: "Based on SSC CGL 2024 syllabus"
      },
      "ssc-gk": {
        name: "General Awareness",
        officialTopics: [
          "Current Affairs - National",
          "Current Affairs - International",
          "History - Ancient India",
          "History - Medieval India",
          "History - Modern India",
          "Geography - Indian Geography",
          "Geography - World Geography",
          "Economics - Indian Economy",
          "Polity - Indian Constitution",
          "Polity - Governance",
          "Science - Physics",
          "Science - Chemistry",
          "Science - Biology",
          "Science - Technology",
          "Culture - Art & Literature",
          "Sports - National & International",
          "Awards & Honors",
          "Books & Authors"
        ],
        notes: "Based on SSC CGL 2024 syllabus"
      }
    }
  },

  "cat": {
    name: "CAT",
    subjects: {
      "cat-quant": {
        name: "Quantitative Aptitude (QA)",
        officialTopics: [
          "Arithmetic - Number System",
          "Arithmetic - Percentages",
          "Arithmetic - Profit Loss & Discount",
          "Arithmetic - Ratio & Proportion",
          "Arithmetic - Time & Work",
          "Arithmetic - Time Speed & Distance",
          "Arithmetic - Averages & Mixtures",
          "Arithmetic - Simple & Compound Interest",
          "Algebra - Linear & Quadratic Equations",
          "Algebra - Inequalities",
          "Algebra - Functions",
          "Algebra - Logarithms",
          "Algebra - Progressions",
          "Geometry - Lines Angles & Triangles",
          "Geometry - Circles",
          "Geometry - Coordinate Geometry",
          "Mensuration - 2D Shapes",
          "Mensuration - 3D Shapes",
          "Trigonometry",
          "Modern Math - Permutations & Combinations",
          "Modern Math - Probability",
          "Modern Math - Set Theory",
          "Numbers - HCF & LCM",
          "Numbers - Factorials & Remainders"
        ],
        notes: "Based on IIM CAT 2024 pattern"
      },
      "cat-varc": {
        name: "Verbal Ability & Reading Comprehension (VARC)",
        officialTopics: [
          "Reading Comprehension - Business & Economy",
          "Reading Comprehension - Science & Technology",
          "Reading Comprehension - Social Issues",
          "Reading Comprehension - Philosophy & Arts",
          "Para Jumbles",
          "Para Summary",
          "Sentence Completion",
          "Odd One Out",
          "Grammar - Sentence Correction",
          "Vocabulary - Synonyms & Antonyms",
          "Vocabulary - Contextual Usage",
          "Critical Reasoning",
          "Inference & Assumption"
        ],
        notes: "Based on IIM CAT 2024 pattern"
      },
      "cat-dilr": {
        name: "Data Interpretation & Logical Reasoning (DILR)",
        officialTopics: [
          "Data Interpretation - Tables",
          "Data Interpretation - Bar Graphs",
          "Data Interpretation - Line Graphs",
          "Data Interpretation - Pie Charts",
          "Data Interpretation - Caselets",
          "Data Interpretation - Venn Diagrams",
          "Logical Reasoning - Arrangements",
          "Logical Reasoning - Seating Arrangement",
          "Logical Reasoning - Blood Relations",
          "Logical Reasoning - Puzzles",
          "Logical Reasoning - Games & Tournaments",
          "Logical Reasoning - Networks & Routes",
          "Logical Reasoning - Binary Logic",
          "Logical Reasoning - Selection & Distribution"
        ],
        notes: "Based on IIM CAT 2024 pattern"
      }
    }
  }
};

function compareTopics() {
  console.log("=" .repeat(80));
  console.log("📚 COMPREHENSIVE EXAM TOPIC VALIDATION");
  console.log("=" .repeat(80));
  console.log();

  const issues: Array<{
    exam: string;
    subject: string;
    missing: string[];
    extra: string[];
    correct: number;
  }> = [];

  for (const [examId, officialData] of Object.entries(officialSyllabi)) {
    const examConfig = examCategories
      .flatMap(c => c.exams)
      .find(e => e.id === examId);

    if (!examConfig) {
      console.log(`❌ Exam ${examId} not found in exams.ts\n`);
      continue;
    }

    console.log(`\n📖 ${examConfig.name}:`);
    console.log("=" .repeat(80));

    for (const [subjectId, officialSubject] of Object.entries(officialData.subjects)) {
      const subjectConfig = examConfig.subjects.find(s => s.id === subjectId);

      if (!subjectConfig) {
        console.log(`  ❌ Subject ${subjectId} not found in exams.ts`);
        continue;
      }

      const currentTopics = subjectConfig.topics;
      const officialTopics = officialSubject.officialTopics;

      // Normalize for comparison (case-insensitive)
      const currentNorm = new Set(currentTopics.map(t => t.toLowerCase().trim()));
      const officialNorm = new Set(officialTopics.map(t => t.toLowerCase().trim()));

      const missing = officialTopics.filter(t => !currentNorm.has(t.toLowerCase().trim()));
      const extra = currentTopics.filter(t => !officialNorm.has(t.toLowerCase().trim()));
      const correct = currentTopics.filter(t => officialNorm.has(t.toLowerCase().trim()));

      console.log(`\n  ${subjectConfig.name}:`);
      console.log(`    Official syllabus: ${officialTopics.length} topics`);
      console.log(`    Current in app: ${currentTopics.length} topics`);
      console.log(`    ✅ Correct: ${correct.length}`);

      if (missing.length > 0) {
        console.log(`    ❌ Missing (${missing.length}):`);
        missing.slice(0, 5).forEach(t => console.log(`       - ${t}`));
        if (missing.length > 5) console.log(`       ... and ${missing.length - 5} more`);
      }

      if (extra.length > 0) {
        console.log(`    ⚠️  Extra/Wrong (${extra.length}):`);
        extra.slice(0, 5).forEach(t => console.log(`       - ${t}`));
        if (extra.length > 5) console.log(`       ... and ${extra.length - 5} more`);
      }

      issues.push({
        exam: examConfig.name,
        subject: subjectConfig.name,
        missing,
        extra,
        correct: correct.length
      });
    }
  }

  console.log("\n\n" + "=" .repeat(80));
  console.log("📊 SUMMARY");
  console.log("=" .repeat(80));

  const totalIssues = issues.filter(i => i.missing.length > 0 || i.extra.length > 0);
  console.log(`\nTotal subjects audited: ${issues.length}`);
  console.log(`Subjects with issues: ${totalIssues.length}`);
  console.log(`Subjects perfect: ${issues.length - totalIssues.length}\n`);

  const totalMissing = issues.reduce((sum, i) => sum + i.missing.length, 0);
  const totalExtra = issues.reduce((sum, i) => sum + i.extra.length, 0);

  console.log(`Total missing topics: ${totalMissing}`);
  console.log(`Total extra/wrong topics: ${totalExtra}\n`);

  console.log("=" .repeat(80));
  console.log("\n✅ Validation complete!");
  console.log("\nNext step: Review the issues above and update src/lib/exams.ts accordingly.");
}

compareTopics();
