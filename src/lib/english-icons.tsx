// Professional Icon Mapping for English Learning Hub
// Uses Lucide icons instead of emojis for a clean, professional look

import {
  Type,
  Volume2,
  Mic,
  FileText,
  Users,
  Tag,
  MessageCircle,
  Star,
  Zap,
  Clock,
  RotateCcw,
  Calendar,
  TrendingUp,
  ListChecks,
  Repeat,
  MessageSquare,
  MessageSquareQuote,
  BookOpen,
  FileEdit,
  Layers,
  Hash,
  Library,
  Languages,
  Brain,
  Sparkles,
  BookMarked,
  NotebookText,
  PenTool,
  Mail,
  Phone,
  Briefcase,
  Presentation,
  GraduationCap,
  Target,
  Globe,
  Building,
  type LucideIcon,
} from "lucide-react";

// Icon mapping for topics
export const topicIcons: Record<string, LucideIcon> = {
  // Module 1: Alphabet & Phonics
  "alphabet-basics": Type,
  "phonics-vowels": Volume2,
  pronunciation: Mic,
  "pronunciation-practice": Mic,

  // Module 2: Basic Grammar
  "parts-of-speech": FileText,
  "nouns-detailed": Users,
  "pronouns-detailed": Tag,
  articles: MessageCircle,
  adjectives: Star,
  "verbs-basics": Zap,

  // Module 3: Tenses
  "present-simple": Clock,
  "present-continuous": RotateCcw,
  "present-perfect": Calendar,
  "past-simple": TrendingUp,
  "past-continuous": RotateCcw,
  "future-simple": TrendingUp,
  "tenses-advanced": Clock,

  // Module 4: Sentence Construction
  "sentence-types": ListChecks,
  "subject-verb-agreement": Repeat,
  "active-passive": MessageSquare,
  "reported-speech": MessageSquareQuote,

  // Module 5: Vocabulary
  "essential-vocabulary": BookOpen,
  "synonyms-antonyms": Repeat,
  "word-formation": FileEdit,
  "phrasal-verbs": Layers,
  idioms: Hash,

  // Module 6: Reading
  "reading-fundamentals": Library,
  "short-stories": BookMarked,
  "reading-comprehension": NotebookText,

  // Module 7: Writing
  "writing-basics": PenTool,
  "paragraph-writing": FileEdit,
  "essay-writing": NotebookText,
  "letter-writing": Mail,

  // Module 8: Speaking & Listening
  "daily-conversations": Phone,
  "listening-skills": Volume2,

  // Other paths
  "grammar-basics": FileText,
  "vocabulary-ssc": Languages,
  "sentence-improvement": Brain,
  comprehension: BookOpen,
  "cloze-test": Sparkles,
  "ielts-reading": BookOpen,
  "ielts-writing": PenTool,
  "ielts-listening": Volume2,
  "ielts-speaking": Mic,
  "toefl-integrated": Layers,
  "academic-vocabulary": GraduationCap,
  "job-interviews": Briefcase,
  presentations: Presentation,
  "email-writing": Mail,
  "business-communication": Building,
};

// Path-level icons
export const pathIcons: Record<string, LucideIcon> = {
  foundation: GraduationCap,
  "competitive-exam": Target,
  "ielts-toefl": Globe,
  "real-world": Briefcase,
};

// Get icon component by topic ID
export function getTopicIcon(topicId: string): LucideIcon {
  return topicIcons[topicId] || BookOpen; // Default to BookOpen
}

// Get icon component by path ID
export function getPathIcon(pathId: string): LucideIcon {
  return pathIcons[pathId] || GraduationCap; // Default to GraduationCap
}
