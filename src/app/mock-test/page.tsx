"use client";
// VERSION: SALESFORCE-BLUE-2026-06-01-v2

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/user-context";
import { useLocale } from "@/context/locale-context";
import { getExamById } from "@/lib/exams";
import { FileText, Sparkles } from "lucide-react";
import { ColorfulExamIcon } from "@/lib/colorful-exam-icons";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { getHeadersWithCsrf } from "@/lib/csrf-client";
import { AccessibilityWrapper } from "@/components/accessibility-wrapper";
import { sounds } from "@/lib/sounds";
import { useExamFilter } from "@/hooks/use-exam-filter";

// Dynamic import: Only load builder when user clicks "Create Custom Test"
const CustomMockTestBuilder = dynamic(
  () => import("@/components/custom-mock-test-builder").then((mod) => ({ default: mod.CustomMockTestBuilder })),
  { loading: () => <LoadingSkeleton type="card" /> }
);

interface MockTestConfig {
  examId: string;
  examName: string;
  testNumber: number;
  totalQuestions: number;
  timeLimitMinutes: number;
  sections: { subjectId: string; subjectName: string; questionCount: number }[];
}

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: string;
  subjectId: string;
  subjectName: string;
}

type PageState = "select" | "instructions" | "loading" | "test" | "results" | "pro-required";
type TestType = "short" | "full";

