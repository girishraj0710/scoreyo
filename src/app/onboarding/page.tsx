"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  Check,
  Target,
  Clock,
  BookOpen,
  Sparkles,
  Brain,
  Sunrise,
  Sun,
  Sunset,
  Moon,
  Video,
  FileText,
  PenLine,
  Layers,
  Bot,
  BarChart3,
  Globe,
} from "lucide-react";
import { examCategories, getExamById, type ExamCategory } from "@/lib/exams";
import { ColorfulCategoryIcon, ColorfulExamIcon, ColorfulSubjectIcon } from "@/lib/colorful-exam-icons";
import { getHeadersWithCsrf } from "@/lib/csrf-client";
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
const TIME_OPTIONS = [
  { id: "Early morning", label: "Early morning", Icon: Sunrise },
  { id: "Daytime", label: "Daytime", Icon: Sun },
  { id: "Evening", label: "Evening", Icon: Sunset },
  { id: "Late night", label: "Late night", Icon: Moon },
];

const LEARNING_STYLES = [
  { id: "videos", label: "Video lessons", Icon: Video },
  { id: "reading", label: "Reading notes", Icon: FileText },
  { id: "practice", label: "Practice questions", Icon: PenLine },
  { id: "flashcards", label: "Flashcards", Icon: Layers },
  { id: "ai-tutor", label: "AI tutor chat", Icon: Bot },
  { id: "diagrams", label: "Diagrams & visuals", Icon: BarChart3 },
  { id: "real-world", label: "Real-world examples", Icon: Globe },
];

const HABITS = [
  { id: "procrastinate", label: "I procrastinate a lot" },
  { id: "forget", label: "I forget concepts quickly" },
  { id: "run-out-of-time", label: "I run out of time in tests" },
  { id: "silly-mistakes", label: "I make silly mistakes" },
  { id: "lose-focus", label: "I lose focus while studying" },
  { id: "skip-revision", label: "I skip revision" },
];

// Premium accent palette
const ACCENT = "#7C5CFC";
const ACCENT_GRADIENT = "linear-gradient(135deg, #8B6DFF 0%, #6C47F5 100%)";

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
        headers: getHeadersWithCsrf(),
        body: JSON.stringify({ examId: answers.examId, profile: answers }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Failed to save");
      }

      // Kick off study-plan generation. Non-blocking for UX: even if it fails,
      // onboarding is complete and the home page can generate lazily.
      fetch("/api/study-plan/generate", {
        method: "POST",
        headers: getHeadersWithCsrf(),
      }).catch(() => {});

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

  // Exam step gets a wide canvas (multi-column grid, less scroll); every other
  // step is a narrow single column that fits the viewport without scrolling.
  const isExamStep = step === "exam";
  const shellWidth = isExamStep ? "max-w-4xl" : "max-w-xl";

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#FAFAFE] dark:bg-[#0A0A12]">
      {/* Ambient premium background wash */}
      <div
        className="pointer-events-none fixed inset-0 -z-0"
        style={{
          background:
            "radial-gradient(60% 45% at 50% -5%, rgba(124,92,252,0.12) 0%, rgba(124,92,252,0) 60%)",
        }}
      />

      {/* Progress bar */}
      <div className="shrink-0 z-20 backdrop-blur-xl bg-white/70 dark:bg-[#0A0A12]/70 border-b border-slate-200/60 dark:border-white/5">
        <div className={`${shellWidth} mx-auto px-6 py-4`}>
          <div className="flex items-center gap-3">
            {stepIndex > 0 ? (
              <button
                onClick={goBack}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                aria-label="Back"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            ) : (
              <div className="w-8" />
            )}
            <div className="flex-1 h-1.5 bg-slate-200/70 dark:bg-white/8 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: ACCENT_GRADIENT }}
                initial={false}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <span className="text-xs font-semibold text-slate-400 tabular-nums w-9 text-right">
              {stepIndex + 1}/{totalSteps}
            </span>
          </div>
        </div>
      </div>

      {/* Step content — scrolls internally only when the content genuinely
          overflows (i.e. the wide exam grid); short steps stay centered. */}
      <div
        className={`relative flex-1 min-h-0 overflow-y-auto ${
          isExamStep ? "" : "flex items-center"
        }`}
      >
        <div className={`${shellWidth} w-full mx-auto px-6 py-8`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
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
          <div className="mt-6 p-3.5 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/40 rounded-xl text-sm text-red-700 dark:text-red-400">
            {error}
          </div>
        )}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="shrink-0 z-20 backdrop-blur-xl bg-white/70 dark:bg-[#0A0A12]/70 border-t border-slate-200/60 dark:border-white/5">
        <div className={`${shellWidth} mx-auto px-6 py-4`}>
          <button
            onClick={goNext}
            disabled={!canContinue}
            className="group w-full py-4 text-white text-base font-bold rounded-2xl transition-all shadow-[0_10px_30px_-8px_rgba(124,92,252,0.5)] hover:shadow-[0_14px_40px_-8px_rgba(124,92,252,0.6)] active:scale-[0.985] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
            style={{ background: ACCENT_GRADIENT }}
          >
            {stepIndex === totalSteps - 1 ? "Build my plan" : "Continue"}
            <ChevronRight className="w-4.5 h-4.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Reusable presentational bits ────────────────────────

