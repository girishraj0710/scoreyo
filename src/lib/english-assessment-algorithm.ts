// Adaptive English Assessment Algorithm
// Determines user level (A1-C1) through intelligent question selection and timing analysis

import { AssessmentQuestion, assessmentQuestions } from './english-assessment-questions';

export interface QuestionAttempt {
  questionId: string;
  question: string;
  selectedAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  timeSpentSeconds: number;
  minReadTimeSeconds: number;
  isSuspiciouslyFast: boolean;
  level: AssessmentQuestion['level'];
  skill: AssessmentQuestion['skill'];
}

export interface AssessmentResult {
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
  levelName: string;
  overallScore: number; // 0-100
  skillScores: {
    grammar: number;
    vocabulary: number;
    reading: number;
    usage: number;
  };
  suspiciousClickCount: number;
  confidence: 'high' | 'medium' | 'low';
  recommendations: string[];
}

export interface AdaptiveTestState {
  currentLevel: AssessmentQuestion['level'];
  attempts: QuestionAttempt[];
  skillsCovered: Set<AssessmentQuestion['skill']>;
  totalCorrect: number;
  totalAttempts: number;
  suspiciousClicks: number;
}

// Level progression map
const LEVEL_ORDER: AssessmentQuestion['level'][] = ['A1', 'A2', 'B1', 'B2', 'C1'];
const LEVEL_NAMES = {
  A1: 'Beginner',
  A2: 'Elementary',
  B1: 'Intermediate',
  B2: 'Upper Intermediate',
  C1: 'Advanced'
};

// Initialize adaptive test state
export function initializeAdaptiveTest(): AdaptiveTestState {
  return {
    currentLevel: 'B1', // Start with intermediate baseline
    attempts: [],
    skillsCovered: new Set(),
    totalCorrect: 0,
    totalAttempts: 0,
    suspiciousClicks: 0
  };
}

// Get next question adaptively based on performance
export function getNextAdaptiveQuestion(state: AdaptiveTestState): AssessmentQuestion | null {
  const { currentLevel, attempts, skillsCovered } = state;

  // Phase 1: Cover all 4 skills at current level first (first 4 questions)
  if (attempts.length < 4) {
    const skills: AssessmentQuestion['skill'][] = ['grammar', 'vocabulary', 'reading', 'usage'];
    const uncoveredSkill = skills.find(skill => !skillsCovered.has(skill));

    if (uncoveredSkill) {
      const questionsForSkill = assessmentQuestions.filter(
        q => q.level === currentLevel && q.skill === uncoveredSkill
      );
      return getRandomQuestion(questionsForSkill, attempts.map(a => a.questionId));
    }
  }

  // Phase 2: Adaptive branching (questions 5-10)
  if (attempts.length < 10) {
    const recentPerformance = analyzeRecentPerformance(state);

    // Adjust level based on performance
    if (recentPerformance.accuracy >= 0.75 && currentLevel !== 'C1') {
      // Move up a level
      const nextLevelIndex = LEVEL_ORDER.indexOf(currentLevel) + 1;
      state.currentLevel = LEVEL_ORDER[nextLevelIndex];
    } else if (recentPerformance.accuracy < 0.5 && currentLevel !== 'A1') {
      // Move down a level
      const prevLevelIndex = LEVEL_ORDER.indexOf(currentLevel) - 1;
      state.currentLevel = LEVEL_ORDER[prevLevelIndex];
    }

    // Select next skill to test (rotate through skills)
    const skills: AssessmentQuestion['skill'][] = ['grammar', 'vocabulary', 'reading', 'usage'];
    const nextSkillIndex = attempts.length % 4;
    const nextSkill = skills[nextSkillIndex];

    const questionsForLevel = assessmentQuestions.filter(
      q => q.level === state.currentLevel && q.skill === nextSkill
    );
    return getRandomQuestion(questionsForLevel, attempts.map(a => a.questionId));
  }

  // Phase 3: Fill gaps in skills not fully tested (questions 11-15 if needed)
  if (attempts.length < 15) {
    const skillCounts = countSkillsByLevel(state);
    const skills: AssessmentQuestion['skill'][] = ['grammar', 'vocabulary', 'reading', 'usage'];

    // Find skill with least coverage
    const leastCoveredSkill = skills.reduce((least, skill) => {
      const currentCount = skillCounts[skill] || 0;
      const leastCount = skillCounts[least] || 0;
      return currentCount < leastCount ? skill : least;
    });

    const questionsForSkill = assessmentQuestions.filter(
      q => q.level === state.currentLevel && q.skill === leastCoveredSkill
    );
    return getRandomQuestion(questionsForSkill, attempts.map(a => a.questionId));
  }

  // Test complete
  return null;
}

