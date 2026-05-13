"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { RichExplanation } from "@/components/rich-explanation";
import { WeaknessTrackerModal } from "@/components/weakness-tracker-modal";
import { LevelCompleteModal } from "@/components/level-complete-modal";
import { calculateStars } from "@/lib/level-definitions";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: string;
  source?: "ai" | "verified";
}

interface QuizData {
  sessionId: string;
  examId: string;
  subjectId: string;
  topic: string;
  examName: string;
  subjectName: string;
  questions: Question[];
  meta?: {
    verifiedCount: number;
    cachedCount: number;
    aiCount: number;
    totalInBank: number;
    totalInCache: number;
  };
}

function ReportModal({
  question,
  examId,
  subjectId,
  topic,
  onClose,
}: {
  question: Question;
  examId: string;
  subjectId: string;
  topic: string;
  onClose: () => void;
}) {
  const [issue, setIssue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!issue.trim()) return;
    setIsSubmitting(true);
    try {
      await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId,
          subjectId,
          topic,
          questionText: question.question,
          issue: issue.trim(),
        }),
      });
      setSubmitted(true);
    } catch {
      // ignore
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full text-center">
          <div className="text-3xl mb-3">Thank you!</div>
          <p className="text-slate-600 mb-4">
            Your report has been submitted. This helps us improve question quality.
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">
          Report Issue
        </h3>
        <p className="text-sm text-slate-500 mb-4 line-clamp-2">
          &quot;{question.question.substring(0, 100)}...&quot;
        </p>

        <div className="space-y-2 mb-4">
          {[
            "Wrong answer marked as correct",
            "Explanation is incorrect",
            "Question is unclear or ambiguous",
            "Options are incorrect or duplicated",
            "Question is outdated / not in syllabus",
          ].map((preset) => (
            <button
              key={preset}
              onClick={() => setIssue(preset)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm border ${
                issue === preset
                  ? "border-red-400 bg-red-50 text-red-700"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {preset}
            </button>
          ))}
        </div>

        <textarea
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
          placeholder="Or describe the issue in your own words..."
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm resize-none h-20 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!issue.trim() || isSubmitting}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </button>
        </div>
      </div>
    </div>
  );
}

