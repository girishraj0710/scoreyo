"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/context/user-context";
import { useRouter } from "next/navigation";
import { AccessibilityWrapper } from "@/components/accessibility-wrapper";
import {
  ArrowLeft, Crown, Star, Trophy, Flame, Lock,
  ChevronRight, Gamepad2, TrendingUp, Award
} from "lucide-react";
import { motion } from "framer-motion";

// Exam-holistic level mode (all subjects mixed together)
const LEVEL_MODE_CONFIG = [
  {
    examId: "jee",
    examName: "JEE Main & Advanced",
    color: "#E76F51",
    icon: "⚛️",
    description: "Physics, Chemistry & Mathematics",
    subjectCount: 3,
  },
  {
    examId: "neet",
    examName: "NEET",
    color: "#2A9D8F",
    icon: "🧬",
    description: "Physics, Chemistry & Biology",
    subjectCount: 3,
  },
  {
    examId: "upsc",
    examName: "UPSC CSE",
    color: "#264653",
    icon: "📜",
    description: "History, Geography, Polity & Economics",
    subjectCount: 4,
  },
  {
    examId: "cat",
    examName: "CAT",
    color: "#E9C46A",
    icon: "🎯",
    description: "Quantitative, Verbal & Logical Reasoning",
    subjectCount: 3,
  },
  {
    examId: "gate",
    examName: "GATE",
    color: "#F4A261",
    icon: "💻",
    description: "Computer Science, Electronics & Mechanical",
    subjectCount: 3,
  },
  {
    examId: "ssc",
    examName: "SSC CGL",
    color: "#2A9D8F",
    icon: "📚",
    description: "General Intelligence, Quantitative, English & GK",
    subjectCount: 4,
  },
];

interface UserProgress {
  currentLevel: number;
  totalStars: number;
  completedLevels: number;
}

interface ExamProgress {
  currentLevel: number;
  totalStars: number;
  completedLevels: number;
  attempts: number;
}

