"use client";

import { InlineLoginForm } from "@/components/inline-login-form";

export function LandingPage() {
  const scrollToForm = () => {
    const formElement = document.getElementById("signup-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth", block: "start" });
      // Focus the email input
      const emailInput = formElement.querySelector("input[type='email']") as HTMLInputElement;
      if (emailInput) {
        setTimeout(() => emailInput.focus(), 500);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        <div className="grid lg:grid-cols-[1fr,400px] gap-8 items-start">
          {/* Left: Content */}
          <div className="lg:pr-8">
            <div className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-6">
              🎓 Smart Exam Preparation Platform
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Master Your{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                Competitive Exams
              </span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              AI-powered practice platform for JEE, NEET, UPSC, SSC, Banking, CAT, GATE & 20+ Indian competitive exams.
              Get personalized quizzes, mock tests, and smart progress tracking to achieve your dream score.
            </p>

            {/* Trust Indicators */}
            <div className="flex items-center gap-6 text-sm text-slate-600">
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
            </div>
          </div>

          {/* Right: Login Form */}
          <div className="lg:block hidden" id="signup-form">
            <InlineLoginForm />
          </div>
        </div>

        {/* Mobile Login Form - Below hero on mobile */}
        <div className="lg:hidden mt-8" id="signup-form">
          <InlineLoginForm />
        </div>
      </section>

      {/* Exams Covered Section */}
      <section className="bg-white py-16" id="features">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Exams We Cover
          </h2>
          <p className="text-slate-600 text-center mb-12 max-w-2xl mx-auto">
            Comprehensive preparation for India's most competitive exams across multiple categories
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
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
            ].map((exam) => (
              <div
                key={exam.name}
                className={`${exam.color} rounded-xl p-4 border-2 text-center hover:shadow-lg transition-all`}
              >
                <div className="text-3xl mb-2">{exam.icon}</div>
                <div className="font-medium text-sm">{exam.name}</div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={scrollToForm}
              className="text-indigo-600 font-semibold hover:text-indigo-700"
            >
              Sign up to view all 20+ exams →
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Why Students Choose PrepGenie
          </h2>
          <p className="text-slate-600 text-center mb-12 max-w-2xl mx-auto">
            Powerful features designed to help you crack your target exam with confidence
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Expert-Verified Questions</h3>
              <p className="text-slate-600 text-sm">
                Questions curated from NCERT, previous year papers, and standard textbooks. Matches actual exam patterns and difficulty levels.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Smart Progress Tracking</h3>
              <p className="text-slate-600 text-sm">
                Track your accuracy, identify weak topics, and get personalized recommendations. Spaced repetition helps you remember longer.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Full-Length Mock Tests</h3>
              <p className="text-slate-600 text-sm">
                Simulate real exam conditions with timed mock tests. Detailed performance reports show exactly where you stand.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">AI-Generated Questions</h3>
              <p className="text-slate-600 text-sm">
                Unlimited practice with AI-generated questions when verified questions run out. Trained on expert materials for accuracy.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Topic-Wise Practice</h3>
              <p className="text-slate-600 text-sm">
                Practice specific topics you're struggling with. Choose difficulty level, question count, and get instant feedback.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Bilingual Support</h3>
              <p className="text-slate-600 text-sm">
                Practice in English or Hindi. Switch languages anytime to match your comfort level and exam requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Start Free, Upgrade When Ready
          </h2>
          <p className="text-slate-600 mb-8">
            Get 3 free quizzes daily. Upgrade to Pro for unlimited access to mock tests and detailed reports.
          </p>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl p-6 border-2 border-slate-200 text-left">
              <div className="text-sm font-medium text-slate-500 mb-2">FREE</div>
              <div className="text-3xl font-bold text-slate-800 mb-4">₹0</div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2 text-sm text-slate-600">
                  <svg className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  3 quizzes per day
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-600">
                  <svg className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Basic progress tracking
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-600">
                  <svg className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  All 20+ exams
                </li>
              </ul>
              <button
                onClick={scrollToForm}
                className="w-full py-3 border-2 border-indigo-200 text-indigo-700 font-semibold rounded-xl hover:bg-indigo-50 transition-all"
              >
                Start Free
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white text-left relative overflow-hidden">
              <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                POPULAR
              </div>
              <div className="text-sm font-medium text-indigo-100 mb-2">PRO</div>
              <div className="text-3xl font-bold mb-1">₹79<span className="text-lg font-normal">/month</span></div>
              <div className="text-xs text-indigo-100 mb-4">or ₹149/quarter (save 37%)</div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2 text-sm">
                  <svg className="w-5 h-5 text-white shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Unlimited quizzes
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <svg className="w-5 h-5 text-white shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Full-length mock tests
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <svg className="w-5 h-5 text-white shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Detailed performance reports
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <svg className="w-5 h-5 text-white shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Priority support
                </li>
              </ul>
              <button
                onClick={scrollToForm}
                className="w-full py-3 bg-white text-indigo-700 font-semibold rounded-xl hover:bg-indigo-50 transition-all"
              >
                Start Free Trial
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Success Journey?
          </h2>
          <p className="text-indigo-100 mb-8 text-lg">
            Join thousands of students who are mastering their competitive exams with PrepGenie
          </p>
          <button
            onClick={scrollToForm}
            className="px-8 py-4 bg-white text-indigo-700 font-semibold rounded-xl hover:bg-indigo-50 shadow-xl hover:shadow-2xl transition-all text-lg"
          >
            Get Started Free →
          </button>
          <p className="text-indigo-100 text-sm mt-4">No credit card required • Start in 30 seconds</p>
        </div>
      </section>
    </div>
  );
}
