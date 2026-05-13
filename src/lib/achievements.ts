/**
 * Achievements & Badges System
 * Defines all badges, milestones, and achievement logic
 */

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // emoji
  category: "level" | "streak" | "accuracy" | "speed" | "mastery" | "special";
  requirement: {
    type: string;
    value: number;
  };
  rarity: "common" | "rare" | "epic" | "legendary";
  unlockedAt?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  target: number;
  achieved: boolean;
  achievedAt?: string;
  reward?: string;
}

/**
 * All available badges in the system
 */
export const BADGES: Badge[] = [
  // Level Milestones (every 10 levels)
  {
    id: "level-10",
    name: "Novice Scholar",
    description: "Complete 10 levels in any subject",
    icon: "🎓",
    category: "level",
    requirement: { type: "levels_completed", value: 10 },
    rarity: "common",
  },
  {
    id: "level-20",
    name: "Rising Star",
    description: "Complete 20 levels in any subject",
    icon: "⭐",
    category: "level",
    requirement: { type: "levels_completed", value: 20 },
    rarity: "common",
  },
  {
    id: "level-30",
    name: "Dedicated Learner",
    description: "Complete 30 levels in any subject",
    icon: "🌟",
    category: "level",
    requirement: { type: "levels_completed", value: 30 },
    rarity: "rare",
  },
  {
    id: "level-40",
    name: "Knowledge Seeker",
    description: "Complete 40 levels in any subject",
    icon: "💫",
    category: "level",
    requirement: { type: "levels_completed", value: 40 },
    rarity: "rare",
  },
  {
    id: "level-50",
    name: "Master Student",
    description: "Complete 50 levels in any subject",
    icon: "🏆",
    category: "level",
    requirement: { type: "levels_completed", value: 50 },
    rarity: "epic",
  },
  {
    id: "level-75",
    name: "Elite Achiever",
    description: "Complete 75 levels in any subject",
    icon: "👑",
    category: "level",
    requirement: { type: "levels_completed", value: 75 },
    rarity: "epic",
  },
  {
    id: "level-100",
    name: "Century Champion",
    description: "Complete 100 levels in any subject",
    icon: "💎",
    category: "level",
    requirement: { type: "levels_completed", value: 100 },
    rarity: "legendary",
  },

  // Streak Badges
  {
    id: "streak-7",
    name: "Week Warrior",
    description: "Maintain a 7-day study streak",
    icon: "🔥",
    category: "streak",
    requirement: { type: "streak_days", value: 7 },
    rarity: "common",
  },
  {
    id: "streak-15",
    name: "Fortnight Fighter",
    description: "Maintain a 15-day study streak",
    icon: "🔥🔥",
    category: "streak",
    requirement: { type: "streak_days", value: 15 },
    rarity: "rare",
  },
  {
    id: "streak-30",
    name: "Monthly Maestro",
    description: "Maintain a 30-day study streak",
    icon: "🔥🔥🔥",
    category: "streak",
    requirement: { type: "streak_days", value: 30 },
    rarity: "epic",
  },
  {
    id: "streak-100",
    name: "Unstoppable",
    description: "Maintain a 100-day study streak",
    icon: "🌋",
    category: "streak",
    requirement: { type: "streak_days", value: 100 },
    rarity: "legendary",
  },

  // Accuracy Badges
  {
    id: "accuracy-90",
    name: "Precision Pro",
    description: "Achieve 90%+ accuracy in 10 quizzes",
    icon: "🎯",
    category: "accuracy",
    requirement: { type: "high_accuracy_quizzes", value: 10 },
    rarity: "rare",
  },
  {
    id: "accuracy-95",
    name: "Perfect Aim",
    description: "Achieve 95%+ accuracy in 10 quizzes",
    icon: "🎯🎯",
    category: "accuracy",
    requirement: { type: "very_high_accuracy_quizzes", value: 10 },
    rarity: "epic",
  },
  {
    id: "perfect-quiz",
    name: "Flawless Victory",
    description: "Get 100% in any quiz",
    icon: "✨",
    category: "accuracy",
    requirement: { type: "perfect_quiz", value: 1 },
    rarity: "rare",
  },

  // Speed Badges
  {
    id: "speed-demon",
    name: "Speed Demon",
    description: "Complete a quiz in under 2 minutes",
    icon: "⚡",
    category: "speed",
    requirement: { type: "fast_quiz", value: 120 },
    rarity: "rare",
  },
  {
    id: "lightning-fast",
    name: "Lightning Fast",
    description: "Complete 10 quizzes in under 3 minutes each",
    icon: "⚡⚡",
    category: "speed",
    requirement: { type: "fast_quizzes_count", value: 10 },
    rarity: "epic",
  },

  // Mastery Badges
  {
    id: "topic-master",
    name: "Topic Master",
    description: "Achieve 90%+ mastery in any topic",
    icon: "🎓",
    category: "mastery",
    requirement: { type: "topic_mastery_90", value: 1 },
    rarity: "rare",
  },
  {
    id: "subject-expert",
    name: "Subject Expert",
    description: "Achieve 80%+ mastery in all topics of a subject",
    icon: "📚",
    category: "mastery",
    requirement: { type: "subject_mastery_80", value: 1 },
    rarity: "epic",
  },

  // Special Badges
  {
    id: "early-bird",
    name: "Early Bird",
    description: "Complete DPP before 8 AM",
    icon: "🌅",
    category: "special",
    requirement: { type: "early_dpp", value: 1 },
    rarity: "common",
  },
  {
    id: "night-owl",
    name: "Night Owl",
    description: "Complete quiz after 11 PM",
    icon: "🦉",
    category: "special",
    requirement: { type: "late_quiz", value: 1 },
    rarity: "common",
  },
  {
    id: "weekend-warrior",
    name: "Weekend Warrior",
    description: "Study on 10 weekends",
    icon: "💪",
    category: "special",
    requirement: { type: "weekend_sessions", value: 10 },
    rarity: "rare",
  },
  {
    id: "mock-master",
    name: "Mock Test Champion",
    description: "Complete 10 full-length mock tests",
    icon: "🏅",
    category: "special",
    requirement: { type: "mock_tests_completed", value: 10 },
    rarity: "epic",
  },
  {
    id: "question-crusher",
    name: "Question Crusher",
    description: "Solve 1000 questions",
    icon: "🔨",
    category: "special",
    requirement: { type: "total_questions", value: 1000 },
    rarity: "epic",
  },
  {
    id: "five-thousand-club",
    name: "5K Club",
    description: "Solve 5000 questions",
    icon: "🏆",
    category: "special",
    requirement: { type: "total_questions", value: 5000 },
    rarity: "legendary",
  },
];

