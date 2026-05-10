"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useUser } from "@/context/user-context";
import { LevelMapV3 } from "@/components/level-map-v3";
import { getExamById } from "@/lib/exams";
import { LevelDefinition } from "@/lib/level-definitions";
import { ArrowLeft } from "lucide-react";

function LevelSelectionContent() {
  const searchParams = useSearchParams();
  const { user, isLoading } = useUser();
  const [levels, setLevels] = useState<LevelDefinition[]>([]);
  const [userProgress, setUserProgress] = useState<any[]>([]);
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const examId = searchParams.get("examId");
  const subjectId = searchParams.get("subjectId");
  const exam = examId ? getExamById(examId) : null;
  const subject = exam?.subjects.find((s) => s.id === subjectId);

  useEffect(() => {
    if (user && examId && subjectId) {
      loadLevels();
    }
  }, [user, examId, subjectId]);

  const loadLevels = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/quiz/levels?examId=${examId}&subjectId=${subjectId}`);
      const data = await res.json();

      if (data.success) {
        setLevels(data.levels);
        setUserProgress(data.userProgress);
        setProgress(data.progress);
      }
    } catch (error) {
      console.error("Failed to load levels:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLevelClick = (level: LevelDefinition) => {
    // Check if level is unlocked
    const userLevel = userProgress.find((l) => l.level_number === level.levelNumber);
    if (!userLevel || !userLevel.is_unlocked) {
      return;
    }

    // Navigate to quiz with level params
    const params = new URLSearchParams({
      examId: examId!,
      subjectId: subjectId!,
      levelNumber: level.levelNumber.toString(),
      levelName: level.levelName,
      levelType: level.levelType,
      count: level.questionCount.toString(),
      difficulty: level.difficulty,
      mode: "level",
    });

    window.location.href = `/quiz?${params.toString()}`;
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Login Required</h2>
          <p className="text-slate-600 mb-6">Please login to access level mode</p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-500 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-violet-600"
          >
            Go to Home
          </a>
        </div>
      </div>
    );
  }

  if (!examId || !subjectId || !exam || !subject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Invalid Parameters</h2>
          <p className="text-slate-600 mb-6">Please select an exam and subject</p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-500 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-violet-600"
          >
            Go to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Floating Back Button */}
      <div className="fixed top-4 left-4 z-50">
        <a
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/80 backdrop-blur-md text-white rounded-xl hover:bg-slate-700/80 font-semibold shadow-lg border border-slate-600/50 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back</span>
        </a>
      </div>

      {/* Floating Random Quiz Button */}
      <div className="fixed top-4 right-4 z-50">
        <a
          href={`/?examId=${examId}&subjectId=${subjectId}`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 font-semibold shadow-lg shadow-cyan-500/50 transition-all"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <span className="hidden sm:inline">Random Quiz</span>
        </a>
      </div>

      {/* Level Map - Full Screen */}
      {levels.length > 0 ? (
        <LevelMapV3
            levels={levels}
            userProgress={userProgress}
            onLevelClick={handleLevelClick}
            currentLevel={progress?.currentLevel}
          />
        ) : (
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center">
            <div className="text-center py-12 px-4">
              <div className="text-slate-600 mb-4">
                <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Levels Available Yet</h3>
              <p className="text-slate-400 mb-6">
                Level definitions for this subject are coming soon!
              </p>
              <a
                href="/"
                className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-500 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-violet-600"
              >
                Try Random Mode Instead
              </a>
            </div>
          </div>
        )}
      </>
    );
}

export default function LevelSelectionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      }
    >
      <LevelSelectionContent />
    </Suspense>
  );
}
