"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText, Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  trapAlerts?: string[];
  difficulty: string;
}

export default function CustomQuizPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [numQuestions, setNumQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

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

  const handleGenerate = async () => {
    if (!file) {
      setError("Please upload a file first");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('numQuestions', numQuestions.toString());
      formData.append('difficulty', difficulty);

      const res = await fetch('/api/custom-quiz', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate quiz');
      }

      // Store questions in session storage
      sessionStorage.setItem('customQuiz', JSON.stringify(data.quiz.questions));

      // Navigate to quiz page
      router.push(`/quiz?mode=custom&count=${data.quiz.numQuestions}`);

    } catch (err) {
      console.error('Generation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate quiz');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            📚 Generate Quiz from Your Notes
          </h1>
          <p className="text-lg text-slate-600">
            Choose or upload materials to generate practice questions designed for you
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* File Upload Area */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
              dragActive
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-slate-300 hover:border-indigo-400'
            }`}
          >
            <div className="flex flex-col items-center gap-4">
              {/* 3D File Type Icons */}
              {!file && (
                <div className="flex items-center justify-center gap-3 mb-2">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <rect x="8" y="6" width="28" height="36" rx="2" fill="#4A90E2"/>
                    <path d="M36 10L32 6H10C8.9 6 8 6.9 8 8V40C8 41.1 8.9 42 10 42H38C39.1 42 40 41.1 40 40V14L36 10Z" fill="#7DB3E8"/>
                    <path d="M36 10H40L36 14V10Z" fill="#4A90E2"/>
                    <text x="19" y="28" fill="white" fontSize="10" fontWeight="bold">DOCX</text>
                  </svg>
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <rect x="8" y="6" width="28" height="36" rx="2" fill="#E74C3C"/>
                    <path d="M36 10L32 6H10C8.9 6 8 6.9 8 8V40C8 41.1 8.9 42 10 42H38C39.1 42 40 41.1 40 40V14L36 10Z" fill="#EC7063"/>
                    <path d="M36 10H40L36 14V10Z" fill="#E74C3C"/>
                    <text x="20" y="28" fill="white" fontSize="10" fontWeight="bold">PDF</text>
                  </svg>
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <rect x="8" y="6" width="28" height="36" rx="2" fill="#E67E22"/>
                    <path d="M36 10L32 6H10C8.9 6 8 6.9 8 8V40C8 41.1 8.9 42 10 42H38C39.1 42 40 41.1 40 40V14L36 10Z" fill="#F39C12"/>
                    <path d="M36 10H40L36 14V10Z" fill="#E67E22"/>
                    <text x="19" y="28" fill="white" fontSize="10" fontWeight="bold">PPTX</text>
                  </svg>
                </div>
              )}
              <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center">
                {file ? (
                  <CheckCircle className="w-10 h-10 text-indigo-600" />
                ) : (
                  <Upload className="w-10 h-10 text-indigo-600" />
                )}
              </div>

              {!file ? (
                <>
                  <div>
                    <p className="text-lg font-semibold text-slate-900 mb-1">
                      Drag and drop notes, readings, lecture slides, etc.
                    </p>
                    <p className="text-sm text-slate-500">
                      Supported file types are .docx, .pdf, .pptx
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
                    className="px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 cursor-pointer transition-colors font-medium"
                  >
                    Browse files
                  </label>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-lg">
                    <FileText className="w-5 h-5 text-slate-600" />
                    <div className="text-left">
                      <p className="font-medium text-slate-900">{file.name}</p>
                      <p className="text-xs text-slate-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setFile(null)}
                    className="text-sm text-slate-500 hover:text-red-600 transition-colors"
                  >
                    Remove file
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Configuration */}
          {file && (
            <div className="mt-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Number of Questions */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Number of Questions
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[5, 10, 15, 20].map((num) => (
                      <button
                        key={num}
                        onClick={() => setNumQuestions(num)}
                        className={`py-2 rounded-lg font-medium transition-all ${
                          numQuestions === num
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Difficulty Level
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['easy', 'medium', 'hard'] as const).map((level) => (
                      <button
                        key={level}
                        onClick={() => setDifficulty(level)}
                        className={`py-2 rounded-lg font-medium capitalize transition-all ${
                          difficulty === level
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-900 mb-1">Error</p>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isProcessing}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating Questions...
                  </>
                ) : (
                  <>
                    Generate Practice Quiz
                    <span className="text-lg">→</span>
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

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <div className="bg-white rounded-xl p-6 text-center">
            <div className="flex justify-center mb-3">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="32" r="28" fill="#FEF3C7"/>
                <path d="M32 12L36 24L48 26L40 34L42 46L32 40L22 46L24 34L16 26L28 24L32 12Z" fill="#F59E0B" stroke="#D97706" strokeWidth="2"/>
                <circle cx="32" cy="32" r="4" fill="#FBBF24"/>
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">Fast Generation</h3>
            <p className="text-sm text-slate-600">
              Get your quiz in under 60 seconds
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 text-center">
            <div className="flex justify-center mb-3">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="32" r="28" fill="#DBEAFE"/>
                <circle cx="32" cy="32" r="20" fill="#3B82F6" stroke="#2563EB" strokeWidth="3"/>
                <circle cx="32" cy="32" r="12" fill="#60A5FA" stroke="#2563EB" strokeWidth="2"/>
                <circle cx="32" cy="32" r="4" fill="#1D4ED8"/>
                <path d="M32 12V22M32 42V52M52 32H42M22 32H12" stroke="#2563EB" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">Smart Questions</h3>
            <p className="text-sm text-slate-600">
              AI focuses on key concepts from your material
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 text-center">
            <div className="flex justify-center mb-3">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="36" r="24" fill="#FEF3C7"/>
                <path d="M32 10L28 24C28 24 22 24 22 28C22 32 26 34 26 38C26 42 32 48 32 48C32 48 38 42 38 38C38 34 42 32 42 28C42 24 36 24 36 24L32 10Z" fill="#FBBF24" stroke="#F59E0B" strokeWidth="2"/>
                <ellipse cx="32" cy="52" rx="10" ry="3" fill="#D97706" opacity="0.3"/>
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">Detailed Explanations</h3>
            <p className="text-sm text-slate-600">
              Learn why each answer is correct
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
