"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/context/user-context";
import { AccessibilityWrapper } from "@/components/accessibility-wrapper";
import { ArrowLeft, Star, Crown, Lock, Trophy, Flame, Zap } from "lucide-react";
import { motion } from "framer-motion";

// Exam metadata
const EXAM_CONFIG: Record<string, { name: string; color: string; icon: string; description: string }> = {
  jee: { name: "JEE Main & Advanced", color: "#E76F51", icon: "⚛️", description: "Physics, Chemistry & Mathematics" },
  neet: { name: "NEET", color: "#2A9D8F", icon: "🧬", description: "Physics, Chemistry & Biology" },
  upsc: { name: "UPSC CSE", color: "#264653", icon: "📜", description: "History, Geography, Polity & Economics" },
  cat: { name: "CAT", color: "#E9C46A", icon: "🎯", description: "Quantitative, Verbal & Logical Reasoning" },
  gate: { name: "GATE", color: "#F4A261", icon: "💻", description: "Computer Science, Electronics & Mechanical" },
  ssc: { name: "SSC CGL", color: "#2A9D8F", icon: "📚", description: "General Intelligence, Quantitative, English & GK" },
};

interface Level {
  levelNumber: number;
  levelName: string;
  levelType: "normal" | "boss";
  difficulty: string;
  questionCount: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  starsEarned: number;
  bestAccuracy: number;
  attempts: number;
}

