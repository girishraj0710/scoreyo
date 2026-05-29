"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/context/user-context";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { getPathById, getTopicById } from "@/lib/english-content";
import { ChevronLeft, Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react";
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
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");

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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!path || !topic) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Topic not found</h1>
          <button
            onClick={() => router.push('/english')}
            className="text-indigo-600 hover:underline"
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {quizState === "loading" && (
          <div className="text-center py-16">
            {error ? (
              <div>
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Oops!</h2>
                <p className="text-slate-600 mb-6">{error}</p>
                <button
                  onClick={() => router.push(`/english/${pathId}/${topicId}`)}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Go Back
                </button>
              </div>
            ) : (
              <div>
                <Loader2 className="w-12 h-12 mx-auto mb-4 text-indigo-600 animate-spin" />
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
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                Back to {topic.name}
              </button>

              {/* Progress Bar */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">
                    Question {currentIndex + 1} of {questions.length}
                  </span>
                  <span className="text-sm text-slate-500 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {Math.floor((Date.now() - startTime) / 1000 / 60)}m {Math.floor((Date.now() - startTime) / 1000 % 60)}s
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all"
                    style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Warning Message */}
              {warning && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5">ℹ️</div>
                    <p className="text-sm text-yellow-800">{warning}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Question */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 mb-6">
              <div className="mb-2">
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
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
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          userAnswers[currentIndex] === idx
                            ? "border-indigo-500 bg-indigo-500 text-white"
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
                className="px-6 py-3 border-2 border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {currentIndex === questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={userAnswers.some(a => a === null)}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Quiz
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
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
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white mb-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h1 className="text-3xl font-bold mb-2">Quiz Complete!</h1>
                <p className="text-indigo-100">Great job! Here's how you did:</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-1">{correctCount}/{questions.length}</div>
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
              {questions.map((q, idx) => {
                const isCorrect = userAnswers[idx] === q.correctAnswer;
                return (
                  <div key={idx} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isCorrect ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
                        }`}
                      >
                        {isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
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
                              {optIdx === userAnswers[idx] && optIdx !== q.correctAnswer && " ✗"}
                            </div>
                          ))}
                        </div>
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-3 text-sm text-slate-700">
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
                onClick={() => router.push(`/english/${pathId}/${topicId}`)}
                className="flex-1 px-6 py-3 border-2 border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
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
                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
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
