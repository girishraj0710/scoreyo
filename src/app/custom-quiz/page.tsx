"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/context/user-context";
import { useRouter } from "next/navigation";
import { CheckCircle, AlertCircle } from "lucide-react";
import { AccessibilityWrapper } from "@/components/accessibility-wrapper";

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

  // Redirect ONLY contributors (not admin) to contributor portal
  useEffect(() => {
    if (!userLoading && user && user.role === 'contributor') {
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
    <AccessibilityWrapper>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-[#FEF5F3] to-[#FEF5F3] py-12 px-4" style={{ background: "var(--page-bg)" }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3" style={{ color: "var(--foreground)" }}>
            Generate a practice test
          </h1>
          <p className="text-lg" style={{ color: "var(--foreground-secondary)" }}>
            Choose or upload materials to generate practice questions designed for you
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 mb-8 border-b" style={{ borderColor: "var(--card-border)" }}>
          <button
            onClick={() => setActiveTab('upload')}
            className={`pb-3 px-2 font-medium transition-all relative cursor-pointer rounded-t-lg ${
              activeTab === 'upload'
                ? 'text-[#E76F51]'
                : ''
            }`}
            style={activeTab !== 'upload' ? { color: "var(--muted)" } : undefined}
            onMouseEnter={(e) => {
              if (activeTab !== 'upload') {
                e.currentTarget.style.backgroundColor = "var(--hover-bg)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            Upload files
            {activeTab === 'upload' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E76F51]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('paste')}
            className={`pb-3 px-2 font-medium transition-all relative cursor-pointer rounded-t-lg ${
              activeTab === 'paste'
                ? 'text-[#E76F51]'
                : ''
            }`}
            style={activeTab !== 'paste' ? { color: "var(--muted)" } : undefined}
            onMouseEnter={(e) => {
              if (activeTab !== 'paste') {
                e.currentTarget.style.backgroundColor = "var(--hover-bg)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            Paste text
            {activeTab === 'paste' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E76F51]" />
            )}
          </button>
        </div>

        {/* Upload Tab Content */}
        {activeTab === 'upload' && (
          <div className="rounded-2xl border-2 p-12" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-16 text-center transition-all ${
                dragActive
                  ? 'border-[#E76F51] bg-[#FEF5F3]'
                  : ''
              }`}
              style={!dragActive ? { borderColor: "var(--card-border)" } : undefined}
            >
              {!file ? (
                <div className="flex flex-col items-center gap-6">
                  {/* 3D File Icons */}
                  <div className="flex items-center justify-center gap-4">
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                      <defs>
                        <linearGradient id="docxGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" style={{ stopColor: '#E76F51', stopOpacity: 1 }} />
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
                    <p className="text-xl mb-2 font-medium" style={{ color: "var(--foreground-secondary)" }}>
                      Drag and drop notes, readings, lecture slides, etc.
                    </p>
                    <p className="text-sm" style={{ color: "var(--muted)" }}>
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
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <CheckCircle className="w-16 h-16 text-green-600" />
                  <div className="text-center">
                    <p className="text-lg font-semibold mb-1" style={{ color: "var(--foreground)" }}>{file.name}</p>
                    <p className="text-sm" style={{ color: "var(--muted)" }}>
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="text-sm hover:text-red-600 transition-colors underline"
                    style={{ color: "var(--foreground-secondary)" }}
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
          <div className="rounded-2xl border-2 p-8" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
            <textarea
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste your study material here..."
              className="w-full h-64 p-4 border-2 rounded-lg focus:outline-none focus:border-[#E76F51] resize-none transition-colors"
              style={{ borderColor: "var(--card-border)", color: "var(--foreground-secondary)", background: "var(--card-bg)" }}
              onMouseEnter={(e) => {
                if (e.currentTarget !== document.activeElement) {
                  e.currentTarget.style.borderColor = "#a5b4fc";
                }
              }}
              onMouseLeave={(e) => {
                if (e.currentTarget !== document.activeElement) {
                  e.currentTarget.style.borderColor = "var(--card-border)";
                }
              }}
            />
            <p className="text-xs mt-2" style={{ color: "var(--muted)" }}>
              Paste text from your notes, textbook, or any study material
            </p>
          </div>
        )}

        {/* Configuration & Generate */}
        {((activeTab === 'upload' && file) || (activeTab === 'paste' && pastedText.trim())) && (
          <div className="mt-8 space-y-6">
            <div className="rounded-2xl border p-8" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
              <h3 className="text-lg font-semibold mb-6" style={{ color: "var(--foreground)" }}>Quiz Settings</h3>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Number of Questions */}
                <div>
                  <label className="block text-sm font-medium mb-3" style={{ color: "var(--foreground-secondary)" }}>
                    Number of Questions
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {[5, 10, 15, 20].map((num) => (
                      <button
                        key={num}
                        onClick={() => setNumQuestions(num)}
                        className={`py-3 rounded-lg font-medium transition-all border-2 cursor-pointer ${
                          numQuestions === num
                            ? 'bg-[#E76F51] text-white shadow-lg'
                            : ''
                        }`}
                        style={numQuestions !== num ? { background: "var(--hover-bg)", color: "var(--foreground-secondary)", borderColor: "var(--card-border)" } : { borderColor: "#E76F51" }}
                        onMouseEnter={(e) => {
                          if (numQuestions !== num) {
                            e.currentTarget.style.borderColor = "#a5b4fc";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (numQuestions !== num) {
                            e.currentTarget.style.borderColor = "var(--card-border)";
                          }
                        }}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-sm font-medium mb-3" style={{ color: "var(--foreground-secondary)" }}>
                    Difficulty Level
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['easy', 'medium', 'hard'] as const).map((level) => (
                      <button
                        key={level}
                        onClick={() => setDifficulty(level)}
                        className={`py-3 rounded-lg font-medium capitalize transition-all border-2 cursor-pointer ${
                          difficulty === level
                            ? 'bg-[#E76F51] text-white shadow-lg'
                            : ''
                        }`}
                        style={difficulty !== level ? { background: "var(--hover-bg)", color: "var(--foreground-secondary)", borderColor: "var(--card-border)" } : { borderColor: "#E76F51" }}
                        onMouseEnter={(e) => {
                          if (difficulty !== level) {
                            e.currentTarget.style.borderColor = "#a5b4fc";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (difficulty !== level) {
                            e.currentTarget.style.borderColor = "var(--card-border)";
                          }
                        }}
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
              className="w-full py-4 bg-gradient-to-r from-[#E76F51] to-[#D65A3D] text-white rounded-xl font-semibold text-lg hover:from-[#D65A3D] hover:to-[#C4502F] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
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
              <p className="text-center text-sm" style={{ color: "var(--muted)" }}>
                This may take 30-60 seconds. Please wait...
              </p>
            )}
          </div>
        )}
      </div>
    </div>
    </AccessibilityWrapper>
  );
}
