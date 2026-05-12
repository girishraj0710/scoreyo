"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Clock, FileText, TrendingUp } from "lucide-react";

export interface WritingPrompt {
  id: string;
  title: string;
  prompt: string;
  wordCount: number;
  timeLimit: number;
  tips: string[];
  sampleAnswer?: string;
  category?: string;
}

interface WritingPracticeInterfaceProps {
  title: string;
  description: string;
  prompts: WritingPrompt[];
  categories?: string[];
  showCategories?: boolean;
}

export default function WritingPracticeInterface({
  title,
  description,
  prompts,
  categories = [],
  showCategories = false,
}: WritingPracticeInterfaceProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0] || "all");
  const [selectedPrompt, setSelectedPrompt] = useState<WritingPrompt>(prompts[0]);
  const [userText, setUserText] = useState("");
  const [showSample, setShowSample] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  const handleTextChange = (text: string) => {
    setUserText(text);
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    setWordCount(words.length);
  };

  const filteredPrompts = showCategories && selectedCategory !== "all"
    ? prompts.filter(p => p.category === selectedCategory)
    : prompts;

  const progressColor = wordCount >= selectedPrompt.wordCount ? "text-green-600" : "text-orange-600";

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
              <p className="text-gray-600 mt-1">{description}</p>
            </div>
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              ← Back
            </button>
          </div>

          {/* Category Selector */}
          {showCategories && categories.length > 0 && (
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  selectedCategory === "all"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    selectedCategory === category
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}

          {/* Prompt Selector */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {filteredPrompts.map((prompt) => (
              <button
                key={prompt.id}
                onClick={() => {
                  setSelectedPrompt(prompt);
                  setUserText("");
                  setWordCount(0);
                  setShowSample(false);
                }}
                className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition ${
                  selectedPrompt.id === prompt.id
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {prompt.title}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Prompt & Tips */}
          <div className="space-y-6">
            {/* Prompt Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{selectedPrompt.title}</h3>

              <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded-lg mb-4">
                <pre className="whitespace-pre-wrap text-gray-700 font-sans">
                  {selectedPrompt.prompt}
                </pre>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  <span>Min. {selectedPrompt.wordCount} words</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{selectedPrompt.timeLimit} minutes</span>
                </div>
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                Writing Tips
              </h3>
              <ul className="space-y-2">
                {selectedPrompt.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-700">
                    <span className="text-blue-600 font-bold">•</span>
                    <span className="text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sample Answer (if available) */}
            {selectedPrompt.sampleAnswer && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                {!showSample ? (
                  <button
                    onClick={() => setShowSample(true)}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition"
                  >
                    Show Sample Answer
                  </button>
                ) : (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Sample Answer</h3>
                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg p-4">
                      <pre className="whitespace-pre-wrap text-gray-700 font-sans text-sm leading-relaxed">
                        {selectedPrompt.sampleAnswer}
                      </pre>
                    </div>
                    <button
                      onClick={() => setShowSample(false)}
                      className="mt-3 text-sm text-gray-600 hover:text-gray-900"
                    >
                      Hide Sample
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Writing Area */}
          <div className="space-y-6">
            {/* Writing Status */}
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className={`w-5 h-5 ${progressColor}`} />
                  <span className={`font-semibold ${progressColor}`}>
                    {wordCount} / {selectedPrompt.wordCount} words
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-600">{selectedPrompt.timeLimit} min suggested</span>
                </div>
              </div>
            </div>

            {/* Writing Area */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Your Answer</h3>
              <textarea
                value={userText}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder="Start writing here..."
                className="w-full h-[500px] p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition resize-none font-sans text-gray-700"
              />

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => {
                    setUserText("");
                    setWordCount(0);
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Clear
                </button>
                <button
                  disabled={wordCount < selectedPrompt.wordCount}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ✓ Done
                </button>
              </div>

              {wordCount < selectedPrompt.wordCount && wordCount > 0 && (
                <p className="mt-2 text-sm text-orange-600">
                  ⚠️ You need {selectedPrompt.wordCount - wordCount} more words to meet the minimum requirement
                </p>
              )}
            </div>

            {/* Note */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong>Note:</strong> AI evaluation and detailed feedback coming soon!
                For now, compare your answer with the sample answer to self-assess.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
