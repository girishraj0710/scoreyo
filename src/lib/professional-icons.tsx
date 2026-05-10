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

  // Medical & Science
  Stethoscope,
  Heart,
  Microscope,
  FlaskConical,
  Dna,
  Pill,
  Activity,

  // Law & Judicial
  Scale,
  Gavel,
  FileText,
  Briefcase,

  // Government & Civil Services
  Building,
  Building2,
  Landmark,
  Flag,
  Shield,
  Users,

  // Banking & Finance
  Banknote,
  DollarSign,
  TrendingUp,
  Calculator,
  CreditCard,
  PiggyBank,
  Coins,

  // Defense & Services
  ShieldCheck,
  Plane,
  Anchor,
  Target,

  // Mathematics & Science
  Calculator as Calc,
  Calculator as SquareRoot,  // Using Calculator for math
  ChartBar,
  LineChart,

  // Languages & Humanities
  Languages,
  BookText,
  MessageSquare,
  PenTool,
  Type,

  // Arts & Design
  Palette,
  Paintbrush,
  Image,
  Music,

  // Transport & Railways
  Train,
  Bus,
  Ship,

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

  type LucideIcon,
} from "lucide-react";

// Exam Category Icons - Highly specific and contextual
export const examCategoryIcons: Record<string, LucideIcon> = {
  // Engineering Exams
  "jee": Cpu,                    // CPU for engineering/tech
  "gate": Cog,                   // Gear/cog for engineering
  "engineering": Component,       // Component for general engineering
  "ese": Settings,               // Settings for engineering services
  "ae-je": Wrench,              // Wrench for assistant engineer

  // Medical Exams
  "neet": Stethoscope,          // Stethoscope for medical
  "aiims": Heart,               // Heart for medical institute
  "medical": Activity,           // Activity graph for medical
  "nursing": Pill,              // Pill for nursing

  // Civil Services & Government
  "upsc": Landmark,             // Government building for UPSC
  "ias": Flag,                  // Flag for civil services
  "ips": ShieldCheck,           // Shield for police service
  "ifs": Globe,                 // Globe for foreign service
  "state-psc": Building,        // Building for state services

  // Banking & Finance
  "banking": Banknote,          // Currency for banking
  "sbi": PiggyBank,             // Piggy bank for SBI
  "rbi": Coins,                 // Coins for RBI
  "ibps": CreditCard,           // Card for banking exams
  "finance": TrendingUp,        // Chart for finance

  // SSC Exams
  "ssc": Building2,             // Office building for SSC
  "ssc-cgl": Calculator,        // Calculator for combined exams
  "ssc-chsl": FileText,         // Document for clerical
  "ssc-mts": Users,             // Users for multi-tasking

  // Defense & Services
  "nda": Target,                // Target for defense
  "cds": ShieldCheck,           // Shield for defense services
  "capf": Shield,               // Shield for police forces
  "navy": Anchor,               // Anchor for navy
  "airforce": Plane,            // Plane for air force

  // Law & Judicial
  "judiciary": Scale,           // Scale of justice
  "clat": Gavel,               // Gavel for law
  "judicial-services": Scale,   // Scale for judicial
  "law": BookText,             // Law book

  // Management
  "cat": Briefcase,            // Briefcase for management
  "mat": LineChart,            // Chart for management
  "gmat": TrendingUp,          // Trending for business
  "mba": Building2,            // Building for business school

  // Teaching
  "ctet": School,              // School for teaching
  "tet": GraduationCap,        // Graduation cap for teaching
  "ugc-net": Library,          // Library for academic
  "teaching": BookOpen,        // Open book for teaching

  // Railways
  "rrb": Train,                // Train for railways
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
  "tnpsc": Landmark,          // Landmark for state PSC

  // Languages
  "english": Type,             // Type for English
  "hindi": Languages,          // Languages icon
  "language": MessageSquare,   // Message for languages

  // School & Foundation
  "class-10": School,          // School building
  "class-12": GraduationCap,   // Graduation for 12th
  "foundation": Library,       // Library for foundation
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
  "GATE": Cog,
  "Engineering": Component,
  "ESE": Settings,
  "AE/JE": Wrench,

  // Medical
  "NEET UG": Stethoscope,
  "NEET PG": Activity,
  "AIIMS": Heart,
  "Medical": Stethoscope,

  // Civil Services
  "UPSC CSE": Landmark,
  "IAS": Flag,
  "IPS": ShieldCheck,
  "IFS": Globe,

  // Banking
  "Banking": Banknote,
  "SBI PO": PiggyBank,
  "IBPS": CreditCard,
  "RBI": Coins,

  // SSC
  "SSC CGL": Calculator,
  "SSC CHSL": FileText,
  "SSC MTS": Users,

  // Defense
  "NDA": Target,
  "CDS": ShieldCheck,
  "Navy": Anchor,
  "Air Force": Plane,

  // Law
  "Judiciary": Scale,
  "CLAT": Gavel,
  "Judicial Services": Scale,

  // Railways
  "RRB": Train,
  "Railway": Train,
  "RRB NTPC": Zap,

  // Management
  "CAT": Briefcase,
  "MBA": Building2,

  // Teaching
  "CTET": School,
  "UGC NET": Library,

  // Others
  "CA": Calculator,
  "MPSC": Building,
  "State PSC": MapPin,
};
