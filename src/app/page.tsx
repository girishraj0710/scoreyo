"use client";
/* Updated: 2026-07-11 - Letter spacing consistency */
import { useState, useEffect, useMemo, useRef, Suspense } from "react";
import dynamic from "next/dynamic";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useUser } from "@/context/user-context";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { AccessibilityWrapper } from "@/components/accessibility-wrapper";
import { DailyTenQuestions } from "@/components/daily-ten-questions";
import { isNative } from "@/lib/capacitor";
import { useExamFilter } from "@/hooks/use-exam-filter";
import {
  Flame, PlayCircle, ChevronRight, BookOpen, Clock, Sparkles,
  Target, CheckCircle2, Circle, TrendingUp, TrendingDown, Trophy, ArrowRight, Zap,
  GraduationCap, Puzzle, Timer, Rocket, Award, Medal, Crown, Star, Layers, Gamepad2, Upload,
} from "lucide-react";

// Flashcard Daily Goal Banner Component (Compact)
function FlashcardDailyGoalBanner() {
  const [dailyGoal, setDailyGoal] = useState<{
    target: number;
    studied: number;
    progress: number;
    goalReached: boolean;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDailyGoal = async () => {
      try {
        const response = await fetch("/api/flashcards/daily-goal");
        if (response.ok) {
          const data = await response.json();
          setDailyGoal(data.goal);
        }
      } catch (err) {
        console.error("Error fetching daily goal:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDailyGoal();
  }, []);

  if (isLoading || !dailyGoal) return null;

  return (
    <a
      href="/flashcards"
      className="block rounded-3xl bg-white dark:bg-slate-900 border border-black/5 p-6 shadow-soft hover:shadow-pop transition-all group"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs uppercase font-bold text-[#5A6478] dark:text-slate-400" style={{ letterSpacing: '0.2em' }}>
          Flashcard goal
        </div>
        <Target className="w-4 h-4 text-[#F26A4B]" />
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F26A4B] to-[#E76F51] flex items-center justify-center flex-shrink-0">
          <Target className="w-6 h-6 text-white" strokeWidth={2.5} />
        </div>
        <div className="flex-1">
          <div className="font-heading text-lg font-bold text-[#16213E] dark:text-white">
            {dailyGoal.goalReached ? "Goal Reached! 🎉" : `${dailyGoal.studied} / ${dailyGoal.target}`}
          </div>
          <div className="text-xs text-[#5A6478] dark:text-slate-400 mt-0.5">
            {dailyGoal.goalReached ? "Keep it up!" : "cards today"}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-2 bg-white/60 dark:bg-slate-800/60 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${dailyGoal.progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full ${
            dailyGoal.goalReached
              ? "bg-gradient-to-r from-green-500 to-emerald-500"
              : "bg-gradient-to-r from-[#F26A4B] to-[#E76F51]"
          }`}
        />
      </div>

      {/* Status Text */}
      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-[#5A6478] dark:text-slate-400">
          {dailyGoal.goalReached ? (
            <span className="text-green-600 dark:text-green-400 font-semibold">
              Streak maintained!
            </span>
          ) : (
            <span>
              {dailyGoal.target - dailyGoal.studied} more to go
            </span>
          )}
        </p>
        <span className="text-xs font-mono font-bold text-[#F26A4B]">
          {dailyGoal.progress}%
        </span>
      </div>
    </a>
  );
}

// Dynamic import landing page
const LandingPage = dynamic(() => import("@/components/landing-emergent").then(mod => ({ default: mod.LandingEmergent })), {
  loading: () => <LoadingSkeleton type="page" />,
  ssr: false,
});

function HomePageContent() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const examFilter = useExamFilter(); // Single-exam-focus
  const [stats, setStats] = useState<any>(null);
  const [hasActivity, setHasActivity] = useState(false); // Track if user has any quiz activity
  const [tasks, setTasks] = useState<Array<{
    id: number;
    label: string;
    done: boolean;
    tag: string;
    link: string;
  }>>([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<Array<{
    text: string;
    time: string;
    link?: string;
  }>>([]);
  const [achievements, setAchievements] = useState<any>(null);
  const [weeklyStats, setWeeklyStats] = useState<any>(null);

  const CONTINUE = {
    examId: "upsc",
    examName: "UPSC",
    subject: "Indian Polity",
    topic: "Fundamental Rights",
    progress: 64,
    minsLeft: 12,
    accent: "#E76F51",
  };

  // Fetch stats, achievements, and weekly stats
  useEffect(() => {
    if (!user) return;

    const statsUrl = examFilter ? `/api/stats?examId=${examFilter}` : "/api/stats";

    Promise.all([
      fetch(statsUrl).then(r => r.json()),
      fetch("/api/achievements").then(r => r.json()),
      fetch("/api/weekly-stats").then(r => r.json()),
    ]).then(([statsData, achievementsData, weeklyData]) => {
      setStats(statsData);
      setAchievements(achievementsData);
      setWeeklyStats(weeklyData);

      // Check if user has any activity
      const hasAnyActivity = (statsData?.stats?.totalQuizzes || 0) > 0 ||
                             (statsData?.stats?.totalQuestionsAnswered || 0) > 0 ||
                             (statsData?.stats?.streak || 0) > 0;
      setHasActivity(hasAnyActivity);

      // Format recent activity from sessions
      if (statsData?.recentSessions) {
        const formattedActivity = statsData.recentSessions
          .slice(0, 5)
          .map((session: any) => ({
            text: `${session.subject_name || 'Quiz'} - ${session.accuracy}% (${session.correct_answers}/${session.total_questions})`,
            time: formatRelativeTime(session.created_at),
            link: `/dashboard`
          }));
        setRecentActivity(formattedActivity);
      }
    }).catch((err) => {
      console.error("Failed to fetch data:", err);
    });
  }, [user, examFilter]);

  // Fetch dynamic daily tasks
  useEffect(() => {
    if (!user) return;

    fetch("/api/daily-tasks")
      .then((r) => r.json())
      .then((data) => {
        if (data.tasks) {
          setTasks(data.tasks);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch daily tasks:", err);
      })
      .finally(() => {
        setTasksLoading(false);
      });
  }, [user]);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "GOOD MORNING";
    if (h < 17) return "GOOD AFTERNOON";
    return "GOOD EVENING";
  }, []);

  // Format relative time (e.g., "Just now", "2 hrs ago", "Yesterday")
  const formatRelativeTime = (dateStr: string): string => {
    const now = new Date();
    const then = new Date(dateStr);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 5) return "Just now";
    if (diffMins < 60) return `${diffMins} min${diffMins === 1 ? '' : 's'} ago`;
    if (diffHours < 24) return `${diffHours} hr${diffHours === 1 ? '' : 's'} ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) === 1 ? '' : 's'} ago`;
  };

  const completed = tasks.filter((t) => t.done).length;
  const pct = Math.round((completed / tasks.length) * 100);

  // Map badge IDs to UI icons
  const getBadgeIcon = (badgeId: string) => {
    const iconMap: Record<string, any> = {
      'first_quiz': Star,
      'streak_7': Flame,
      'streak_30': Rocket,
      'quiz_master_50': Trophy,
      'quiz_master_100': Crown,
      'speed_demon': Zap,
      'perfectionist': Medal,
      'early_bird': GraduationCap,
      'night_owl': Sparkles,
      'first_mock': Award
    };
    return iconMap[badgeId] || Award;
  };

  // Map badge rarity to colors
  const getRarityColor = (rarity: string) => {
    const colorMap: Record<string, string> = {
      'common': '#2A9D8F',
      'rare': '#E9C46A',
      'epic': '#7C3AED',
      'legendary': '#E76F51'
    };
    return colorMap[rarity] || '#5A6478';
  };

  // Get display badges (top 6 for home page)
  const displayBadges = achievements?.badges
    ? achievements.badges.slice(0, 6).map((badge: any) => ({
        icon: getBadgeIcon(badge.id),
        label: badge.name,
        unlocked: badge.unlocked,
        tint: getRarityColor(badge.rarity)
      }))
    : [];

  const unlockedCount = achievements?.badges?.filter((b: any) => b.unlocked).length || 0;
  const totalBadgeCount = achievements?.badges?.length || 0;

  const toggleTask = async (id: number) => {
    // Optimistic update
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

    // Persist to backend
    try {
      await fetch("/api/daily-tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId: id }),
      });
    } catch (err) {
      console.error("Failed to toggle task:", err);
      // Revert on failure
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
    }
  };

  // MOBILE APP: Show home page for logged-in users, auth for logged-out users
  useEffect(() => {
    if (isNative() && !isLoading && !user) {
      // Only redirect to auth if not logged in
      // Logged-in users stay on home page (same as web)
      router.push('/auth');
    }
  }, [user, isLoading, router]);

  // Redirect ONLY contributors (not admin) to contributor portal
  // Admin has access to both student dashboard AND contributor portal
  useEffect(() => {
    if (user && user.role === 'contributor') {
      window.location.href = '/contributor';
    }
  }, [user]);

  // Show minimal loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
        <div className="w-12 h-12 border-4 rounded-full animate-spin" style={{ borderColor: "var(--card-border)", borderTopColor: "var(--primary)" }}></div>
      </div>
    );
  }

  // Show landing page if not logged in
  if (!user) {
    return <LandingPage />;
  }

  // Show loading state while redirecting contributors (admin users see dashboard)
  if (user.role === 'contributor') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 rounded-full animate-spin" style={{ borderColor: "var(--card-border)", borderTopColor: "var(--primary)" }}></div>
          <p style={{ color: "var(--foreground-secondary)" }}>Redirecting to Contributor Portal...</p>
        </div>
      </div>
    );
  }

  const userName = user?.name || "Aspirant";

  return (
    <AccessibilityWrapper>
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-8 md:py-10">
        {/* Greeting header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8"
        >
          <div>
            <div className="text-xs font-bold uppercase text-[#F26A4B]" style={{ letterSpacing: '0.2em' }}>
              {greeting}
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black mt-2 leading-tight text-[#16213E] dark:text-white">
              Hey {userName.split(" ")[0]}, ready to move the needle?
            </h1>
            <p className="text-[#5A6478] dark:text-slate-400 mt-2 max-w-xl">
              You're <span className="font-mono font-bold text-[#F26A4B]">{completed}/{tasks.length}</span> on today's plan — one more push and you're done.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-black/5 shadow-soft px-4 py-3">
              <div className="text-[10px] uppercase text-[#5A6478] dark:text-slate-400 font-bold" style={{ letterSpacing: '0.2em' }}>Streak</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Flame className="w-4 h-4 text-[#F26A4B]" strokeWidth={2.5} />
                <span className="font-mono font-bold text-lg text-[#16213E] dark:text-white">{stats?.stats?.streak || 0} days</span>
              </div>
            </div>
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-black/5 shadow-soft px-4 py-3">
              <div className="text-[10px] uppercase text-[#5A6478] dark:text-slate-400 font-bold" style={{ letterSpacing: '0.2em' }}>Today</div>
              <div className="font-mono font-bold text-lg text-[#16213E] dark:text-white mt-0.5">{pct}%</div>
            </div>
          </div>
        </motion.div>

        {/* Continue + Today's plan row */}
        <div className={`grid ${hasActivity ? 'lg:grid-cols-3' : 'lg:grid-cols-1'} gap-5 mb-6`}>
          {/* Continue learning (only show if user has activity) */}
          {hasActivity && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="lg:col-span-2 rounded-3xl bg-[#16213E] text-white p-6 md:p-8 shadow-soft relative overflow-hidden"
          >
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full blur-3xl" style={{ backgroundColor: `${CONTINUE.accent}55` }} />
            <div className="relative">
              <div className="flex items-center gap-2 text-xs uppercase text-white/60 font-bold" style={{ letterSpacing: '0.2em' }}>
                <PlayCircle className="w-3.5 h-3.5" /> Pick up where you left off
              </div>
              <div className="mt-4 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                  <div className="text-xs uppercase font-semibold" style={{ letterSpacing: '0.2em', color: CONTINUE.accent }}>
                    {CONTINUE.examName} · {CONTINUE.subject}
                  </div>
                  <h2 className="font-heading text-3xl md:text-4xl font-black mt-1">{CONTINUE.topic}</h2>
                  <div className="mt-3 flex items-center gap-2 text-sm text-white/70">
                    <Clock className="w-4 h-4" />
                    <span>~{CONTINUE.minsLeft} min to complete this topic</span>
                  </div>
                </div>
                <button
                  onClick={() => router.push('/study-guides')}
                  className="rounded-xl bg-[#F26A4B] hover:bg-[#E15838] text-white font-semibold gap-2 h-11 px-5 flex items-center justify-center transition-all duration-500"
                >
                  Resume <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-5">
                <div className="flex items-center justify-between text-xs text-white/60 mb-1.5 font-semibold">
                  <span>Topic progress</span>
                  <span className="font-mono">{CONTINUE.progress}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${CONTINUE.progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: CONTINUE.accent }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
          )}

          {/* Today's plan (only show if user has activity) */}
          {hasActivity && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl bg-white dark:bg-slate-900 border border-black/5 p-6 shadow-soft"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs uppercase font-bold text-[#5A6478] dark:text-slate-400" style={{ letterSpacing: '0.2em' }}>Today's plan</div>
                <div className="font-heading text-lg font-bold mt-0.5 text-[#16213E] dark:text-white">4 tasks · ~60 min</div>
              </div>
              <Target className="w-5 h-5 text-[#F26A4B]" />
            </div>
            <ul className="space-y-2">
              {tasks.map((t) => (
                <li key={t.id}>
                  <button
                    onClick={() => toggleTask(t.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                      t.done ? "bg-[#2E8B57]/10" : "hover:bg-black/[0.03] dark:hover:bg-white/[0.03]"
                    }`}
                  >
                    {t.done ? (
                      <CheckCircle2 className="w-5 h-5 text-[#2E8B57] flex-shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-[#5A6478] dark:text-slate-400 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-semibold ${t.done ? "line-through text-[#5A6478] dark:text-slate-400" : "text-[#16213E] dark:text-white"}`}>
                        {t.label}
                      </div>
                      <div className="text-[10px] uppercase text-[#5A6478] dark:text-slate-400 font-bold mt-0.5" style={{ letterSpacing: '0.2em' }}>
                        {t.tag}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
          )}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[
            { to: "/flashcards", icon: Zap, label: "Flashcards", sub: "Drill decks", tint: "#E76F51" },
            { to: "/study-guides", icon: BookOpen, label: "Study Guides", sub: "Read topics", tint: "#2A9D8F" },
            { to: "/mock-test", icon: Trophy, label: "Mock Test", sub: "Simulate exam", tint: "#264653" },
            { to: "/review", icon: TrendingUp, label: "Review", sub: `3 due today`, tint: "#E9C46A" },
            // Admin-only: Contributor Portal access
            ...(user.role === 'admin' ? [
              { to: "/contributor", icon: Upload, label: "Contributor Portal", sub: "Upload content", tint: "#8B5CF6" }
            ] : [])
          ].map((a, i) => {
            const Icon = a.icon;
            return (
              <a
                key={a.to}
                href={a.to}
                className="group rounded-2xl bg-white dark:bg-slate-900 border border-black/5 p-5 shadow-soft hover:-translate-y-1 hover:shadow-pop transition-all"
              >
                <div
                  className="w-11 h-11 rounded-xl grid place-items-center"
                  style={{ backgroundColor: `${a.tint}20`, color: a.tint }}
                >
                  <Icon className="w-5 h-5" strokeWidth={2.5} />
                </div>
                <div className="font-heading text-lg font-bold mt-4 text-[#16213E] dark:text-white">{a.label}</div>
                <div className="text-xs text-[#5A6478] dark:text-slate-400 mt-0.5">{a.sub}</div>
                <div className="mt-3 text-xs font-semibold text-[#16213E] dark:text-white group-hover:text-[#F26A4B] flex items-center gap-1">
                  Open <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                </div>
              </a>
            );
          })}
        </div>

        {/* Daily 10 Questions + Recent activity + Daily Goal */}
        <div className="grid lg:grid-cols-3 gap-5 mb-6">
          <div className="lg:col-span-2">
            <DailyTenQuestions />
          </div>

          {/* Right column: Recent Activity + Daily Goal stacked */}
          <div className="flex flex-col gap-5">
            {/* Recent activity */}
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-black/5 p-6 shadow-soft">
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs uppercase font-bold text-[#5A6478] dark:text-slate-400" style={{ letterSpacing: '0.2em' }}>Recent activity</div>
                <Clock className="w-4 h-4 text-[#F26A4B]" />
              </div>
              {recentActivity.length > 0 ? (
                <>
                  <ul className="space-y-3">
                    {recentActivity.map((activity, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-[#F26A4B] mt-1.5 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-[#16213E] dark:text-white leading-snug">{activity.text}</div>
                          <div className="text-xs text-[#5A6478] dark:text-slate-400 mt-0.5 font-mono">{activity.time}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="/dashboard"
                    className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#F26A4B] hover:underline"
                  >
                    View full dashboard <ChevronRight className="w-3 h-3" />
                  </a>
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="text-sm text-[#5A6478] dark:text-slate-400">
                    No recent activity yet
                  </div>
                  <a
                    href="/quiz"
                    className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#F26A4B] hover:underline"
                  >
                    Start your first quiz <ChevronRight className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            {/* Flashcard Daily Goal */}
            <FlashcardDailyGoalBanner />
          </div>
        </div>

        {/* Weekly goal + Achievements row */}
        <div className="grid lg:grid-cols-3 gap-5 mb-6">
          {/* Weekly goal ring */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-black/5 p-6 shadow-soft">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs uppercase font-bold text-[#5A6478] dark:text-slate-400" style={{ letterSpacing: '0.2em' }}>Weekly goal</div>
              <Target className="w-4 h-4 text-[#F26A4B]" />
            </div>
            {weeklyStats ? (
              <div className="flex items-center gap-5">
                <svg width="120" height="120" className="-rotate-90 flex-shrink-0">
                  <circle cx="60" cy="60" r="52" stroke="rgba(0,0,0,0.06)" strokeWidth="10" fill="none" />
                  <circle cx="60" cy="60" r="52" stroke="#E76F51" strokeWidth="10" strokeLinecap="round" fill="none"
                    strokeDasharray={2 * Math.PI * 52}
                    strokeDashoffset={(2 * Math.PI * 52) * (1 - (weeklyStats.percentage / 100))} />
                </svg>
                <div>
                  <div className="font-mono font-black text-4xl text-[#16213E] dark:text-white leading-none">
                    {weeklyStats.hoursThisWeek}h
                  </div>
                  <div className="text-xs text-[#5A6478] dark:text-slate-400 mt-1 font-semibold">
                    of {weeklyStats.weeklyGoal}h weekly goal
                  </div>
                  {weeklyStats.difference !== 0 && (
                    <div className={`text-xs mt-2 flex items-center gap-1 font-semibold ${
                      weeklyStats.difference > 0 ? 'text-[#2E8B57]' : 'text-[#E76F51]'
                    }`}>
                      {weeklyStats.difference > 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {weeklyStats.difference > 0 ? '+' : ''}{weeklyStats.difference}h vs last week
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-5">
                <svg width="120" height="120" className="-rotate-90 flex-shrink-0">
                  <circle cx="60" cy="60" r="52" stroke="rgba(0,0,0,0.06)" strokeWidth="10" fill="none" />
                </svg>
                <div>
                  <div className="font-mono font-black text-4xl text-[#16213E] dark:text-white leading-none">0h</div>
                  <div className="text-xs text-[#5A6478] dark:text-slate-400 mt-1 font-semibold">of 8h weekly goal</div>
                </div>
              </div>
            )}
          </div>

          {/* Achievements strip */}
          <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-slate-900 border border-black/5 p-6 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs uppercase font-bold text-[#5A6478] dark:text-slate-400" style={{ letterSpacing: '0.2em' }}>Achievements</div>
                <div className="font-heading font-bold text-lg mt-0.5 text-[#16213E] dark:text-white">
                  You've unlocked {unlockedCount} of {totalBadgeCount} badges
                </div>
              </div>
              <Award className="w-5 h-5 text-[#F26A4B]" />
            </div>
            {displayBadges.length > 0 ? (
              <>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {displayBadges.map((b: any, i: number) => {
                    const Icon = b.icon;
                    return (
                      <div
                        key={i}
                        className={`rounded-2xl border p-3 text-center transition-all ${
                          b.unlocked ? "border-black/5 bg-[#FAF8F5] dark:bg-slate-800" : "border-dashed border-black/10 bg-white dark:bg-slate-900 opacity-50"
                        }`}
                        title={b.label}
                      >
                        <div
                          className="w-9 h-9 rounded-xl grid place-items-center mx-auto"
                          style={{ backgroundColor: `${b.tint}${b.unlocked ? "25" : "10"}`, color: b.tint }}
                        >
                          <Icon className="w-4 h-4" strokeWidth={2.5} />
                        </div>
                        <div className="text-[10px] font-bold mt-2 text-[#16213E] dark:text-white truncate">{b.label}</div>
                      </div>
                    );
                  })}
                </div>
                <a
                  href="/achievements"
                  className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#F26A4B] hover:underline"
                >
                  View all achievements <ChevronRight className="w-3 h-3" />
                </a>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="text-sm text-[#5A6478] dark:text-slate-400">
                  Complete quizzes to unlock badges
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Study Modes */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-black/5 p-6 md:p-8 shadow-soft mb-6">
          <div className="flex items-end justify-between mb-5">
            <div>
              <div className="text-xs uppercase font-bold text-[#F26A4B]" style={{ letterSpacing: '0.2em' }}>Study modes</div>
              <h3 className="font-heading text-2xl font-bold mt-1 text-[#16213E] dark:text-white">Pick how you want to learn today.</h3>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { icon: Gamepad2, label: "Level Mode", sub: "Progressive challenges", tint: "#E76F51", to: "/level-mode", badge: "30 Levels" },
              { icon: Puzzle, label: "Match", sub: "Speed pairing game", tint: "#2A9D8F", to: "/flashcards" },
              { icon: Timer, label: "Test", sub: "Timed 10 Qs", tint: "#264653", to: "/mock-test" },
              { icon: Rocket, label: "Blast", sub: "60-sec fast recall", tint: "#E9C46A", to: "/sprint" },
            ].map((m, i) => {
              const Icon = m.icon;
              return (
                <a
                  key={i}
                  href={m.to}
                  className="group rounded-2xl border border-black/5 bg-[#FAF8F5] dark:bg-slate-800 p-5 hover:-translate-y-1 hover:shadow-pop transition-all overflow-hidden relative"
                >
                  <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-10 group-hover:opacity-20 transition-opacity" style={{ backgroundColor: m.tint }} />
                  <div className="relative">
                    <div className="w-11 h-11 rounded-xl grid place-items-center" style={{ backgroundColor: `${m.tint}25`, color: m.tint }}>
                      <Icon className="w-5 h-5" strokeWidth={2.5} />
                    </div>
                    <div className="font-heading text-xl font-bold mt-4 text-[#16213E] dark:text-white">{m.label}</div>
                    <div className="text-xs text-[#5A6478] dark:text-slate-400 mt-0.5">{m.sub}</div>
                    {'badge' in m && (
                      <div className="mt-2 inline-block px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: `${m.tint}15`, color: m.tint }}>
                        {m.badge}
                      </div>
                    )}
                    <div className="mt-3 text-xs font-semibold text-[#16213E] dark:text-white group-hover:text-[#F26A4B] flex items-center gap-1">
                      Start <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* Recently studied (only show if user has activity) */}
        {hasActivity && (
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-black/5 p-6 md:p-8 shadow-soft mb-6">
          <div className="flex items-end justify-between mb-5">
            <div>
              <div className="text-xs uppercase font-bold text-[#F26A4B]" style={{ letterSpacing: '0.2em' }}>Recently studied</div>
              <h3 className="font-heading text-2xl font-bold mt-1 text-[#16213E] dark:text-white">Jump back in.</h3>
            </div>
            <a href="/flashcards" className="text-xs font-semibold text-[#16213E] dark:text-white hover:text-[#F26A4B] flex items-center gap-1">
              All decks <ArrowRight className="w-3 h-3" />
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { exam: "UPSC", subject: "Indian Polity", cards: 6, progress: 82, accent: "#E76F51" },
              { exam: "JEE", subject: "Physics · Kinematics", cards: 6, progress: 54, accent: "#2A9D8F" },
              { exam: "NEET", subject: "Biology · Cell", cards: 6, progress: 38, accent: "#264653" },
            ].map((d, i) => (
              <a
                key={i}
                href="/flashcards"
                className="group rounded-2xl border border-black/5 bg-[#FAF8F5] dark:bg-slate-800 p-5 hover:-translate-y-1 hover:shadow-pop transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="text-[10px] uppercase font-bold" style={{ letterSpacing: '0.2em', color: d.accent }}>
                    {d.exam}
                  </div>
                  <Layers className="w-4 h-4 text-[#5A6478] dark:text-slate-400" />
                </div>
                <div className="font-heading text-lg font-bold mt-2 text-[#16213E] dark:text-white">{d.subject}</div>
                <div className="text-xs text-[#5A6478] dark:text-slate-400 mt-1">{d.cards} cards</div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#5A6478] dark:text-slate-400 mb-1.5">
                    <span>Progress</span>
                    <span className="font-mono">{d.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${d.progress}%`, backgroundColor: d.accent }} />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
        )}

        {/* Trending topics for your exam */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-black/5 p-6 md:p-8 shadow-soft">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-xs uppercase font-bold text-[#F26A4B]" style={{ letterSpacing: '0.2em' }}>
                {user?.exam_preparing_for ? 'Trending for your exam' : 'Popular Topics'}
              </div>
              <h3 className="font-heading text-2xl font-bold mt-1 text-[#16213E] dark:text-white">
                Hot topics{user?.exam_preparing_for ? ` · ${user.exam_preparing_for}` : ''}
              </h3>
            </div>
            <a href="/study-guides" className="text-xs font-semibold text-[#16213E] dark:text-white hover:text-[#F26A4B] flex items-center gap-1">
              All topics <ArrowRight className="w-3 h-3" />
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(() => {
              // Define trending topics for different exams
              const trendingByExam: Record<string, Array<{subject: string, topic: string, learners: number}>> = {
                'UPSC CSE': [
                  { subject: "INDIAN POLITY", topic: "Constitution", learners: 2843 },
                  { subject: "MODERN HISTORY", topic: "Freedom Struggle", learners: 3304 },
                  { subject: "GEOGRAPHY", topic: "Physical Geography", learners: 1956 },
                  { subject: "ECONOMY", topic: "Budget & Taxation", learners: 2124 },
                ],
                'JEE Main': [
                  { subject: "PHYSICS", topic: "Thermodynamics", learners: 4521 },
                  { subject: "CHEMISTRY", topic: "Organic Chemistry", learners: 3890 },
                  { subject: "MATHEMATICS", topic: "Calculus", learners: 5234 },
                  { subject: "PHYSICS", topic: "Electromagnetism", learners: 4102 },
                ],
                'NEET': [
                  { subject: "BIOLOGY", topic: "Cell Biology", learners: 3456 },
                  { subject: "PHYSICS", topic: "Optics", learners: 2890 },
                  { subject: "CHEMISTRY", topic: "Chemical Bonding", learners: 3123 },
                  { subject: "BIOLOGY", topic: "Genetics", learners: 4012 },
                ],
                'CAT': [
                  { subject: "QUANT", topic: "Number Systems", learners: 2345 },
                  { subject: "VERBAL", topic: "Reading Comprehension", learners: 2890 },
                  { subject: "LRDI", topic: "Data Interpretation", learners: 2567 },
                  { subject: "QUANT", topic: "Geometry", learners: 2123 },
                ],
                'GATE': [
                  { subject: "DATA STRUCTURES", topic: "Trees & Graphs", learners: 3456 },
                  { subject: "ALGORITHMS", topic: "Dynamic Programming", learners: 2987 },
                  { subject: "OS", topic: "Process Management", learners: 2654 },
                  { subject: "DBMS", topic: "Normalization", learners: 2890 },
                ],
              };

              // Get trending topics based on user's exam or show default
              const userExam = user?.exam_preparing_for || 'UPSC CSE';
              const topics = trendingByExam[userExam] || trendingByExam['UPSC CSE'];

              return topics.map((row, i) => (
              <a
                key={i}
                href="/study-guides"
                className="rounded-2xl bg-[#FAF8F5] dark:bg-slate-800 border border-black/5 p-4 hover:border-[#F26A4B]/40 hover:-translate-y-0.5 transition-all group"
              >
                <div className="text-[10px] uppercase font-bold text-[#5A6478] dark:text-slate-400" style={{ letterSpacing: '0.2em' }}>{row.subject}</div>
                <div className="font-heading font-bold text-[#16213E] dark:text-white mt-1 group-hover:text-[#F26A4B] transition-colors">{row.topic}</div>
                <div className="text-xs text-[#5A6478] dark:text-slate-400 mt-2">Trending · {row.learners} learners</div>
              </a>
              ));
            })()}
          </div>
        </div>
      </div>
    </AccessibilityWrapper>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ color: "var(--foreground)" }}>Loading...</div>}>
      <HomePageContent />
    </Suspense>
  );
}
