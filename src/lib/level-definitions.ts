// Level definitions for quiz gamification system
// Each exam-subject combination has 30 levels with progressive difficulty

export type LevelType = 'normal' | 'boss';
export type LevelDifficulty = 'easy' | 'medium' | 'hard' | 'mixed';

export interface LevelDefinition {
  examId: string;
  subjectId: string;
  levelNumber: number;
  levelName: string;
  levelType: LevelType;
  difficulty: LevelDifficulty;
  topic?: string;
  questionCount: number;
  unlockRequirement: string;
  description?: string;
}

// JEE Physics Level Journey (Example)
export const JEE_PHYSICS_LEVELS: LevelDefinition[] = [
  // Easy Levels (1-10)
  { examId: 'jee', subjectId: 'physics', levelNumber: 1, levelName: 'Kinematics Basics', levelType: 'normal', difficulty: 'easy', topic: 'Kinematics', questionCount: 5, unlockRequirement: 'Start here', description: 'Master the fundamentals of motion' },
  { examId: 'jee', subjectId: 'physics', levelNumber: 2, levelName: 'Speed & Velocity', levelType: 'normal', difficulty: 'easy', topic: 'Kinematics', questionCount: 5, unlockRequirement: 'Complete Level 1', description: 'Understanding speed and velocity concepts' },
  { examId: 'jee', subjectId: 'physics', levelNumber: 3, levelName: 'Acceleration', levelType: 'normal', difficulty: 'easy', topic: 'Kinematics', questionCount: 5, unlockRequirement: 'Complete Level 2', description: 'Learn about acceleration and its types' },
  { examId: 'jee', subjectId: 'physics', levelNumber: 4, levelName: 'Equations of Motion', levelType: 'normal', difficulty: 'easy', topic: 'Kinematics', questionCount: 5, unlockRequirement: 'Complete Level 3', description: 'Apply equations of motion' },
  { examId: 'jee', subjectId: 'physics', levelNumber: 5, levelName: 'Projectile Motion Intro', levelType: 'normal', difficulty: 'easy', topic: 'Kinematics', questionCount: 5, unlockRequirement: 'Complete Level 4', description: 'Introduction to projectile motion' },
  { examId: 'jee', subjectId: 'physics', levelNumber: 6, levelName: 'Force Basics', levelType: 'normal', difficulty: 'easy', topic: 'Laws of Motion', questionCount: 5, unlockRequirement: 'Complete Level 5', description: 'Understanding force and its effects' },
  { examId: 'jee', subjectId: 'physics', levelNumber: 7, levelName: 'Newton\'s First Law', levelType: 'normal', difficulty: 'easy', topic: 'Laws of Motion', questionCount: 5, unlockRequirement: 'Complete Level 6', description: 'Law of inertia' },
  { examId: 'jee', subjectId: 'physics', levelNumber: 8, levelName: 'Newton\'s Second Law', levelType: 'normal', difficulty: 'easy', topic: 'Laws of Motion', questionCount: 5, unlockRequirement: 'Complete Level 7', description: 'F = ma problems' },
  { examId: 'jee', subjectId: 'physics', levelNumber: 9, levelName: 'Friction Basics', levelType: 'normal', difficulty: 'easy', topic: 'Laws of Motion', questionCount: 5, unlockRequirement: 'Complete Level 8', description: 'Types of friction' },
  { examId: 'jee', subjectId: 'physics', levelNumber: 10, levelName: '🏆 BOSS: Mechanics Foundation', levelType: 'boss', difficulty: 'mixed', questionCount: 20, unlockRequirement: 'Complete Level 9 with 60%+', description: 'Mixed questions from Levels 1-9' },

  // Medium Levels (11-20)
  { examId: 'jee', subjectId: 'physics', levelNumber: 11, levelName: 'Circular Motion', levelType: 'normal', difficulty: 'medium', topic: 'Circular Motion', questionCount: 10, unlockRequirement: 'Complete Level 10', description: 'Uniform circular motion concepts' },
  { examId: 'jee', subjectId: 'physics', levelNumber: 12, levelName: 'Centripetal Force', levelType: 'normal', difficulty: 'medium', topic: 'Circular Motion', questionCount: 10, unlockRequirement: 'Complete Level 11', description: 'Force in circular motion' },
  { examId: 'jee', subjectId: 'physics', levelNumber: 13, levelName: 'Work & Energy', levelType: 'normal', difficulty: 'medium', topic: 'Work Energy Power', questionCount: 10, unlockRequirement: 'Complete Level 12', description: 'Work-energy theorem' },
  { examId: 'jee', subjectId: 'physics', levelNumber: 14, levelName: 'Kinetic Energy', levelType: 'normal', difficulty: 'medium', topic: 'Work Energy Power', questionCount: 10, unlockRequirement: 'Complete Level 13', description: 'KE applications' },
  { examId: 'jee', subjectId: 'physics', levelNumber: 15, levelName: 'Potential Energy', levelType: 'normal', difficulty: 'medium', topic: 'Work Energy Power', questionCount: 10, unlockRequirement: 'Complete Level 14', description: 'PE and conservation' },
  { examId: 'jee', subjectId: 'physics', levelNumber: 16, levelName: 'Power', levelType: 'normal', difficulty: 'medium', topic: 'Work Energy Power', questionCount: 10, unlockRequirement: 'Complete Level 15', description: 'Power calculations' },
  { examId: 'jee', subjectId: 'physics', levelNumber: 17, levelName: 'Momentum', levelType: 'normal', difficulty: 'medium', topic: 'Momentum', questionCount: 10, unlockRequirement: 'Complete Level 16', description: 'Linear momentum' },
  { examId: 'jee', subjectId: 'physics', levelNumber: 18, levelName: 'Collisions', levelType: 'normal', difficulty: 'medium', topic: 'Momentum', questionCount: 10, unlockRequirement: 'Complete Level 17', description: 'Elastic and inelastic collisions' },
  { examId: 'jee', subjectId: 'physics', levelNumber: 19, levelName: 'Center of Mass', levelType: 'normal', difficulty: 'medium', topic: 'Momentum', questionCount: 10, unlockRequirement: 'Complete Level 18', description: 'COM calculations' },
  { examId: 'jee', subjectId: 'physics', levelNumber: 20, levelName: '🏆 BOSS: Energy & Momentum', levelType: 'boss', difficulty: 'mixed', questionCount: 20, unlockRequirement: 'Complete Level 19 with 60%+', description: 'Mixed questions from Levels 11-19' },

  // Hard Levels (21-30)
  { examId: 'jee', subjectId: 'physics', levelNumber: 21, levelName: 'Rotational Motion', levelType: 'normal', difficulty: 'hard', topic: 'Rotational Dynamics', questionCount: 15, unlockRequirement: 'Complete Level 20', description: 'Angular velocity and acceleration' },
  { examId: 'jee', subjectId: 'physics', levelNumber: 22, levelName: 'Moment of Inertia', levelType: 'normal', difficulty: 'hard', topic: 'Rotational Dynamics', questionCount: 15, unlockRequirement: 'Complete Level 21', description: 'MOI calculations' },
  { examId: 'jee', subjectId: 'physics', levelNumber: 23, levelName: 'Torque', levelType: 'normal', difficulty: 'hard', topic: 'Rotational Dynamics', questionCount: 15, unlockRequirement: 'Complete Level 22', description: 'Torque applications' },
  { examId: 'jee', subjectId: 'physics', levelNumber: 24, levelName: 'Angular Momentum', levelType: 'normal', difficulty: 'hard', topic: 'Rotational Dynamics', questionCount: 15, unlockRequirement: 'Complete Level 23', description: 'Conservation of angular momentum' },
  { examId: 'jee', subjectId: 'physics', levelNumber: 25, levelName: 'Gravitation', levelType: 'normal', difficulty: 'hard', topic: 'Gravitation', questionCount: 15, unlockRequirement: 'Complete Level 24', description: 'Universal gravitation' },
  { examId: 'jee', subjectId: 'physics', levelNumber: 26, levelName: 'Satellites', levelType: 'normal', difficulty: 'hard', topic: 'Gravitation', questionCount: 15, unlockRequirement: 'Complete Level 25', description: 'Orbital mechanics' },
  { examId: 'jee', subjectId: 'physics', levelNumber: 27, levelName: 'Simple Harmonic Motion', levelType: 'normal', difficulty: 'hard', topic: 'SHM', questionCount: 15, unlockRequirement: 'Complete Level 26', description: 'SHM fundamentals' },
  { examId: 'jee', subjectId: 'physics', levelNumber: 28, levelName: 'Waves', levelType: 'normal', difficulty: 'hard', topic: 'Waves', questionCount: 15, unlockRequirement: 'Complete Level 27', description: 'Wave motion' },
  { examId: 'jee', subjectId: 'physics', levelNumber: 29, levelName: 'Sound Waves', levelType: 'normal', difficulty: 'hard', topic: 'Waves', questionCount: 15, unlockRequirement: 'Complete Level 28', description: 'Sound propagation' },
  { examId: 'jee', subjectId: 'physics', levelNumber: 30, levelName: '👑 FINAL BOSS: Complete Physics', levelType: 'boss', difficulty: 'mixed', questionCount: 25, unlockRequirement: 'Complete Level 29 with 70%+', description: 'Ultimate physics challenge' },
];

