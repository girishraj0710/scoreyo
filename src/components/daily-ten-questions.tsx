"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from "lucide-react";

interface Question {
  id: number;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
  exam_id: string;
  subject_id: string;
  topic: string;
  difficulty: string;
}

interface DailyQuestionsData {
  date: string;
  questions: Question[];
  completed: boolean;
  score: number;
  attempted_at: string | null;
}

export function DailyTenQuestions() {
  const [data, setData] = useState<DailyQuestionsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>(Array(10).fill(null));
  const [revealed, setRevealed] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  // Fetch daily questions
  useEffect(() => {
    fetchDailyQuestions();
  }, []);

  const fetchDailyQuestions = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/daily-questions");
      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();
      setData(data);

      if (data.completed) {
        setCompleted(true);
        setCorrectCount(data.score);
      }
    } catch (error) {
      console.error("Error fetching daily questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (revealed || completed) return;

    const newAnswers = [...userAnswers];
    newAnswers[currentIndex] = answerIndex;
    setUserAnswers(newAnswers);

    // Immediately reveal answer
    setRevealed(true);

    // Check if correct
    if (data && answerIndex === data.questions[currentIndex].correct_answer) {
      setCorrectCount(prev => prev + 1);
    }

    // Auto-advance after 2 seconds
    setTimeout(() => {
      if (currentIndex < 9) {
        setCurrentIndex(currentIndex + 1);
        setRevealed(false);
      } else {
        // Last question - mark as completed
        setCompleted(true);
        submitAnswers(newAnswers);
      }
    }, 2000);
  };

  const submitAnswers = async (answers: (number | null)[]) => {
    try {
      await fetch("/api/daily-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
    } catch (error) {
      console.error("Error submitting answers:", error);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setUserAnswers(Array(10).fill(null));
    setRevealed(false);
    setCompleted(false);
    setCorrectCount(0);
  };

  if (loading) {
    return (
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-black/5 p-6 md:p-8 shadow-soft h-full flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#E76F51]/20 border-t-[#E76F51] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!data || data.questions.length === 0) {
    return (
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-black/5 p-6 md:p-8 shadow-soft h-full flex items-center justify-center">
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          No questions available today
        </p>
      </div>
    );
  }

  const currentQuestion = data.questions[currentIndex];
  const currentAnswer = userAnswers[currentIndex];

  // Completion card
  if (completed) {
    return (
      <div className="rounded-3xl bg-gradient-to-br from-[#E76F51]/5 via-white to-[#E76F51]/10 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 border border-black/5 p-8 md:p-12 shadow-soft relative overflow-hidden h-full flex items-center justify-center">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="15" fill="#E76F51" />
            <circle cx="80" cy="80" r="20" fill="#E76F51" />
            <circle cx="50" cy="60" r="10" fill="#F4A261" />
          </svg>
        </div>

        <div className="relative text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#E76F51] to-[#F4A261] mb-6"
          >
            <CheckCircle2 className="w-10 h-10 text-white" strokeWidth={2.5} />
          </motion.div>

          <h3 className="font-heading text-3xl md:text-4xl font-black text-[#16213E] dark:text-white mb-3">
            Let's keep going!
          </h3>

          <p className="text-slate-600 dark:text-slate-400 text-base mb-2">
            You got <span className="font-bold text-[#E76F51] text-lg">{correctCount}/10</span> correct
          </p>

          <p className="text-sm text-slate-500 dark:text-slate-500 mb-8">
            Come back tomorrow for more questions
          </p>

          <button
            onClick={() => window.location.href = '/dashboard'}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#F26A4B] to-[#E76F51] hover:from-[#E76F51] hover:to-[#D35D42] text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all"
          >
            Continue Learning
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-black/5 p-6 md:p-8 shadow-soft h-full">
      {/* Header */}
      <div className="mb-3">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#F26A4B] mb-2">
          <Sparkles className="w-3.5 h-3.5" /> Questions of the day
        </div>
        <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          {currentIndex + 1} / 10
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <h3 className="font-heading text-xl md:text-2xl font-bold leading-snug text-[#16213E] dark:text-white mb-5">
            {currentQuestion.question}
          </h3>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, optionIndex) => {
              const isSelected = currentAnswer === optionIndex;
              const isCorrectAnswer = optionIndex === currentQuestion.correct_answer;
              const showCorrect = revealed && isCorrectAnswer;
              const showWrong = revealed && isSelected && !isCorrectAnswer;

              let styles = "border-black/5 hover:border-[#16213E]/20 bg-[#FAF8F5] dark:bg-slate-800";
              if (showCorrect) styles = "border-[#2E8B57] bg-[#2E8B57]/10";
              else if (showWrong) styles = "border-red-300 bg-red-50 dark:bg-red-900/20";
              else if (isSelected && !revealed) styles = "border-[#F26A4B] bg-[#F26A4B]/5";

              return (
                <button
                  key={optionIndex}
                  disabled={revealed}
                  onClick={() => handleAnswerSelect(optionIndex)}
                  className={`w-full text-left px-4 py-4 rounded-xl border-2 transition-all flex items-center gap-3 ${styles} ${
                    revealed ? "cursor-not-allowed" : "hover:scale-[1.01]"
                  }`}
                >
                  <div className="text-sm md:text-base font-medium text-[#16213E] dark:text-white flex-1">
                    {option}
                  </div>
                  {showCorrect && <CheckCircle2 className="w-5 h-5 text-[#2E8B57]" />}
                  {showWrong && <XCircle className="w-5 h-5 text-red-500" />}
                </button>
              );
            })}
          </div>

          {/* Explanation (show after selection) */}
          {revealed && currentQuestion.explanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-5 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
            >
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  i
                </div>
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  {currentQuestion.explanation}
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
