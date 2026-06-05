"use client";
// VERSION: AGENTFORCE-BLUE-THEME-2026-06-03-HOTFIX

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/user-context";
import { getAllExams, getExamById } from "@/lib/exams";
import { MistakeMapWidget } from "@/components/mistake-map-widget";
import { DPPCard } from "@/components/dpp-card";
import { LevelProgressWidget } from "@/components/level-progress-widget";
import { StudyStreakCalendar } from "@/components/study-streak-calendar";
import { StreakBadge } from "@/components/streak-badge";
import { DailyProgressCard } from "@/components/daily-progress-card";
import { BookOpen } from "lucide-react";
import { ColorfulExamIcon } from "@/lib/colorful-exam-icons";
import { usePullToRefresh } from "@/hooks/use-pull-to-refresh";
import { isAdmin } from "@/lib/admin";

interface Stats {
  totalSessions: number;
  totalQuestions: number;
  totalCorrect: number;
  accuracy: number;
  streak: number;
  bestStreak?: number;
  questionsToday?: number;
  personalBest?: number;
  questionsContributed?: number;
  contributionPoints?: number;
  examBreakdown: Array<{
    exam_id: string;
    sessions: number;
    questions: number;
    correct: number;
  }>;
}

interface MasteryItem {
  exam_id: string;
  subject_id: string;
  topic: string;
  total_attempted: number;
  total_correct: number;
  mastery_score: number;
  last_attempted: string;
}

