"use client";

import { useState, useEffect, useMemo, useRef, Suspense } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { examCategories, type Exam } from "@/lib/exams";
import { useUser } from "@/context/user-context";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { Zap, Flame } from "lucide-react";
import { ColorfulExamIcon, ColorfulCategoryIcon, ColorfulSubjectIcon } from "@/lib/colorful-exam-icons";

// Dynamic import: Only load landing page for non-logged users
const LandingPage = dynamic(() => import("@/components/landing-page").then(mod => ({ default: mod.LandingPage })), {
  loading: () => <LoadingSkeleton type="page" />,
});

function HomePageContent() {
  const { user, isLoading } = useUser();
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
      .then(setStats)
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

  // Show minimal loading state while checking auth (don't show landing page)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Show landing page if not logged in
  if (!user) {
    return <LandingPage />;
  }

  // Show quiz selection interface for logged-in users
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-violet-500 bg-clip-text text-transparent">
            Smart Exam Prep
          </span>
        </h1>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-6 leading-relaxed">
          Expert-curated questions for JEE, NEET, UPSC, SSC, Banking, CAT &amp; 20+ exams.<br />
          AI-powered practice with progress tracking to master every topic.
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
              onFocus={() => setShowSearchDropdown(true)}
              className="w-full px-6 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:outline-none text-base"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Search Results Dropdown */}
          {showSearchDropdown && searchQuery.trim() && searchResults && searchResults.length > 0 && (
            <div className="mt-3 bg-white rounded-xl shadow-lg border-2 border-slate-200 overflow-hidden">
              <div className="p-3 border-b border-slate-200 bg-slate-50">
                <p className="text-sm font-semibold text-slate-700">
                  Found {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {searchResults.map((result, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearchSelect(result)}
                    className="w-full px-4 py-3 hover:bg-slate-50 transition-colors text-left border-b border-slate-100 last:border-b-0"
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
                          <span className="font-semibold text-slate-800">{result.exam.name}</span>
                          <span className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full">
                            {result.category}
                          </span>
                        </div>
                        {result.type === "exam" && (
                          <p className="text-sm text-slate-600">Full exam</p>
                        )}
                        {result.type === "subject" && result.subject && (
                          <p className="text-sm text-slate-600">
                            <span className="font-medium">{result.subject.name}</span>
                          </p>
                        )}
                        {result.type === "topic" && result.subject && result.topic && (
                          <p className="text-sm text-slate-600">
                            <span className="font-medium">{result.subject.name}</span> → {result.topic}
                          </p>
                        )}
                      </div>
                      <svg className="w-5 h-5 text-slate-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div className="mt-3 bg-white rounded-xl shadow-lg border-2 border-slate-200 p-6 text-center">
              <div className="flex justify-center mb-2">
                <svg className="w-16 h-16 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="font-semibold text-slate-800 mb-1">No results found</p>
              <p className="text-sm text-slate-600">Try searching for JEE, NEET, UPSC, SSC, Physics, etc.</p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        {stats?.stats && stats.stats.totalSessions > 0 && (
          <div className="flex justify-center gap-6 mb-8">
            <div className="bg-white rounded-xl px-5 py-3 shadow-sm border border-slate-200">
              <div className="text-2xl font-bold text-emerald-600">
                {stats.stats.totalQuestions}
              </div>
              <div className="text-xs text-slate-500">Questions Solved</div>
            </div>
            <div className="bg-white rounded-xl px-5 py-3 shadow-sm border border-slate-200">
              <div className="text-2xl font-bold text-cyan-600">
                {stats.stats.accuracy}%
              </div>
              <div className="text-xs text-slate-500">Accuracy</div>
            </div>
            <div className="bg-white rounded-xl px-5 py-3 shadow-sm border border-slate-200 streak-pulse">
              <div className="text-2xl font-bold text-amber-500">
                {stats.stats.streak}
              </div>
              <div className="text-xs text-slate-500">Day Streak</div>
            </div>
          </div>
        )}
      </section>

      {/* Step 1: Category Selection */}
      {!selectedCategory && (
        <section ref={categoryRef} className="mb-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-7 h-7 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">
              1
            </span>
            Choose Exam Category
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
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
              className="card-hover p-4 rounded-xl border-2 text-center border-slate-200 bg-white hover:border-slate-300"
              >
                <div className="flex justify-center mb-1">
                  <ColorfulCategoryIcon
                    categoryId={category.id}
                    size={32}
                  />
                </div>
                <div className="text-sm font-medium text-slate-700">
                  {category.name}
                </div>
                <div className="text-xs text-slate-400 mt-1">
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
        <section ref={examRef} className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <span className="w-7 h-7 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">
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
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              ← Change Category
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
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
                  className={`card-hover p-4 rounded-xl border-2 text-left ${
                    selectedExam?.id === exam.id
                      ? "border-indigo-500 bg-slate-50 shadow-md"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center shrink-0">
                      <ColorfulExamIcon
                        examId={exam.id}
                        size={32}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-800">
                        {exam.name}
                      </div>
                      <div className="text-xs text-slate-500 truncate">
                        {exam.description}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-slate-400">
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
        <section ref={subjectRef} className="mb-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-7 h-7 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">
              3
            </span>
            Select Subject
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {currentSubjects.map((subject) => (
              <div key={subject.id} className="relative">
                <button
                  onClick={() => {
                    setSelectedSubject(selectedSubject === subject.id ? null : subject.id);
                    setSelectedTopic(null);
                    setTimeout(() => topicRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
                  }}
                  className={`card-hover p-4 rounded-xl border-2 text-center w-full ${
                    selectedSubject === subject.id
                      ? "border-indigo-500 bg-slate-50 shadow-md"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex justify-center mb-1">
                    <ColorfulSubjectIcon
                      subjectId={subject.id}
                      size={36}
                    />
                  </div>
                  <div className="text-sm font-medium text-slate-700">
                    {subject.name}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
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
        <section ref={topicRef} className="mb-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-7 h-7 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">
              4
            </span>
            Select Topic
          </h2>
          <div className="flex flex-wrap gap-2">
            {currentTopics.map((topic) => (
              <button
                key={topic}
                onClick={() => {
                  setSelectedTopic(selectedTopic === topic ? null : topic);
                  setTimeout(() => settingsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium border-2 ${
                  selectedTopic === topic
                    ? "border-indigo-500 bg-slate-500 text-white shadow-md"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Step 5: Quiz Settings & Start */}
      {selectedTopic && (
        <section ref={settingsRef} className="mb-12">
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-lg max-w-lg mx-auto">
            <h2 className="text-lg font-semibold text-slate-800 mb-5 text-center">
              Quiz Settings
            </h2>

            {/* Quiz Summary */}
            <div className="bg-slate-50 rounded-xl p-4 mb-5">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-slate-500">Exam:</div>
                <div className="font-medium text-slate-800">
                  {selectedExam?.name}
                </div>
                <div className="text-slate-500">Subject:</div>
                <div className="font-medium text-slate-800">
                  {currentSubjects.find((s) => s.id === selectedSubject)?.name}
                </div>
                <div className="text-slate-500">Topic:</div>
                <div className="font-medium text-slate-800">
                  {selectedTopic}
                </div>
              </div>
            </div>

            {/* Number of Questions */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Number of Questions
              </label>
              <div className="flex gap-2">
                {[5, 10, 15, 20].map((n) => (
                  <button
                    key={n}
                    onClick={() => setQuestionCount(n)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border-2 ${
                      questionCount === n
                        ? "border-indigo-500 bg-slate-500 text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
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
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border-2 ${
                      difficulty === d.value
                        ? "border-indigo-500 bg-slate-500 text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Pressure Mode Toggle */}
            <div className="mb-4">
              <label className="flex items-center gap-3 p-4 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-xl cursor-pointer hover:from-red-100 hover:to-orange-100 transition-colors">
                <input
                  type="checkbox"
                  checked={pressureMode}
                  onChange={(e) => setPressureMode(e.target.checked)}
                  className="w-5 h-5 text-red-600 rounded focus:ring-2 focus:ring-red-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-red-600" />
                    <span className="font-semibold text-red-900">Pressure Mode</span>
                    <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded-full">INTENSE</span>
                  </div>
                  <p className="text-xs text-red-700 mt-1 flex items-center gap-1">
                    Timer accelerates as time runs out. Simulates real exam stress! <Flame className="w-3.5 h-3.5 inline" />
                  </p>
                </div>
              </label>
            </div>

            {/* Quiz Limit Info */}
            {subData && !subData.isPro && (
              <div className={`mb-4 p-3 rounded-xl text-sm ${
                subData.quizzesRemaining === 0
                  ? "bg-red-50 border border-red-200"
                  : "bg-amber-50 border border-amber-200"
              }`}>
                <div className="flex items-center justify-between">
                  <span className={subData.quizzesRemaining === 0 ? "text-red-700" : "text-amber-700"}>
                    {subData.quizzesRemaining === 0
                      ? "Daily limit reached!"
                      : `${subData.todayQuizCount} of ${subData.quizLimit} free quizzes used today`}
                  </span>
                  <a href="/pricing" className="text-indigo-600 font-medium text-xs hover:text-indigo-700">
                    Upgrade
                  </a>
                </div>
                {subData.quizzesRemaining !== null && subData.quizzesRemaining > 0 && (
                  <div className="mt-2 w-full bg-amber-200 rounded-full h-1.5">
                    <div
                      className="bg-amber-500 h-1.5 rounded-full"
                      style={{ width: `${(subData.todayQuizCount / subData.quizLimit) * 100}%` }}
                    />
                  </div>
                )}
              </div>
            )}

            {subData?.isPro && (
              <div className="mb-4 p-3 rounded-xl text-sm bg-slate-50 border border-slate-200 flex items-center gap-2">
                <span className="px-2 py-0.5 bg-gradient-to-r from-indigo-600 to-violet-500 text-white text-xs font-bold rounded-full">PRO</span>
                <span className="text-indigo-700">Unlimited quizzes</span>
              </div>
            )}

            {/* Start Button */}
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
                className="block mt-3 w-full py-2 text-center text-sm font-medium text-indigo-600 bg-slate-50 rounded-xl hover:bg-indigo-100"
              >
                View Pro Plans →
              </a>
            )}
          </div>
        </section>
      )}

      {/* Exam Count Banner */}
      <section className="mt-8 text-center">
        <div className="inline-flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-sm border border-slate-200">
          <span className="text-sm text-slate-600">
            Covering{" "}
            <span className="font-bold text-indigo-600">
              {examCategories.reduce(
                (sum, cat) => sum + cat.exams.length,
                0
              )}
            </span>{" "}
            exams across{" "}
            <span className="font-bold text-indigo-600">
              {examCategories.length}
            </span>{" "}
            categories with{" "}
            <span className="font-bold text-indigo-600">
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
          <div className="bg-white rounded-xl p-5 border border-slate-200 text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-emerald-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-800 mb-1">Expert Verified</h3>
            <p className="text-xs text-slate-500">Questions curated from NCERT, previous year papers &amp; standard textbooks</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-slate-200 text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-indigo-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-800 mb-1">Exam-Pattern Based</h3>
            <p className="text-xs text-slate-500">Questions match the actual difficulty and pattern of your target exam</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-slate-200 text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-amber-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-800 mb-1">Smart Progress</h3>
            <p className="text-xs text-slate-500">Tracks weak topics and schedules revision using spaced repetition</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <HomePageContent />
    </Suspense>
  );
}