export default function MockTestPage() {
  const { user, setShowLoginModal, isLoading: userLoading } = useUser();
  const { t } = useLocale();
  const router = useRouter();
  const examFilter = useExamFilter(); // Single-exam-focus

  // Redirect ONLY contributors (not admin) to contributor portal
  useEffect(() => {
    if (!userLoading && user && user.role === 'contributor') {
      router.push('/contributor');
    }
  }, [user, userLoading, router]);

  const [pageState, setPageState] = useState<PageState>("select");
  const [testType, setTestType] = useState<TestType>("short");
  const [configs, setConfigs] = useState<MockTestConfig[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoadingConfigs, setIsLoadingConfigs] = useState(true);
  const [showCustomBuilder, setShowCustomBuilder] = useState(false);

  // Test state
  const [testId, setTestId] = useState("");
  const [examName, setExamName] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timeLimitSeconds, setTimeLimitSeconds] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [currentSection, setCurrentSection] = useState<string>("all");

  // Instructions page state
  const [instructionsExamId, setInstructionsExamId] = useState("");
  const [instructionsTestNumber, setInstructionsTestNumber] = useState(1);
  const [instructionsIsFullLength, setInstructionsIsFullLength] = useState(false);
  const [isGeneratingInBackground, setIsGeneratingInBackground] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Exit confirmation modal state
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);

  // Add global click listener to detect header clicks when in test or loading
  useEffect(() => {
    if (pageState !== "test" && pageState !== "loading") return;

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if click is on Mock Test link in header
      const isMockTestLink = target.closest('a[href="/mock-test"]') || target.closest('a[href^="/mock-test"]');

      if (isMockTestLink) {
        e.preventDefault();
        e.stopPropagation();
        setShowExitConfirmation(true);
      }
    };

    document.addEventListener('click', handleGlobalClick, true);
    return () => document.removeEventListener('click', handleGlobalClick, true);
  }, [pageState]);

  // Load configs and history
  useEffect(() => {
    if (!user) {
      setIsLoadingConfigs(false);
      return;
    }
    async function load() {
      try {
        const [configsRes, historyRes] = await Promise.all([
          fetch("/api/mock-test?action=configs"),
          fetch("/api/mock-test"),
        ]);
        if (configsRes.ok) {
          const data = await configsRes.json();
          setConfigs(data.configs);
        }
        if (historyRes.ok) {
          const data = await historyRes.json();
          setHistory(data.history || []);
        }
      } catch {
        // ignore
      } finally {
        setIsLoadingConfigs(false);
      }
    }
    load();
  }, [user]);


  // Convert short test config to full-length (multiply questions by 3x, time by 2.5x)
  const getFullLengthConfig = (shortConfig: MockTestConfig): MockTestConfig => {
    return {
      ...shortConfig,
      totalQuestions: shortConfig.totalQuestions * 3,
      timeLimitMinutes: Math.round(shortConfig.timeLimitMinutes * 2.5),
      sections: shortConfig.sections.map(s => ({
        ...s,
        questionCount: s.questionCount * 3,
      })),
    };
  };

  // Display configs based on test type
  const displayConfigs = useMemo(() => {
    // Transform configs based on test type
    if (testType === "full") {
      return configs.map(getFullLengthConfig);
    }
    return configs;
  }, [configs, testType]);

  // Flatten configs - each test as a separate card (with single-exam-focus filtering)
  const flattenedConfigs = useMemo(() => {
    // Filter configs by exam if user is not admin
    const filteredConfigs = examFilter
      ? displayConfigs.filter(config => config.examId === examFilter)
      : displayConfigs;

    // Sort by exam name, then test number
    return filteredConfigs.sort((a, b) => {
      if (a.examName !== b.examName) {
        return a.examName.localeCompare(b.examName);
      }
      return a.testNumber - b.testNumber;
    });
  }, [displayConfigs, examFilter]);

  // Countdown timer
  useEffect(() => {
    if (pageState !== "test" || timeRemaining <= 0) return;
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [pageState, timeRemaining]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  async function startTest(examId: string, testNumber: number = 1, isFullLength: boolean = false) {
    // Show instructions page first
    setInstructionsExamId(examId);
    setInstructionsTestNumber(testNumber);
    setInstructionsIsFullLength(isFullLength);
    const exam = getExamById(examId);
    setExamName(exam?.name || examId);
    setPageState("instructions");
    setIsGeneratingInBackground(true);
    setGenerationError(null);

    // Start generating test in background
    try {
      const res = await fetch("/api/mock-test", {
        method: "POST",
        headers: getHeadersWithCsrf(),
        body: JSON.stringify({ examId, testNumber, isFullLength }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.proRequired) {
          setPageState("pro-required");
          setIsGeneratingInBackground(false);
          return;
        }
        setGenerationError(data.error || "Failed to generate test");
        setIsGeneratingInBackground(false);
        return;
      }

      // Store generated test data
      setTestId(data.testId);
      setQuestions(data.questions);
      setAnswers(new Array(data.questions.length).fill(null));
      setTimeLimitSeconds(data.timeLimitSeconds);
      setTimeRemaining(data.timeLimitSeconds);
      setCurrentQuestion(0);
      setIsGeneratingInBackground(false);
    } catch {
      setGenerationError("Something went wrong. Please try again.");
      setIsGeneratingInBackground(false);
    }
  }

  function startTestFromInstructions() {
    if (isGeneratingInBackground) {
      // Still generating, show loading state
      setPageState("loading");
    } else if (generationError) {
      // Generation failed, go back
      alert(generationError);
      setPageState("select");
    } else {
      // Test ready, start immediately
      setPageState("test");
    }
  }

  async function startCustomTest(config: {
    examId: string;
    examName: string;
    sections: any[];
    timeLimitMinutes: number;
    totalQuestions: number;
  }) {
    setShowCustomBuilder(false);
    setPageState("loading");
    try {
      const res = await fetch("/api/mock-test", {
        method: "POST",
        headers: getHeadersWithCsrf(),
        body: JSON.stringify({
          action: "create-custom",
          customConfig: config,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.proRequired) {
          setPageState("pro-required");
          return;
        }
        alert(data.error || "Failed to start custom test");
        setPageState("select");
        return;
      }

      setTestId(data.testId);
      setExamName(data.examName);
      setQuestions(data.questions);
      setAnswers(new Array(data.questions.length).fill(null));
      setTimeLimitSeconds(data.timeLimitSeconds);
      setTimeRemaining(data.timeLimitSeconds);
      setCurrentQuestion(0);
      setPageState("test");
    } catch {
      alert("Something went wrong. Please try again.");
      setPageState("select");
    }
  }

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const timeTaken = timeLimitSeconds - timeRemaining;
      const res = await fetch("/api/mock-test", {
        method: "PUT",
        headers: getHeadersWithCsrf(),
        body: JSON.stringify({ testId, answers, timeTaken }),
      });
      const data = await res.json();
      if (res.ok) {
        setResults(data);
        setPageState("results");
        sounds.submit();
      } else {
        alert(data.error || "Failed to submit test");
      }
    } catch {
      alert("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }, [testId, answers, timeLimitSeconds, timeRemaining, isSubmitting]);

  // Pro required screen
  if (pageState === "pro-required") {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="rounded-2xl p-12 shadow-lg border border-amber-200" style={{ background: "var(--card-bg)" }}>
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-amber-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2" style={{ color: "var(--foreground)" }}>{t("mockTestProOnly")}</h2>
          <p className="mb-6" style={{ color: "var(--muted)" }}>{t("mockTestProDesc")}</p>
          <div className="flex gap-3 justify-center">
            <a href="/pricing" className="px-6 py-3 text-white font-semibold rounded-xl shadow-lg"
            style={{
              backgroundColor: '#16213E',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1a2744';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#16213E';
            }}>
              {t("upgradeToPro")}
            </a>
            <button onClick={() => setPageState("select")} className="px-6 py-3 font-medium rounded-xl" style={{ background: "var(--hover-bg)", color: "var(--foreground-secondary)" }}>
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Instructions screen
  if (pageState === "instructions") {
    const exam = getExamById(instructionsExamId);
    const config = configs.find(c => c.examId === instructionsExamId && c.testNumber === instructionsTestNumber);

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-2xl shadow-lg overflow-hidden" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", borderWidth: "1px", borderStyle: "solid" }}>
          {/* Header */}
          <div className="p-6 text-white"
            style={{
              backgroundColor: '#16213E',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1a2744';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#16213E';
            }}>
            <div className="flex items-center gap-3 mb-2">
              {exam && <ColorfulExamIcon examId={exam.id} size={64} className="text-white" />}
              <h1 className="text-2xl font-bold">{examName}</h1>
            </div>
            <p className="text-white/90">
              {instructionsIsFullLength ? "Full Length" : "Short"} Mock Test {instructionsTestNumber}
            </p>
            {config && (
              <div className="mt-4 flex gap-4 text-sm">
                <span className="bg-white/20 px-3 py-1 rounded-full">
                  📝 {config.totalQuestions} Questions
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-full">
                  ⏱️ {config.timeLimitMinutes} Minutes
                </span>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="p-8">
            <h2 className="text-xl font-bold mb-4" style={{ color: "var(--foreground)" }}>📋 General Instructions</h2>

            <div className="space-y-4" style={{ color: "var(--foreground-secondary)" }}>
              <div className="border rounded-lg p-4" style={{ background: "var(--primary-bg)", borderColor: "rgba(251, 146, 60, 0.3)" }}>
                <p className="font-semibold" style={{ color: "#fb923c" }}>⏰ Timer Rules</p>
                <p className="text-sm mt-1">The countdown timer will display the remaining time. When the timer reaches zero, the test will end automatically. You don't need to manually submit.</p>
              </div>

              <div>
                <p className="font-semibold mb-2">📊 Question Status Indicators:</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 border-2 rounded" style={{ borderColor: "var(--card-border)" }}></span>
                    <span>Not visited yet</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 border-2 rounded" style={{ background: "rgba(239, 68, 68, 0.1)", borderColor: "#dc2626" }}></span>
                    <span>Not answered</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 border-2 rounded" style={{ background: "rgba(16, 185, 129, 0.1)", borderColor: "#10b981" }}></span>
                    <span>Answered</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="font-semibold mb-2">🎯 Answering Questions:</p>
                <ul className="space-y-1 text-sm list-disc list-inside">
                  <li>Choose one answer from 4 options (A, B, C, D)</li>
                  <li>Click on an option to select it</li>
                  <li>You can change your answer anytime before submitting</li>
                  <li>Use Previous/Next buttons to navigate between questions</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4" style={{ background: "var(--primary-bg)", borderColor: "rgba(66, 85, 255, 0.3)" }}>
                <p className="font-semibold" style={{ color: "#E76F51" }}>💡 Pro Tips:</p>
                <ul className="text-sm mt-2 space-y-1 list-disc list-inside">
                  <li>Attempt all questions - there's no negative marking</li>
                  <li>Manage your time wisely across all questions</li>
                  <li>Use the question palette to track your progress</li>
                  <li>Review your answers before final submission</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 flex items-center justify-between border-t" style={{ background: "var(--hover-bg)", borderColor: "var(--card-border)" }}>
            <button
              onClick={() => setPageState("select")}
              className="px-6 py-2 rounded-lg transition-colors"
              style={{ color: "var(--foreground-secondary)", borderColor: "var(--card-border)", borderWidth: "1px", borderStyle: "solid" }}
            >
              ← Back
            </button>

            <div className="flex items-center gap-4">
              {isGeneratingInBackground && (
                <div className="flex items-center gap-2 text-sm [#E76F51]">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Preparing test...</span>
                </div>
              )}

              <button
                onClick={startTestFromInstructions}
                disabled={isGeneratingInBackground}
                className="px-8 py-3 text-white font-bold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            style={{
              backgroundColor: '#16213E',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1a2744';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#16213E';
            }}
              >
                {isGeneratingInBackground ? "Please wait..." : "Start Test →"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading screen
  if (pageState === "loading") {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="rounded-2xl p-12 shadow-lg" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", borderWidth: "1px", borderStyle: "solid" }}>
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#FEF5F3] flex items-center justify-center">
            <svg className="animate-spin h-8 w-8" style={{ color: "var(--primary)" }} viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2" style={{ color: "var(--foreground)" }}>{t("preparingMockTest")}</h2>
          <p className="mb-6" style={{ color: "var(--muted)" }}>{t("preparingMockTestDesc")}</p>
          <button
            onClick={() => {
              setPageState("select");
              setQuestions([]);
              setAnswers([]);
            }}
            className="px-6 py-2 text-sm rounded-lg transition-colors"
            style={{ color: "var(--foreground-secondary)", borderColor: "var(--card-border)", borderWidth: "1px", borderStyle: "solid" }}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // Results screen (keep existing results screen - lines 245-350 from original)
  if (pageState === "results" && results) {
    const percentage = results.accuracy;
    const grade =
      percentage >= 90 ? { label: t("excellent"), color: "text-slate-500", bg: "bg-slate-50", style: { background: "var(--primary-bg)", color: "var(--foreground-secondary)" } }
      : percentage >= 70 ? { label: t("goodJob"), color: "[#E76F51]", bg: "bg-slate-50", style: { background: "var(--primary-bg)", color: "#E76F51" } }
      : percentage >= 50 ? { label: t("keepPracticing"), color: "text-amber-600", bg: "bg-amber-50", style: { background: "var(--primary-bg)", color: "#d97706" } }
      : { label: t("needsImprovement"), color: "text-red-600", bg: "bg-red-50", style: { background: "var(--primary-bg)", color: "#dc2626" } };

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Score Card */}
        <div className="rounded-2xl p-8 shadow-lg text-center mb-8" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", borderWidth: "1px", borderStyle: "solid" }}>
          <div className="text-sm font-medium mb-2" style={{ color: "var(--primary)" }}>{t("mockTestResult")}</div>
          <h2 className={`text-2xl font-bold mb-2`} style={grade.style}>{grade.label}</h2>
          <div className="text-6xl font-bold mb-2" style={{ color: "var(--foreground)" }}>{percentage}%</div>
          <p className="mb-6" style={{ color: "var(--muted)" }}>
            {results.correctAnswers} / {results.totalQuestions} {t("correct")} | {t("time")}: {formatTime(results.timeTaken)}
          </p>

          {/* Section-wise breakdown */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-lg mx-auto mb-6">
            {Object.entries(results.sectionResults).map(([subjectId, data]: [string, any]) => {
              const acc = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
              const textColor = acc >= 70 ? "#10b981" : acc >= 50 ? "#d97706" : "#dc2626";
              const borderColor = acc >= 70 ? "var(--card-border)" : acc >= 50 ? "rgba(217, 119, 6, 0.2)" : "rgba(220, 38, 38, 0.2)";
              return (
                <div key={subjectId} className="rounded-xl p-3 border" style={{ background: "var(--primary-bg)", borderColor: borderColor }}>
                  <div className="text-xs" style={{ color: "var(--muted)" }}>{data.subjectName}</div>
                  <div className="text-lg font-bold" style={{ color: textColor }}>
                    {data.correct}/{data.total}
                  </div>
                  <div className="text-xs" style={{ color: "var(--muted)" }}>{acc}%</div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3 justify-center">
            <button onClick={() => { setPageState("select"); setResults(null); }} className="px-6 py-2 text-white rounded-lg font-medium transition-all" style={{ backgroundColor: "#16213E" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#1a2744";
                e.currentTarget.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#16213E";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              {t("takeAnotherTest")}
            </button>
            <a href="/reports" className="px-6 py-2 rounded-lg font-medium transition-all" style={{ background: "var(--hover-bg)", color: "var(--foreground-secondary)" }}>
              {t("viewReports")}
            </a>
          </div>
        </div>

        {/* Question review (keep existing) */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <button
            onClick={() => setCurrentSection("all")}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer ${currentSection === "all" ? "bg-slate-500 text-white" : ""}`}
            style={currentSection !== "all" ? { background: "var(--hover-bg)", color: "var(--foreground-secondary)" } : undefined}
            onMouseEnter={(e) => {
              if (currentSection !== "all") {
                e.currentTarget.style.borderColor = "#a5b4fc";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            All ({results.totalQuestions})
          </button>
          {Object.entries(results.sectionResults).map(([subjectId, data]: [string, any]) => (
            <button
              key={subjectId}
              onClick={() => setCurrentSection(subjectId)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer ${currentSection === subjectId ? "bg-slate-500 text-white" : ""}`}
              style={currentSection !== subjectId ? { background: "var(--hover-bg)", color: "var(--foreground-secondary)" } : undefined}
              onMouseEnter={(e) => {
                if (currentSection !== subjectId) {
                  e.currentTarget.style.borderColor = "#a5b4fc";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {data.subjectName} ({data.correct}/{data.total})
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {results.results
            .filter((r: any) => currentSection === "all" || r.subjectId === currentSection)
            .map((r: any, idx: number) => {
              const globalIdx = results.results.indexOf(r);
              return (
                <div key={globalIdx} className="rounded-xl p-5 border-2" style={{ background: "var(--card-bg)", borderColor: r.isCorrect ? "var(--card-border)" : "rgba(220, 38, 38, 0.3)" }}>
                  <div className="flex items-start gap-3 mb-3">
                    <span className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: r.isCorrect ? "#06b6d4" : "#ef4444" }}>
                      {globalIdx + 1}
                    </span>
                    <div className="flex-1">
                      <span className="text-xs font-medium" style={{ color: "var(--primary)" }}>{r.subjectName}</span>
                      <p className="font-medium mt-1" style={{ color: "var(--foreground)" }}>{r.question}</p>
                    </div>
                  </div>
                  <div className="ml-10 space-y-2">
                    {r.options.map((opt: string, optIdx: number) => {
                      const isCorrect = optIdx === r.correctAnswer;
                      const isUserWrongChoice = optIdx === r.userAnswer && !r.isCorrect;
                      return (
                        <div key={optIdx} className="px-3 py-2 rounded-lg text-sm border transition-colors" style={{
                          background: isCorrect ? "var(--primary-bg)" : isUserWrongChoice ? "var(--primary-bg)" : "var(--card-bg)",
                          borderColor: isCorrect ? "#10b981" : isUserWrongChoice ? "#dc2626" : "var(--card-border)",
                          color: isCorrect ? "#10b981" : isUserWrongChoice ? "#dc2626" : "var(--foreground-secondary)"
                        }}>
                          <span className="font-medium mr-2">{String.fromCharCode(65 + optIdx)}.</span>
                          {opt}
                          {isCorrect && <span className="ml-2 font-medium">({t("correct")})</span>}
                          {isUserWrongChoice && <span className="ml-2 font-medium">({t("yourAnswer")})</span>}
                        </div>
                      );
                    })}
                  </div>
                  {r.explanation && (
                    <div className="ml-10 mt-3 p-3 rounded-lg text-sm" style={{ background: "var(--hover-bg)", color: "var(--foreground-secondary)" }}>
                      <strong>{t("explanation")}:</strong> {r.explanation}
                    </div>
                  )}
                </div>
              );
          })}
        </div>
      </div>
    );
  }

  // Test taking screen (keep existing test screen - lines 354-502 from original)
  if (pageState === "test" && questions.length > 0) {
    const question = questions[currentQuestion];
    const answeredCount = answers.filter((a) => a !== null).length;
    const isLowTime = timeRemaining < 300;
    const isCriticalTime = timeRemaining < 60;

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Back Button */}
        <button
          onClick={() => setShowExitConfirmation(true)}
          className="flex items-center gap-2 mb-4 transition-colors"
          style={{ color: "var(--foreground-secondary)" }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">Exit Test</span>
        </button>

        {/* Sticky header */}
        <div className="rounded-xl p-4 shadow-sm mb-4 sticky top-16 z-40" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", borderWidth: "1px", borderStyle: "solid" }}>
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-sm font-semibold" style={{ color: "var(--primary)" }}>{examName}</span>
              <span className="mx-2" style={{ color: "var(--card-border)" }}>|</span>
              <span className="text-sm" style={{ color: "var(--muted)" }}>{t("mockTest")}</span>
            </div>
            <div className="text-lg font-mono font-bold px-4 py-1 rounded-lg" style={isCriticalTime ? { background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", animation: "pulse 2s infinite" } : isLowTime ? { background: "rgba(251, 146, 60, 0.1)", color: "#fb923c" } : { background: "var(--hover-bg)", color: "var(--foreground-secondary)" }}>
              {formatTime(timeRemaining)}
            </div>
          </div>

          <div className="flex gap-0.5">
            {questions.map((_, idx) => (
              <div key={idx} className="h-1.5 flex-1 rounded-full" style={idx === currentQuestion ? { background: "var(--foreground-secondary)" } : answers[idx] !== null ? { background: "#E76F51" } : { background: "var(--card-border)" }} />
            ))}
          </div>
          <div className="flex justify-between mt-1 text-xs" style={{ color: "var(--muted)" }}>
            <span>Q{currentQuestion + 1} / {questions.length} — {question.subjectName}</span>
            <span>{answeredCount} {t("answered", { count: String(answeredCount), total: String(questions.length) })}</span>
          </div>
        </div>

        {/* Question */}
        <div className="rounded-2xl p-6 shadow-lg mb-4" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", borderWidth: "1px", borderStyle: "solid" }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ background: "var(--primary-bg)", color: "var(--primary)" }}>
              {question.subjectName}
            </span>
            <span className="text-xs" style={{ color: "var(--muted)" }}>Q{currentQuestion + 1}</span>
          </div>

          <h2 className="text-lg font-medium mb-6 leading-relaxed" style={{ color: "var(--foreground)" }}>{question.question}</h2>

          <div className="space-y-3">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => {
                  const newAnswers = [...answers];
                  newAnswers[currentQuestion] = idx;
                  setAnswers(newAnswers);
                }}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                  answers[currentQuestion] === idx
                    ? "border-[#E76F51]"
                    : ""
                }`}
                style={answers[currentQuestion] === idx ? { background: "var(--hover-bg)" } : { borderColor: "var(--card-border)" }}
              >
                <span className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                  answers[currentQuestion] === idx ? "bg-slate-500 border-[#E76F51] text-white" : ""
                }`} style={answers[currentQuestion] !== idx ? { borderColor: "var(--card-border)", color: "var(--muted)" } : undefined}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span style={{ color: "var(--foreground-secondary)" }}>{option}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => currentQuestion > 0 && setCurrentQuestion(currentQuestion - 1)}
            disabled={currentQuestion === 0}
            className="px-4 py-2 text-sm font-medium rounded-lg disabled:opacity-40"
            style={{ color: "var(--foreground-secondary)", background: "var(--card-bg)", borderColor: "var(--card-border)", borderWidth: "1px", borderStyle: "solid" }}
          >
            {t("previous")}
          </button>
          <div className="flex gap-2">
            {currentQuestion < questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                className="px-5 py-2 text-sm font-medium text-white rounded-lg transition-all"
                style={{
                  background: "#16213E",
                  border: "1px solid rgba(22, 33, 62, 0.5)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#1a2744";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(22, 33, 62, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#16213E";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {t("next")}
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 text-sm font-medium bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50"
              >
                {isSubmitting ? t("submitting") : t("submitTest")}
              </button>
            )}
          </div>
          {currentQuestion < questions.length - 1 && (
            <button
              onClick={() => setCurrentQuestion(currentQuestion + 1)}
              className="px-4 py-2 text-sm font-medium rounded-lg"
              style={{ color: "var(--foreground-secondary)", background: "var(--card-bg)", borderColor: "var(--card-border)", borderWidth: "1px", borderStyle: "solid" }}
            >
              {t("skip")}
            </button>
          )}
          {currentQuestion === questions.length - 1 && <div />}
        </div>

        {/* Question navigator */}
        <div className="rounded-xl p-4" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", borderWidth: "1px", borderStyle: "solid" }}>
          <div className="text-xs mb-2 font-medium" style={{ color: "var(--muted)" }}>{t("questionNavigator")}</div>
          <div className="flex flex-wrap gap-1.5">
            {questions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentQuestion(idx)}
                className={`w-8 h-8 rounded-lg text-xs font-medium ${
                  idx === currentQuestion ? "bg-slate-500 text-white"
                  : answers[idx] !== null ? "bg-[#FEF5F3]"
                  : ""
                }`}
                style={idx !== currentQuestion && answers[idx] === null ? { background: "var(--hover-bg)", color: "var(--muted)" } : answers[idx] !== null && idx !== currentQuestion ? { color: "var(--primary)" } : undefined}
                title={q.subjectName}
              >
                {idx + 1}
              </button>
            ))}
          </div>
          <div className="flex gap-4 mt-3 text-xs" style={{ color: "var(--muted)" }}>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-slate-500 inline-block" /> {t("current")}</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-[#FEF5F3] inline-block" /> Answered</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded inline-block" style={{ background: "var(--hover-bg)" }} /> {t("notAnswered")}</span>
          </div>
        </div>

        {/* Submit button */}
        {answeredCount > 0 && (
          <div className="mt-4 text-center">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-3 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 shadow-lg disabled:opacity-50"
            >
              {isSubmitting ? t("submitting") : `${t("submitTest")} (${answeredCount}/${questions.length} ${t("answered", { count: "", total: "" }).trim() || "answered"})`}
            </button>
          </div>
        )}

        {/* Exit Confirmation Modal */}
        {showExitConfirmation && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-[var(--card-bg)] rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in slide-in-from-bottom-4 duration-300" style={{ borderColor: "var(--card-border)", borderWidth: "1px", borderStyle: "solid" }}>
              <div className="flex justify-center mb-4">
                <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 6v0m0-11V3m0 0L9 6m3-3l3 3" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-center mb-2" style={{ color: "var(--foreground)" }}>
                Exit Test?
              </h3>
              <p className="text-sm text-center mb-6" style={{ color: "var(--foreground-secondary)" }}>
                Your progress will be lost if you exit now.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowExitConfirmation(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors"
                  style={{
                    background: "var(--hover-bg)",
                    color: "var(--foreground-secondary)"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(0, 0, 0, 0.1)";
                    e.currentTarget.style.color = "var(--foreground)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "var(--hover-bg)";
                    e.currentTarget.style.color = "var(--foreground-secondary)";
                  }}
                >
                  Continue Test
                </button>
                <button
                  onClick={() => {
                    setShowExitConfirmation(false);
                    setPageState("select");
                    setQuestions([]);
                    setAnswers([]);
                    setCurrentQuestion(0);
                    setTimeRemaining(0);
                    window.scrollTo(0, 0);
                  }}
                  className="flex-1 px-4 py-2.5 text-white font-medium rounded-lg transition-all"
                  style={{
                    backgroundColor: "#ef4444"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#dc2626";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(239, 68, 68, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#ef4444";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  Exit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Landing page for non-authenticated users
  if (!user) {
    return (
      <div className="min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#E76F51] rounded-2xl mb-6 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-5xl font-bold mb-4" style={{ color: "var(--foreground)" }}>
              Full-Length Mock Tests
            </h1>
            <p className="text-xl max-w-3xl mx-auto mb-8" style={{ color: "var(--foreground-secondary)" }}>
              Practice with realistic exam simulations for JEE, NEET, UPSC, Banking, SSC, and 55+ other competitive exams
            </p>
            <button
              onClick={() => setShowLoginModal(true)}
              className="inline-flex items-center gap-2 px-8 py-4 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
            style={{
              backgroundColor: '#16213E',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1a2744';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#16213E';
            }}
            >
              Start Mock Tests Now
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="rounded-2xl p-8 shadow-lg" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", borderWidth: "1px", borderStyle: "solid" }}>
              <div className="w-12 h-12 bg-[#FEF5F3] rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6" style={{ color: "var(--primary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: "var(--foreground)" }}>Short Practice Tests</h3>
              <p className="mb-4" style={{ color: "var(--foreground-secondary)" }}>20-30 questions · 40-60 minutes</p>
              <ul className="space-y-2 text-sm" style={{ color: "var(--foreground-secondary)" }}>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Quick daily practice sessions</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Build exam stamina gradually</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Perfect for topic revision</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl p-8 shadow-lg" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", borderWidth: "1px", borderStyle: "solid" }}>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: "var(--foreground)" }}>Full-Length Mock Tests</h3>
              <p className="mb-4" style={{ color: "var(--foreground-secondary)" }}>60-90 questions · 100-150 minutes</p>
              <ul className="space-y-2 text-sm" style={{ color: "var(--foreground-secondary)" }}>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Real exam pattern and difficulty</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Time management practice</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Complete pre-exam simulation</span>
                </li>
              </ul>
            </div>
          </div>

          {/* What's Included */}
          <div className="rounded-2xl p-8 shadow-lg mb-16" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", borderWidth: "1px", borderStyle: "solid" }}>
            <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: "var(--foreground)" }}>What's Included in Mock Tests</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#FEF5F3] rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-[#E76F51]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2" style={{ color: "var(--foreground)" }}>Timed Tests</h3>
                <p className="text-sm" style={{ color: "var(--foreground-secondary)" }}>Real exam time limits with countdown timer</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2" style={{ color: "var(--foreground)" }}>Detailed Analytics</h3>
                <p className="text-sm" style={{ color: "var(--foreground-secondary)" }}>Section-wise performance breakdown</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#D6D9FF] rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-[#D65A3D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2" style={{ color: "var(--foreground)" }}>Rich Explanations</h3>
                <p className="text-sm" style={{ color: "var(--foreground-secondary)" }}>Step-by-step solutions for every question</p>
              </div>
            </div>
          </div>

          {/* Available Exams */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--foreground)" }}>Available for 60+ Exams</h2>
            <p className="mb-8" style={{ color: "var(--foreground-secondary)" }}>JEE, NEET, UPSC, SSC, Banking, Railways, State PSC, Defence, Law, and many more</p>
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-8 py-4 bg-[#16213E] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:bg-[#1a2744] transition-all"
            >
              Get Started - It's Free
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Selection screen - NEW REDESIGNED UI
  return (
    <AccessibilityWrapper>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
      <div className="text-center mb-8">
        <p className="text-sm font-semibold uppercase mb-2" style={{ color: "#E76F51", letterSpacing: "0.05em" }}>
          MOCK TESTS
        </p>
        <h1 className="text-4xl font-bold mb-3" style={{ color: "var(--foreground)" }}>
          Simulate the real thing.
        </h1>
        <p className="max-w-2xl mx-auto text-base" style={{ color: "var(--foreground-secondary)" }}>
          Full exam interface, timed sections, and question palette. Analytics ship with your score.
        </p>
      </div>

      {/* Test Type Tabs */}
      <div className="flex flex-col items-center gap-4 mb-8">
        <div className="flex justify-center gap-3">
          <button
            onClick={() => setTestType("short")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              testType === "short"
                ? "text-white shadow-lg"
                : "border-2"
            }`}
            style={testType === "short" ? { background: '#16213E' } : { background: "var(--card-bg)", color: "var(--foreground-secondary)", borderColor: "var(--card-border)" }}
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Short Practice Tests</span>
            </div>
            <div className="text-xs mt-1 opacity-90">20-30 questions · 40-60 mins</div>
          </button>

          <button
            onClick={() => setTestType("full")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              testType === "full"
                ? "text-white shadow-lg"
                : "border-2"
            }`}
            style={testType === "full" ? { background: '#16213E' } : { background: "var(--card-bg)", color: "var(--foreground-secondary)", borderColor: "var(--card-border)" }}
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Full-Length Mock Tests</span>
              </div>
              <div className="text-xs mt-1 opacity-90">60-90 questions · 100-150 mins</div>
          </button>
        </div>

        {/* Custom Test Builder Button */}
        <button
          onClick={() => setShowCustomBuilder(true)}
          className="px-8 py-3 text-white rounded-xl font-semibold shadow-lg transition-all flex items-center gap-2"
          style={{ background: '#16213E' }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#1a2744'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#16213E'}
        >
          <Sparkles className="w-5 h-5" />
          <span>Create Custom Test</span>
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">NEW</span>
        </button>
        <p className="text-xs -mt-2" style={{ color: "var(--muted)" }}>Build your own personalized mock test</p>
      </div>


      {/* Mock Test Cards - Flat List */}
      {isLoadingConfigs ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-xl p-6 h-48 shimmer" style={{ background: "var(--card-bg)" }} />
          ))}
        </div>
      ) : flattenedConfigs.length === 0 ? (
        <div className="text-center py-16">
          <div className="flex justify-center mb-4">
            <FileText className="w-20 h-20" style={{ color: "var(--muted)" }} />
          </div>
          <p className="text-lg" style={{ color: "var(--muted)" }}>No mock tests found for your exam</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {flattenedConfigs.map((config) => {
            const exam = getExamById(config.examId);

            return (
              <div
                key={`${config.examId}-${config.testNumber}`}
                className="group rounded-xl p-5 border transition-all duration-200 hover:shadow-lg"
                style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.borderColor = "#E76F51";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "var(--card-border)";
                }}
              >
                {/* Exam Tag with Difficulty */}
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs font-semibold uppercase" style={{ color: "#E76F51" }}>
                    {config.examName}
                  </div>
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={testType === "short"
                      ? { backgroundColor: "#EEE0C6", color: "#0F1E3D" } // Moderate: Gold bg, dark navy text
                      : { backgroundColor: "#FEF2F2", color: "#E24948" }  // Hard: Light red bg, red text
                    }
                  >
                    {testType === "short" ? "Moderate" : "Hard"}
                  </span>
                </div>

                {/* Test Title */}
                <h3 className="font-bold text-base mb-3" style={{ color: "var(--foreground)" }}>
                  {testType === "short" ? "Mock Test" : "Full-Length"} #{config.testNumber}
                </h3>

                {/* Stats Row - All in one line including sections */}
                <div className="flex items-center gap-1 mb-3 text-sm flex-wrap" style={{ color: "var(--foreground-secondary)" }}>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{config.timeLimitMinutes} min</span>
                  </div>
                  <span className="mx-1">·</span>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>{config.totalQuestions} Qs</span>
                  </div>
                  <span className="mx-1">·</span>
                  <span>{config.sections.length} Section{config.sections.length !== 1 ? 's' : ''}</span>
                </div>

                {/* Start Test Button */}
                <button
                  onClick={() => {
                    startTest(config.examId, config.testNumber, testType === "full");
                  }}
                  className="px-4 py-2 text-white text-sm font-semibold rounded-lg transition-all flex items-center gap-2"
                  style={{ backgroundColor: "#16213E" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#1a2744";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#16213E";
                  }}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  <span>Start test</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Past Tests History */}
      {history.length > 0 && (
        <div className="mt-12 mb-24">
          <h2 className="text-2xl font-bold mb-5" style={{ color: "var(--foreground)" }}>Past Mock Tests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {history.filter((h: any) => h.status === "completed").slice(0, 6).map((h: any) => {
              const exam = getExamById(h.exam_id);
              const acc = h.total_questions > 0 ? Math.round((h.correct_answers / h.total_questions) * 100) : 0;
              const textColor = acc >= 70 ? "#10b981" : acc >= 50 ? "#d97706" : "#dc2626";
              return (
                <div key={h.id} className="rounded-xl p-4 border flex items-center justify-between transition-all" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 flex items-center justify-center">
                      <ColorfulExamIcon
                        examId={h.exam_id}
                        size={56}
                      />
                    </div>
                    <div>
                      <div className="font-semibold" style={{ color: "var(--foreground)" }}>{exam?.name || h.exam_id}</div>
                      <div className="text-xs" style={{ color: "var(--muted)" }}>
                        {new Date(h.completed_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · {formatTime(h.time_taken_seconds)}
                      </div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold" style={{ color: textColor }}>
                    {acc}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Exam Details Modal - REMOVED (tests now listed directly as cards) */}

      {/* Custom Mock Test Builder */}
      {showCustomBuilder && (
        <CustomMockTestBuilder
          onClose={() => setShowCustomBuilder(false)}
          onCreateTest={startCustomTest}
        />
      )}
    </div>
    </AccessibilityWrapper>
  );
}