interface Session {
  id: string;
  exam_id: string;
  subject_id: string;
  topic: string;
  total_questions: number;
  correct_answers: number;
  time_taken_seconds: number;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();
  const [stats, setStats] = useState<Stats | null>(null);
  const [mastery, setMastery] = useState<MasteryItem[]>([]);
  const [recentSessions, setRecentSessions] = useState<Session[]>([]);
  const [weakTopics, setWeakTopics] = useState<MasteryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedExamFilter, setSelectedExamFilter] = useState<string>("");

  // Redirect contributors to contributor portal
  useEffect(() => {
    if (!userLoading && user && (user.role === 'contributor' || isAdmin(user.role, user.email))) {
      router.push('/contributor');
    }
  }, [user, userLoading, router]);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      const url = selectedExamFilter
        ? `/api/stats?examId=${selectedExamFilter}`
        : "/api/stats";
      const res = await fetch(url);
      const data = await res.json();
      setStats(data.stats);
      setMastery(data.mastery || []);
      setRecentSessions(data.recentSessions || []);
      setWeakTopics(data.weakTopics || []);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, [selectedExamFilter]);

  // Pull-to-refresh for mobile
  usePullToRefresh(loadStats);

  const formatTime = (seconds: number) => {
    if (!seconds) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Memoize weak topics calculation (filter + slice runs on every render)
  const weakTopicsToShow = useMemo(() =>
    mastery.filter((m) => m.mastery_score < 80).slice(0, 6),
    [mastery]
  );

  // Show loading while checking user role
  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--card-bg)" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
          <p style={{ color: "var(--foreground-secondary)" }}>Loading...</p>
        </div>
      </div>
    );
  }

  // Prevent contributors from seeing student dashboard
  if (user && (user.role === 'contributor' || isAdmin(user.role, user.email))) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-xl p-6 h-24 shimmer" style={{ background: "var(--card-bg)" }} />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-xl p-6 h-64 shimmer" style={{ background: "var(--card-bg)" }} />
          ))}
        </div>
      </div>
    );
  }

  if (!stats || stats.totalSessions === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="rounded-2xl p-12 shadow-lg" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", borderWidth: "1px", borderStyle: "solid" }}>
          <div className="flex justify-center mb-6">
            <BookOpen className="w-20 h-20" style={{ color: '#4255FF' }} />
          </div>
          <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--foreground)" }}>
            No Quiz Data Yet
          </h2>
          <p className="mb-6" style={{ color: "var(--muted)" }}>
            Take your first quiz to see your dashboard with progress tracking,
            streaks, and performance analytics!
          </p>
          <a
            href="/"
            className="inline-block px-8 py-3 text-white font-semibold rounded-xl shadow-lg"
            style={{ backgroundColor: '#4255FF', transition: 'background-color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3242CC'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4255FF'}
          >
            Start Your First Quiz
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Version Badge - Remove after testing */}
      <div className="fixed top-4 right-4 z-50 text-white px-3 py-1 rounded-full text-xs font-mono shadow-lg" style={{ backgroundColor: '#4255FF' }}>
        AGENTFORCE-BLUE
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold" style={{ color: "var(--foreground)" }}>Your Dashboard</h1>
          <p className="text-xs sm:text-sm mt-1" style={{ color: "var(--muted)" }}>
            Track your preparation progress across all exams
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <StreakBadge
            currentStreak={stats.streak || 0}
            bestStreak={stats.bestStreak || stats.streak || 0}
            size="sm"
          />
          <a
            href="/"
            className="px-4 py-2 text-white text-sm font-medium rounded-lg flex-1 sm:flex-none text-center"
            style={{ backgroundColor: '#4255FF', transition: 'background-color 0.2s', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3242CC'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4255FF'}
          >
            New Quiz
          </a>
        </div>
      </div>

      {/* Daily Progress Card - NEW! */}
      <div className="mb-8">
        <DailyProgressCard
          questionsToday={stats.questionsToday || 0}
          dailyGoal={50}
          personalBest={stats.personalBest || 0}
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-6 md:mb-8">
        <div className="rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 shadow-sm" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", borderWidth: "1px", borderStyle: "solid" }}>
          <div className="text-[10px] sm:text-xs md:text-sm mb-1" style={{ color: "var(--muted)" }}>Total Quizzes</div>
          <div className="text-xl sm:text-2xl md:text-3xl font-bold text-violet-600">
            {stats.totalSessions}
          </div>
        </div>
        <div className="rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 shadow-sm" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", borderWidth: "1px", borderStyle: "solid" }}>
          <div className="text-[10px] sm:text-xs md:text-sm mb-1" style={{ color: "var(--muted)" }}>Questions Solved</div>
          <div className="text-xl sm:text-2xl md:text-3xl font-bold text-emerald-600">
            {stats.totalQuestions}
          </div>
        </div>
        <div className="rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 shadow-sm" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", borderWidth: "1px", borderStyle: "solid" }}>
          <div className="text-[10px] sm:text-xs md:text-sm mb-1" style={{ color: "var(--muted)" }}>Accuracy</div>
          <div className="text-xl sm:text-2xl md:text-3xl font-bold text-cyan-600">
            {stats.accuracy}%
          </div>
          <div className="w-full rounded-full h-1.5 sm:h-2 mt-1 sm:mt-2" style={{ background: "var(--hover-bg)" }}>
            <div
              className="bg-cyan-500 h-1.5 sm:h-2 rounded-full animate-progress"
              style={{ width: `${stats.accuracy}%` }}
            />
          </div>
        </div>
        <div className="rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 shadow-sm streak-pulse" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", borderWidth: "1px", borderStyle: "solid" }}>
          <div className="text-[10px] sm:text-xs md:text-sm mb-1" style={{ color: "var(--muted)" }}>Day Streak</div>
          <div className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-500">
            {stats.streak}
          </div>
          <div className="text-[9px] sm:text-xs mt-1" style={{ color: "var(--muted)" }}>
            {stats.streak > 0 ? "Keep it up!" : "Start your streak!"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Level Progress Widget */}
        <LevelProgressWidget />

        {/* Daily Practice Problem - THE daily feature */}
        <DPPCard />

        {/* Exam-wise Breakdown */}
        <div className="rounded-2xl p-6 shadow-lg flex flex-col h-[400px]" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", borderWidth: "1px", borderStyle: "solid" }}>
          <h3 className="text-lg font-semibold mb-4 shrink-0" style={{ color: "var(--foreground)" }}>
            Exam-wise Performance
          </h3>
          {stats.examBreakdown.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--muted)" }}>No exam data yet</p>
          ) : (
            <div className="space-y-3 overflow-y-auto flex-1 pr-2">
              {stats.examBreakdown.map((eb) => {
                const exam = getExamById(eb.exam_id);
                const accuracy =
                  eb.questions > 0
                    ? Math.round((eb.correct / eb.questions) * 100)
                    : 0;
                return (
                  <div key={eb.exam_id} className="flex items-center gap-3">
                    <div className="w-16 h-16 flex items-center justify-center shrink-0">
                      <ColorfulExamIcon
                        examId={eb.exam_id}
                        size={56}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium truncate" style={{ color: "var(--foreground-secondary)" }}>
                          {exam?.name || eb.exam_id}
                        </span>
                        <span className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                          {accuracy}%
                        </span>
                      </div>
                      <div className="w-full rounded-full h-2 mt-1" style={{ background: "var(--hover-bg)" }}>
                        <div
                          className="h-2 rounded-full animate-progress"
                          style={{
                            width: `${accuracy}%`,
                            backgroundColor: exam?.color || "#6366f1",
                          }}
                        />
                      </div>
                      <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                        {eb.sessions} quizzes | {eb.questions} questions
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Mistake Map */}
        <MistakeMapWidget />

        {/* Weak Topics */}
        <div className="rounded-2xl p-6 shadow-lg flex flex-col h-[500px]" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", borderWidth: "1px", borderStyle: "solid" }}>
          <h3 className="text-lg font-semibold mb-4 shrink-0" style={{ color: "var(--foreground)" }}>
            Topics to Improve
          </h3>
          {mastery.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              Complete more quizzes to see weak areas
            </p>
          ) : (
            <div className="space-y-3 overflow-y-auto flex-1 pr-2">
              {weakTopicsToShow.map((m, idx) => {
                  const exam = getExamById(m.exam_id);
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-lg"
                      style={{ background: "var(--primary-bg)", borderColor: "var(--card-border)", borderWidth: "1px", borderStyle: "solid" }}
                    >
                      <div>
                        <div className="text-sm font-medium" style={{ color: "var(--foreground-secondary)" }}>
                          {m.topic}
                        </div>
                        <div className="text-xs" style={{ color: "var(--muted)" }}>
                          {exam?.name} | {m.total_attempted} questions
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`text-lg font-bold ${
                            m.mastery_score < 50
                              ? "text-red-600"
                              : "text-amber-600"
                          }`}
                        >
                          {Math.round(m.mastery_score)}%
                        </div>
                        <a
                          href={`/quiz?examId=${m.exam_id}&subjectId=${m.subject_id}&topic=${encodeURIComponent(m.topic)}&count=5&difficulty=mixed`}
                          className="text-xs hover:underline"
                          style={{ color: '#4255FF' }}
                        >
                          Practice
                        </a>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {/* Study Streak Calendar */}
        <StudyStreakCalendar />

        {/* Recent Sessions */}
        <div className="rounded-2xl p-6 shadow-lg md:col-span-2 flex flex-col h-[400px]" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", borderWidth: "1px", borderStyle: "solid" }}>
          <h3 className="text-lg font-semibold mb-4 shrink-0" style={{ color: "var(--foreground)" }}>
            Recent Quizzes
          </h3>
          {recentSessions.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--muted)" }}>No quizzes taken yet</p>
          ) : (
            <div className="overflow-x-auto overflow-y-auto flex-1">
              <table className="w-full text-sm">
                <thead className="sticky top-0 z-10" style={{ background: "var(--card-bg)" }}>
                  <tr className="text-left" style={{ color: "var(--muted)", borderBottomColor: "var(--card-border)", borderBottomWidth: "1px", borderBottomStyle: "solid" }}>
                    <th className="pb-3 pt-0 font-medium">Exam</th>
                    <th className="pb-3 pt-0 font-medium">Topic</th>
                    <th className="pb-3 pt-0 font-medium text-center">Score</th>
                    <th className="pb-3 pt-0 font-medium text-center">Time</th>
                    <th className="pb-3 pt-0 font-medium text-right">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSessions.map((s: any) => {
                    const exam = getExamById(s.exam_id);
                    const accuracy =
                      s.total_questions > 0
                        ? Math.round(
                            (s.correct_answers / s.total_questions) * 100
                          )
                        : 0;
                    return (
                      <tr
                        key={s.id}
                        style={{ borderBottomColor: "var(--card-border)", borderBottomWidth: "1px", borderBottomStyle: "solid" }}
                      >
                        <td className="py-3">
                          <span className="font-medium" style={{ color: "var(--foreground-secondary)" }}>
                            {exam?.name || s.exam_id}
                          </span>
                        </td>
                        <td className="py-3" style={{ color: "var(--foreground-secondary)" }}>{s.topic}</td>
                        <td className="py-3 text-center">
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${
                              accuracy >= 80
                                ? "bg-slate-100 text-cyan-700"
                                : accuracy >= 50
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {s.correct_answers}/{s.total_questions} ({accuracy}
                            %)
                          </span>
                        </td>
                        <td className="py-3 text-center" style={{ color: "var(--muted)" }}>
                          {formatTime(s.time_taken_seconds)}
                        </td>
                        <td className="py-3 text-right text-xs" style={{ color: "var(--muted)" }}>
                          {formatDate(s.created_at)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
