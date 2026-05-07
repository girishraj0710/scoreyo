"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useUser } from "@/context/user-context";
import { useLocale } from "@/context/locale-context";
import { getExamById } from "@/lib/exams";

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

type PageState = "select" | "loading" | "test" | "results" | "pro-required";

export default function MockTestPage() {
  const { user } = useUser();
  const { t } = useLocale();

  const [pageState, setPageState] = useState<PageState>("select");
  const [configs, setConfigs] = useState<MockTestConfig[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoadingConfigs, setIsLoadingConfigs] = useState(true);

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

  // Load configs and history
  useEffect(() => {
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
  }, []);

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

  // Filtered and grouped configs based on search
  const filteredConfigs = useMemo(() => {
    if (!searchQuery.trim()) return configs;
    const query = searchQuery.toLowerCase();
    return configs.filter(
      (c) =>
        c.examName.toLowerCase().includes(query) ||
        c.examId.toLowerCase().includes(query) ||
        c.sections.some((s) => s.subjectName.toLowerCase().includes(query))
    );
  }, [configs, searchQuery]);

  // Group configs by examId to show multiple tests
  const groupedConfigs = useMemo(() => {
    const groups: { [key: string]: MockTestConfig[] } = {};
    filteredConfigs.forEach((config) => {
      if (!groups[config.examId]) {
        groups[config.examId] = [];
      }
      groups[config.examId].push(config);
    });
    // Sort each group by testNumber
    Object.keys(groups).forEach((examId) => {
      groups[examId].sort((a, b) => a.testNumber - b.testNumber);
    });
    return groups;
  }, [filteredConfigs]);

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

  async function startTest(examId: string, testNumber: number = 1) {
    setPageState("loading");
    try {
      const res = await fetch("/api/mock-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ examId, testNumber }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.proRequired) {
          setPageState("pro-required");
          return;
        }
        alert(data.error || "Failed to start test");
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
        headers: { "Content-Type": "application/json" },
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
            <a href="/pricing" className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-lg">
              {t("upgradeToPro")}
            </a>
            <a href="/" className="px-6 py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200">
              {t("goHome")}
            </a>
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
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-indigo-100 flex items-center justify-center">
            <svg className="animate-spin h-8 w-8 text-indigo-600" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">{t("preparingMockTest")}</h2>
          <p className="text-slate-500">{t("preparingMockTestDesc")}</p>
        </div>
      </div>
    );
  }

  // Results screen
  if (pageState === "results" && results) {
    const percentage = results.accuracy;
    const grade =
      percentage >= 90 ? { label: t("excellent"), color: "text-emerald-600", bg: "bg-emerald-50" }
      : percentage >= 70 ? { label: t("goodJob"), color: "text-blue-600", bg: "bg-blue-50" }
      : percentage >= 50 ? { label: t("keepPracticing"), color: "text-amber-600", bg: "bg-amber-50" }
      : { label: t("needsImprovement"), color: "text-red-600", bg: "bg-red-50" };

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Score Card */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 text-center mb-8">
          <div className="text-sm text-indigo-600 font-medium mb-2">{t("mockTestResult")}</div>
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
                <div key={subjectId} className={`${acc >= 70 ? "bg-emerald-50 border-emerald-200" : acc >= 50 ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200"} rounded-xl p-3 border`}>
                  <div className="text-xs text-slate-500">{data.subjectName}</div>
                  <div className={`text-lg font-bold ${acc >= 70 ? "text-emerald-600" : acc >= 50 ? "text-amber-600" : "text-red-600"}`}>
                    {data.correct}/{data.total}
                  </div>
                  <div className="text-xs text-slate-400">{acc}%</div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3 justify-center">
            <button onClick={() => { setPageState("select"); setResults(null); }} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">
              {t("takeAnotherTest")}
            </button>
            <a href="/reports" className="px-6 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium">
              {t("viewReports")}
            </a>
          </div>
        </div>

        {/* Section filter for review */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <button
            onClick={() => setCurrentSection("all")}
            className={`px-3 py-1.5 rounded-full text-sm font-medium ${currentSection === "all" ? "bg-indigo-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
          >
            All ({results.totalQuestions})
          </button>
          {Object.entries(results.sectionResults).map(([subjectId, data]: [string, any]) => (
            <button
              key={subjectId}
              onClick={() => setCurrentSection(subjectId)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium ${currentSection === subjectId ? "bg-indigo-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
            >
              {data.subjectName} ({data.correct}/{data.total})
            </button>
          ))}
        </div>

        {/* Question review */}
        <div className="space-y-4">
          {results.results
            .filter((r: any) => currentSection === "all" || r.subjectId === currentSection)
            .map((r: any, idx: number) => {
              const globalIdx = results.results.indexOf(r);
              return (
                <div key={globalIdx} className={`bg-white rounded-xl p-5 border-2 ${r.isCorrect ? "border-emerald-200" : "border-red-200"}`}>
                  <div className="flex items-start gap-3 mb-3">
                    <span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white ${r.isCorrect ? "bg-emerald-500" : "bg-red-500"}`}>
                      {globalIdx + 1}
                    </span>
                    <div className="flex-1">
                      <span className="text-xs text-indigo-600 font-medium">{r.subjectName}</span>
                      <p className="text-slate-800 font-medium mt-1">{r.question}</p>
                    </div>
                  </div>
                  <div className="ml-10 space-y-2">
                    {r.options.map((opt: string, optIdx: number) => (
                      <div key={optIdx} className={`px-3 py-2 rounded-lg text-sm ${
                        optIdx === r.correctAnswer ? "bg-emerald-50 border border-emerald-300 text-emerald-800 font-medium"
                        : optIdx === r.userAnswer && !r.isCorrect ? "bg-red-50 border border-red-300 text-red-800"
                        : "bg-slate-50 text-slate-600"
                      }`}>
                        <span className="font-medium mr-2">{String.fromCharCode(65 + optIdx)}.</span>
                        {opt}
                        {optIdx === r.correctAnswer && <span className="ml-2 text-emerald-600 font-medium">({t("correct")})</span>}
                        {optIdx === r.userAnswer && !r.isCorrect && <span className="ml-2 text-red-600 font-medium">({t("yourAnswer")})</span>}
                      </div>
                    ))}
                  </div>
                  {r.explanation && (
                    <div className="ml-10 mt-3 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
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

  // Test taking screen
  if (pageState === "test" && questions.length > 0) {
    const question = questions[currentQuestion];
    const answeredCount = answers.filter((a) => a !== null).length;
    const isLowTime = timeRemaining < 300; // less than 5 minutes
    const isCriticalTime = timeRemaining < 60;

    return (
      <div className="max-w-4xl mx-auto px-4 py-4">
        {/* Sticky header */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 mb-4 sticky top-16 z-40">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-sm font-semibold text-indigo-600">{examName}</span>
              <span className="text-slate-300 mx-2">|</span>
              <span className="text-sm text-slate-500">{t("mockTest")}</span>
            </div>
            <div className={`text-lg font-mono font-bold px-4 py-1 rounded-lg ${isCriticalTime ? "bg-red-100 text-red-600 animate-pulse" : isLowTime ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-600"}`}>
              {formatTime(timeRemaining)}
            </div>
          </div>

          {/* Progress */}
          <div className="flex gap-0.5">
            {questions.map((_, idx) => (
              <div key={idx} className={`h-1.5 flex-1 rounded-full ${idx === currentQuestion ? "bg-indigo-500" : answers[idx] !== null ? "bg-indigo-300" : "bg-slate-200"}`} />
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
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-indigo-100 text-indigo-700">
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
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50"
                }`}
              >
                <span className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                  answers[currentQuestion] === idx ? "bg-indigo-500 border-indigo-500 text-white" : "border-slate-300 text-slate-400"
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
                className="px-5 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                {t("next")}
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
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
                  idx === currentQuestion ? "bg-indigo-500 text-white"
                  : answers[idx] !== null ? "bg-indigo-100 text-indigo-600"
                  : "bg-slate-100 text-slate-400"
                }`}
                title={q.subjectName}
              >
                {idx + 1}
              </button>
            ))}
          </div>
          <div className="flex gap-4 mt-3 text-xs text-slate-400">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-indigo-500 inline-block" /> {t("current")}</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-indigo-100 inline-block" /> {t("answered", { count: "", total: "" }).trim() || "Answered"}</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-slate-100 inline-block" /> {t("notAnswered")}</span>
          </div>
        </div>

        {/* Submit button (always visible) */}
        {answeredCount > 0 && (
          <div className="mt-4 text-center">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 shadow-lg disabled:opacity-50"
            >
              {isSubmitting ? t("submitting") : `${t("submitTest")} (${answeredCount}/${questions.length} ${t("answered", { count: "", total: "" }).trim() || "answered"})`}
            </button>
          </div>
        )}
      </div>
    );
  }

  // Selection screen (default)
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-3">
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {t("mockTestTitle")}
          </span>
        </h1>
        <p className="text-slate-500 max-w-lg mx-auto mb-6">{t("mockTestSubtitle")}</p>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto relative" ref={searchContainerRef}>
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
              className="w-full px-5 py-3 pl-12 pr-12 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
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

          {/* Search Dropdown */}
          {showSearchDropdown && searchQuery && (
            <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-2xl border border-slate-200 max-h-80 overflow-y-auto z-50">
              {Object.keys(groupedConfigs).length === 0 ? (
                <div className="p-6 text-center text-slate-400">No mock tests found</div>
              ) : (
                Object.keys(groupedConfigs).map((examId) => {
                  const exam = getExamById(examId);
                  const testConfigs = groupedConfigs[examId];
                  return (
                    <div key={examId} className="border-b border-slate-100 last:border-0">
                      <div className="p-3 flex items-center gap-3">
                        <span className="text-2xl">{exam?.icon || "📝"}</span>
                        <div className="flex-1">
                          <div className="font-semibold text-slate-800">{testConfigs[0].examName}</div>
                          <div className="text-xs text-slate-400">{testConfigs.length} test{testConfigs.length > 1 ? 's' : ''} available</div>
                        </div>
                        <button
                          onClick={() => {
                            setSearchQuery("");
                            setShowSearchDropdown(false);
                            const element = document.getElementById(`exam-${examId}`);
                            element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }}
                          className="px-3 py-1.5 text-xs bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100"
                        >
                          View Tests
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>

      {isLoadingConfigs ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6 h-32 shimmer" />
          ))}
        </div>
      ) : (
        <>
          {/* Available Mock Tests - Grid Layout */}
          {Object.keys(groupedConfigs).length === 0 ? (
            <div className="text-center py-12 text-slate-400">No mock tests found matching your search</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
              {Object.keys(groupedConfigs).map((examId) => {
                const exam = getExamById(examId);
                const testConfigs = groupedConfigs[examId];
                const firstConfig = testConfigs[0];

                return (
                  <div
                    key={examId}
                    id={`exam-${examId}`}
                    className="group bg-white rounded-2xl p-5 border-2 border-slate-200 hover:border-indigo-400 hover:shadow-xl transition-all duration-300"
                  >
                    {/* Header */}
                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform"
                        style={{ backgroundColor: (exam?.color || "#6366f1") + "20" }}
                      >
                        {exam?.icon || "📝"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-800 mb-0.5 truncate">{firstConfig.examName}</h3>
                        <p className="text-xs text-slate-400 line-clamp-1">{exam?.description || ""}</p>
                      </div>
                      {testConfigs.length > 1 && (
                        <span className="shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold">
                          {testConfigs.length}
                        </span>
                      )}
                    </div>

                    {/* Quick Stats */}
                    <div className="flex items-center gap-3 mb-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        {firstConfig.totalQuestions} Q
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {firstConfig.timeLimitMinutes}m
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
                        {firstConfig.sections.length} subjects
                      </span>
                    </div>

                    {/* Subjects Tags */}
                    <div className="flex flex-wrap gap-1 mb-4 min-h-[44px]">
                      {firstConfig.sections.slice(0, 3).map((s) => (
                        <span key={s.subjectId} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                          {s.subjectName}
                        </span>
                      ))}
                      {firstConfig.sections.length > 3 && (
                        <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">
                          +{firstConfig.sections.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    {testConfigs.length === 1 ? (
                      <button
                        onClick={() => startTest(firstConfig.examId, firstConfig.testNumber)}
                        className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg text-sm transition-all"
                      >
                        {t("startMockTest")}
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        {testConfigs.map((config) => (
                          <button
                            key={config.testNumber}
                            onClick={() => startTest(config.examId, config.testNumber)}
                            className="flex-1 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg text-sm transition-all"
                          >
                            #{config.testNumber}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Past Mock Tests */}
          {history.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-slate-800 mb-4">{t("pastMockTests")}</h2>
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                {history.filter((h: any) => h.status === "completed").map((h: any, idx: number) => {
                  const exam = getExamById(h.exam_id);
                  const acc = h.total_questions > 0 ? Math.round((h.correct_answers / h.total_questions) * 100) : 0;
                  return (
                    <div key={h.id} className={`px-4 py-3 flex items-center justify-between ${idx > 0 ? "border-t border-slate-100" : ""}`}>
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{exam?.icon || "📝"}</span>
                        <div>
                          <div className="text-sm font-medium text-slate-800">{exam?.name || h.exam_id}</div>
                          <div className="text-xs text-slate-400">
                            {new Date(h.completed_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            {" | "}{formatTime(h.time_taken_seconds)}
                          </div>
                        </div>
                      </div>
                      <div className={`text-lg font-bold ${acc >= 70 ? "text-emerald-600" : acc >= 50 ? "text-amber-600" : "text-red-600"}`}>
                        {acc}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
