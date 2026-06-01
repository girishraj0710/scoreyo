"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Construction, Headphones, Mic, Pen, MessageSquare } from "lucide-react";

function ComingSoonContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic") || "feature";
  const type = searchParams.get("type") || "practice";
  const fromPath = searchParams.get("from");
  const fromTopic = searchParams.get("fromTopic");

  // Construct proper back URL
  const getBackUrl = () => {
    // If we have explicit from params, use them
    if (fromPath && fromTopic) {
      return `/english/${fromPath}/${fromTopic}`;
    }

    // Try to infer from topic name
    const topicToPathMap: Record<string, { path: string; topic: string }> = {
      'ielts-listening': { path: 'ielts-toefl', topic: 'ielts-listening' },
      'ielts-writing': { path: 'ielts-toefl', topic: 'ielts-writing' },
      'pronunciation': { path: 'foundation', topic: 'pronunciation' },
      'listening': { path: 'foundation', topic: 'listening-skills' },
      'presentations': { path: 'real-world', topic: 'presentations' },
      'conversations': { path: 'real-world', topic: 'daily-conversations' },
    };

    const mapping = topicToPathMap[topic];
    if (mapping) {
      return `/english/${mapping.path}/${mapping.topic}`;
    }

    // Fallback to English hub
    return '/english';
  };

  const icons = {
    listening: <Headphones className="w-16 h-16 text-[#4255FF]" />,
    pronunciation: <Mic className="w-16 h-16 text-purple-600" />,
    speaking: <MessageSquare className="w-16 h-16 text-green-600" />,
    writing: <Pen className="w-16 h-16 text-orange-600" />,
  };

  const features = {
    listening: {
      title: "Audio Listening Practice",
      description: "Listen to audio recordings and answer comprehension questions",
      features: [
        "🎧 Native speaker audio clips",
        "📝 Form filling and note completion",
        "🎯 Multiple accents (British, American, Australian)",
        "⏯️ Playback controls with pause/rewind",
        "📊 Listening comprehension scoring",
      ],
    },
    pronunciation: {
      title: "Pronunciation Practice",
      description: "Improve your English pronunciation with audio examples and recording",
      features: [
        "🗣️ Audio examples of correct pronunciation",
        "🎤 Record your own voice for comparison",
        "👄 Mouth position animations",
        "🔊 Minimal pairs practice (e.g., ship vs sheep)",
        "📈 Progress tracking for difficult sounds",
      ],
    },
    speaking: {
      title: "Interactive Speaking Practice",
      description: "Practice real-world conversations and presentations",
      features: [
        "💬 Interactive dialogue scenarios",
        "🎤 Voice recording with playback",
        "📋 Common conversation templates",
        "🎯 Role-playing exercises",
        "✅ Self-assessment checklist",
      ],
    },
    writing: {
      title: "Writing Practice",
      description: "Compose essays, letters, and paragraphs with guidance",
      features: [
        "✍️ Text editor with word count",
        "📝 Writing prompts and templates",
        "💡 Structure guidelines",
        "🤖 AI feedback (coming later)",
        "📊 Progress tracking",
      ],
    },
  };

  const feature = features[type as keyof typeof features] || features.writing;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full flex items-center justify-center">
            <Construction className="w-12 h-12 text-gray-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🚧 Interactive Feature Coming Soon!
          </h1>
          <p className="text-xl text-gray-600">
            We're building a special practice interface for this topic
          </p>
        </div>

        {/* Feature Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
              {icons[type as keyof typeof icons] || icons.writing}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{feature.title}</h2>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          </div>

          {/* Features List */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">What's Coming:</h3>
            <div className="space-y-3">
              {feature.features.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="text-xl">{item.split(" ")[0]}</span>
                  <span className="text-gray-700">{item.substring(item.indexOf(" ") + 1)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⏱️</span>
              <div>
                <p className="font-semibold text-gray-900">Estimated Launch</p>
                <p className="text-gray-700">This feature is in active development and will be available within 1-2 weeks.</p>
              </div>
            </div>
          </div>

          {/* Current Alternative */}
          <div className="bg-[#E8EAFF] border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <p className="font-semibold text-gray-900 mb-2">In the Meantime</p>
                <p className="text-gray-700 mb-3">
                  You can practice related topics that are currently available:
                </p>
                <div className="flex gap-2 flex-wrap">
                  {type === 'listening' && (
                    <>
                      <button
                        onClick={() => router.push('/english/foundation/reading-comprehension/practice')}
                        className="px-4 py-2 bg-[#4255FF] text-white rounded-lg hover:bg-[#3242CC] transition"
                      >
                        Reading Comprehension
                      </button>
                      <button
                        onClick={() => router.push('/english/ielts-toefl/ielts-reading/practice')}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                      >
                        IELTS Reading
                      </button>
                    </>
                  )}
                  {type === 'pronunciation' && (
                    <>
                      <button
                        onClick={() => router.push('/english/foundation/phonics-vowels/practice')}
                        className="px-4 py-2 bg-[#4255FF] text-white rounded-lg hover:bg-[#3242CC] transition"
                      >
                        Phonics & Vowels
                      </button>
                      <button
                        onClick={() => router.push('/english/foundation/parts-of-speech/practice')}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                      >
                        Grammar Basics
                      </button>
                    </>
                  )}
                  {type === 'speaking' && (
                    <>
                      <button
                        onClick={() => router.push('/english/foundation/ielts-speaking/practice')}
                        className="px-4 py-2 bg-[#4255FF] text-white rounded-lg hover:bg-[#3242CC] transition"
                      >
                        IELTS Speaking
                      </button>
                      <button
                        onClick={() => router.push('/english/foundation/idioms/practice')}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                      >
                        Idioms & Phrases
                      </button>
                    </>
                  )}
                  {type === 'writing' && (
                    <>
                      <button
                        onClick={() => router.push('/english/foundation/sentence-types/practice')}
                        className="px-4 py-2 bg-[#4255FF] text-white rounded-lg hover:bg-[#3242CC] transition"
                      >
                        Sentence Structure
                      </button>
                      <button
                        onClick={() => router.push('/english/foundation/common-mistakes/practice')}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                      >
                        Error Correction
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => router.push(getBackUrl())}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
          >
            ← Go Back
          </button>
          <button
            onClick={() => router.push('/english')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg transition font-semibold"
          >
            Explore Other Topics
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ComingSoonPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ComingSoonContent />
    </Suspense>
  );
}
