/**
 * Professional Icon Mapping System
 * Replaces all emojis with contextually appropriate Lucide icons
 * Based on industry standards from PW.live, Unacademy, etc.
 */

import {
  // Education & Academic
  GraduationCap,
  BookOpen,
  School,
  Library,
  Award,

  // Engineering & Technical
  Cpu,
  Cog,
  Zap,
  Settings,
  Wrench,
  HardDrive,
  Component,
  Binary,
  CircuitBoard,

  // Medical & Science
  Stethoscope,
  Heart,
  Microscope,
  FlaskConical,
  Dna,
  Pill,
  Activity,
  Syringe,

  // Law & Judicial
  Scale,
  Gavel,
  FileText,
  Briefcase,
  ScrollText,
  BadgeCheck,

  // Government & Civil Services
  Building,
  Building2,
  Landmark,
  Flag,
  Shield,
  Users,
  University,

  // Banking & Finance
  Banknote,
  DollarSign,
  TrendingUp,
  Calculator,
  CreditCard,
  PiggyBank,
  Coins,
  Wallet,
  HandCoins,

  // Defense & Services
  ShieldCheck,
  Plane,
  Anchor,
  Target,
  ShieldAlert,
  Swords,

  // Mathematics & Science
  Calculator as Calc,
  Calculator as SquareRoot,
  ChartBar,
  LineChart,
  PieChart,
  Sigma,

  // Languages & Humanities
  Languages,
  BookText,
  MessageSquare,
  PenTool,
  Type,
  BookMarked,

  // Arts & Design
  Palette,
  Paintbrush,
  Image,
  Music,

  // Transport & Railways
  Train,
  Bus,
  Ship,
  Truck,
  TrainTrack,

  // General Purpose
  CheckCircle2,
  Circle,
  Lightbulb,
  Target as TargetIcon,
  Trophy,
  Star,
  Flame,
  Clock,
  Calendar,
  MapPin,
  Globe,
  Rocket,
  Hash,
  Blocks,

  type LucideIcon,
} from "lucide-react";

// Exam Category Icons - Highly specific and contextual
export const examCategoryIcons: Record<string, LucideIcon> = {
  // Engineering Exams
  "jee": Cpu,                    // CPU for engineering/tech
  "gate": CircuitBoard,          // Circuit board for GATE (more technical)
  "engineering": Component,       // Component for general engineering
  "ese": Cog,                    // Gear for engineering services
  "ae-je": Wrench,              // Wrench for assistant engineer

  // Medical Exams
  "neet": Stethoscope,          // Stethoscope for medical
  "aiims": Heart,               // Heart for medical institute
  "medical": Activity,           // Activity graph for medical
  "nursing": Syringe,           // Syringe for nursing (more specific than Pill)

  // Civil Services & Government
  "upsc": Landmark,             // Government building for UPSC
  "ias": Flag,                  // Flag for civil services
  "ips": ShieldAlert,           // Shield with alert for police service
  "ifs": Globe,                 // Globe for foreign service
  "state-psc": University,      // University for state services

  // Banking & Finance
  "banking": Banknote,          // Currency for banking
  "sbi": PiggyBank,             // Piggy bank for SBI
  "rbi": Coins,                 // Coins for RBI
  "ibps": Wallet,               // Wallet for banking exams
  "finance": HandCoins,         // Hand with coins for finance

  // SSC Exams
  "ssc": Building2,             // Office building for SSC
  "ssc-cgl": Sigma,             // Sigma for combined exams (mathematical)
  "ssc-chsl": ScrollText,       // Scroll for clerical
  "ssc-mts": Users,             // Users for multi-tasking

  // Defense & Services
  "nda": Swords,                // Crossed swords for defense academy
  "cds": ShieldCheck,           // Shield check for defense services
  "capf": Shield,               // Shield for police forces
  "navy": Anchor,               // Anchor for navy
  "airforce": Plane,            // Plane for air force

  // Law & Judicial
  "judiciary": Gavel,           // Gavel for judiciary
  "clat": Scale,                // Scale for law entrance
  "judicial-services": BadgeCheck, // Badge for judicial services
  "law": BookText,              // Law book

  // Management
  "cat": Briefcase,            // Briefcase for management
  "mat": PieChart,             // Pie chart for management aptitude
  "gmat": TrendingUp,          // Trending for business
  "mba": LineChart,            // Line chart for business school

  // Teaching
  "ctet": BookMarked,          // Marked book for teaching eligibility
  "tet": GraduationCap,        // Graduation cap for teaching
  "ugc-net": Library,          // Library for academic
  "teaching": BookOpen,        // Open book for teaching

  // Railways
  "rrb": TrainTrack,           // Train track for railways (more specific)
  "railway": Train,            // Train icon
  "ntpc": Zap,                 // Lightning for technical

  // Science & Research
  "science": Microscope,       // Microscope for science
  "research": FlaskConical,    // Flask for research
  "csir": Dna,                // DNA for scientific research

  // Commerce & Accountancy
  "ca": Calculator,            // Calculator for CA
  "cs": FileText,             // Document for CS
  "cma": ChartBar,            // Chart for cost accounting
  "commerce": DollarSign,     // Dollar for commerce

  // State Exams
  "state-exam": MapPin,       // Pin for state-specific
  "mpsc": Building,           // Building for state service
  "tnpsc": Flag,              // Flag for state PSC (different from Landmark)

  // Languages
  "english": Type,             // Type for English
  "hindi": Languages,          // Languages icon
  "language": MessageSquare,   // Message for languages

  // School & Foundation
  "class-10": School,          // School building
  "class-12": University,      // University for senior secondary
  "foundation": Blocks,        // Blocks for foundation
  "school": BookOpen,          // Book for school

  // Olympiad & Competitions
  "olympiad": Trophy,          // Trophy for competition
  "ntse": Award,              // Award for talent search
  "kvpy": Star,               // Star for excellence

  // Default fallback
  "default": Target,          // Target as default
};

