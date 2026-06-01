"use client";

import { AIClarificationChat } from "./ai-clarification-chat";
import ReportQuestionButton from "./ReportQuestionButton";

interface RichExplanationProps {
  explanation: string | {
    logic: string;
    formula?: string | null;
    calculation?: string | null;
    trapAlerts: string[];
    commonMistakes: string[];
  };
  correctAnswer: number;
  userAnswer: number;
  options: string[];
  questionId?: string;
  examId?: string;
  subjectId?: string;
}

export function RichExplanation({ explanation, correctAnswer, userAnswer, options, questionId, examId, subjectId }: RichExplanationProps) {
  // Handle legacy string explanations
  if (typeof explanation === 'string') {
    return (
      <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[#00A1E0] font-semibold text-sm">💡 Explanation</span>
        </div>
        <p className="text-sm text-blue-800 leading-relaxed">{explanation}</p>
      </div>
    );
  }

  // Rich explanation
  const wrongOptions = [0, 1, 2, 3].filter(i => i !== correctAnswer);

  return (
    <div className="mt-6 space-y-4">
      {/* Core Logic */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">💡</span>
          <span className="text-emerald-700 font-semibold text-sm">Core Concept</span>
        </div>
        <p className="text-sm text-emerald-900 leading-relaxed">{explanation.logic}</p>
      </div>

      {/* Formula & Calculation (if numerical) */}
      {explanation.formula && (
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">📐</span>
            <span className="text-[#0070A8] font-semibold text-sm">Formula</span>
          </div>
          <div className="bg-white px-3 py-2 rounded-lg border border-slate-200 font-mono text-sm text-[#005A7A] mb-2">
            {explanation.formula}
          </div>
          {explanation.calculation && (
            <>
              <div className="text-[#0070A8] font-semibold text-xs mb-1 mt-3">Step-by-step:</div>
              <pre className="text-xs text-[#005A7A] leading-relaxed whitespace-pre-wrap font-mono bg-white px-3 py-2 rounded-lg border border-slate-200">
                {explanation.calculation}
              </pre>
            </>
          )}
        </div>
      )}

      {/* Trap Alerts - Why wrong options are tempting */}
      <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">⚠️</span>
          <span className="text-amber-700 font-semibold text-sm">Why Other Options Are Wrong</span>
        </div>
        <div className="space-y-2">
          {wrongOptions.map((idx, i) => {
            const isUserChoice = idx === userAnswer;
            return (
              <div
                key={idx}
                className={`p-3 rounded-lg border ${
                  isUserChoice
                    ? 'bg-red-50 border-red-300'
                    : 'bg-white border-amber-200'
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isUserChoice
                      ? 'bg-red-500 text-white'
                      : 'bg-amber-200 text-amber-700'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <div className="flex-1">
                    <p className="text-xs text-slate-600 mb-1 line-clamp-1">{options[idx]}</p>
                    <p className={`text-sm leading-relaxed ${
                      isUserChoice ? 'text-red-900 font-medium' : 'text-amber-900'
                    }`}>
                      {explanation.trapAlerts[i] || "This option is incorrect based on the concept."}
                    </p>
                    {isUserChoice && (
                      <span className="inline-block mt-1 text-xs text-red-600 font-semibold">
                        ← You picked this
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Common Mistakes */}
      <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">🚫</span>
          <span className="text-purple-700 font-semibold text-sm">Common Student Mistakes</span>
        </div>
        <ul className="space-y-1.5">
          {explanation.commonMistakes.map((mistake, i) => (
            <li key={i} className="text-sm text-purple-900 leading-relaxed flex items-start gap-2">
              <span className="text-purple-400 mt-0.5">•</span>
              <span>{mistake}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Correct Answer Highlight */}
      <div className="p-3 bg-amber-100 rounded-lg border-2 border-emerald-400 flex items-center gap-3">
        <span className="shrink-0 w-8 h-8 rounded-full bg-cyan-400 text-white flex items-center justify-center text-sm font-bold">
          {String.fromCharCode(65 + correctAnswer)}
        </span>
        <div className="flex-1">
          <div className="text-xs text-slate-500 font-semibold mb-0.5">✓ Correct Answer</div>
          <div className="text-sm text-emerald-900 font-medium">{options[correctAnswer]}</div>
        </div>
      </div>

      {/* AI Clarification Chat - Only show for wrong answers */}
      {userAnswer !== correctAnswer && userAnswer !== -1 && (
        <AIClarificationChat
          questionText={typeof explanation === 'string' ? explanation : explanation.logic}
          correctAnswer={options[correctAnswer]}
          userAnswer={options[userAnswer]}
        />
      )}

      {/* Report Question Button */}
      {questionId && (
        <div className="flex justify-center pt-2">
          <ReportQuestionButton questionId={questionId} examId={examId} subjectId={subjectId} />
        </div>
      )}
    </div>
  );
}
