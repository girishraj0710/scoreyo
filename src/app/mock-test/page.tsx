"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import { useUser } from "@/context/user-context";
import { useLocale } from "@/context/locale-context";
import { getExamById } from "@/lib/exams";
import { FileText, Sparkles } from "lucide-react";
import { ColorfulExamIcon } from "@/lib/colorful-exam-icons";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { getHeadersWithCsrf } from "@/lib/csrf-client";

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
  const { user, setShowLoginModal } = useUser();
  const { t } = useLocale();

  const [pageState, setPageState] = useState<PageState>("select");
  const [testType, setTestType] = useState<TestType>("short");
  // Modal-local Short/Full selection. Initialized from the page-level
  // `testType` when the modal opens, but toggling inside the modal does
  // NOT propagate back to the page tab.
  const [modalTestType, setModalTestType] = useState<TestType>("short");
  const [configs, setConfigs] = useState<MockTestConfig[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoadingConfigs, setIsLoadingConfigs] = useState(true);
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [selectedTestNumber, setSelectedTestNumber] = useState<number>(1);
  const [testCapacity, setTestCapacity] = useState<Record<string, number>>({});
  const [showExamModal, setShowExamModal] = useState(false);
  const [showCustomBuilder, setShowCustomBuilder] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

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

        const message = pageState === "loading"
          ? "Cancel test generation and go back?"
          : "Exit test? Your progress will be lost.";

        if (confirm(message)) {
          setPageState("select");
          setQuestions([]);
          setAnswers([]);
          setCurrentQuestion(0);
          setTimeRemaining(0);
          window.scrollTo(0, 0);
        }
      }
    };

    document.addEventListener('click', handleGlobalClick, true);
    return () => document.removeEventListener('click', handleGlobalClick, true);
  }, [pageState]);

  // Load configs, capacity, and history
  useEffect(() => {
    if (!user) {
      setIsLoadingConfigs(false);
      return;
    }
    async function load() {
      try {
        const [configsRes, capacityRes, historyRes] = await Promise.all([
          fetch("/api/mock-test?action=configs"),
          fetch("/api/mock-test?action=capacity"),
          fetch("/api/mock-test"),
        ]);
        if (configsRes.ok) {
          const data = await configsRes.json();
          setConfigs(data.configs);
        }
        if (capacityRes.ok) {
          const data = await capacityRes.json();
          setTestCapacity(data.capacity);
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

  // Click outside handler for search dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  // Filtered configs based on test type
  const displayConfigs = useMemo(() => {
    const filtered = configs.filter(c => {
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return (
        c.examName.toLowerCase().includes(query) ||
        c.examId.toLowerCase().includes(query) ||
        c.sections.some((s) => s.subjectName.toLowerCase().includes(query))
      );
    });

    // Transform configs based on test type
    if (testType === "full") {
      return filtered.map(getFullLengthConfig);
    }
    return filtered;
  }, [configs, searchQuery, testType]);

  // Group configs by examId
  const groupedConfigs = useMemo(() => {
    const groups: { [key: string]: MockTestConfig[] } = {};
    displayConfigs.forEach((config) => {
      if (!groups[config.examId]) {
        groups[config.examId] = [];
      }
      groups[config.examId].push(config);
    });
    Object.keys(groups).forEach((examId) => {
      groups[examId].sort((a, b) => a.testNumber - b.testNumber);
    });
    return groups;
  }, [displayConfigs]);

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
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl p-12 shadow-lg border border-amber-200">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-amber-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">{t("mockTestProOnly")}</h2>
          <p className="text-slate-500 mb-6">{t("mockTestProDesc")}</p>
          <div className="flex gap-3 justify-center">
            <a href="/pricing" className="px-6 py-3 bg-gradient-to-r from-#00A1E0 to-violet-500 text-white font-semibold rounded-xl hover:from-#0070A8 hover:to-violet-600 shadow-lg">
              {t("upgradeToPro")}
            </a>
            <button onClick={() => setPageState("select")} className="px-6 py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200">
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
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-#00A1E0 to-violet-500 p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              {exam && <ColorfulExamIcon examId={exam.id} size={32} className="text-white" />}
              <h1 className="text-2xl font-bold">{examName}</h1>
            </div>
            <p className="text-#B3E0F2">
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
            <h2 className="text-xl font-bold text-slate-800 mb-4">📋 General Instructions</h2>

            <div className="space-y-4 text-slate-700">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="font-semibold text-amber-900">⏰ Timer Rules</p>
                <p className="text-sm mt-1">The countdown timer will display the remaining time. When the timer reaches zero, the test will end automatically. You don't need to manually submit.</p>
              </div>

              <div>
                <p className="font-semibold mb-2">📊 Question Status Indicators:</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 border-2 border-slate-300 rounded"></span>
                    <span>Not visited yet</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-red-100 border-2 border-red-300 rounded"></span>
                    <span>Not answered</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-green-100 border-2 border-green-400 rounded"></span>
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

              <div className="bg-#E6F4F9 border border-#80CFED rounded-lg p-4">
                <p className="font-semibold text-#005A7A">💡 Pro Tips:</p>
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
          <div className="bg-slate-50 p-6 flex items-center justify-between border-t">
            <button
              onClick={() => setPageState("select")}
              className="px-6 py-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg border border-slate-200 transition-colors"
            >
              ← Back
            </button>

            <div className="flex items-center gap-4">
              {isGeneratingInBackground && (
                <div className="flex items-center gap-2 text-sm text-#00A1E0">
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
                className="px-8 py-3 bg-gradient-to-r from-#00A1E0 to-violet-500 text-white font-bold rounded-xl hover:from-#0070A8 hover:to-violet-600 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl p-12 shadow-lg border border-slate-200">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-#B3E0F2 flex items-center justify-center">
            <svg className="animate-spin h-8 w-8 text-#00A1E0" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">{t("preparingMockTest")}</h2>
          <p className="text-slate-500 mb-6">{t("preparingMockTestDesc")}</p>
          <button
            onClick={() => {
              setPageState("select");
              setQuestions([]);
              setAnswers([]);
            }}
            className="px-6 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg border border-slate-200 transition-colors"
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
      percentage >= 90 ? { label: t("excellent"), color: "text-slate-500", bg: "bg-slate-50" }
      : percentage >= 70 ? { label: t("goodJob"), color: "text-#00A1E0", bg: "bg-slate-50" }
      : percentage >= 50 ? { label: t("keepPracticing"), color: "text-amber-600", bg: "bg-amber-50" }
      : { label: t("needsImprovement"), color: "text-red-600", bg: "bg-red-50" };

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Score Card */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 text-center mb-8">
          <div className="text-sm text-#00A1E0 font-medium mb-2">{t("mockTestResult")}</div>
          <h2 className={`text-2xl font-bold ${grade.color} mb-2`}>{grade.label}</h2>
          <div className="text-6xl font-bold text-slate-800 mb-2">{percentage}%</div>
          <p className="text-slate-500 mb-6">
            {results.correctAnswers} / {results.totalQuestions} {t("correct")} | {t("time")}: {formatTime(results.timeTaken)}
          </p>

          {/* Section-wise breakdown */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-lg mx-auto mb-6">
            {Object.entries(results.sectionResults).map(([subjectId, data]: [string, any]) => {
              const acc = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
              return (
                <div key={subjectId} className={`${acc >= 70 ? "bg-slate-50 border-slate-200" : acc >= 50 ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200"} rounded-xl p-3 border`}>
                  <div className="text-xs text-slate-500">{data.subjectName}</div>
                  <div className={`text-lg font-bold ${acc >= 70 ? "text-slate-500" : acc >= 50 ? "text-amber-600" : "text-red-600"}`}>
                    {data.correct}/{data.total}
                  </div>
                  <div className="text-xs text-slate-400">{acc}%</div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3 justify-center">
            <button onClick={() => { setPageState("select"); setResults(null); }} className="px-6 py-2 bg-#00A1E0 text-white rounded-lg hover:bg-#0070A8 font-medium">
              {t("takeAnotherTest")}
            </button>
            <a href="/reports" className="px-6 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium">
              {t("viewReports")}
            </a>
          </div>
        </div>

        {/* Question review (keep existing) */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <button
            onClick={() => setCurrentSection("all")}
            className={`px-3 py-1.5 rounded-full text-sm font-medium ${currentSection === "all" ? "bg-slate-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
          >
            All ({results.totalQuestions})
          </button>
          {Object.entries(results.sectionResults).map(([subjectId, data]: [string, any]) => (
            <button
              key={subjectId}
              onClick={() => setCurrentSection(subjectId)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium ${currentSection === subjectId ? "bg-slate-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
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
                <div key={globalIdx} className={`bg-white rounded-xl p-5 border-2 ${r.isCorrect ? "border-slate-200" : "border-red-200"}`}>
                  <div className="flex items-start gap-3 mb-3">
                    <span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white ${r.isCorrect ? "bg-cyan-400" : "bg-red-500"}`}>
                      {globalIdx + 1}
                    </span>
                    <div className="flex-1">
                      <span className="text-xs text-#00A1E0 font-medium">{r.subjectName}</span>
                      <p className="text-slate-800 font-medium mt-1">{r.question}</p>
                    </div>
                  </div>
                  <div className="ml-10 space-y-2">
                    {r.options.map((opt: string, optIdx: number) => (
                      <div key={optIdx} className={`px-3 py-2 rounded-lg text-sm ${
                        optIdx === r.correctAnswer ? "bg-slate-50 border border-#66C7EA text-slate-800 font-medium"
                        : optIdx === r.userAnswer && !r.isCorrect ? "bg-red-50 border border-red-300 text-red-800"
                        : "bg-slate-50 text-slate-600"
                      }`}>
                        <span className="font-medium mr-2">{String.fromCharCode(65 + optIdx)}.</span>
                        {opt}
                        {optIdx === r.correctAnswer && <span className="ml-2 text-slate-500 font-medium">({t("correct")})</span>}
                        {optIdx === r.userAnswer && !r.isCorrect && <span className="ml-2 text-red-600 font-medium">({t("yourAnswer")})</span>}
                      </div>
                    ))}
                  </div>
                  {r.explanation && (
                    <div className="ml-10 mt-3 p-3 bg-slate-50 rounded-lg text-sm text-#0070A8">
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
      <div className="max-w-4xl mx-auto px-4 py-4">
        {/* Back Button */}
        <button
          onClick={() => {
            if (confirm("Are you sure you want to exit? Your progress will be lost.")) {
              setPageState("select");
              setQuestions([]);
              setAnswers([]);
              setCurrentQuestion(0);
              setTimeRemaining(0);
            }
          }}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">Exit Test</span>
        </button>

        {/* Sticky header */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 mb-4 sticky top-16 z-40">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-sm font-semibold text-#00A1E0">{examName}</span>
              <span className="text-slate-300 mx-2">|</span>
              <span className="text-sm text-slate-500">{t("mockTest")}</span>
            </div>
            <div className={`text-lg font-mono font-bold px-4 py-1 rounded-lg ${isCriticalTime ? "bg-red-100 text-red-600 animate-pulse" : isLowTime ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-600"}`}>
              {formatTime(timeRemaining)}
            </div>
          </div>

          <div className="flex gap-0.5">
            {questions.map((_, idx) => (
              <div key={idx} className={`h-1.5 flex-1 rounded-full ${idx === currentQuestion ? "bg-slate-500" : answers[idx] !== null ? "bg-#80CFED" : "bg-slate-200"}`} />
            ))}
          </div>
          <div className="flex justify-between mt-1 text-xs text-slate-400">
            <span>Q{currentQuestion + 1} / {questions.length} — {question.subjectName}</span>
            <span>{answeredCount} {t("answered", { count: String(answeredCount), total: String(questions.length) })}</span>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-#B3E0F2 text-#0070A8">
              {question.subjectName}
            </span>
            <span className="text-xs text-slate-400">Q{currentQuestion + 1}</span>
          </div>

          <h2 className="text-lg font-medium text-slate-800 mb-6 leading-relaxed">{question.question}</h2>

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
                    ? "border-#E6F4F90 bg-slate-50"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                }`}
              >
                <span className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                  answers[currentQuestion] === idx ? "bg-slate-500 border-#E6F4F90 text-white" : "border-slate-300 text-slate-400"
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-slate-700">{option}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => currentQuestion > 0 && setCurrentQuestion(currentQuestion - 1)}
            disabled={currentQuestion === 0}
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40"
          >
            {t("previous")}
          </button>
          <div className="flex gap-2">
            {currentQuestion < questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                className="px-5 py-2 text-sm font-medium bg-#00A1E0 text-white rounded-lg hover:bg-#0070A8"
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
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
            >
              {t("skip")}
            </button>
          )}
          {currentQuestion === questions.length - 1 && <div />}
        </div>

        {/* Question navigator */}
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="text-xs text-slate-400 mb-2 font-medium">{t("questionNavigator")}</div>
          <div className="flex flex-wrap gap-1.5">
            {questions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentQuestion(idx)}
                className={`w-8 h-8 rounded-lg text-xs font-medium ${
                  idx === currentQuestion ? "bg-slate-500 text-white"
                  : answers[idx] !== null ? "bg-#B3E0F2 text-#00A1E0"
                  : "bg-slate-100 text-slate-400"
                }`}
                title={q.subjectName}
              >
                {idx + 1}
              </button>
            ))}
          </div>
          <div className="flex gap-4 mt-3 text-xs text-slate-400">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-slate-500 inline-block" /> {t("current")}</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-#B3E0F2 inline-block" /> {t("answered", { count: "", total: "" }).trim() || "Answered"}</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-slate-100 inline-block" /> {t("notAnswered")}</span>
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
      </div>
    );
  }

  // Landing page for non-authenticated users
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="max-w-6xl mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-#00A1E0 to-violet-500 rounded-2xl mb-6 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-#00A1E0 to-violet-500 bg-clip-text text-transparent">
                Full-Length Mock Tests
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              Practice with realistic exam simulations for JEE, NEET, UPSC, Banking, SSC, and 55+ other competitive exams
            </p>
            <button
              onClick={() => setShowLoginModal(true)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-#00A1E0 to-violet-500 text-white font-semibold rounded-xl hover:from-#0070A8 hover:to-violet-600 shadow-lg hover:shadow-xl transition-all"
            >
              Start Mock Tests Now
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
              <div className="w-12 h-12 bg-#B3E0F2 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-#00A1E0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Short Practice Tests</h3>
              <p className="text-slate-600 mb-4">20-30 questions · 40-60 minutes</p>
              <ul className="space-y-2 text-sm text-slate-600">
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

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Full-Length Mock Tests</h3>
              <p className="text-slate-600 mb-4">60-90 questions · 100-150 minutes</p>
              <ul className="space-y-2 text-sm text-slate-600">
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
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 mb-16">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">What's Included in Mock Tests</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-#B3E0F2 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-#00A1E0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">Timed Tests</h3>
                <p className="text-sm text-slate-600">Real exam time limits with countdown timer</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">Detailed Analytics</h3>
                <p className="text-sm text-slate-600">Section-wise performance breakdown</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">Rich Explanations</h3>
                <p className="text-sm text-slate-600">Step-by-step solutions for every question</p>
              </div>
            </div>
          </div>

          {/* Available Exams */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Available for 60+ Exams</h2>
            <p className="text-slate-600 mb-8">JEE, NEET, UPSC, SSC, Banking, Railways, State PSC, Defence, Law, and many more</p>
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-8 py-4 bg-gradient-to-r from-#00A1E0 to-violet-500 text-white font-semibold rounded-xl hover:from-#0070A8 hover:to-violet-600 shadow-lg hover:shadow-xl transition-all"
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
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-3">
          <span className="bg-gradient-to-r from-#00A1E0 to-violet-500 bg-clip-text text-transparent">
            Mock Tests
          </span>
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Practice with full-length mock tests or take short practice tests to prepare for your exams
        </p>
      </div>

      {/* Test Type Tabs */}
      <div className="flex flex-col items-center gap-4 mb-8">
        <div className="flex justify-center gap-3">
          <button
            onClick={() => setTestType("short")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              testType === "short"
                ? "bg-gradient-to-r from-#00A1E0 to-violet-500 text-white shadow-lg"
                : "bg-white text-slate-600 border-2 border-slate-200 hover:border-slate-300"
            }`}
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
                ? "bg-gradient-to-r from-#00A1E0 to-violet-500 text-white shadow-lg"
                : "bg-white text-slate-600 border-2 border-slate-200 hover:border-slate-300"
            }`}
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
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center gap-2"
        >
          <Sparkles className="w-5 h-5" />
          <span>Create Custom Test</span>
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">NEW</span>
        </button>
        <p className="text-xs text-slate-500 -mt-2">Build your own personalized mock test</p>
      </div>

      {/* Search Bar */}
      <div className="max-w-xl mx-auto mb-8" ref={searchContainerRef}>
        <div className="relative">
          <input
            type="text"
            placeholder="Search mock tests by exam name..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchDropdown(true);
            }}
            onFocus={() => setShowSearchDropdown(true)}
            className="w-full px-5 py-3 pl-12 pr-12 rounded-xl border-2 border-slate-200 focus:border-#E6F4F90 focus:ring-2 focus:ring-#80CFED outline-none transition-all"
          />
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setShowSearchDropdown(false);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Mock Test Cards */}
      {isLoadingConfigs ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6 h-64 shimmer" />
          ))}
        </div>
      ) : Object.keys(groupedConfigs).length === 0 ? (
        <div className="text-center py-16">
          <div className="flex justify-center mb-4">
            <FileText className="w-20 h-20 text-slate-400" />
          </div>
          <p className="text-slate-400 text-lg">No mock tests found matching your search</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Object.keys(groupedConfigs).map((examId) => {
            const exam = getExamById(examId);
            const testConfigs = groupedConfigs[examId];
            const firstConfig = testConfigs[0];

            const isSelected = selectedExam === examId;

            return (
              <div
                key={examId}
                id={`exam-${examId}`}
                onClick={() => {
                  setSelectedExam(examId);
                  setSelectedTestNumber(1);
                  // Seed the modal's local Short/Full from the page-level
                  // tab on open. Subsequent toggles inside the modal stay
                  // local and do not bleed back into the page tab.
                  setModalTestType(testType);
                  setShowExamModal(true);
                }}
                className="group bg-white rounded-2xl p-6 border-2 border-slate-200 hover:border-#66C7EA hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                {/* Header */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <ColorfulExamIcon
                      examId={examId}
                      size={40}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-slate-800 mb-1">{firstConfig.examName}</h3>
                    <p className="text-xs text-slate-400 line-clamp-1">{exam?.description || ""}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-slate-50 rounded-lg p-2 text-center">
                    <div className="text-lg font-bold text-#00A1E0">{firstConfig.totalQuestions}</div>
                    <div className="text-xs text-slate-500">Questions</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-2 text-center">
                    <div className="text-lg font-bold text-purple-600">{firstConfig.timeLimitMinutes}m</div>
                    <div className="text-xs text-slate-500">Duration</div>
                  </div>
                  <div className="bg-pink-50 rounded-lg p-2 text-center">
                    <div className="text-lg font-bold text-pink-600">{firstConfig.sections.length}</div>
                    <div className="text-xs text-slate-500">Sections</div>
                  </div>
                </div>

                {/* Subjects */}
                <div className="flex flex-wrap gap-1.5 min-h-[52px]">
                  {firstConfig.sections.slice(0, 3).map((s) => (
                    <span key={s.subjectId} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                      {s.subjectName} ({s.questionCount})
                    </span>
                  ))}
                  {firstConfig.sections.length > 3 && (
                    <span className="text-xs bg-slate-100 text-slate-400 px-2 py-1 rounded-md">
                      +{firstConfig.sections.length - 3} more
                    </span>
                  )}
                </div>

                {/* Available tests badge */}
                {testCapacity[examId] > 3 && (
                  <div className="mt-4 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-lg border border-emerald-200">
                    <span className="text-lg">🚀</span>
                    <span className="text-xs font-semibold text-emerald-700">
                      {testCapacity[examId]}+ Tests Available
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Past Tests History */}
      {history.length > 0 && (
        <div className="mt-12 mb-24">
          <h2 className="text-2xl font-bold text-slate-800 mb-5">Past Mock Tests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {history.filter((h: any) => h.status === "completed").slice(0, 6).map((h: any) => {
              const exam = getExamById(h.exam_id);
              const acc = h.total_questions > 0 ? Math.round((h.correct_answers / h.total_questions) * 100) : 0;
              return (
                <div key={h.id} className="bg-white rounded-xl p-4 border border-slate-200 flex items-center justify-between hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center">
                      <ColorfulExamIcon
                        examId={h.exam_id}
                        size={32}
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">{exam?.name || h.exam_id}</div>
                      <div className="text-xs text-slate-400">
                        {new Date(h.completed_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · {formatTime(h.time_taken_seconds)}
                      </div>
                    </div>
                  </div>
                  <div className={`text-2xl font-bold ${acc >= 70 ? "text-slate-500" : acc >= 50 ? "text-amber-600" : "text-red-600"}`}>
                    {acc}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Exam Details Modal */}
      {showExamModal && selectedExam && groupedConfigs[selectedExam] && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowExamModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 flex items-center justify-center">
                  <ColorfulExamIcon examId={selectedExam} size={40} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">{groupedConfigs[selectedExam][0].examName}</h2>
                  <p className="text-sm text-slate-500">{getExamById(selectedExam)?.description || ""}</p>
                </div>
              </div>
              <button
                onClick={() => setShowExamModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content. All test-stat and section displays derive from the
                BASE (untransformed) config and the modal-local `modalTestType`
                — never from `groupedConfigs`, which depends on the page tab. */}
            {(() => {
              const baseConfigForStats = configs.find(
                (c) => c.examId === selectedExam && c.testNumber === 1
              ) || groupedConfigs[selectedExam][0];
              const isFull = modalTestType === "full";
              const statsQuestions = isFull
                ? baseConfigForStats.totalQuestions * 3
                : baseConfigForStats.totalQuestions;
              const statsDuration = isFull
                ? Math.round(baseConfigForStats.timeLimitMinutes * 2.5)
                : baseConfigForStats.timeLimitMinutes;
              return (
            <div className="p-6 space-y-6">
              {/* Test Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-#E6F4F9 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-#00A1E0">{statsQuestions}</div>
                  <div className="text-xs text-slate-600 mt-1">Questions</div>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{statsDuration}m</div>
                  <div className="text-xs text-slate-600 mt-1">Duration</div>
                </div>
                <div className="bg-pink-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-pink-600">{baseConfigForStats.sections.length}</div>
                  <div className="text-xs text-slate-600 mt-1">Sections</div>
                </div>
              </div>

              {/* Sections Covered */}
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Topics Covered</h3>
                <div className="grid grid-cols-2 gap-2">
                  {baseConfigForStats.sections.map((s) => {
                    const qPerSection = isFull ? s.questionCount * 3 : s.questionCount;
                    return (
                    <div key={s.subjectId} className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="w-2 h-2 rounded-full bg-#E6F4F90"></div>
                      <span className="text-sm text-slate-700 font-medium">{s.subjectName}</span>
                      <span className="text-xs text-slate-400 ml-auto">({qPerSection}Q)</span>
                    </div>
                    );
                  })}
                </div>
              </div>

              {/* Available Tests Badge */}
              {testCapacity[selectedExam] > 3 && (
                <div className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-xl border border-emerald-200">
                  <span className="text-2xl">🚀</span>
                  <span className="text-sm font-bold text-emerald-700">
                    {testCapacity[selectedExam]}+ Unique Tests Available
                  </span>
                </div>
              )}

              {/* Test Selector */}
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Select Test Number</h3>
                <div className="px-4 py-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {Array.from({ length: Math.min(testCapacity[selectedExam] || 3, 10) }, (_, i) => i + 1).map((num) => (
                      <button
                        key={num}
                        onClick={() => setSelectedTestNumber(num)}
                        className={`w-12 h-12 rounded-xl text-sm font-bold transition-all ${
                          selectedTestNumber === num
                            ? "bg-#00A1E0 text-white shadow-lg scale-110"
                            : "bg-white text-slate-700 hover:bg-#E6F4F9 hover:text-#00A1E0 border-2 border-slate-200 hover:border-#66C7EA"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                  {testCapacity[selectedExam] > 10 && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <div className="flex items-center gap-3 justify-center">
                        <label htmlFor="test-number-input" className="text-sm text-slate-600 font-medium">
                          Or enter test number:
                        </label>
                        <input
                          id="test-number-input"
                          type="number"
                          min={1}
                          max={testCapacity[selectedExam]}
                          value={selectedTestNumber}
                          onChange={(e) => {
                            const num = parseInt(e.target.value);
                            if (num >= 1 && num <= (testCapacity[selectedExam] || 3)) {
                              setSelectedTestNumber(num);
                            }
                          }}
                          className="w-20 px-3 py-2 text-center border-2 border-slate-300 rounded-lg font-bold text-slate-700 focus:border-#E6F4F90 focus:ring-2 focus:ring-#80CFED outline-none"
                        />
                        <span className="text-sm text-slate-500">of {testCapacity[selectedExam]}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Test Type Toggle.
                  Preview subtitles MUST use the base (untransformed) static
                  config from `configs`, NOT `groupedConfigs` — the latter is
                  derived from `displayConfigs` which is already multiplied by
                  3x/2.5x when testType === "full". Reading from it would
                  re-multiply on every toggle (the original bug: clicking Full
                  showed 225Q/313m, then Short showed 75Q/125m). */}
              {(() => {
                const baseConfig = configs.find(
                  (c) => c.examId === selectedExam && c.testNumber === 1
                ) || groupedConfigs[selectedExam][0];
                const shortQ = baseConfig.totalQuestions;
                const shortMin = baseConfig.timeLimitMinutes;
                const fullQ = shortQ * 3;
                const fullMin = Math.round(shortMin * 2.5);
                return (
                  <div className="flex gap-3">
                    <button
                      onClick={() => setModalTestType("short")}
                      className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${
                        modalTestType === "short"
                          ? "bg-gradient-to-r from-#00A1E0 to-violet-500 text-white shadow-lg"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>Short Practice</span>
                      </div>
                      <div className="text-xs mt-1 opacity-90">{shortQ}Q · {shortMin}mins</div>
                    </button>

                    <button
                      onClick={() => setModalTestType("full")}
                      className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${
                        modalTestType === "full"
                          ? "bg-gradient-to-r from-#00A1E0 to-violet-500 text-white shadow-lg"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Full-Length</span>
                      </div>
                      <div className="text-xs mt-1 opacity-90">{fullQ}Q · {fullMin}mins</div>
                    </button>
                  </div>
                );
              })()}
            </div>
              );
            })()}

            {/* Footer Actions */}
            <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-between">
              <button
                onClick={() => setShowExamModal(false)}
                className="px-6 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowExamModal(false);
                  startTest(selectedExam, selectedTestNumber, modalTestType === "full");
                }}
                className="px-8 py-3 bg-gradient-to-r from-#00A1E0 to-violet-500 text-white font-bold rounded-xl hover:from-#0070A8 hover:to-violet-600 shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                <span>Start Test {selectedTestNumber}</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Mock Test Builder */}
      {showCustomBuilder && (
        <CustomMockTestBuilder
          onClose={() => setShowCustomBuilder(false)}
          onCreateTest={startCustomTest}
        />
      )}
    </div>
  );
}
