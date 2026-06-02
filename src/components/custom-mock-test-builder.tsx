"use client";

import { useState, useEffect } from "react";
import { getExamById, examCategories } from "@/lib/exams";
import { X, Plus, Minus, Clock, FileText, Sparkles } from "lucide-react";
import { ColorfulExamIcon } from "@/lib/colorful-exam-icons";

interface CustomSection {
  subjectId: string;
  subjectName: string;
  questionCount: number;
  selectedTopics: string[];
}

interface CustomMockTestBuilderProps {
  onClose: () => void;
  onCreateTest: (config: {
    examId: string;
    examName: string;
    sections: CustomSection[];
    timeLimitMinutes: number;
    totalQuestions: number;
  }) => void;
}

export function CustomMockTestBuilder({ onClose, onCreateTest }: CustomMockTestBuilderProps) {
  const [step, setStep] = useState(1); // 1: Select Exam, 2: Configure Sections
  const [selectedExamId, setSelectedExamId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sections, setSections] = useState<CustomSection[]>([]);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(60);

  // Get all available exams
  const allExams = examCategories.flatMap(cat => cat.exams);
  const filteredExams = allExams.filter(exam =>
    exam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exam.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Load exam subjects when exam is selected
  useEffect(() => {
    if (selectedExamId) {
      const exam = getExamById(selectedExamId);
      if (exam) {
        setSections(
          exam.subjects.map(subject => ({
            subjectId: subject.id,
            subjectName: subject.name,
            questionCount: 10,
            selectedTopics: [], // Empty means all topics
          }))
        );
        // Auto-calculate time: 1.5 minutes per question (rounded to nearest 5)
        const totalQuestions = exam.subjects.length * 10;
        setTimeLimitMinutes(Math.round((totalQuestions * 1.5) / 5) * 5);
      }
    }
  }, [selectedExamId]);

  const handleExamSelect = (examId: string) => {
    setSelectedExamId(examId);
    setStep(2);
  };

  const handleQuestionCountChange = (subjectId: string, delta: number) => {
    setSections(prev =>
      prev.map(section =>
        section.subjectId === subjectId
          ? { ...section, questionCount: Math.max(1, Math.min(50, section.questionCount + delta)) }
          : section
      )
    );
  };

  const handleTopicToggle = (subjectId: string, topic: string) => {
    setSections(prev =>
      prev.map(section => {
        if (section.subjectId === subjectId) {
          const isSelected = section.selectedTopics.includes(topic);
          return {
            ...section,
            selectedTopics: isSelected
              ? section.selectedTopics.filter(t => t !== topic)
              : [...section.selectedTopics, topic],
          };
        }
        return section;
      })
    );
  };

  const handleRemoveSection = (subjectId: string) => {
    setSections(prev => prev.filter(s => s.subjectId !== subjectId));
  };

  const totalQuestions = sections.reduce((sum, s) => sum + s.questionCount, 0);
  const exam = selectedExamId ? getExamById(selectedExamId) : null;

  const handleCreate = () => {
    if (!exam || sections.length === 0) return;

    onCreateTest({
      examId: selectedExamId,
      examName: exam.name,
      sections,
      timeLimitMinutes,
      totalQuestions,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#4255FF] to-purple-600 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6" />
            <div>
              <h2 className="text-2xl font-bold">Custom Mock Test Builder</h2>
              <p className="text-indigo-100 text-sm">Create your personalized mock test</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 ? (
            // Step 1: Select Exam
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Search Exam
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredExams.map(exam => (
                  <button
                    key={exam.id}
                    onClick={() => handleExamSelect(exam.id)}
                    className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-[#4255FF] dark:hover:border-indigo-400 hover:shadow-lg transition-all text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 flex-shrink-0">
                        <ColorfulExamIcon examId={exam.id} size={48} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 dark:text-white group-hover:text-[#4255FF] dark:group-hover:text-indigo-400 truncate">
                          {exam.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate" title={exam.description}>
                          {exam.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {filteredExams.length === 0 && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No exams found matching "{searchQuery}"</p>
                </div>
              )}
            </div>
          ) : (
            // Step 2: Configure Sections
            <div className="space-y-6">
              {/* Exam Info */}
              {exam && (
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 p-4 rounded-xl border border-[#90CAF9] dark:border-gray-600">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-12 h-12 flex-shrink-0">
                        <ColorfulExamIcon examId={exam.id} size={48} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-gray-900 dark:text-white truncate">{exam.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300 truncate" title={exam.fullName}>{exam.fullName}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setStep(1)}
                      className="text-sm text-[#4255FF] dark:text-indigo-400 hover:underline whitespace-nowrap flex-shrink-0"
                    >
                      Change Exam
                    </button>
                  </div>
                </div>
              )}

              {/* Time Limit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Time Limit (minutes)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="15"
                    max="180"
                    step="5"
                    value={timeLimitMinutes}
                    onChange={(e) => setTimeLimitMinutes(Number(e.target.value))}
                    className="flex-1"
                  />
                  <div className="w-20 text-right font-semibold text-gray-900 dark:text-white">
                    {timeLimitMinutes} min
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Recommended: {Math.round(totalQuestions * 1.5)} minutes for {totalQuestions} questions
                </p>
              </div>

              {/* Sections */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Configure Sections
                </h3>
                <div className="space-y-4">
                  {sections.map(section => {
                    const subject = exam?.subjects.find(s => s.id === section.subjectId);
                    return (
                      <div
                        key={section.subjectId}
                        className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{subject?.icon}</span>
                            <div>
                              <div className="font-semibold text-gray-900 dark:text-white">
                                {section.subjectName}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {subject?.topics.length || 0} topics available
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleQuestionCountChange(section.subjectId, -1)}
                              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-12 text-center font-semibold">
                              {section.questionCount}
                            </span>
                            <button
                              onClick={() => handleQuestionCountChange(section.subjectId, 1)}
                              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            {sections.length > 1 && (
                              <button
                                onClick={() => handleRemoveSection(section.subjectId)}
                                className="p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Topic Selection */}
                        {subject && (
                          <details className="text-sm">
                            <summary className="cursor-pointer text-[#4255FF] dark:text-indigo-400 hover:underline">
                              Select specific topics (optional)
                            </summary>
                            <div className="mt-2 grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                              {subject.topics.map(topic => (
                                <label
                                  key={topic}
                                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    checked={section.selectedTopics.includes(topic)}
                                    onChange={() => handleTopicToggle(section.subjectId, topic)}
                                    className="rounded"
                                  />
                                  <span className="text-xs">{topic}</span>
                                </label>
                              ))}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {section.selectedTopics.length === 0
                                ? "All topics will be included"
                                : `${section.selectedTopics.length} topics selected`}
                            </p>
                          </details>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Test Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Total Questions:</span>
                    <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                      {totalQuestions}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Time Limit:</span>
                    <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                      {timeLimitMinutes} minutes
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Sections:</span>
                    <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                      {sections.length}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Avg per Q:</span>
                    <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                      {Math.round((timeLimitMinutes * 60) / totalQuestions)}s
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <div className="flex items-center gap-3">
              {step === 2 && (
                <>
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-2 text-[#4255FF] dark:text-indigo-400 hover:bg-[#E8EAFF] dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleCreate}
                    disabled={sections.length === 0 || totalQuestions === 0}
                    className="px-8 py-3 bg-gradient-to-r from-[#4255FF] to-purple-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all shadow-lg"
                  >
                    Create Test ({totalQuestions} Questions)
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
