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
              {/* 3D File Type Icons - Quizlet Style */}
              {!file && (
                <div className="flex items-center justify-center gap-4 mb-2">
                  {/* DOCX Icon */}
                  <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                    <defs>
                      <linearGradient id="docxGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#6B9FD6', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#4A7FB8', stopOpacity: 1 }} />
                      </linearGradient>
                      <filter id="docxShadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
                        <feOffset dx="0" dy="2" result="offsetblur"/>
                        <feComponentTransfer>
                          <feFuncA type="linear" slope="0.3"/>
                        </feComponentTransfer>
                        <feMerge>
                          <feMergeNode/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    <rect x="10" y="6" width="32" height="42" rx="3" fill="url(#docxGrad)" filter="url(#docxShadow)"/>
                    <path d="M38 6h-4l8 8v-4c0-2.2-1.8-4-4-4z" fill="#5A8FC7" opacity="0.7"/>
                    <rect x="14" y="26" width="6" height="2" rx="1" fill="white" opacity="0.9"/>
                    <rect x="14" y="30" width="24" height="1.5" rx="0.75" fill="white" opacity="0.7"/>
                    <rect x="14" y="33" width="24" height="1.5" rx="0.75" fill="white" opacity="0.7"/>
                    <rect x="14" y="36" width="18" height="1.5" rx="0.75" fill="white" opacity="0.7"/>
                  </svg>

                  {/* PDF Icon */}
                  <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                    <defs>
                      <linearGradient id="pdfGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#E57373', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#C62828', stopOpacity: 1 }} />
                      </linearGradient>
                      <filter id="pdfShadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
                        <feOffset dx="0" dy="2" result="offsetblur"/>
                        <feComponentTransfer>
                          <feFuncA type="linear" slope="0.3"/>
                        </feComponentTransfer>
                        <feMerge>
                          <feMergeNode/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    <rect x="10" y="6" width="32" height="42" rx="3" fill="url(#pdfGrad)" filter="url(#pdfShadow)"/>
                    <path d="M38 6h-4l8 8v-4c0-2.2-1.8-4-4-4z" fill="#D45D5D" opacity="0.7"/>
                    <text x="19" y="32" fill="white" fontSize="11" fontWeight="bold" fontFamily="system-ui">PDF</text>
                  </svg>

                  {/* PPTX Icon */}
                  <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                    <defs>
                      <linearGradient id="pptGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#FFB74D', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#F57C00', stopOpacity: 1 }} />
                      </linearGradient>
                      <filter id="pptShadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
                        <feOffset dx="0" dy="2" result="offsetblur"/>
                        <feComponentTransfer>
                          <feFuncA type="linear" slope="0.3"/>
                        </feComponentTransfer>
                        <feMerge>
                          <feMergeNode/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    <rect x="10" y="6" width="32" height="42" rx="3" fill="url(#pptGrad)" filter="url(#pptShadow)"/>
                    <path d="M38 6h-4l8 8v-4c0-2.2-1.8-4-4-4z" fill="#F39C3C" opacity="0.7"/>
                    <rect x="16" y="20" width="20" height="14" rx="1" fill="white" opacity="0.9"/>
                    <rect x="18" y="22" width="16" height="2" fill="#F57C00" opacity="0.7"/>
                    <rect x="18" y="26" width="12" height="1" fill="#F57C00" opacity="0.5"/>
                    <rect x="18" y="29" width="10" height="1" fill="#F57C00" opacity="0.5"/>
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
          <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-slate-100">
            <div className="flex justify-center mb-3">
              <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
                <defs>
                  <linearGradient id="boltGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#FCD34D', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#F59E0B', stopOpacity: 1 }} />
                  </linearGradient>
                  <filter id="boltShadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                    <feOffset dx="0" dy="4" result="offsetblur"/>
                    <feComponentTransfer>
                      <feFuncA type="linear" slope="0.25"/>
                    </feComponentTransfer>
                    <feMerge>
                      <feMergeNode/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <circle cx="36" cy="36" r="32" fill="#FEF3C7"/>
                <path d="M40 10L28 38H36L32 62L44 34H36L40 10Z" fill="url(#boltGrad)" filter="url(#boltShadow)"/>
                <path d="M40 10L28 38H36L32 62L44 34H36L40 10Z" fill="none" stroke="#D97706" strokeWidth="1.5" opacity="0.5"/>
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">Fast Generation</h3>
            <p className="text-sm text-slate-600">
              Get your quiz in under 60 seconds
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-slate-100">
            <div className="flex justify-center mb-3">
              <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
                <defs>
                  <linearGradient id="brainGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#A78BFA', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#7C3AED', stopOpacity: 1 }} />
                  </linearGradient>
                  <filter id="brainShadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                    <feOffset dx="0" dy="4" result="offsetblur"/>
                    <feComponentTransfer>
                      <feFuncA type="linear" slope="0.25"/>
                    </feComponentTransfer>
                    <feMerge>
                      <feMergeNode/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <circle cx="36" cy="36" r="32" fill="#EDE9FE"/>
                <path d="M24 28C24 24 26 22 28 22C30 22 31 23 32 24C33 23 34 22 36 22C38 22 40 23 41 25C42 23 44 22 46 22C48 22 50 24 50 28C50 30 49 31 48 33C49 34 50 36 50 38C50 42 48 44 46 44C44 44 43 43 42 42C41 43 40 44 38 44C36 44 34 43 33 41C32 43 30 44 28 44C26 44 24 42 24 38C24 36 25 34 26 33C25 31 24 30 24 28Z" fill="url(#brainGrad)" filter="url(#brainShadow)"/>
                <path d="M30 30C30 30 32 32 34 30M38 30C38 30 40 32 42 30M32 38C32 40 34 41 36 41C38 41 40 40 40 38" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">Smart Questions</h3>
            <p className="text-sm text-slate-600">
              AI focuses on key concepts from your material
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-slate-100">
            <div className="flex justify-center mb-3">
              <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
                <defs>
                  <linearGradient id="bulbGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#FDE68A', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#FBBF24', stopOpacity: 1 }} />
                  </linearGradient>
                  <filter id="bulbShadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                    <feOffset dx="0" dy="4" result="offsetblur"/>
                    <feComponentTransfer>
                      <feFuncA type="linear" slope="0.25"/>
                    </feComponentTransfer>
                    <feMerge>
                      <feMergeNode/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <circle cx="36" cy="38" r="32" fill="#FEF3C7"/>
                <circle cx="36" cy="30" r="12" fill="url(#bulbGrad)" filter="url(#bulbShadow)"/>
                <path d="M30 42C30 42 31 46 36 46C41 46 42 42 42 42" fill="#D97706"/>
                <rect x="33" y="46" width="6" height="4" rx="1" fill="#92400E"/>
                <rect x="32" y="50" width="8" height="3" rx="1.5" fill="#78350F"/>
                <circle cx="36" cy="30" r="8" fill="#FEF3C7" opacity="0.6"/>
                <line x1="36" y1="10" x2="36" y2="16" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
                <line x1="50" y1="16" x2="46" y2="20" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
                <line x1="56" y1="30" x2="50" y2="30" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
                <line x1="22" y1="16" x2="26" y2="20" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
                <line x1="16" y1="30" x2="22" y2="30" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
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