// Subject Icons - For topics within exams
export const subjectIcons: Record<string, LucideIcon> = {
  // STEM Subjects
  "mathematics": SquareRoot,
  "maths": Calculator,
  "physics": Zap,
  "chemistry": FlaskConical,
  "biology": Dna,
  "science": Microscope,

  // Engineering Subjects
  "electrical": Zap,
  "mechanical": Cog,
  "civil": Building2,
  "computer-science": Cpu,
  "electronics": Binary,
  "programming": Component,

  // Humanities
  "history": BookText,
  "geography": Globe,
  "economics": TrendingUp,
  "political-science": Landmark,
  "sociology": Users,
  "psychology": Activity,

  // Languages
  "english": Type,
  "hindi": Languages,
  "sanskrit": BookText,

  // Commerce
  "accounts": Calculator,
  "business-studies": Briefcase,
  "finance": DollarSign,

  // General
  "general-knowledge": Lightbulb,
  "current-affairs": Calendar,
  "reasoning": Lightbulb,
  "aptitude": Calculator,

  // Default
  "default": BookOpen,
};

// Feature Icons - For app features
export const featureIcons: Record<string, LucideIcon> = {
  "quiz": CheckCircle2,
  "practice": Target,
  "mock-test": Clock,
  "review": Flame,
  "dashboard": LineChart,
  "leaderboard": Trophy,
  "progress": TrendingUp,
  "daily-practice": Calendar,
  "mistake-map": ChartBar,
  "doubt-solving": MessageSquare,
  "sprint": Rocket,
  "streak": Flame,
  "achievement": Award,
  "target": TargetIcon,
  "clarify": Lightbulb,
  "default": Star,
};

// Status Icons
export const statusIcons: Record<string, LucideIcon> = {
  "completed": CheckCircle2,
  "in-progress": Circle,
  "locked": Shield,
  "unlocked": CheckCircle2,
  "default": Circle,
};

// Helper Functions
export function getExamIcon(examId: string): LucideIcon {
  const normalizedId = examId.toLowerCase().replace(/[_\s]/g, "-");
  return examCategoryIcons[normalizedId] || examCategoryIcons.default;
}

export function getSubjectIcon(subjectId: string): LucideIcon {
  const normalizedId = subjectId.toLowerCase().replace(/[_\s]/g, "-");
  return subjectIcons[normalizedId] || subjectIcons.default;
}

export function getFeatureIcon(featureId: string): LucideIcon {
  const normalizedId = featureId.toLowerCase().replace(/[_\s]/g, "-");
  return featureIcons[normalizedId] || featureIcons.default;
}

export function getStatusIcon(status: string): LucideIcon {
  const normalizedId = status.toLowerCase().replace(/[_\s]/g, "-");
  return statusIcons[normalizedId] || statusIcons.default;
}

// Exam name to icon mapping (for display purposes)
export const examDisplayIcons: Record<string, LucideIcon> = {
  // Engineering
  "IIT JEE": Cpu,
  "JEE Main": Cpu,
  "JEE Advanced": Cpu,
  "GATE": CircuitBoard,
  "Engineering": Component,
  "ESE": Cog,
  "AE/JE": Wrench,

  // Medical
  "NEET UG": Stethoscope,
  "NEET PG": Activity,
  "AIIMS": Heart,
  "Medical": Stethoscope,
  "Nursing": Syringe,

  // Civil Services
  "UPSC CSE": Landmark,
  "IAS": Flag,
  "IPS": ShieldAlert,
  "IFS": Globe,

  // Banking
  "Banking": Banknote,
  "SBI PO": PiggyBank,
  "IBPS": Wallet,
  "RBI": Coins,

  // SSC
  "SSC CGL": Sigma,
  "SSC CHSL": ScrollText,
  "SSC MTS": Users,

  // Defense
  "NDA": Swords,
  "CDS": ShieldCheck,
  "CAPF": Shield,
  "Navy": Anchor,
  "Air Force": Plane,

  // Law
  "Judiciary": Gavel,
  "CLAT": Scale,
  "Judicial Services": BadgeCheck,

  // Railways
  "RRB": TrainTrack,
  "Railway": Train,
  "RRB NTPC": Zap,

  // Management
  "CAT": Briefcase,
  "MAT": PieChart,
  "MBA": LineChart,

  // Teaching
  "CTET": BookMarked,
  "TET": GraduationCap,
  "UGC NET": Library,

  // State PSC
  "MPSC": Building,
  "TNPSC": Flag,
  "State PSC": University,

  // School
  "Class 10": School,
  "Class 12": University,

  // Others
  "CA": Calculator,
  "DSSSB": MapPin,
};