// Analyze recent performance (last 4 questions)
function analyzeRecentPerformance(state: AdaptiveTestState): { accuracy: number; avgTime: number } {
  const recentAttempts = state.attempts.slice(-4);
  const correctCount = recentAttempts.filter(a => a.isCorrect).length;
  const accuracy = correctCount / recentAttempts.length;
  const avgTime = recentAttempts.reduce((sum, a) => sum + a.timeSpentSeconds, 0) / recentAttempts.length;

  return { accuracy, avgTime };
}

// Count skills tested per level
function countSkillsByLevel(state: AdaptiveTestState): Record<string, number> {
  const counts: Record<string, number> = {};

  state.attempts.forEach(attempt => {
    counts[attempt.skill] = (counts[attempt.skill] || 0) + 1;
  });

  return counts;
}

// Get random question not already attempted
function getRandomQuestion(
  questions: AssessmentQuestion[],
  attemptedIds: string[]
): AssessmentQuestion {
  const unattempted = questions.filter(q => !attemptedIds.includes(q.id));
  const randomIndex = Math.floor(Math.random() * unattempted.length);
  return unattempted[randomIndex];
}

// Record a question attempt with timing analysis
export function recordAttempt(
  state: AdaptiveTestState,
  question: AssessmentQuestion,
  selectedAnswer: number,
  timeSpentSeconds: number
): void {
  const isCorrect = selectedAnswer === question.correctAnswer;
  const isSuspiciouslyFast = timeSpentSeconds < (question.minReadTimeSeconds * 0.4); // Less than 40% of min time

  const attempt: QuestionAttempt = {
    questionId: question.id,
    question: question.question,
    selectedAnswer,
    correctAnswer: question.correctAnswer,
    isCorrect,
    timeSpentSeconds,
    minReadTimeSeconds: question.minReadTimeSeconds,
    isSuspiciouslyFast,
    level: question.level,
    skill: question.skill
  };

  state.attempts.push(attempt);
  state.skillsCovered.add(question.skill);
  state.totalAttempts++;

  if (isCorrect) {
    state.totalCorrect++;
  }

  if (isSuspiciouslyFast) {
    state.suspiciousClicks++;
  }
}

// Calculate final assessment result
export function calculateAssessmentResult(state: AdaptiveTestState): AssessmentResult {
  const { attempts, suspiciousClicks } = state;

  // Calculate skill scores (0-100)
  const skillScores = {
    grammar: calculateSkillScore(attempts, 'grammar'),
    vocabulary: calculateSkillScore(attempts, 'vocabulary'),
    reading: calculateSkillScore(attempts, 'reading'),
    usage: calculateSkillScore(attempts, 'usage')
  };

  // Calculate overall score (weighted average)
  const overallScore = Math.round(
    (skillScores.grammar + skillScores.vocabulary + skillScores.reading + skillScores.usage) / 4
  );

  // Adjust for suspicious clicks (penalize by up to 20%)
  const suspiciousRatio = Math.min(suspiciousClicks / attempts.length, 0.5);
  const adjustedScore = Math.max(0, overallScore - Math.round(suspiciousRatio * 20));

  // Determine level based on adjusted score
  const level = scoresToLevel(adjustedScore, state);

  // Determine confidence based on consistency and suspicious clicks
  const confidence = calculateConfidence(state);

  // Generate recommendations
  const recommendations = generateRecommendations(skillScores, level, suspiciousClicks);

  return {
    level,
    levelName: LEVEL_NAMES[level],
    overallScore: adjustedScore,
    skillScores,
    suspiciousClickCount: suspiciousClicks,
    confidence,
    recommendations
  };
}

