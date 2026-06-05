"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/context/user-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { levelAssessmentQuestions } from "@/lib/english-content";
import { Target, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";

type AssessmentState = "intro" | "quiz" | "results";
type UserLevel = "beginner" | "intermediate" | "advanced";

export default function EnglishAssessmentPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  const [state, setState] = useState<AssessmentState>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [detectedLevel, setDetectedLevel] = useState<UserLevel>("beginner");
  const [recommendedPath, setRecommendedPath] = useState("");

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  const handleStart = () => {
    setState("quiz");
    setCurrentIndex(0);
    setUserAnswers([]);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...userAnswers, answerIndex];
    setUserAnswers(newAnswers);

    if (currentIndex < levelAssessmentQuestions.length - 1) {
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
      }, 300);
    } else {
      // Calculate level based on answers
      const score = levelAssessmentQuestions.reduce((total, q, idx) => {
        return total + (newAnswers[idx] === q.correctAnswer ? 1 : 0);
      }, 0);

      let level: UserLevel = "beginner";
      let path = "foundation";

      // Score ranges for 20 questions:
      // Beginner: 0-7 (0-35%)
      // Intermediate: 8-14 (40-70%)
      // Advanced: 15-20 (75-100%)
      if (score <= 7) {
        level = "beginner";
        path = "foundation";
      } else if (score <= 14) {
        level = "intermediate";
        path = "competitive-exam";
      } else {
        level = "advanced";
        path = "ielts-toefl";
      }

      setDetectedLevel(level);
      setRecommendedPath(path);
      setState("results");
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--card-bg)" }}>
        <div className="w-12 h-12 border-4 rounded-full animate-spin" style={{ borderColor: "var(--muted)", borderTopColor: "var(--foreground)" }}></div>
      </div>
    );
  }

  const currentQuestion = levelAssessmentQuestions[currentIndex];
  const score = userAnswers.reduce((total, answer, idx) => {
    return total + (answer === levelAssessmentQuestions[idx].correctAnswer ? 1 : 0);
  }, 0);

  const getLevelBadge = (level: UserLevel) => {
    const badges = {
      beginner: { color: "bg-green-100 text-green-700", label: "Beginner" },
      intermediate: { color: "bg-yellow-100 text-yellow-700", label: "Intermediate" },
      advanced: { color: "bg-red-100 text-red-700", label: "Advanced" },
    };
    return badges[level];
  };

  const getPathDetails = (pathId: string) => {
    const paths = {
      foundation: {
        name: "Foundation Builder",
        description: "Build strong English basics from scratch",
        icon: "🏗️",
        color: "#10B981",
      },
      "competitive-exam": {
        name: "Competitive Exam English",
        description: "Master English for SSC, Banking, UPSC, and Railway exams",
        icon: "🎯",
        color: "#3B82F6",
      },
      "ielts-toefl": {
        name: "IELTS & TOEFL Preparation",
        description: "Complete preparation for international English tests",
        icon: "🌍",
        color: "#8B5CF6",
      },
    };
    return paths[pathId as keyof typeof paths];
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--card-bg)" }}>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Intro State */}
        {state === "intro" && (
          <div className="text-center">
            <Link href="/english">
              <button className="mb-6 text-sm" style={{ color: "var(--foreground-secondary)" }}>
                ← Back to English Hub
              </button>
            </Link>

            <div
              className="rounded-2xl p-8 shadow-lg transition-all"
              style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", borderWidth: "1px", borderStyle: "solid" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 12px 24px rgba(0, 0, 0, 0.15)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 10px 15px -3px rgb(0 0 0 / 0.1)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#4255FF] to-purple-600 rounded-full flex items-center justify-center">
                <Target className="w-10 h-10 text-white" />
              </div>

              <h1 className="text-3xl font-bold mb-4" style={{ color: "var(--foreground)" }}>
                Comprehensive Level Assessment
              </h1>
              <p className="text-lg mb-6" style={{ color: "var(--foreground-secondary)" }}>
                Take our 10-minute test with 20 questions to accurately discover your English level and get personalized learning recommendations
              </p>

              <div className="rounded-xl p-6 mb-8" style={{ background: "var(--hover-bg)" }}>
                <h3 className="font-semibold mb-3" style={{ color: "var(--foreground)" }}>What to expect:</h3>
                <ul className="space-y-2 text-left">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#4255FF] flex-shrink-0 mt-0.5" />
                    <span style={{ color: "var(--foreground)" }}>20 questions covering grammar, vocabulary, tenses, and more</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#4255FF] flex-shrink-0 mt-0.5" />
                    <span style={{ color: "var(--foreground)" }}>Progressive difficulty from beginner to advanced</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#4255FF] flex-shrink-0 mt-0.5" />
                    <span style={{ color: "var(--foreground)" }}>Detailed results with topic-wise performance analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#4255FF] flex-shrink-0 mt-0.5" />
                    <span style={{ color: "var(--foreground)" }}>Takes ~10 minutes - 100% free, no strings attached</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={handleStart}
                className="px-8 py-4 bg-gradient-to-r from-[#4255FF] to-purple-600 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
              >
                Start Assessment
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Quiz State */}
        {state === "quiz" && currentQuestion && (
          <div>
            <div className="mb-6 text-center">
              <span className="text-sm font-medium" style={{ color: "var(--foreground-secondary)" }}>
                Question {currentIndex + 1} of {levelAssessmentQuestions.length}
              </span>
              <div className="mt-2 w-full rounded-full h-2" style={{ background: "var(--hover-bg)" }}>
                <div
                  className="bg-gradient-to-r from-[#4255FF] to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / levelAssessmentQuestions.length) * 100}%` }}
                />
              </div>
            </div>

            <div
              className="rounded-2xl p-8 shadow-lg transition-all"
              style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", borderWidth: "1px", borderStyle: "solid" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 12px 24px rgba(0, 0, 0, 0.15)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 10px 15px -3px rgb(0 0 0 / 0.1)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div className="mb-2">
                <span className="px-3 py-1 text-xs font-medium rounded-full" style={{ background: "var(--hover-bg)", color: "var(--foreground)" }}>
                  {currentQuestion.level}
                </span>
              </div>

              <h2 className="text-2xl font-bold mb-8" style={{ color: "var(--foreground)" }}>
                {currentQuestion.question}
              </h2>

              <div className="space-y-3">
                {currentQuestion.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswerSelect(idx)}
                    className="w-full text-left p-5 rounded-xl border-2 transition-all group"
                    style={{ borderColor: "var(--card-border)", background: "var(--card-bg)" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--primary)";
                      e.currentTarget.style.background = "var(--hover-bg)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--card-border)";
                      e.currentTarget.style.background = "var(--card-bg)";
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full border-2 group-hover:border-[#4255FF] group-hover:bg-[#4255FF] flex items-center justify-center flex-shrink-0 transition-all" style={{ borderColor: "var(--muted)" }}>
                        <span className="font-semibold group-hover:text-white" style={{ color: "var(--foreground)" }}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                      </div>
                      <span className="font-medium" style={{ color: "var(--foreground)" }}>{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results State */}
        {state === "results" && (
          <div>
            <div className="bg-gradient-to-r from-[#4255FF] to-purple-600 rounded-2xl p-8 text-white mb-6 shadow-xl">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-10 h-10" />
                </div>
                <h1 className="text-3xl font-bold mb-2">Assessment Complete!</h1>
                <p className="text-indigo-100 mb-6">
                  You scored {score} out of {levelAssessmentQuestions.length}
                </p>

                <div className="inline-block">
                  <span className={`px-6 py-3 ${getLevelBadge(detectedLevel).color} rounded-full text-lg font-bold`}>
                    Your Level: {getLevelBadge(detectedLevel).label}
                  </span>
                </div>
              </div>
            </div>

            <div
              className="rounded-2xl p-8 shadow-lg mb-6 transition-all"
              style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", borderWidth: "1px", borderStyle: "solid" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 12px 24px rgba(0, 0, 0, 0.15)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 10px 15px -3px rgb(0 0 0 / 0.1)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--foreground)" }}>
                Recommended Learning Path
              </h2>

              <div
                className="border-2 rounded-xl p-6 transition-all"
                style={{ borderColor: `${getPathDetails(recommendedPath).color}20` }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.1)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
                    style={{ backgroundColor: `${getPathDetails(recommendedPath).color}15` }}
                  >
                    {getPathDetails(recommendedPath).icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2" style={{ color: "var(--foreground)" }}>
                      {getPathDetails(recommendedPath).name}
                    </h3>
                    <p className="mb-4" style={{ color: "var(--foreground-secondary)" }}>
                      {getPathDetails(recommendedPath).description}
                    </p>
                    <Link href={`/english/${recommendedPath}`}>
                      <button className="px-6 py-3 bg-[#4255FF] text-white rounded-lg hover:bg-[#3242CC] transition-all font-semibold">
                        Start Learning →
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl p-6 mb-6" style={{ background: "var(--hover-bg)", borderColor: "var(--card-border)", borderWidth: "1px", borderStyle: "solid" }}>
              <h3 className="font-semibold mb-3" style={{ color: "var(--foreground)" }}>💡 What your level means:</h3>
              <div style={{ color: "var(--foreground)" }}>
                {detectedLevel === "beginner" && (
                  <p>
                    You're just starting your English learning journey! Focus on building strong fundamentals with our Foundation Builder path. Master basic grammar, essential vocabulary, and everyday conversations.
                  </p>
                )}
                {detectedLevel === "intermediate" && (
                  <p>
                    You have a good grasp of basic English! Ready to tackle competitive exam preparation with advanced grammar, synonyms/antonyms, idioms, and reading comprehension.
                  </p>
                )}
                {detectedLevel === "advanced" && (
                  <p>
                    Excellent! You're ready for international-level English. Perfect for IELTS/TOEFL preparation with academic vocabulary, complex grammar structures, and formal writing skills.
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-xl p-6 mb-6" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", borderWidth: "1px", borderStyle: "solid" }}>
              <h3 className="font-semibold mb-4" style={{ color: "var(--foreground)" }}>📊 Your Performance Breakdown:</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium" style={{ color: "var(--foreground-secondary)" }}>Beginner Questions</span>
                    <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                      {userAnswers.filter((ans, idx) => ans === levelAssessmentQuestions[idx].correctAnswer && levelAssessmentQuestions[idx].level === "beginner").length} / 7
                    </span>
                  </div>
                  <div className="w-full rounded-full h-2" style={{ background: "var(--hover-bg)" }}>
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{
                        width: `${(userAnswers.filter((ans, idx) => ans === levelAssessmentQuestions[idx].correctAnswer && levelAssessmentQuestions[idx].level === "beginner").length / 7) * 100}%`
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium" style={{ color: "var(--foreground-secondary)" }}>Intermediate Questions</span>
                    <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                      {userAnswers.filter((ans, idx) => ans === levelAssessmentQuestions[idx].correctAnswer && levelAssessmentQuestions[idx].level === "intermediate").length} / 7
                    </span>
                  </div>
                  <div className="w-full rounded-full h-2" style={{ background: "var(--hover-bg)" }}>
                    <div
                      className="bg-yellow-500 h-2 rounded-full transition-all"
                      style={{
                        width: `${(userAnswers.filter((ans, idx) => ans === levelAssessmentQuestions[idx].correctAnswer && levelAssessmentQuestions[idx].level === "intermediate").length / 7) * 100}%`
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium" style={{ color: "var(--foreground-secondary)" }}>Advanced Questions</span>
                    <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                      {userAnswers.filter((ans, idx) => ans === levelAssessmentQuestions[idx].correctAnswer && levelAssessmentQuestions[idx].level === "advanced").length} / 6
                    </span>
                  </div>
                  <div className="w-full rounded-full h-2" style={{ background: "var(--hover-bg)" }}>
                    <div
                      className="bg-red-500 h-2 rounded-full transition-all"
                      style={{
                        width: `${(userAnswers.filter((ans, idx) => ans === levelAssessmentQuestions[idx].correctAnswer && levelAssessmentQuestions[idx].level === "advanced").length / 6) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              <Link href="/english" className="flex-1">
                <button className="w-full px-6 py-3 border-2 rounded-lg hover:transition-all" style={{ borderColor: "var(--card-border)", color: "var(--foreground)", background: "var(--card-bg)" }}>
                  Explore All Paths
                </button>
              </Link>
              <button
                onClick={() => {
                  setState("intro");
                  setCurrentIndex(0);
                  setUserAnswers([]);
                }}
                className="flex-1 px-6 py-3 text-white rounded-lg hover:transition-all"
                style={{ background: "var(--foreground)" }}
              >
                Retake Assessment
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