// Helper function to calculate stars based on accuracy
export function calculateStars(accuracy: number): number {
  if (accuracy >= 90) return 3;
  if (accuracy >= 75) return 2;
  if (accuracy >= 60) return 1;
  return 0;
}

// Helper function to check if next level should unlock
export function shouldUnlockNextLevel(accuracy: number, currentLevelType: LevelType): boolean {
  if (currentLevelType === 'boss') {
    return accuracy >= 70; // Boss levels need 70%+
  }
  return accuracy >= 60; // Normal levels need 60%+
}

// Generate level definitions for all exams
export function generateLevelDefinitions(): LevelDefinition[] {
  const allLevels: LevelDefinition[] = [];

  // For now, we'll use JEE Physics as template
  // TODO: Generate for all exam-subject combinations
  allLevels.push(...JEE_PHYSICS_LEVELS);

  return allLevels;
}

// Get level definition by exam, subject, and level number
export function getLevelDefinition(examId: string, subjectId: string, levelNumber: number): LevelDefinition | undefined {
  const allLevels = generateLevelDefinitions();
  return allLevels.find(
    (l) => l.examId === examId && l.subjectId === subjectId && l.levelNumber === levelNumber
  );
}

// Get all levels for an exam-subject
export function getLevelsForSubject(examId: string, subjectId: string): LevelDefinition[] {
  const allLevels = generateLevelDefinitions();
  return allLevels.filter(
    (l) => l.examId === examId && l.subjectId === subjectId
  ).sort((a, b) => a.levelNumber - b.levelNumber);
}