/**
 * Badge rarity colors and styling
 */
export const RARITY_STYLES = {
  common: {
    bg: "bg-slate-100",
    border: "border-slate-300",
    text: "text-slate-700",
    glow: "",
  },
  rare: {
    bg: "bg-blue-100",
    border: "border-blue-400",
    text: "text-blue-700",
    glow: "shadow-lg shadow-blue-200",
  },
  epic: {
    bg: "bg-purple-100",
    border: "border-purple-400",
    text: "text-purple-700",
    glow: "shadow-xl shadow-purple-300",
  },
  legendary: {
    bg: "bg-gradient-to-br from-yellow-100 to-amber-100",
    border: "border-yellow-500",
    text: "text-amber-700",
    glow: "shadow-2xl shadow-yellow-400 animate-pulse-slow",
  },
};

/**
 * Check which badges a user has earned based on their stats
 */
export function checkBadges(userStats: {
  levelsCompleted: number;
  streak: number;
  totalQuizzes: number;
  totalQuestions: number;
  highAccuracyQuizzes: number; // 90%+
  veryHighAccuracyQuizzes: number; // 95%+
  perfectQuizzes: number; // 100%
  fastQuizzes: number; // <3 min
  topicMasteries90: number;
  subjectMasteries80: number;
  earlyDPPs: number;
  lateQuizzes: number;
  weekendSessions: number;
  mockTestsCompleted: number;
}): Badge[] {
  const earnedBadges: Badge[] = [];

  for (const badge of BADGES) {
    let earned = false;

    switch (badge.requirement.type) {
      case "levels_completed":
        earned = userStats.levelsCompleted >= badge.requirement.value;
        break;
      case "streak_days":
        earned = userStats.streak >= badge.requirement.value;
        break;
      case "high_accuracy_quizzes":
        earned = userStats.highAccuracyQuizzes >= badge.requirement.value;
        break;
      case "very_high_accuracy_quizzes":
        earned = userStats.veryHighAccuracyQuizzes >= badge.requirement.value;
        break;
      case "perfect_quiz":
        earned = userStats.perfectQuizzes >= badge.requirement.value;
        break;
      case "fast_quiz":
        earned = userStats.fastQuizzes > 0;
        break;
      case "fast_quizzes_count":
        earned = userStats.fastQuizzes >= badge.requirement.value;
        break;
      case "topic_mastery_90":
        earned = userStats.topicMasteries90 >= badge.requirement.value;
        break;
      case "subject_mastery_80":
        earned = userStats.subjectMasteries80 >= badge.requirement.value;
        break;
      case "early_dpp":
        earned = userStats.earlyDPPs >= badge.requirement.value;
        break;
      case "late_quiz":
        earned = userStats.lateQuizzes >= badge.requirement.value;
        break;
      case "weekend_sessions":
        earned = userStats.weekendSessions >= badge.requirement.value;
        break;
      case "mock_tests_completed":
        earned = userStats.mockTestsCompleted >= badge.requirement.value;
        break;
      case "total_questions":
        earned = userStats.totalQuestions >= badge.requirement.value;
        break;
    }

    if (earned) {
      earnedBadges.push(badge);
    }
  }

  return earnedBadges;
}

/**
 * Get next milestone badges (not yet earned)
 */
export function getNextMilestones(
  earnedBadges: Badge[],
  userStats: any
): Array<Badge & { progress: number }> {
  const earnedIds = new Set(earnedBadges.map((b) => b.id));
  const nextMilestones: Array<Badge & { progress: number }> = [];

  for (const badge of BADGES) {
    if (earnedIds.has(badge.id)) continue;

    let progress = 0;
    switch (badge.requirement.type) {
      case "levels_completed":
        progress = Math.min(
          100,
          (userStats.levelsCompleted / badge.requirement.value) * 100
        );
        break;
      case "streak_days":
        progress = Math.min(100, (userStats.streak / badge.requirement.value) * 100);
        break;
      case "total_questions":
        progress = Math.min(
          100,
          (userStats.totalQuestions / badge.requirement.value) * 100
        );
        break;
      // Add more progress calculations as needed
    }

    if (progress > 0) {
      nextMilestones.push({ ...badge, progress });
    }
  }

  // Sort by progress (closest to completion first)
  return nextMilestones.sort((a, b) => b.progress - a.progress).slice(0, 3);
}
