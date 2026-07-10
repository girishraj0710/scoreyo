"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/context/user-context";
import { useRouter } from "next/navigation";
import { useLocale } from "@/context/locale-context";
import { getExamById } from "@/lib/exams";
import { ColorfulExamIcon } from "@/lib/colorful-exam-icons";
import { AccessibilityWrapper } from "@/components/accessibility-wrapper";

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
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();

  // Redirect contributors to contributor portal
  useEffect(() => {
    if (!userLoading && user && ["contributor", "admin"].includes(user.role || "")) {
      router.push("/contributor");
    }
  }, [user, userLoading, router]);
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
      <AccessibilityWrapper>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-xl p-6 h-40 shimmer" style={{ background: "var(--card-bg)" }} />
          ))}
        </div>
      </div>
      </AccessibilityWrapper>
    );
  }

  const achievedMilestones = milestones.filter((m) => m.achieved);
  const inProgressMilestones = milestones.filter((m) => !m.achieved);

  return (
    <AccessibilityWrapper>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: "var(--foreground-secondary)" }}>{t("leaderboardTitle")}</h1>
        <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>{t("leaderboardSubtitle")}</p>
      </div>

      {/* Quick Stats Row */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <div className="rounded-xl p-4 text-center" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", borderWidth: "1px", borderStyle: "solid" }}>
            <div className="text-3xl font-bold text-[#E76F51]">{stats.totalQuestions}</div>
            <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>{t("questionsSolved")}</div>
          </div>
          <div className="rounded-xl p-4 text-center" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", borderWidth: "1px", borderStyle: "solid" }}>
            <div className="text-3xl font-bold text-emerald-600">{stats.accuracy}%</div>
            <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>{t("accuracy")}</div>
          </div>
          <div className="rounded-xl p-4 text-center" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", borderWidth: "1px", borderStyle: "solid" }}>
            <div className="text-3xl font-bold text-amber-500">{stats.streak}</div>
            <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>{t("dayStreak")}</div>
          </div>
          <div className="rounded-xl p-4 text-center" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", borderWidth: "1px", borderStyle: "solid" }}>
            <div className="text-3xl font-bold text-purple-600">{longestStreak}</div>
            <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>{t("longestStreak")}</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Bests */}
        <div className="rounded-xl p-6 shadow-sm" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", borderWidth: "1px", borderStyle: "solid" }}>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--foreground-secondary)" }}>
            <svg className="w-6 h-6 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {t("personalBests")}
          </h2>
          {personalBests.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--muted)" }}>{t("noBestsYet")}</p>
          ) : (
            <div className="space-y-3">
              {personalBests.map((pb) => {
                const exam = getExamById(pb.exam_id);
                const accuracy = Math.round(pb.best_accuracy);
                return (
                  <div key={pb.exam_id} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: "var(--hover-bg)" }}>
                    <div className="w-14 h-14 flex items-center justify-center shrink-0">
                      <ColorfulExamIcon
                        examId={pb.exam_id}
                        size={48}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate" style={{ color: "var(--foreground-secondary)" }}>
                        {exam?.name || pb.exam_id}
                      </div>
                      <div className="text-xs" style={{ color: "var(--muted)" }}>
                        {pb.total_sessions} {t("quizzes")} | {pb.total_questions} {t("questions")}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${accuracy >= 80 ? "text-emerald-600" : accuracy >= 50 ? "text-amber-600" : "text-red-600"}`}>
                        {accuracy}%
                      </div>
                      <div className="text-xs" style={{ color: "var(--muted)" }}>{t("bestAccuracy")}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Milestones */}
        <div className="rounded-xl p-6 shadow-sm" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", borderWidth: "1px", borderStyle: "solid" }}>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--foreground-secondary)" }}>
            <svg className="w-6 h-6 text-[#E76F51]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
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
              <h3 className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "var(--muted)" }}>
                {t("inProgress")}
              </h3>
              <div className="space-y-2">
                {inProgressMilestones.slice(0, 5).map((m, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium" style={{ color: "var(--foreground-secondary)" }}>{m.label}</span>
                        <span style={{ color: "var(--muted)" }}>{m.progress}%</span>
                      </div>
                      <div className="w-full rounded-full h-2" style={{ background: "var(--hover-bg)" }}>
                        <div
                          className="bg-[#E76F51] h-2 rounded-full transition-all"
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
        <div className="rounded-xl p-6 shadow-sm md:col-span-2" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", borderWidth: "1px", borderStyle: "solid" }}>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--foreground-secondary)" }}>
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            {t("rankings")}
          </h2>
          {leaderboard.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--muted)" }}>{t("noBestsYet")}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left" style={{ color: "var(--muted)", borderBottom: "1px solid var(--card-border)" }}>
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
                      className={`${entry.id === currentUserId ? "bg-[#E8EAFF]" : ""}`}
                      style={{ borderBottom: "1px solid var(--card-border)" }}
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
                          <span className="font-medium" style={{ color: "var(--foreground-secondary)" }}>
                            {entry.name}
                            {entry.id === currentUserId && (
                              <span className="ml-1 text-xs text-[#E76F51]">(You)</span>
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 text-center" style={{ color: "var(--foreground-secondary)" }}>{entry.total_sessions}</td>
                      <td className="py-3 text-center" style={{ color: "var(--foreground-secondary)" }}>{entry.total_questions}</td>
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
          <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-[#90CAF9] text-center">
            <p className="text-sm font-medium text-[#D65A3D]">{t("comingSoon")}</p>
          </div>
        </div>
      </div>
    </div>
    </AccessibilityWrapper>
  );
}
