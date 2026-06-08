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

interface Criterion {
  score: number;
  feedback: string;
  improvements: string[];
}

interface InlineSuggestion {
  original: string;
  suggestion: string;
  reason: string;
}

interface WritingEvaluation {
  bandScore: number;
  taskAchievement: Criterion;
  coherenceCohesion: Criterion;
  lexicalResource: Criterion;
  grammaticalRange: Criterion;
  inlineSuggestions: InlineSuggestion[];
  overallFeedback: string;
}

interface WritingPracticeInterfaceProps {
  title: string;
  description: string;
  prompts: WritingPrompt[];
  categories?: string[];
  showCategories?: boolean;
  backPath?: string;
}

export default function WritingPracticeInterface({
  title,
  description,
  prompts,
  categories = [],
  showCategories = false,
  backPath = "/english",
}: WritingPracticeInterfaceProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0] || "all");
  const [selectedPrompt, setSelectedPrompt] = useState<WritingPrompt>(prompts[0]);
  const [userText, setUserText] = useState("");
  const [showSample, setShowSample] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<WritingEvaluation | null>(null);
  const [evalError, setEvalError] = useState<string | null>(null);

  const handleTextChange = (text: string) => {
    setUserText(text);
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    setWordCount(words.length);
  };

  const handleEvaluate = async () => {
    setIsEvaluating(true);
    setEvaluation(null);
    setEvalError(null);

    try {
      const res = await fetch("/api/english/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "writing",
          prompt: selectedPrompt.prompt,
          userText,
          sampleAnswer: selectedPrompt.sampleAnswer,
          wordCount,
          targetWordCount: selectedPrompt.wordCount,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setEvalError(data.error || "Failed to evaluate");
      } else {
        setEvaluation(data.evaluation);
      }
    } catch (error) {
      setEvalError(error instanceof Error ? error.message : "Evaluation failed");
    } finally {
      setIsEvaluating(false);
    }
  };

  const getBandScoreColor = (score: number) => {
    if (score < 5) return "text-red-600";
    if (score < 6.5) return "text-orange-600";
    if (score < 8) return "text-green-600";
    return "text-blue-600";
  };

  const getBandScoreBarColor = (score: number) => {
    if (score < 5) return "bg-red-600";
    if (score < 6.5) return "bg-orange-600";
    if (score < 8) return "bg-green-600";
    return "bg-blue-600";
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
              onClick={() => router.push(backPath)}
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
                  onClick={handleEvaluate}
                  disabled={wordCount < selectedPrompt.wordCount || isEvaluating}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isEvaluating ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Evaluating...
                    </>
                  ) : (
                    <>✓ Done</>
                  )}
                </button>
              </div>

              {wordCount < selectedPrompt.wordCount && wordCount > 0 && (
                <p className="mt-2 text-sm text-[rgba(234,179,8,0.8)] dark:text-[rgba(253,224,71,0.7)]">
                  ⚠️ You need {selectedPrompt.wordCount - wordCount} more words to meet the minimum requirement
                </p>
              )}
            </div>

            {/* Evaluation Error */}
            {evalError && (
              <div className="bg-[rgba(220,38,38,0.1)] border border-[rgba(220,38,38,0.3)] dark:border-[rgba(220,38,38,0.5)] rounded-lg p-4">
                <p className="text-sm text-[#DC2626] dark:text-[#FF6B6B]">
                  <strong>Evaluation Error:</strong> {evalError}
                </p>
                <button
                  onClick={handleEvaluate}
                  disabled={wordCount < selectedPrompt.wordCount}
                  className="mt-3 text-sm text-[#DC2626] dark:text-[#FF6B6B] hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Popup for Evaluation Results */}
      {evaluation && !evalError && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-[var(--card-bg)] rounded-2xl shadow-2xl max-w-2xl w-full my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-[var(--card-border)]">
              <h3 className="text-2xl font-bold text-[var(--foreground)] flex items-center gap-2">
                <span>🎯</span> AI Evaluation Results
              </h3>
              <button
                onClick={() => setEvaluation(null)}
                className="text-[var(--foreground-secondary)] hover:text-[var(--foreground)] text-2xl transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Band Score Display */}
              <div className="bg-[var(--hover-bg)] rounded-xl p-6 text-center">
                <p className="text-[var(--foreground-secondary)] text-sm mb-2">Overall Band Score</p>
                <p className={`text-5xl font-bold ${getBandScoreColor(evaluation.bandScore)}`}>
                  {evaluation.bandScore.toFixed(1)}
                </p>
                <div className="mt-4 flex justify-between text-xs text-[var(--foreground-secondary)] mb-2">
                  <span>0</span>
                  <span>9</span>
                </div>
                <div className="w-full bg-[var(--card-bg)] rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${getBandScoreBarColor(evaluation.bandScore)}`}
                    style={{ width: `${(evaluation.bandScore / 9) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Criteria Section */}
              <div className="space-y-3">
                <h4 className="font-bold text-[var(--foreground)] text-lg">Criterion Breakdown</h4>

                {/* Task Achievement */}
                <div className="bg-[var(--hover-bg)] rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-[var(--foreground)]">Task Achievement</span>
                    <span className={`font-bold text-lg ${getBandScoreColor(evaluation.taskAchievement.score)}`}>
                      {evaluation.taskAchievement.score.toFixed(1)}
                    </span>
                  </div>
                  <div className="w-full bg-[var(--card-bg)] rounded-full h-2 mb-2">
                    <div
                      className={`h-2 rounded-full ${getBandScoreBarColor(evaluation.taskAchievement.score)}`}
                      style={{ width: `${(evaluation.taskAchievement.score / 9) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-[var(--foreground-secondary)]">
                    {evaluation.taskAchievement.feedback}
                  </p>
                </div>

                {/* Coherence & Cohesion */}
                <div className="bg-[var(--hover-bg)] rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-[var(--foreground)]">Coherence & Cohesion</span>
                    <span className={`font-bold text-lg ${getBandScoreColor(evaluation.coherenceCohesion.score)}`}>
                      {evaluation.coherenceCohesion.score.toFixed(1)}
                    </span>
                  </div>
                  <div className="w-full bg-[var(--card-bg)] rounded-full h-2 mb-2">
                    <div
                      className={`h-2 rounded-full ${getBandScoreBarColor(evaluation.coherenceCohesion.score)}`}
                      style={{ width: `${(evaluation.coherenceCohesion.score / 9) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-[var(--foreground-secondary)]">
                    {evaluation.coherenceCohesion.feedback}
                  </p>
                </div>

                {/* Lexical Resource */}
                <div className="bg-[var(--hover-bg)] rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-[var(--foreground)]">Lexical Resource</span>
                    <span className={`font-bold text-lg ${getBandScoreColor(evaluation.lexicalResource.score)}`}>
                      {evaluation.lexicalResource.score.toFixed(1)}
                    </span>
                  </div>
                  <div className="w-full bg-[var(--card-bg)] rounded-full h-2 mb-2">
                    <div
                      className={`h-2 rounded-full ${getBandScoreBarColor(evaluation.lexicalResource.score)}`}
                      style={{ width: `${(evaluation.lexicalResource.score / 9) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-[var(--foreground-secondary)]">
                    {evaluation.lexicalResource.feedback}
                  </p>
                </div>

                {/* Grammar & Range */}
                <div className="bg-[var(--hover-bg)] rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-[var(--foreground)]">Grammar & Range</span>
                    <span className={`font-bold text-lg ${getBandScoreColor(evaluation.grammaticalRange.score)}`}>
                      {evaluation.grammaticalRange.score.toFixed(1)}
                    </span>
                  </div>
                  <div className="w-full bg-[var(--card-bg)] rounded-full h-2 mb-2">
                    <div
                      className={`h-2 rounded-full ${getBandScoreBarColor(evaluation.grammaticalRange.score)}`}
                      style={{ width: `${(evaluation.grammaticalRange.score / 9) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-[var(--foreground-secondary)]">
                    {evaluation.grammaticalRange.feedback}
                  </p>
                </div>
              </div>

              {/* Inline Suggestions */}
              {evaluation.inlineSuggestions && evaluation.inlineSuggestions.length > 0 && (
                <div className="bg-[rgba(168,85,247,0.1)] dark:bg-[rgba(168,85,247,0.05)] rounded-lg p-4">
                  <h4 className="font-semibold text-[var(--foreground)] mb-3 flex items-center gap-2">
                    <span>✏️</span> Suggested Improvements
                  </h4>
                  <div className="space-y-2">
                    {evaluation.inlineSuggestions.map((suggestion, idx) => (
                      <div key={idx} className="bg-[var(--primary-bg)] rounded p-3 text-sm">
                        <p className="text-[var(--foreground-secondary)] mb-1">
                          <span className="text-red-600 dark:text-red-400 font-semibold">"{suggestion.original}"</span>{" "}
                          <span className="text-gray-400">→</span>{" "}
                          <span className="text-green-600 dark:text-green-400 font-semibold">"{suggestion.suggestion}"</span>
                        </p>
                        <p className="text-xs text-[var(--foreground-secondary)]">{suggestion.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Overall Feedback */}
              <div className="bg-[rgba(66,85,255,0.1)] dark:bg-[rgba(66,85,255,0.05)] rounded-lg p-4">
                <h4 className="font-semibold text-[var(--foreground)] mb-2 flex items-center gap-2">
                  <span>💬</span> Overall Feedback
                </h4>
                <p className="text-sm text-[var(--foreground-secondary)] leading-relaxed">
                  {evaluation.overallFeedback}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t border-[var(--card-border)]">
              <button
                onClick={() => {
                  setEvaluation(null);
                  setUserText("");
                  setWordCount(0);
                }}
                className="flex-1 bg-[var(--hover-bg)] text-[var(--foreground)] py-3 px-4 rounded-lg font-semibold hover:bg-[rgba(0,0,0,0.1)] dark:hover:bg-[rgba(255,255,255,0.1)] transition"
              >
                Try New Prompt
              </button>
              <button
                onClick={handleEvaluate}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition flex items-center justify-center gap-2"
              >
                {isEvaluating ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Evaluating...
                  </>
                ) : (
                  <>✨ Evaluate Again</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
