"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@/context/user-context";
import { getExamById } from "@/lib/exams";
import { ArrowRight, BookOpen, Check, CheckCircle } from "lucide-react";
import { isAdmin } from "@/lib/admin";
import { Icon3DSparkle, Icon3DNotebook, Icon3DPencil, Icon3DRocket } from "@/components/premium-3d-icons";

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
      <div className="min-h-screen bg-[var(--card-bg)] flex items-center justify-center">
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
      <div className="min-h-screen bg-[var(--card-bg)] flex items-center justify-center">
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
    <div className="min-h-screen bg-[var(--card-bg)] pt-8 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => router.push(`/contributor/create/subject?examId=${examId}`)}
              className="font-medium text-sm flex items-center gap-1 transition-colors"
              style={{ color: "#4255FF" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#3242CC"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#4255FF"}
            >
              ← Back to Subjects
            </button>
          </div>
          <h1 className="text-4xl font-bold mb-3" style={{ color: "var(--foreground)" }}>
            Create Question Set
          </h1>
          <p className="text-lg" style={{ color: "var(--muted)" }}>
            Step 3 of 3: Upload study material and generate questions
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full text-white font-bold text-sm flex items-center justify-center" style={{ background: "#10b981" }}>
                <CheckCircle className="w-5 h-5" />
              </div>
              <span className="font-semibold hidden sm:inline" style={{ color: "#10b981" }}>Select Exam</span>
            </div>
            <div className="flex-1 h-1" style={{ background: "#10b981" }}></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full text-white font-bold text-sm flex items-center justify-center" style={{ background: "#10b981" }}>
                <CheckCircle className="w-5 h-5" />
              </div>
              <span className="font-semibold hidden sm:inline" style={{ color: "#10b981" }}>Select Subject</span>
            </div>
            <div className="flex-1 h-1" style={{ background: "#10b981" }}></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full text-white font-bold text-sm flex items-center justify-center" style={{ background: "#4255FF" }}>
                3
              </div>
              <span className="font-semibold hidden sm:inline" style={{ color: "#4255FF" }}>Upload & Generate</span>
            </div>
          </div>
        </div>

        {/* Selection Summary */}
        <div className="rounded-xl border-2 p-6 mb-8" style={{ background: "rgba(16, 185, 129, 0.1)", borderColor: "rgba(16, 185, 129, 0.3)" }}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium mb-1 flex items-center gap-1" style={{ color: "#10b981" }}>
                <Check className="w-4 h-4" /> Exam
              </div>
              <div className="text-lg font-bold" style={{ color: "var(--foreground)" }}>{exam.name}</div>
            </div>
            <div>
              <div className="text-sm font-medium mb-1 flex items-center gap-1" style={{ color: "#10b981" }}>
                <Check className="w-4 h-4" /> Subject
              </div>
              <div className="text-lg font-bold" style={{ color: "var(--foreground)" }}>{subject.name}</div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {submissionMessage && (
          <div className="mb-8 p-6 rounded-xl border-2" style={{ background: "rgba(16, 185, 129, 0.1)", borderColor: "rgba(16, 185, 129, 0.3)" }}>
            <div className="flex items-center gap-3">
              <Icon3DRocket size={56} />
              <div>
                <p className="font-bold text-lg" style={{ color: "#10b981" }}>{submissionMessage}</p>
                <p className="text-sm mt-1" style={{ color: "#10b981" }}>Redirecting to submissions...</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="rounded-2xl border-2 border-[var(--card-border)] p-8 shadow-sm" style={{ background: "var(--card-bg)" }}>
          <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--foreground)" }}>Upload Study Material</h2>

          {/* Tabs */}
          <div className="flex gap-8 mb-6 border-b" style={{ borderColor: "var(--card-border)" }}>
            <button
              onClick={() => setActiveTab('upload')}
              className="pb-3 px-2 font-medium transition-colors relative flex items-center gap-2"
              style={{ color: activeTab === 'upload' ? '#4255FF' : 'var(--muted)' }}
              onMouseEnter={(e) => { if (activeTab !== 'upload') e.currentTarget.style.color = "var(--foreground-secondary)"; }}
              onMouseLeave={(e) => { if (activeTab !== 'upload') e.currentTarget.style.color = "var(--muted)"; }}
            >
              <Icon3DRocket size={24} />
              Upload Files
              {activeTab === 'upload' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: '#4255FF' }} />
              )}
            </button>
            <button
              onClick={() => setActiveTab('paste')}
              className="pb-3 px-2 font-medium transition-colors relative flex items-center gap-2"
              style={{ color: activeTab === 'paste' ? '#4255FF' : 'var(--muted)' }}
              onMouseEnter={(e) => { if (activeTab !== 'paste') e.currentTarget.style.color = "var(--foreground-secondary)"; }}
              onMouseLeave={(e) => { if (activeTab !== 'paste') e.currentTarget.style.color = "var(--muted)"; }}
            >
              <Icon3DPencil size={24} />
              Paste Text
              {activeTab === 'paste' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: '#4255FF' }} />
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
                className="border-2 border-dashed rounded-xl p-12 text-center transition-all"
                style={dragActive
                  ? { borderColor: "#4255FF", background: "rgba(66, 85, 255, 0.1)" }
                  : { borderColor: "var(--card-border)", background: "var(--primary-bg)" }
                }
              >
                {!file ? (
                  <div className="flex flex-col items-center gap-4">
                    <Icon3DNotebook size={80} />
                    <div>
                      <p className="text-xl font-medium mb-2" style={{ color: "var(--foreground)" }}>
                        Drag and drop your file here
                      </p>
                      <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
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
                      className="px-8 py-3 text-white rounded-xl cursor-pointer transition-colors font-medium text-lg"
                      style={{ background: "#4255FF" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#3242CC"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "#4255FF"}
                    >
                      Browse Files
                    </label>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: "linear-gradient(to bottom right, #10b981, #059669)" }}>
                      <Check className="w-9 h-9 text-white" />
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-xl mb-1" style={{ color: "var(--foreground)" }}>{file.name}</p>
                      <p className="text-sm" style={{ color: "var(--muted)" }}>
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={() => setFile(null)}
                      className="text-sm transition-colors underline font-medium"
                      style={{ color: "#4255FF" }}
                      onMouseEnter={(e) => e.currentTarget.style.color = "#3242CC"}
                      onMouseLeave={(e) => e.currentTarget.style.color = "#4255FF"}
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
                className="w-full h-64 p-4 border-2 rounded-xl focus:outline-none resize-none"
                style={{ borderColor: "var(--card-border)", background: "var(--primary-bg)", color: "var(--foreground)" }}
                onFocus={(e) => e.currentTarget.style.borderColor = "#4255FF"}
                onBlur={(e) => e.currentTarget.style.borderColor = "var(--card-border)"}
              />
              <div className="flex items-start gap-2 mt-3">
                <Icon3DSparkle size={20} />
                <p className="text-xs" style={{ color: "var(--muted)" }}>
                  <span className="font-semibold">Tip:</span> More content = better question quality. Aim for at least 500 words.
                </p>
              </div>
            </div>
          )}

          {/* Settings */}
          {((activeTab === 'upload' && file) || (activeTab === 'paste' && pastedText.trim())) && (
            <div className="space-y-6">
              <div className="rounded-xl border p-6" style={{ background: "var(--primary-bg)", borderColor: "var(--card-border)" }}>
                <h3 className="font-semibold mb-4 text-lg" style={{ color: "var(--foreground)" }}>Generation Settings</h3>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Number of Questions */}
                  <div>
                    <label className="block text-sm font-medium mb-3" style={{ color: "var(--foreground-secondary)" }}>
                      Number of Questions
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[5, 10, 15, 20].map((num) => (
                        <button
                          key={num}
                          onClick={() => setNumQuestions(num)}
                          className="py-3 rounded-lg font-medium text-sm transition-all border"
                          style={numQuestions === num
                            ? { background: "#4255FF", color: "white", boxShadow: "0 4px 12px rgba(66, 85, 255, 0.3)", transform: "scale(1.05)" }
                            : { background: "var(--card-bg)", color: "var(--foreground)", borderColor: "var(--card-border)" }
                          }
                          onMouseEnter={(e) => {
                            if (numQuestions !== num) {
                              e.currentTarget.style.borderColor = "#4255FF";
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
                    <div className="grid grid-cols-3 gap-2">
                      {(['easy', 'medium', 'hard'] as const).map((level) => (
                        <button
                          key={level}
                          onClick={() => setDifficulty(level)}
                          className="py-3 rounded-lg font-medium text-sm capitalize transition-all border"
                          style={difficulty === level
                            ? { background: "#4255FF", color: "white", boxShadow: "0 4px 12px rgba(66, 85, 255, 0.3)", transform: "scale(1.05)" }
                            : { background: "var(--card-bg)", color: "var(--foreground)", borderColor: "var(--card-border)" }
                          }
                          onMouseEnter={(e) => {
                            if (difficulty !== level) {
                              e.currentTarget.style.borderColor = "#4255FF";
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
                <div className="p-4 border-2 rounded-xl" style={{ background: "rgba(239, 68, 68, 0.1)", borderColor: "rgba(239, 68, 68, 0.3)" }}>
                  <p className="font-semibold mb-1" style={{ color: "#ef4444" }}>❌ Error</p>
                  <p className="text-sm" style={{ color: "#ef4444" }}>{error}</p>
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={handleGenerateQuestions}
                disabled={isProcessing}
                className="w-full py-5 text-white rounded-xl font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center gap-3"
                style={{ background: "linear-gradient(to right, #4255FF, #9333ea)" }}
                onMouseEnter={(e) => { if (!isProcessing) e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(66, 85, 255, 0.3)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 10px 15px -3px rgb(0 0 0 / 0.1)"; }}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin h-6 w-6 border-3 border-white border-t-transparent rounded-full" />
                    Generating Questions...
                  </>
                ) : (
                  <>
                    <Icon3DSparkle size={28} />
                    Generate & Submit Questions
                    <ArrowRight className="w-6 h-6" />
                  </>
                )}
              </button>

              {isProcessing && (
                <div className="text-center flex flex-col items-center gap-3">
                  <Icon3DSparkle size={48} />
                  <p className="font-medium" style={{ color: "var(--foreground-secondary)" }}>
                    This may take 30-60 seconds. Please wait...
                  </p>
                  <p className="text-sm" style={{ color: "var(--muted)" }}>
                    Our AI is analyzing your content and generating high-quality questions
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 border rounded-xl p-6" style={{ background: "light-dark(rgba(66, 85, 255, 0.08), rgba(66, 85, 255, 0.1))", borderColor: "light-dark(rgba(66, 85, 255, 0.3), rgba(66, 85, 255, 0.3))" }}>
          <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--foreground)" }}>
            <Icon3DSparkle size={28} /> What Happens Next?
          </h3>
          <ul className="space-y-2 text-sm" style={{ color: "var(--foreground-secondary)" }}>
            <li className="flex items-start gap-2">
              <span className="font-bold">1.</span>
              <span>Our AI analyzes your content and generates questions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">2.</span>
              <span>Questions are submitted to the review queue</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">3.</span>
              <span>Admin reviews and approves high-quality questions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">4.</span>
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
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--card-bg)" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin h-8 w-8 border-4 border-t-transparent rounded-full" style={{ borderColor: "var(--muted)", borderTopColor: "#4255FF" }} />
          <p style={{ color: "var(--muted)" }}>Loading...</p>
        </div>
      </div>
    }>
      <UploadContentPage />
    </Suspense>
  );
}
