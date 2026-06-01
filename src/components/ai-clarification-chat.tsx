"use client";

import { useState } from "react";
import { getHeadersWithCsrf } from "@/lib/csrf-client";

interface AIClarificationChatProps {
  questionText: string;
  correctAnswer: string;
  userAnswer: string;
}

interface Message {
  type: 'user' | 'ai';
  text: string;
}

export function AIClarificationChat({
  questionText,
  correctAnswer,
  userAnswer
}: AIClarificationChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [userQuestion, setUserQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasRated, setHasRated] = useState(false);

  const handleAsk = async () => {
    if (!userQuestion.trim() || isLoading) return;

    const currentQuestion = userQuestion.trim();
    setUserQuestion("");

    // Add user message to chat
    const updatedMessages = [...messages, { type: 'user', text: currentQuestion }];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const res = await fetch('/api/clarify', {
        method: 'POST',
        headers: getHeadersWithCsrf(),
        body: JSON.stringify({
          questionText,
          userQuestion: currentQuestion,
          correctAnswer,
          wrongAnswer: userAnswer,
          conversationHistory: updatedMessages // Send full conversation history
        })
      });

      if (res.ok) {
        const data = await res.json();
        // Add AI response to chat
        setMessages(prev => [...prev, { type: 'ai', text: data.response }]);
      } else {
        setMessages(prev => [...prev, {
          type: 'ai',
          text: "Sorry, I couldn't generate a response right now. Please try again!"
        }]);
      }
    } catch (err) {
      console.error('Clarification error:', err);
      setMessages(prev => [...prev, {
        type: 'ai',
        text: "Something went wrong. Please try again!"
      }]);
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

  const handleQuickQuestion = (question: string) => {
    setUserQuestion(question);
    setTimeout(() => handleAsk(), 100);
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
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 text-purple-700 rounded-xl hover:from-purple-100 hover:to-indigo-100 transition-all font-medium text-sm"
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
    <div className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border-2 border-purple-200">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">🤖</span>
        <div>
          <div className="text-sm font-semibold text-purple-900">Ask AI Tutor</div>
          <div className="text-xs text-slate-500">Get instant clarification</div>
        </div>
      </div>

      {/* Chat History */}
      {messages.length > 0 && (
        <div className="mb-3 max-h-96 overflow-y-auto space-y-2">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg ${
                msg.type === 'user'
                  ? 'bg-purple-100 border border-purple-200 ml-8'
                  : 'bg-white border border-purple-200 mr-8'
              }`}
            >
              <div className="flex items-start gap-2">
                {msg.type === 'ai' && <span className="text-lg shrink-0">🤖</span>}
                <div className="flex-1 text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                  {msg.text}
                </div>
                {msg.type === 'user' && <span className="text-lg shrink-0">👤</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Question Buttons */}
      {messages.length === 0 && !isLoading && (
        <div className="mb-3 flex flex-wrap gap-2">
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleQuickQuestion(q)}
              className="text-xs px-3 py-1.5 bg-white text-purple-700 rounded-full border border-purple-200 hover:bg-purple-100 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center gap-2 text-purple-700 text-sm py-4">
          <div className="animate-spin h-4 w-4 border-2 border-purple-600 border-t-transparent rounded-full"></div>
          <span>Thinking...</span>
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2 mt-3">
        <input
          type="text"
          value={userQuestion}
          onChange={(e) => setUserQuestion(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
          placeholder="Type your question here..."
          className="flex-1 px-3 py-2 border border-purple-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          disabled={isLoading}
        />
        <button
          onClick={handleAsk}
          disabled={!userQuestion.trim() || isLoading}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 text-sm font-medium"
        >
          Ask
        </button>
      </div>

      {/* Feedback - Only show after last AI message */}
      {messages.length > 0 && messages[messages.length - 1].type === 'ai' && !hasRated && !isLoading && (
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-purple-200">
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
        <div className="text-xs text-slate-500 text-center mt-2">
          Thanks for your feedback! 🙏
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