function StepHeader({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="mb-6">
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-white shadow-[0_10px_24px_-8px_rgba(124,92,252,0.6)]"
        style={{ background: ACCENT_GRADIENT }}
      >
        {icon}
      </div>
      <h1
        className="text-[26px] leading-tight font-bold text-slate-900 dark:text-white"
        style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.03em" }}
      >
        {title}
      </h1>
      <p className="text-[14.5px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">{subtitle}</p>
    </div>
  );
}

// Full-width row option with premium selected state (used for lists).
function PillOption({
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
      className="w-full text-left px-4 py-3.5 rounded-2xl border text-sm font-medium transition-all flex items-center justify-between gap-2"
      style={{
        borderColor: active ? ACCENT : "rgba(148,163,184,0.28)",
        background: active ? "rgba(124,92,252,0.08)" : "transparent",
        boxShadow: active ? "0 0 0 3px rgba(124,92,252,0.12)" : undefined,
      }}
    >
      <span className={active ? "text-slate-900 dark:text-white font-semibold" : "text-slate-600 dark:text-slate-300"}>
        {children}
      </span>
      <span
        className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all"
        style={{
          background: active ? ACCENT : "transparent",
          border: active ? "none" : "1.5px solid rgba(148,163,184,0.4)",
        }}
      >
        {active && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
      </span>
    </button>
  );
}

// Premium, clearly-visible range slider (custom track + filled progress + thumb).
function PremiumSlider({
  min,
  max,
  value,
  onChange,
}: {
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="relative h-9 flex items-center">
      {/* Track */}
      <div className="absolute inset-x-0 h-2.5 rounded-full bg-slate-200 dark:bg-white/10" />
      {/* Filled progress */}
      <div
        className="absolute h-2.5 rounded-full"
        style={{ width: `${pct}%`, background: ACCENT_GRADIENT }}
      />
      {/* Thumb */}
      <div
        className="absolute w-6 h-6 rounded-full bg-white border-[3px] shadow-[0_4px_12px_-2px_rgba(124,92,252,0.6)] -translate-x-1/2 pointer-events-none"
        style={{ left: `${pct}%`, borderColor: ACCENT }}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="relative w-full h-9 appearance-none bg-transparent cursor-pointer m-0 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-transparent"
      />
    </div>
  );
}

// Compact segmented / grid choice (year, days, yes-no).
function SegOption({
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
      className="py-3.5 rounded-xl border text-sm font-bold transition-all"
      style={{
        borderColor: active ? ACCENT : "rgba(148,163,184,0.28)",
        background: active ? "rgba(124,92,252,0.08)" : "transparent",
        color: active ? ACCENT : undefined,
        boxShadow: active ? "0 0 0 3px rgba(124,92,252,0.12)" : undefined,
      }}
    >
      {children}
    </button>
  );
}

// ─── Step: exam (two-screen drill-down) ──────────────────
function ExamStep({
  answers,
  update,
}: {
  answers: OnboardingAnswers;
  update: <K extends keyof OnboardingAnswers>(k: K, v: OnboardingAnswers[K]) => void;
}) {
  const preselCategory = answers.examId ? getExamById(answers.examId)?.category : undefined;
  const [activeCatId, setActiveCatId] = useState<string | null>(preselCategory ?? null);
  const activeCat: ExamCategory | undefined = activeCatId
    ? examCategories.find((c) => c.id === activeCatId)
    : undefined;

  // ── Sub-screen: exams within a chosen category ──
  if (activeCat) {
    return (
      <div>
        <button
          onClick={() => setActiveCatId(null)}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white mb-5 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          All fields
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/5 border border-slate-200/70 dark:border-white/10 flex items-center justify-center shadow-sm">
            <ColorfulCategoryIcon categoryId={activeCat.id} size={30} />
          </div>
          <div>
            <h1
              className="text-[22px] font-bold text-slate-900 dark:text-white leading-tight"
              style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.02em" }}
            >
              {activeCat.name}
            </h1>
            <p className="text-[13px] text-slate-400">Pick your exam</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {activeCat.exams.map((exam) => {
            const active = answers.examId === exam.id;
            return (
              <button
                key={exam.id}
                onClick={() => update("examId", exam.id)}
                className="relative flex flex-col items-center text-center gap-2 px-3 py-4 rounded-2xl border transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-14px_rgba(15,23,42,0.3)]"
                style={{
                  borderColor: active ? ACCENT : "rgba(148,163,184,0.24)",
                  background: active ? "rgba(124,92,252,0.08)" : "transparent",
                  boxShadow: active ? "0 0 0 3px rgba(124,92,252,0.12)" : undefined,
                }}
              >
                {active && (
                  <span
                    className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: ACCENT }}
                  >
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </span>
                )}
                <ColorfulExamIcon examId={exam.id} size={40} />
                <span
                  className={`text-[13px] font-semibold leading-tight ${
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
    );
  }

  // ── Main screen: category grid ──
  return (
    <div>
      <StepHeader
        icon={<Target className="w-7 h-7" />}
        title="Which field are you preparing for?"
        subtitle="Choose your area, then pick your exam. Scoreyo tailors everything to it — you can change it later in settings."
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {examCategories.map((cat) => {
          const hasSelected = cat.exams.some((e) => e.id === answers.examId);
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCatId(cat.id)}
              className="relative flex flex-col items-start gap-3 p-4 rounded-2xl border bg-white dark:bg-white/[0.03] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-12px_rgba(15,23,42,0.25)]"
              style={{
                borderColor: hasSelected ? ACCENT : "rgba(148,163,184,0.2)",
                boxShadow: hasSelected ? "0 0 0 3px rgba(124,92,252,0.12)" : undefined,
              }}
            >
              <div className="w-11 h-11 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center">
                <ColorfulCategoryIcon categoryId={cat.id} size={28} />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                  {cat.name}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {cat.exams.length} {cat.exams.length === 1 ? "exam" : "exams"}
                </p>
              </div>
              <ChevronRight className="absolute top-4 right-3 w-4 h-4 text-slate-300 dark:text-slate-600" />
            </button>
          );
        })}
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
        icon={<Target className="w-7 h-7" />}
        title="What's your target?"
        subtitle="This sets the countdown and the intensity of your daily plan."
      />
      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Target exam year</label>
      <div className="grid grid-cols-4 gap-2.5 mt-2.5 mb-7">
        {YEAR_OPTIONS.map((y) => (
          <SegOption key={y} active={answers.targetYear === y} onClick={() => update("targetYear", y)}>
            {y}
          </SegOption>
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
        className="mt-2.5 w-full px-4 py-3.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-purple-500/12 focus:border-[#7C5CFC] transition-all"
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
        icon={<Brain className="w-7 h-7" />}
        title="Where are you right now?"
        subtitle="An honest starting point helps us calibrate — there are no wrong answers."
      />

      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          How confident do you feel about this exam?
        </label>
        <span className="text-sm font-bold" style={{ color: ACCENT }}>
          {confidenceLabels[answers.confidence - 1]}
        </span>
      </div>
      <div className="mt-3 mb-6">
        <PremiumSlider
          min={1}
          max={5}
          value={answers.confidence}
          onChange={(v) => update("confidence", v)}
        />
      </div>

      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
        Have you attempted this exam before?
      </label>
      <div className="grid grid-cols-2 gap-2.5 mt-2.5 mb-6">
        {[
          { label: "Yes", val: true },
          { label: "No, first time", val: false },
        ].map((o) => (
          <SegOption
            key={o.label}
            active={answers.attemptedBefore === o.val}
            onClick={() => update("attemptedBefore", o.val)}
          >
            {o.label}
          </SegOption>
        ))}
      </div>

      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Current stage</label>
      <div className="flex flex-wrap gap-2.5 mt-2.5">
        {CLASS_OPTIONS.map((c) => {
          const active = answers.currentClass === c;
          return (
            <button
              key={c}
              onClick={() => update("currentClass", c)}
              className="px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all"
              style={{
                borderColor: active ? ACCENT : "rgba(148,163,184,0.28)",
                background: active ? "rgba(124,92,252,0.08)" : "transparent",
                color: active ? ACCENT : undefined,
                boxShadow: active ? "0 0 0 3px rgba(124,92,252,0.12)" : undefined,
              }}
            >
              {c}
            </button>
          );
        })}
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
        icon={<Clock className="w-7 h-7" />}
        title="How much time can you commit?"
        subtitle="Your plan is built around your real schedule, not an ideal one."
      />

      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Study hours per day</label>
        <span className="text-sm font-bold" style={{ color: ACCENT }}>
          {answers.dailyHours} {answers.dailyHours === 1 ? "hour" : "hours"}
        </span>
      </div>
      <div className="mt-3 mb-6">
        <PremiumSlider min={1} max={12} value={answers.dailyHours} onChange={(v) => update("dailyHours", v)} />
      </div>

      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Days per week</label>
        <span className="text-sm font-bold" style={{ color: ACCENT }}>
          {answers.daysPerWeek} days
        </span>
      </div>
      <div className="mt-3 mb-6">
        <PremiumSlider min={1} max={7} value={answers.daysPerWeek} onChange={(v) => update("daysPerWeek", v)} />
      </div>

      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
        When do you study best?
      </label>
      <div className="grid grid-cols-2 gap-2.5 mt-2.5">
        {TIME_OPTIONS.map((t) => {
          const active = answers.preferredTime === t.id;
          return (
            <button
              key={t.id}
              onClick={() => update("preferredTime", t.id)}
              className="flex items-center gap-2.5 px-4 py-3.5 rounded-2xl border text-sm font-semibold transition-all"
              style={{
                borderColor: active ? ACCENT : "rgba(148,163,184,0.28)",
                background: active ? "rgba(124,92,252,0.08)" : "transparent",
                boxShadow: active ? "0 0 0 3px rgba(124,92,252,0.12)" : undefined,
              }}
            >
              <t.Icon className="w-5 h-5" style={{ color: active ? ACCENT : "#94A3B8" }} />
              <span className={active ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-300"}>
                {t.label}
              </span>
            </button>
          );
        })}
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
  const levels: { val: "strong" | "average" | "weak"; label: string; dot: string }[] = [
    { val: "strong", label: "Strong", dot: "#22C55E" },
    { val: "average", label: "Average", dot: "#F59E0B" },
    { val: "weak", label: "Weak", dot: "#EF4444" },
  ];

  const setStrength = (subjectId: string, val: "strong" | "average" | "weak") =>
    setAnswers((a) => ({ ...a, subjectStrength: { ...a.subjectStrength, [subjectId]: val } }));

  return (
    <div>
      <StepHeader
        icon={<BookOpen className="w-7 h-7" />}
        title="Rate yourself by subject"
        subtitle="We'll spend more time on weak areas and keep strong ones sharp."
      />
      <div className="space-y-3">
        {exam?.subjects.map((s) => (
          <div
            key={s.id}
            className="p-3.5 rounded-2xl border border-slate-200/70 dark:border-white/8 bg-white dark:bg-white/[0.03]"
          >
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2.5 flex items-center gap-2">
              <ColorfulSubjectIcon subjectId={s.id} size={22} />
              {s.name}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {levels.map((lvl) => {
                const active = answers.subjectStrength[s.id] === lvl.val;
                return (
                  <button
                    key={lvl.val}
                    onClick={() => setStrength(s.id, lvl.val)}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-bold transition-all"
                    style={{
                      borderColor: active ? ACCENT : "rgba(148,163,184,0.24)",
                      background: active ? "rgba(124,92,252,0.08)" : "transparent",
                      color: active ? ACCENT : undefined,
                      boxShadow: active ? "0 0 0 3px rgba(124,92,252,0.12)" : undefined,
                    }}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ background: lvl.dot }} />
                    {lvl.label}
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
        icon={<Sparkles className="w-7 h-7" />}
        title="How do you learn best?"
        subtitle="Pick all that apply. Your daily plan will lead with these formats."
      />
      <div className="grid grid-cols-2 gap-2.5">
        {LEARNING_STYLES.map((ls) => {
          const active = answers.learningStyles.includes(ls.id);
          return (
            <button
              key={ls.id}
              onClick={() => toggle(ls.id)}
              className="relative px-4 py-4 rounded-2xl border text-sm font-semibold transition-all text-left"
              style={{
                borderColor: active ? ACCENT : "rgba(148,163,184,0.24)",
                background: active ? "rgba(124,92,252,0.08)" : "transparent",
                boxShadow: active ? "0 0 0 3px rgba(124,92,252,0.12)" : undefined,
              }}
            >
              {active && (
                <span
                  className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: ACCENT }}
                >
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </span>
              )}
              <ls.Icon className="w-6 h-6 mb-2" style={{ color: active ? ACCENT : "#94A3B8" }} />
              <span className={`block ${active ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-300"}`}>
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
        icon={<Brain className="w-7 h-7" />}
        title="What gets in your way?"
        subtitle="Optional — but naming your struggles lets your AI coach build guardrails."
      />
      <div className="space-y-2.5">
        {HABITS.map((h) => (
          <PillOption key={h.id} active={answers.habits.includes(h.id)} onClick={() => toggle(h.id)}>
            {h.label}
          </PillOption>
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
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-[#FAFAFE] dark:bg-[#0A0A12]">
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(50% 40% at 50% 40%, rgba(124,92,252,0.14) 0%, rgba(124,92,252,0) 60%)",
        }}
      />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="relative w-20 h-20 rounded-3xl flex items-center justify-center mb-8 text-white shadow-[0_16px_40px_-10px_rgba(124,92,252,0.6)]"
        style={{ background: ACCENT_GRADIENT }}
      >
        <Sparkles className="w-9 h-9" />
      </motion.div>
      <h1
        className="relative text-[26px] font-bold text-slate-900 dark:text-white"
        style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.03em" }}
      >
        {name ? `Building ${name}'s success plan…` : "Building your success plan…"}
      </h1>
      <AnimatePresence mode="wait">
        <motion.p
          key={msgIndex}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="relative text-[15px] text-slate-500 dark:text-slate-400 mt-3 h-6"
        >
          {messages[msgIndex]}
        </motion.p>
      </AnimatePresence>
      <div className="relative w-full max-w-xs h-1.5 bg-slate-200/70 dark:bg-white/8 rounded-full overflow-hidden mt-8">
        <motion.div
          className="h-full rounded-full"
          style={{ background: ACCENT_GRADIENT }}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2.6, ease: "easeInOut" }}
        />
      </div>
      <div className="relative mt-8 flex items-center gap-2 text-xs text-slate-400">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        This takes just a moment
      </div>
    </div>
  );
}