export default function ExamLevelModePage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading } = useUser();
  const examId = params.examId as string;
  const exam = EXAM_CONFIG[examId];

  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  const levelsPerPage = 15;
  const totalPages = Math.ceil(levels.length / levelsPerPage);

  useEffect(() => {
    if (!user) return;

    const fetchLevels = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/level-mode/levels?examId=${examId}`);
        const data = await res.json();

        if (data.success) {
          setLevels(data.levels);
        }
      } catch (error) {
        console.error("Failed to load levels:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLevels();
  }, [user, examId]);

  const handleLevelClick = (level: Level) => {
    if (!level.isUnlocked) return;

    // Navigate to quiz with level mode params
    const params = new URLSearchParams({
      examId: examId,
      levelNumber: level.levelNumber.toString(),
      levelName: level.levelName,
      levelType: level.levelType,
      count: level.questionCount.toString(),
      difficulty: level.difficulty,
      mode: "level-holistic", // NEW: Indicates exam-holistic mode
    });

    window.location.href = `/quiz?${params.toString()}`;
  };

  if (isLoading || loading) {
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
            <h2 className="text-3xl font-bold text-white mb-4">Login Required</h2>
            <a href="/" className="inline-block px-8 py-4 bg-[#E76F51] text-white font-bold rounded-xl">
              Go to Home
            </a>
          </div>
        </div>
      </AccessibilityWrapper>
    );
  }

  if (!exam) {
    return (
      <AccessibilityWrapper>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center">
          <div className="text-center px-4">
            <h2 className="text-3xl font-bold text-white mb-4">Exam Not Found</h2>
            <a href="/level-mode" className="inline-block px-8 py-4 bg-[#E76F51] text-white font-bold rounded-xl">
              Back to Level Mode
            </a>
          </div>
        </div>
      </AccessibilityWrapper>
    );
  }

  const startIndex = currentPage * levelsPerPage;
  const endIndex = startIndex + levelsPerPage;
  const currentLevels = levels.slice(startIndex, endIndex);

  const totalStars = levels.reduce((sum, l) => sum + l.starsEarned, 0);
  const completedLevels = levels.filter((l) => l.isCompleted).length;
  const perfectScores = levels.filter((l) => l.starsEarned === 3).length;

  return (
    <AccessibilityWrapper>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <a
              href="/level-mode"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md text-white rounded-xl hover:bg-white/20 transition-all border border-white/20"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </a>

            <a
              href={`/?examId=${examId}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md text-white rounded-xl hover:bg-white/20 transition-all border border-white/20"
            >
              Random Quiz
            </a>
          </div>

          {/* Exam Title */}
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">{exam.icon}</div>
            <h1 className="text-4xl font-bold text-[#DAB661] tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] mb-2">
              {exam.name.toUpperCase()}
            </h1>
            <p className="text-slate-300 text-lg">{exam.description}</p>
            <div className="mt-3 inline-block px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <span className="text-sm font-bold text-cyan-400">🎮 Holistic Level Mode</span>
              <span className="text-xs text-slate-400 ml-2">All subjects mixed</span>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 mb-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-2xl font-bold text-[#DAB661]">{totalStars}</span>
                  <span className="text-white/70 text-sm">/90</span>
                </div>
                <div className="text-xs text-white font-semibold">Stars Earned</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#DAB661] mb-2">{completedLevels}/30</div>
                <div className="text-xs text-white font-semibold">Levels Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#DAB661] mb-2">{perfectScores}</div>
                <div className="text-xs text-white font-semibold">Perfect Scores</div>
              </div>
            </div>
          </div>

          {/* Level Grid */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#DAB661] text-center mb-4 tracking-wide">
              SELECT LEVEL
            </h2>

            {/* Legend */}
            <div className="flex items-center justify-center gap-2 flex-wrap mb-6">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="text-sm">🏅</div>
                <span className="text-xs text-white font-semibold">Beginner (10)</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="text-sm">🏆</div>
                <span className="text-xs text-white font-semibold">Expert (20)</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="text-sm">👑</div>
                <span className="text-xs text-white font-semibold">Master (30)</span>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-5 gap-4 max-w-xl mx-auto px-2">
              {currentLevels.map((level) => {
                const isBoss = level.levelType === "boss";

                return (
                  <div key={level.levelNumber} className="flex flex-col items-center">
                    <button
                      onClick={() => handleLevelClick(level)}
                      disabled={!level.isUnlocked}
                      className={`
                        relative w-full aspect-square rounded-2xl transition-all duration-300
                        ${isBoss ? "ring-4 ring-[#00E5E5]/50" : ""}
                        ${
                          !level.isUnlocked
                            ? "bg-slate-800/50 border-4 border-slate-700/50 cursor-not-allowed"
                            : level.isCompleted
                            ? "bg-gradient-to-br from-cyan-500 to-blue-600 border-4 border-cyan-400 hover:scale-110 cursor-pointer"
                            : "bg-gradient-to-br from-[#E76F51] to-purple-600 border-4 border-indigo-400 hover:scale-110 cursor-pointer"
                        }
                      `}
                    >
                      {/* Boss Crown */}
                      {isBoss && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white z-10">
                          <Crown className="w-3 h-3 text-amber-900" />
                        </div>
                      )}

                      {/* Level Number */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        {!level.isUnlocked ? (
                          <Lock className="w-5 h-5 text-cyan-400" />
                        ) : (
                          <span className="text-xl font-bold text-white drop-shadow-lg">
                            {level.levelNumber}
                          </span>
                        )}
                      </div>

                      {/* Stars */}
                      <div className="flex gap-0.5 absolute -bottom-1 left-1/2 -translate-x-1/2">
                        {[1, 2, 3].map((s) => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${
                              level.isCompleted && s <= level.starsEarned
                                ? "fill-yellow-300 text-yellow-400"
                                : "fill-slate-300 text-slate-400"
                            }`}
                          />
                        ))}
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pagination */}
          <div className="text-center mb-4">
            <span className="text-sm text-[#C9A961] font-semibold">
              Page {currentPage + 1} of {totalPages}
            </span>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 flex items-center justify-center gap-4">
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className={`px-5 py-2 rounded-xl font-bold text-sm transition-all ${
                currentPage === 0
                  ? "bg-slate-700/50 text-slate-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-600 to-cyan-600 text-white hover:shadow-xl"
              }`}
            >
              ◄ BACK
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    currentPage === index
                      ? "w-8 bg-gradient-to-r from-cyan-400 to-blue-500"
                      : "bg-white/30 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage === totalPages - 1}
              className={`px-5 py-2 rounded-xl font-bold text-sm transition-all ${
                currentPage === totalPages - 1
                  ? "bg-slate-700/50 text-slate-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-600 to-cyan-600 text-white hover:shadow-xl"
              }`}
            >
              NEXT ►
            </button>
          </div>
        </div>
      </div>
    </AccessibilityWrapper>
  );
}
