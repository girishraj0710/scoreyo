"use client";

import { useState } from "react";
import { getHeadersWithCsrf } from "@/lib/csrf-client";

interface AIClarificationChatProps {
  questionText: string;
  correctAnswer: string;
  userAnswer: string;
}

export function AIClarificationChat({
  questionText,
  correctAnswer,
  userAnswer
}: AIClarificationChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [userQuestion, setUserQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasRated, setHasRated] = useState(false);

  const handleAsk = async () => {
    if (!userQuestion.trim() || isLoading) return;

    setIsLoading(true);
    setAiResponse(null);

    try {
      const res = await fetch('/api/clarify', {
        method: 'POST',
        headers: getHeadersWithCsrf(),
        body: JSON.stringify({
          questionText,
          userQuestion: userQuestion.trim(),
          correctAnswer,
          wrongAnswer: userAnswer
        })
      });

      if (res.ok) {
        const data = await res.json();
        setAiResponse(data.response);
      } else {
        setAiResponse("Sorry, I couldn't generate a response right now. Please try again!");
      }
    } catch (err) {
      console.error('Clarification error:', err);
      setAiResponse("Something went wrong. Please try again!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRate = async (helpful: boolean) => {
    setHasRated(true);
    try {
      await fetch('/api/clarify', {
        method: 'PATCH',
        headers: getHeadersWithCsrf(),
        body: JSON.stringify({
          questionText,
          helpful
        })
      });
    } catch (err) {
      console.error('Rating error:', err);
    }
  };

  const quickQuestions = [
    "Why is my answer wrong?",
    "Can you explain this concept simply?",
    "What's the trick to solving this?",
    "Give me an example",
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 text-purple-700 rounded-xl hover:from-purple-100 hover:to-indigo-100 transition-all font-medium text-sm"
      >
        <span className="text-lg">🤖</span>
        <span>Still confused? Ask AI for help</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </button>
    );
  }

  return (
    <div className="mt-4 p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border-2 border-purple-200">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">🤖</span>
        <div>
          <div className="text-sm font-semibold text-purple-900">Ask AI Tutor</div>
          <div className="text-xs text-slate-500">Get instant clarification</div>
        </div>
      </div>

      {/* Quick Question Buttons */}
      {!aiResponse && !isLoading && (
        <div className="mb-3 flex flex-wrap gap-2">
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => {
                setUserQuestion(q);
                setTimeout(() => handleAsk(), 100);
              }}
              className="text-xs px-3 py-1.5 bg-white text-purple-700 rounded-full border border-purple-200 hover:bg-slate-100 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      {!aiResponse && !isLoading && (
        <div className="flex gap-2">
          <input
            type="text"
            value={userQuestion}
            onChange={(e) => setUserQuestion(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
            placeholder="Type your question here..."
            className="flex-1 px-3 py-2 border border-purple-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleAsk}
            disabled={!userQuestion.trim() || isLoading}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 text-sm font-medium"
          >
            Ask
          </button>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center gap-2 text-purple-700 text-sm py-4">
          <div className="animate-spin h-4 w-4 border-2 border-purple-600 border-t-transparent rounded-full"></div>
          <span>Thinking...</span>
        </div>
      )}

      {/* AI Response */}
      {aiResponse && (
        <div className="space-y-3">
          <div className="bg-white rounded-lg p-4 border border-purple-200">
            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
              {aiResponse}
            </div>
          </div>

          {/* Feedback */}
          {!hasRated && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Was this helpful?</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleRate(true)}
                  className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
                >
                  👍 Yes
                </button>
                <button
                  onClick={() => handleRate(false)}
                  className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors"
                >
                  👎 No
                </button>
              </div>
            </div>
          )}

          {hasRated && (
            <div className="text-xs text-slate-500 text-center">
              Thanks for your feedback! 🙏
            </div>
          )}

          {/* Ask Another */}
          <button
            onClick={() => {
              setAiResponse(null);
              setUserQuestion("");
              setHasRated(false);
            }}
            className="w-full px-3 py-2 text-xs bg-slate-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors font-medium"
          >
            Ask another question
          </button>
        </div>
      )}

      {/* Close */}
      <button
        onClick={() => setIsOpen(false)}
        className="mt-3 w-full text-xs text-slate-500 hover:text-purple-800"
      >
        Close
      </button>
    </div>
  );
}
