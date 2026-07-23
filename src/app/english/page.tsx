"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/user-context';
import {
  BookOpen, Trophy, Flame, Zap, Star, Clock, Bell,
  Brain, Layers, GraduationCap, ChevronRight, Play
} from 'lucide-react';
import EnglishAssessmentModal from '@/components/EnglishAssessmentModal';
import { AssessmentResult } from '@/lib/english-assessment-algorithm';

export default function EnglishLearningDashboard() {
  const router = useRouter();
  const { user, isLoading, isAdmin } = useUser();
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [hasCompletedAssessment, setHasCompletedAssessment] = useState(false);
  const [assessmentChecked, setAssessmentChecked] = useState(false); // API check done
  const [userLevel, setUserLevel] = useState<string>('B1'); // Default level
  const [lastActivity, setLastActivity] = useState<{
    topicTitle: string;
    topicId: string;
    pathName: string;
    pathId: string;
    visitedAt: string;
  } | null>(null);
  const [courseProgress, setCourseProgress] = useState<Record<string, number>>({
    foundation: 0,
    advanced: 0,
    vocabulary: 0,
    'ielts-toefl': 0,
  });

  // Redirect to login if not authenticated (MUST be before any returns)
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [isLoading, user, router]);

  // Check if user has completed assessment and load last activity on mount.
  // Source of truth is the DB (survives across devices/deploys); localStorage
  // is only a synchronous fallback so returning users don't flash the prompt.
  useEffect(() => {
    if (!user) return;

    // Optimistic local read (instant, avoids a flash of the "not taken" state).
    const cached = localStorage.getItem(`english_assessment_${user.id}`);
    if (cached) {
      try {
        const data = JSON.parse(cached);
        setHasCompletedAssessment(true);
        setUserLevel(data.level);
      } catch {
        /* ignore malformed cache */
      }
    }

    // Authoritative check against the server.
    (async () => {
      try {
        const res = await fetch('/api/english/assessment');
        if (res.ok) {
          const data = await res.json();
          if (data.completed) {
            setHasCompletedAssessment(true);
            setUserLevel(data.level);
            // Refresh the local cache for the next instant paint.
            localStorage.setItem(
              `english_assessment_${user.id}`,
              JSON.stringify({ level: data.level, levelName: data.levelName })
            );
          } else if (cached) {
            // Back-compat: this user placed before we persisted server-side, so
            // their result lives only in localStorage. Backfill the DB rather
            // than downgrade them (which would re-pop the assessment).
            try {
              const local = JSON.parse(cached);
              await fetch('/api/english/assessment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  level: local.level,
                  levelName: local.levelName || local.level,
                  overallScore: local.overallScore ?? 0,
                  skillScores: local.skillScores ?? {},
                  recommendations: local.recommendations ?? [],
                }),
              });
              setHasCompletedAssessment(true);
              setUserLevel(local.level);
            } catch {
              setHasCompletedAssessment(false);
            }
          } else {
            setHasCompletedAssessment(false);
          }
        }
      } catch {
        /* keep optimistic state on network error */
      } finally {
        setAssessmentChecked(true);
      }
    })();

    // Load last activity (from both courses and study plan)
    const lastActivityData = localStorage.getItem(`english_last_activity_${user.id}`);
    if (lastActivityData) {
      setLastActivity(JSON.parse(lastActivityData));
    }

    // Fetch course progress
    fetchCourseProgress();
  }, [user]);

  // Auto-open the assessment on first landing when the user hasn't placed yet.
  // Only after the server check completes, so we never pop the modal for a user
  // who has already taken it (which would happen if we trusted initial state).
  useEffect(() => {
    if (assessmentChecked && !hasCompletedAssessment) {
      setShowAssessmentModal(true);
    }
  }, [assessmentChecked, hasCompletedAssessment]);

  // Fetch dynamic course progress from API
  const fetchCourseProgress = async () => {
    try {
      const res = await fetch('/api/english/course-progress');
      if (res.ok) {
        const data = await res.json();
        setCourseProgress(data.progress);
      }
    } catch (error) {
      console.error('Failed to fetch course progress:', error);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
        <div className="w-12 h-12 border-4 border-[#E76F51] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // ────────────────────────────────────────────────────────────
  // HELPER FUNCTIONS
  // ────────────────────────────────────────────────────────────

  // Determine if a level should be marked as "mastered" based on current level
  const getLevelStatus = (checkLevel: string, currentLevel: string): 'locked' | 'active' | 'mastered' => {
    const levelOrder = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const checkIndex = levelOrder.indexOf(checkLevel);
    const currentIndex = levelOrder.indexOf(currentLevel);

    if (checkIndex === -1 || currentIndex === -1) return 'locked';

    // If assessment placed you at B1, then A1 and A2 are "mastered" (already proven proficiency)
    if (checkIndex < currentIndex) return 'mastered';
    if (checkIndex === currentIndex) return 'active';
    return 'locked';
  };

  // Get personalized "Next Up" lesson title based on user's level
  const getNextLessonTitle = (level: string): string => {
    const lessonTitles: Record<string, string> = {
      A1: 'Basic English & Vocabulary',
      A2: 'Elementary Grammar Foundations',
      B1: 'Intermediate Communication Skills',
      B2: 'Advanced Grammar & Expression',
      C1: 'Mastery & Professional English',
      C2: 'Expert Proficiency (C2)'
    };
    return lessonTitles[level] || 'English Learning Path';
  };

  // Get personalized "Next Up" lesson description based on user's level
  const getNextLessonDescription = (level: string): string => {
    const lessonDescriptions: Record<string, string> = {
      A1: 'Unit 1 — Alphabet, Phonetics & Basic Sentences',
      A2: 'Unit 5 — Present Simple & Continuous Tenses',
      B1: 'Unit 8 — Present Perfect & Conversational Phrases',
      B2: 'Unit 12 — Conditional Structures & Complex Sentences',
      C1: 'Unit 16 — Subjunctive Mood & Formal Writing',
      C2: 'Expert — Nuance, Idiom & Effortless Fluency'
    };
    return lessonDescriptions[level] || 'Continue your learning journey';
  };

  // ────────────────────────────────────────────────────────────
  // ACTION HANDLERS
  // ────────────────────────────────────────────────────────────

  // Navigate to specific learning path
  const handleCourseClick = (courseId: string) => {
    setSelectedCourse(courseId);
    // Route to the specific course path
    switch (courseId) {
      case 'foundation':
        router.push('/english/foundation');
        break;
      case 'advanced':
        router.push('/english/advanced');
        break;
      case 'vocabulary':
        // No dedicated vocabulary path yet — keep the placeholder page.
        router.push('/learn/english/vocabulary');
        break;
      case 'ielts-toefl':
        router.push('/english/ielts-toefl');
        break;
      default:
        router.push('/english');
    }
  };

  // Resume last activity (course or study plan)
  const handleContinueLesson = () => {
    if (lastActivity) {
      // Navigate to the exact last visited topic
      router.push(`/english/${lastActivity.pathId}/${lastActivity.topicId}`);
    }
  };

  // Navigate to full learning path view
  const handleViewFullPath = () => {
    router.push('/english/path');
  };

  // View full leaderboard
  const handleViewLeaderboard = () => {
    router.push('/english/leaderboard');
  };

  // View all achievements
  const handleViewAchievements = () => {
    router.push('/english/achievements');
  };

  // Click on level node
  const handleLevelClick = (level: string) => {
    console.log(`Navigating to ${level} level content`);
    // Could open a modal or navigate to level-specific page
  };

  // Handle assessment completion
  const handleAssessmentComplete = (result: AssessmentResult) => {
    // Save to localStorage with full assessment data
    const assessmentData = {
      level: result.level,
      levelName: result.levelName,
      overallScore: result.overallScore,
      skillScores: result.skillScores,
      recommendations: result.recommendations,
      completedAt: new Date().toISOString()
    };

    localStorage.setItem(`english_assessment_${user?.id}`, JSON.stringify(assessmentData));

    setHasCompletedAssessment(true);
    setUserLevel(result.level);
    setShowAssessmentModal(false);

    // Persist to the database so the placement follows the account across
    // devices and deployments (localStorage above is just the fast local cache).
    fetch('/api/english/assessment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        level: result.level,
        levelName: result.levelName,
        overallScore: result.overallScore,
        skillScores: result.skillScores,
        recommendations: result.recommendations,
        confidence: result.confidence,
      }),
    }).catch((err) => console.error('Failed to persist assessment:', err));
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      {/* Assessment Modal */}
      <EnglishAssessmentModal
        isOpen={showAssessmentModal}
        onClose={() => setShowAssessmentModal(false)}
        onComplete={handleAssessmentComplete}
      />

      {/* MAIN CONTENT */}
      <main className="w-full overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8 pt-6 space-y-6">
            {/* Learning Path Progression */}
            <section className="bg-white/70 dark:bg-[#1A1F2E]/70 backdrop-blur-xl rounded-xl border border-slate-200/60 dark:border-slate-700/40 p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Your Learning Path</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {hasCompletedAssessment
                      ? `Currently active at ${userLevel} level`
                      : 'Take the assessment to unlock your personalized path'
                    }
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {/* "Full path" is always visible. The assessment is offered via
                      the auto-opening modal (and re-takeable from the full-path
                      page) — no standalone "Take Assessment" button here. */}
                  <button
                    onClick={handleViewFullPath}
                    className="text-xs font-semibold text-[#E76F51] dark:text-[#F4A79D] hover:text-[#D65A3D] dark:hover:text-[#F4A79D] flex items-center gap-1"
                  >
                    Full path
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Progress Nodes */}
              <div className="relative h-24">
                {/* Connection Line - Behind circles at their exact center height */}
                <div className="absolute left-0 right-0 h-0.5 bg-slate-300 dark:bg-slate-600" style={{ top: '23px', zIndex: 0 }} />

                {/* Dynamic Nodes - All greyed out if no assessment */}
                <div className="absolute left-0 top-0" style={{ transform: 'translateX(0%)' }}>
                  <LevelNode
                    title="Beginner"
                    subtitle="A1"
                    completed={hasCompletedAssessment && getLevelStatus('A1', userLevel) === 'mastered'}
                    active={hasCompletedAssessment && userLevel === 'A1'}
                    onClick={() => hasCompletedAssessment ? handleLevelClick('A1') : setShowAssessmentModal(true)}
                  />
                </div>
                <div className="absolute left-1/4 top-0" style={{ transform: 'translateX(-50%)' }}>
                  <LevelNode
                    title="Elementary"
                    subtitle="A2"
                    completed={hasCompletedAssessment && getLevelStatus('A2', userLevel) === 'mastered'}
                    active={hasCompletedAssessment && userLevel === 'A2'}
                    onClick={() => hasCompletedAssessment ? handleLevelClick('A2') : setShowAssessmentModal(true)}
                  />
                </div>
                <div className="absolute left-1/2 top-0" style={{ transform: 'translateX(-50%)' }}>
                  <LevelNode
                    title="Intermediate"
                    subtitle="B1/B2"
                    completed={hasCompletedAssessment && getLevelStatus('B1', userLevel) === 'mastered'}
                    active={hasCompletedAssessment && ['B1', 'B2'].includes(userLevel)}
                    onClick={() => hasCompletedAssessment ? handleLevelClick('B1/B2') : setShowAssessmentModal(true)}
                  />
                </div>
                <div className="absolute left-3/4 top-0" style={{ transform: 'translateX(-50%)' }}>
                  <LevelNode
                    title="Advanced"
                    subtitle="C1"
                    completed={hasCompletedAssessment && getLevelStatus('C1', userLevel) === 'mastered'}
                    active={hasCompletedAssessment && userLevel === 'C1'}
                    onClick={() => hasCompletedAssessment ? handleLevelClick('C1') : setShowAssessmentModal(true)}
                  />
                </div>
                <div className="absolute right-0 top-0" style={{ transform: 'translateX(0%)' }}>
                  <LevelNode
                    title="Expert"
                    subtitle="C2"
                    completed={hasCompletedAssessment && getLevelStatus('C2', userLevel) === 'mastered'}
                    active={hasCompletedAssessment && userLevel === 'C2'}
                    onClick={() => hasCompletedAssessment ? handleLevelClick('C2') : setShowAssessmentModal(true)}
                  />
                </div>
              </div>
            </section>

            {/* Next Up Card - Based on Last Activity (NOT assessment) */}
            {lastActivity ? (
              // Show "Continue" card when user has recent activity
              <section className="rounded-2xl p-8 text-white relative overflow-hidden shadow-lg min-h-[200px]" style={{ background: 'linear-gradient(135deg, #16213E 0%, #1a2744 50%, #1e2a45 100%)' }}>
                <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#E76F51]/10 blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-[#F4A261]/10 blur-3xl" />

                <div className="relative flex items-center justify-between gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <BookOpen className="w-5 h-5" strokeWidth={2.5} />
                      </div>
                      <span className="text-sm font-bold uppercase text-white/90" style={{ letterSpacing: '0.2em' }}>CONTINUE LEARNING</span>
                    </div>
                    <h3 className="text-3xl font-bold mb-2">
                      {lastActivity.topicTitle}
                    </h3>
                    <p className="text-lg text-white/95 mb-6">
                      {lastActivity.pathName}
                    </p>
                    <div className="flex items-center gap-6 text-base text-white/90">
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5" strokeWidth={2} />
                        <span>Resume where you left off</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleContinueLesson}
                    className="px-10 py-4 rounded-xl bg-white text-[#E76F51] font-bold hover:bg-[#FEF5F3] transition-colors flex items-center gap-2 shadow-xl text-base"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    Continue
                  </button>
                </div>
              </section>
            ) : null}

            {/* Course Tracks */}
            <section>
              <div className="flex items-center justify-between mb-6 pt-1">
                <h3 className="text-sm font-bold" style={{ color: "#0d1117" }}>Course Tracks</h3>
                <span className="text-[11px] font-semibold" style={{ color: "#94a3b8" }}>4 courses enrolled</span>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <CourseCard
                  icon={<BookOpen className="w-5 h-5" />}
                  tag="CEFR A1-A2 Level"
                  title="Basic English & Vocabulary"
                  description="Build your core grammar, everyday conversational vocabulary, and sentence structures from scratch."
                  progress={courseProgress.foundation}
                  color="blue"
                  courseId="foundation"
                  onResume={handleCourseClick}
                />

                <CourseCard
                  icon={<Brain className="w-5 h-5" />}
                  tag="CEFR B1-C1 Level"
                  title="Intermediate & Advanced Mastery"
                  description="Master complex grammar, nuanced vocabulary expressions, professional business writing, and confident rhetoric."
                  progress={courseProgress.advanced}
                  color="purple"
                  courseId="advanced"
                  onResume={handleCourseClick}
                />

                <CourseCard
                  icon={<Layers className="w-5 h-5" />}
                  tag="All Levels"
                  title="Dedicated Vocabulary Builder"
                  description="Learn 5,000+ high-frequency words, contextual idioms, phrasal verbs, and professional jargon via smart flashcards."
                  progress={courseProgress.vocabulary}
                  color="amber"
                  courseId="vocabulary"
                  onResume={handleCourseClick}
                />

                <CourseCard
                  icon={<GraduationCap className="w-5 h-5" />}
                  tag="Exam Track"
                  title="Standardized Test Prep: IELTS & TOEFL"
                  description="Targeted strategies, practice questions, mock tests, and evaluation tools to crack academic reading, writing, listening, and speaking modules."
                  progress={courseProgress['ielts-toefl']}
                  color="teal"
                  courseId="ielts-toefl"
                  onResume={handleCourseClick}
                />
              </div>
            </section>

            {/* Why Choose Our English Hub */}
            <section className="bg-white dark:bg-[#1A1F2E] rounded-2xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Why Choose Our English Hub?</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* AI-Powered Learning */}
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">AI-Powered Learning</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      Personalized recommendations based on your performance and goals
                    </p>
                  </div>
                </div>

                {/* Daily Practice */}
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-[#E76F51]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Daily Practice</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      10-minute daily sessions to build habits and maintain streaks
                    </p>
                  </div>
                </div>

                {/* Rich Explanations */}
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Rich Explanations</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      Detailed explanations with examples, traps, and common mistakes
                    </p>
                  </div>
                </div>
              </div>
            </section>
        </div>
      </main>
    </div>
  );
}

