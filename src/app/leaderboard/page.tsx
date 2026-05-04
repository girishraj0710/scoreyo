"use client";

import { useState, useEffect } from "react";
import { useLocale } from "@/context/locale-context";
import { getExamById } from "@/lib/exams";

interface PersonalBest {
  exam_id: string;
  best_accuracy: number;
  total_sessions: number;
  total_questions: number;
  total_correct: number;
}

interface Milestone {
  label: string;
  target: number;
  current: number;
  type: string;
  achieved: boolean;
  progress: number;
}

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar_color: string;
  total_sessions: number;
  total_questions: number;
  total_correct: number;
  accuracy: number;
}

export default function LeaderboardPage() {
  const { t } = useLocale();
  const [personalBests, setPersonalBests] = useState<PersonalBest[]>([]);
  const [longestStreak, setLongestStreak] = useState(0);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then((data) => {
        setPersonalBests(data.personalBests || []);
        setLongestStreak(data.longestStreak || 0);
        setMilestones(data.milestones || []);
        setLeaderboard(data.leaderboard || []);
        setCurrentUserId(data.currentUserId || "");
        setStats(data.stats || null);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6 h-40 shimmer" />
          ))}
        </div>
      </div>
    );
  }

  const achievedMilestones = milestones.filter((m) => m.achieved);
  const inProgressMilestones = milestones.filter((m) => !m.achieved);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">{t("leaderboardTitle")}</h1>
        <p className="text-slate-500 text-sm mt-1">{t("leaderboardSubtitle")}</p>
      </div>

      {/* Quick Stats Row */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <div className="bg-white rounded-xl p-4 border border-slate-200 text-center">
            <div className="text-3xl font-bold text-indigo-600">{stats.totalQuestions}</div>
            <div className="text-xs text-slate-500 mt-1">{t("questionsSolved")}</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200 text-center">
            <div className="text-3xl font-bold text-emerald-600">{stats.accuracy}%</div>
            <div className="text-xs text-slate-500 mt-1">{t("accuracy")}</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200 text-center">
            <div className="text-3xl font-bold text-amber-500">{stats.streak}</div>
            <div className="text-xs text-slate-500 mt-1">{t("dayStreak")}</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200 text-center">
            <div className="text-3xl font-bold text-purple-600">{longestStreak}</div>
            <div className="text-xs text-slate-500 mt-1">{t("longestStreak")}</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Bests */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <span className="text-xl">🏆</span>
            {t("personalBests")}
          </h2>
          {personalBests.length === 0 ? (
            <p className="text-slate-400 text-sm">{t("noBestsYet")}</p>
          ) : (
            <div className="space-y-3">
              {personalBests.map((pb) => {
                const exam = getExamById(pb.exam_id);
                const accuracy = Math.round(pb.best_accuracy);
                return (
                  <div key={pb.exam_id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0"
                      style={{ backgroundColor: (exam?.color || "#6366f1") + "20" }}
                    >
                      {exam?.icon || "📝"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-slate-700 text-sm truncate">
                        {exam?.name || pb.exam_id}
                      </div>
                      <div className="text-xs text-slate-400">
                        {pb.total_sessions} {t("quizzes")} | {pb.total_questions} {t("questions")}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${accuracy >= 80 ? "text-emerald-600" : accuracy >= 50 ? "text-amber-600" : "text-red-600"}`}>
                        {accuracy}%
                      </div>
                      <div className="text-xs text-slate-400">{t("bestAccuracy")}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Milestones */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <span className="text-xl">🎯</span>
            {t("milestones")}
          </h2>

          {/* Achieved */}
          {achievedMilestones.length > 0 && (
            <div className="mb-4">
              <h3 className="text-xs font-medium text-emerald-600 uppercase tracking-wider mb-2">
                {t("achieved")} ({achievedMilestones.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {achievedMilestones.map((m, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-medium text-emerald-700"
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {m.label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* In Progress */}
          {inProgressMilestones.length > 0 && (
            <div>
              <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                {t("inProgress")}
              </h3>
              <div className="space-y-2">
                {inProgressMilestones.slice(0, 5).map((m, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-slate-600">{m.label}</span>
                        <span className="text-slate-400">{m.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div
                          className="bg-indigo-500 h-2 rounded-full transition-all"
                          style={{ width: `${m.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Rankings */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 md:col-span-2">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <span className="text-xl">📊</span>
            {t("rankings")}
          </h2>
          {leaderboard.length === 0 ? (
            <p className="text-slate-400 text-sm">{t("noBestsYet")}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 border-b border-slate-100">
                    <th className="pb-3 font-medium w-12">#</th>
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 font-medium text-center">{t("totalQuizzes")}</th>
                    <th className="pb-3 font-medium text-center">{t("questions")}</th>
                    <th className="pb-3 font-medium text-center">{t("accuracy")}</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, idx) => (
                    <tr
                      key={entry.id}
                      className={`border-b border-slate-50 ${entry.id === currentUserId ? "bg-indigo-50" : "hover:bg-slate-50"}`}
                    >
                      <td className="py-3">
                        <span className={`w-7 h-7 inline-flex items-center justify-center rounded-full text-xs font-bold ${
                          idx === 0 ? "bg-amber-100 text-amber-700" : idx === 1 ? "bg-slate-200 text-slate-600" : idx === 2 ? "bg-orange-100 text-orange-700" : "bg-slate-100 text-slate-500"
                        }`}>
                          {idx + 1}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
                            style={{ backgroundColor: entry.avatar_color || "#6366f1" }}
                          >
                            {entry.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-slate-700">
                            {entry.name}
                            {entry.id === currentUserId && (
                              <span className="ml-1 text-xs text-indigo-600">(You)</span>
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 text-center text-slate-600">{entry.total_sessions}</td>
                      <td className="py-3 text-center text-slate-600">{entry.total_questions}</td>
                      <td className="py-3 text-center">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${
                          entry.accuracy >= 80 ? "bg-emerald-100 text-emerald-700" : entry.accuracy >= 50 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                        }`}>
                          {Math.round(entry.accuracy)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Coming Soon */}
          <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 text-center">
            <p className="text-sm font-medium text-indigo-700">{t("comingSoon")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
