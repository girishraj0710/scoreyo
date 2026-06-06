// Modern Quiz Card Component - Beautiful Design
// TODO: Replace the old quiz card in page.tsx with this

import { motion } from "framer-motion";
import { Flag } from "lucide-react";

interface QuizCardProps {
  question: {
    question: string;
    options: string[];
    correctAnswer: number;
    difficulty: string;
    source?: string;
  };
  currentQuestion: number;
  totalQuestions: number;
  selectedAnswer: number | null;
  showExplanation: boolean;
  onSelectAnswer: (idx: number) => void;
  onReport: () => void;
}

export function ModernQuizCard({
  question,
  currentQuestion,
  totalQuestions,
  selectedAnswer,
  showExplanation,
  onSelectAnswer,
  onReport
}: QuizCardProps) {

  const difficultyColors = {
    easy: "from-emerald-500 to-green-500",
    medium: "from-amber-500 to-orange-500",
    hard: "from-red-500 to-pink-500"
  };

  const difficultyBg = {
    easy: "bg-emerald-50",
    medium: "bg-amber-50",
    hard: "bg-red-50"
  };

  const diff = (question.difficulty || "medium") as keyof typeof difficultyColors;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-3xl shadow-2xl border overflow-hidden"
      style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
    >
      {/* Header Strip */}
      <div className={`h-2 bg-gradient-to-r ${difficultyColors[diff]}`} />

      <div className="p-8 md:p-10">
        {/* Meta Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {/* Question Number Badge */}
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#E8EAFF] text-[#3242CC] text-sm font-semibold">
              Question {currentQuestion + 1}/{totalQuestions}
            </span>

            {/* Difficulty Badge */}
            <span className={`inline-flex items-center px-3 py-1 rounded-full ${difficultyBg[diff]} text-xs font-medium`}>
              <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${difficultyColors[diff]} mr-2`} />
              {diff.charAt(0).toUpperCase() + diff.slice(1)}
            </span>

            {/* Source Badge */}
            {question.source === "verified" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Verified
              </span>
            )}
          </div>

          {/* Report Button */}
          <button
            onClick={onReport}
            className="p-2 rounded-lg transition-colors"
            style={{ color: "var(--muted)" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#fee2e2"; e.currentTarget.style.color = "#dc2626"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--muted)"; }}
            title="Report issue"
          >
            <Flag className="w-4 h-4" />
          </button>
        </div>

        {/* Question Text - IMPROVED TYPOGRAPHY */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 leading-relaxed tracking-tight">
            {question.question}
          </h2>
        </div>

        {/* Options - BEAUTIFUL CARDS */}
        <div className="space-y-4">
          {question.options.map((option, idx) => {
            const isSelected = selectedAnswer === idx;
            const isCorrect = idx === question.correctAnswer;
            const isWrong = showExplanation && isSelected && !isCorrect;

            return (
              <motion.button
                key={idx}
                onClick={() => !showExplanation && onSelectAnswer(idx)}
                disabled={showExplanation}
                whileHover={!showExplanation ? { scale: 1.02, y: -2 } : {}}
                whileTap={!showExplanation ? { scale: 0.98 } : {}}
                className={`
                  w-full flex items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all
                  ${
                    showExplanation && isCorrect
                      ? "border-green-400 shadow-lg shadow-green-100"
                      : isWrong
                      ? "border-red-400 shadow-lg shadow-red-100"
                      : isSelected
                      ? "border-[#4255FF] shadow-lg shadow-indigo-100"
                      : "shadow-sm"
                  }
                  ${showExplanation ? "cursor-default" : "cursor-pointer"}
                `}
                style={{
                  borderColor: showExplanation && isCorrect
                    ? "#22c55e"
                    : isWrong
                    ? "#ef4444"
                    : isSelected
                    ? "#4255FF"
                    : "var(--card-border)",
                  background: showExplanation && isCorrect
                    ? "rgb(220, 252, 231)"
                    : isWrong
                    ? "rgb(254, 226, 226)"
                    : isSelected
                    ? "#E8EAFF"
                    : "var(--card-bg)",
                  color: showExplanation && isCorrect
                    ? "#166534"
                    : isWrong
                    ? "#7f1d1d"
                    : isSelected
                    ? "#1e3a8a"
                    : "#1f2937"
                }}
              >
                {/* Option Letter Circle */}
                <span
                  className={`
                    shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-base font-bold transition-all
                    ${
                      showExplanation && isCorrect
                        ? "bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-md"
                        : isWrong
                        ? "bg-gradient-to-br from-red-500 to-pink-500 text-white shadow-md"
                        : isSelected
                        ? "bg-gradient-to-br from-[#4255FF] to-purple-500 text-white shadow-md"
                        : "border"
                    }
                  `}
                  style={!(showExplanation && isCorrect) && !isWrong && !isSelected ? {
                    background: "var(--primary-bg)",
                    color: "var(--foreground-secondary)",
                    borderColor: "var(--card-border)"
                  } : {}}
                >
                  {String.fromCharCode(65 + idx)}
                </span>

                {/* Option Text - BETTER TYPOGRAPHY */}
                <span className="flex-1 text-lg leading-relaxed pt-1.5" style={{ color: "inherit" }}>
                  {option}
                </span>

                {/* Status Icon */}
                {showExplanation && (
                  <span className="shrink-0 mt-1">
                    {isCorrect ? (
                      <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : isWrong ? (
                      <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    ) : null}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
