"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  ChevronLeft,
  Check,
  Target,
  Clock,
  BookOpen,
  Sparkles,
  Brain,
} from "lucide-react";
import { examCategories, getExamById } from "@/lib/exams";
import { useUser } from "@/context/user-context";

// ─── Answer shape ────────────────────────────────────────
interface OnboardingAnswers {
  examId: string;
  targetYear: number | null;
  targetRank: string;
  confidence: number; // 1-5
  attemptedBefore: boolean | null;
  currentClass: string;
  dailyHours: number; // 1-12
  daysPerWeek: number; // 1-7
  preferredTime: string;
  subjectStrength: Record<string, "strong" | "average" | "weak">;
  learningStyles: string[];
  habits: string[];
}

const CURRENT_YEAR = 2026; // stamped from app currentDate; onboarding target years derive from this
const YEAR_OPTIONS = [CURRENT_YEAR, CURRENT_YEAR + 1, CURRENT_YEAR + 2, CURRENT_YEAR + 3];

const CLASS_OPTIONS = ["Class 11", "Class 12", "Dropper / Repeater", "College", "Working professional"];
const TIME_OPTIONS = ["Early morning", "Daytime", "Evening", "Late night"];

const LEARNING_STYLES = [
  { id: "videos", label: "Video lessons", icon: "🎬" },
  { id: "reading", label: "Reading notes", icon: "📖" },
  { id: "practice", label: "Practice questions", icon: "✍️" },
  { id: "flashcards", label: "Flashcards", icon: "🃏" },
  { id: "ai-tutor", label: "AI tutor chat", icon: "🤖" },
  { id: "diagrams", label: "Diagrams & visuals", icon: "📊" },
  { id: "real-world", label: "Real-world examples", icon: "🌍" },
];

const HABITS = [
  { id: "procrastinate", label: "I procrastinate a lot" },
  { id: "forget", label: "I forget concepts quickly" },
  { id: "run-out-of-time", label: "I run out of time in tests" },
  { id: "silly-mistakes", label: "I make silly mistakes" },
  { id: "lose-focus", label: "I lose focus while studying" },
  { id: "skip-revision", label: "I skip revision" },
];

const ACCENT = "#A182F9";

type StepId =
  | "exam"
  | "goal"
  | "level"
  | "time"
  | "subjects"
  | "style"
  | "habits"
  | "processing";

