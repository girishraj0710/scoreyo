"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@/context/user-context";
import { getExamById } from "@/lib/exams";
import { ArrowRight, BookOpen, Check, Upload, FileText, Lightbulb, CheckCircle2, Sparkles } from "lucide-react";
import { isAdmin } from "@/lib/admin";

function UploadContentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading } = useUser();
  const examId = searchParams.get("examId");
  const subjectId = searchParams.get("subjectId");

  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState("");
  const [numQuestions, setNumQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);

  // Check if user is contributor or admin
  useEffect(() => {
    if (!isLoading && user && !isAdmin(user.role, user.email) && !['contributor'].includes(user.role || 'student')) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!examId || !subjectId) {
      router.push('/contributor/create');
    }
  }, [examId, subjectId, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || (!isAdmin(user.role, user.email) && !['contributor'].includes(user.role || 'student'))) {
    return null;
  }

  const exam = getExamById(examId || '');
  const subject = exam?.subjects.find(s => s.id === subjectId);

  if (!exam || !subject) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">Invalid selection</p>
          <button
            onClick={() => router.push('/contributor/create')}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            ← Start over
          </button>
        </div>
      </div>
    );
  }

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
      formData.append('examId', examId || '');
      formData.append('subjectId', subjectId || '');

      const res = await fetch('/api/custom-quiz', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate questions');
      }

      setSubmissionMessage(`✅ ${data.quiz.numQuestions} questions generated and submitted for review!`);

      // Redirect after 3 seconds
      setTimeout(() => {
        router.push('/contributor/submissions');
      }, 3000);

    } catch (err) {
      console.error('Generation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate questions');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-8 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => router.push(`/contributor/create/subject?examId=${examId}`)}
              className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center gap-1"
            >
              ← Back to Subjects
            </button>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Create Question Set
          </h1>
          <p className="text-lg text-slate-600">
            Step 3 of 3: Upload study material and generate questions
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-600 text-white font-bold text-sm flex items-center justify-center">
                ✓
              </div>
              <span className="font-semibold text-green-600 hidden sm:inline">Select Exam</span>
            </div>
            <div className="flex-1 h-1 bg-green-600"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-600 text-white font-bold text-sm flex items-center justify-center">
                ✓
              </div>
              <span className="font-semibold text-green-600 hidden sm:inline">Select Subject</span>
            </div>
            <div className="flex-1 h-1 bg-green-600"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center">
                3
              </div>
              <span className="font-semibold text-indigo-600 hidden sm:inline">Upload & Generate</span>
            </div>
          </div>
        </div>

        {/* Selection Summary */}
        <div className="bg-green-50 rounded-xl border-2 border-green-200 p-6 mb-8">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-green-600 font-medium mb-1 flex items-center gap-1">
                <Check className="w-4 h-4" /> Exam
              </div>
              <div className="text-lg font-bold text-slate-900">{exam.name}</div>
            </div>
            <div>
              <div className="text-sm text-green-600 font-medium mb-1 flex items-center gap-1">
                <Check className="w-4 h-4" /> Subject
              </div>
              <div className="text-lg font-bold text-slate-900">{subject.name}</div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {submissionMessage && (
          <div className="mb-8 p-6 bg-green-50 border-2 border-green-200 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-green-900 font-bold text-lg">{submissionMessage}</p>
                <p className="text-green-700 text-sm mt-1">Redirecting to submissions...</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="rounded-2xl border-2 border-slate-200 p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Upload Study Material</h2>

          {/* Tabs */}
          <div className="flex gap-8 mb-6 border-b border-slate-200">
            <button
              onClick={() => setActiveTab('upload')}
              className={`pb-3 px-2 font-medium transition-colors relative flex items-center gap-2 ${
                activeTab === 'upload'
                  ? 'text-indigo-600'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Upload className="w-4 h-4" />
              Upload Files
              {activeTab === 'upload' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('paste')}
              className={`pb-3 px-2 font-medium transition-colors relative flex items-center gap-2 ${
                activeTab === 'paste'
                  ? 'text-indigo-600'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <FileText className="w-4 h-4" />
              Paste Text
              {activeTab === 'paste' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
              )}
            </button>
          </div>

          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <div className="mb-6">
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                  dragActive
                    ? 'border-indigo-400 bg-indigo-50'
                    : 'border-slate-300 hover:border-slate-400 bg-slate-50'
                }`}
              >
                {!file ? (
                  <div className="flex flex-col items-center gap-4">
                    <BookOpen className="w-16 h-16 text-indigo-400" />
                    <div>
                      <p className="text-xl text-slate-700 font-medium mb-2">
                        Drag and drop your file here
                      </p>
                      <p className="text-sm text-slate-500 mb-4">
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
                      className="px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 cursor-pointer transition-colors font-medium text-lg"
                    >
                      Browse Files
                    </label>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                      <Check className="w-9 h-9 text-white" />
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-slate-900 text-xl mb-1">{file.name}</p>
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
            <div className="mb-6">
              <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste your study material here...&#10;&#10;You can paste text from:&#10;• Lecture notes&#10;• Textbook chapters&#10;• Study guides&#10;• Previous year papers&#10;• Any educational content"
                className="w-full h-64 p-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 text-slate-700 resize-none"
              />
              <div className="flex items-start gap-2 mt-3">
                <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-slate-500">
                  <span className="font-semibold">Tip:</span> More content = better question quality. Aim for at least 500 words.
                </p>
              </div>
            </div>
          )}

          {/* Settings */}
          {((activeTab === 'upload' && file) || (activeTab === 'paste' && pastedText.trim())) && (
            <div className="space-y-6">
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-900 mb-4 text-lg">Generation Settings</h3>

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
                          className={`py-3 rounded-lg font-medium text-sm transition-all ${
                            numQuestions === num
                              ? 'bg-indigo-600 text-white shadow-lg scale-105'
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
                          className={`py-3 rounded-lg font-medium text-sm capitalize transition-all ${
                            difficulty === level
                              ? 'bg-indigo-600 text-white shadow-lg scale-105'
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
                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                  <p className="text-red-900 font-semibold mb-1">❌ Error</p>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={handleGenerateQuestions}
                disabled={isProcessing}
                className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin h-6 w-6 border-3 border-white border-t-transparent rounded-full" />
                    Generating Questions...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6" />
                    Generate & Submit Questions
                    <ArrowRight className="w-6 h-6" />
                  </>
                )}
              </button>

              {isProcessing && (
                <div className="text-center">
                  <p className="text-slate-600 font-medium">
                    ⏳ This may take 30-60 seconds. Please wait...
                  </p>
                  <p className="text-sm text-slate-500 mt-2">
                    Our AI is analyzing your content and generating high-quality questions
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-blue-600" /> What Happens Next?
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">1.</span>
              <span>Our AI analyzes your content and generates questions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">2.</span>
              <span>Questions are submitted to the review queue</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">3.</span>
              <span>Admin reviews and approves high-quality questions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">4.</span>
              <span>Approved questions earn you contribution points!</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function UploadPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    }>
      <UploadContentPage />
    </Suspense>
  );
}
