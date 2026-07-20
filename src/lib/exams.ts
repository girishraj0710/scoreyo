// Scoreyo - Complete Exam Database for India
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
              "Units & Measurements", "Kinematics", "Laws of Motion",
              "Work Energy Power", "Rotational Motion", "Gravitation",
              "Properties of Solids & Liquids", "Fluid Mechanics",
              "Thermodynamics", "Kinetic Theory of Gases",
              "Oscillations", "Waves", "Ray Optics", "Wave Optics",
              "Electrostatics", "Current Electricity",
              "Magnetic Effects of Current", "Magnetism & Matter",
              "Electromagnetic Induction", "Alternating Current",
              "Electromagnetic Waves", "Dual Nature of Radiation",
              "Atoms & Nuclei", "Electronic Devices", "Communication Systems"
            ],
          },
          {
            id: "jee-chemistry",
            name: "Chemistry",
            icon: "🧪",
            topics: [
              "Basic Concepts of Chemistry", "Atomic Structure", "Chemical Bonding",
              "States of Matter", "Thermodynamics", "Chemical Equilibrium",
              "Ionic Equilibrium", "Redox Reactions", "Electrochemistry",
              "Chemical Kinetics", "Surface Chemistry", "Solutions", "Solid State",
              "Periodic Table & Periodicity", "Hydrogen", "s-Block Elements",
              "p-Block Elements", "d-Block & f-Block Elements", "Coordination Compounds",
              "Environmental Chemistry", "General Principles of Metallurgy",
              "Organic Chemistry Basics", "Hydrocarbons", "Haloalkanes & Haloarenes",
              "Alcohols Phenols & Ethers", "Aldehydes Ketones & Carboxylic Acids",
              "Amines", "Biomolecules", "Polymers", "Chemistry in Everyday Life"
            ],
          },
          {
            id: "jee-maths",
            name: "Mathematics",
            icon: "📐",
            topics: [
              "Sets Relations Functions", "Complex Numbers", "Quadratic Equations",
              "Matrices & Determinants", "Permutations & Combinations",
              "Binomial Theorem", "Sequences & Series", "Mathematical Induction",
              "Trigonometry", "Inverse Trigonometric Functions",
              "Limits Continuity", "Differentiation", "Applications of Derivatives",
              "Integration", "Applications of Integrals", "Differential Equations",
              "Straight Lines", "Conic Sections", "Circles",
              "Vectors", "Three Dimensional Geometry",
              "Statistics", "Probability", "Mathematical Reasoning"
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
              "Units & Measurements", "Kinematics", "Laws of Motion",
              "Work Energy Power", "Rotational Motion", "Gravitation",
              "Properties of Solids & Liquids", "Fluid Mechanics",
              "Thermodynamics", "Kinetic Theory of Gases",
              "Oscillations", "Waves", "Ray Optics", "Wave Optics",
              "Electrostatics", "Current Electricity",
              "Magnetic Effects of Current", "Magnetism & Matter",
              "Electromagnetic Induction", "Alternating Current",
              "Electromagnetic Waves", "Dual Nature of Radiation",
              "Atoms & Nuclei", "Electronic Devices", "Communication Systems"
            ],
          },
          {
            id: "jee-adv-chemistry",
            name: "Chemistry",
            icon: "🧪",
            topics: [
              "Basic Concepts of Chemistry", "Atomic Structure", "Chemical Bonding",
              "States of Matter", "Thermodynamics", "Chemical Equilibrium",
              "Ionic Equilibrium", "Redox Reactions", "Electrochemistry",
              "Chemical Kinetics", "Surface Chemistry", "Solutions", "Solid State",
              "Periodic Table & Periodicity", "Hydrogen", "s-Block Elements",
              "p-Block Elements", "d-Block & f-Block Elements", "Coordination Compounds",
              "Environmental Chemistry", "General Principles of Metallurgy",
              "Organic Chemistry Basics", "Hydrocarbons", "Haloalkanes & Haloarenes",
              "Alcohols Phenols & Ethers", "Aldehydes Ketones & Carboxylic Acids",
              "Amines", "Biomolecules", "Polymers", "Chemistry in Everyday Life"
            ],
          },
          {
            id: "jee-adv-maths",
            name: "Mathematics",
            icon: "📐",
            topics: [
              "Sets Relations Functions", "Complex Numbers", "Quadratic Equations",
              "Matrices & Determinants", "Permutations & Combinations",
              "Binomial Theorem", "Sequences & Series", "Mathematical Induction",
              "Trigonometry", "Inverse Trigonometric Functions",
              "Limits Continuity", "Differentiation", "Applications of Derivatives",
              "Integration", "Applications of Integrals", "Differential Equations",
              "Straight Lines", "Conic Sections", "Circles",
              "Vectors", "Three Dimensional Geometry",
              "Statistics", "Probability", "Mathematical Reasoning"
            ],
          },
        ],
      },
      {
        id: "kcet",
        name: "Karnataka CET",
        fullName: "Karnataka Common Entrance Test",
        category: "engineering",
        icon: "🎯",
        color: "#FF6B6B",
        description: "For admission to Karnataka Engineering & Medical colleges",
        subjects: [
          {
            id: "kcet-physics",
            name: "Physics",
            icon: "⚡",
            topics: [
              "Units & Measurements", "Kinematics", "Laws of Motion",
              "Work Energy Power", "Rotational Motion", "Gravitation",
              "Properties of Solids & Liquids", "Fluid Mechanics",
              "Thermodynamics", "Kinetic Theory of Gases",
              "Oscillations", "Waves", "Ray Optics", "Wave Optics",
              "Electrostatics", "Current Electricity",
              "Magnetic Effects of Current", "Magnetism & Matter",
              "Electromagnetic Induction", "Alternating Current",
              "Electromagnetic Waves", "Dual Nature of Radiation",
              "Atoms & Nuclei", "Electronic Devices", "Communication Systems"
            ],
          },
          {
            id: "kcet-chemistry",
            name: "Chemistry",
            icon: "🧪",
            topics: [
              "Basic Concepts of Chemistry", "Atomic Structure", "Chemical Bonding",
              "States of Matter", "Thermodynamics", "Chemical Equilibrium",
              "Ionic Equilibrium", "Redox Reactions", "Electrochemistry",
              "Chemical Kinetics", "Surface Chemistry", "Solutions", "Solid State",
              "Periodic Table & Periodicity", "Hydrogen", "s-Block Elements",
              "p-Block Elements", "d-Block & f-Block Elements", "Coordination Compounds",
              "Environmental Chemistry", "General Principles of Metallurgy",
              "Organic Chemistry Basics", "Hydrocarbons", "Haloalkanes & Haloarenes",
              "Alcohols Phenols & Ethers", "Aldehydes Ketones & Carboxylic Acids",
              "Amines", "Biomolecules", "Polymers", "Chemistry in Everyday Life"
            ],
          },
          {
            id: "kcet-maths",
            name: "Mathematics",
            icon: "📐",
            topics: [
              "Sets Relations Functions", "Complex Numbers", "Quadratic Equations",
              "Matrices & Determinants", "Permutations & Combinations",
              "Binomial Theorem", "Sequences & Series", "Mathematical Induction",
              "Trigonometry", "Inverse Trigonometric Functions",
              "Limits Continuity", "Differentiation", "Applications of Derivatives",
              "Integration", "Applications of Integrals", "Differential Equations",
              "Straight Lines", "Conic Sections", "Circles",
              "Vectors", "Three Dimensional Geometry",
              "Statistics", "Probability", "Mathematical Reasoning"
            ],
          },
        ],
      },
      {
        id: "comedk",
        name: "COMEDK UGET",
        fullName: "Consortium of Medical Engineering and Dental Colleges of Karnataka",
        category: "engineering",
        icon: "🏛️",
        color: "#4ECDC4",
        description: "For admission to private Engineering colleges in Karnataka",
        subjects: [
          {
            id: "comedk-physics",
            name: "Physics",
            icon: "⚡",
            topics: [
              "Units & Measurements", "Kinematics", "Laws of Motion",
              "Work Energy Power", "Rotational Motion", "Gravitation",
              "Properties of Solids & Liquids", "Fluid Mechanics",
              "Thermodynamics", "Kinetic Theory of Gases",
              "Oscillations", "Waves", "Ray Optics", "Wave Optics",
              "Electrostatics", "Current Electricity",
              "Magnetic Effects of Current", "Magnetism & Matter",
              "Electromagnetic Induction", "Alternating Current",
              "Electromagnetic Waves", "Dual Nature of Radiation",
              "Atoms & Nuclei", "Electronic Devices", "Communication Systems"
            ],
          },
          {
            id: "comedk-chemistry",
            name: "Chemistry",
            icon: "🧪",
            topics: [
              "Basic Concepts of Chemistry", "Atomic Structure", "Chemical Bonding",
              "States of Matter", "Thermodynamics", "Chemical Equilibrium",
              "Ionic Equilibrium", "Redox Reactions", "Electrochemistry",
              "Chemical Kinetics", "Surface Chemistry", "Solutions", "Solid State",
              "Periodic Table & Periodicity", "Hydrogen", "s-Block Elements",
              "p-Block Elements", "d-Block & f-Block Elements", "Coordination Compounds",
              "Environmental Chemistry", "General Principles of Metallurgy",
              "Organic Chemistry Basics", "Hydrocarbons", "Haloalkanes & Haloarenes",
              "Alcohols Phenols & Ethers", "Aldehydes Ketones & Carboxylic Acids",
              "Amines", "Biomolecules", "Polymers", "Chemistry in Everyday Life"
            ],
          },
          {
            id: "comedk-maths",
            name: "Mathematics",
            icon: "📐",
            topics: [
              "Sets Relations Functions", "Complex Numbers", "Quadratic Equations",
              "Matrices & Determinants", "Permutations & Combinations",
              "Binomial Theorem", "Sequences & Series", "Mathematical Induction",
              "Trigonometry", "Inverse Trigonometric Functions",
              "Limits Continuity", "Differentiation", "Applications of Derivatives",
              "Integration", "Applications of Integrals", "Differential Equations",
              "Straight Lines", "Conic Sections", "Circles",
              "Vectors", "Three Dimensional Geometry",
              "Statistics", "Probability", "Mathematical Reasoning"
            ],
          },
        ],
      },
      {
        id: "mht-cet",
        name: "MHT CET",
        fullName: "Maharashtra Common Entrance Test",
        category: "engineering",
        icon: "🎯",
        color: "#FF9800",
        description: "For admission to Maharashtra Engineering & Pharmacy colleges",
        subjects: [
          {
            id: "mht-physics",
            name: "Physics",
            icon: "⚡",
            topics: [
              "Units & Measurements", "Kinematics", "Laws of Motion",
              "Work Energy Power", "Rotational Motion", "Gravitation",
              "Properties of Solids & Liquids", "Fluid Mechanics",
              "Thermodynamics", "Kinetic Theory of Gases",
              "Oscillations", "Waves", "Ray Optics", "Wave Optics",
              "Electrostatics", "Current Electricity",
              "Magnetic Effects of Current", "Magnetism & Matter",
              "Electromagnetic Induction", "Alternating Current",
              "Electromagnetic Waves", "Dual Nature of Radiation",
              "Atoms & Nuclei", "Electronic Devices", "Communication Systems"
            ],
          },
          {
            id: "mht-chemistry",
            name: "Chemistry",
            icon: "🧪",
            topics: [
              "Basic Concepts of Chemistry", "Atomic Structure", "Chemical Bonding",
              "States of Matter", "Thermodynamics", "Chemical Equilibrium",
              "Ionic Equilibrium", "Redox Reactions", "Electrochemistry",
              "Chemical Kinetics", "Surface Chemistry", "Solutions", "Solid State",
              "Periodic Table & Periodicity", "Hydrogen", "s-Block Elements",
              "p-Block Elements", "d-Block & f-Block Elements", "Coordination Compounds",
              "Environmental Chemistry", "General Principles of Metallurgy",
              "Organic Chemistry Basics", "Hydrocarbons", "Haloalkanes & Haloarenes",
              "Alcohols Phenols & Ethers", "Aldehydes Ketones & Carboxylic Acids",
              "Amines", "Biomolecules", "Polymers", "Chemistry in Everyday Life"
            ],
          },
          {
            id: "mht-maths",
            name: "Mathematics",
            icon: "📐",
            topics: [
              "Sets Relations Functions", "Complex Numbers", "Quadratic Equations",
              "Matrices & Determinants", "Permutations & Combinations",
              "Binomial Theorem", "Sequences & Series", "Mathematical Induction",
              "Trigonometry", "Inverse Trigonometric Functions",
              "Limits Continuity", "Differentiation", "Applications of Derivatives",
              "Integration", "Applications of Integrals", "Differential Equations",
              "Straight Lines", "Conic Sections", "Circles",
              "Vectors", "Three Dimensional Geometry",
              "Statistics", "Probability", "Mathematical Reasoning"
            ],
          },
        ],
      },
      {
        id: "ts-eamcet",
        name: "TS EAMCET",
        fullName: "Telangana State Engineering Agriculture & Medical Common Entrance Test",
        category: "engineering",
        icon: "🎯",
        color: "#E91E63",
        description: "For admission to Telangana Engineering & Medical colleges",
        subjects: [
          {
            id: "ts-physics",
            name: "Physics",
            icon: "⚡",
            topics: [
              "Units & Measurements", "Kinematics", "Laws of Motion",
              "Work Energy Power", "Rotational Motion", "Gravitation",
              "Properties of Solids & Liquids", "Fluid Mechanics",
              "Thermodynamics", "Kinetic Theory of Gases",
              "Oscillations", "Waves", "Ray Optics", "Wave Optics",
              "Electrostatics", "Current Electricity",
              "Magnetic Effects of Current", "Magnetism & Matter",
              "Electromagnetic Induction", "Alternating Current",
              "Electromagnetic Waves", "Dual Nature of Radiation",
              "Atoms & Nuclei", "Electronic Devices", "Communication Systems"
            ],
          },
          {
            id: "ts-chemistry",
            name: "Chemistry",
            icon: "🧪",
            topics: [
              "Basic Concepts of Chemistry", "Atomic Structure", "Chemical Bonding",
              "States of Matter", "Thermodynamics", "Chemical Equilibrium",
              "Ionic Equilibrium", "Redox Reactions", "Electrochemistry",
              "Chemical Kinetics", "Surface Chemistry", "Solutions", "Solid State",
              "Periodic Table & Periodicity", "Hydrogen", "s-Block Elements",
              "p-Block Elements", "d-Block & f-Block Elements", "Coordination Compounds",
              "Environmental Chemistry", "General Principles of Metallurgy",
              "Organic Chemistry Basics", "Hydrocarbons", "Haloalkanes & Haloarenes",
              "Alcohols Phenols & Ethers", "Aldehydes Ketones & Carboxylic Acids",
              "Amines", "Biomolecules", "Polymers", "Chemistry in Everyday Life"
            ],
          },
          {
            id: "ts-maths",
            name: "Mathematics",
            icon: "📐",
            topics: [
              "Sets Relations Functions", "Complex Numbers", "Quadratic Equations",
              "Matrices & Determinants", "Permutations & Combinations",
              "Binomial Theorem", "Sequences & Series", "Mathematical Induction",
              "Trigonometry", "Inverse Trigonometric Functions",
              "Limits Continuity", "Differentiation", "Applications of Derivatives",
              "Integration", "Applications of Integrals", "Differential Equations",
              "Straight Lines", "Conic Sections", "Circles",
              "Vectors", "Three Dimensional Geometry",
              "Statistics", "Probability", "Mathematical Reasoning"
            ],
          },
        ],
      },
      {
        id: "ap-eamcet",
        name: "AP EAMCET",
        fullName: "Andhra Pradesh Engineering Agriculture & Medical Common Entrance Test",
        category: "engineering",
        icon: "🎯",
        color: "#9C27B0",
        description: "For admission to Andhra Pradesh Engineering & Medical colleges",
        subjects: [
          {
            id: "ap-physics",
            name: "Physics",
            icon: "⚡",
            topics: [
              "Units & Measurements", "Kinematics", "Laws of Motion",
              "Work Energy Power", "Rotational Motion", "Gravitation",
              "Properties of Solids & Liquids", "Fluid Mechanics",
              "Thermodynamics", "Kinetic Theory of Gases",
              "Oscillations", "Waves", "Ray Optics", "Wave Optics",
              "Electrostatics", "Current Electricity",
              "Magnetic Effects of Current", "Magnetism & Matter",
              "Electromagnetic Induction", "Alternating Current",
              "Electromagnetic Waves", "Dual Nature of Radiation",
              "Atoms & Nuclei", "Electronic Devices", "Communication Systems"
            ],
          },
          {
            id: "ap-chemistry",
            name: "Chemistry",
            icon: "🧪",
            topics: [
              "Basic Concepts of Chemistry", "Atomic Structure", "Chemical Bonding",
              "States of Matter", "Thermodynamics", "Chemical Equilibrium",
              "Ionic Equilibrium", "Redox Reactions", "Electrochemistry",
              "Chemical Kinetics", "Surface Chemistry", "Solutions", "Solid State",
              "Periodic Table & Periodicity", "Hydrogen", "s-Block Elements",
              "p-Block Elements", "d-Block & f-Block Elements", "Coordination Compounds",
              "Environmental Chemistry", "General Principles of Metallurgy",
              "Organic Chemistry Basics", "Hydrocarbons", "Haloalkanes & Haloarenes",
              "Alcohols Phenols & Ethers", "Aldehydes Ketones & Carboxylic Acids",
              "Amines", "Biomolecules", "Polymers", "Chemistry in Everyday Life"
            ],
          },
          {
            id: "ap-maths",
            name: "Mathematics",
            icon: "📐",
            topics: [
              "Sets Relations Functions", "Complex Numbers", "Quadratic Equations",
              "Matrices & Determinants", "Permutations & Combinations",
              "Binomial Theorem", "Sequences & Series", "Mathematical Induction",
              "Trigonometry", "Inverse Trigonometric Functions",
              "Limits Continuity", "Differentiation", "Applications of Derivatives",
              "Integration", "Applications of Integrals", "Differential Equations",
              "Straight Lines", "Conic Sections", "Circles",
              "Vectors", "Three Dimensional Geometry",
              "Statistics", "Probability", "Mathematical Reasoning"
            ],
          },
        ],
      },
      {
        id: "wbjee",
        name: "WBJEE",
        fullName: "West Bengal Joint Entrance Examination",
        category: "engineering",
        icon: "🎯",
        color: "#00BCD4",
        description: "For admission to West Bengal Engineering & Medical colleges",
        subjects: [
          {
            id: "wbjee-physics",
            name: "Physics",
            icon: "⚡",
            topics: [
              "Units & Measurements", "Kinematics", "Laws of Motion",
              "Work Energy Power", "Rotational Motion", "Gravitation",
              "Properties of Solids & Liquids", "Fluid Mechanics",
              "Thermodynamics", "Kinetic Theory of Gases",
              "Oscillations", "Waves", "Ray Optics", "Wave Optics",
              "Electrostatics", "Current Electricity",
              "Magnetic Effects of Current", "Magnetism & Matter",
              "Electromagnetic Induction", "Alternating Current",
              "Electromagnetic Waves", "Dual Nature of Radiation",
              "Atoms & Nuclei", "Electronic Devices", "Communication Systems"
            ],
          },
          {
            id: "wbjee-chemistry",
            name: "Chemistry",
            icon: "🧪",
            topics: [
              "Basic Concepts of Chemistry", "Atomic Structure", "Chemical Bonding",
              "States of Matter", "Thermodynamics", "Chemical Equilibrium",
              "Ionic Equilibrium", "Redox Reactions", "Electrochemistry",
              "Chemical Kinetics", "Surface Chemistry", "Solutions", "Solid State",
              "Periodic Table & Periodicity", "Hydrogen", "s-Block Elements",
              "p-Block Elements", "d-Block & f-Block Elements", "Coordination Compounds",
              "Environmental Chemistry", "General Principles of Metallurgy",
              "Organic Chemistry Basics", "Hydrocarbons", "Haloalkanes & Haloarenes",
              "Alcohols Phenols & Ethers", "Aldehydes Ketones & Carboxylic Acids",
              "Amines", "Biomolecules", "Polymers", "Chemistry in Everyday Life"
            ],
          },
          {
            id: "wbjee-maths",
            name: "Mathematics",
            icon: "📐",
            topics: [
              "Sets Relations Functions", "Complex Numbers", "Quadratic Equations",
              "Matrices & Determinants", "Permutations & Combinations",
              "Binomial Theorem", "Sequences & Series", "Mathematical Induction",
              "Trigonometry", "Inverse Trigonometric Functions",
              "Limits Continuity", "Differentiation", "Applications of Derivatives",
              "Integration", "Applications of Integrals", "Differential Equations",
              "Straight Lines", "Conic Sections", "Circles",
              "Vectors", "Three Dimensional Geometry",
              "Statistics", "Probability", "Mathematical Reasoning"
            ],
          },
        ],
      },
      {
        id: "keam",
        name: "KEAM",
        fullName: "Kerala Engineering Architecture Medical Entrance Examination",
        category: "engineering",
        icon: "🎯",
        color: "#4CAF50",
        description: "For admission to Kerala Engineering & Medical colleges",
        subjects: [
          {
            id: "keam-physics",
            name: "Physics",
            icon: "⚡",
            topics: [
              "Units & Measurements", "Kinematics", "Laws of Motion",
              "Work Energy Power", "Rotational Motion", "Gravitation",
              "Properties of Solids & Liquids", "Fluid Mechanics",
              "Thermodynamics", "Kinetic Theory of Gases",
              "Oscillations", "Waves", "Ray Optics", "Wave Optics",
              "Electrostatics", "Current Electricity",
              "Magnetic Effects of Current", "Magnetism & Matter",
              "Electromagnetic Induction", "Alternating Current",
              "Electromagnetic Waves", "Dual Nature of Radiation",
              "Atoms & Nuclei", "Electronic Devices", "Communication Systems"
            ],
          },
          {
            id: "keam-chemistry",
            name: "Chemistry",
            icon: "🧪",
            topics: [
              "Basic Concepts of Chemistry", "Atomic Structure", "Chemical Bonding",
              "States of Matter", "Thermodynamics", "Chemical Equilibrium",
              "Ionic Equilibrium", "Redox Reactions", "Electrochemistry",
              "Chemical Kinetics", "Surface Chemistry", "Solutions", "Solid State",
              "Periodic Table & Periodicity", "Hydrogen", "s-Block Elements",
              "p-Block Elements", "d-Block & f-Block Elements", "Coordination Compounds",
              "Environmental Chemistry", "General Principles of Metallurgy",
              "Organic Chemistry Basics", "Hydrocarbons", "Haloalkanes & Haloarenes",
              "Alcohols Phenols & Ethers", "Aldehydes Ketones & Carboxylic Acids",
              "Amines", "Biomolecules", "Polymers", "Chemistry in Everyday Life"
            ],
          },
          {
            id: "keam-maths",
            name: "Mathematics",
            icon: "📐",
            topics: [
              "Sets Relations Functions", "Complex Numbers", "Quadratic Equations",
              "Matrices & Determinants", "Permutations & Combinations",
              "Binomial Theorem", "Sequences & Series", "Mathematical Induction",
              "Trigonometry", "Inverse Trigonometric Functions",
              "Limits Continuity", "Differentiation", "Applications of Derivatives",
              "Integration", "Applications of Integrals", "Differential Equations",
              "Straight Lines", "Conic Sections", "Circles",
              "Vectors", "Three Dimensional Geometry",
              "Statistics", "Probability", "Mathematical Reasoning"
            ],
          },
        ],
      },
      {
        id: "upsee",
        name: "UPSEE",
        fullName: "Uttar Pradesh State Entrance Examination",
        category: "engineering",
        icon: "🎯",
        color: "#673AB7",
        description: "For admission to UP Engineering & Architecture colleges",
        subjects: [
          {
            id: "upsee-physics",
            name: "Physics",
            icon: "⚡",
            topics: [
              "Units & Measurements", "Kinematics", "Laws of Motion",
              "Work Energy Power", "Rotational Motion", "Gravitation",
              "Properties of Solids & Liquids", "Fluid Mechanics",
              "Thermodynamics", "Kinetic Theory of Gases",
              "Oscillations", "Waves", "Ray Optics", "Wave Optics",
              "Electrostatics", "Current Electricity",
              "Magnetic Effects of Current", "Magnetism & Matter",
              "Electromagnetic Induction", "Alternating Current",
              "Electromagnetic Waves", "Dual Nature of Radiation",
              "Atoms & Nuclei", "Electronic Devices", "Communication Systems"
            ],
          },
          {
            id: "upsee-chemistry",
            name: "Chemistry",
            icon: "🧪",
            topics: [
              "Basic Concepts of Chemistry", "Atomic Structure", "Chemical Bonding",
              "States of Matter", "Thermodynamics", "Chemical Equilibrium",
              "Ionic Equilibrium", "Redox Reactions", "Electrochemistry",
              "Chemical Kinetics", "Surface Chemistry", "Solutions", "Solid State",
              "Periodic Table & Periodicity", "Hydrogen", "s-Block Elements",
              "p-Block Elements", "d-Block & f-Block Elements", "Coordination Compounds",
              "Environmental Chemistry", "General Principles of Metallurgy",
              "Organic Chemistry Basics", "Hydrocarbons", "Haloalkanes & Haloarenes",
              "Alcohols Phenols & Ethers", "Aldehydes Ketones & Carboxylic Acids",
              "Amines", "Biomolecules", "Polymers", "Chemistry in Everyday Life"
            ],
          },
          {
            id: "upsee-maths",
            name: "Mathematics",
            icon: "📐",
            topics: [
              "Sets Relations Functions", "Complex Numbers", "Quadratic Equations",
              "Matrices & Determinants", "Permutations & Combinations",
              "Binomial Theorem", "Sequences & Series", "Mathematical Induction",
              "Trigonometry", "Inverse Trigonometric Functions",
              "Limits Continuity", "Differentiation", "Applications of Derivatives",
              "Integration", "Applications of Integrals", "Differential Equations",
              "Straight Lines", "Conic Sections", "Circles",
              "Vectors", "Three Dimensional Geometry",
              "Statistics", "Probability", "Mathematical Reasoning"
            ],
          },
        ],
      },
      {
        id: "bcece",
        name: "BCECE",
        fullName: "Bihar Combined Entrance Competitive Examination",
        category: "engineering",
        icon: "🎯",
        color: "#F44336",
        description: "For admission to Bihar Engineering & Medical colleges",
        subjects: [
          {
            id: "bcece-physics",
            name: "Physics",
            icon: "⚡",
            topics: [
              "Units & Measurements", "Kinematics", "Laws of Motion",
              "Work Energy Power", "Rotational Motion", "Gravitation",
              "Properties of Solids & Liquids", "Fluid Mechanics",
              "Thermodynamics", "Kinetic Theory of Gases",
              "Oscillations", "Waves", "Ray Optics", "Wave Optics",
              "Electrostatics", "Current Electricity",
              "Magnetic Effects of Current", "Magnetism & Matter",
              "Electromagnetic Induction", "Alternating Current",
              "Electromagnetic Waves", "Dual Nature of Radiation",
              "Atoms & Nuclei", "Electronic Devices", "Communication Systems"
            ],
          },
          {
            id: "bcece-chemistry",
            name: "Chemistry",
            icon: "🧪",
            topics: [
              "Basic Concepts of Chemistry", "Atomic Structure", "Chemical Bonding",
              "States of Matter", "Thermodynamics", "Chemical Equilibrium",
              "Ionic Equilibrium", "Redox Reactions", "Electrochemistry",
              "Chemical Kinetics", "Surface Chemistry", "Solutions", "Solid State",
              "Periodic Table & Periodicity", "Hydrogen", "s-Block Elements",
              "p-Block Elements", "d-Block & f-Block Elements", "Coordination Compounds",
              "Environmental Chemistry", "General Principles of Metallurgy",
              "Organic Chemistry Basics", "Hydrocarbons", "Haloalkanes & Haloarenes",
              "Alcohols Phenols & Ethers", "Aldehydes Ketones & Carboxylic Acids",
              "Amines", "Biomolecules", "Polymers", "Chemistry in Everyday Life"
            ],
          },
          {
            id: "bcece-maths",
            name: "Mathematics",
            icon: "📐",
            topics: [
              "Sets Relations Functions", "Complex Numbers", "Quadratic Equations",
              "Matrices & Determinants", "Permutations & Combinations",
              "Binomial Theorem", "Sequences & Series", "Mathematical Induction",
              "Trigonometry", "Inverse Trigonometric Functions",
              "Limits Continuity", "Differentiation", "Applications of Derivatives",
              "Integration", "Applications of Integrals", "Differential Equations",
              "Straight Lines", "Conic Sections", "Circles",
              "Vectors", "Three Dimensional Geometry",
              "Statistics", "Probability", "Mathematical Reasoning"
            ],
          },
        ],
      },
      {
        id: "ojee",
        name: "OJEE",
        fullName: "Odisha Joint Entrance Examination",
        category: "engineering",
        icon: "🎯",
        color: "#2196F3",
        description: "For admission to Odisha Engineering & Pharmacy colleges",
        subjects: [
          {
            id: "ojee-physics",
            name: "Physics",
            icon: "⚡",
            topics: [
              "Units & Measurements", "Kinematics", "Laws of Motion",
              "Work Energy Power", "Rotational Motion", "Gravitation",
              "Properties of Solids & Liquids", "Fluid Mechanics",
              "Thermodynamics", "Kinetic Theory of Gases",
              "Oscillations", "Waves", "Ray Optics", "Wave Optics",
              "Electrostatics", "Current Electricity",
              "Magnetic Effects of Current", "Magnetism & Matter",
              "Electromagnetic Induction", "Alternating Current",
              "Electromagnetic Waves", "Dual Nature of Radiation",
              "Atoms & Nuclei", "Electronic Devices", "Communication Systems"
            ],
          },
          {
            id: "ojee-chemistry",
            name: "Chemistry",
            icon: "🧪",
            topics: [
              "Basic Concepts of Chemistry", "Atomic Structure", "Chemical Bonding",
              "States of Matter", "Thermodynamics", "Chemical Equilibrium",
              "Ionic Equilibrium", "Redox Reactions", "Electrochemistry",
              "Chemical Kinetics", "Surface Chemistry", "Solutions", "Solid State",
              "Periodic Table & Periodicity", "Hydrogen", "s-Block Elements",
              "p-Block Elements", "d-Block & f-Block Elements", "Coordination Compounds",
              "Environmental Chemistry", "General Principles of Metallurgy",
              "Organic Chemistry Basics", "Hydrocarbons", "Haloalkanes & Haloarenes",
              "Alcohols Phenols & Ethers", "Aldehydes Ketones & Carboxylic Acids",
              "Amines", "Biomolecules", "Polymers", "Chemistry in Everyday Life"
            ],
          },
          {
            id: "ojee-maths",
            name: "Mathematics",
            icon: "📐",
            topics: [
              "Sets Relations Functions", "Complex Numbers", "Quadratic Equations",
              "Matrices & Determinants", "Permutations & Combinations",
              "Binomial Theorem", "Sequences & Series", "Mathematical Induction",
              "Trigonometry", "Inverse Trigonometric Functions",
              "Limits Continuity", "Differentiation", "Applications of Derivatives",
              "Integration", "Applications of Integrals", "Differential Equations",
              "Straight Lines", "Conic Sections", "Circles",
              "Vectors", "Three Dimensional Geometry",
              "Statistics", "Probability", "Mathematical Reasoning"
            ],
          },
        ],
      },
      {
        id: "tnea",
        name: "TNEA",
        fullName: "Tamil Nadu Engineering Admissions",
        category: "engineering",
        icon: "🎯",
        color: "#FF5722",
        description: "For admission to Tamil Nadu Engineering colleges",
        subjects: [
          {
            id: "tnea-physics",
            name: "Physics",
            icon: "⚡",
            topics: [
              "Units & Measurements", "Kinematics", "Laws of Motion",
              "Work Energy Power", "Rotational Motion", "Gravitation",
              "Properties of Solids & Liquids", "Fluid Mechanics",
              "Thermodynamics", "Kinetic Theory of Gases",
              "Oscillations", "Waves", "Ray Optics", "Wave Optics",
              "Electrostatics", "Current Electricity",
              "Magnetic Effects of Current", "Magnetism & Matter",
              "Electromagnetic Induction", "Alternating Current",
              "Electromagnetic Waves", "Dual Nature of Radiation",
              "Atoms & Nuclei", "Electronic Devices", "Communication Systems"
            ],
          },
          {
            id: "tnea-chemistry",
            name: "Chemistry",
            icon: "🧪",
            topics: [
              "Basic Concepts of Chemistry", "Atomic Structure", "Chemical Bonding",
              "States of Matter", "Thermodynamics", "Chemical Equilibrium",
              "Ionic Equilibrium", "Redox Reactions", "Electrochemistry",
              "Chemical Kinetics", "Surface Chemistry", "Solutions", "Solid State",
              "Periodic Table & Periodicity", "Hydrogen", "s-Block Elements",
              "p-Block Elements", "d-Block & f-Block Elements", "Coordination Compounds",
              "Environmental Chemistry", "General Principles of Metallurgy",
              "Organic Chemistry Basics", "Hydrocarbons", "Haloalkanes & Haloarenes",
              "Alcohols Phenols & Ethers", "Aldehydes Ketones & Carboxylic Acids",
              "Amines", "Biomolecules", "Polymers", "Chemistry in Everyday Life"
            ],
          },
          {
            id: "tnea-maths",
            name: "Mathematics",
            icon: "📐",
            topics: [
              "Sets Relations Functions", "Complex Numbers", "Quadratic Equations",
              "Matrices & Determinants", "Permutations & Combinations",
              "Binomial Theorem", "Sequences & Series", "Mathematical Induction",
              "Trigonometry", "Inverse Trigonometric Functions",
              "Limits Continuity", "Differentiation", "Applications of Derivatives",
              "Integration", "Applications of Integrals", "Differential Equations",
              "Straight Lines", "Conic Sections", "Circles",
              "Vectors", "Three Dimensional Geometry",
              "Statistics", "Probability", "Mathematical Reasoning"
            ],
          },
        ],
      },
      {
        id: "gujcet",
        name: "GUJCET",
        fullName: "Gujarat Common Entrance Test",
        category: "engineering",
        icon: "🎯",
        color: "#795548",
        description: "For admission to Gujarat Engineering & Pharmacy colleges",
        subjects: [
          {
            id: "gujcet-physics",
            name: "Physics",
            icon: "⚡",
            topics: [
              "Units & Measurements", "Kinematics", "Laws of Motion",
              "Work Energy Power", "Rotational Motion", "Gravitation",
              "Properties of Solids & Liquids", "Fluid Mechanics",
              "Thermodynamics", "Kinetic Theory of Gases",
              "Oscillations", "Waves", "Ray Optics", "Wave Optics",
              "Electrostatics", "Current Electricity",
              "Magnetic Effects of Current", "Magnetism & Matter",
              "Electromagnetic Induction", "Alternating Current",
              "Electromagnetic Waves", "Dual Nature of Radiation",
              "Atoms & Nuclei", "Electronic Devices", "Communication Systems"
            ],
          },
          {
            id: "gujcet-chemistry",
            name: "Chemistry",
            icon: "🧪",
            topics: [
              "Basic Concepts of Chemistry", "Atomic Structure", "Chemical Bonding",
              "States of Matter", "Thermodynamics", "Chemical Equilibrium",
              "Ionic Equilibrium", "Redox Reactions", "Electrochemistry",
              "Chemical Kinetics", "Surface Chemistry", "Solutions", "Solid State",
              "Periodic Table & Periodicity", "Hydrogen", "s-Block Elements",
              "p-Block Elements", "d-Block & f-Block Elements", "Coordination Compounds",
              "Environmental Chemistry", "General Principles of Metallurgy",
              "Organic Chemistry Basics", "Hydrocarbons", "Haloalkanes & Haloarenes",
              "Alcohols Phenols & Ethers", "Aldehydes Ketones & Carboxylic Acids",
              "Amines", "Biomolecules", "Polymers", "Chemistry in Everyday Life"
            ],
          },
          {
            id: "gujcet-maths",
            name: "Mathematics",
            icon: "📐",
            topics: [
              "Sets Relations Functions", "Complex Numbers", "Quadratic Equations",
              "Matrices & Determinants", "Permutations & Combinations",
              "Binomial Theorem", "Sequences & Series", "Mathematical Induction",
              "Trigonometry", "Inverse Trigonometric Functions",
              "Limits Continuity", "Differentiation", "Applications of Derivatives",
              "Integration", "Applications of Integrals", "Differential Equations",
              "Straight Lines", "Conic Sections", "Circles",
              "Vectors", "Three Dimensional Geometry",
              "Statistics", "Probability", "Mathematical Reasoning"
            ],
          },
        ],
      },
      {
        id: "reap",
        name: "REAP",
        fullName: "Rajasthan Engineering Admission Process",
        category: "engineering",
        icon: "🎯",
        color: "#E91E63",
        description: "For admission to Rajasthan Engineering colleges",
        subjects: [
          {
            id: "reap-physics",
            name: "Physics",
            icon: "⚡",
            topics: [
              "Units & Measurements", "Kinematics", "Laws of Motion",
              "Work Energy Power", "Rotational Motion", "Gravitation",
              "Properties of Solids & Liquids", "Fluid Mechanics",
              "Thermodynamics", "Kinetic Theory of Gases",
              "Oscillations", "Waves", "Ray Optics", "Wave Optics",
              "Electrostatics", "Current Electricity",
              "Magnetic Effects of Current", "Magnetism & Matter",
              "Electromagnetic Induction", "Alternating Current",
              "Electromagnetic Waves", "Dual Nature of Radiation",
              "Atoms & Nuclei", "Electronic Devices", "Communication Systems"
            ],
          },
          {
            id: "reap-chemistry",
            name: "Chemistry",
            icon: "🧪",
            topics: [
              "Basic Concepts of Chemistry", "Atomic Structure", "Chemical Bonding",
              "States of Matter", "Thermodynamics", "Chemical Equilibrium",
              "Ionic Equilibrium", "Redox Reactions", "Electrochemistry",
              "Chemical Kinetics", "Surface Chemistry", "Solutions", "Solid State",
              "Periodic Table & Periodicity", "Hydrogen", "s-Block Elements",
              "p-Block Elements", "d-Block & f-Block Elements", "Coordination Compounds",
              "Environmental Chemistry", "General Principles of Metallurgy",
              "Organic Chemistry Basics", "Hydrocarbons", "Haloalkanes & Haloarenes",
              "Alcohols Phenols & Ethers", "Aldehydes Ketones & Carboxylic Acids",
              "Amines", "Biomolecules", "Polymers", "Chemistry in Everyday Life"
            ],
          },
          {
            id: "reap-maths",
            name: "Mathematics",
            icon: "📐",
            topics: [
              "Sets Relations Functions", "Complex Numbers", "Quadratic Equations",
              "Matrices & Determinants", "Permutations & Combinations",
              "Binomial Theorem", "Sequences & Series", "Mathematical Induction",
              "Trigonometry", "Inverse Trigonometric Functions",
              "Limits Continuity", "Differentiation", "Applications of Derivatives",
              "Integration", "Applications of Integrals", "Differential Equations",
              "Straight Lines", "Conic Sections", "Circles",
              "Vectors", "Three Dimensional Geometry",
              "Statistics", "Probability", "Mathematical Reasoning"
            ],
          },
        ],
      },
      {
        id: "jcece",
        name: "JCECE",
        fullName: "Jharkhand Combined Entrance Competitive Examination",
        category: "engineering",
        icon: "🎯",
        color: "#00BCD4",
        description: "For admission to Jharkhand Engineering & Medical colleges",
        subjects: [
          {
            id: "jcece-physics",
            name: "Physics",
            icon: "⚡",
            topics: [
              "Units & Measurements", "Kinematics", "Laws of Motion",
              "Work Energy Power", "Rotational Motion", "Gravitation",
              "Properties of Solids & Liquids", "Fluid Mechanics",
              "Thermodynamics", "Kinetic Theory of Gases",
              "Oscillations", "Waves", "Ray Optics", "Wave Optics",
              "Electrostatics", "Current Electricity",
              "Magnetic Effects of Current", "Magnetism & Matter",
              "Electromagnetic Induction", "Alternating Current",
              "Electromagnetic Waves", "Dual Nature of Radiation",
              "Atoms & Nuclei", "Electronic Devices", "Communication Systems"
            ],
          },
          {
            id: "jcece-chemistry",
            name: "Chemistry",
            icon: "🧪",
            topics: [
              "Basic Concepts of Chemistry", "Atomic Structure", "Chemical Bonding",
              "States of Matter", "Thermodynamics", "Chemical Equilibrium",
              "Ionic Equilibrium", "Redox Reactions", "Electrochemistry",
              "Chemical Kinetics", "Surface Chemistry", "Solutions", "Solid State",
              "Periodic Table & Periodicity", "Hydrogen", "s-Block Elements",
              "p-Block Elements", "d-Block & f-Block Elements", "Coordination Compounds",
              "Environmental Chemistry", "General Principles of Metallurgy",
              "Organic Chemistry Basics", "Hydrocarbons", "Haloalkanes & Haloarenes",
              "Alcohols Phenols & Ethers", "Aldehydes Ketones & Carboxylic Acids",
              "Amines", "Biomolecules", "Polymers", "Chemistry in Everyday Life"
            ],
          },
          {
            id: "jcece-maths",
            name: "Mathematics",
            icon: "📐",
            topics: [
              "Sets Relations Functions", "Complex Numbers", "Quadratic Equations",
              "Matrices & Determinants", "Permutations & Combinations",
              "Binomial Theorem", "Sequences & Series", "Mathematical Induction",
              "Trigonometry", "Inverse Trigonometric Functions",
              "Limits Continuity", "Differentiation", "Applications of Derivatives",
              "Integration", "Applications of Integrals", "Differential Equations",
              "Straight Lines", "Conic Sections", "Circles",
              "Vectors", "Three Dimensional Geometry",
              "Statistics", "Probability", "Mathematical Reasoning"
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
              "Algorithms (Sorting, Searching, Divide & Conquer, Greedy, Dynamic Programming, Graph algorithms)",
              "Programming in C (Basics, Pointers, Recursion, Structures)",
              "Operating Systems (Process, Threads, CPU Scheduling, Deadlock, Memory Management, Virtual Memory)",
              "Database Management Systems (ER Model, Relational Model, SQL, Normalization, Transactions, Indexing)",
              "Computer Networks (OSI & TCP/IP, Application Layer, Routing, Network Security)",
              "Theory of Computation (Regular Languages, Finite Automata, Context-Free Languages, Pushdown Automata, Turing Machines, Computability)",
              "Compiler Design (Lexical Analysis, Parsing, Semantic Analysis, Code Generation, Optimization)",
              "Digital Logic (Boolean Algebra, K-maps, Combinational Circuits, Sequential Circuits)",
              "Computer Organization & Architecture (Instruction Set, CPU Organization, Pipelining, Memory Hierarchy, Cache, I/O)",
              "Discrete Mathematics (Set Theory, Relations, Functions, Combinatorics)"
            ],
          },
          {
            id: "gate-aptitude",
            name: "General Aptitude",
            icon: "🧠",
            topics: [
              "Verbal Ability (Grammar, Sentence Completion, Sentence Correction, Word Analogies, Synonyms, Antonyms)",
              "Reading Comprehension (Passage Analysis, Inference, Main Idea)",
              "Numerical Ability (Arithmetic - Percentages, Ratios, Proportions, Speed-Time-Distance, Profit-Loss)",
              "Data Interpretation (Tables, Graphs, Charts, Data Analysis)"
            ],
          },
          {
            id: "gate-engineering-math",
            name: "Engineering Mathematics",
            icon: "📊",
            topics: [
              "Linear Algebra - Matrices",
              "Linear Algebra - Determinants",
              "Linear Algebra - System of Linear Equations",
              "Linear Algebra - Eigenvalues & Eigenvectors",
              "Linear Algebra - Vector Spaces",
              "Calculus - Limits & Continuity",
              "Calculus - Differentiation",
              "Calculus - Integration",
              "Calculus - Multivariable Calculus",
              "Differential Equations - Ordinary Differential Equations",
              "Complex Analysis - Complex Numbers",
              "Complex Analysis - Functions of Complex Variables",
              "Probability & Statistics - Probability Theory",
              "Probability & Statistics - Distributions",
              "Probability & Statistics - Descriptive Statistics & Hypothesis Testing",
              "Numerical Methods - Root Finding",
              "Numerical Methods - Interpolation & Approximation",
              "Numerical Methods - Numerical Integration",
              "Numerical Methods - Numerical Solutions of ODEs",
              "Transform Theory - Fourier Series",
              "Transform Theory - Fourier Transform",
              "Transform Theory - Laplace Transform",
              "Transform Theory - Z-Transform",
              "Graph Theory (Connectivity, Spanning Trees, Shortest Paths)",
              "Combinatorics (Permutations, Combinations, Counting)",
              "Set Theory & Algebra (Sets, Relations, Groups, Rings)",
              "Mathematical Logic (Propositional Logic, Predicate Logic)"
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
              "Units & Measurements", "Kinematics", "Laws of Motion",
              "Work Energy Power", "Rotational Motion", "Gravitation",
              "Properties of Solids & Liquids", "Fluid Mechanics",
              "Thermodynamics", "Kinetic Theory of Gases",
              "Oscillations", "Waves", "Ray Optics", "Wave Optics",
              "Electrostatics", "Current Electricity",
              "Magnetic Effects of Current", "Magnetism & Matter",
              "Electromagnetic Induction", "Alternating Current",
              "Electromagnetic Waves", "Dual Nature of Radiation",
              "Atoms & Nuclei", "Electronic Devices", "Communication Systems"
            ],
          },
          {
            id: "neet-chemistry",
            name: "Chemistry",
            icon: "🧪",
            topics: [
              "Basic Concepts of Chemistry", "Atomic Structure", "Chemical Bonding",
              "States of Matter", "Thermodynamics", "Chemical Equilibrium",
              "Ionic Equilibrium", "Redox Reactions", "Electrochemistry",
              "Chemical Kinetics", "Surface Chemistry", "Solutions", "Solid State",
              "Periodic Table & Periodicity", "Hydrogen", "s-Block Elements",
              "p-Block Elements", "d-Block & f-Block Elements", "Coordination Compounds",
              "Environmental Chemistry", "General Principles of Metallurgy",
              "Organic Chemistry Basics", "Hydrocarbons", "Haloalkanes & Haloarenes",
              "Alcohols Phenols & Ethers", "Aldehydes Ketones & Carboxylic Acids",
              "Amines", "Biomolecules", "Polymers", "Chemistry in Everyday Life"
            ],
          },
          {
            id: "neet-biology",
            name: "Biology (Botany & Zoology)",
            icon: "🧬",
            topics: [
              "Living World", "Biological Classification", "Plant Kingdom",
              "Morphology of Flowering Plants", "Anatomy of Flowering Plants",
              "Structural Organization in Animals", "Cell Structure & Function",
              "Biomolecules", "Cell Division", "Transport in Plants",
              "Mineral Nutrition", "Photosynthesis", "Respiration in Plants",
              "Plant Growth & Development", "Reproduction in Flowering Plants",
              "Sexual Reproduction in Flowering Plants", "Molecular Basis of Inheritance",
              "Principles of Inheritance & Variation", "Biotechnology Principles & Processes",
              "Biotechnology & Applications", "Animal Kingdom",
              "Digestion & Absorption", "Breathing & Exchange of Gases",
              "Body Fluids & Circulation", "Excretory Products & Elimination",
              "Locomotion & Movement", "Neural Control & Coordination",
              "Chemical Coordination & Integration", "Human Reproduction",
              "Reproductive Health", "Evolution", "Human Health & Diseases",
              "Strategies for Enhancement in Food Production", "Microbes in Human Welfare",
              "Organisms & Populations", "Ecosystem", "Biodiversity & Conservation",
              "Environmental Issues", "Immune System", "Genetics"
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
              "Constitution - Preamble", "Constitution - Fundamental Rights",
              "Constitution - Directive Principles", "Constitution - Fundamental Duties",
              "Constitution - Union Government", "Constitution - State Government",
              "Parliament - Structure & Functions", "State Legislature",
              "Judiciary - Supreme Court", "Judiciary - High Courts",
              "Constitutional Bodies", "Local Government - Panchayati Raj",
              "Local Government - Municipalities", "Federalism & Centre-State Relations",
              "Election Commission & Electoral Process", "CAG & Accountability",
              "Public Services & Civil Services", "Emergency Provisions",
              "Amendments & Constitutional Reforms", "Governance & Accountability"
            ],
          },
          {
            id: "upsc-history",
            name: "Indian History & Culture",
            icon: "📚",
            topics: [
              "Ancient India - Indus Valley", "Ancient India - Vedic Period",
              "Ancient India - Mauryan Empire", "Ancient India - Post-Mauryan Period",
              "Medieval India - Delhi Sultanate", "Medieval India - Mughal Empire",
              "Medieval India - Regional Kingdoms", "Cultural Heritage - Art & Architecture",
              "Social Movements - Bhakti & Sufi", "British Expansion in India",
              "Economic Impact of British Rule", "Social & Religious Reform Movements",
              "1857 Revolt", "Indian National Movement - Moderate Phase",
              "Indian National Movement - Extremist Phase", "Gandhi Era & Mass Movements",
              "Revolutionary Movements", "Post-Independence History"
            ],
          },
          {
            id: "upsc-geography",
            name: "Geography",
            icon: "🌍",
            topics: [
              "Physical Geography - Earth Structure", "Physical Geography - Landforms",
              "Physical Geography - Climate", "Physical Geography - Oceanography",
              "Physical Geography - Biogeography", "Indian Geography - Physical Features",
              "Indian Geography - Drainage Systems", "Indian Geography - Climate & Monsoon",
              "Indian Geography - Natural Vegetation", "Indian Geography - Soils",
              "Resources - Minerals", "Resources - Energy", "Resources - Water Resources",
              "Agriculture in India", "Industries in India", "Transport & Communication",
              "World Geography - Regional Studies", "Map Skills & Practical Geography"
            ],
          },
          {
            id: "upsc-economy",
            name: "Indian Economy",
            icon: "💰",
            topics: [
              "Economic Concepts - National Income", "Economic Concepts - GDP & GNP",
              "Economic Concepts - Inflation", "Indian Economy - Planning",
              "Indian Economy - Five Year Plans", "Indian Economy - Sectors",
              "Agriculture & Allied Sectors", "Industry & Services",
              "Banking System", "RBI & Monetary Policy", "Fiscal Policy & Budget",
              "Taxation System", "External Sector - Trade", "External Sector - BOP",
              "Infrastructure Development", "Poverty & Unemployment",
              "Social Sector Initiatives", "Economic Reforms",
              "Financial Markets", "Sustainable Development"
            ],
          },
          {
            id: "upsc-science",
            name: "Science & Technology",
            icon: "🔬",
            topics: [
              "Physics - Mechanics", "Physics - Heat & Thermodynamics",
              "Physics - Optics", "Physics - Electricity & Magnetism",
              "Chemistry - Matter & States", "Chemistry - Acids Bases Salts",
              "Chemistry - Metals & Non-metals", "Biology - Cell & Genetics",
              "Biology - Human Body Systems", "Biology - Diseases & Immunity",
              "Space Technology - ISRO Missions", "Space Technology - Satellites",
              "Defence Technology", "Biotechnology & Genetic Engineering",
              "Nuclear Technology", "Information Technology",
              "Nanotechnology", "Renewable Energy", "Environmental Science"
            ],
          },
          {
            id: "upsc-current",
            name: "Current Affairs & General Studies",
            icon: "📰",
            topics: [
              "National Affairs - Government Policies", "National Affairs - Schemes",
              "National Affairs - Social Issues", "International Relations - Foreign Policy",
              "International Relations - International Organizations",
              "International Relations - Bilateral Relations",
              "Economy - Budget & Economic Survey", "Economy - Economic Events",
              "Science & Tech Updates", "Environment & Climate Change",
              "Defense & Security", "Sports & Awards", "Art & Culture Events",
              "Supreme Court Judgments", "Summits & Conferences", "Important Personalities"
            ],
          },
          {
            id: "upsc-ethics",
            name: "Ethics, Integrity & Aptitude",
            icon: "⚖️",
            topics: [
              "Ethics - Basic Concepts", "Ethics - Moral Philosophy",
              "Ethics - Public Service Values", "Ethics - Probity in Governance",
              "Case Studies - Ethical Dilemmas", "Case Studies - Public Administration",
              "Attitude & Aptitude", "Emotional Intelligence",
              "Integrity & Honesty", "Ethics in International Relations"
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
              "Number System", "HCF & LCM", "Simplification & Approximation",
              "Percentages", "Ratio & Proportion", "Average",
              "Profit Loss & Discount", "Simple & Compound Interest",
              "Time & Work", "Time Speed & Distance", "Mixtures & Alligations",
              "Pipes & Cisterns", "Algebra - Linear Equations",
              "Algebra - Quadratic Equations", "Mensuration - 2D", "Mensuration - 3D",
              "Geometry - Lines & Angles", "Geometry - Triangles", "Geometry - Circles",
              "Trigonometry - Basics", "Trigonometry - Heights & Distances",
              "Data Interpretation - Tables & Graphs", "Statistics - Mean Median Mode",
              "Probability"
            ],
          },
          {
            id: "ssc-reasoning",
            name: "General Intelligence & Reasoning",
            icon: "🧩",
            topics: [
              "Analogies", "Similarities & Differences", "Coding-Decoding",
              "Series - Number Series", "Series - Letter Series", "Classification",
              "Direction Sense", "Blood Relations", "Ranking & Arrangement",
              "Syllogism", "Venn Diagrams", "Puzzles & Seating Arrangement",
              "Statement & Conclusions", "Statement & Assumptions",
              "Cubes & Dice", "Mirror & Water Images"
            ],
          },
          {
            id: "ssc-english",
            name: "English Language & Comprehension",
            icon: "📝",
            topics: [
              "Grammar - Parts of Speech", "Grammar - Tenses", "Grammar - Voice",
              "Grammar - Narration", "Grammar - Subject-Verb Agreement",
              "Grammar - Articles & Determiners", "Grammar - Prepositions",
              "Grammar - Conjunctions", "Reading Comprehension",
              "Vocabulary - Synonyms", "Vocabulary - Antonyms",
              "Vocabulary - One Word Substitution", "Idioms & Phrases",
              "Error Spotting", "Sentence Improvement"
            ],
          },
          {
            id: "ssc-gk",
            name: "General Awareness",
            icon: "🌐",
            topics: [
              "Current Affairs - National", "Current Affairs - International",
              "History - Ancient India", "History - Medieval India", "History - Modern India",
              "Geography - Physical", "Geography - India", "Geography - World",
              "Polity - Constitution", "Polity - Government",
              "Economy - Indian Economy", "Economy - Banking & Finance",
              "Science - Physics", "Science - Chemistry", "Science - Biology",
              "Books & Authors", "Sports & Awards", "Important Days & Events"
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
              "Art & Culture", "Environmental Issues", "Business & Finance (GDP, Inflation, Trade Agreements)"
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
              "Family Law Basics (Marriage, Divorce, Succession, Guardianship)",
              "Property Law & Easements (Ownership, Transfer, Rights)",
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
            id: "ailet-gk",
            name: "General Knowledge & Current Affairs",
            icon: "🌐",
            topics: [
              "Current Affairs (National & International events, last 12-18 months)",
              "Static GK (Important events in history, Geography, Economics, Polity)",
              "Legal Current Affairs (Landmark judgments, New laws, Legal reforms)",
              "Awards & Honours (National & International)", "International Events & Organizations (UN, WHO, WTO)",
              "Books & Authors (Recent publications)", "Sports Events & Achievements",
              "Government Policies & Schemes", "Science & Technology Developments",
              "Art & Culture", "Environmental Issues", "Business & Finance (GDP, Inflation, Trade Agreements)"
            ],
          },
          {
            id: "ailet-logical",
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
            id: "ailet-legal",
            name: "Legal Reasoning",
            icon: "📜",
            topics: [
              "Legal Principles & their Application", "Legal Maxims (Latin maxims)",
              "Constitutional Law Basics (Fundamental Rights, DPSPs, Judiciary)",
              "Criminal Law Basics (IPC provisions, Crimes, Punishment)",
              "Contract Law Basics (Agreement, Consideration, Breach)",
              "Tort Law Basics (Negligence, Nuisance, Defamation)",
              "Family Law Basics (Marriage, Divorce, Succession, Guardianship)",
              "Property Law & Easements (Ownership, Transfer, Rights)",
              "Legal Logical Reasoning (Applying principles to factual situations)",
              "Case-based Reasoning", "Legal Fact Scenarios"
            ],
          },
          {
            id: "ailet-maths",
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
              "Number System", "LCM & HCF", "Percentages", "Profit Loss & Discount",
              "Simple & Compound Interest", "Ratio & Proportion", "Mixtures & Alligations",
              "Time Speed & Distance", "Time & Work", "Averages",
              "Algebra - Linear Equations", "Algebra - Quadratic Equations",
              "Algebra - Inequalities", "Geometry - Lines & Angles",
              "Geometry - Triangles", "Geometry - Circles", "Geometry - Quadrilaterals",
              "Mensuration - 2D", "Mensuration - 3D", "Trigonometry", "Logarithms",
              "Permutations & Combinations", "Probability", "Set Theory"
            ],
          },
          {
            id: "cat-varc",
            name: "Verbal Ability & Reading Comprehension (VARC)",
            icon: "📝",
            topics: [
              "Reading Comprehension - Passages", "Reading Comprehension - Critical Reasoning",
              "Para Jumbles", "Para Summary", "Para Completion",
              "Sentence Correction", "Sentence Rearrangement", "Fill in the Blanks",
              "Vocabulary - Synonyms & Antonyms", "Idioms & Phrases",
              "Error Spotting", "Fact Inference Judgment", "Odd Sentence Out"
            ],
          },
          {
            id: "cat-dilr",
            name: "Data Interpretation & Logical Reasoning (DILR)",
            icon: "📊",
            topics: [
              "Data Interpretation - Tables", "Data Interpretation - Bar Graphs",
              "Data Interpretation - Line Graphs", "Data Interpretation - Pie Charts",
              "Data Interpretation - Caselets", "Data Interpretation - Mixed Graphs",
              "Data Sufficiency", "Logical Reasoning - Seating Arrangement",
              "Logical Reasoning - Puzzles", "Logical Reasoning - Blood Relations",
              "Logical Reasoning - Binary Logic", "Logical Reasoning - Games & Tournaments",
              "Logical Reasoning - Networks", "Logical Reasoning - Cubes"
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
            id: "htet-hindi",
            name: "Hindi Bhasha & Shikshan Vidhi",
            icon: "📖",
            topics: [
              "Apathit Gadyansh (Unseen prose comprehension)", "Apathit Padyansh (Unseen poetry)",
              "Vyakaran (Grammar - Sangya, Sarvanam, Visheshan, Kriya, Kaal, Vakya, Sandhi, Samas)",
              "Bhasha Shikshan Vidhi (Language teaching pedagogy, Teaching methods, Assessment)"
            ],
          },
          {
            id: "htet-english",
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
            id: "htet-maths",
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
            id: "htet-science",
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
            id: "htet-social",
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
            id: "rtet-hindi",
            name: "Hindi Bhasha & Shikshan Vidhi",
            icon: "📖",
            topics: [
              "Apathit Gadyansh (Unseen prose comprehension)", "Apathit Padyansh (Unseen poetry)",
              "Vyakaran (Grammar - Sangya, Sarvanam, Visheshan, Kriya, Kaal, Vakya, Sandhi, Samas)",
              "Bhasha Shikshan Vidhi (Language teaching pedagogy, Teaching methods, Assessment)"
            ],
          },
          {
            id: "rtet-english",
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
            id: "rtet-maths",
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
            id: "rtet-science",
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
            id: "rtet-social",
            name: "Social Studies & Pedagogy",
            icon: "🌍",
            topics: [
              "History (Ancient, Medieval, Modern India, Freedom struggle, Rajasthan History)",
              "Geography (Earth, Solar system, Maps, Natural resources, Climate, India & World geography, Rajasthan Geography)",
              "Civics (Indian Constitution, Government, Democracy, Rights & Duties)",
              "Economics (Basic concepts, Money, Banking)",
              "Rajasthan Culture & Heritage (Folk arts, Traditions, Famous personalities)",
              "Social Studies Pedagogy (Teaching methods, Projects, Inquiry-based learning, Assessment)"
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
            id: "uptet-hindi",
            name: "Hindi Bhasha & Shikshan Vidhi",
            icon: "📖",
            topics: [
              "Apathit Gadyansh (Unseen prose comprehension)", "Apathit Padyansh (Unseen poetry)",
              "Vyakaran (Grammar - Sangya, Sarvanam, Visheshan, Kriya, Kaal, Vakya, Sandhi, Samas)",
              "Bhasha Shikshan Vidhi (Language teaching pedagogy, Teaching methods, Assessment)"
            ],
          },
          {
            id: "uptet-english",
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
            id: "uptet-maths",
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
            id: "uptet-science",
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
            id: "uptet-social",
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
            id: "ca-paper1-accounting",
            name: "Paper 1: Principles & Practice of Accounting",
            icon: "📊",
            topics: [
              "Accounting Principles & Concepts (GAAP, Conventions, Accounting Standards)",
              "Double Entry System & Accounting Equation",
              "Journal Entries & Subsidiary Books",
              "Ledger & Trial Balance",
              "Bank Reconciliation Statement",
              "Bills of Exchange & Promissory Notes",
              "Rectification of Errors",
              "Capital & Revenue Transactions",
              "Depreciation Accounting (Methods, Journal Entries)",
              "Goods & Services Tax (GST) - Basics, Input Tax Credit, Returns",
              "Accounts from Incomplete Records (Single Entry System)",
              "Partnership Accounts (Admission, Retirement, Death of Partner, Dissolution)",
              "Company Accounts (Share Capital, Issue of Shares, Forfeiture, Debentures)",
              "Final Accounts (Trading Account, Profit & Loss Account, Balance Sheet)",
              "Consignment Accounts",
              "Joint Venture Accounts",
              "Branch Accounts",
              "Accounting for Special Transactions"
            ],
          },
          {
            id: "ca-paper2-law-correspondence",
            name: "Paper 2: Business Laws & Business Correspondence",
            icon: "⚖️",
            topics: [
              "Indian Contract Act 1872 - Nature of Contract (Offer, Acceptance, Consideration)",
              "Indian Contract Act 1872 - Performance & Discharge (Breach of Contract, Remedies)",
              "Indian Contract Act 1872 - Special Contracts (Indemnity, Guarantee, Bailment, Pledge, Agency)",
              "Sale of Goods Act 1930 (Contract of Sale, Conditions & Warranties, Transfer of Property, Unpaid Seller)",
              "Partnership Act 1932 (Nature, Types, Rights & Duties, Dissolution)",
              "Limited Liability Partnership (LLP) Act 2008 (Formation, Registration, Benefits)",
              "Companies Act 2013 - Basics (Incorporation, Types of Companies, MOA, AOA)",
              "Business Communication - Principles & Process",
              "Letter Writing (Business Letters, Applications, Complaint, Inquiry)",
              "Report Writing (Business Reports, Meeting Minutes)",
              "Précis Writing",
              "Drafting of Agenda & Minutes of Meetings"
            ],
          },
          {
            id: "ca-paper3a-maths",
            name: "Paper 3A: Business Mathematics",
            icon: "🔢",
            topics: [
              "Ratio, Proportion & Variation",
              "Indices & Logarithms",
              "Equations (Linear, Quadratic, Cubic)",
              "Matrices & Determinants",
              "Arithmetic & Geometric Progression",
              "Permutation & Combination",
              "Sets, Relations & Functions"
            ],
          },
          {
            id: "ca-paper3b-logical",
            name: "Paper 3B: Logical Reasoning",
            icon: "🧠",
            topics: [
              "Number Series & Pattern Recognition",
              "Coding-Decoding",
              "Odd Man Out",
              "Direction Sense & Distance",
              "Blood Relations",
              "Syllogism & Logical Deduction",
              "Seating Arrangement (Linear, Circular)",
              "Analytical Reasoning & Puzzles (Statements, Conclusions)"
            ],
          },
          {
            id: "ca-paper3c-statistics",
            name: "Paper 3C: Statistics",
            icon: "📊",
            topics: [
              "Statistical Description of Data (Collection, Organization, Presentation)",
              "Measures of Central Tendency (Mean, Median, Mode)",
              "Measures of Dispersion (Range, Variance, Standard Deviation, Coefficient of Variation)",
              "Correlation & Regression Analysis",
              "Probability Theory (Basic Concepts, Theorems, Conditional Probability)",
              "Probability Distributions (Binomial, Poisson, Normal)",
              "Index Numbers (Price Index, Quantity Index, Cost of Living Index)",
              "Time Series Analysis (Trend, Seasonal Variations)",
              "Sampling Theory (Types of Sampling, Sampling Distributions)",
              "Statistical Graphs & Diagrams (Bar, Pie, Histogram, Frequency Polygon)"
            ],
          },
          {
            id: "ca-paper4a-economics",
            name: "Paper 4A: Business Economics",
            icon: "💰",
            topics: [
              "Introduction to Microeconomics (Scope, Methods, Basic Problems)",
              "Theory of Demand & Supply (Laws, Determinants)",
              "Elasticity of Demand & Supply (Price, Income, Cross Elasticity)",
              "Consumer Equilibrium Theory (Utility Analysis, Indifference Curve)",
              "Theory of Production & Cost (Production Function, Isoquants, Cost Curves)",
              "Price Determination in Different Markets (Perfect Competition, Monopoly, Monopolistic Competition, Oligopoly)",
              "National Income Accounting (Concepts, Methods of Measurement)",
              "Money & Banking (Functions of Money, Commercial Banks, Central Bank, Monetary Policy)",
              "Fiscal Policy (Public Revenue, Public Expenditure, Budget, Taxation)",
              "Business Cycles (Phases, Causes, Effects)"
            ],
          },
          {
            id: "ca-paper4b-bck",
            name: "Paper 4B: Business & Commercial Knowledge",
            icon: "🌐",
            topics: [
              "Business Environment (Economic, Social, Political, Technological, Legal)",
              "Indian Economy - Overview (Structure, Planning, Five-Year Plans, Economic Sectors)",
              "Economic Reforms in India (Liberalization, Privatization, Globalization)",
              "Indian Financial System (Banking System, NBFC, Capital Market, SEBI)",
              "Stock Exchange & Capital Market (BSE, NSE, Primary & Secondary Market)",
              "Current Business Affairs (Last 6 months - Major business events, deals, IPOs)",
              "Corporate Governance & CSR (Principles, Importance, CSR Activities)",
              "Digital India & Fintech (UPI, Digital Payments, Blockchain, Cryptocurrency basics)"
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