const INTERVIEW_STEPS: StepId[] = [
  "exam",
  "goal",
  "level",
  "time",
  "subjects",
  "style",
  "habits",
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, refreshUser } = useUser();

  const [stepIndex, setStepIndex] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const [answers, setAnswers] = useState<OnboardingAnswers>({
    examId: "",
    targetYear: null,
    targetRank: "",
    confidence: 3,
    attemptedBefore: null,
    currentClass: "",
    dailyHours: 3,
    daysPerWeek: 5,
    preferredTime: "",
    subjectStrength: {},
    learningStyles: [],
    habits: [],
  });

  // Pre-fill exam for existing users (from their current enrollment).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/onboarding");
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        // Already completed? Bounce home.
        if (data.onboardingCompleted) {
          router.replace("/");
          return;
        }
        if (data.examId) {
          setAnswers((a) => (a.examId ? a : { ...a, examId: data.examId }));
        }
      } catch {
        /* non-fatal — user just picks their exam */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const step = INTERVIEW_STEPS[stepIndex];
  const selectedExam = answers.examId ? getExamById(answers.examId) : undefined;
  const totalSteps = INTERVIEW_STEPS.length;
  const progress = ((stepIndex + 1) / totalSteps) * 100;

  const update = <K extends keyof OnboardingAnswers>(key: K, value: OnboardingAnswers[K]) =>
    setAnswers((a) => ({ ...a, [key]: value }));

  const toggleInArray = (key: "learningStyles" | "habits", id: string) =>
    setAnswers((a) => {
      const arr = a[key];
      return { ...a, [key]: arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id] };
    });

  // Per-step validation gate for the "Continue" button.
  const canContinue = useMemo(() => {
    switch (step) {
      case "exam":
        return !!answers.examId;
      case "goal":
        return !!answers.targetYear;
      case "level":
        return answers.attemptedBefore !== null && !!answers.currentClass;
      case "time":
        return !!answers.preferredTime;
      case "subjects":
        return !!selectedExam && selectedExam.subjects.every((s) => !!answers.subjectStrength[s.id]);
      case "style":
        return answers.learningStyles.length > 0;
      case "habits":
        return true; // habits optional
      default:
        return false;
    }
  }, [step, answers, selectedExam]);

  const goNext = () => {
    setError("");
    if (stepIndex < totalSteps - 1) {
      setStepIndex((i) => i + 1);
    } else {
      handleSubmit();
    }
  };

  const goBack = () => {
    setError("");
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  };

  const handleSubmit = async () => {
    setProcessing(true);
    setError("");
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ examId: answers.examId, profile: answers }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Failed to save");
      }

      // Kick off study-plan generation. Non-blocking for UX: even if it fails,
      // onboarding is complete and the home page can generate lazily.
      fetch("/api/study-plan/generate", { method: "POST" }).catch(() => {});

      await refreshUser?.();

      // Hold the processing screen briefly so the "building your plan" animation reads.
      setTimeout(() => {
        router.replace("/");
        router.refresh();
      }, 2600);
    } catch (e: any) {
      setError(e?.message || "Something went wrong. Please try again.");
      setProcessing(false);
    }
  };

  if (processing) return <ProcessingScreen name={user?.name} />;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col">
      {/* Progress bar */}
      <div className="sticky top-0 z-10 bg-white/90 dark:bg-slate-950/90 backdrop-blur border-b border-slate-100 dark:border-slate-900">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            {stepIndex > 0 ? (
              <button
                onClick={goBack}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Back"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            ) : (
              <div className="w-8" />
            )}
            <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: ACCENT }}
                initial={false}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <span className="text-xs font-semibold text-slate-400 tabular-nums w-10 text-right">
              {stepIndex + 1}/{totalSteps}
            </span>
          </div>
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 max-w-2xl w-full mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
          >
            {step === "exam" && <ExamStep answers={answers} update={update} />}
            {step === "goal" && <GoalStep answers={answers} update={update} />}
            {step === "level" && <LevelStep answers={answers} update={update} />}
            {step === "time" && <TimeStep answers={answers} update={update} />}
            {step === "subjects" && (
              <SubjectsStep answers={answers} setAnswers={setAnswers} exam={selectedExam} />
            )}
            {step === "style" && (
              <StyleStep answers={answers} toggle={(id) => toggleInArray("learningStyles", id)} />
            )}
            {step === "habits" && (
              <HabitsStep answers={answers} toggle={(id) => toggleInArray("habits", id)} />
            )}
          </motion.div>
        </AnimatePresence>

        {error && (
          <div className="mt-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
            {error}
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="sticky bottom-0 bg-white/90 dark:bg-slate-950/90 backdrop-blur border-t border-slate-100 dark:border-slate-900">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <button
            onClick={goNext}
            disabled={!canContinue}
            className="w-full py-4 text-white text-base font-bold rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
            style={{ background: ACCENT }}
          >
            {stepIndex === totalSteps - 1 ? "Build my plan" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Reusable presentational bits ────────────────────────

function StepHeader({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="mb-8">
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: `${ACCENT}1A`, color: ACCENT }}
      >
        {icon}
      </div>
      <h1
        className="text-2xl font-bold text-slate-900 dark:text-white"
        style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.02em" }}
      >
        {title}
      </h1>
      <p className="text-[15px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">{subtitle}</p>
    </div>
  );
}

function OptionButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-3.5 rounded-xl border-2 text-sm font-medium transition-all flex items-center justify-between gap-2"
      style={{
        borderColor: active ? ACCENT : undefined,
        background: active ? `${ACCENT}12` : undefined,
      }}
      data-active={active}
    >
      <span className={active ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-300"}>
        {children}
      </span>
      {active && <Check className="w-4 h-4 flex-shrink-0" style={{ color: ACCENT }} />}
    </button>
  );
}

