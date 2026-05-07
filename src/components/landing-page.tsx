"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useUser } from "@/context/user-context";
import { examCategories } from "@/lib/exams";

export function LandingPage() {
  const { setShowLoginModal } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Ref for search container to detect outside clicks
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Search logic - filters exams, subjects, and topics
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;

    const query = searchQuery.toLowerCase();
    const results: Array<{
      type: "exam" | "subject" | "topic";
      examName: string;
      examIcon: string;
      subjectName?: string;
      topicName?: string;
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
            examName: exam.name,
            examIcon: exam.icon,
            category: category.name,
          });
        }

        // Check subjects and topics
        exam.subjects.forEach((subject) => {
          if (subject.name.toLowerCase().includes(query)) {
            results.push({
              type: "subject",
              examName: exam.name,
              examIcon: exam.icon,
              subjectName: subject.name,
              category: category.name,
            });
          }

          // Check topics
          subject.topics.forEach((topic) => {
            if (topic.toLowerCase().includes(query)) {
              results.push({
                type: "topic",
                examName: exam.name,
                examIcon: exam.icon,
                subjectName: subject.name,
                topicName: topic,
                category: category.name,
              });
            }
          });
        });
      });
    });

    return results.slice(0, 10); // Limit to 10 results
  }, [searchQuery]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="mb-12 max-w-4xl mx-auto text-center">
              <div className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-6">
                🎓 Smart Exam Preparation Platform
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Master Your{" "}
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                  Competitive Exams
                </span>
              </h1>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                AI-powered practice platform for JEE, NEET, UPSC, SSC, Banking, CAT, GATE & 50+ Indian competitive exams.
                Get personalized quizzes, mock tests, and smart progress tracking to achieve your dream score.
              </p>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-8">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Free daily quizzes</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Expert verified questions</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>No credit card required</span>
                </div>
              </div>

          {/* Search Bar */}
          <div ref={searchContainerRef} className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for exams, subjects, topics..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                className="w-full px-6 py-4 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:outline-none text-base"
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
                      onClick={() => setShowLoginModal(true)}
                      className="w-full px-4 py-3 hover:bg-indigo-50 transition-colors text-left border-b border-slate-100 last:border-b-0"
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl mt-0.5">{result.examIcon}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-slate-800">{result.examName}</span>
                            <span className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full">
                              {result.category}
                            </span>
                          </div>
                          {result.type === "exam" && (
                            <p className="text-sm text-slate-600">Full exam</p>
                          )}
                          {result.type === "subject" && (
                            <p className="text-sm text-slate-600">
                              <span className="font-medium">{result.subjectName}</span>
                            </p>
                          )}
                          {result.type === "topic" && (
                            <p className="text-sm text-slate-600">
                              <span className="font-medium">{result.subjectName}</span> → {result.topicName}
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
                <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    Sign up to start practicing →
                  </button>
                </div>
              </div>
            )}

            {/* No Results */}
            {showSearchDropdown && searchQuery.trim() && searchResults && searchResults.length === 0 && (
              <div className="mt-3 bg-white rounded-xl shadow-lg border-2 border-slate-200 p-6 text-center">
                <div className="text-4xl mb-2">🔍</div>
                <p className="font-semibold text-slate-800 mb-1">No results found</p>
                <p className="text-sm text-slate-600">Try searching for JEE, NEET, UPSC, SSC, Physics, etc.</p>
              </div>
            )}
          </div>

          {/* CTA Button */}
          <div className="flex justify-center mb-8">
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
            >
              Get Started Free →
            </button>
          </div>

          {/* Real Content Stats */}
          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-indigo-600">60</div>
              <div className="text-sm text-slate-600">Major Exams</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-600">209</div>
              <div className="text-sm text-slate-600">Subjects Covered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-600">1,870+</div>
              <div className="text-sm text-slate-600">Practice Topics</div>
            </div>
          </div>
        </section>

        {/* AI-Powered Features Section - NEW! */}
        <section className="mb-12 max-w-6xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Exams We Cover
              </h2>
              <p className="text-slate-600 mb-8">
                Comprehensive preparation for India's most competitive exams across multiple categories
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { name: "JEE Main/Advanced", icon: "🎯", color: "bg-blue-50 border-blue-200 text-blue-700" },
                  { name: "NEET UG/PG", icon: "🏥", color: "bg-green-50 border-green-200 text-green-700" },
                  { name: "UPSC CSE", icon: "🏛️", color: "bg-purple-50 border-purple-200 text-purple-700" },
                  { name: "SSC CGL/CHSL", icon: "📝", color: "bg-orange-50 border-orange-200 text-orange-700" },
                  { name: "Banking (IBPS/SBI)", icon: "🏦", color: "bg-teal-50 border-teal-200 text-teal-700" },
                  { name: "CAT/MBA", icon: "💼", color: "bg-indigo-50 border-indigo-200 text-indigo-700" },
                  { name: "GATE", icon: "⚙️", color: "bg-red-50 border-red-200 text-red-700" },
                  { name: "Railway Exams", icon: "🚂", color: "bg-yellow-50 border-yellow-200 text-yellow-700" },
                  { name: "State PSC", icon: "🏢", color: "bg-pink-50 border-pink-200 text-pink-700" },
                  { name: "CLAT", icon: "⚖️", color: "bg-cyan-50 border-cyan-200 text-cyan-700" },
                  { name: "NDA/CDS", icon: "🎖️", color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
                  { name: "Delhi Police", icon: "👮", color: "bg-slate-50 border-slate-200 text-slate-700" },
                ].map((exam) => (
                  <div
                    key={exam.name}
                    className={`${exam.color} rounded-lg p-3 border-2 text-center hover:shadow-md transition-all`}
                  >
                    <div className="text-2xl mb-1">{exam.icon}</div>
                    <div className="font-medium text-xs">{exam.name}</div>
                  </div>
                ))}
              </div>

          <div className="text-center mt-6">
            <button
              onClick={() => setShowLoginModal(true)}
              className="text-indigo-600 font-semibold hover:text-indigo-700 text-sm"
            >
              Sign up to view all 60 exams →
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-12 max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Why Students Choose PrepGenie
              </h2>
              <p className="text-slate-600 mb-8">
                Powerful features designed to help you crack your target exam with confidence
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Feature 1 */}
                <div className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all border border-slate-100">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-3">
                    <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">Expert-Verified Questions</h3>
                  <p className="text-slate-600 text-sm">
                    Questions curated from NCERT, previous year papers, and standard textbooks. Matches actual exam patterns.
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all border border-slate-100">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                    <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">Smart Progress Tracking</h3>
                  <p className="text-slate-600 text-sm">
                    Track accuracy, identify weak topics, and get personalized recommendations with spaced repetition.
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all border border-slate-100">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-3">
                    <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">Full-Length Mock Tests</h3>
                  <p className="text-slate-600 text-sm">
                    Simulate real exam conditions with timed mock tests. Detailed performance reports show where you stand.
                  </p>
                </div>

                {/* Feature 4 */}
                <div className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all border border-slate-100">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mb-3">
                    <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">AI-Generated Questions</h3>
                  <p className="text-slate-600 text-sm">
                    Unlimited practice with AI-generated questions when verified questions run out. Trained on expert materials.
                  </p>
                </div>

                {/* Feature 5 */}
                <div className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all border border-slate-100">
                  <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center mb-3">
                    <svg className="w-5 h-5 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">Topic-Wise Practice</h3>
                  <p className="text-slate-600 text-sm">
                    Practice specific topics you're struggling with. Choose difficulty level and question count.
                  </p>
                </div>

                {/* Feature 6 */}
                <div className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all border border-slate-100">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">Bilingual Support</h3>
                  <p className="text-slate-600 text-sm">
                    Practice in English or Hindi. Switch languages anytime to match your comfort level.
                  </p>
                </div>
            </div>
        </section>

        {/* Why Choose PrepGenie Section */}
        <section className="mb-12 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            Why Students Choose PrepGenie
          </h2>
          <p className="text-center text-slate-600 mb-8">Join our growing community of exam aspirants</p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200 text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-md">
                <div className="text-3xl">📚</div>
              </div>
              <h3 className="text-xl font-bold text-indigo-600 mb-2">Expert Content</h3>
              <p className="text-sm text-slate-600">Questions curated from NCERT, previous year papers & standard textbooks</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200 text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-md">
                <div className="text-3xl">🎯</div>
              </div>
              <h3 className="text-xl font-bold text-emerald-600 mb-2">Smart Practice</h3>
              <p className="text-sm text-slate-600">AI-powered quizzes, spaced repetition & personalized recommendations</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200 text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-md">
                <div className="text-3xl">📊</div>
              </div>
              <h3 className="text-xl font-bold text-purple-600 mb-2">Track Progress</h3>
              <p className="text-sm text-slate-600">Detailed analytics, performance reports & weakness analysis</p>
            </div>
          </div>
        </section>

        <section className="mb-12 max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full mb-4">
              <span className="text-2xl">🤖</span>
              <span className="text-sm font-bold text-indigo-700">AI-POWERED LEARNING</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              What Makes PrepGenie <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Different</span>
            </h2>
            <p className="text-slate-600 text-lg">
              India's first exam prep platform with intelligent AI features that actually help you learn
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1: Rich Explanations */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border-2 border-emerald-200 hover:border-emerald-400 transition-all hover:shadow-xl">
              <div className="w-14 h-14 bg-emerald-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <span className="text-3xl">💡</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Rich Explanations with Trap Alerts</h3>
              <p className="text-slate-700 text-sm mb-3">
                Don't just see the answer—understand the <strong>WHY</strong>. Every question includes:
              </p>
              <ul className="text-sm text-slate-600 space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 mt-0.5">✓</span>
                  <span>Core concept explanation in simple language</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 mt-0.5">✓</span>
                  <span>Step-by-step formula breakdown</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 mt-0.5">✓</span>
                  <span><strong>Trap alerts</strong> showing why wrong options tempt you</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 mt-0.5">✓</span>
                  <span>Common mistakes to avoid</span>
                </li>
              </ul>
              <div className="mt-4 px-3 py-2 bg-white/60 rounded-lg border border-emerald-300">
                <p className="text-xs text-slate-600 italic">
                  "Finally understand WHY I got it wrong, not just WHAT is correct!"
                </p>
              </div>
            </div>

            {/* Feature 2: Mistake Map */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200 hover:border-purple-400 transition-all hover:shadow-xl">
              <div className="w-14 h-14 bg-purple-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Mistake Map - Your Weakness Tracker</h3>
              <p className="text-slate-700 text-sm mb-3">
                Stop repeating the same mistakes. Our AI categorizes every error into:
              </p>
              <ul className="text-sm text-slate-600 space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">🧮</span>
                  <span><strong>Calculation errors</strong> - Math mistakes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">🧠</span>
                  <span><strong>Concept gaps</strong> - Understanding issues</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">⏱️</span>
                  <span><strong>Time pressure</strong> - Rushed answers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">😴</span>
                  <span><strong>Careless errors</strong> - Silly mistakes</span>
                </li>
              </ul>
              <div className="mt-4 px-3 py-2 bg-white/60 rounded-lg border border-purple-300">
                <p className="text-xs text-slate-600 italic">
                  Get personalized practice recommendations based on your weakness patterns
                </p>
              </div>
            </div>

            {/* Feature 3: Midnight Doubt AI */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200 hover:border-blue-400 transition-all hover:shadow-xl">
              <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <span className="text-3xl">🤖</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">24/7 AI Doubt Solver</h3>
              <p className="text-slate-700 text-sm mb-3">
                Stuck at 2 AM? No problem. Ask our AI tutor anything, anytime:
              </p>
              <ul className="text-sm text-slate-600 space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">⚡</span>
                  <span><strong>Instant answers</strong> in under 3 seconds</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">💬</span>
                  <span>Simple, conversational explanations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">🔄</span>
                  <span>Ask follow-up questions until you get it</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">🎯</span>
                  <span>Context-aware (knows the question you're solving)</span>
                </li>
              </ul>
              <div className="mt-4 px-3 py-2 bg-white/60 rounded-lg border border-blue-300">
                <p className="text-xs text-slate-600 italic">
                  "Like having a patient tutor available 24/7—even during late night study sessions!"
                </p>
              </div>
            </div>

            {/* Feature 4: Pressure Mode */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 border-2 border-red-200 hover:border-red-400 transition-all hover:shadow-xl">
              <div className="w-14 h-14 bg-red-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Pressure Mode Training</h3>
              <p className="text-slate-700 text-sm mb-3">
                Build mental toughness for exam day. Our adaptive timer simulates real exam stress:
              </p>
              <ul className="text-sm text-slate-600 space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-0.5">🔥</span>
                  <span><strong>Timer accelerates</strong> as you progress (up to 40% faster)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-0.5">💪</span>
                  <span>Visual stress elements (pulsing clock, color changes)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-0.5">🎯</span>
                  <span>Practice staying calm under pressure</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-0.5">📈</span>
                  <span>Separate tracking to measure performance under stress</span>
                </li>
              </ul>
              <div className="mt-4 px-3 py-2 bg-white/60 rounded-lg border border-red-300">
                <p className="text-xs text-slate-600 italic">
                  Train your brain to perform when the clock is ticking
                </p>
              </div>
            </div>

            {/* Feature 5: Daily Practice Problems */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border-2 border-amber-200 hover:border-amber-400 transition-all hover:shadow-xl">
              <div className="w-14 h-14 bg-amber-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <span className="text-3xl">🔥</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Daily Practice + Streaks</h3>
              <p className="text-slate-700 text-sm mb-3">
                Build a daily study habit with gamified micro-learning:
              </p>
              <ul className="text-sm text-slate-600 space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">📅</span>
                  <span><strong>Auto-generated DPPs</strong> every day (10 questions, 10 mins)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">🔥</span>
                  <span>Streak tracking keeps you motivated</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">🎯</span>
                  <span>Smart topic rotation covers all subjects</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">⏰</span>
                  <span>Bite-sized sessions fit your busy schedule</span>
                </li>
              </ul>
              <div className="mt-4 px-3 py-2 bg-white/60 rounded-lg border border-amber-300">
                <p className="text-xs text-slate-600 italic">
                  Consistency beats intensity—make daily practice your superpower
                </p>
              </div>
            </div>

            {/* Feature 6: Multilingual Support */}
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6 border-2 border-teal-200 hover:border-teal-400 transition-all hover:shadow-xl">
              <div className="w-14 h-14 bg-teal-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <span className="text-3xl">🌏</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">8 Indian Languages</h3>
              <p className="text-slate-700 text-sm mb-3">
                Practice in your mother tongue for better understanding:
              </p>
              <ul className="text-sm text-slate-600 space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 mt-0.5">🇮🇳</span>
                  <span>English, हिंदी, தமிழ், తెలుగు, বাংলা, मराठी, ગુજરાતી, ಕನ್ನಡ</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 mt-0.5">🔄</span>
                  <span>Switch languages anytime</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 mt-0.5">📖</span>
                  <span>Complete UI + questions translated</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 mt-0.5">✨</span>
                  <span>Covers 95% of India's exam aspirants</span>
                </li>
              </ul>
              <div className="mt-4 px-3 py-2 bg-white/60 rounded-lg border border-teal-300">
                <p className="text-xs text-slate-600 italic">
                  Learn in the language you think in—no translation friction
                </p>
              </div>
            </div>
          </div>

          {/* CTA after features */}
          <div className="mt-10 text-center">
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
            >
              Experience These Features Free →
            </button>
            <p className="text-sm text-slate-500 mt-3">No credit card • Start in 30 seconds • 3 free quizzes daily</p>
          </div>
        </section>

        {/* Comparison Section - Why PrepGenie vs Others */}
        {/* Upcoming Exam Calendar Section */}
        <section className="mb-12 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Upcoming Exam Calendar</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Exam Card 1 */}
            <div className="bg-white rounded-xl p-5 border-2 border-amber-200 hover:border-amber-400 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-2xl">📅</div>
                <div>
                  <h3 className="font-bold text-slate-800">JEE Main 2026</h3>
                  <p className="text-xs text-slate-500">Session 1</p>
                </div>
              </div>
              <div className="bg-amber-50 rounded-lg px-3 py-2 text-center">
                <div className="text-xs text-amber-700 font-medium">Exam Date</div>
                <div className="text-lg font-bold text-amber-900">22nd Jan 2026</div>
              </div>
            </div>

            {/* Exam Card 2 */}
            <div className="bg-white rounded-xl p-5 border-2 border-green-200 hover:border-green-400 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl">🩺</div>
                <div>
                  <h3 className="font-bold text-slate-800">NEET UG 2026</h3>
                  <p className="text-xs text-slate-500">Medical Entrance</p>
                </div>
              </div>
              <div className="bg-green-50 rounded-lg px-3 py-2 text-center">
                <div className="text-xs text-green-700 font-medium">Exam Date</div>
                <div className="text-lg font-bold text-green-900">5th May 2026</div>
              </div>
            </div>

            {/* Exam Card 3 */}
            <div className="bg-white rounded-xl p-5 border-2 border-blue-200 hover:border-blue-400 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">📋</div>
                <div>
                  <h3 className="font-bold text-slate-800">SSC CGL 2026</h3>
                  <p className="text-xs text-slate-500">Tier 1</p>
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg px-3 py-2 text-center">
                <div className="text-xs text-blue-700 font-medium">Exam Date</div>
                <div className="text-lg font-bold text-blue-900">June 2026</div>
              </div>
            </div>
          </div>

          <div className="text-center mt-6">
            <button
              onClick={() => setShowLoginModal(true)}
              className="text-indigo-600 font-semibold hover:text-indigo-700 text-sm"
            >
              View full exam calendar →
            </button>
          </div>
        </section>

        {/* Mobile App Section */}
        <section className="mb-12 max-w-4xl mx-auto bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 md:p-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Practice Anytime, Anywhere</h2>
            <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
              Download PrepGenie mobile app and prepare for your exams on the go. Available on Android and iOS.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <a href="#" className="inline-block">
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" className="h-12" />
              </a>
              <a href="#" className="inline-block">
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="Download on the App Store" className="h-12" />
              </a>
            </div>

            <div className="flex justify-center gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Offline Access</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Daily Notifications</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Progress Sync</span>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-8 text-center max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Ready to Start Your Success Journey?
              </h2>
              <p className="text-indigo-100 mb-6">
                Join thousands of students mastering their competitive exams
              </p>
              <button
                onClick={() => setShowLoginModal(true)}
                className="px-8 py-3 bg-white text-indigo-700 font-semibold rounded-xl hover:bg-indigo-50 shadow-xl hover:shadow-2xl transition-all"
              >
                Get Started Free →
              </button>
          <p className="text-indigo-100 text-xs mt-3">No credit card required • Start in 30 seconds</p>
        </section>
      </div>
    </div>
  );
}
