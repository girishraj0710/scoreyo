/**
 * Centralized Icon Registry for Scoreyo
 *
 * Purpose: Single source of truth for all icons used across the application
 * Library: Lucide React (professional, consistent, accessible)
 *
 * Usage:
 *   import { Icons } from '@/lib/icons';
 *   <Icons.courses className="w-5 h-5" />
 *
 * Policy: No component should import icons directly from lucide-react.
 * All icons must go through this registry for consistency.
 */

import {
  // Navigation & Layout
  LayoutDashboard,
  Home,
  BookOpen,
  Brain,
  Layers,
  GraduationCap,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,

  // Status & Progress
  Circle,
  CheckCircle2,
  Lock,
  TrendingUp,
  Trophy,
  Award,
  Medal,
  Star,

  // Metrics & Stats
  Flame,
  Zap,
  Clock,
  Target,
  BarChart3,
  PieChart,
  ChartColumn,

  // Actions & Controls
  Play,
  Pause,
  RotateCcw,
  Settings,
  Bell,
  Search,
  Filter,
  Download,
  Upload,
  Share2,
  Copy,
  Check,

  // User & Social
  User,
  Users,
  UserCircle,
  LogOut,

  // Content & Learning
  FileText,
  ClipboardList,
  ClipboardCheck,
  PencilLine,
  NotebookPen,
  Bookmark,
  BookMarked,
  Library,
  Type,
  Mic,
  List,
  Palette,
  MapPin,
  Quote,
  Languages,
  Repeat,
  SkipBack,
  SkipForward,
  FastForward,
  Crosshair,
  Shuffle,
  Link2,

  // Communication
  MessageSquare,
  MessageCircle,
  Mail,
  Send,

  // Feedback
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  AlertTriangle,
  Info,
  HelpCircle,

  // Calendar & Time
  Calendar,
  CalendarDays,
  Timer,
  History,

  // Miscellaneous
  Sparkles,
  Lightbulb,
  Flag,
  Eye,
  EyeOff,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';

/**
 * Custom 3D SVG Icons for Advanced English Topics
 */
import { AcademicVocabularyIcon } from '@/components/icons/AcademicVocabularyIcon';
import { EssayWritingIcon } from '@/components/icons/EssayWritingIcon';
import { PresentationsIcon } from '@/components/icons/PresentationsIcon';
import { DebateIcon } from '@/components/icons/DebateIcon';

/**
 * Icon Registry
 * Organized by category for easy discovery
 */
export const Icons = {
  // ===== NAVIGATION =====
  dashboard: LayoutDashboard,
  home: Home,
  back: ChevronLeft,
  next: ChevronRight,
  menu: Menu,
  close: X,

  // ===== COURSE TYPES =====
  courses: BookOpen,
  practice: Brain,
  vocabulary: Layers,
  testPrep: GraduationCap,
  library: Library,

  // ===== STATUS INDICATORS =====
  notStarted: Circle,
  completed: CheckCircle2,
  locked: Lock,
  inProgress: Play,

  // ===== ACHIEVEMENT & PROGRESS =====
  trending: TrendingUp,
  leaderboard: Trophy,
  achievement: Award,
  medal: Medal,
  star: Star,

  // ===== METRICS =====
  streak: Flame,
  xp: Zap,
  time: Clock,
  goal: Target,
  analytics: BarChart3,
  chart: ChartColumn,
  pie: PieChart,

  // ===== CONTENT TYPES =====
  test: ClipboardList,
  quiz: ClipboardCheck,
  notes: NotebookPen,
  document: FileText,
  writing: PencilLine,
  bookmark: Bookmark,
  bookmarked: BookMarked,
  typing: Type,
  speaking: Mic,

  // ===== ACTIONS =====
  play: Play,
  pause: Pause,
  retry: RotateCcw,
  settings: Settings,
  notifications: Bell,
  search: Search,
  filter: Filter,
  download: Download,
  upload: Upload,
  share: Share2,
  copy: Copy,
  check: Check,
  add: Plus,
  remove: Minus,
  arrowRight: ArrowRight,
  arrowLeft: ArrowLeft,
  external: ExternalLink,

  // ===== USER =====
  profile: User,
  users: Users,
  userCircle: UserCircle,
  logout: LogOut,

  // ===== COMMUNICATION =====
  message: MessageSquare,
  chat: MessageCircle,
  email: Mail,
  send: Send,

  // ===== FEEDBACK =====
  like: ThumbsUp,
  dislike: ThumbsDown,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
  help: HelpCircle,

  // ===== TIME =====
  calendar: Calendar,
  calendarDays: CalendarDays,
  timer: Timer,
  history: History,

  // ===== SPECIAL =====
  ai: Sparkles,
  idea: Lightbulb,
  flag: Flag,
  show: Eye,
  hide: EyeOff,
} as const;

/**
 * TypeScript type for icon names
 * Enables autocomplete and type safety
 */
export type IconName = keyof typeof Icons;

/**
 * Icon size presets (in pixels)
 * Use these classes for consistent sizing
 */
export const IconSizes = {
  xs: 'w-3 h-3',        // 12px - inline text icons
  sm: 'w-3.5 h-3.5',    // 14px - small badges
  md: 'w-4 h-4',        // 16px - buttons, navigation
  lg: 'w-5 h-5',        // 20px - cards, toolbar
  xl: 'w-6 h-6',        // 24px - headers
  '2xl': 'w-8 h-8',     // 32px - large cards
  '3xl': 'w-10 h-10',   // 40px - hero sections
  '4xl': 'w-12 h-12',   // 48px - module headers
} as const;

/**
 * Icon color presets
 * Semantic colors for different states
 */
export const IconColors = {
  primary: 'text-[#5B7CFF]',
  success: 'text-[#10B981]',
  warning: 'text-[#F59E0B]',
  error: 'text-[#EF4444]',
  neutral: 'text-slate-600 dark:text-slate-400',
  muted: 'text-slate-400 dark:text-slate-500',
  purple: 'text-[#7C3AED]',
  teal: 'text-[#14B8A6]',
  amber: 'text-[#F59E0B]',
} as const;

/**
 * Helper: Get icon component by name
 * Useful for dynamic icon rendering
 */
export function getIcon(name: IconName) {
  return Icons[name];
}

/**
 * Accessibility helpers
 */
export const IconLabels = {
  back: 'Go back',
  next: 'Next',
  close: 'Close',
  menu: 'Open menu',
  settings: 'Settings',
  notifications: 'Notifications',
  profile: 'User profile',
  logout: 'Logout',
  search: 'Search',
  filter: 'Filter',
  help: 'Help',
  time: 'Duration',
  goal: 'Target questions',
  locked: 'Locked - complete prerequisites first',
  completed: 'Completed',
  notStarted: 'Not started',
} as const;

/**
 * Topic Icon Mapper
 * Maps topic IDs to professional Lucide icons
 * Replaces emojis with semantic, accessible icons
 *
 * Note: All icons are already imported at the top of this file
 * We're just creating a mapping from topic IDs to icon components
 */
export const TopicIcons: Record<string, any> = {
  // ===== FOUNDATION TOPICS =====

  // Module 1: Building Blocks
  'alphabet-pronunciation': Type,
  'parts-of-speech': List,
  'nouns-articles': BookOpen,
  'pronouns-determiners': User,
  'adjectives-adverbs': Palette,

  // Module 2: Sentence Essentials
  'basic-verbs-sentences': MessageSquare,
  'prepositions-mastery': MapPin,
  'question-formation': HelpCircle,
  'sentence-types-punctuation': FileText,

  // Module 3: Essential Tenses
  'present-tenses': RotateCcw,
  'past-tenses': SkipBack,
  'future-tenses': SkipForward,
  'present-perfect': CheckCircle2,
  'past-perfect': FastForward,

  // Module 4: Voice & Modals
  'modal-verbs': Lock,
  'passive-voice': Shuffle,

  // Module 5: Advanced Grammar
  'gerunds-infinitives': Repeat,
  'past-habits': History,
  'reported-speech': Quote,

  // Module 6: Complex Structures
  'conditionals': Shuffle,
  'relative-clauses': Link2,
  'conjunctions-connectors': Link2,

  // Module 7: Vocabulary
  'essential-vocabulary': BookOpen,
  'word-formation': Languages,
  'phrasal-verbs': Crosshair,
  'idioms-expressions': MessageCircle,

  // Module 8: Practical English
  'speaking-essentials': Mic,
  'writing-fundamentals': FileText,
  'listening-comprehension': Mic,
  'reading-strategies': BookOpen,
  'common-mistakes': HelpCircle,
  'practical-scenarios': Crosshair,

  // ===== ADVANCED TOPICS =====

  // Advanced Tenses & Conditionals
  'advanced-tense-combinations': FastForward,
  'third-mixed-conditionals': Shuffle,
  'conditional-inversion': Shuffle,
  'reduced-relative-clauses': Link2,
  'subjunctive-mood': Quote,

  // Advanced Modals & Voice
  'past-modals-nuances': Lock,
  'advanced-passive-structures': Shuffle,

  // Advanced Vocabulary
  'academic-vocabulary': AcademicVocabularyIcon,
  'collocations-register': Languages,
  'idioms-proverbs': Quote,

  // Advanced Communication
  'essay-writing': EssayWritingIcon,
  'report-business-writing': FileText,
  'professional-presentations': PresentationsIcon,
  'debates-formal-discussion': DebateIcon,

  // ===== IELTS/TOEFL TOPICS =====
  'ielts-toefl-reading': BookOpen,
  'ielts-toefl-writing': FileText,
  'ielts-toefl-listening': Mic,
  'ielts-toefl-speaking': MessageCircle,

  // Default fallback
  default: BookOpen,
};

/**
 * Get professional icon for a topic
 * Returns Lucide icon component instead of emoji
 */
export function getTopicIcon(topicId: string) {
  return TopicIcons[topicId] || TopicIcons.default;
}
