"use client";

import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { useUser } from "@/context/user-context";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { calculateStars } from "@/lib/level-definitions";
import { getHeadersWithCsrf } from "@/lib/csrf-client";
import { LoadingSpinner } from "@/components/loading-skeleton";
import { AccessibilityWrapper } from "@/components/accessibility-wrapper";

// Dynamic imports: Only load these modals when actually needed
const RichExplanation = dynamic(
  () => import("@/components/rich-explanation").then((mod) => ({ default: mod.RichExplanation })),
  { loading: () => <LoadingSpinner /> }
);

const AIClarificationChat = dynamic(
  () => import("@/components/ai-clarification-chat").then((mod) => ({ default: mod.AIClarificationChat })),
  { loading: () => <LoadingSpinner /> }
);

const WeaknessTrackerModal = dynamic(
  () => import("@/components/weakness-tracker-modal").then((mod) => ({ default: mod.WeaknessTrackerModal })),
  { loading: () => <LoadingSpinner /> }
);

const LevelCompleteModal = dynamic(
  () => import("@/components/level-complete-modal").then((mod) => ({ default: mod.LevelCompleteModal })),
  { loading: () => <LoadingSpinner /> }
);

const BadgeUnlockModal = dynamic(
  () => import("@/components/badge-unlock-modal").then((mod) => ({ default: mod.BadgeUnlockModal })),
  { loading: () => <LoadingSpinner /> }
);

const QuizCelebration = dynamic(
  () => import("@/components/quiz-celebration").then((mod) => ({ default: mod.QuizCelebration })),
  { loading: () => <div /> }
);