// ─── Step: exam ──────────────────────────────────────────
function ExamStep({
  answers,
  update,
}: {
  answers: OnboardingAnswers;
  update: <K extends keyof OnboardingAnswers>(k: K, v: OnboardingAnswers[K]) => void;
}) {
  return (
    <div>
      <StepHeader
        icon={<Target className="w-6 h-6" />}
        title="Which exam are you preparing for?"
        subtitle="Scoreyo tailors everything to one goal. You can change it later in settings."
      />
      <div className="space-y-6">
        {examCategories.map((cat) => (
          <div key={cat.id}>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-2">
              {cat.icon} {cat.name}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {cat.exams.map((exam) => {
                const active = answers.examId === exam.id;
                return (
                  <button
                    key={exam.id}
                    onClick={() => update("examId", exam.id)}
                    className="text-left px-3 py-3 rounded-xl border-2 transition-all"
                    style={{
                      borderColor: active ? ACCENT : undefined,
                      background: active ? `${ACCENT}12` : undefined,
                    }}
                  >
                    <span className="text-lg mr-1.5">{exam.icon}</span>
                    <span
                      className={`text-sm font-semibold ${
                        active ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {exam.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Step: goal ──────────────────────────────────────────
function GoalStep({
  answers,
  update,
}: {
  answers: OnboardingAnswers;
  update: <K extends keyof OnboardingAnswers>(k: K, v: OnboardingAnswers[K]) => void;
}) {
  return (
    <div>
      <StepHeader
        icon={<Target className="w-6 h-6" />}
        title="What's your target?"
        subtitle="This sets the countdown and the intensity of your daily plan."
      />
      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Target exam year</label>
      <div className="grid grid-cols-4 gap-2 mt-2 mb-6">
        {YEAR_OPTIONS.map((y) => (
          <button
            key={y}
            onClick={() => update("targetYear", y)}
            className="py-3 rounded-xl border-2 text-sm font-bold transition-all"
            style={{
              borderColor: answers.targetYear === y ? ACCENT : undefined,
              background: answers.targetYear === y ? `${ACCENT}12` : undefined,
              color: answers.targetYear === y ? ACCENT : undefined,
            }}
          >
            {y}
          </button>
        ))}
      </div>

      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
        Target rank or score <span className="font-normal text-slate-400">(optional)</span>
      </label>
      <input
        type="text"
        value={answers.targetRank}
        onChange={(e) => update("targetRank", e.target.value)}
        placeholder="e.g. Under 1000 rank, 99 percentile, 650+ marks"
        className="mt-2 w-full px-4 py-3 bg-[#F6F7FB] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-[#A182F9] transition-all"
      />
    </div>
  );
}

// ─── Step: level ─────────────────────────────────────────
function LevelStep({
  answers,
  update,
}: {
  answers: OnboardingAnswers;
  update: <K extends keyof OnboardingAnswers>(k: K, v: OnboardingAnswers[K]) => void;
}) {
  const confidenceLabels = ["Just starting", "A little", "Getting there", "Fairly confident", "Very confident"];
  return (
    <div>
      <StepHeader
        icon={<Brain className="w-6 h-6" />}
        title="Where are you right now?"
        subtitle="An honest starting point helps us calibrate — there are no wrong answers."
      />

      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
        How confident do you feel about this exam?
      </label>
      <div className="mt-3 mb-1">
        <input
          type="range"
          min={1}
          max={5}
          value={answers.confidence}
          onChange={(e) => update("confidence", Number(e.target.value))}
          className="w-full accent-[#A182F9]"
        />
      </div>
      <p className="text-sm font-semibold mb-6" style={{ color: ACCENT }}>
        {confidenceLabels[answers.confidence - 1]}
      </p>

      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
        Have you attempted this exam before?
      </label>
      <div className="grid grid-cols-2 gap-2 mt-2 mb-6">
        {[
          { label: "Yes", val: true },
          { label: "No, first time", val: false },
        ].map((o) => (
          <button
            key={o.label}
            onClick={() => update("attemptedBefore", o.val)}
            className="py-3 rounded-xl border-2 text-sm font-semibold transition-all"
            style={{
              borderColor: answers.attemptedBefore === o.val ? ACCENT : undefined,
              background: answers.attemptedBefore === o.val ? `${ACCENT}12` : undefined,
            }}
          >
            {o.label}
          </button>
        ))}
      </div>

      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Current stage</label>
      <div className="space-y-2 mt-2">
        {CLASS_OPTIONS.map((c) => (
          <OptionButton key={c} active={answers.currentClass === c} onClick={() => update("currentClass", c)}>
            {c}
          </OptionButton>
        ))}
      </div>
    </div>
  );
}

// ─── Step: time ──────────────────────────────────────────
function TimeStep({
  answers,
  update,
}: {
  answers: OnboardingAnswers;
  update: <K extends keyof OnboardingAnswers>(k: K, v: OnboardingAnswers[K]) => void;
}) {
  return (
    <div>
      <StepHeader
        icon={<Clock className="w-6 h-6" />}
        title="How much time can you commit?"
        subtitle="Your plan is built around your real schedule, not an ideal one."
      />

      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Study hours per day</label>
        <span className="text-sm font-bold" style={{ color: ACCENT }}>
          {answers.dailyHours} {answers.dailyHours === 1 ? "hour" : "hours"}
        </span>
      </div>
      <input
        type="range"
        min={1}
        max={12}
        value={answers.dailyHours}
        onChange={(e) => update("dailyHours", Number(e.target.value))}
        className="w-full accent-[#A182F9] mt-3 mb-6"
      />

      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Days per week</label>
        <span className="text-sm font-bold" style={{ color: ACCENT }}>
          {answers.daysPerWeek} days
        </span>
      </div>
      <input
        type="range"
        min={1}
        max={7}
        value={answers.daysPerWeek}
        onChange={(e) => update("daysPerWeek", Number(e.target.value))}
        className="w-full accent-[#A182F9] mt-3 mb-6"
      />

      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
        When do you study best?
      </label>
      <div className="grid grid-cols-2 gap-2 mt-2">
        {TIME_OPTIONS.map((t) => (
          <OptionButton key={t} active={answers.preferredTime === t} onClick={() => update("preferredTime", t)}>
            {t}
          </OptionButton>
        ))}
      </div>
    </div>
  );
}

// ─── Step: subjects ──────────────────────────────────────
function SubjectsStep({
  answers,
  setAnswers,
  exam,
}: {
  answers: OnboardingAnswers;
  setAnswers: React.Dispatch<React.SetStateAction<OnboardingAnswers>>;
  exam: ReturnType<typeof getExamById>;
}) {
  const levels: { val: "strong" | "average" | "weak"; label: string; emoji: string }[] = [
    { val: "strong", label: "Strong", emoji: "💪" },
    { val: "average", label: "Average", emoji: "😐" },
    { val: "weak", label: "Weak", emoji: "🎯" },
  ];

  const setStrength = (subjectId: string, val: "strong" | "average" | "weak") =>
    setAnswers((a) => ({ ...a, subjectStrength: { ...a.subjectStrength, [subjectId]: val } }));

  return (
    <div>
      <StepHeader
        icon={<BookOpen className="w-6 h-6" />}
        title="Rate yourself by subject"
        subtitle="We'll spend more time on weak areas and keep strong ones sharp."
      />
      <div className="space-y-3">
        {exam?.subjects.map((s) => (
          <div key={s.id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
              <span className="mr-1.5">{s.icon}</span>
              {s.name}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {levels.map((lvl) => {
                const active = answers.subjectStrength[s.id] === lvl.val;
                return (
                  <button
                    key={lvl.val}
                    onClick={() => setStrength(s.id, lvl.val)}
                    className="py-2 rounded-lg border-2 text-xs font-semibold transition-all"
                    style={{
                      borderColor: active ? ACCENT : undefined,
                      background: active ? `${ACCENT}12` : undefined,
                    }}
                  >
                    {lvl.emoji} {lvl.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Step: style ─────────────────────────────────────────
function StyleStep({ answers, toggle }: { answers: OnboardingAnswers; toggle: (id: string) => void }) {
  return (
    <div>
      <StepHeader
        icon={<Sparkles className="w-6 h-6" />}
        title="How do you learn best?"
        subtitle="Pick all that apply. Your daily plan will lead with these formats."
      />
      <div className="grid grid-cols-2 gap-2">
        {LEARNING_STYLES.map((ls) => {
          const active = answers.learningStyles.includes(ls.id);
          return (
            <button
              key={ls.id}
              onClick={() => toggle(ls.id)}
              className="px-4 py-4 rounded-xl border-2 text-sm font-semibold transition-all text-left"
              style={{
                borderColor: active ? ACCENT : undefined,
                background: active ? `${ACCENT}12` : undefined,
              }}
            >
              <span className="text-xl block mb-1">{ls.icon}</span>
              <span className={active ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-300"}>
                {ls.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step: habits ────────────────────────────────────────
function HabitsStep({ answers, toggle }: { answers: OnboardingAnswers; toggle: (id: string) => void }) {
  return (
    <div>
      <StepHeader
        icon={<Brain className="w-6 h-6" />}
        title="What gets in your way?"
        subtitle="Optional — but naming your struggles lets your AI coach build guardrails."
      />
      <div className="space-y-2">
        {HABITS.map((h) => (
          <OptionButton key={h.id} active={answers.habits.includes(h.id)} onClick={() => toggle(h.id)}>
            {h.label}
          </OptionButton>
        ))}
      </div>
    </div>
  );
}

// ─── Processing screen ───────────────────────────────────
function ProcessingScreen({ name }: { name?: string }) {
  const messages = [
    "Analyzing your goal and timeline…",
    "Mapping your strong and weak subjects…",
    "Matching your learning style…",
    "Designing your daily missions…",
    "Finalizing your success plan…",
  ];
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setMsgIndex((i) => (i < messages.length - 1 ? i + 1 : i)), 500);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col items-center justify-center px-6 text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8"
        style={{ background: `${ACCENT}1A` }}
      >
        <Sparkles className="w-8 h-8" style={{ color: ACCENT }} />
      </motion.div>
      <h1
        className="text-2xl font-bold text-slate-900 dark:text-white"
        style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.02em" }}
      >
        {name ? `Building ${name}'s success plan…` : "Building your success plan…"}
      </h1>
      <AnimatePresence mode="wait">
        <motion.p
          key={msgIndex}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="text-[15px] text-slate-500 dark:text-slate-400 mt-3 h-6"
        >
          {messages[msgIndex]}
        </motion.p>
      </AnimatePresence>
      <div className="w-full max-w-xs h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-8">
        <motion.div
          className="h-full rounded-full"
          style={{ background: ACCENT }}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2.6, ease: "easeInOut" }}
        />
      </div>
      <div className="mt-8 flex items-center gap-2 text-xs text-slate-400">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        This takes just a moment
      </div>
    </div>
  );
}
