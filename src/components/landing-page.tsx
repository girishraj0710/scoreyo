"use client";

import { InlineLoginForm } from "@/components/inline-login-form";

export function LandingPage() {
  const scrollToForm = () => {
    const formElement = document.getElementById("signup-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth", block: "start" });
      const emailInput = formElement.querySelector("input[type='email']") as HTMLInputElement;
      if (emailInput) {
        setTimeout(() => emailInput.focus(), 500);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Main Content (takes 2/3 width) */}
          <div className="flex-1 lg:max-w-[calc(100%-350px)]">
            {/* Hero Section */}
            <section className="mb-12">
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
                AI-powered practice platform for JEE, NEET, UPSC, SSC, Banking, CAT, GATE & 20+ Indian competitive exams.
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

              {/* CTA for Mobile */}
              <div className="lg:hidden">
                <button
                  onClick={scrollToForm}
                  className="w-full px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all text-lg"
                >
                  Get Started Free →
                </button>
              </div>
            </section>

            {/* Exams Covered Section */}
            <section className="mb-12">
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
                  onClick={scrollToForm}
                  className="text-indigo-600 font-semibold hover:text-indigo-700 text-sm"
                >
                  Sign up to view all 20+ exams →
                </button>
              </div>
            </section>

            {/* Features Section */}
            <section className="mb-12">
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

            {/* Final CTA */}
            <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-8 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Ready to Start Your Success Journey?
              </h2>
              <p className="text-indigo-100 mb-6">
                Join thousands of students mastering their competitive exams
              </p>
              <button
                onClick={scrollToForm}
                className="px-8 py-3 bg-white text-indigo-700 font-semibold rounded-xl hover:bg-indigo-50 shadow-xl hover:shadow-2xl transition-all"
              >
                Get Started Free →
              </button>
              <p className="text-indigo-100 text-xs mt-3">No credit card required • Start in 30 seconds</p>
            </section>
          </div>

          {/* Right: Sticky Signup Form (takes fixed width) */}
          <div className="hidden lg:block w-[330px] flex-shrink-0">
            <div className="sticky top-8" id="signup-form">
              <InlineLoginForm />
            </div>
          </div>
        </div>

        {/* Mobile Signup Form */}
        <div className="lg:hidden mt-8" id="signup-form">
          <InlineLoginForm />
        </div>
      </div>
    </div>
  );
}