interface Question {
  id?: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: string;
  source?: "ai" | "verified";
  passage?: string; // For reading comprehension, passages, poems, prose
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
        headers: getHeadersWithCsrf(),
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
        <div className="rounded-2xl p-6 max-w-md w-full text-center" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
          <div className="text-3xl mb-3">Thank you!</div>
          <p className="mb-4" style={{ color: "var(--foreground-secondary)" }}>
            Your report has been submitted. This helps us improve question quality.
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#4255FF] text-white rounded-lg hover:bg-[#3242CC]"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="rounded-2xl p-6 max-w-md w-full" style={{ background: "var(--card-bg)" }}>
        <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--foreground)" }}>
          Report Issue
        </h3>
        <p className="text-sm mb-4 line-clamp-2" style={{ color: "var(--muted)" }}>
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
                  : ""
              }`}
              style={issue !== preset ? { borderColor: "var(--card-border)", color: "var(--foreground-secondary)" } : undefined}
            >
              {preset}
            </button>
          ))}
        </div>

        <textarea
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
          placeholder="Or describe the issue in your own words..."
          className="w-full px-3 py-2 border rounded-lg text-sm resize-none h-20 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          style={{ borderColor: "var(--card-border)", background: "var(--card-bg)", color: "var(--foreground)" }}
        />

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg text-sm font-medium"
            style={{ background: "var(--hover-bg)", color: "var(--foreground-secondary)" }}
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
  const router = useRouter();
  const examId = searchParams.get("examId") || "";
  const subjectId = searchParams.get("subjectId") || "";
  const topicParam = searchParams.get("topic") || "";
  const count = parseInt(searchParams.get("count") || "5");
  const difficulty = searchParams.get("difficulty") || "mixed";
  const pressureMode = searchParams.get("pressureMode") === "true";

  // Level mode parameters
  const mode = searchParams.get("mode") || "random"; // "level", "sprint", or "random"
  const levelNumber = parseInt(searchParams.get("levelNumber") || "0");
  const levelName = searchParams.get("levelName") || "";
  const levelType = searchParams.get("levelType") || "normal";
  const isLevelMode = mode === "level";
  const isSprintMode = mode === "sprint";
  const sprintId = searchParams.get("sprintId");

  // Generate effective topic with fallback (prevents empty topics in database)
  const topic = topicParam || (isLevelMode ? (levelName || `Level ${levelNumber}`) : "General");

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
  const [newBadges, setNewBadges] = useState<any[]>([]);

  // Sprint mode state
  const [sprintData, setSprintData] = useState<any>(null);

  // Calculate max time for pressure mode based on questions and difficulty
  const calculateMaxTime = (numQuestions: number, difficultyLevel: string) => {
    // Base time per question by difficulty
    const timePerQuestion = {
      easy: 45,      // 45 seconds per easy question
      medium: 60,    // 1 minute per medium question
      hard: 90,      // 1.5 minutes per hard question
      mixed: 60,     // 1 minute per mixed question
    };

    const baseTime = timePerQuestion[difficultyLevel as keyof typeof timePerQuestion] || 60;
    return numQuestions * baseTime; // Total time in seconds
  };

  const maxTime = useMemo(() => {
    if ((!pressureMode && !isSprintMode) || !quizData) return 0;
    return calculateMaxTime(quizData.questions.length, difficulty);
  }, [pressureMode, isSprintMode, quizData, difficulty]);

  // Timer (counts up in normal mode, counts down in pressure/sprint mode)
  useEffect(() => {
    if (isLoading || isSubmitted) return;

    const timer = setInterval(() => {
      setTimeElapsed((t) => {
        if (pressureMode || isSprintMode) {
          // Countdown mode for both pressure and sprint
          if (t >= maxTime) {
            // Time's up!
            setTimeIsUp(true);
            return maxTime;
          }
          return t + 1;
        } else {
          // Normal count-up mode
          return t + 1;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isLoading, isSubmitted, pressureMode, isSprintMode, maxTime]);

  // Track if time's up for UI warning
  const [timeIsUp, setTimeIsUp] = useState(false);

  // Load quiz
  useEffect(() => {
    async function loadQuiz() {
      try {
        setIsLoading(true);

        // Custom mode: Load from sessionStorage
        if (mode === "custom") {
          const customQuizJson = sessionStorage.getItem('customQuiz');
          if (!customQuizJson) {
            throw new Error("No custom quiz found. Please generate a quiz first.");
          }

          const customQuestions = JSON.parse(customQuizJson);
          setQuizData({
            sessionId: `custom-${Date.now()}`,
            examId: "custom",
            subjectId: "custom",
            topic: "Custom Quiz",
            examName: "Custom Quiz",
            subjectName: "Your Material",
            questions: customQuestions,
          });
          setAnswers(new Array(customQuestions.length).fill(null));
          setIsLoading(false);

          // Clear sessionStorage after loading
          sessionStorage.removeItem('customQuiz');
          return;
        }

        // Sprint mode: Load from sprint data
        if (isSprintMode && sprintId) {
          const sprintRes = await fetch("/api/sprint");
          const sprintData = await sprintRes.json();

          // Find the specific sprint by ID
          const sprint = sprintData.sprints?.find((s: any) => s.sprint.id === sprintId);

          if (sprint) {
            setSprintData(sprint);
            setQuizData({
              sessionId: sprint.sprint.id,
              examId: sprint.sprint.examId,
              subjectId: sprint.sprint.subjectId,
              topic: sprint.sprint.topic || 'Sprint Challenge',
              examName: "Sprint Challenge",
              subjectName: sprint.sprint.topic || 'Mixed Topics',
              questions: sprint.sprint.questions,
            });
            setAnswers(new Array(sprint.sprint.questions.length).fill(null));
            setIsLoading(false);
            return;
          }
        }

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
          headers: getHeadersWithCsrf(),
          body: JSON.stringify(requestBody),
        });

        if (!res.ok) {
          let errData;
          try {
            errData = await res.json();
          } catch {
            // Server returned non-JSON (probably HTML error page)
            throw new Error(`Server error (${res.status}). Please try again.`);
          }
          if (errData.limitReached) {
            setError("LIMIT_REACHED" as any);
            return;
          }
          if (errData.aiBusy) {
            setError("AI_BUSY" as any);
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
  }, [mode, examId, subjectId, topic, count, difficulty, isLevelMode, levelNumber, isSprintMode, sprintId]);

  // Scroll to top when results are shown
  useEffect(() => {
    if (isSubmitted && results) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isSubmitted, results]);

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

  const handleWeaknessSelect = (type: 'calculation' | 'concept' | 'time' | 'careless') => {
    // Close modal immediately for better UX
    setShowWeaknessTracker(false);
    setCurrentWeaknessQuestion(null);

    // Record weakness in background (fire and forget)
    if (currentWeaknessQuestion) {
      fetch('/api/weakness', {
        method: 'POST',
        headers: getHeadersWithCsrf(),
        body: JSON.stringify({
          ...currentWeaknessQuestion,
          weaknessType: type
        })
      }).catch(err => {
        console.error('Failed to record weakness:', err);
      });
    }
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
      // Custom mode: Calculate results locally, don't save to database
      if (mode === "custom") {
        const correctAnswers = quizData.questions.filter(
          (q, i) => answers[i] === q.correctAnswer
        ).length;
        const totalQuestions = quizData.questions.length;
        const accuracy = Math.round((correctAnswers / totalQuestions) * 100);

        // Build per-question results for review section
        const questionResults = quizData.questions.map((q, i) => ({
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          userAnswer: answers[i] ?? -1,
          isCorrect: answers[i] === q.correctAnswer,
          explanation: q.explanation,
          source: 'ai-validated', // Custom questions are AI-generated
        }));

        const localResults = {
          correctAnswers,
          totalQuestions,
          accuracy,
          timeTaken: timeElapsed,
          newBadges: [],
          isNewRecord: false, // Custom quizzes don't track records
          topicsToReview: [], // No review system for custom
          xpGained: 0, // No XP for custom quizzes
          levelUp: null, // No leveling for custom
          results: questionResults, // Per-question breakdown
          isCustomQuiz: true, // Flag to identify custom quiz results
        };

        setResults(localResults);
        setIsSubmitted(true);
        setIsSubmitting(false);
        return;
      }

      // Normal mode: Submit to API
      const res = await fetch("/api/quiz", {
        method: "PUT",
        headers: getHeadersWithCsrf(),
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

      if (!res.ok) {
        let errorMsg = "Failed to submit quiz";
        try {
          const errData = await res.json();
          errorMsg = errData.error || errData.message || errorMsg;
        } catch {
          // Response wasn't JSON
        }
        throw new Error(errorMsg);
      }
      const data = await res.json();
      setResults(data);
      setIsSubmitted(true);

      // Show badge unlock modal if new badges earned
      if (data.newBadges && data.newBadges.length > 0) {
        setNewBadges(data.newBadges);
      }

      // If in level mode, also complete the level
      if (isLevelMode) {
        const levelRes = await fetch("/api/quiz/complete-level", {
          method: "POST",
          headers: getHeadersWithCsrf(),
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

          // Show badge unlock modal if new badges earned from level completion
          if (levelData.newBadges && levelData.newBadges.length > 0) {
            setNewBadges(levelData.newBadges);
          }

          // If they passed (60%+ for normal, 70%+ for boss), mark level as passed
          // This clears the question cache so they get new questions next time
          if (levelData.nextLevelUnlocked) {
            await fetch("/api/quiz/level", {
              method: "PUT",
              headers: getHeadersWithCsrf(),
              body: JSON.stringify({
                examId: quizData.examId,
                subjectId: quizData.subjectId,
                levelNumber,
              }),
            });
          }
        }
      }

      // If in sprint mode, submit to sprint API
      if (isSprintMode && sprintId) {
        try {
          await fetch("/api/sprint", {
            method: "POST",
            headers: getHeadersWithCsrf(),
            body: JSON.stringify({
              sprintId,
              score: data.correctAnswers,
              totalQuestions: data.totalQuestions,
              timeTaken: timeElapsed,
            }),
          });
        } catch (err) {
          console.error("Failed to submit sprint:", err);
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
    // Verified: PYQ/NCERT/Manual review (green badge)
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

    // Expert Curated: AI-generated with quality standards (blue badge)
    // Includes: expert-curated, validated-ai, ai, or any other source
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-[#E8EAFF] text-[#3242CC]">
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
        <div className="rounded-2xl p-12 shadow-lg border border-amber-200" style={{ background: "var(--card-bg)" }}>
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-amber-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2" style={{ color: "var(--foreground)" }}>
            Daily Limit Reached
          </h2>
          <p className="mb-6" style={{ color: "var(--muted)" }}>
            Free users can take 10 quizzes per day. Upgrade to Pro for unlimited practice!
          </p>
          <div className="flex gap-3 justify-center">
            <a
              href="/pricing"
              className="px-6 py-3 bg-[#4255FF] text-white font-semibold rounded-xl shadow-lg"
            >
              Upgrade to Pro
            </a>
            <a
              href="/"
              className="px-6 py-3 font-medium rounded-xl"
              style={{ background: "var(--hover-bg)", color: "var(--foreground-secondary)" }}
            >
              Go Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  // AI service degraded — free-tier model upstream is slow or rate-limited.
  // Topic isn't cached yet, so we can't return verified/cached fallback either.
  if (error && (error as any) === "AI_BUSY") {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="rounded-2xl p-12 shadow-lg border border-[#90CAF9]" style={{ background: "var(--card-bg)" }}>
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#E8EAFF] flex items-center justify-center">
            <svg className="w-8 h-8 text-[#4255FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2" style={{ color: "var(--foreground)" }}>
            AI is warming up
          </h2>
          <p className="mb-2" style={{ color: "var(--foreground-secondary)" }}>
            Our question generator is a bit slow for <span className="font-medium">{topic}</span> right now,
            and this topic isn&apos;t cached yet.
          </p>
          <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
            Try again in a few seconds, or pick a different topic — popular ones are usually instant.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={() => {
                setError(null);
                setIsLoading(true);
                // Re-trigger the load effect by updating a dummy state via reload
                window.location.reload();
              }}
              className="px-6 py-3 bg-[#4255FF] text-white font-semibold rounded-xl shadow-lg"
            >
              Retry
            </button>
            <a
              href={examId && subjectId ? `/?examId=${examId}&subjectId=${subjectId}` : "/"}
              className="px-6 py-3 font-medium rounded-xl"
              style={{ background: "var(--hover-bg)", color: "var(--foreground-secondary)" }}
            >
              Pick another topic
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
        <div className="rounded-2xl p-12 shadow-lg border" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#E8EAFF] flex items-center justify-center">
            <svg
              className="animate-spin h-8 w-8 text-[#4255FF]"
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
          <h2 className="text-xl font-semibold mb-2" style={{ color: "var(--foreground)" }}>
            Preparing Your Quiz...
          </h2>
          <p style={{ color: "var(--muted)" }}>
            {isLevelMode ? (
              <>Preparing Level {levelNumber} questions...</>
            ) : isSprintMode ? (
              <>Loading sprint challenge questions...</>
            ) : (
              <>Selecting {count} questions on &quot;{topic}&quot; from our question bank</>
            )}
          </p>
          <p className="text-sm mt-2" style={{ color: "var(--muted)" }}>
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
        <div className="rounded-2xl p-12 shadow-lg border border-red-200" style={{ background: "var(--card-bg)" }}>
          <div className="text-4xl mb-4">!</div>
          <h2 className="text-xl font-semibold mb-2" style={{ color: "var(--danger)" }}>
            Oops! Something went wrong
          </h2>
          <p className="mb-6" style={{ color: "var(--muted)" }}>{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-[#4255FF] text-white rounded-lg hover:bg-[#3242CC]"
            >
              Try Again
            </button>
            <a
              href="/"
              className="px-6 py-2 rounded-lg"
              style={{ background: "var(--hover-bg)", color: "var(--foreground-secondary)" }}
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
            color: "var(--success)",
            bg: "var(--hover-bg)",
          }
        : percentage >= 70
          ? { label: "Good Job!", color: "var(--primary)", bg: "var(--hover-bg)" }
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
        {/* Badge Unlock Modal */}
        {newBadges.length > 0 && (
          <BadgeUnlockModal
            badges={newBadges}
            onClose={() => setNewBadges([])}
          />
        )}

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

        {/* Celebration Animation */}
        <QuizCelebration
          accuracy={percentage}
          correctAnswers={results.correctAnswers}
          totalQuestions={results.totalQuestions}
          isNewRecord={results.isNewRecord}
        />

        {/* Score Card */}
        <div className="rounded-2xl p-8 shadow-lg border text-center mb-8" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
          <p className="mb-6" style={{ color: "var(--muted)" }}>
            Time: {formatTime(results.timeTaken)}
          </p>

          <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto mb-6">
            <div className="rounded-xl p-3" style={{ background: "var(--hover-bg)" }}>
              <div className="text-lg font-bold" style={{ color: "var(--success)" }}>
                {results.correctAnswers}
              </div>
              <div className="text-xs" style={{ color: "var(--muted)" }}>Correct</div>
            </div>
            <div className="bg-red-50 rounded-xl p-3">
              <div className="text-lg font-bold text-red-600">
                {results.totalQuestions - results.correctAnswers}
              </div>
              <div className="text-xs" style={{ color: "var(--muted)" }}>Wrong</div>
            </div>
            <div className="rounded-xl p-3" style={{ background: "var(--hover-bg)" }}>
              <div className="text-lg font-bold" style={{ color: "var(--foreground-secondary)" }}>
                {formatTime(results.timeTaken)}
              </div>
              <div className="text-xs" style={{ color: "var(--muted)" }}>Time</div>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            {isSprintMode ? (
              <a
                href="/sprint"
                className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 font-medium"
              >
                View Leaderboard
              </a>
            ) : (
              <>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-[#4255FF] text-white rounded-lg hover:bg-[#3242CC] font-medium"
                >
                  Retry Same Topic
                </button>
                <a
                  href="/"
                  className="px-6 py-2 rounded-lg font-medium"
                  style={{ background: "var(--hover-bg)", color: "var(--foreground-secondary)" }}
                >
                  New Quiz
                </a>
              </>
            )}
            <a
              href="/dashboard"
              className="px-6 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 font-medium"
            >
              Dashboard
            </a>
          </div>
        </div>

        {/* Question-by-question review */}
        <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--foreground)" }}>
          Review Answers
        </h3>
        <div className="space-y-4">
          {results.results.map((r: any, idx: number) => (
            <div
              key={idx}
              className={`rounded-xl p-5 border-2 ${
                r.isCorrect ? "" : "border-red-200"
              }`}
              style={{ background: "var(--card-bg)", borderColor: r.isCorrect ? "var(--card-border)" : undefined }}
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
                  <p className="font-medium" style={{ color: "var(--foreground)" }}>{r.question}</p>
                </div>
                {/* Report button */}
                <button
                  onClick={() => setReportQuestion(quizData.questions[idx])}
                  className="shrink-0 hover:text-red-500 p-1"
                  style={{ color: "var(--muted)" }}
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
                        ? "border border-emerald-300 text-emerald-800 font-medium"
                        : optIdx === r.userAnswer && !r.isCorrect
                          ? "bg-red-50 border border-red-300 text-red-800"
                          : ""
                    }`}
                    style={optIdx === r.correctAnswer
                      ? { background: "var(--hover-bg)" }
                      : optIdx === r.userAnswer && !r.isCorrect
                        ? undefined
                        : { background: "var(--hover-bg)", color: "var(--foreground-secondary)" }
                    }
                  >
                    <span className="font-medium mr-2">
                      {String.fromCharCode(65 + optIdx)}.
                    </span>
                    {opt}
                    {optIdx === r.correctAnswer && (
                      <span className="ml-2 font-medium" style={{ color: "var(--muted)" }}>
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
                  <div className="p-3 rounded-lg text-sm" style={{ background: "var(--hover-bg)", color: "var(--primary)" }}>
                    <strong>Explanation:</strong> {r.explanation}
                  </div>
                ) : (
                  <RichExplanation
                    explanation={r.explanation}
                    correctAnswer={r.correctAnswer}
                    userAnswer={r.userAnswer ?? -1}
                    options={r.options}
                    questionId={r.id}
                    examId={examId}
                    subjectId={subjectId}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Quality note at bottom of results */}
        <div className="mt-6 p-4 rounded-xl border text-sm" style={{ background: "var(--hover-bg)", borderColor: "var(--card-border)", color: "var(--foreground-secondary)" }}>
          <strong>Quality First:</strong> Our questions are sourced from NCERT textbooks, previous year papers, and curated by subject experts. If you spot any error, please use the report button — our team reviews every report to maintain high accuracy.
        </div>
      </div>
    );
  }

  // Quiz screen
  const question = quizData.questions[currentQuestion];
  const answeredCount = answers.filter((a) => a !== null).length;
  const isCurrentAnswered = answers[currentQuestion] !== null;
  const isLastQuestion = currentQuestion === quizData.questions.length - 1;

  // Context-aware back navigation
  const backHref = isSprintMode
    ? "/sprint"
    : isLevelMode
    ? `/quiz/levels?examId=${quizData.examId}&subjectId=${quizData.subjectId}`
    : quizData.examId && quizData.subjectId
    ? `/?examId=${quizData.examId}&subjectId=${quizData.subjectId}`
    : "/";

  function handleBack() {
    if (
      !isSubmitted &&
      answers.some((a) => a !== null) &&
      !window.confirm("Leave this quiz? Your progress will be lost.")
    ) {
      return;
    }
    router.push(backHref);
  }

  // Safety check: if question is undefined, show error
  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="rounded-2xl p-8 shadow-lg border max-w-md text-center" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl text-red-600">⚠️</span>
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: "var(--foreground)" }}>Question Loading Error</h2>
          <p className="mb-6" style={{ color: "var(--foreground-secondary)" }}>Unable to load question data. Please try starting a new quiz.</p>
          <button
            onClick={() => window.location.href = '/quiz/levels'}
            className="px-6 py-3 bg-[#4255FF] text-white rounded-lg hover:bg-[#3242CC] transition-colors"
          >
            Start New Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-2 min-h-screen flex flex-col pb-8">
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

      {/* Back Button - Standalone Floating */}
      <button
        onClick={handleBack}
        className="inline-flex items-center gap-1.5 mb-3 px-3 py-2 text-sm font-medium hover:text-[#4255FF] border rounded-lg transition-colors shadow-sm shrink-0 self-start"
        style={{ color: "var(--foreground-secondary)", background: "var(--card-bg)", borderColor: "var(--card-border)" }}
        aria-label="Back"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      {/* Quiz Header */}
      <div className="rounded-lg p-2.5 shadow-sm border mb-2 shrink-0" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            {isLevelMode && (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Level {levelNumber}
              </span>
            )}
            <span className="text-sm font-medium text-[#4255FF]">
              {quizData.examName}
            </span>
            <span style={{ color: "var(--muted)" }}>|</span>
            <span className="text-sm" style={{ color: "var(--muted)" }}>
              {quizData.subjectName}
            </span>
            <span style={{ color: "var(--muted)" }}>|</span>
            <span className="text-sm" style={{ color: "var(--muted)" }}>
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
            {isSprintMode && (
              <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-1 rounded-full animate-pulse flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
                </svg>
                SPRINT
              </span>
            )}
            <span className={`text-sm font-mono px-3 py-1 rounded-lg ${
              (pressureMode || isSprintMode)
                ? (() => {
                    const remaining = maxTime - timeElapsed;
                    const percentage = (remaining / maxTime) * 100;
                    if (percentage > 50) return "text-green-700 bg-green-100";
                    if (percentage > 25) return "text-orange-700 bg-orange-100 animate-pulse";
                    if (percentage > 10) return "text-red-700 bg-red-100 animate-pulse";
                    return "text-red-900 bg-red-200 animate-bounce font-bold";
                  })()
                : ""
            }`} style={!(pressureMode || isSprintMode) ? { color: "var(--foreground-secondary)", background: "var(--hover-bg)" } : undefined}>
              {(pressureMode || isSprintMode) ? (
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  {formatTime(Math.max(0, maxTime - timeElapsed))}
                </span>
              ) : (
                formatTime(timeElapsed)
              )}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex gap-1">
          {quizData.questions.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 flex-1 rounded-full ${
                idx === currentQuestion
                  ? "bg-slate-500"
                  : answers[idx] !== null
                    ? "bg-indigo-300"
                    : ""
              }`}
              style={idx !== currentQuestion && answers[idx] === null ? { background: "var(--card-border)" } : undefined}
            />
          ))}
        </div>
        <div className="flex justify-between mt-1.5 text-xs" style={{ color: "var(--muted)" }}>
          <span>
            Question {currentQuestion + 1} of {quizData.questions.length}
          </span>
          <span>
            {answeredCount} of {quizData.questions.length} answered
          </span>
        </div>
      </div>

      {/* Time's Up Warning Banner */}
      {(pressureMode || isSprintMode) && timeIsUp && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${isSprintMode ? 'bg-orange-600' : 'bg-red-600'} text-white px-4 py-3 rounded-lg shadow-lg mb-2 flex items-center justify-between`}
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="font-bold">{isSprintMode ? 'Sprint Ended!' : "Time's Up!"}</span>
            <span className={isSprintMode ? "text-orange-100" : "text-red-100"}>
              {isSprintMode ? 'The sprint challenge has ended. Submit now!' : 'Please submit your quiz now.'}
            </span>
          </div>
          <button
            onClick={submitQuiz}
            disabled={isSubmitting}
            className={`px-4 py-1.5 bg-white ${isSprintMode ? 'text-orange-600 hover:bg-orange-50' : 'text-red-600 hover:bg-red-50'} font-semibold rounded-lg disabled:opacity-50`}
          >
            {isSubmitting ? "Submitting..." : "Submit Now"}
          </button>
        </motion.div>
      )}

      {/* Question Card */}
      <motion.div
        key={currentQuestion}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="rounded-xl shadow-lg border overflow-hidden mb-2 shrink-0"
        style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
      >
        {/* Colored Header Strip */}
        <div className={`h-1 bg-gradient-to-r ${
          (question?.difficulty || "medium") === "easy"
            ? "from-emerald-500 to-green-500"
            : (question?.difficulty || "medium") === "hard"
            ? "from-red-500 to-pink-500"
            : "from-amber-500 to-orange-500"
        }`} />

        <div className="p-3 md:p-4">
          {/* Meta Bar */}
          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Question Number Badge */}
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#E8EAFF] text-[#3242CC] text-xs font-semibold">
                Q {currentQuestion + 1}/{quizData.questions.length}
              </span>

              {/* Difficulty Badge */}
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                (question?.difficulty || "medium") === "easy"
                  ? "bg-emerald-50"
                  : (question?.difficulty || "medium") === "hard"
                  ? "bg-red-50"
                  : "bg-amber-50"
              }`}>
                <span className={`w-2 h-2 rounded-full mr-2 bg-gradient-to-r ${
                  (question?.difficulty || "medium") === "easy"
                    ? "from-emerald-500 to-green-500"
                    : (question?.difficulty || "medium") === "hard"
                    ? "from-red-500 to-pink-500"
                    : "from-amber-500 to-orange-500"
                }`} />
                {((question?.difficulty || "medium").charAt(0).toUpperCase() +
                  (question?.difficulty || "medium").slice(1))}
              </span>

              {/* Source Badge */}
              <SourceBadge source={question.source} />
            </div>

            {/* Report Button */}
            <button
              onClick={() => setReportQuestion(question)}
              className="p-2 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors"
              style={{ color: "var(--muted)" }}
              title="Report issue"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
              </svg>
            </button>
          </div>

          {/* Passage/Context (for Reading Comprehension) */}
          {question.passage && (
            <div className="mb-4 p-4 rounded-lg border" style={{ background: "var(--hover-bg)", borderColor: "var(--card-border)" }}>
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-[#4255FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="text-xs font-semibold text-[#4255FF] uppercase">Passage</span>
              </div>
              <div className="text-sm leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto" style={{ color: "var(--foreground-secondary)" }}>
                {question.passage}
              </div>
            </div>
          )}

          {/* Question Text */}
          <div className="mb-3">
            <h2 className="text-lg md:text-xl font-semibold leading-relaxed" style={{ color: "var(--foreground)" }}>
              {question.question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {question.options.map((option, idx) => {
              const isSelected = answers[currentQuestion] === idx;
              const isCorrect = idx === question.correctAnswer;
              const isWrong = showExplanation && isSelected && !isCorrect;

              return (
                <motion.button
                  key={idx}
                  onClick={() => !showExplanation && selectAnswer(idx)}
                  disabled={showExplanation}
                  whileHover={!showExplanation ? { scale: 1.01, y: -1 } : {}}
                  whileTap={!showExplanation ? { scale: 0.99 } : {}}
                  className={`
                    w-full flex items-center gap-2.5 p-4 rounded-lg border-2 text-left transition-all
                    ${
                      showExplanation && isCorrect
                        ? "border-green-400 shadow-lg shadow-green-100"
                        : isWrong
                        ? "border-red-400 shadow-lg shadow-red-100"
                        : isSelected
                        ? "border-[#4255FF] shadow-lg shadow-indigo-100"
                        : "border-[var(--card-border)] hover:border-[#90CAF9] shadow-sm"
                    }
                    ${showExplanation ? "cursor-default" : "cursor-pointer"}
                  `}
                  style={{
                    background: showExplanation && isCorrect
                      ? "rgb(220, 252, 231)"
                      : isWrong
                      ? "rgb(254, 226, 226)"
                      : isSelected
                      ? "#E8EAFF"
                      : "var(--card-bg)",
                    color: showExplanation && isCorrect
                      ? "#166534"
                      : isWrong
                      ? "#7f1d1d"
                      : isSelected
                      ? "#1e3a8a"
                      : "var(--foreground)"
                  }}
                >
                  {/* Option Letter Circle */}
                  <span
                    className={`
                      shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all
                      ${
                        showExplanation && isCorrect
                          ? "bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-md"
                          : isWrong
                          ? "bg-gradient-to-br from-red-500 to-pink-500 text-white shadow-md"
                          : isSelected
                          ? "bg-gradient-to-br from-[#4255FF] to-purple-500 text-white shadow-md"
                          : "border border-[var(--card-border)]"
                      }
                    `}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>

                  {/* Option Text */}
                  <span className="flex-1 text-sm leading-relaxed pt-1" style={{ color: "inherit" }}>
                    {option}
                  </span>

                  {/* Status Icon */}
                  {showExplanation && (
                    <span className="shrink-0">
                      {isCorrect ? (
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : isWrong ? (
                        <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      ) : null}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Explanation Section - Separate from options */}
      {showExplanation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="rounded-xl shadow-lg border p-4 mt-4 shrink-0 max-h-56 overflow-y-auto"
          style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
        >
          <RichExplanation
            explanation={question.explanation}
            correctAnswer={question.correctAnswer}
            userAnswer={answers[currentQuestion] ?? -1}
            options={question.options}
            questionId={question.id}
            examId={examId}
            subjectId={subjectId}
          />
        </motion.div>
      )}

      {/* Navigation - Centered */}
      <div className={`flex items-center justify-center gap-3 shrink-0 ${showExplanation ? 'mt-4' : 'mt-6'}`}>
        <button
          onClick={prevQuestion}
          disabled={currentQuestion === 0}
          className="px-4 py-3 text-sm font-semibold border-2 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
          style={{ color: "var(--foreground-secondary)", background: "var(--card-bg)", borderColor: "var(--card-border)" }}
        >
          ← Previous
        </button>
          {!showExplanation && isCurrentAnswered && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={checkAnswer}
              className="px-6 py-3 text-sm font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 shadow-md hover:shadow-lg transition-all"
            >
              ✓ Check Answer
            </motion.button>
          )}

          {showExplanation && !isLastQuestion && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={nextQuestion}
              className="px-6 py-3 text-sm font-bold bg-[#4255FF] text-white rounded-lg shadow-md hover:shadow-lg hover:bg-[#3244EE] transition-all"
            >
              Next Question →
            </motion.button>
          )}

          {!isLastQuestion && !showExplanation && (
            <button
              onClick={nextQuestion}
              className="px-4 py-3 text-sm font-semibold border-2 rounded-lg transition-all shadow-sm"
              style={{ color: "var(--foreground-secondary)", background: "var(--card-bg)", borderColor: "var(--card-border)" }}
            >
              Skip →
            </button>
          )}

          {(isLastQuestion || answeredCount === quizData.questions.length) && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={submitQuiz}
              disabled={isSubmitting}
              className="px-6 py-2 text-sm font-bold bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg hover:from-emerald-600 hover:to-green-600 shadow-md hover:shadow-lg disabled:opacity-50 transition-all"
            >
              {isSubmitting ? "Submitting..." : "Submit Quiz"}
            </motion.button>
          )}
      </div>

      {/* Quick navigation dots - Always visible at bottom */}
      <div className="flex justify-center gap-1.5 mt-4 shrink-0 pb-4">
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
                  ? "bg-[#E8EAFF] text-[#4255FF]"
                  : ""
            }`}
            style={idx !== currentQuestion && answers[idx] === null ? { background: "var(--hover-bg)", color: "var(--muted)" } : undefined}
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

      {/* AI Chat Sidebar - Fixed on Right Side, Aligned with Question */}
      {showExplanation && answers[currentQuestion] !== question.correctAnswer && answers[currentQuestion] !== null && (
        <div
          className="hidden xl:block fixed w-96 overflow-y-auto"
          style={{
            right: '1rem',
            top: '14rem',
            bottom: '2rem', // Add bottom spacing to prevent footer overlap
            maxHeight: 'calc(100vh - 16rem)', // Account for top + bottom spacing
          }}
        >
          <AIClarificationChat
            questionText={
              typeof question.explanation === 'string'
                ? question.explanation
                : (question.explanation as any).logic || question.question
            }
            correctAnswer={question.options[question.correctAnswer]}
            userAnswer={question.options[answers[currentQuestion]!]}
          />
        </div>
      )}
    </>
  );
}

export default function QuizPage() {
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();

  // Redirect contributors to contributor portal
  useEffect(() => {
    if (!userLoading && user && ["contributor", "admin"].includes(user.role || "")) {
      router.push("/contributor");
    }
  }, [user, userLoading, router]);
  return (
    <AccessibilityWrapper>
      <Suspense
        fallback={
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <div className="rounded-2xl p-12 shadow-lg border" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#E8EAFF] flex items-center justify-center">
              <svg
                className="animate-spin h-8 w-8 text-[#4255FF]"
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
            <h2 className="text-xl font-semibold" style={{ color: "var(--foreground)" }}>
              Loading...
            </h2>
          </div>
        </div>
      }
    >
      <QuizContent />
      </Suspense>
    </AccessibilityWrapper>
  );
}
