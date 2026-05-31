"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useUser } from "@/context/user-context";
import { examCategories } from "@/lib/exams";
import {
  Sparkles, Zap, Target, Brain, TrendingUp, CheckCircle2,
  Search, ArrowRight, Star, BookOpen, Timer, Flame,
  MessageSquare, Calendar, Clock, Users, Trophy, Award, ChevronDown, ChevronLeft, ChevronRight
} from "lucide-react";
import { ColorfulExamIcon } from "@/lib/colorful-exam-icons";

export function LandingPageV2() {
  const { setShowLoginModal } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showExamsDropdown, setShowExamsDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(4); // Start at position 4 (first real card for 4-card layout)
  const [isTransitioning, setIsTransitioning] = useState(true);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const examsDropdownRef = useRef<HTMLDivElement>(null);

  // Search logic
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;

    const query = searchQuery.toLowerCase();
    const results: Array<{
      type: "exam" | "subject" | "topic";
      examId: string;
      examName: string;
      subjectName?: string;
      topicName?: string;
      category: string;
    }> = [];

    examCategories.forEach((category) => {
      category.exams.forEach((exam) => {
        if (exam.name.toLowerCase().includes(query) ||
            exam.fullName.toLowerCase().includes(query) ||
            exam.description.toLowerCase().includes(query)) {
          results.push({
            type: "exam",
            examId: exam.id,
            examName: exam.name,
            category: category.name,
          });
        }

        exam.subjects.forEach((subject) => {
          if (subject.name.toLowerCase().includes(query)) {
            results.push({
              type: "subject",
              examId: exam.id,
              examName: exam.name,
              subjectName: subject.name,
              category: category.name,
            });
          }

          subject.topics.forEach((topic) => {
            if (topic.toLowerCase().includes(query)) {
              results.push({
                type: "topic",
                examId: exam.id,
                examName: exam.name,
                subjectName: subject.name,
                topicName: topic,
                category: category.name,
              });
            }
          });
        });
      });
    });

    return results.slice(0, 8);
  }, [searchQuery]);

  // Close search on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (examsDropdownRef.current && !examsDropdownRef.current.contains(event.target as Node)) {
        setShowExamsDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle infinite loop seamlessly with cloned cards (4-card layout)
  useEffect(() => {
    // After sliding to last clone (index 10), jump to first real card (index 4)
    if (carouselIndex === 10 && isTransitioning) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCarouselIndex(4);
        setTimeout(() => setIsTransitioning(true), 50);
      }, 500);
    }
    // After sliding to first clone (index 0), jump to last real card (index 6)
    else if (carouselIndex === 0 && isTransitioning) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCarouselIndex(6);
        setTimeout(() => setIsTransitioning(true), 50);
      }, 500);
    }
  }, [carouselIndex, isTransitioning]);

  // Study modes data - Quizlet style with exact pastel colors
  const studyModes = [
    { id: 1, emoji: "📝", title: "Topic Practice", desc: "Master specific topics with customizable quizzes. Choose difficulty and question count.", headerColor: "bg-orange-200", cta: "Start Learning" },
    { id: 2, emoji: "⏱️", title: "Mock Tests", desc: "Full-length timed tests that simulate real exam conditions. Get detailed performance reports.", headerColor: "bg-emerald-200", cta: "Take Mock Test" },
    { id: 3, emoji: "🧠", title: "Smart Review", desc: "AI-powered spaced repetition. Review at the perfect moment to maximize retention.", headerColor: "bg-sky-200", cta: "Review Now" },
    { id: 4, emoji: "🎮", title: "Level Mode", desc: "Progress through levels from beginner to expert. Unlock harder topics as you master basics.", headerColor: "bg-purple-200", cta: "Play Levels" },
    { id: 5, emoji: "⚡", title: "Pressure Mode", desc: "Build mental toughness with adaptive timers. Train your brain to perform under stress.", headerColor: "bg-rose-200", cta: "Start Training" },
    { id: 6, emoji: "🔥", title: "Daily Practice", desc: "10 questions, 10 minutes. Build your streak and stay consistent every day.", headerColor: "bg-cyan-200", cta: "Start Challenge" },
  ];

  // Create infinite loop by cloning last 4 cards at start and first 4 cards at end (for 4-card display)
  const infiniteModes = [
    ...studyModes.slice(-4), // Last 4 cards (clones at start)
    ...studyModes,           // All 6 real cards
    ...studyModes.slice(0, 4) // First 4 cards (clones at end)
  ];

  return (
    <div className="min-h-screen bg-white font-sans" data-version="v16-unified-background">
      {/* Header with Exams Dropdown - Quizlet Style */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
        {/* Top Bar - Badge */}
        <div className="bg-indigo-50 border-b border-indigo-100">
          <div className="max-w-7xl mx-auto px-6 py-2">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-700">India's Most Loved Exam Prep Platform</span>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-6">
          {/* Left side: Logo + Exams Dropdown */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-semibold text-xl">P</span>
              </div>
              <span className="font-semibold text-xl text-slate-900">PrepGenie</span>
            </div>

            {/* Exams Dropdown */}
            <div ref={examsDropdownRef} className="relative hidden lg:block">
              <button
                onClick={() => setShowExamsDropdown(!showExamsDropdown)}
                className="flex items-center gap-1.5 px-3 py-2 text-slate-700 hover:text-slate-900 font-semibold text-base rounded-lg hover:bg-slate-50 transition-colors"
              >
                <span>Exams</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showExamsDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Two-Level Dropdown */}
              {showExamsDropdown && (
                <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex">
                  {/* Left Panel - Categories */}
                  <div className="w-64 bg-slate-50 border-r border-slate-200">
                    <div className="p-2">
                      {examCategories.map((category) => (
                        <button
                          key={category.id}
                          onMouseEnter={() => setSelectedCategory(category.id)}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors flex items-center justify-between group ${
                            selectedCategory === category.id
                              ? 'bg-white text-slate-900 shadow-sm'
                              : 'text-slate-700 hover:bg-white hover:text-slate-900'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 flex items-center justify-center">
                              {category.id === 'engineering' && <span className="text-xl">⚙️</span>}
                              {category.id === 'medical' && <span className="text-xl">🩺</span>}
                              {category.id === 'civil-services' && <span className="text-xl">🏛️</span>}
                              {category.id === 'ssc' && <span className="text-xl">📋</span>}
                              {category.id === 'banking' && <span className="text-xl">🏦</span>}
                              {category.id === 'defense' && <span className="text-xl">🎖️</span>}
                              {category.id === 'law' && <span className="text-xl">⚖️</span>}
                              {category.id === 'management' && <span className="text-xl">💼</span>}
                            </div>
                            <span className="font-semibold text-sm">{category.name}</span>
                          </div>
                          <ArrowRight className={`w-4 h-4 transition-transform ${
                            selectedCategory === category.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                          }`} />
                        </button>
                      ))}
                    </div>

                    {/* View All at Bottom */}
                    <div className="p-3 border-t border-slate-200 bg-slate-50">
                      <button
                        onClick={() => {
                          setShowExamsDropdown(false);
                          setShowLoginModal(true);
                        }}
                        className="w-full text-center px-3 py-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        View all 60 exams
                      </button>
                    </div>
                  </div>

                  {/* Right Panel - Exams */}
                  <div className="w-80 bg-white p-4 max-h-[420px] overflow-y-auto">
                    {selectedCategory ? (
                      <>
                        <h3 className="font-semibold text-slate-900 mb-3 text-sm">
                          {examCategories.find(c => c.id === selectedCategory)?.name}
                        </h3>
                        <div className="space-y-1">
                          {examCategories
                            .find(c => c.id === selectedCategory)
                            ?.exams.map((exam) => (
                              <button
                                key={exam.id}
                                onClick={() => {
                                  setShowExamsDropdown(false);
                                  setShowLoginModal(true);
                                }}
                                className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-2.5 group"
                              >
                                <ColorfulExamIcon examId={exam.id} size={20} />
                                <div className="flex-1">
                                  <div className="font-medium">{exam.name}</div>
                                  <div className="text-xs text-slate-500 line-clamp-1">{exam.description}</div>
                                </div>
                                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </button>
                            ))}
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full text-slate-500 text-sm">
                        Hover over a category to see exams
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Center: Search Bar - Quizlet Style */}
          <div ref={searchContainerRef} className="flex-1 max-w-2xl mx-auto relative hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search exams, subjects, topics..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all bg-slate-50 hover:bg-white"
              />
            </div>

            {/* Search Results Dropdown */}
            {showSearchDropdown && searchQuery.trim() && searchResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50 max-h-[500px] overflow-y-auto">
                {searchResults.map((result, index) => (
                  <button
                    key={index}
                    onClick={() => setShowLoginModal(true)}
                    className="w-full px-4 py-3 hover:bg-slate-50 transition-colors text-left border-b border-slate-100 last:border-b-0 group"
                  >
                    <div className="flex items-center gap-3">
                      <ColorfulExamIcon examId={result.examId} size={32} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-semibold text-sm text-slate-900">{result.examName}</span>
                          <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                            {result.category}
                          </span>
                        </div>
                        {result.type === "subject" && (
                          <p className="text-xs text-slate-600 font-medium">{result.subjectName}</p>
                        )}
                        {result.type === "topic" && (
                          <p className="text-xs text-slate-600 font-medium">
                            {result.subjectName} → {result.topicName}
                          </p>
                        )}
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right side: Login Button */}
          <button
            onClick={() => setShowLoginModal(true)}
            className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors flex-shrink-0 text-sm"
          >
            Log in
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6">
        {/* Hero Section - Quizlet Style */}
        <section className="pt-8 pb-4 text-center bg-slate-50 relative -mx-6 px-6">
          {/* Main Heading - Simple & Direct */}
          <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-3 leading-tight">
            Master Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600">Competitive Exams</span>
          </h1>

          <p className="text-base md:text-lg text-slate-600 mb-5 max-w-3xl mx-auto leading-relaxed">
            Master JEE, NEET, UPSC, SSC, Banking & 50+ competitive exams with AI-powered practice, smart explanations, and personalized learning.
          </p>

          {/* CTA */}
          <button
            onClick={() => setShowLoginModal(true)}
            className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-base rounded-xl hover:shadow-2xl hover:scale-105 transition-all shadow-lg"
          >
            Start Practicing Free
          </button>
          <p className="text-sm text-slate-500 mt-2">No credit card • 3 free quizzes daily • Join 50,000+ students</p>

          {/* Trust Stats */}
          <div className="mt-6 flex flex-wrap justify-center gap-6 text-center">
            <div>
              <div className="text-2xl font-semibold text-indigo-600 mb-1">60+</div>
              <div className="text-xs text-slate-600">Exams Covered</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-purple-600 mb-1">1,870+</div>
              <div className="text-xs text-slate-600">Practice Topics</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-violet-600 mb-1">50K+</div>
              <div className="text-xs text-slate-600">Active Students</div>
            </div>
          </div>
        </section>

        {/* Study Modes - Carousel (Quizlet Style) */}
        <section className="pt-4 pb-10 bg-slate-50 relative -mx-6 px-6">
          <div className="max-w-7xl mx-auto relative">
            {/* Left Arrow - Overlapping */}
            <button
              onClick={() => setCarouselIndex(carouselIndex - 1)}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-all border-2 border-slate-200"
              style={{ transform: 'translate(-25%, -50%)' }}
            >
              <ChevronLeft className="w-6 h-6 text-slate-800" />
            </button>

            {/* Right Arrow - Overlapping */}
            <button
              onClick={() => setCarouselIndex(carouselIndex + 1)}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-all border-2 border-slate-200"
              style={{ transform: 'translate(25%, -50%)' }}
            >
              <ChevronRight className="w-6 h-6 text-slate-800" />
            </button>

            <div className="overflow-hidden px-4">
              <div
                className="flex gap-6"
                style={{
                  transform: `translateX(-${(carouselIndex * 100) / 4}%)`,
                  transition: isTransitioning ? 'transform 600ms cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
                }}
              >
                {infiniteModes.map((mode, index) => (
                  <div key={`${mode.id}-${index}`} className="flex-shrink-0" style={{ width: 'calc(25% - 18px)' }}>
                    <button
                      onClick={() => setShowLoginModal(true)}
                      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group text-left w-full flex flex-col"
                      style={{ minHeight: '360px' }}
                    >
                      {/* Colored Header - Rounded corners inside */}
                      <div className={`${mode.headerColor} h-40 flex items-center justify-center relative overflow-hidden`}>
                        <span className="text-5xl relative z-10 group-hover:scale-105 transition-transform duration-300">{mode.emoji}</span>
                      </div>

                      {/* White Content Area */}
                      <div className="p-5 flex-1 flex flex-col bg-white">
                        <h3 className="text-lg font-bold text-slate-900 mb-2">{mode.title}</h3>
                        <p className="text-slate-600 text-sm leading-relaxed mb-4 flex-1">
                          {mode.desc}
                        </p>
                        <div className="text-indigo-600 font-semibold text-sm flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                          {mode.cta}
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>


        {/* What Makes PrepGenie Different */}
        <section className="py-16 bg-gradient-to-br from-slate-50 to-indigo-50 -mx-6 px-6 my-16 rounded-3xl">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-4">
                What makes PrepGenie <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">different</span>
              </h2>
              <p className="text-slate-600 text-lg">
                India's first exam prep platform with intelligent AI features that actually help you learn
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white rounded-2xl p-8 border border-slate-200 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Rich Explanations</h3>
                <p className="text-slate-600 leading-relaxed">
                  Understand the WHY behind every answer with step-by-step breakdowns, trap alerts, and common mistakes to avoid.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white rounded-2xl p-8 border border-slate-200 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Mistake Tracker</h3>
                <p className="text-slate-600 font-medium leading-relaxed">
                  AI identifies your weakness patterns: calculation errors, concept gaps, time pressure issues, and careless mistakes.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white rounded-2xl p-8 border border-slate-200 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">24/7 AI Tutor</h3>
                <p className="text-slate-600 font-medium leading-relaxed">
                  Stuck at 2 AM? Ask our AI tutor anything. Get instant explanations in simple language, anytime.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-white rounded-2xl p-8 border border-slate-200 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Flame className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Pressure Mode</h3>
                <p className="text-slate-600 font-medium leading-relaxed">
                  Build exam toughness with adaptive timers that simulate real exam stress conditions and time pressure.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="bg-white rounded-2xl p-8 border border-slate-200 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Daily Streaks</h3>
                <p className="text-slate-600 font-medium leading-relaxed">
                  Build consistency with auto-generated daily practice problems. 10 questions, 10 minutes. Make it a habit.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="bg-white rounded-2xl p-8 border border-slate-200 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-green-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">8 Languages</h3>
                <p className="text-slate-600 font-medium leading-relaxed">
                  Practice in Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada or English. Learn in your mother tongue.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming Exam Calendar */}
        <section className="py-16">
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-4 text-center">Upcoming exam calendar</h2>
          <p className="text-slate-600 text-center mb-12 text-lg">Mark your dates and start preparing today</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Exam Card 1 */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl p-8 border-2 border-orange-200 hover:border-orange-400 hover:shadow-xl transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                  📅
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">JEE Main</h3>
                  <p className="text-sm text-orange-700 font-semibold">Session 1</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 text-center border-2 border-orange-300">
                <div className="text-xs text-orange-700 font-semibold uppercase mb-2">Exam Date</div>
                <div className="text-lg font-semibold text-orange-900">22nd Jan</div>
                <div className="text-lg font-semibold text-orange-700">2026</div>
              </div>
              <button
                onClick={() => setShowLoginModal(true)}
                className="w-full mt-6 px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors"
              >
                Start Preparing
              </button>
            </div>

            {/* Exam Card 2 */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border-2 border-green-200 hover:border-green-400 hover:shadow-xl transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                  🩺
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">NEET UG</h3>
                  <p className="text-sm text-green-700 font-semibold">Medical Entrance</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 text-center border-2 border-green-300">
                <div className="text-xs text-green-700 font-semibold uppercase mb-2">Exam Date</div>
                <div className="text-lg font-semibold text-green-900">5th May</div>
                <div className="text-lg font-semibold text-green-700">2026</div>
              </div>
              <button
                onClick={() => setShowLoginModal(true)}
                className="w-full mt-6 px-6 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors"
              >
                Start Preparing
              </button>
            </div>

            {/* Exam Card 3 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                  📋
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">SSC CGL</h3>
                  <p className="text-sm text-blue-700 font-semibold">Tier 1</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 text-center border-2 border-blue-300">
                <div className="text-xs text-blue-700 font-semibold uppercase mb-2">Exam Date</div>
                <div className="text-lg font-semibold text-blue-900">June</div>
                <div className="text-lg font-semibold text-blue-700">2026</div>
              </div>
              <button
                onClick={() => setShowLoginModal(true)}
                className="w-full mt-6 px-6 py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors"
              >
                Start Preparing
              </button>
            </div>
          </div>

          <div className="text-center mt-10">
            <button
              onClick={() => setShowLoginModal(true)}
              className="text-indigo-600 font-semibold text-lg hover:text-indigo-700 flex items-center gap-2 mx-auto"
            >
              View full exam calendar
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-12 text-center">
              Trusted by 50,000+ students
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-3xl p-8 border-2 border-slate-200 hover:shadow-xl transition-shadow">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 mb-6 text-base leading-relaxed italic">
                  "Finally understand WHY I got questions wrong, not just WHAT the answer is. Game changer for JEE prep!"
                </p>
                <div className="font-semibold text-slate-900">Priya S.</div>
                <div className="text-sm text-slate-500">JEE Main 2026</div>
              </div>

              <div className="bg-white rounded-3xl p-8 border-2 border-slate-200 hover:shadow-xl transition-shadow">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 mb-6 text-base leading-relaxed italic">
                  "The mistake tracker helped me realize I was making the same careless errors. Fixed it in 2 weeks!"
                </p>
                <div className="font-semibold text-slate-900">Rahul M.</div>
                <div className="text-sm text-slate-500 font-semibold">NEET UG 2026</div>
              </div>

              <div className="bg-white rounded-3xl p-8 border-2 border-slate-200 hover:shadow-xl transition-shadow">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 mb-6 text-base leading-relaxed italic">
                  "Best ₹79 I've spent on exam prep. Better than coaching classes charging ₹50,000!"
                </p>
                <div className="font-semibold text-slate-900">Anjali K.</div>
                <div className="text-sm text-slate-500 font-semibold">UPSC CSE 2026</div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 rounded-3xl p-12 md:p-16 text-center text-white shadow-2xl">
            <h2 className="text-3xl md:text-5xl font-semibold mb-6">
              Ready to ace your exam?
            </h2>
            <p className="text-lg md:text-xl text-indigo-100 mb-10 max-w-3xl mx-auto leading-relaxed">
              Join 50,000+ students who are already mastering their competitive exams with PrepGenie
            </p>
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-10 py-4 bg-white text-indigo-700 font-semibold text-lg rounded-xl hover:bg-slate-50 hover:scale-105 transition-all shadow-xl"
            >
              Start Free Today
            </button>
            <p className="text-indigo-100 text-sm mt-6">
              No credit card required • 3 free quizzes daily • Cancel anytime
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