// Calculate score for a specific skill (0-100)
function calculateSkillScore(
  attempts: QuestionAttempt[],
  skill: AssessmentQuestion['skill']
): number {
  const skillAttempts = attempts.filter(a => a.skill === skill);

  if (skillAttempts.length === 0) return 0;

  // Group by level and calculate weighted score
  const levelScores: Record<string, { correct: number; total: number }> = {};

  skillAttempts.forEach(attempt => {
    if (!levelScores[attempt.level]) {
      levelScores[attempt.level] = { correct: 0, total: 0 };
    }
    levelScores[attempt.level].total++;
    if (attempt.isCorrect && !attempt.isSuspiciouslyFast) {
      levelScores[attempt.level].correct++;
    }
  });

  // Weight scores by level difficulty (A1=20, A2=40, B1=60, B2=80, C1=100)
  const levelWeights: Record<string, number> = {
    A1: 20,
    A2: 40,
    B1: 60,
    B2: 80,
    C1: 100
  };

  let totalWeightedScore = 0;
  let totalWeight = 0;

  Object.entries(levelScores).forEach(([level, data]) => {
    const accuracy = data.correct / data.total;
    const weight = levelWeights[level as AssessmentQuestion['level']];
    totalWeightedScore += accuracy * weight;
    totalWeight += weight / 100; // Normalize
  });

  return Math.round(totalWeightedScore / Math.max(totalWeight, 1));
}

// Convert score to CEFR level
function scoresToLevel(
  overallScore: number,
  state: AdaptiveTestState
): AssessmentQuestion['level'] {
  // Thresholds considering both score and highest level attempted successfully
  const highestLevelReached = getHighestLevelReached(state);
  const highestLevelIndex = LEVEL_ORDER.indexOf(highestLevelReached);

  // Score-based level determination
  let scoreBasedLevel: AssessmentQuestion['level'];

  if (overallScore >= 86) {
    scoreBasedLevel = 'C1';
  } else if (overallScore >= 71) {
    scoreBasedLevel = 'B2';
  } else if (overallScore >= 51) {
    scoreBasedLevel = 'B1';
  } else if (overallScore >= 31) {
    scoreBasedLevel = 'A2';
  } else {
    scoreBasedLevel = 'A1';
  }

  const scoreBasedIndex = LEVEL_ORDER.indexOf(scoreBasedLevel);

  // Final level is the lower of score-based and highest-reached
  // (Can't claim C1 if never answered C1 questions correctly)
  const finalIndex = Math.min(scoreBasedIndex, highestLevelIndex);

  return LEVEL_ORDER[finalIndex];
}

// Get highest level where user answered questions correctly
function getHighestLevelReached(state: AdaptiveTestState): AssessmentQuestion['level'] {
  const correctAttempts = state.attempts.filter(a => a.isCorrect && !a.isSuspiciouslyFast);

  let highestLevel: AssessmentQuestion['level'] = 'A1';

  correctAttempts.forEach(attempt => {
    const attemptLevelIndex = LEVEL_ORDER.indexOf(attempt.level);
    const currentHighestIndex = LEVEL_ORDER.indexOf(highestLevel);

    if (attemptLevelIndex > currentHighestIndex) {
      highestLevel = attempt.level;
    }
  });

  return highestLevel;
}