export default function LevelModePage() {
  const { user, isLoading, isAdmin } = useUser();
  const router = useRouter();
  const [examProgress, setExamProgress] = useState<Record<string, ExamProgress>>({});
  const [loadingProgress, setLoadingProgress] = useState(false);

  // Single-exam-focus: Redirect regular users directly to their current exam
  useEffect(() => {
    if (!user || isLoading) return;

    // Admin: Show landing page with all exams (current behavior)
    if (isAdmin) return;

    // Regular users: Redirect to current exam gaming console
    if (user.current_exam) {
      router.push(`/level-mode/${user.current_exam}`);
    }
  }, [user, isLoading, isAdmin, router]);

  useEffect(() => {
    if (!user) return;

    // Fetch user's progress for each exam (holistic - all subjects combined)
    const fetchProgress = async () => {
      setLoadingProgress(true);
      try {
        const progressData: Record<string, ExamProgress> = {};

        for (const exam of LEVEL_MODE_CONFIG) {
          try {
            const res = await fetch(
              `/api/level-mode/progress?examId=${exam.examId}`
            );
            const data = await res.json();

            if (data.success) {
              progressData[exam.examId] = {
                currentLevel: data.currentLevel || 1,
                totalStars: data.totalStars || 0,
                completedLevels: data.completedLevels || 0,
                attempts: data.attempts || 0,
              };
            }
          } catch (err) {
            // Ignore errors for individual exams
            console.error(`Failed to fetch progress for ${exam.examId}:`, err);
          }
        }

        setExamProgress(progressData);
      } catch (error) {
        console.error("Failed to fetch level progress:", error);
      } finally {
        setLoadingProgress(false);
      }
    };

    fetchProgress();
  }, [user]);

  if (isLoading) {
    return (
      <AccessibilityWrapper>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#90CAF9] border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      </AccessibilityWrapper>
    );
  }

  if (!user) {
    return (
      <AccessibilityWrapper>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center">
          <div className="text-center px-4">
            <Gamepad2 className="w-20 h-20 text-[#90CAF9] mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Login Required</h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Sign in to unlock the gaming console experience with 30 progressive levels per subject.
            </p>
            <a
              href="/"
              className="inline-block px-8 py-4 bg-gradient-to-r from-[#E76F51] to-[#F4A261] text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-[#E76F51]/50 transition-all"
            >
              Go to Home
            </a>
          </div>
        </div>
      </AccessibilityWrapper>
    );
  }

  const handleExamClick = (examId: string) => {
    router.push(`/level-mode/${examId}`);
  };

  const getTotalStats = () => {
    const allProgress = Object.values(examProgress);
    return {
      totalStars: allProgress.reduce((sum, p) => sum + p.totalStars, 0),
      totalCompleted: allProgress.reduce((sum, p) => sum + p.completedLevels, 0),
      avgLevel: allProgress.length > 0
        ? Math.round(allProgress.reduce((sum, p) => sum + p.currentLevel, 0) / allProgress.length)
        : 1,
    };
  };

  const stats = getTotalStats();

  return (
    <AccessibilityWrapper>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <a
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md text-white rounded-xl hover:bg-white/20 transition-all mb-6 border border-white/20"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </a>

            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-block"
              >
                <Gamepad2 className="w-16 h-16 text-[#DAB661] mx-auto mb-4" />
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#DAB661] tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] mb-3">
                LEVEL MODE
              </h1>
              <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                30 progressive levels per subject. Master basics, conquer intermediate, dominate advanced challenges.
              </p>
            </div>

            {/* Global Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-2xl font-bold text-[#DAB661]">{stats.totalStars}</span>
                </div>
                <div className="text-xs text-white/70 font-semibold">Total Stars</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Trophy className="w-5 h-5 text-cyan-400" />
                  <span className="text-2xl font-bold text-[#DAB661]">{stats.totalCompleted}</span>
                </div>
                <div className="text-xs text-white/70 font-semibold">Levels Completed</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  <span className="text-2xl font-bold text-[#DAB661]">Lv {stats.avgLevel}</span>
                </div>
                <div className="text-xs text-white/70 font-semibold">Average Level</div>
              </div>
            </div>
          </div>

          {/* Exam Cards */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Choose Your Exam
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {LEVEL_MODE_CONFIG.map((exam) => {
                const progress = examProgress[exam.examId];
                const hasProgress = progress && progress.completedLevels > 0;

                return (
                  <button
                    key={exam.examId}
                    onClick={() => handleExamClick(exam.examId)}
                    className="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl p-6 hover:-translate-y-2 hover:shadow-2xl transition-all border border-white/10 text-left overflow-hidden"
                    style={{
                      boxShadow: hasProgress ? `0 0 30px ${exam.color}40` : undefined,
                    }}
                  >
                    {/* Background accent */}
                    <div
                      className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"
                      style={{ backgroundColor: exam.color }}
                    />

                    {/* Exam Icon & Name */}
                    <div className="relative mb-4">
                      <div className="flex items-center gap-4 mb-3">
                        <div
                          className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl shadow-lg"
                          style={{
                            backgroundColor: `${exam.color}20`,
                            border: `2px solid ${exam.color}50`,
                          }}
                        >
                          {exam.icon}
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-white text-xl mb-1">
                            {exam.examName}
                          </div>
                          <div className="text-xs text-slate-400">
                            {exam.description}
                          </div>
                        </div>
                        <ChevronRight
                          className="w-6 h-6 text-slate-400 group-hover:text-cyan-400 transition-colors"
                        />
                      </div>

                      {/* 30 Levels Badge */}
                      <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white border border-white/20">
                        30 Holistic Levels
                      </div>
                    </div>

                    {/* Progress or Start */}
                    {hasProgress ? (
                      <div className="relative space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-slate-300">
                            Level <span className="text-2xl font-bold text-white">{progress.currentLevel}</span>
                            <span className="text-slate-400">/30</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                            <span className="text-lg font-bold text-yellow-400">
                              {progress.totalStars}
                            </span>
                          </div>
                        </div>
                        <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${(progress.completedLevels / 30) * 100}%`,
                              background: `linear-gradient(to right, ${exam.color}, ${exam.color}cc)`,
                            }}
                          />
                        </div>
                        <div className="text-xs text-slate-400">
                          {progress.completedLevels} levels completed · {progress.attempts} attempts
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <div
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm border-2 transition-all group-hover:scale-105"
                          style={{
                            backgroundColor: `${exam.color}15`,
                            borderColor: `${exam.color}50`,
                            color: exam.color,
                          }}
                        >
                          <Gamepad2 className="w-4 h-4" />
                          Start Journey
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* How It Works */}
          <div className="mt-12 bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold text-[#DAB661] mb-6 text-center">
              How Level Mode Works
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-emerald-500/50">
                  <Award className="w-8 h-8 text-emerald-400" />
                </div>
                <h4 className="font-bold text-white mb-2">30 Levels Per Subject</h4>
                <p className="text-sm text-slate-400">
                  Progress from basics (Lv 1-10) → intermediate (Lv 11-20) → advanced (Lv 21-30)
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-amber-500/50">
                  <Crown className="w-8 h-8 text-amber-400" />
                </div>
                <h4 className="font-bold text-white mb-2">Boss Levels</h4>
                <p className="text-sm text-slate-400">
                  Every 10th level is a boss challenge (20-25 questions). Score 80% to progress.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-purple-500/50">
                  <Flame className="w-8 h-8 text-purple-400" />
                </div>
                <h4 className="font-bold text-white mb-2">Earn Stars & Rewards</h4>
                <p className="text-sm text-slate-400">
                  Score 90%+ for 3 stars. Unlock badges, compete on leaderboards.
                </p>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="mt-6 text-center text-sm text-slate-400">
            <p>
              💡 <span className="text-white font-semibold">Pro Tip:</span> Complete levels in order for best learning progression.
              Replay any level to improve your star rating!
            </p>
          </div>
        </div>
      </div>
    </AccessibilityWrapper>
  );
}
