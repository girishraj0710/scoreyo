"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/context/user-context";
import { useRouter } from "next/navigation";
import { CheckCircle, AlertCircle } from "lucide-react";

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
  const { user, isLoading: userLoading } = useUser();

  // Redirect contributors to contributor portal
  useEffect(() => {
    if (!userLoading && user && ["contributor", "admin"].includes(user.role || "")) {
      router.push("/contributor");
    }
  }, [user, userLoading, router]);
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState("");
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
    <div className="min-h-screen py-12 px-4" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3" style={{ color: 'var(--foreground)' }}>
            Generate a practice test
          </h1>
          <p className="text-lg" style={{ color: 'var(--foreground-secondary)' }}>
            Choose or upload materials to generate practice questions designed for you
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 mb-8" style={{ borderBottom: '1px solid var(--card-border)' }}>
          <button
            onClick={() => setActiveTab('upload')}
            className="pb-3 px-2 font-medium transition-colors relative"
            style={{ color: activeTab === 'upload' ? 'var(--primary)' : 'var(--foreground-secondary)' }}
          >
            Upload files
            {activeTab === 'upload' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: 'var(--primary)' }} />
            )}
          </button>
          <button
            onClick={() => setActiveTab('paste')}
            className="pb-3 px-2 font-medium transition-colors relative"
            style={{ color: activeTab === 'paste' ? 'var(--primary)' : 'var(--foreground-secondary)' }}
          >
            Paste text
            {activeTab === 'paste' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: 'var(--primary)' }} />
            )}
          </button>
        </div>

        {/* Upload Tab Content */}
        {activeTab === 'upload' && (
          <div className="rounded-2xl border-2 p-12" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className="border-2 border-dashed rounded-xl p-16 text-center transition-all"
              style={{
                borderColor: dragActive ? 'var(--primary)' : 'var(--card-border)',
                background: dragActive ? 'var(--primary-bg)' : 'transparent'
              }}
            >
              {!file ? (
                <div className="flex flex-col items-center gap-6">
                  {/* 3D File Icons */}
                  <div className="flex items-center justify-center gap-4">
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                      <defs>
                        <linearGradient id="docxGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" style={{ stopColor: '#6B9FD6', stopOpacity: 1 }} />
                          <stop offset="100%" style={{ stopColor: '#4A7FB8', stopOpacity: 1 }} />
                        </linearGradient>
                        <filter id="docxShadow">
                          <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
                          <feOffset dx="0" dy="2"/>
                          <feComponentTransfer><feFuncA type="linear" slope="0.3"/></feComponentTransfer>
                          <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
                        </filter>
                      </defs>
                      <rect x="12" y="8" width="36" height="48" rx="3" fill="url(#docxGrad)" filter="url(#docxShadow)"/>
                      <path d="M44 8h-4l8 8v-4c0-2.2-1.8-4-4-4z" fill="#5A8FC7" opacity="0.7"/>
                      <rect x="18" y="30" width="8" height="2" rx="1" fill="white" opacity="0.9"/>
                      <rect x="18" y="35" width="28" height="1.5" rx="0.75" fill="white" opacity="0.7"/>
                      <rect x="18" y="39" width="28" height="1.5" rx="0.75" fill="white" opacity="0.7"/>
                      <rect x="18" y="43" width="20" height="1.5" rx="0.75" fill="white" opacity="0.7"/>
                    </svg>

                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                      <defs>
                        <linearGradient id="pdfGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" style={{ stopColor: '#E57373', stopOpacity: 1 }} />
                          <stop offset="100%" style={{ stopColor: '#C62828', stopOpacity: 1 }} />
                        </linearGradient>
                        <filter id="pdfShadow">
                          <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
                          <feOffset dx="0" dy="2"/>
                          <feComponentTransfer><feFuncA type="linear" slope="0.3"/></feComponentTransfer>
                          <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
                        </filter>
                      </defs>
                      <rect x="12" y="8" width="36" height="48" rx="3" fill="url(#pdfGrad)" filter="url(#pdfShadow)"/>
                      <path d="M44 8h-4l8 8v-4c0-2.2-1.8-4-4-4z" fill="#D45D5D" opacity="0.7"/>
                      <text x="23" y="38" fill="white" fontSize="13" fontWeight="bold" fontFamily="system-ui">PDF</text>
                    </svg>

                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                      <defs>
                        <linearGradient id="pptGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" style={{ stopColor: '#FFB74D', stopOpacity: 1 }} />
                          <stop offset="100%" style={{ stopColor: '#F57C00', stopOpacity: 1 }} />
                        </linearGradient>
                        <filter id="pptShadow">
                          <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
                          <feOffset dx="0" dy="2"/>
                          <feComponentTransfer><feFuncA type="linear" slope="0.3"/></feComponentTransfer>
                          <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
                        </filter>
                      </defs>
                      <rect x="12" y="8" width="36" height="48" rx="3" fill="url(#pptGrad)" filter="url(#pptShadow)"/>
                      <path d="M44 8h-4l8 8v-4c0-2.2-1.8-4-4-4z" fill="#F39C3C" opacity="0.7"/>
                      <rect x="20" y="24" width="24" height="16" rx="1" fill="white" opacity="0.9"/>
                      <rect x="22" y="27" width="20" height="2" fill="#F57C00" opacity="0.7"/>
                      <rect x="22" y="32" width="16" height="1" fill="#F57C00" opacity="0.5"/>
                      <rect x="22" y="36" width="12" height="1" fill="#F57C00" opacity="0.5"/>
                    </svg>
                  </div>

                  <div>
                    <p className="text-xl  mb-2 font-medium" style={{ color: "var(--foreground)" }}>
                      Drag and drop notes, readings, lecture slides, etc.
                    </p>
                    <p className="text-sm " style={{ color: "var(--foreground)" }}>
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
                    className="px-6 py-3 bg-slate-600 text-white rounded-lg hover: cursor-pointer transition-colors font-medium" style={{ background: "var(--background)" }}
                  >
                    Browse files
                  </label>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <CheckCircle className="w-16 h-16 text-green-600" />
                  <div className="text-center">
                    <p className="text-lg font-semibold  mb-1" style={{ color: "var(--foreground)" }}>{file.name}</p>
                    <p className="text-sm " style={{ color: "var(--foreground)" }}>
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="text-sm  hover:text-red-600 transition-colors underline" style={{ color: "var(--foreground)" }}
                  >
                    Remove file
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Paste Text Tab Content */}
        {activeTab === 'paste' && (
          <div className=" rounded-2xl border-2  p-8" style={{ borderColor: "var(--card-border)" }} style={{ background: "var(--card-bg)" }}>
            <textarea
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste your study material here..."
              className="w-full h-64 p-4 border-2  rounded-lg focus:outline-none focus:border-indigo-400  resize-none" style={{ borderColor: "var(--card-border)" }} style={{ color: "var(--foreground)" }}
            />
            <p className="text-xs  mt-2" style={{ color: "var(--foreground)" }}>
              Paste text from your notes, textbook, or any study material
            </p>
          </div>
        )}

        {/* Configuration & Generate */}
        {((activeTab === 'upload' && file) || (activeTab === 'paste' && pastedText.trim())) && (
          <div className="mt-8 space-y-6">
            <div className=" rounded-2xl border  p-8" style={{ borderColor: "var(--card-border)" }} style={{ background: "var(--card-bg)" }}>
              <h3 className="text-lg font-semibold  mb-6" style={{ color: "var(--foreground)" }}>Quiz Settings</h3>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Number of Questions */}
                <div>
                  <label className="block text-sm font-medium  mb-3" style={{ color: "var(--foreground)" }}>
                    Number of Questions
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {[5, 10, 15, 20].map((num) => (
                      <button
                        key={num}
                        onClick={() => setNumQuestions(num)}
                        className={`py-3 rounded-lg font-medium transition-all ${
                          numQuestions === num
                            ? 'bg-[#4255FF] text-white shadow-lg'
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
                  <label className="block text-sm font-medium  mb-3" style={{ color: "var(--foreground)" }}>
                    Difficulty Level
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['easy', 'medium', 'hard'] as const).map((level) => (
                      <button
                        key={level}
                        onClick={() => setDifficulty(level)}
                        className={`py-3 rounded-lg font-medium capitalize transition-all ${
                          difficulty === level
                            ? 'bg-[#4255FF] text-white shadow-lg'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
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
              className="w-full py-4 bg-gradient-to-r from-[#4255FF] to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-[#3242CC] hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  Generating Questions...
                </>
              ) : (
                <>
                  Generate Practice Quiz
                  <span className="text-xl">→</span>
                </>
              )}
            </button>

            {isProcessing && (
              <p className="text-center text-sm " style={{ color: "var(--foreground)" }}>
                This may take 30-60 seconds. Please wait...
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
