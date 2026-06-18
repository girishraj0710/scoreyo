"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/context/user-context";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { getPathById, getTopicById } from "@/lib/english-content";
import { ChevronLeft, Clock, CheckCircle2, XCircle, Loader2, BookOpen } from "lucide-react";
import { getHeadersWithCsrf } from "@/lib/csrf-client";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: string;
}

type QuizState = "loading" | "quiz" | "results";

export default function EnglishPracticePage() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const pathId = params.pathId as string;
  const topicId = params.topicId as string;
  const questionCount = parseInt(searchParams.get("count") || "10");

  const path = getPathById(pathId);
  const topic = path ? getTopicById(pathId, topicId) : null;

  const [quizState, setQuizState] = useState<QuizState>("loading");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [startTime, setStartTime] = useState(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");

  // Timer - updates every second
  useEffect(() => {
    if (quizState !== "quiz") return;

    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [quizState, startTime]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user && path && topic) {
      // Check if this topic requires special interface (not MCQ quiz)
      const specialTopicMap: Record<string, string> = {
        'ielts-speaking': '/english/foundation/ielts-speaking/practice',
        'ielts-writing': '/english/special/ielts-writing',
        'ielts-listening': '/english/special/ielts-listening',
        'pronunciation': '/english/special/pronunciation-practice',
        'pronunciation-basics': '/english/special/pronunciation-practice',
        'pronunciation-practice': '/english/special/pronunciation-practice',
        'paragraph-writing': '/english/special/paragraph-writing',
        'essay-writing': '/english/special/essay-writing',
        'essay-writing-basics': '/english/special/essay-writing',
        'letter-writing': '/english/special/letter-writing',
        'email-writing': '/english/special/email-writing',
        'listening-skills': '/english/special/listening-skills',
        'presentations': '/english/special/presentations',
        'daily-conversations': '/english/special/daily-conversations',
        'toefl-integrated': '/english/special/toefl-integrated',
      };

      if (specialTopicMap[topicId]) {
        // Add from parameters to coming-soon URLs so back button works correctly
        let redirectUrl = specialTopicMap[topicId];
        if (redirectUrl.includes('/coming-soon')) {
          redirectUrl += `&from=${pathId}&fromTopic=${topicId}`;
        }
        router.push(redirectUrl);
        return;
      }

      fetchQuestions();
    }
  }, [user, path, topic, topicId, router]);

  const fetchQuestions = async () => {
    setQuizState("loading");
    setError("");
    setWarning("");

    try {
      const res = await fetch("/api/english/practice", {
        method: "POST",
        headers: getHeadersWithCsrf(),
        body: JSON.stringify({
          pathId,
          topicId,
          level: topic?.level || "beginner",
          count: questionCount,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch questions");
      }

      const data = await res.json();

      if (!data.questions || data.questions.length === 0) {
        setError("No questions available for this topic yet. We're working on adding more content!");
        return;
      }

      // Check if we got fewer questions than requested
      if (data.warning) {
        setWarning(data.warning);
      }

      setQuestions(data.questions);
      setUserAnswers(new Array(data.questions.length).fill(null));
      setStartTime(Date.now());
      setQuizState("quiz");
    } catch (err) {
      setError("Failed to load questions. Please try again.");
      console.error(err);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentIndex] = answerIndex;
    setUserAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    const correctCount = questions.filter((q, idx) => userAnswers[idx] === q.correctAnswer).length;

    try {
      await fetch("/api/english/submit", {
        method: "POST",
        headers: getHeadersWithCsrf(),
        body: JSON.stringify({
          pathId,
          topicId,
          level: topic?.level || "beginner",
          totalQuestions: questions.length,
          correctAnswers: correctCount,
          timeTaken,
        }),
      });
    } catch (err) {
      console.error("Failed to save progress:", err);
    }

    setQuizState("results");
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--card-bg)" }}>
        <div className="w-12 h-12 border-4 rounded-full animate-spin" style={{ borderColor: "var(--muted)", borderTopColor: "var(--foreground)" }}></div>
      </div>
    );
  }

  if (!path || !topic) {
    return (
      <div className="min-h-screen" style={{ background: "var(--card-bg)" }}>
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--foreground)" }}>Topic not found</h1>
          <button
            onClick={() => router.push('/english')}
            className="hover:underline"
            style={{ color: "var(--foreground)" }}
          >
            ← Back to English Hub
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const correctCount = questions.filter((q, idx) => userAnswers[idx] === q.correctAnswer).length;
  const accuracy = questions.length > 0 ? (correctCount / questions.length) * 100 : 0;

  return (
    <div className="min-h-screen" style={{ background: "var(--card-bg)" }}>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {quizState === "loading" && (
          <div className="text-center py-16">
            {error ? (
              <div>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: "var(--hover-bg)" }}>
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-xl font-bold mb-2" style={{ color: "var(--foreground)" }}>Oops!</h2>
                <p className="mb-6" style={{ color: "var(--foreground-secondary)" }}>{error}</p>
                <button
                  onClick={() => router.push(`/english/${pathId}/${topicId}`)}
                  className="px-6 py-3 bg-[#4255FF] text-white rounded-lg hover:bg-[#3242CC] transition-colors"
                >
                  Go Back
                </button>
              </div>
            ) : (
              <div>
                <Loader2 className="w-12 h-12 mx-auto mb-4 text-[#4255FF] animate-spin" />
                <p className="text-slate-600">Loading questions...</p>
              </div>
            )}
          </div>
        )}

        {/* Quiz State */}
        {quizState === "quiz" && currentQuestion && (
          <div>
            {/* Header */}
            <div className="mb-6">
              <button
                onClick={() => router.push(`/english/${pathId}/${topicId}`)}
                className="flex items-center gap-2 mb-4 transition-colors"
                style={{ color: "var(--foreground-secondary)" }}
              >
                <ChevronLeft className="w-5 h-5" />
                Back to {topic.name}
              </button>

              {/* Progress Bar */}
              <div
                className="rounded-xl p-4 shadow-sm mb-4 transition-all"
                style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", borderWidth: "1px", borderStyle: "solid" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 1px 3px 0 rgb(0 0 0 / 0.1)";
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                    Question {currentIndex + 1} of {questions.length}
                  </span>
                  <span className="text-sm flex items-center gap-1" style={{ color: "var(--foreground-secondary)" }}>
                    <Clock className="w-4 h-4" />
                    {Math.floor(elapsedSeconds / 60)}m {elapsedSeconds % 60}s
                  </span>
                </div>
                <div className="w-full rounded-full h-2" style={{ background: "var(--hover-bg)" }}>
                  <div
                    className="bg-gradient-to-r from-[#4255FF] to-purple-500 h-2 rounded-full transition-all"
                    style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Warning Message */}
              {warning && (
                <div className="rounded-lg p-4 mb-4" style={{ background: "var(--hover-bg)", borderColor: "var(--card-border)", borderWidth: "1px", borderStyle: "solid" }}>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5">ℹ️</div>
                    <p className="text-sm" style={{ color: "var(--foreground)" }}>{warning}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Question */}
            <div
              className="rounded-2xl p-8 shadow-sm mb-6 transition-all"
              style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", borderWidth: "1px", borderStyle: "solid" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 1px 3px 0 rgb(0 0 0 / 0.1)";
              }}
            >
              <div className="mb-2">
                <span className="px-3 py-1 text-xs font-medium rounded-full" style={{ background: "var(--hover-bg)", color: "var(--foreground)" }}>
                  {currentQuestion.difficulty}
                </span>
              </div>
              <h2 className="text-xl font-bold mb-6" style={{ color: "var(--foreground)" }}>
                {currentQuestion.question}
              </h2>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswerSelect(idx)}
                    className="w-full text-left p-4 rounded-xl border-2 transition-all"
                    style={{
                      borderColor: userAnswers[currentIndex] === idx ? "#4255FF" : "var(--card-border)",
                      background: userAnswers[currentIndex] === idx ? "var(--hover-bg)" : "var(--card-bg)"
                    }}
                    onMouseEnter={(e) => {
                      if (userAnswers[currentIndex] !== idx) {
                        e.currentTarget.style.borderColor = "var(--primary)";
                        e.currentTarget.style.background = "var(--hover-bg)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (userAnswers[currentIndex] !== idx) {
                        e.currentTarget.style.borderColor = "var(--card-border)";
                        e.currentTarget.style.background = "var(--card-bg)";
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                        style={{
                          borderColor: userAnswers[currentIndex] === idx ? "#4255FF" : "var(--muted)",
                          background: userAnswers[currentIndex] === idx ? "#4255FF" : "transparent",
                          color: userAnswers[currentIndex] === idx ? "white" : "var(--foreground)"
                        }}
                      >
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span style={{ color: "var(--foreground)" }}>{option}</span>
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
                style={{ borderColor: "var(--card-border)", color: "var(--foreground)", background: "var(--card-bg)" }}
                onMouseEnter={(e) => {
                  if (currentIndex > 0) {
                    e.currentTarget.style.borderColor = "var(--primary)";
                    e.currentTarget.style.background = "var(--hover-bg)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--card-border)";
                  e.currentTarget.style.background = "var(--card-bg)";
                }}
              >
                Previous
              </button>

              {currentIndex === questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={userAnswers.some(a => a === null)}
                  className="px-6 py-3 bg-[#4255FF] text-white rounded-lg hover:bg-[#3242CC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Quiz
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
        {quizState === "results" && (
          <div>
            {/* Results Header */}
            <div className="rounded-2xl p-8 text-white mb-6" style={{ background: "var(--foreground)" }}>
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: "rgba(255, 255, 255, 0.2)" }}>
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h1 className="text-3xl font-bold mb-2">Quiz Complete!</h1>
                <p style={{ opacity: 0.8 }}>Great job! Here's how you did:</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-1">{correctCount}/{questions.length}</div>
                  <div className="text-sm" style={{ opacity: 0.8 }}>Correct</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-1">{accuracy.toFixed(0)}%</div>
                  <div className="text-sm" style={{ opacity: 0.8 }}>Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-1">
                    {Math.floor(elapsedSeconds / 60)}m
                  </div>
                  <div className="text-sm" style={{ opacity: 0.8 }}>Time</div>
                </div>
              </div>
            </div>

            {/* Question Review */}
            <div className="space-y-4 mb-6">
              <h2 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>Review Your Answers</h2>
              {questions.map((q, idx) => {
                const isCorrect = userAnswers[idx] === q.correctAnswer;
                return (
                  <div
                    key={idx}
                    className="rounded-xl p-6 shadow-sm transition-all"
                    style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", borderWidth: "1px", borderStyle: "solid" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.1)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "0 1px 3px 0 rgb(0 0 0 / 0.1)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          background: isCorrect ? "var(--hover-bg)" : "var(--hover-bg)",
                          color: isCorrect ? "rgb(16, 185, 129)" : "rgb(239, 68, 68)"
                        }}
                      >
                        {isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium mb-2" style={{ color: "var(--foreground)" }}>
                          {idx + 1}. {q.question}
                        </p>
                        <div className="space-y-1 mb-3">
                          {q.options.map((opt, optIdx) => (
                            <div
                              key={optIdx}
                              className="p-2 rounded text-sm"
                              style={{
                                background: optIdx === q.correctAnswer
                                  ? "var(--hover-bg)"
                                  : optIdx === userAnswers[idx]
                                  ? "var(--hover-bg)"
                                  : "transparent",
                                color: optIdx === q.correctAnswer
                                  ? "rgb(16, 185, 129)"
                                  : optIdx === userAnswers[idx]
                                  ? "rgb(239, 68, 68)"
                                  : "var(--foreground-secondary)"
                              }}
                            >
                              {String.fromCharCode(65 + optIdx)}. {opt}
                              {optIdx === q.correctAnswer && " ✓"}
                              {optIdx === userAnswers[idx] && optIdx !== q.correctAnswer && " ✗"}
                            </div>
                          ))}
                        </div>
                        <div className="border-l-4 border-blue-500 p-3 text-sm" style={{ background: "var(--hover-bg)", color: "var(--foreground)" }}>
                          <strong>Explanation:</strong> {q.explanation}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Study Material Recommendation (if score < 70%) */}
            {accuracy < 70 && (
              <div
                className="mb-6 rounded-xl p-6 border-2"
                style={{
                  background: "var(--card-bg)",
                  borderColor: "#4255FF"
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(66, 85, 255, 0.1)" }}>
                    <BookOpen className="w-6 h-6 text-[#4255FF]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-2" style={{ color: "var(--foreground)" }}>
                      📚 Review Study Material
                    </h3>
                    <p className="text-sm mb-4" style={{ color: "var(--foreground-secondary)" }}>
                      Your score is {accuracy.toFixed(0)}%. We recommend reviewing the study material for this topic to strengthen your understanding before practicing again.
                    </p>
                    <button
                      onClick={() => router.push(`/english/${pathId}/${topicId}/study`)}
                      className="px-6 py-2.5 bg-[#4255FF] text-white rounded-lg hover:bg-[#3242CC] transition-colors font-medium"
                    >
                      Go to Study Material →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => router.push(`/english/${pathId}/${topicId}/study`)}
                className="flex-1 px-6 py-3 border-2 rounded-lg hover:transition-colors"
                style={{ borderColor: "#4255FF", color: "#4255FF", background: "var(--card-bg)" }}
              >
                📖 Study Material
              </button>
              <button
                onClick={() => router.push(`/english/${pathId}/${topicId}`)}
                className="flex-1 px-6 py-3 border-2 rounded-lg hover:transition-colors"
                style={{ borderColor: "var(--card-border)", color: "var(--foreground)", background: "var(--card-bg)" }}
              >
                Back to Topic
              </button>
              <button
                onClick={() => {
                  setQuizState("loading");
                  setCurrentIndex(0);
                  setUserAnswers([]);
                  fetchQuestions();
                }}
                className="flex-1 px-6 py-3 text-white rounded-lg hover:transition-colors"
                style={{ background: "var(--foreground)" }}
              >
                Practice Again
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
