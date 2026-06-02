"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/user-context";
import { examCategories } from "@/lib/exams";
import { ArrowRight, BookOpen, Zap, BarChart3 } from "lucide-react";
import Link from "next/link";
import { isAdmin } from "@/lib/admin";

export default function TeacherPortalPage() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const [selectedStep, setSelectedStep] = useState<'exam' | 'subject' | 'upload'>('exam');
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState("");
  const [numQuestions, setNumQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);

  // Check if user is teacher or contributor or admin
  useEffect(() => {
    if (!isLoading && user && !isAdmin(user.role, user.email) && !['teacher', 'contributor'].includes(user.role || 'student')) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
          <p className="text-slate-600">Loading teacher portal...</p>
        </div>
      </div>
    );
  }

  if (!user || (!isAdmin(user.role, user.email) && !['teacher', 'contributor'].includes(user.role || 'student'))) {
    return null;
  }

  const currentExam = examCategories.flatMap(cat => cat.exams).find(exam => exam.id === selectedExam);
  const currentSubject = currentExam?.subjects.find(subject => subject.id === selectedSubject);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    setError(null);

    // Validate file size
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (selectedFile.size > maxSize) {
      setError("File too large. Maximum size is 10MB");
      return;
    }

    // Validate file type
    const allowedTypes = [
      'text/plain',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Unsupported file type. Please upload TXT, PDF, DOCX, or PPTX");
      return;
    }

    setFile(selectedFile);
  };

  const handleGenerateQuestions = async () => {
    if (activeTab === 'upload' && !file) {
      setError("Please upload a file first");
      return;
    }

    if (activeTab === 'paste' && !pastedText.trim()) {
      setError("Please paste some text first");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      if (activeTab === 'upload' && file) {
        formData.append('file', file);
      } else if (activeTab === 'paste') {
        formData.append('text', pastedText);
      }
      formData.append('numQuestions', numQuestions.toString());
      formData.append('difficulty', difficulty);
      formData.append('examId', selectedExam || '');
      formData.append('subjectId', selectedSubject || '');

      const res = await fetch('/api/custom-quiz', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate questions');
      }

      setSubmissionMessage(`✅ ${data.quiz.numQuestions} questions generated and submitted for review!`);

      // Reset form
      setTimeout(() => {
        setFile(null);
        setPastedText("");
        setSelectedStep('exam');
        setSelectedExam(null);
        setSelectedSubject(null);
        setSubmissionMessage(null);
      }, 3000);

    } catch (err) {
      console.error('Generation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate questions');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            👨‍🏫 Teacher Portal
          </h1>
          <p className="text-lg text-slate-600">
            Create and submit verified questions to build PrepGenie's question bank
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-3 mb-8 flex-wrap">
          <Link
            href="/teacher/submissions"
            className="px-6 py-3 rounded-lg font-medium transition-all bg-white text-slate-700 border border-slate-200 hover:border-indigo-400 hover:text-indigo-600"
          >
            📝 My Submissions
          </Link>
          <Link
            href="/teacher/stats"
            className="px-6 py-3 rounded-lg font-medium transition-all bg-white text-slate-700 border border-slate-200 hover:border-indigo-400 hover:text-indigo-600"
          >
            📊 Contribution Stats
          </Link>
        </div>

        {/* Create Questions Section */}
        <div className="bg-white rounded-2xl border-2 border-slate-200 p-10 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-500" />
            Create New Question Set
          </h2>
          <p className="text-slate-600 mb-8">Choose an exam and subject, then upload your study material to generate questions</p>

          {submissionMessage && (
            <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 font-semibold">{submissionMessage}</p>
            </div>
          )}

          {/* Step 1: Exam Selection */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-sm">
                1
              </div>
              <h3 className="text-xl font-bold text-slate-900">Select Exam</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {examCategories.flatMap(cat => cat.exams).map((exam) => (
                <button
                  key={exam.id}
                  onClick={() => {
                    setSelectedExam(exam.id);
                    setSelectedSubject(null);
                    setSelectedStep('subject');
                  }}
                  className={`p-6 rounded-xl border-2 transition-all text-left ${
                    selectedExam === exam.id
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-slate-200 bg-white hover:border-indigo-300'
                  }`}
                >
                  <div className="text-3xl mb-2">{exam.icon}</div>
                  <p className="font-semibold text-slate-900">{exam.name}</p>
                  <p className="text-sm text-slate-500 mt-1">{exam.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Subject Selection */}
          {selectedExam && currentExam && (
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-sm">
                  2
                </div>
                <h3 className="text-xl font-bold text-slate-900">Select Subject</h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {currentExam.subjects.map((subject) => (
                  <button
                    key={subject.id}
                    onClick={() => {
                      setSelectedSubject(subject.id);
                      setSelectedStep('upload');
                    }}
                    className={`p-4 rounded-lg border-2 transition-all text-center ${
                      selectedSubject === subject.id
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-slate-200 bg-white hover:border-indigo-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{subject.icon}</div>
                    <p className="font-semibold text-slate-900 text-sm">{subject.name}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Upload Content */}
          {selectedSubject && currentSubject && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-sm">
                  3
                </div>
                <h3 className="text-xl font-bold text-slate-900">Upload Study Material</h3>
              </div>

              <p className="text-slate-600 mb-6">
                <span className="font-semibold">{currentExam?.name}</span> • <span className="font-semibold">{currentSubject.name}</span>
              </p>

              {/* Tabs */}
              <div className="flex gap-8 mb-6 border-b border-slate-200">
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`pb-3 px-2 font-medium transition-colors relative ${
                    activeTab === 'upload'
                      ? 'text-indigo-600'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Upload Files
                  {activeTab === 'upload' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('paste')}
                  className={`pb-3 px-2 font-medium transition-colors relative ${
                    activeTab === 'paste'
                      ? 'text-indigo-600'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Paste Text
                  {activeTab === 'paste' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
                  )}
                </button>
              </div>

              {/* Upload Tab */}
              {activeTab === 'upload' && (
                <div className="bg-slate-50 rounded-xl border-2 border-slate-200 p-8 mb-6">
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                      dragActive
                        ? 'border-indigo-400 bg-indigo-50'
                        : 'border-slate-300 hover:border-slate-400'
                    }`}
                  >
                    {!file ? (
                      <div className="flex flex-col items-center gap-4">
                        <BookOpen className="w-12 h-12 text-indigo-400" />
                        <div>
                          <p className="text-lg text-slate-700 font-medium mb-1">
                            Drag and drop your file here
                          </p>
                          <p className="text-sm text-slate-500">
                            Supported: PDF, DOCX, PPTX, TXT (max 10MB)
                          </p>
                        </div>
                        <input
                          type="file"
                          id="file-upload"
                          className="hidden"
                          accept=".txt,.pdf,.docx,.pptx"
                          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                        />
                        <label
                          htmlFor="file-upload"
                          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer transition-colors font-medium"
                        >
                          Browse Files
                        </label>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <div className="text-3xl">✅</div>
                        <div className="text-center">
                          <p className="font-semibold text-slate-900">{file.name}</p>
                          <p className="text-sm text-slate-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <button
                          onClick={() => setFile(null)}
                          className="text-sm text-indigo-600 hover:text-indigo-700 transition-colors underline font-medium"
                        >
                          Change File
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Paste Tab */}
              {activeTab === 'paste' && (
                <div className="bg-slate-50 rounded-xl border-2 border-slate-200 p-8 mb-6">
                  <textarea
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    placeholder="Paste your study material here..."
                    className="w-full h-48 p-4 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-indigo-400 text-slate-700 resize-none"
                  />
                  <p className="text-xs text-slate-400 mt-3">
                    Paste text from your notes, textbook, lecture slides, or any study material
                  </p>
                </div>
              )}

              {/* Settings & Generate */}
              {((activeTab === 'upload' && file) || (activeTab === 'paste' && pastedText.trim())) && (
                <div className="space-y-6">
                  <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
                    <h4 className="font-semibold text-slate-900 mb-4">Settings</h4>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Number of Questions */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-3">
                          Number of Questions
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          {[5, 10, 15, 20].map((num) => (
                            <button
                              key={num}
                              onClick={() => setNumQuestions(num)}
                              className={`py-2 rounded-lg font-medium text-sm transition-all ${
                                numQuestions === num
                                  ? 'bg-indigo-600 text-white shadow-lg'
                                  : 'bg-white text-slate-700 border border-slate-200 hover:border-indigo-300'
                              }`}
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Difficulty */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-3">
                          Difficulty Level
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {(['easy', 'medium', 'hard'] as const).map((level) => (
                            <button
                              key={level}
                              onClick={() => setDifficulty(level)}
                              className={`py-2 rounded-lg font-medium text-sm capitalize transition-all ${
                                difficulty === level
                                  ? 'bg-indigo-600 text-white shadow-lg'
                                  : 'bg-white text-slate-700 border border-slate-200 hover:border-indigo-300'
                              }`}
                            >
                              {level}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-900 font-semibold mb-1">Error</p>
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  )}

                  {/* Generate Button */}
                  <button
                    onClick={handleGenerateQuestions}
                    disabled={isProcessing}
                    className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                        Generating Questions...
                      </>
                    ) : (
                      <>
                        Generate & Submit Questions
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  {isProcessing && (
                    <p className="text-center text-sm text-slate-500">
                      This may take 30-60 seconds. Please wait...
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-3">💡 How It Works</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>✓ Select an exam and subject</li>
            <li>✓ Upload your study material (PDF, DOCX, PPTX, or paste text)</li>
            <li>✓ Our AI generates questions from your material</li>
            <li>✓ Questions go to review queue for admin approval</li>
            <li>✓ Approved questions earn you contribution points!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