// Component: Level Node
function LevelNode({ title, subtitle, completed = false, active = false, onClick }: {
  title: string;
  subtitle: string;
  completed?: boolean;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center relative z-10 hover:scale-105 transition-transform cursor-pointer"
    >
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center border-3 transition-all ${
          active
            ? 'bg-[#E76F51] border-[#F4A79D] shadow-md shadow-[#E76F51]/30'
            : completed
            ? 'bg-[#10B981] border-[#6EE7B7]'
            : 'bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600'
        }`}
      >
        {completed ? (
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : active ? (
          <span className="text-sm font-bold text-white">{subtitle}</span>
        ) : (
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{subtitle}</span>
        )}
      </div>
      <div className="mt-2 text-center">
        <p className={`text-xs font-semibold ${active ? 'text-[#E76F51] dark:text-[#F4A79D]' : completed ? 'text-[#10B981] dark:text-[#34D399]' : 'text-slate-500 dark:text-slate-400'}`}>
          {title}
        </p>
        {!completed && !active && (
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{subtitle}</p>
        )}
      </div>
    </button>
  );
}

// Component: Course Card
function CourseCard({
  icon,
  tag,
  title,
  description,
  progress,
  color,
  courseId,
  onResume
}: {
  icon: React.ReactNode;
  tag: string;
  title: string;
  description: string;
  progress: number;
  color: 'blue' | 'purple' | 'amber' | 'teal';
  courseId: string;
  onResume: (id: string) => void;
}) {
  const colorConfig = {
    blue: {
      mainColor: '#2563eb',
      bgColor: '#eff6ff',
      ringBg: '#dbeafe'
    },
    purple: {
      mainColor: '#6d28d9',
      bgColor: '#f5f3ff',
      ringBg: '#ede9fe'
    },
    amber: {
      mainColor: '#c2410c',
      bgColor: '#fff7ed',
      ringBg: '#fed7aa'
    },
    teal: {
      mainColor: '#0f766e',
      bgColor: '#f0fdfa',
      ringBg: '#99f6e4'
    }
  };

  const config = colorConfig[color];

  // Progress ring calculation
  const size = 48;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div
      onClick={() => onResume(courseId)}
      className="relative rounded-2xl p-8 cursor-pointer overflow-hidden hover:-translate-y-1 transition-all duration-200 flex flex-col"
      style={{
        background: `linear-gradient(150deg, ${config.bgColor} 0%, #fff 100%)`,
        border: '1.5px solid rgba(255,255,255,0.95)',
        boxShadow: '0 2px 18px rgba(0,0,0,0.065)',
        minHeight: '280px'
      }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-4 gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div
            className="flex items-center justify-center rounded-xl flex-shrink-0"
            style={{
              width: 40,
              height: 40,
              background: `${config.mainColor}18`,
              color: config.mainColor
            }}
          >
            {icon}
          </div>
          <div className="min-w-0">
            <span
              className="inline-block text-[11px] font-bold uppercase px-2 py-0.5 rounded-md mb-1.5"
              style={{
                letterSpacing: '0.2em',
                background: `${config.mainColor}15`,
                color: config.mainColor
              }}
            >
              {tag}
            </span>
            <h3 className="text-base font-extrabold leading-tight text-slate-800">
              {title}
            </h3>
          </div>
        </div>
        {/* Ring */}
        <div className="relative flex-shrink-0">
          <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', display: 'block' }}>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={config.ringBg}
              strokeWidth={strokeWidth}
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={config.mainColor}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1) 0.2s' }}
            />
          </svg>
          <span
            className="absolute inset-0 flex items-center justify-center text-xs font-bold"
            style={{ color: config.mainColor }}
          >
            {progress}%
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm font-normal leading-relaxed mb-6 flex-grow" style={{ color: '#64748b' }}>
        {description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 mt-auto">
        <div className="flex items-center gap-1.5 flex-1">
          <div
            className="h-1.5 rounded-full overflow-hidden"
            style={{ width: 80, background: config.ringBg }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${progress}%`,
                background: config.mainColor,
                transition: 'width 1.6s cubic-bezier(0.4,0,0.2,1) 0.3s'
              }}
            />
          </div>
          <span className="text-xs font-semibold whitespace-nowrap" style={{ color: '#94a3b8' }}>
            {progress}% complete
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click
            onResume(courseId);
          }}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold text-white flex-shrink-0 hover:scale-105 active:scale-95 transition-transform"
          style={{
            background: config.mainColor,
            boxShadow: `0 4px 14px ${config.mainColor}45`
          }}
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          {progress > 0 ? 'Resume' : 'Start'}
        </button>
      </div>
    </div>
  );
}

// Component: Stat Item
function StatItem({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="flex flex-col items-center gap-1 p-2 rounded-xl" style={{ background: "#f8fafc" }}>
      <div style={{ color: color }}>
        {icon}
      </div>
      <span className="text-xs font-bold" style={{ color: "#0d1117" }}>{value}</span>
      <span className="text-[10px] font-medium" style={{ color: "#94a3b8" }}>{label}</span>
    </div>
  );
}

// Component: Leaderboard Item
function LeaderboardItem({
  rank,
  name,
  country,
  xp,
  isTop = false,
  isUser = false
}: {
  rank: string;
  name: string;
  country: string;
  xp: string;
  isTop?: boolean;
  isUser?: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isUser ? 'bg-[#FEF5F3] dark:bg-[#8B4034]/30 border-2 border-[#E76F51] dark:border-[#E76F51]' : 'bg-slate-50 dark:bg-slate-800/50'}`}>
      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
        isTop ? 'bg-gradient-to-br from-[#F59E0B] to-[#F97316] text-white shadow-sm' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
      }`}>
        {isTop ? '👑' : rank}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{name}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{country}</p>
      </div>
      <span className="text-sm font-bold text-slate-900 dark:text-white">{xp}</span>
    </div>
  );
}

// Component: Achievement Card
function AchievementCard({
  icon,
  title,
  description,
  gradient,
  featured = false
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  featured?: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl transition-all ${featured ? 'bg-gradient-to-r ' + gradient + ' shadow-sm' : 'bg-slate-50 dark:bg-slate-800/50'}`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
        featured ? 'bg-white/25 backdrop-blur-sm' : 'bg-white dark:bg-slate-700'
      }`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-bold ${featured ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{title}</p>
        <p className={`text-xs ${featured ? 'text-white/95' : 'text-slate-500 dark:text-slate-400'}`}>{description}</p>
      </div>
    </div>
  );
}
