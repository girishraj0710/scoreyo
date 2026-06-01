"use client";

import { useRouter } from "next/navigation";

export default function IELTSSpeakingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push('/english')}
          className="mb-6 flex items-center gap-2 text-slate-600 hover:text-[#4255FF] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to English Learning
        </button>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">IELTS Speaking Practice</h1>
          <p className="text-lg text-slate-600">
            Improve your IELTS speaking skills with structured practice across all three parts of the speaking test.
          </p>
        </div>

        {/* Speaking Test Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border-2 border-slate-200">
            <div className="text-3xl mb-3">👤</div>
            <h3 className="font-bold text-slate-900 mb-2">Part 1</h3>
            <p className="text-sm text-slate-600 mb-3">Introduction & Interview (4-5 min)</p>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• Personal questions</li>
              <li>• Familiar topics</li>
              <li>• Home, family, work</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-6 border-2 border-slate-200">
            <div className="text-3xl mb-3">💬</div>
            <h3 className="font-bold text-slate-900 mb-2">Part 2</h3>
            <p className="text-sm text-slate-600 mb-3">Long Turn (3-4 min)</p>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• Cue card topic</li>
              <li>• 1 minute prep time</li>
              <li>• 2 minute speech</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-6 border-2 border-slate-200">
            <div className="text-3xl mb-3">🎓</div>
            <h3 className="font-bold text-slate-900 mb-2">Part 3</h3>
            <p className="text-sm text-slate-600 mb-3">Discussion (4-5 min)</p>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• Abstract topics</li>
              <li>• In-depth discussion</li>
              <li>• Complex ideas</li>
            </ul>
          </div>
        </div>

        {/* Practice Button */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Ready to Practice?
          </h2>
          <p className="text-slate-600 mb-6">
            Get real IELTS speaking questions and practice with timer and sample answers
          </p>
          <button
            onClick={() => router.push('/english/foundation/ielts-speaking/practice')}
            className="px-8 py-4 bg-gradient-to-r from-[#4255FF] to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            Start Practice Session →
          </button>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-white rounded-xl p-6 border border-slate-200">
          <h3 className="font-bold text-slate-900 mb-4">💡 Tips for Success</h3>
          <ul className="space-y-2 text-slate-600">
            <li className="flex items-start gap-2">
              <span className="text-[#4255FF] mt-1">•</span>
              <span>Speak clearly and at a natural pace</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#4255FF] mt-1">•</span>
              <span>Use a variety of vocabulary and grammar structures</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#4255FF] mt-1">•</span>
              <span>Don't memorize answers - be natural and spontaneous</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#4255FF] mt-1">•</span>
              <span>Practice regularly to build confidence</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