function QuizContent() {
  const searchParams = useSearchParams();
  const examId = searchParams.get("examId") || "";
  const subjectId = searchParams.get("subjectId") || "";
  const topic = searchParams.get("topic") || "";
  const count = parseInt(searchParams.get("count") || "5");
  const difficulty = searchParams.get("difficulty") || "mixed";
  const pressureMode = searchParams.get("pressureMode") === "true";

  // Level mode parameters
  const mode = searchParams.get("mode") || "random"; // "level" or "random"
  const levelNumber = parseInt(searchParams.get("levelNumber") || "0");
  const levelName = searchParams.get("levelName") || "";
  const levelType = searchParams.get("levelType") || "normal";
  const isLevelMode = mode === "level";

  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportQuestion, setReportQuestion] = useState<Question | null>(null);
  const [showWeaknessTracker, setShowWeaknessTracker] = useState(false);
  const [currentWeaknessQuestion, setCurrentWeaknessQuestion] = useState<{
    examId: string;
    subjectId: string;
    topic: string;
  } | null>(null);

  // Level completion modal state
  const [showLevelCompleteModal, setShowLevelCompleteModal] = useState(false);
  const [levelCompletionData, setLevelCompletionData] = useState<any>(null);

  // Timer (adaptive in pressure mode)
  useEffect(() => {
    if (isLoading || isSubmitted) return;

    // In pressure mode, timer accelerates based on time elapsed
    const getTimerInterval = () => {
      if (!pressureMode) return 1000; // Normal: 1 second

      // Pressure mode: speeds up as time passes
      if (timeElapsed < 60) return 1000;      // First minute: normal
      if (timeElapsed < 120) return 900;      // 2nd minute: 10% faster
      if (timeElapsed < 180) return 800;      // 3rd minute: 20% faster
      if (timeElapsed < 240) return 700;      // 4th minute: 30% faster
      return 600;                              // After 4 min: 40% faster (insane!)
    };

    const interval = getTimerInterval();
    const timer = setInterval(() => setTimeElapsed((t) => t + 1), interval);
    return () => clearInterval(timer);
  }, [isLoading, isSubmitted, timeElapsed, pressureMode]);

  // Load quiz
  useEffect(() => {
    async function loadQuiz() {
      try {
        setIsLoading(true);

        // Use level-specific API if in level mode
        const apiEndpoint = isLevelMode ? "/api/quiz/level" : "/api/quiz";
        const requestBody = isLevelMode
          ? {
              examId,
              subjectId,
              levelNumber,
              topic,
              numberOfQuestions: count,
              difficulty,
            }
          : {
              examId,
              subjectId,
              topic,
              numberOfQuestions: count,
              difficulty,
            };

        const res = await fetch(apiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });

        if (!res.ok) {
          const errData = await res.json();
          if (errData.limitReached) {
            setError("LIMIT_REACHED" as any);
            return;
          }
          throw new Error(errData.error || "Failed to generate quiz");
        }
        const data = await res.json();
        setQuizData(data);
        setAnswers(new Array(data.questions.length).fill(null));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    loadQuiz();
  }, [examId, subjectId, topic, count, difficulty, isLevelMode, levelNumber]);

  const selectAnswer = useCallback(
    (optionIndex: number) => {
      if (showExplanation) return;
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = optionIndex;
      setAnswers(newAnswers);
    },
    [answers, currentQuestion, showExplanation]
  );

  const checkAnswer = () => {
    setShowExplanation(true);

    // Show weakness tracker if answer is wrong
    if (quizData && answers[currentQuestion] !== null) {
      const question = quizData.questions[currentQuestion];
      const isCorrect = answers[currentQuestion] === question.correctAnswer;

      if (!isCorrect) {
        setCurrentWeaknessQuestion({
          examId: quizData.examId,
          subjectId: quizData.subjectId,
          topic: quizData.topic
        });
        setShowWeaknessTracker(true);
      }
    }
  };

  const handleWeaknessSelect = async (type: 'calculation' | 'concept' | 'time' | 'careless') => {
    if (currentWeaknessQuestion) {
      try {
        await fetch('/api/weakness', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...currentWeaknessQuestion,
            weaknessType: type
          })
        });
      } catch (err) {
        console.error('Failed to record weakness:', err);
      }
    }
    setShowWeaknessTracker(false);
    setCurrentWeaknessQuestion(null);
  };

  const handleWeaknessSkip = () => {
    setShowWeaknessTracker(false);
    setCurrentWeaknessQuestion(null);
  };

  const nextQuestion = () => {
    setShowExplanation(false);
    if (currentQuestion < (quizData?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    setShowExplanation(false);
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitQuiz = async () => {
    if (!quizData) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/quiz", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: quizData.sessionId,
          examId: quizData.examId,
          subjectId: quizData.subjectId,
          topic: quizData.topic,
          questions: quizData.questions,
          answers,
          timeTaken: timeElapsed,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit quiz");
      const data = await res.json();
      setResults(data);
      setIsSubmitted(true);

      // If in level mode, also complete the level
      if (isLevelMode) {
        const levelRes = await fetch("/api/quiz/complete-level", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            examId: quizData.examId,
            subjectId: quizData.subjectId,
            levelNumber,
            levelType,
            correctAnswers: data.correctAnswers,
            totalQuestions: data.totalQuestions,
            timeTakenSeconds: timeElapsed,
          }),
        });

        if (levelRes.ok) {
          const levelData = await levelRes.json();
          setLevelCompletionData({
            stars: levelData.stars,
            accuracy: levelData.accuracy,
            nextLevelUnlocked: levelData.nextLevelUnlocked,
          });
          setShowLevelCompleteModal(true);

          // If they passed (60%+ for normal, 70%+ for boss), mark level as passed
          // This clears the question cache so they get new questions next time
          if (levelData.nextLevelUnlocked) {
            await fetch("/api/quiz/level", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                examId: quizData.examId,
                subjectId: quizData.subjectId,
                levelNumber,
              }),
            });
          }
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Source badge component
  const SourceBadge = ({ source }: { source?: string }) => {
    if (source === "verified") {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          PYQ / NCERT
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
        </svg>
        Expert Curated
      </span>
    );
  };

  // Limit reached state
  if (error && (error as any) === "LIMIT_REACHED") {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl p-12 shadow-lg border border-amber-200">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-amber-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            Daily Limit Reached
          </h2>
          <p className="text-slate-500 mb-6">
            Free users can take 3 quizzes per day. Upgrade to Pro for unlimited practice!
          </p>
          <div className="flex gap-3 justify-center">
            <a
              href="/pricing"
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-500 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-violet-600 shadow-lg"
            >
              Upgrade to Pro
            </a>
            <a
              href="/"
              className="px-6 py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200"
            >
              Go Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl p-12 shadow-lg border border-slate-200">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-indigo-100 flex items-center justify-center">
            <svg
              className="animate-spin h-8 w-8 text-indigo-600"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            Preparing Your Quiz...
          </h2>
          <p className="text-slate-500">
            {isLevelMode ? (
              <>Preparing Level {levelNumber} questions...</>
            ) : (
              <>Selecting {count} questions on &quot;{topic}&quot; from our question bank</>
            )}
          </p>
          <p className="text-sm text-slate-400 mt-2">
            Almost ready...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl p-12 shadow-lg border border-red-200">
          <div className="text-4xl mb-4">!</div>
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-slate-500 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Try Again
            </button>
            <a
              href="/"
              className="px-6 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
            >
              Go Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!quizData) return null;

  // Level Complete Modal (for level mode)
  if (showLevelCompleteModal && levelCompletionData && quizData && results) {
    return (
      <>
        <LevelCompleteModal
          isOpen={showLevelCompleteModal}
          levelNumber={levelNumber}
          levelName={levelName}
          stars={levelCompletionData.stars}
          accuracy={levelCompletionData.accuracy}
          correctAnswers={results.correctAnswers}
          totalQuestions={results.totalQuestions}
          timeTaken={timeElapsed}
          isBossLevel={levelType === "boss"}
          isNewLevel={levelCompletionData.nextLevelUnlocked}
          onNextLevel={() => {
            // Go back to level map to start next level
            window.location.href = `/quiz/levels?examId=${quizData.examId}&subjectId=${quizData.subjectId}`;
          }}
          onReplay={() => {
            // Reload same level
            window.location.reload();
          }}
          onClose={() => {
            // Show regular results screen
            setShowLevelCompleteModal(false);
          }}
        />
        {/* Regular results screen shown after closing modal */}
        {!showLevelCompleteModal && (
          <div className="max-w-3xl mx-auto px-4 py-8">
            {/* Results content will be visible after modal closes */}
          </div>
        )}
      </>
    );
  }

  // Results screen
  if (isSubmitted && results) {
    const percentage = results.accuracy;
    const grade =
      percentage >= 90
        ? {
            label: "Excellent!",
            color: "text-slate-500",
            bg: "bg-slate-50",
          }
        : percentage >= 70
          ? { label: "Good Job!", color: "text-indigo-600", bg: "bg-slate-50" }
          : percentage >= 50
            ? {
                label: "Keep Practicing!",
                color: "text-amber-600",
                bg: "bg-amber-50",
              }
            : {
                label: "Needs Improvement",
                color: "text-red-600",
                bg: "bg-red-50",
              };

    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Report Modal */}
        {reportQuestion && (
          <ReportModal
            question={reportQuestion}
            examId={quizData.examId}
            subjectId={quizData.subjectId}
            topic={quizData.topic}
            onClose={() => setReportQuestion(null)}
          />
        )}

        {/* Score Card */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 text-center mb-8">
          <h2 className={`text-2xl font-bold ${grade.color} mb-2`}>
            {grade.label}
          </h2>
          <div className="text-6xl font-bold text-slate-800 mb-2">
            {percentage}%
          </div>
          <p className="text-slate-500 mb-6">
            {results.correctAnswers} out of {results.totalQuestions} correct |
            Time: {formatTime(results.timeTaken)}
          </p>

          <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto mb-6">
            <div className={`${grade.bg} rounded-xl p-3`}>
              <div className="text-lg font-bold text-slate-500">
                {results.correctAnswers}
              </div>
              <div className="text-xs text-slate-500">Correct</div>
            </div>
            <div className="bg-red-50 rounded-xl p-3">
              <div className="text-lg font-bold text-red-600">
                {results.totalQuestions - results.correctAnswers}
              </div>
              <div className="text-xs text-slate-500">Wrong</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <div className="text-lg font-bold text-slate-600">
                {formatTime(results.timeTaken)}
              </div>
              <div className="text-xs text-slate-500">Time</div>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
            >
              Retry Same Topic
            </button>
            <a
              href="/"
              className="px-6 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium"
            >
              New Quiz
            </a>
            <a
              href="/dashboard"
              className="px-6 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 font-medium"
            >
              Dashboard
            </a>
          </div>
        </div>

        {/* Question-by-question review */}
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Review Answers
        </h3>
        <div className="space-y-4">
          {results.results.map((r: any, idx: number) => (
            <div
              key={idx}
              className={`bg-white rounded-xl p-5 border-2 ${
                r.isCorrect ? "border-slate-200" : "border-red-200"
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                <span
                  className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                    r.isCorrect ? "bg-cyan-400" : "bg-red-500"
                  }`}
                >
                  {idx + 1}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <SourceBadge source={r.source} />
                  </div>
                  <p className="text-slate-800 font-medium">{r.question}</p>
                </div>
                {/* Report button */}
                <button
                  onClick={() => setReportQuestion(quizData.questions[idx])}
                  className="shrink-0 text-slate-400 hover:text-red-500 p-1"
                  title="Report incorrect question"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                  </svg>
                </button>
              </div>

              <div className="ml-10 space-y-2">
                {r.options.map((opt: string, optIdx: number) => (
                  <div
                    key={optIdx}
                    className={`px-3 py-2 rounded-lg text-sm ${
                      optIdx === r.correctAnswer
                        ? "bg-slate-50 border border-emerald-300 text-emerald-800 font-medium"
                        : optIdx === r.userAnswer && !r.isCorrect
                          ? "bg-red-50 border border-red-300 text-red-800"
                          : "bg-slate-50 text-slate-600"
                    }`}
                  >
                    <span className="font-medium mr-2">
                      {String.fromCharCode(65 + optIdx)}.
                    </span>
                    {opt}
                    {optIdx === r.correctAnswer && (
                      <span className="ml-2 text-slate-500 font-medium">
                        (Correct)
                      </span>
                    )}
                    {optIdx === r.userAnswer && !r.isCorrect && (
                      <span className="ml-2 text-red-600 font-medium">
                        (Your Answer)
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className="ml-10 mt-3">
                {typeof r.explanation === 'string' ? (
                  <div className="p-3 bg-slate-50 rounded-lg text-sm text-blue-800">
                    <strong>Explanation:</strong> {r.explanation}
                  </div>
                ) : (
                  <RichExplanation
                    explanation={r.explanation}
                    correctAnswer={r.correctAnswer}
                    userAnswer={r.userAnswer ?? -1}
                    options={r.options}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Quality note at bottom of results */}
        <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-indigo-800">
          <strong>Quality First:</strong> Our questions are sourced from NCERT textbooks, previous year papers, and curated by subject experts. If you spot any error, please use the 🚩 report button — our team reviews every report to maintain high accuracy.
        </div>
      </div>
    );
  }

  // Quiz screen
  const question = quizData.questions[currentQuestion];
  const answeredCount = answers.filter((a) => a !== null).length;
  const isCurrentAnswered = answers[currentQuestion] !== null;
  const isLastQuestion = currentQuestion === quizData.questions.length - 1;

  // Safety check: if question is undefined, show error
  if (!question) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl text-red-600">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Question Loading Error</h2>
          <p className="text-slate-600 mb-6">Unable to load question data. Please try starting a new quiz.</p>
          <button
            onClick={() => window.location.href = '/quiz/levels'}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Start New Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Report Modal */}
      {reportQuestion && (
        <ReportModal
          question={reportQuestion}
          examId={quizData.examId}
          subjectId={quizData.subjectId}
          topic={quizData.topic}
          onClose={() => setReportQuestion(null)}
        />
      )}

      {/* Quiz Header */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {isLevelMode && (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Level {levelNumber}
              </span>
            )}
            <span className="text-sm font-medium text-indigo-600">
              {quizData.examName}
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-sm text-slate-500">
              {quizData.subjectName}
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-sm text-slate-500">
              {isLevelMode ? levelName : quizData.topic}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {pressureMode && (
              <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-1 rounded-full animate-pulse flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                PRESSURE
              </span>
            )}
            <span className={`text-sm font-mono px-3 py-1 rounded-lg ${
              pressureMode
                ? timeElapsed < 120
                  ? "text-orange-700 bg-orange-100 animate-pulse"
                  : timeElapsed < 240
                    ? "text-red-700 bg-red-100 animate-pulse"
                    : "text-red-900 bg-red-200 animate-bounce font-bold"
                : "text-slate-600 bg-slate-100"
            }`}>
              {formatTime(timeElapsed)}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex gap-1">
          {quizData.questions.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 flex-1 rounded-full ${
                idx === currentQuestion
                  ? "bg-slate-500"
                  : answers[idx] !== null
                    ? "bg-indigo-300"
                    : "bg-slate-200"
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-slate-400">
          <span>
            Question {currentQuestion + 1} of {quizData.questions.length}
          </span>
          <span>
            {answeredCount} of {quizData.questions.length} answered
          </span>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 mb-6">
        {/* Top bar: difficulty + source + report */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${
                (question?.difficulty || "medium") === "easy"
                  ? "bg-emerald-100 text-emerald-700"
                  : (question?.difficulty || "medium") === "hard"
                    ? "bg-red-100 text-red-700"
                    : "bg-amber-100 text-amber-700"
              }`}
            >
              {((question?.difficulty || "medium").charAt(0).toUpperCase() +
                (question?.difficulty || "medium").slice(1))}
            </span>
            <SourceBadge source={question.source} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">
              Q{currentQuestion + 1}
            </span>
            <button
              onClick={() => setReportQuestion(question)}
              className="text-slate-400 hover:text-red-500 p-1"
              title="Report incorrect question"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
              </svg>
            </button>
          </div>
        </div>

        {/* Question text */}
        <h2 className="text-lg font-medium text-slate-800 mb-6 leading-relaxed">
          {question.question}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option, idx) => {
            let optionClass = "quiz-option";
            if (showExplanation) {
              optionClass += " disabled";
              if (idx === question.correctAnswer) {
                optionClass += " correct";
              } else if (
                idx === answers[currentQuestion] &&
                idx !== question.correctAnswer
              ) {
                optionClass += " incorrect";
              }
            } else if (answers[currentQuestion] === idx) {
              optionClass += " selected";
            }

            return (
              <button
                key={idx}
                onClick={() => selectAnswer(idx)}
                disabled={showExplanation}
                className={`${optionClass} w-full flex items-center gap-3 p-4 rounded-xl border-2 border-slate-200 text-left`}
              >
                <span
                  className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                    showExplanation && idx === question.correctAnswer
                      ? "bg-cyan-400 border-emerald-500 text-white"
                      : showExplanation &&
                          idx === answers[currentQuestion] &&
                          idx !== question.correctAnswer
                        ? "bg-red-500 border-red-500 text-white"
                        : answers[currentQuestion] === idx
                          ? "bg-slate-500 border-indigo-500 text-white"
                          : "border-slate-300 text-slate-400"
                  }`}
                >
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-slate-700">{option}</span>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <RichExplanation
            explanation={question.explanation}
            correctAnswer={question.correctAnswer}
            userAnswer={answers[currentQuestion] ?? -1}
            options={question.options}
          />
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevQuestion}
          disabled={currentQuestion === 0}
          className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <div className="flex gap-2">
          {!showExplanation && isCurrentAnswered && (
            <button
              onClick={checkAnswer}
              className="px-5 py-2 text-sm font-medium bg-amber-500 text-white rounded-lg hover:bg-amber-600"
            >
              Check Answer
            </button>
          )}

          {showExplanation && !isLastQuestion && (
            <button
              onClick={nextQuestion}
              className="px-5 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Next Question
            </button>
          )}

          {!isLastQuestion && !showExplanation && (
            <button
              onClick={nextQuestion}
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
            >
              Skip
            </button>
          )}

          {(isLastQuestion || answeredCount === quizData.questions.length) && (
            <button
              onClick={submitQuiz}
              disabled={isSubmitting}
              className="px-6 py-2 text-sm font-medium bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Quiz"}
            </button>
          )}
        </div>

        {!isLastQuestion && (
          <button
            onClick={nextQuestion}
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
          >
            Next
          </button>
        )}
        {isLastQuestion && <div />}
      </div>

      {/* Quick navigation dots */}
      <div className="flex justify-center gap-2 mt-6">
        {quizData.questions.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setShowExplanation(false);
              setCurrentQuestion(idx);
            }}
            className={`w-8 h-8 rounded-full text-xs font-medium ${
              idx === currentQuestion
                ? "bg-slate-500 text-white"
                : answers[idx] !== null
                  ? "bg-indigo-100 text-indigo-600"
                  : "bg-slate-100 text-slate-400"
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      {/* Weakness Tracker Modal */}
      {showWeaknessTracker && (
        <WeaknessTrackerModal
          onSelect={handleWeaknessSelect}
          onSkip={handleWeaknessSkip}
        />
      )}
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-2xl p-12 shadow-lg border border-slate-200">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-indigo-100 flex items-center justify-center">
              <svg
                className="animate-spin h-8 w-8 text-indigo-600"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-800">
              Loading...
            </h2>
          </div>
        </div>
      }
    >
      <QuizContent />
    </Suspense>
  );
}
