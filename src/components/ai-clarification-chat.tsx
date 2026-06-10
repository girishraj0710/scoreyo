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
    const updatedMessages: Message[] = [...messages, { type: 'user', text: currentQuestion }];
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
        className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-xl transition-all font-medium text-sm"
        style={{ background: "var(--primary-bg)", borderColor: "rgba(66, 85, 255, 0.3)", color: "#4255FF" }}
      >
        <span>Still confused? Ask Krakkify AI for help</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </button>
    );
  }

  return (
    <div className="p-4 rounded-xl border-2" style={{ background: "var(--primary-bg)", borderColor: "rgba(66, 85, 255, 0.3)" }}>
      <div className="flex items-center gap-2 mb-3">
        <div>
          <div className="text-sm font-semibold" style={{ color: "white" }}>Krakkify AI</div>
          <div className="text-xs" style={{ color: "rgba(255, 255, 255, 0.7)" }}>Get instant clarification</div>
        </div>
      </div>

      {/* Chat History */}
      {messages.length > 0 && (
        <div className="mb-3 max-h-96 overflow-y-auto space-y-2">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg border ${
                msg.type === 'user'
                  ? 'ml-8'
                  : 'mr-8'
              }`}
              style={{ background: msg.type === 'user' ? "var(--card-bg)" : "var(--card-bg)", borderColor: "rgba(66, 85, 255, 0.2)" }}
            >
              <div className="text-xs font-semibold mb-1" style={{ color: msg.type === 'ai' ? '#4255FF' : 'var(--foreground)' }}>
                {msg.type === 'ai' ? 'Krakkify AI:' : 'You:'}
              </div>
              <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "var(--foreground)" }}>
                {msg.text}
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
              className="text-xs px-3 py-1.5 rounded-full border transition-colors"
              style={{ background: "rgba(255, 255, 255, 0.15)", borderColor: "rgba(255, 255, 255, 0.3)", color: "white" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
              }}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center gap-2 text-sm py-4" style={{ color: "white" }}>
          <div className="animate-spin h-4 w-4 border-2 border-t-transparent rounded-full" style={{ borderColor: "rgba(255, 255, 255, 0.3)", borderTopColor: "white" }}></div>
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
          className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors"
          style={{ background: "var(--card-bg)", color: "var(--foreground)", borderColor: "rgba(66, 85, 255, 0.2)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(66, 85, 255, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(66, 85, 255, 0.2)";
          }}
          disabled={isLoading}
        />
        <button
          onClick={handleAsk}
          disabled={!userQuestion.trim() || isLoading}
          className="px-4 py-2 text-white rounded-lg disabled:opacity-50 text-sm font-medium transition-all"
          style={{ backgroundColor: "#4255FF" }}
          onMouseEnter={(e) => {
            if (!e.currentTarget.disabled) {
              e.currentTarget.style.backgroundColor = "#3242CC";
              e.currentTarget.style.transform = "scale(1.02)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#4255FF";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          Ask
        </button>
      </div>

      {/* Feedback - Only show after last AI message */}
      {messages.length > 0 && messages[messages.length - 1].type === 'ai' && !hasRated && !isLoading && (
        <div className="flex items-center justify-between mt-3 pt-3 border-t" style={{ borderColor: "rgba(66, 85, 255, 0.2)" }}>
          <span className="text-xs" style={{ color: "var(--muted)" }}>Was this helpful?</span>
          <div className="flex gap-2">
            <button
              onClick={() => handleRate(true)}
              className="px-3 py-1 text-xs rounded-full transition-colors"
              style={{ backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#10b981" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(16, 185, 129, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(16, 185, 129, 0.1)";
              }}
            >
              Yes
            </button>
            <button
              onClick={() => handleRate(false)}
              className="px-3 py-1 text-xs rounded-full transition-colors"
              style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", color: "#ef4444" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
              }}
            >
              No
            </button>
          </div>
        </div>
      )}

      {hasRated && (
        <div className="text-xs text-center mt-2" style={{ color: "var(--muted)" }}>
          Thanks for your feedback!
        </div>
      )}

      {/* Close */}
      <button
        onClick={() => setIsOpen(false)}
        className="mt-3 w-full text-xs"
        style={{ color: "rgba(255, 255, 255, 0.7)" }}
      >
        Close
      </button>
    </div>
  );
}
