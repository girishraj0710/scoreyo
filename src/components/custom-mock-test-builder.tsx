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
      <div className="rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col" style={{ background: "var(--card-bg)" }}>
        {/* Header */}
        <div className="bg-gradient-to-r from-[#E76F51] to-[#D65A3D] text-white p-6 flex items-center justify-between">
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
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>
                  Search Exam
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name..."
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-colors"
                  style={{ borderColor: "var(--card-border)", background: "var(--card-bg)", color: "var(--foreground)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#E76F51";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--card-border)";
                  }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredExams.map(exam => (
                  <button
                    key={exam.id}
                    onClick={() => handleExamSelect(exam.id)}
                    className="p-4 border-2 rounded-xl transition-all text-left group"
                    style={{ borderColor: "var(--card-border)" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#E76F51";
                      e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--card-border)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 flex-shrink-0">
                        <ColorfulExamIcon examId={exam.id} size={48} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate" style={{ color: "var(--foreground)" }}>
                          {exam.name}
                        </div>
                        <div className="text-sm truncate" style={{ color: "var(--muted)" }} title={exam.description}>
                          {exam.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {filteredExams.length === 0 && (
                <div className="text-center py-12" style={{ color: "var(--muted)" }}>
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
                <div className="p-4 rounded-xl border" style={{ background: "var(--primary-bg)", borderColor: "rgba(66, 85, 255, 0.3)" }}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-12 h-12 flex-shrink-0">
                        <ColorfulExamIcon examId={exam.id} size={48} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold truncate" style={{ color: "var(--foreground)" }}>{exam.name}</div>
                        <div className="text-sm truncate" style={{ color: "var(--muted)" }} title={exam.fullName}>{exam.fullName}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setStep(1)}
                      className="text-sm hover:underline whitespace-nowrap flex-shrink-0 transition-colors"
                      style={{ color: "#E76F51" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#3242CC";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "#E76F51";
                      }}
                    >
                      Change Exam
                    </button>
                  </div>
                </div>
              )}

              {/* Time Limit */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>
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
                  <div className="w-20 text-right font-semibold" style={{ color: "var(--foreground)" }}>
                    {timeLimitMinutes} min
                  </div>
                </div>
                <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                  Recommended: {Math.round(totalQuestions * 1.5)} minutes for {totalQuestions} questions
                </p>
              </div>

              {/* Sections */}
              <div>
                <h3 className="text-lg font-semibold mb-3" style={{ color: "var(--foreground)" }}>
                  Configure Sections
                </h3>
                <div className="space-y-4">
                  {sections.map(section => {
                    const subject = exam?.subjects.find(s => s.id === section.subjectId);
                    return (
                      <div
                        key={section.subjectId}
                        className="border rounded-xl p-4 space-y-3"
                        style={{ borderColor: "var(--card-border)" }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{subject?.icon}</span>
                            <div>
                              <div className="font-semibold" style={{ color: "var(--foreground)" }}>
                                {section.subjectName}
                              </div>
                              <div className="text-sm" style={{ color: "var(--muted)" }}>
                                {subject?.topics.length || 0} topics available
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleQuestionCountChange(section.subjectId, -1)}
                              className="p-1 rounded-lg transition-colors"
                              style={{ color: "var(--foreground)" }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "var(--primary-bg)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "transparent";
                              }}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-12 text-center font-semibold" style={{ color: "var(--foreground)" }}>
                              {section.questionCount}
                            </span>
                            <button
                              onClick={() => handleQuestionCountChange(section.subjectId, 1)}
                              className="p-1 rounded-lg transition-colors"
                              style={{ color: "var(--foreground)" }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "var(--primary-bg)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "transparent";
                              }}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            {sections.length > 1 && (
                              <button
                                onClick={() => handleRemoveSection(section.subjectId)}
                                className="p-1 rounded-lg transition-colors"
                                style={{ color: "#ef4444" }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = "transparent";
                                }}
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Topic Selection */}
                        {subject && (
                          <details className="text-sm">
                            <summary className="cursor-pointer hover:underline" style={{ color: "#E76F51" }}>
                              Select specific topics (optional)
                            </summary>
                            <div className="mt-2 grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 rounded-lg" style={{ background: "var(--primary-bg)" }}>
                              {subject.topics.map(topic => (
                                <label
                                  key={topic}
                                  className="flex items-center gap-2 p-1 rounded cursor-pointer transition-colors"
                                  style={{ color: "var(--foreground)" }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "var(--card-bg)";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "transparent";
                                  }}
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
                            <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
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
              <div className="p-4 rounded-xl border" style={{ background: "var(--primary-bg)", borderColor: "var(--card-border)" }}>
                <h4 className="font-semibold mb-2" style={{ color: "var(--foreground)" }}>Test Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span style={{ color: "var(--muted)" }}>Total Questions:</span>
                    <span className="ml-2 font-semibold" style={{ color: "var(--foreground)" }}>
                      {totalQuestions}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: "var(--muted)" }}>Time Limit:</span>
                    <span className="ml-2 font-semibold" style={{ color: "var(--foreground)" }}>
                      {timeLimitMinutes} minutes
                    </span>
                  </div>
                  <div>
                    <span style={{ color: "var(--muted)" }}>Sections:</span>
                    <span className="ml-2 font-semibold" style={{ color: "var(--foreground)" }}>
                      {sections.length}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: "var(--muted)" }}>Avg per Q:</span>
                    <span className="ml-2 font-semibold" style={{ color: "var(--foreground)" }}>
                      {Math.round((timeLimitMinutes * 60) / totalQuestions)}s
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-6" style={{ borderColor: "var(--card-border)", background: "var(--primary-bg)" }}>
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg transition-colors"
              style={{ color: "var(--foreground)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--card-bg)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              Cancel
            </button>
            <div className="flex items-center gap-3">
              {step === 2 && (
                <>
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-2 rounded-lg transition-colors"
                    style={{ color: "#E76F51" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(66, 85, 255, 0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    Back
                  </button>
                  <button
                    onClick={handleCreate}
                    disabled={sections.length === 0 || totalQuestions === 0}
                    className="px-8 py-3 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all shadow-lg"
                    style={{ background: "linear-gradient(to right, #E76F51, #9333ea)" }}
                    onMouseEnter={(e) => {
                      if (!e.currentTarget.disabled) {
                        e.currentTarget.style.transform = "scale(1.02)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                    }}
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
