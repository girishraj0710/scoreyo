"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/context/user-context";
import { ChevronLeft, Clock, CheckCircle2, XCircle, Flame } from "lucide-react";
import { BadgeUnlockModal } from "@/components/badge-unlock-modal";
import { getHeadersWithCsrf } from "@/lib/csrf-client";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: string;
}

interface DPPData {
  dpp: {
    id: string;
    date: string;
    title: string;
    exam: string;
    subject: string;
    topic: string;
    questions: Question[];
    duration: number;
  };
  completed: boolean;
  completionData: {
    score: number;
    total_questions: number;
  } | null;
  streak: number;
}

type State = "loading" | "practice" | "results";

export default function DPPPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const params = useParams();
  const dppId = params.id as string;

  const [state, setState] = useState<State>("loading");
  const [data, setData] = useState<DPPData | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [startTime, setStartTime] = useState(Date.now());
  const [error, setError] = useState("");
  const [newBadges, setNewBadges] = useState<any[]>([]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      fetchDPP();
    }
  }, [user, dppId]);

  const fetchDPP = async () => {
    setState("loading");
    setError("");

    try {
      const res = await fetch("/api/dpp");
      if (!res.ok) {
        throw new Error("Failed to fetch DPP");
      }

      const dppData: DPPData = await res.json();

      // Check if DPP ID matches (in case of navigation issues)
      if (dppData.dpp.id !== dppId) {
        // Redirect to correct DPP ID
        router.replace(`/dpp/${dppData.dpp.id}`);
        return;
      }

      // If already completed, show results immediately
      if (dppData.completed) {
        setData(dppData);
        setState("results");
        return;
      }

      setData(dppData);
      setUserAnswers(new Array(dppData.dpp.questions.length).fill(null));
      setStartTime(Date.now());
      setState("practice");
    } catch (err) {
      console.error(err);
      setError("Failed to load DPP. Please try again.");
      setState("loading");
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentIndex] = answerIndex;
    setUserAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIndex < (data?.dpp.questions.length || 0) - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (!data) return;

    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    const correctCount = data.dpp.questions.filter(
      (q, idx) => userAnswers[idx] === q.correctAnswer
    ).length;

    try {
      const res = await fetch("/api/dpp", {
        method: "POST",
        headers: getHeadersWithCsrf(),
        body: JSON.stringify({
          dppId: data.dpp.id,
          score: correctCount,
          totalQuestions: data.dpp.questions.length,
        }),
      });

      const result = await res.json();

      // Show badge unlock modal if new badges earned
      if (result.newBadges && result.newBadges.length > 0) {
        setNewBadges(result.newBadges);
      }

      // Update completion data
      setData({
        ...data,
        completed: true,
        completionData: {
          score: correctCount,
          total_questions: data.dpp.questions.length,
        },
      });
    } catch (err) {
      console.error("Failed to save progress:", err);
    }

    setState("results");
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#90CAF9] border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (state === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          {error ? (
            <div>
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Oops!</h2>
              <p className="text-slate-600 mb-6">{error}</p>
              <button
                onClick={() => router.push("/dashboard")}
                className="px-6 py-3 bg-[#4255FF] text-white rounded-lg hover:bg-[#3242CC] transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          ) : (
            <div>
              <div className="w-12 h-12 mx-auto mb-4 border-4 border-[#90CAF9] border-t-indigo-600 rounded-full animate-spin"></div>
              <p className="text-slate-600">Loading today's practice...</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const currentQuestion = state === "practice" && data.dpp.questions[currentIndex];
  const correctCount =
    state === "results"
      ? data.completionData?.score || 0
      : data.dpp.questions.filter((q, idx) => userAnswers[idx] === q.correctAnswer).length;
  const accuracy =
    data.dpp.questions.length > 0 ? (correctCount / data.dpp.questions.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Badge Unlock Modal */}
      {newBadges.length > 0 && (
        <BadgeUnlockModal
          badges={newBadges}
          onClose={() => setNewBadges([])}
        />
      )}

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Practice State */}
        {state === "practice" && currentQuestion && (
          <div>
            {/* Header */}
            <div className="mb-6">
              <button
                onClick={() => router.push("/dashboard")}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                Back to Dashboard
              </button>

              {/* Progress Bar */}
              <div className="bg-[var(--card-bg)] rounded-xl p-4 shadow-sm border border-[var(--card-border)] mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-sm font-semibold text-[#4255FF]">
                      {data.dpp.title}
                    </span>
                    {data.streak > 0 && (
                      <div className="flex items-center gap-1 mt-1 text-orange-500">
                        <Flame className="w-4 h-4" />
                        <span className="text-xs font-medium">{data.streak}-day streak</span>
                      </div>
                    )}
                  </div>
                  <span className="text-sm text-slate-500 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {Math.floor((Date.now() - startTime) / 1000 / 60)}m{" "}
                    {Math.floor((Date.now() - startTime) / 1000 % 60)}s
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-[#4255FF] to-purple-500 h-2 rounded-full transition-all"
                    style={{
                      width: `${((currentIndex + 1) / data.dpp.questions.length) * 100}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-xs text-slate-400">
                  <span>
                    Question {currentIndex + 1} of {data.dpp.questions.length}
                  </span>
                  <span>
                    {userAnswers.filter((a) => a !== null).length} answered
                  </span>
                </div>
              </div>
            </div>

            {/* Question */}
            <div className="bg-[var(--card-bg)] rounded-2xl p-8 shadow-sm border border-[var(--card-border)] mb-6">
              <div className="mb-2">
                <span className="px-3 py-1 bg-[#E8EAFF] text-[#3242CC] text-xs font-medium rounded-full">
                  {currentQuestion.difficulty}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-6">
                {currentQuestion.question}
              </h2>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswerSelect(idx)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      userAnswers[currentIndex] === idx
                        ? "border-[#4255FF] bg-[#E8EAFF]"
                        : "border-[var(--card-border)]"
                    }`}
                    onMouseEnter={(e) => {
                      if (userAnswers[currentIndex] !== idx) {
                        e.currentTarget.style.borderColor = "var(--foreground-secondary)";
                        e.currentTarget.style.background = "var(--primary-bg)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (userAnswers[currentIndex] !== idx) {
                        e.currentTarget.style.borderColor = "var(--card-border)";
                        e.currentTarget.style.background = "transparent";
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          userAnswers[currentIndex] === idx
                            ? "border-[#4255FF] bg-[#4255FF] text-white"
                            : "border-slate-300"
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className="text-slate-800">{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="px-6 py-3 border-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ borderColor: "var(--card-border)", color: "var(--foreground)" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "var(--primary-bg)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                Previous
              </button>

              {currentIndex === data.dpp.questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={userAnswers.some((a) => a === null)}
                  className="px-6 py-3 bg-[#4255FF] text-white rounded-lg hover:bg-[#3242CC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit DPP
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-[#4255FF] text-white rounded-lg hover:bg-[#3242CC] transition-colors"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        )}

        {/* Results State */}
        {state === "results" && (
          <div>
            {/* Results Header */}
            <div className="bg-gradient-to-r from-[#4255FF] to-purple-600 rounded-2xl p-8 text-white mb-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto mb-4 bg-[var(--card-bg)]/20 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h1 className="text-3xl font-bold mb-2">DPP Complete!</h1>
                <p className="text-indigo-100">Great job completing today's practice!</p>
                {data.streak > 0 && (
                  <div className="flex items-center justify-center gap-2 mt-3 text-orange-300">
                    <Flame className="w-6 h-6" />
                    <span className="text-lg font-bold">{data.streak}-day streak!</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-1">
                    {correctCount}/{data.dpp.questions.length}
                  </div>
                  <div className="text-indigo-100 text-sm">Correct</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-1">{accuracy.toFixed(0)}%</div>
                  <div className="text-indigo-100 text-sm">Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-1">
                    {Math.floor((Date.now() - startTime) / 1000 / 60)}m
                  </div>
                  <div className="text-indigo-100 text-sm">Time</div>
                </div>
              </div>
            </div>

            {/* Question Review */}
            <div className="space-y-4 mb-6">
              <h2 className="text-xl font-bold text-slate-900">Review Your Answers</h2>
              {data.dpp.questions.map((q, idx) => {
                const isCorrect = userAnswers[idx] === q.correctAnswer;
                return (
                  <div
                    key={idx}
                    className="bg-[var(--card-bg)] rounded-xl p-6 shadow-sm border border-[var(--card-border)]"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isCorrect
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {isCorrect ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <XCircle className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900 mb-2">
                          {idx + 1}. {q.question}
                        </p>
                        <div className="space-y-1 mb-3">
                          {q.options.map((opt, optIdx) => (
                            <div
                              key={optIdx}
                              className={`p-2 rounded text-sm ${
                                optIdx === q.correctAnswer
                                  ? "bg-emerald-50 text-emerald-700 font-medium"
                                  : optIdx === userAnswers[idx]
                                  ? "bg-red-50 text-red-700"
                                  : "text-slate-600"
                              }`}
                            >
                              {String.fromCharCode(65 + optIdx)}. {opt}
                              {optIdx === q.correctAnswer && " ✓"}
                              {optIdx === userAnswers[idx] &&
                                optIdx !== q.correctAnswer &&
                                " ✗"}
                            </div>
                          ))}
                        </div>
                        <div className="bg-[#E8EAFF] border-l-4 border-blue-500 p-3 text-sm text-slate-700">
                          <strong>Explanation:</strong> {q.explanation}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => router.push("/dashboard")}
                className="flex-1 px-6 py-3 bg-[#4255FF] text-white rounded-lg hover:bg-[#3242CC] transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
