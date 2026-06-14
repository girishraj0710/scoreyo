"use client";

import { useState, useEffect, useMemo, useRef, Suspense } from "react";
import dynamic from "next/dynamic";
import { useSearchParams, useRouter } from "next/navigation";
import { examCategories, type Exam, getExamById } from "@/lib/exams";
import { useUser } from "@/context/user-context";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { AccessibilityWrapper } from "@/components/accessibility-wrapper";
import { Zap, Flame } from "lucide-react";
import { ColorfulExamIcon, ColorfulCategoryIcon, ColorfulSubjectIcon } from "@/lib/colorful-exam-icons";
import { isNative } from "@/lib/capacitor";

// Dynamic import: Only load landing page for non-logged users
// Toggle between V1 (old) and V2 (new Quizlet-inspired)
const LandingPage = dynamic(() => import("@/components/landing-page-v2").then(mod => ({ default: mod.LandingPageV2 })), {
  loading: () => <LoadingSkeleton type="page" />,
});

function HomePageContent() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [questionCount, setQuestionCount] = useState(5);
  const [difficulty, setDifficulty] = useState<string>("mixed");
  const [pressureMode, setPressureMode] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [subData, setSubData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [lastQuiz, setLastQuiz] = useState<any>(null);
  const [showFullFlow, setShowFullFlow] = useState(false);

  // Refs for auto-scrolling
  const categoryRef = useRef<HTMLElement>(null);
  const examRef = useRef<HTMLElement>(null);
  const subjectRef = useRef<HTMLElement>(null);
  const topicRef = useRef<HTMLElement>(null);
  const settingsRef = useRef<HTMLElement>(null);

  // Ref for search container to detect outside clicks
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data) => {
        setStats(data);

        // Smart Quick Start: Suggest next topic, not the same one
        if (data.recentSessions && data.recentSessions.length > 0) {
          const recentSessions = data.recentSessions;

          // Get last 5 unique topics taken
          const recentTopics = new Set(
            recentSessions.slice(0, 5).map((s: any) => `${s.exam_id}:${s.subject_id}:${s.topic}`)
          );

          // Find a topic from recent sessions that hasn't been practiced in last 5
          let suggestedQuiz = null;

          for (let i = 0; i < recentSessions.length && i < 10; i++) {
            const session = recentSessions[i];
            const topicKey = `${session.exam_id}:${session.subject_id}:${session.topic}`;

            // If this topic appears only once in recent history (not repeated), suggest it
            const topicCount = recentSessions.slice(0, 5).filter((s: any) =>
              s.exam_id === session.exam_id &&
              s.subject_id === session.subject_id &&
              s.topic === session.topic
            ).length;

            if (topicCount === 1) {
              suggestedQuiz = {
                examId: session.exam_id,
                subjectId: session.subject_id,
                topic: session.topic,
              };
              break;
            }
          }

          // If all topics are repeated, just pick the second most recent (not the immediate last)
          if (!suggestedQuiz && recentSessions.length >= 2) {
            const session = recentSessions[1]; // Skip index 0, use index 1
            suggestedQuiz = {
              examId: session.exam_id,
              subjectId: session.subject_id,
              topic: session.topic,
            };
          } else if (!suggestedQuiz && recentSessions.length === 1) {
            // Only one session ever - suggest same (first-time user)
            const session = recentSessions[0];
            suggestedQuiz = {
              examId: session.exam_id,
              subjectId: session.subject_id,
              topic: session.topic,
            };
          }

          setLastQuiz(suggestedQuiz);
        }
      })
      .catch(() => {});
    fetch("/api/subscription")
      .then((r) => r.json())
      .then(setSubData)
      .catch(() => {});
  }, []);

  // Handle URL parameters to pre-select exam and subject
  useEffect(() => {
    const examId = searchParams.get("examId");
    const subjectId = searchParams.get("subjectId");

    if (examId && subjectId) {
      // Find the exam
      let foundExam: Exam | null = null;
      let foundCategory: string | null = null;

      for (const category of examCategories) {
        const exam = category.exams.find((e) => e.id === examId);
        if (exam) {
          foundExam = exam;
          foundCategory = category.id;
          break;
        }
      }

      if (foundExam && foundCategory) {
        setSelectedCategory(foundCategory);
        setSelectedExam(foundExam);
        setSelectedSubject(subjectId);

        // Scroll to topic section after a brief delay
        setTimeout(() => {
          topicRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 300);
      }
    }
  }, [searchParams]);

  // Handle click outside to close search results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleStartQuiz = () => {
    if (!selectedExam || !selectedSubject || !selectedTopic) return;
    const params = new URLSearchParams({
      examId: selectedExam.id,
      subjectId: selectedSubject,
      topic: selectedTopic,
      count: questionCount.toString(),
      difficulty,
      pressureMode: pressureMode.toString(),
    });
    window.location.href = `/quiz?${params.toString()}`;
  };

  const currentSubjects = selectedExam?.subjects || [];
  const currentTopics =
    currentSubjects.find((s) => s.id === selectedSubject)?.topics || [];

  // Search logic for logged-in users
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;

    const query = searchQuery.toLowerCase();
    const results: Array<{
      type: "exam" | "subject" | "topic";
      exam: Exam;
      subject?: { id: string; name: string; icon: string };
      topic?: string;
      category: string;
    }> = [];

    examCategories.forEach((category) => {
      category.exams.forEach((exam) => {
        // Check exam name
        if (exam.name.toLowerCase().includes(query) ||
            exam.fullName.toLowerCase().includes(query) ||
            exam.description.toLowerCase().includes(query)) {
          results.push({
            type: "exam",
            exam,
            category: category.name,
          });
        }

        // Check subjects and topics
        exam.subjects.forEach((subject) => {
          if (subject.name.toLowerCase().includes(query)) {
            results.push({
              type: "subject",
              exam,
              subject: { id: subject.id, name: subject.name, icon: subject.icon },
              category: category.name,
            });
          }

          // Check topics
          subject.topics.forEach((topic) => {
            if (topic.toLowerCase().includes(query)) {
              results.push({
                type: "topic",
                exam,
                subject: { id: subject.id, name: subject.name, icon: subject.icon },
                topic,
                category: category.name,
              });
            }
          });
        });
      });
    });

    return results.slice(0, 10); // Limit to 10 results
  }, [searchQuery]);

  const handleSearchSelect = (result: any) => {
    if (result.type === "topic" && result.subject && result.topic) {
      // Auto-fill all fields and jump to quiz settings
      const category = examCategories.find(c => c.exams.some(e => e.id === result.exam.id));
      setSelectedCategory(category?.id || null);
      setSelectedExam(result.exam);
      setSelectedSubject(result.subject.id);
      setSelectedTopic(result.topic);
      setShowSearchDropdown(false);
      setTimeout(() => settingsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    } else if (result.type === "subject" && result.subject) {
      // Auto-fill exam and subject
      const category = examCategories.find(c => c.exams.some(e => e.id === result.exam.id));
      setSelectedCategory(category?.id || null);
      setSelectedExam(result.exam);
      setSelectedSubject(result.subject.id);
      setSelectedTopic(null);
      setShowSearchDropdown(false);
      setTimeout(() => topicRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    } else if (result.type === "exam") {
      // Auto-fill exam
      const category = examCategories.find(c => c.exams.some(e => e.id === result.exam.id));
      setSelectedCategory(category?.id || null);
      setSelectedExam(result.exam);
      setSelectedSubject(null);
      setSelectedTopic(null);
      setShowSearchDropdown(false);
      setTimeout(() => subjectRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    }
  };

  // MOBILE APP: Skip landing page, go straight to dashboard or auth
  useEffect(() => {
    if (isNative() && !isLoading) {
      if (user) {
        router.push('/dashboard');
      } else {
        router.push('/auth');
      }
    }
  }, [user, isLoading, router]);

  // Redirect contributors to contributor portal
  useEffect(() => {
    if (user && (user.role === 'contributor' || user.role === 'admin')) {
      window.location.href = '/contributor';
    }
  }, [user]);

  // Show minimal loading state while checking auth (don't show landing page)
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
        <div className="w-12 h-12 border-4 rounded-full animate-spin" style={{ borderColor: "var(--card-border)", borderTopColor: "var(--primary)" }}></div>
      </div>
    );
  }

  // Show landing page if not logged in
  if (!user) {
    return <LandingPage />;
  }

  // Show loading state while redirecting contributors
  if (user.role === 'contributor' || user.role === 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 rounded-full animate-spin" style={{ borderColor: "var(--card-border)", borderTopColor: "var(--primary)" }}></div>
          <p style={{ color: "var(--foreground-secondary)" }}>Redirecting to Contributor Portal...</p>
        </div>
      </div>
    );
  }

  // Show quiz selection interface for logged-in users
  return (
    <AccessibilityWrapper>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4 px-2" style={{ color: "var(--foreground)" }}>
            Smart Exam Prep
          </h1>
        <p className="text-base sm:text-lg max-w-3xl mx-auto mb-4 md:mb-6 leading-relaxed px-2" style={{ color: "var(--foreground-secondary)" }}>
          Expert-curated questions for JEE, NEET, UPSC, SSC, Banking, CAT &amp; 60+ exams.<br className="hidden sm:block" />
          <span className="sm:hidden"> </span>AI-powered practice with progress tracking to master every topic.
        </p>

        {/* Search Bar for logged-in users */}
        <div ref={searchContainerRef} className="max-w-2xl mx-auto mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Quick search: exams, subjects, topics..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={(e) => { setShowSearchDropdown(true); e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.2)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.boxShadow = 'none'; }}
              className="w-full px-6 py-3 rounded-xl border-2 focus:outline-none text-base"
              style={{ background: "var(--card-bg)", color: "var(--foreground)", borderColor: "var(--card-border)" }}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 p-2" style={{ color: "var(--muted)" }}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Search Results Dropdown */}
          {showSearchDropdown && searchQuery.trim() && searchResults && searchResults.length > 0 && (
            <div className="mt-3 rounded-xl shadow-lg border-2 overflow-hidden" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
              <div className="p-3 border-b" style={{ borderColor: "var(--card-border)", background: "var(--hover-bg)" }}>
                <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                  Found {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {searchResults.map((result, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearchSelect(result)}
                    className="w-full px-4 py-3 transition-colors text-left border-b last:border-b-0 cursor-pointer"
                    style={{ borderColor: "var(--card-border)" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--hover-bg)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        <ColorfulExamIcon
                          examId={result.exam.id}
                          size={36}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold" style={{ color: "var(--foreground)" }}>{result.exam.name}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--primary-bg)", color: "var(--primary)" }}>
                            {result.category}
                          </span>
                        </div>
                        {result.type === "exam" && (
                          <p className="text-sm" style={{ color: "var(--foreground-secondary)" }}>Full exam</p>
                        )}
                        {result.type === "subject" && result.subject && (
                          <p className="text-sm" style={{ color: "var(--foreground-secondary)" }}>
                            <span className="font-medium">{result.subject.name}</span>
                          </p>
                        )}
                        {result.type === "topic" && result.subject && result.topic && (
                          <p className="text-sm" style={{ color: "var(--foreground-secondary)" }}>
                            <span className="font-medium">{result.subject.name}</span> → {result.topic}
                          </p>
                        )}
                      </div>
                      <svg className="w-5 h-5 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "var(--muted)" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {showSearchDropdown && searchQuery.trim() && searchResults && searchResults.length === 0 && (
            <div className="mt-3 rounded-xl shadow-lg border-2 p-6 text-center" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
              <div className="flex justify-center mb-2">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "var(--muted)" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="font-semibold mb-1" style={{ color: "var(--foreground)" }}>No results found</p>
              <p className="text-sm" style={{ color: "var(--foreground-secondary)" }}>Try searching for JEE, NEET, UPSC, SSC, Physics, etc.</p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        {stats?.stats && stats.stats.totalSessions > 0 && (
          <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-2xl mx-auto mb-6 md:mb-8">
            <div className="rounded-lg sm:rounded-xl px-3 sm:px-5 py-3 sm:py-4 shadow-sm border" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
              <div className="text-xl sm:text-2xl font-bold text-emerald-600">
                {stats.stats.totalQuestions}
              </div>
              <div className="text-[10px] sm:text-xs" style={{ color: "var(--muted)" }}>Questions Solved</div>
            </div>
            <div className="rounded-lg sm:rounded-xl px-3 sm:px-5 py-3 sm:py-4 shadow-sm border" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
              <div className="text-xl sm:text-2xl font-bold text-cyan-600">
                {stats.stats.accuracy}%
              </div>
              <div className="text-[10px] sm:text-xs" style={{ color: "var(--muted)" }}>Accuracy</div>
            </div>
            <div className="rounded-lg sm:rounded-xl px-3 sm:px-5 py-3 sm:py-4 shadow-sm border streak-pulse" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
              <div className="text-xl sm:text-2xl font-bold text-amber-500">
                {stats.stats.streak}
              </div>
              <div className="text-[10px] sm:text-xs" style={{ color: "var(--muted)" }}>Day Streak</div>
            </div>
          </div>
        )}
      </section>

      {/* Quick Start - Returning Users */}
      {!showFullFlow && lastQuiz && !selectedCategory && (
        <section className="mb-6 md:mb-8">
          <div className="bg-gradient-to-r from-indigo-500 to-violet-500 rounded-2xl p-5 sm:p-6 text-white shadow-xl">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-xs sm:text-sm font-medium text-indigo-100 mb-1">
                  Practice Next Topic
                </div>
                <h3 className="text-lg sm:text-xl font-bold">
                  {getExamById(lastQuiz.examId)?.name || "Suggested Quiz"}
                </h3>
                <p className="text-sm text-indigo-100 mt-1">
                  {lastQuiz.subjectId} • {lastQuiz.topic}
                </p>
              </div>
              <Zap className="w-8 h-8 text-yellow-300" />
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <a
                href={`/quiz?examId=${lastQuiz.examId}&subjectId=${lastQuiz.subjectId}&topic=${encodeURIComponent(lastQuiz.topic)}&count=5&difficulty=mixed`}
                className="flex-1 font-semibold py-3 px-4 rounded-xl text-center transition-all" style={{ background: "rgba(0, 0, 0, 0.2)", color: "#ffffff" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(0, 0, 0, 0.3)";
                  e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(0, 0, 0, 0.2)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                Start Quick Quiz (5 Q)
              </a>
              <button
                onClick={() => setShowFullFlow(true)}
                className="sm:w-auto text-white font-medium py-3 px-4 rounded-xl transition-all border-2"
                style={{
                  background: "rgba(255, 255, 255, 0.15)",
                  borderColor: "rgba(255, 255, 255, 0.4)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.25)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.6)";
                  e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.4)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                Browse All Exams
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Step 1: Category Selection */}
      {(showFullFlow || !lastQuiz) && !selectedCategory && (
        <section ref={categoryRef} className="mb-6 md:mb-8">
          <h2 className="text-base sm:text-lg font-semibold mb-3 md:mb-4 flex items-center gap-2" style={{ color: "var(--foreground)" }}>
            <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold" style={{ background: "var(--primary-bg)", color: "var(--primary)" }}>
              1
            </span>
            Choose Exam Category
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
            {examCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id);
                  setSelectedExam(null);
                  setSelectedSubject(null);
                  setSelectedTopic(null);
                  setTimeout(() => examRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.1)";
                  e.currentTarget.style.borderColor = "#4255FF";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "initial";
                  e.currentTarget.style.borderColor = "var(--card-border)";
                }}
              className="card-hover p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 text-center min-h-[120px] sm:min-h-[140px] transition-all"
              style={{ borderColor: "var(--card-border)", background: "var(--card-bg)" }}
              >
                <div className="flex justify-center mb-1 sm:mb-2">
                  <ColorfulCategoryIcon
                    categoryId={category.id}
                    size={56}
                  />
                </div>
                <div className="text-xs sm:text-sm font-medium leading-tight" style={{ color: "var(--foreground)" }}>
                  {category.name}
                </div>
                <div className="text-[10px] sm:text-xs mt-1" style={{ color: "var(--muted)" }}>
                  {category.exams.length} exam
                  {category.exams.length > 1 ? "s" : ""}
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Step 2: Exam Selection */}
      {selectedCategory && (
        <section ref={examRef} className="mb-6 md:mb-8">
          <div className="mb-3 md:mb-4 flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-semibold flex items-center gap-2" style={{ color: "var(--foreground)" }}>
              <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold" style={{ background: "var(--primary-bg)", color: "var(--primary)" }}>
                2
              </span>
              Select Exam
            </h2>
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSelectedExam(null);
                setSelectedSubject(null);
                setSelectedTopic(null);
                setTimeout(() => categoryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
              }}
              className="text-xs sm:text-sm font-medium" style={{ color: "var(--primary)" }}
            >
              ← Change
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
            {examCategories
              .find((c) => c.id === selectedCategory)
              ?.exams.map((exam) => (
                <button
                  key={exam.id}
                  onClick={() => {
                    setSelectedExam(selectedExam?.id === exam.id ? null : exam);
                    setSelectedSubject(null);
                    setSelectedTopic(null);
                    setTimeout(() => subjectRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
                  }}
                  onMouseEnter={(e) => {
                    if (selectedExam?.id !== exam.id) {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.1)";
                      e.currentTarget.style.borderColor = "#4255FF";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedExam?.id !== exam.id) {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "initial";
                      e.currentTarget.style.borderColor = "var(--card-border)";
                    }
                  }}
                  className={`card-hover p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 text-left transition-all ${
                    selectedExam?.id === exam.id
                      ? "border-indigo-500 shadow-md"
                      : ""
                  }`}
                  style={{ borderColor: selectedExam?.id === exam.id ? undefined : "var(--card-border)", background: selectedExam?.id === exam.id ? "var(--selected-bg)" : "var(--card-bg)" }}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center shrink-0">
                      <ColorfulExamIcon
                        examId={exam.id}
                        size={48}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm sm:text-base font-semibold" style={{ color: "var(--foreground)" }}>
                        {exam.name}
                      </div>
                      <div className="text-[10px] sm:text-xs truncate" style={{ color: "var(--muted)" }}>
                        {exam.description}
                      </div>
                    </div>
                  </div>
                  <div className="mt-1.5 sm:mt-2 text-[10px] sm:text-xs" style={{ color: "var(--muted)" }}>
                    {exam.subjects.length} subjects |{" "}
                    {exam.subjects.reduce(
                      (sum, s) => sum + s.topics.length,
                      0
                    )}{" "}
                    topics
                  </div>
                </button>
              ))}
          </div>
        </section>
      )}

      {/* Step 3: Subject Selection */}
      {selectedExam && (
        <section ref={subjectRef} className="mb-6 md:mb-8">
          <h2 className="text-base sm:text-lg font-semibold mb-3 md:mb-4 flex items-center gap-2" style={{ color: "var(--foreground)" }}>
            <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold" style={{ background: "var(--primary-bg)", color: "var(--primary)" }}>
              3
            </span>
            Select Subject
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
            {currentSubjects.map((subject) => (
              <div key={subject.id} className="relative">
                <button
                  onClick={() => {
                    setSelectedSubject(selectedSubject === subject.id ? null : subject.id);
                    setSelectedTopic(null);
                    setTimeout(() => topicRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
                  }}
                  onMouseEnter={(e) => {
                    if (selectedSubject !== subject.id) {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.1)";
                      e.currentTarget.style.borderColor = "#4255FF";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedSubject !== subject.id) {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "initial";
                      e.currentTarget.style.borderColor = "var(--card-border)";
                    }
                  }}
                  className={`card-hover p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 text-center w-full min-h-[120px] sm:min-h-[140px] transition-all ${
                    selectedSubject === subject.id
                      ? "border-indigo-500 shadow-md"
                      : ""
                  }`}
                  style={{ borderColor: selectedSubject === subject.id ? undefined : "var(--card-border)", background: selectedSubject === subject.id ? "var(--selected-bg)" : "var(--card-bg)" }}
                >
                  <div className="flex justify-center mb-1 sm:mb-2">
                    <ColorfulSubjectIcon
                      subjectId={subject.id}
                      size={48}
                    />
                  </div>
                  <div className="text-xs sm:text-sm font-medium leading-tight" style={{ color: "var(--foreground)" }}>
                    {subject.name}
                  </div>
                  <div className="text-[10px] sm:text-xs mt-1" style={{ color: "var(--muted)" }}>
                    {subject.topics.length} topics
                  </div>
                </button>

                {/* Level Mode Button - Outside parent button */}
                {selectedSubject === subject.id && (
                  <button
                    onClick={() => {
                      window.location.href = `/quiz/levels?examId=${selectedExam.id}&subjectId=${subject.id}`;
                    }}
                    className="mt-2 w-full flex items-center justify-center gap-1 px-3 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold rounded-lg hover:from-amber-600 hover:to-orange-600 shadow-md transition-all"
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
                    </svg>
                    🎮 Level Mode
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Step 4: Topic Selection */}
      {selectedSubject && (
        <section ref={topicRef} className="mb-6 md:mb-8">
          <h2 className="text-base sm:text-lg font-semibold mb-3 md:mb-4 flex items-center gap-2" style={{ color: "var(--foreground)" }}>
            <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold" style={{ background: "var(--primary-bg)", color: "var(--primary)" }}>
              4
            </span>
            Select Topic
          </h2>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {currentTopics.map((topic) => (
              <button
                key={topic}
                onClick={() => {
                  setSelectedTopic(selectedTopic === topic ? null : topic);
                  setTimeout(() => settingsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
                }}
                onMouseEnter={(e) => {
                  if (selectedTopic !== topic) {
                    e.currentTarget.style.borderColor = "#4255FF";
                    e.currentTarget.style.transform = "scale(1.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedTopic !== topic) {
                    e.currentTarget.style.borderColor = "var(--card-border)";
                    e.currentTarget.style.transform = "scale(1)";
                  }
                }}
                className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium border-2 min-h-[40px] sm:min-h-[44px] transition-all ${
                  selectedTopic === topic
                    ? "border-indigo-500 bg-indigo-600 text-white shadow-md"
                    : ""
                }`}
                style={selectedTopic !== topic ? { borderColor: "var(--card-border)", background: "var(--card-bg)", color: "var(--foreground-secondary)" } : undefined}
              >
                {topic}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Step 5: Quiz Settings & Start */}
      {selectedTopic && (
        <section ref={settingsRef} className="mb-8 md:mb-12">
          <div className="rounded-xl sm:rounded-2xl border-2 p-4 sm:p-6 shadow-lg max-w-lg mx-auto" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
            <h2 className="text-base sm:text-lg font-semibold mb-4 sm:mb-5 text-center" style={{ color: "var(--foreground)" }}>
              Quiz Settings
            </h2>

            {/* Quiz Summary */}
            <div className="rounded-xl p-4 mb-5" style={{ background: "var(--hover-bg)" }}>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div style={{ color: "var(--muted)" }}>Exam:</div>
                <div className="font-medium" style={{ color: "var(--foreground)" }}>
                  {selectedExam?.name}
                </div>
                <div style={{ color: "var(--muted)" }}>Subject:</div>
                <div className="font-medium" style={{ color: "var(--foreground)" }}>
                  {currentSubjects.find((s) => s.id === selectedSubject)?.name}
                </div>
                <div style={{ color: "var(--muted)" }}>Topic:</div>
                <div className="font-medium" style={{ color: "var(--foreground)" }}>
                  {selectedTopic}
                </div>
              </div>
            </div>

            {/* Number of Questions */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>
                Number of Questions
              </label>
              <div className="flex gap-2">
                {[5, 10, 15, 20].map((n) => (
                  <button
                    key={n}
                    onClick={() => setQuestionCount(n)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border-2 transition-all cursor-pointer ${
                      questionCount === n
                        ? "border-indigo-500 bg-indigo-600 text-white"
                        : ""
                    }`}
                    style={questionCount !== n ? { borderColor: "var(--card-border)", background: "var(--card-bg)", color: "var(--foreground-secondary)" } : undefined}
                    onMouseEnter={(e) => {
                      if (questionCount !== n) {
                        e.currentTarget.style.borderColor = "#a5b4fc";
                        e.currentTarget.style.backgroundColor = "var(--hover-bg)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (questionCount !== n) {
                        e.currentTarget.style.borderColor = "var(--card-border)";
                        e.currentTarget.style.backgroundColor = "var(--card-bg)";
                      }
                    }}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>
                Difficulty
              </label>
              <div className="flex gap-2">
                {[
                  { value: "mixed", label: "Mixed" },
                  { value: "easy", label: "Easy" },
                  { value: "medium", label: "Medium" },
                  { value: "hard", label: "Hard" },
                ].map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setDifficulty(d.value)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border-2 transition-all cursor-pointer ${
                      difficulty === d.value
                        ? "border-indigo-500 bg-indigo-600 text-white"
                        : ""
                    }`}
                    style={difficulty !== d.value ? { borderColor: "var(--card-border)", background: "var(--card-bg)", color: "var(--foreground-secondary)" } : undefined}
                    onMouseEnter={(e) => {
                      if (difficulty !== d.value) {
                        e.currentTarget.style.borderColor = "#a5b4fc";
                        e.currentTarget.style.backgroundColor = "var(--hover-bg)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (difficulty !== d.value) {
                        e.currentTarget.style.borderColor = "var(--card-border)";
                        e.currentTarget.style.backgroundColor = "var(--card-bg)";
                      }
                    }}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Pressure Mode Toggle */}
            <div className="mb-4">
              <label className="flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-colors" style={{ background: pressureMode ? "var(--danger)" + "15" : "var(--card-bg)", borderColor: pressureMode ? "var(--danger)" : "var(--card-border)" }}>
                <input
                  type="checkbox"
                  checked={pressureMode}
                  onChange={(e) => setPressureMode(e.target.checked)}
                  className="w-5 h-5 text-red-600 rounded focus:ring-2 focus:ring-red-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5" style={{ color: "var(--danger)" }} />
                    <span className="font-semibold" style={{ color: "var(--foreground)" }}>Pressure Mode</span>
                    <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded-full">INTENSE</span>
                  </div>
                  <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "var(--foreground-secondary)" }}>
                    Timer accelerates as time runs out. Simulates real exam stress! <Flame className="w-3.5 h-3.5 inline" />
                  </p>
                </div>
              </label>
            </div>

            {/* Quiz Limit Info */}
            {subData && !subData.isPro && (
              <div className="mb-4 p-3 rounded-xl text-sm border" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
                <div className="flex items-center justify-between">
                  <span style={{ color: subData.quizzesRemaining === 0 ? "var(--danger)" : "var(--foreground-secondary)" }}>
                    {subData.quizzesRemaining === 0
                      ? "Daily limit reached!"
                      : `${subData.todayQuizCount} of ${subData.quizLimit} free quizzes used today`}
                  </span>
                  <a href="/pricing" className="font-medium text-xs" style={{ color: "var(--primary)" }}>
                    Upgrade
                  </a>
                </div>
                {subData.quizzesRemaining !== null && subData.quizzesRemaining > 0 && (
                  <div className="mt-2 w-full rounded-full h-1.5" style={{ background: "var(--hover-bg)" }}>
                    <div
                      className="h-1.5 rounded-full"
                      style={{ width: `${(subData.todayQuizCount / subData.quizLimit) * 100}%`, background: "var(--accent)" }}
                    />
                  </div>
                )}
              </div>
            )}

            {subData?.isPro && (
              <div className="mb-4 p-3 rounded-xl text-sm border flex items-center gap-2" style={{ background: "var(--hover-bg)", borderColor: "var(--card-border)" }}>
                <span className="px-2 py-0.5 bg-gradient-to-r from-indigo-600 to-violet-500 text-white text-xs font-bold rounded-full">PRO</span>
                <span style={{ color: "var(--primary)" }}>Unlimited quizzes</span>
              </div>
            )}

            {/* Study First Option */}
            <button
              onClick={() => {
                // Extract base subject (remove exam prefix like 'jee-' or 'neet-')
                const baseSubject = selectedSubject?.replace(/^(jee|neet|upsc|ssc|cat|gate|banking|cuet)-/, '') || '';
                // Lowercase the topic to match database format
                const topicLower = selectedTopic?.toLowerCase() || '';
                // Pass original values for quiz fallback
                window.location.href = `/study?exam=${selectedExam?.id}&subject=${baseSubject}&topic=${topicLower}&originalSubject=${selectedSubject}&originalTopic=${selectedTopic}`;
              }}
              className="w-full py-3 mb-3 border-2 border-indigo-500 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950 shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              📚 Study First (Learn Before Quiz)
            </button>

            {/* Start Quiz Button */}
            <button
              onClick={handleStartQuiz}
              disabled={subData && !subData.isPro && subData.quizzesRemaining === 0}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-500 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-violet-600 shadow-lg hover:shadow-xl text-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {subData && !subData.isPro && subData.quizzesRemaining === 0
                ? "Upgrade to Start Quiz"
                : `Start Quiz (${questionCount} Questions)`}
            </button>

            {subData && !subData.isPro && subData.quizzesRemaining === 0 && (
              <a
                href="/pricing"
                className="block mt-3 w-full py-2 text-center text-sm font-medium rounded-xl"
                style={{ color: "var(--primary)", background: "var(--hover-bg)" }}
              >
                View Pro Plans →
              </a>
            )}
          </div>
        </section>
      )}

      {/* Exam Count Banner */}
      <section className="mt-8 text-center">
        <div className="inline-flex items-center gap-3 rounded-full px-6 py-3 shadow-sm border" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
          <span className="text-sm" style={{ color: "var(--foreground-secondary)" }}>
            Covering{" "}
            <span className="font-bold" style={{ color: "var(--primary)" }}>
              {examCategories.reduce(
                (sum, cat) => sum + cat.exams.length,
                0
              )}
            </span>{" "}
            exams across{" "}
            <span className="font-bold" style={{ color: "var(--primary)" }}>
              {examCategories.length}
            </span>{" "}
            categories with{" "}
            <span className="font-bold" style={{ color: "var(--primary)" }}>
              {examCategories
                .flatMap((c) => c.exams)
                .flatMap((e) => e.subjects)
                .flatMap((s) => s.topics).length}
              +
            </span>{" "}
            topics
          </span>
        </div>
      </section>

      {/* Trust & Credibility Section */}
      <section className="mt-10 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl p-5 border text-center" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
            <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ background: "var(--primary-bg)" }}>
              <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="font-semibold mb-1" style={{ color: "var(--foreground)" }}>Expert Verified</h3>
            <p className="text-xs" style={{ color: "var(--muted)" }}>Questions curated from NCERT, previous year papers &amp; standard textbooks</p>
          </div>
          <div className="rounded-xl p-5 border text-center" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
            <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ background: "var(--primary-bg)" }}>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" style={{ color: "var(--primary)" }}>
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-1" style={{ color: "var(--foreground)" }}>Exam-Pattern Based</h3>
            <p className="text-xs" style={{ color: "var(--muted)" }}>Questions match the actual difficulty and pattern of your target exam</p>
          </div>
          <div className="rounded-xl p-5 border text-center" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
            <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ background: "var(--primary-bg)" }}>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" style={{ color: "var(--accent)" }}>
                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="font-semibold mb-1" style={{ color: "var(--foreground)" }}>Smart Progress</h3>
            <p className="text-xs" style={{ color: "var(--muted)" }}>Tracks weak topics and schedules revision using spaced repetition</p>
          </div>
        </div>
      </section>
      </div>
    </AccessibilityWrapper>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ color: "var(--foreground)" }}>Loading...</div>}>
      <HomePageContent />
    </Suspense>
  );
}
