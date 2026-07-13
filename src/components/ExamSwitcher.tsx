"use client";

import { useUser } from "@/context/user-context";
import { EXAMS } from "@/lib/exams";
import { ChevronDown, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function ExamSwitcher() {
  const { user, canSwitchExams, switchExam } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Don't show if user can't switch exams (admin, or only 1 exam)
  if (!canSwitchExams || !user?.enrolled_exams || user.enrolled_exams.length <= 1) {
    return null;
  }

  const currentExam = user.current_exam || user.enrolled_exams[0];
  const currentExamData = EXAMS.find((e) => e.id === currentExam);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleSwitch = async (examId: string) => {
    if (examId === currentExam) {
      setIsOpen(false);
      return;
    }

    await switchExam(examId);
    setIsOpen(false);

    // Reload page to refresh all data
    window.location.reload();
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Current Exam Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors border border-slate-700/50"
      >
        <span className="text-sm font-medium text-white">
          {currentExamData?.name || currentExam.toUpperCase()}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-50">
          <div className="p-2 border-b border-slate-700">
            <p className="text-xs text-slate-400 font-medium">SWITCH EXAM</p>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {user.enrolled_exams.map((examId) => {
              const exam = EXAMS.find((e) => e.id === examId);
              const isCurrent = examId === currentExam;

              return (
                <button
                  key={examId}
                  onClick={() => handleSwitch(examId)}
                  className={`w-full px-3 py-2 flex items-center justify-between hover:bg-slate-700/50 transition-colors ${
                    isCurrent ? "bg-slate-700/30" : ""
                  }`}
                >
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium text-white">
                      {exam?.name || examId.toUpperCase()}
                    </span>
                    {exam?.subjects && (
                      <span className="text-xs text-slate-400">
                        {exam.subjects.length} subjects
                      </span>
                    )}
                  </div>

                  {isCurrent && (
                    <Check className="w-4 h-4 text-green-400" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="p-2 border-t border-slate-700">
            <a
              href="/settings"
              className="block w-full text-center py-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              + Add More Exams
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