// Calculate confidence in assessment
function calculateConfidence(state: AdaptiveTestState): 'high' | 'medium' | 'low' {
  const { attempts, suspiciousClicks } = state;

  // Low confidence if too many suspicious clicks
  if (suspiciousClicks > attempts.length * 0.3) {
    return 'low';
  }

  // Low confidence if not enough questions answered
  if (attempts.length < 8) {
    return 'low';
  }

  // Check consistency across skills
  const skillScores = {
    grammar: calculateSkillScore(attempts, 'grammar'),
    vocabulary: calculateSkillScore(attempts, 'vocabulary'),
    reading: calculateSkillScore(attempts, 'reading'),
    usage: calculateSkillScore(attempts, 'usage')
  };

  const scoreValues = Object.values(skillScores);
  const avgScore = scoreValues.reduce((sum, s) => sum + s, 0) / scoreValues.length;
  const variance = scoreValues.reduce((sum, s) => sum + Math.pow(s - avgScore, 2), 0) / scoreValues.length;

  // High variance = low confidence
  if (variance > 400) {
    return 'low';
  } else if (variance > 200) {
    return 'medium';
  }

  return 'high';
}

// Generate personalized recommendations
function generateRecommendations(
  skillScores: { grammar: number; vocabulary: number; reading: number; usage: number },
  level: AssessmentQuestion['level'],
  suspiciousClicks: number
): string[] {
  const recommendations: string[] = [];

  // Recommendation based on level
  const levelRecommendations: Record<AssessmentQuestion['level'], string> = {
    A1: 'Start with Foundation Path to build basic grammar and vocabulary',
    A2: 'Focus on Elementary topics to strengthen your fundamentals',
    B1: 'Work on Intermediate concepts to improve fluency and accuracy',
    B2: 'Challenge yourself with Advanced topics and complex structures',
    C1: 'Master advanced grammar, idioms, and formal writing techniques'
  };

  recommendations.push(levelRecommendations[level]);

  // Skill-specific recommendations (identify weakest skill)
  const weakestSkill = Object.entries(skillScores).reduce((weakest, [skill, score]) => {
    return score < weakest.score ? { skill, score } : weakest;
  }, { skill: 'grammar', score: 100 } as { skill: string; score: number });

  if (weakestSkill.score < 60) {
    const skillRecommendations: Record<string, string> = {
      grammar: 'Focus extra time on grammar exercises and tense practice',
      vocabulary: 'Expand your vocabulary through reading and word lists',
      reading: 'Practice reading comprehension with graded texts',
      usage: 'Improve practical usage through real-world conversations'
    };

    recommendations.push(skillRecommendations[weakestSkill.skill as keyof typeof skillRecommendations]);
  }

  // Warning if too many suspicious clicks
  if (suspiciousClicks > 3) {
    recommendations.push('Take your time to read questions carefully for accurate assessment');
  }

  // Balanced skill recommendation
  const maxDiff = Math.max(...Object.values(skillScores)) - Math.min(...Object.values(skillScores));
  if (maxDiff > 25) {
    recommendations.push('Work on balancing your skills across all four areas');
  }

  return recommendations;
}

// Get learning path based on assessment result
export function getPersonalizedPath(result: AssessmentResult): {
  startPath: string;
  startTopic: string;
  unlockedLevels: string[];
} {
  const levelPaths: Record<AssessmentQuestion['level'], {
    startPath: string;
    startTopic: string;
    unlockedLevels: string[];
  }> = {
    A1: {
      startPath: 'foundation',
      startTopic: 'alphabet-phonetics',
      unlockedLevels: ['A1']
    },
    A2: {
      startPath: 'foundation',
      startTopic: 'present-simple',
      unlockedLevels: ['A1', 'A2']
    },
    B1: {
      startPath: 'foundation',
      startTopic: 'present-perfect',
      unlockedLevels: ['A1', 'A2', 'B1']
    },
    B2: {
      startPath: 'advanced',
      startTopic: 'conditionals',
      unlockedLevels: ['A1', 'A2', 'B1', 'B2']
    },
    C1: {
      startPath: 'advanced',
      startTopic: 'subjunctive-mood',
      unlockedLevels: ['A1', 'A2', 'B1', 'B2', 'C1']
    }
  };

  return levelPaths[result.level];
}
