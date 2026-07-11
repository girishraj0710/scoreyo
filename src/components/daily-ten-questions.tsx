"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Trophy,
  Calendar,
  ChevronRight,
  ChevronLeft,
  Clock,
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
  const [showResults, setShowResults] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState<any>(null);

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
      setShowResults(data.completed);
    } catch (error) {
      console.error("Error fetching daily questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResults) return; // Can't change after submission

    const newAnswers = [...userAnswers];
    newAnswers[currentIndex] = answerIndex;
    setUserAnswers(newAnswers);
  };

  const goToNext = () => {
    if (currentIndex < 9) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    // Check if all questions are answered
    if (userAnswers.some(a => a === null)) {
      alert("Please answer all 10 questions before submitting.");
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch("/api/daily-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: userAnswers }),
      });

      if (!response.ok) throw new Error("Failed to submit");

      const result = await response.json();
      setResults(result);
      setShowResults(true);

      // Update data
      if (data) {
        setData({
          ...data,
          completed: true,
          score: result.score,
          attempted_at: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Error submitting answers:", error);
      alert("Failed to submit answers. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-black/5 p-6 md:p-8 shadow-soft">
        <div className="flex items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-[#E76F51]/20 border-t-[#E76F51] rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!data || data.questions.length === 0) {
    return (
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-black/5 p-6 md:p-8 shadow-soft">
        <div className="text-center py-8">
          <p className="text-slate-500 dark:text-slate-400">
            No daily questions available yet.
          </p>
        </div>
      </div>
    );
  }

  const currentQuestion = data.questions[currentIndex];
  const currentAnswer = userAnswers[currentIndex];
  const answeredCount = userAnswers.filter(a => a !== null).length;
  const progress = (answeredCount / 10) * 100;

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-black/5 p-6 md:p-8 shadow-soft">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#F26A4B]">
          <Sparkles className="w-3.5 h-3.5" /> Daily 10 Questions
        </div>
        <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(data.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
          </div>
          {data.completed && (
            <div className="flex items-center gap-1 text-[#2E8B57] font-semibold">
              <Trophy className="w-4 h-4" />
              <span>{data.score}/10</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Question {currentIndex + 1} of 10
          </span>
          <span className="text-slate-500 dark:text-slate-400">
            {answeredCount}/10 answered
          </span>
        </div>
        <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#E76F51] to-[#F4A79D]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question navigation dots */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {data.questions.map((_, index) => {
          const isAnswered = userAnswers[index] !== null;
          const isCurrent = index === currentIndex;
          const isCorrect = showResults && results?.results[index]?.isCorrect;
          const isWrong = showResults && results?.results[index] && !results.results[index].isCorrect;

          return (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-8 h-8 rounded-full font-semibold text-xs transition-all ${
                isCurrent
                  ? "bg-[#E76F51] text-white scale-110 shadow-lg"
                  : isCorrect
                  ? "bg-[#2E8B57] text-white"
                  : isWrong
                  ? "bg-red-500 text-white"
                  : isAnswered
                  ? "bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500"
              }`}
            >
              {index + 1}
            </button>
          );
        })}
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
          {/* Topic badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#E76F51]/10 text-[#E76F51]">
              {currentQuestion.topic}
            </span>
            {currentQuestion.difficulty && (
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                currentQuestion.difficulty === 'easy'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                  : currentQuestion.difficulty === 'medium'
                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
              }`}>
                {currentQuestion.difficulty}
              </span>
            )}
          </div>

          {/* Question text */}
          <h3 className="font-heading text-lg md:text-xl font-bold leading-snug text-[#16213E] dark:text-white mb-5">
            {currentQuestion.question}
          </h3>

          {/* Options */}
          <div className="space-y-2 mb-6">
            {currentQuestion.options.map((option, optionIndex) => {
              const isSelected = currentAnswer === optionIndex;
              const isCorrectAnswer = optionIndex === currentQuestion.correct_answer;
              const showCorrect = showResults && isCorrectAnswer;
              const showWrong = showResults && isSelected && !isCorrectAnswer;

              let styles = "border-black/5 hover:border-[#16213E]/20 bg-[#FAF8F5] dark:bg-slate-800";
              if (showCorrect) styles = "border-[#2E8B57] bg-[#2E8B57]/10";
              else if (showWrong) styles = "border-red-300 bg-red-50 dark:bg-red-900/20";
              else if (isSelected) styles = "border-[#F26A4B] bg-[#F26A4B]/5";

              return (
                <button
                  key={optionIndex}
                  disabled={showResults}
                  onClick={() => handleAnswerSelect(optionIndex)}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all flex items-center gap-3 ${styles} ${
                    showResults ? "cursor-not-allowed" : "hover:scale-[1.01]"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg grid place-items-center font-mono font-bold text-sm ${
                      isSelected
                        ? "bg-[#F26A4B] text-white"
                        : "bg-white dark:bg-slate-700 text-[#5A6478] dark:text-slate-300 border border-black/5"
                    }`}
                  >
                    {String.fromCharCode(65 + optionIndex)}
                  </div>
                  <div className="text-sm font-medium text-[#16213E] dark:text-white flex-1">
                    {option}
                  </div>
                  {showCorrect && <CheckCircle2 className="w-5 h-5 text-[#2E8B57]" />}
                  {showWrong && <XCircle className="w-5 h-5 text-red-500" />}
                </button>
              );
            })}
          </div>

          {/* Explanation (show after submission) */}
          {showResults && currentQuestion.explanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
            >
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  i
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-1">
                    Explanation
                  </p>
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    {currentQuestion.explanation}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={goToPrev}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold text-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        {!showResults && answeredCount === 10 && (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#F26A4B] to-[#E76F51] hover:from-[#E76F51] hover:to-[#D35D42] text-white font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center gap-2"
          >
            {submitting ? "Submitting..." : "Submit Answers"}
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

        {showResults && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2E8B57]/10 text-[#2E8B57] font-semibold text-sm">
            <Trophy className="w-4 h-4" />
            Score: {data.score}/10
          </div>
        )}

        <button
          onClick={goToNext}
          disabled={currentIndex === 9}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E76F51] hover:bg-[#D65A3D] text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold text-sm"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
