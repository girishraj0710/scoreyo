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
            Upload your study material and get instant practice questions
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
                      Drag and drop your file here
                    </p>
                    <p className="text-sm text-slate-500">
                      or click to browse
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
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer transition-colors font-medium"
                  >
                    Browse Files
                  </label>

                  <p className="text-xs text-slate-400">
                    Supported: TXT, PDF, DOCX, PPTX • Max 10MB
                  </p>
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
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="font-semibold text-slate-900 mb-1">Fast Generation</h3>
            <p className="text-sm text-slate-600">
              Get your quiz in under 60 seconds
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 text-center">
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="font-semibold text-slate-900 mb-1">Smart Questions</h3>
            <p className="text-sm text-slate-600">
              AI focuses on key concepts from your material
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 text-center">
            <div className="text-3xl mb-2">💡</div>
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
