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
    <div className="min-h-screen bg-[var(--primary-bg)] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-[var(--card-bg)] rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-[var(--foreground)]">{title}</h1>
              <p className="text-[var(--foreground-secondary)] mt-1">{description}</p>
            </div>
            <button
              onClick={() => router.back()}
              className="text-[var(--foreground-secondary)] hover:text-[var(--foreground)] font-medium transition"
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
                    : "bg-[var(--hover-bg)] text-[var(--foreground-secondary)] hover:bg-[rgba(0,0,0,0.1)] dark:hover:bg-[rgba(255,255,255,0.1)]"
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
                      : "bg-[var(--hover-bg)] text-[var(--foreground-secondary)] hover:bg-[rgba(0,0,0,0.1)] dark:hover:bg-[rgba(255,255,255,0.1)]"
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
                    : "bg-[var(--hover-bg)] text-[var(--foreground-secondary)] hover:bg-[rgba(0,0,0,0.1)] dark:hover:bg-[rgba(255,255,255,0.1)]"
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
            <div className="bg-[var(--card-bg)] rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-[var(--foreground)] mb-4">{selectedPrompt.title}</h3>

              <div className="bg-[var(--hover-bg)] border-l-4 border-purple-600 p-4 rounded-lg mb-4">
                <pre className="whitespace-pre-wrap text-[var(--foreground-secondary)] font-sans">
                  {selectedPrompt.prompt}
                </pre>
              </div>

              <div className="flex items-center gap-4 text-sm text-[var(--foreground-secondary)]">
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
            <div className="bg-[var(--card-bg)] rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-[var(--foreground)] mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#4255FF]" />
                Writing Tips
              </h3>
              <ul className="space-y-2">
                {selectedPrompt.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-[var(--foreground-secondary)]">
                    <span className="text-[#4255FF] font-bold">•</span>
                    <span className="text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sample Answer (if available) */}
            {selectedPrompt.sampleAnswer && (
              <div className="bg-[var(--card-bg)] rounded-2xl shadow-lg p-6">
                {!showSample ? (
                  <button
                    onClick={() => setShowSample(true)}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition"
                  >
                    Show Sample Answer
                  </button>
                ) : (
                  <div>
                    <h3 className="font-semibold text-[var(--foreground)] mb-3">Sample Answer</h3>
                    <div className="bg-[var(--hover-bg)] border-2 border-[var(--card-border)] rounded-lg p-4">
                      <pre className="whitespace-pre-wrap text-[var(--foreground-secondary)] font-sans text-sm leading-relaxed">
                        {selectedPrompt.sampleAnswer}
                      </pre>
                    </div>
                    <button
                      onClick={() => setShowSample(false)}
                      className="mt-3 text-sm text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition"
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
            <div className="bg-[var(--card-bg)] rounded-2xl shadow-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className={`w-5 h-5 ${progressColor}`} />
                  <span className={`font-semibold ${progressColor}`}>
                    {wordCount} / {selectedPrompt.wordCount} words
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[var(--foreground-secondary)]" />
                  <span className="text-[var(--foreground-secondary)]">{selectedPrompt.timeLimit} min suggested</span>
                </div>
              </div>
            </div>

            {/* Writing Area */}
            <div className="bg-[var(--card-bg)] rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-[var(--foreground)] mb-3">Your Answer</h3>
              <textarea
                value={userText}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder="Start writing here..."
                className="w-full h-[500px] p-4 border-2 border-[var(--card-border)] rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition resize-none font-sans text-[var(--foreground)] bg-[var(--primary-bg)]"
              />

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => {
                    setUserText("");
                    setWordCount(0);
                  }}
                  className="flex-1 bg-[var(--hover-bg)] text-[var(--foreground-secondary)] py-3 px-6 rounded-lg font-semibold hover:bg-[rgba(0,0,0,0.1)] dark:hover:bg-[rgba(255,255,255,0.1)] transition"
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
                <p className="mt-2 text-sm text-[rgba(234,179,8,0.8)] dark:text-[rgba(253,224,71,0.7)]">
                  ⚠️ You need {selectedPrompt.wordCount - wordCount} more words to meet the minimum requirement
                </p>
              )}
            </div>

            {/* Note */}
            <div className="bg-[rgba(253,224,71,0.15)] border border-[rgba(234,179,8,0.3)] dark:border-[rgba(253,224,71,0.3)] rounded-lg p-4">
              <p className="text-sm text-[var(--foreground-secondary)]">
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
