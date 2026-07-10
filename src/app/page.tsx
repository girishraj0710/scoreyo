"use client";

import { useState, useEffect, useMemo, useRef, Suspense } from "react";
import dynamic from "next/dynamic";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useUser } from "@/context/user-context";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { AccessibilityWrapper } from "@/components/accessibility-wrapper";
import { isNative } from "@/lib/capacitor";
import {
  Flame, PlayCircle, ChevronRight, BookOpen, Clock, Sparkles,
  Target, CheckCircle2, Circle, TrendingUp, Trophy, ArrowRight, Zap,
  GraduationCap, Puzzle, Timer, Rocket, Award, Medal, Crown, Star, Layers,
} from "lucide-react";

// Dynamic import landing page
const LandingPage = dynamic(() => import("@/components/landing-emergent").then(mod => ({ default: mod.LandingEmergent })), {
  loading: () => <LoadingSkeleton type="page" />,
  ssr: false,
});

function HomePageContent() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [hasActivity, setHasActivity] = useState(false); // Track if user has any quiz activity
  const [tasks, setTasks] = useState([
    { id: 1, label: "Review 24 Polity flashcards", done: true, tag: "Flashcards", link: "/flashcards" },
    { id: 2, label: "Read: Fundamental Rights (Article 12–35)", done: false, tag: "Study Guide", link: "/study-guides" },
    { id: 3, label: "Attempt UPSC Prelims Mock #1", done: false, tag: "Mock Test", link: "/mock-test" },
    { id: 4, label: "Clear 3 due review items", done: false, tag: "Review", link: "/review" },
  ]);
  const [mcqChoice, setMcqChoice] = useState<number | null>(null);
  const [mcqRevealed, setMcqRevealed] = useState(false);

  const DAILY_MCQ = {
    q: "Which article of the Indian Constitution deals with the Right to Constitutional Remedies?",
    options: ["Article 19", "Article 21", "Article 32", "Article 44"],
    correct: 2,
  };

  const CONTINUE = {
    examId: "upsc",
    examName: "UPSC",
    subject: "Indian Polity",
    topic: "Fundamental Rights",
    progress: 64,
    minsLeft: 12,
    accent: "#E76F51",
  };

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data) => {
        setStats(data);
        // Check if user has any activity (quizzes taken, review items, etc.)
        const hasAnyActivity = (data?.stats?.totalQuizzes || 0) > 0 ||
                               (data?.stats?.totalQuestionsAnswered || 0) > 0 ||
                               (data?.stats?.streak || 0) > 0;
        setHasActivity(hasAnyActivity);
      })
      .catch(() => {});
  }, []);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "GOOD MORNING";
    if (h < 17) return "GOOD AFTERNOON";
    return "GOOD EVENING";
  }, []);

  const completed = tasks.filter((t) => t.done).length;
  const pct = Math.round((completed / tasks.length) * 100);

  const toggleTask = (id: number) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const submitMcq = () => {
    if (mcqChoice === null) return;
    setMcqRevealed(true);
  };

  // MOBILE APP: Skip landing page, go straight to dashboard or auth
  useEffect(() => {
    if (isNative() && !isLoading) {
      if (user) {
        router.push('/dashboard');
      } else {
        router.push('/auth');
      }
    }
  }, [user, isLoading, router]);

  // Redirect contributors to contributor portal
  useEffect(() => {
    if (user && (user.role === 'contributor' || user.role === 'admin')) {
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

  // Show loading state while redirecting contributors
  if (user.role === 'contributor' || user.role === 'admin') {
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
            <div className="text-xs font-bold tracking-[0.2em] uppercase text-[#F26A4B]">
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
              <div className="text-[10px] uppercase tracking-widest text-[#5A6478] dark:text-slate-400 font-bold">Streak</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Flame className="w-4 h-4 text-[#F26A4B]" strokeWidth={2.5} />
                <span className="font-mono font-bold text-lg text-[#16213E] dark:text-white">{stats?.stats?.streak || 0} days</span>
              </div>
            </div>
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-black/5 shadow-soft px-4 py-3">
              <div className="text-[10px] uppercase tracking-widest text-[#5A6478] dark:text-slate-400 font-bold">Today</div>
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
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/60 font-bold">
                <PlayCircle className="w-3.5 h-3.5" /> Pick up where you left off
              </div>
              <div className="mt-4 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-widest font-semibold" style={{ color: CONTINUE.accent }}>
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
                <div className="text-xs uppercase tracking-widest font-bold text-[#5A6478] dark:text-slate-400">Today's plan</div>
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
                      <div className="text-[10px] uppercase tracking-widest text-[#5A6478] dark:text-slate-400 font-bold mt-0.5">
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

        {/* Daily MCQ + Recent activity */}
        <div className="grid lg:grid-cols-3 gap-5 mb-6">
          <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-slate-900 border border-black/5 p-6 md:p-8 shadow-soft">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#F26A4B]">
              <Sparkles className="w-3.5 h-3.5" /> Question of the day
            </div>
            <h3 className="font-heading text-xl md:text-2xl font-bold mt-3 leading-snug text-[#16213E] dark:text-white">
              {DAILY_MCQ.q}
            </h3>
            <div className="mt-5 space-y-2">
              {DAILY_MCQ.options.map((opt, i) => {
                const chosen = mcqChoice === i;
                const isCorrect = i === DAILY_MCQ.correct;
                const showResult = mcqRevealed;
                let styles = "border-black/5 hover:border-[#16213E]/20 bg-[#FAF8F5] dark:bg-slate-800";
                if (showResult && isCorrect) styles = "border-[#2E8B57] bg-[#2E8B57]/10";
                else if (showResult && chosen && !isCorrect) styles = "border-red-300 bg-red-50 dark:bg-red-900/20";
                else if (chosen) styles = "border-[#F26A4B] bg-[#F26A4B]/5";
                return (
                  <button
                    key={i}
                    disabled={mcqRevealed}
                    onClick={() => setMcqChoice(i)}
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all flex items-center gap-3 ${styles}`}
                  >
                    <div className={`w-7 h-7 rounded-lg grid place-items-center font-mono font-bold text-sm ${
                      chosen ? "bg-[#F26A4B] text-white" : "bg-white dark:bg-slate-700 text-[#5A6478] dark:text-slate-300 border border-black/5"
                    }`}>
                      {String.fromCharCode(65 + i)}
                    </div>
                    <div className="text-sm font-medium text-[#16213E] dark:text-white flex-1">{opt}</div>
                    {mcqRevealed && isCorrect && <CheckCircle2 className="w-4 h-4 text-[#2E8B57]" />}
                  </button>
                );
              })}
            </div>
            <div className="mt-5 flex gap-2">
              {!mcqRevealed ? (
                <button
                  onClick={submitMcq}
                  disabled={mcqChoice === null}
                  className="rounded-xl bg-[#16213E] hover:bg-black text-white font-semibold px-6 py-2.5 disabled:opacity-50 transition-all duration-500"
                >
                  Submit answer
                </button>
              ) : (
                <>
                  <div className="text-sm text-[#5A6478] dark:text-slate-400 flex-1 self-center">
                    {mcqChoice === DAILY_MCQ.correct ? "Correct 🎯 +10 XP added." : "Try tomorrow's — you've got this."}
                  </div>
                  <button
                    onClick={() => {
                      setMcqChoice(null);
                      setMcqRevealed(false);
                    }}
                    className="rounded-xl border border-black/10 bg-white dark:bg-slate-800 px-6 py-2.5 text-[#16213E] dark:text-white font-semibold transition-all duration-500"
                  >
                    Reset
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-black/5 p-6 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs uppercase tracking-widest font-bold text-[#5A6478] dark:text-slate-400">Recent activity</div>
              <Clock className="w-4 h-4 text-[#F26A4B]" />
            </div>
            <ul className="space-y-3">
              {[
                { text: "Reviewed 24 Polity cards", time: "Just now" },
                { text: "Scored 82% on JEE Physics Mock", time: "2 hrs ago" },
                { text: "Read: Fundamental Rights (12 min)", time: "Yesterday" },
                { text: "Extended streak to 14 days", time: "2 days ago" },
              ].map((a, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#F26A4B] mt-1.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-[#16213E] dark:text-white leading-snug">{a.text}</div>
                    <div className="text-xs text-[#5A6478] dark:text-slate-400 mt-0.5 font-mono">{a.time}</div>
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
          </div>
        </div>

        {/* Weekly goal + Achievements row */}
        <div className="grid lg:grid-cols-3 gap-5 mb-6">
          {/* Weekly goal ring */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-black/5 p-6 shadow-soft">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs uppercase tracking-widest font-bold text-[#5A6478] dark:text-slate-400">Weekly goal</div>
              <Target className="w-4 h-4 text-[#F26A4B]" />
            </div>
            <div className="flex items-center gap-5">
              <svg width="120" height="120" className="-rotate-90 flex-shrink-0">
                <circle cx="60" cy="60" r="52" stroke="rgba(0,0,0,0.06)" strokeWidth="10" fill="none" />
                <circle cx="60" cy="60" r="52" stroke="#E76F51" strokeWidth="10" strokeLinecap="round" fill="none"
                  strokeDasharray={2 * Math.PI * 52} strokeDashoffset={(2 * Math.PI * 52) * (1 - 0.72)} />
              </svg>
              <div>
                <div className="font-mono font-black text-4xl text-[#16213E] dark:text-white leading-none">5.8h</div>
                <div className="text-xs text-[#5A6478] dark:text-slate-400 mt-1 font-semibold">of 8h weekly goal</div>
                <div className="text-xs text-[#2E8B57] mt-2 flex items-center gap-1 font-semibold">
                  <TrendingUp className="w-3 h-3" /> +1.2h vs last week
                </div>
              </div>
            </div>
          </div>

          {/* Achievements strip */}
          <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-slate-900 border border-black/5 p-6 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs uppercase tracking-widest font-bold text-[#5A6478] dark:text-slate-400">Achievements</div>
                <div className="font-heading font-bold text-lg mt-0.5 text-[#16213E] dark:text-white">You've unlocked 6 of 24 badges</div>
              </div>
              <Award className="w-5 h-5 text-[#F26A4B]" />
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {[
                { icon: Flame, label: "Streak 14d", unlocked: true, tint: "#E76F51" },
                { icon: Medal, label: "100 cards", unlocked: true, tint: "#E9C46A" },
                { icon: Star, label: "First mock", unlocked: true, tint: "#2A9D8F" },
                { icon: Crown, label: "Top 10", unlocked: false, tint: "#7C3AED" },
                { icon: Trophy, label: "90%+ score", unlocked: false, tint: "#264653" },
                { icon: Rocket, label: "30d streak", unlocked: false, tint: "#DC2626" },
              ].map((b, i) => {
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
          </div>
        </div>

        {/* Study Modes */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-black/5 p-6 md:p-8 shadow-soft mb-6">
          <div className="flex items-end justify-between mb-5">
            <div>
              <div className="text-xs uppercase tracking-widest font-bold text-[#F26A4B]">Study modes</div>
              <h3 className="font-heading text-2xl font-bold mt-1 text-[#16213E] dark:text-white">Pick how you want to learn today.</h3>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { icon: GraduationCap, label: "Learn", sub: "Adaptive practice", tint: "#E76F51", to: "/study-guides" },
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
              <div className="text-xs uppercase tracking-widest font-bold text-[#F26A4B]">Recently studied</div>
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
                  <div className="text-[10px] uppercase tracking-widest font-bold" style={{ color: d.accent }}>
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
              <div className="text-xs uppercase tracking-widest font-bold text-[#F26A4B]">
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
                <div className="text-[10px] uppercase tracking-widest font-bold text-[#5A6478] dark:text-slate-400">{row.subject}</div>
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
