'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/user-context';
import { isAdmin } from '@/lib/admin';
import { useLocale } from '@/context/locale-context';
import { StudyMaterialUploader } from '@/components/study-material-uploader';
import { getAllExams, getExamById } from '@/lib/exams';
import { ChevronRight, Upload, CheckCircle, AlertCircle, Loader, Search, X } from 'lucide-react';
import { ColorfulExamIcon, ColorfulCategoryIcon } from '@/lib/colorful-exam-icons';
import { AccessibilityWrapper } from '@/components/accessibility-wrapper';

interface FileUpload {
  file: File;
  title: string;
  description: string;
  error?: string;
}

type Step = 'exam' | 'subject' | 'upload';

export default function ContributorMaterialsPage() {
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();
  const { t } = useLocale();

  const [step, setStep] = useState<Step>('exam');
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');
  const [examSearch, setExamSearch] = useState('');
  const [subjectSearch, setSubjectSearch] = useState('');
  const isMountedRef = useRef(false);

  const exams = getAllExams();
  const selectedExamObj = selectedExam ? getExamById(selectedExam) : null;
  const subjects = selectedExamObj?.subjects || [];

  // Check auth
  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      return;
    }

    if (!userLoading && user && !isAdmin(user.role, user.email) && user.role !== 'contributor') {
      router.push('/');
    }
  }, [user, userLoading]);

  // Get exam name
  const examName = selectedExam
    ? exams.find((e) => e.id === selectedExam)?.name
    : null;

  // Get subject name
  const subjectName = selectedSubject
    ? subjects.find((s) => s.id === selectedSubject)?.name
    : null;

  const handleFilesSelected = (selectedFiles: FileUpload[]) => {
    setFiles(selectedFiles);
  };

  const handleUpload = async () => {
    if (!selectedExam || !selectedSubject || files.length === 0) {
      setUploadStatus('error');
      setUploadMessage('Please select exam, subject, and add files');
      return;
    }

    // Check for files with errors
    const errorFiles = files.filter((f) => f.error);
    if (errorFiles.length > 0) {
      setUploadStatus('error');
      setUploadMessage('Please remove files with errors before uploading');
      return;
    }

    setIsUploading(true);
    setUploadStatus('idle');
    setUploadMessage('');

    try {
      const formData = new FormData();
      formData.append('examId', selectedExam);
      formData.append('subjectId', selectedSubject);

      files.forEach((file, index) => {
        formData.append('files', file.file);
        formData.append(`titles[${index}]`, file.title);
        formData.append(`descriptions[${index}]`, file.description);
      });

      const response = await fetch('/api/contributor/study-materials', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setUploadStatus('success');
      setUploadMessage(
        data.message || `${files.length} material(s) uploaded successfully for review!`
      );
      setFiles([]);

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/contributor/submissions');
      }, 2000);
    } catch (error) {
      setUploadStatus('error');
      setUploadMessage(
        error instanceof Error ? error.message : 'Upload failed. Please try again.'
      );
    } finally {
      setIsUploading(false);
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
          <p style={{ color: "var(--foreground-secondary)" }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || (!isAdmin(user.role, user.email) && user.role !== 'contributor')) {
    return null;
  }

  return (
    <AccessibilityWrapper>
      <div className="min-h-screen pt-8 pb-12 px-4" style={{ background: "var(--background)" }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <a
              href="/contributor"
              className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center gap-1"
            >
              ← Back to Portal
            </a>
          </div>
          <h1 className="text-4xl font-bold mb-3" style={{ color: "var(--foreground)" }}>
            Upload Study Materials
          </h1>
          <p className="text-lg" style={{ color: "var(--foreground-secondary)" }}>
            Share your study materials (PDF, DOCX, PPT) with the community
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-12">
          <div className={`flex items-center gap-2 ${step !== 'exam' ? 'opacity-60' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
              step === 'exam' ? 'bg-indigo-600' : ''
            }`} style={step !== 'exam' ? { background: "var(--hover-bg)", color: "var(--foreground)" } : {}}>
              1
            </div>
            <span className="font-medium" style={{ color: "var(--foreground)" }}>Select Exam</span>
          </div>
          <ChevronRight className="w-5 h-5" style={{ color: "var(--card-border)" }} />
          <div className={`flex items-center gap-2 ${step !== 'subject' ? 'opacity-60' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
              step === 'subject' ? 'bg-indigo-600' : ''
            }`} style={step !== 'subject' ? { background: "var(--hover-bg)", color: "var(--foreground)" } : {}}>
              2
            </div>
            <span className="font-medium" style={{ color: "var(--foreground)" }}>Select Subject</span>
          </div>
          <ChevronRight className="w-5 h-5" style={{ color: "var(--card-border)" }} />
          <div className={`flex items-center gap-2 ${step !== 'upload' ? 'opacity-60' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
              step === 'upload' ? 'bg-indigo-600' : ''
            }`} style={step !== 'upload' ? { background: "var(--hover-bg)", color: "var(--foreground)" } : {}}>
              3
            </div>
            <span className="font-medium" style={{ color: "var(--foreground)" }}>Upload Files</span>
          </div>
        </div>

        {/* Step 1: Select Exam */}
        {step === 'exam' && (
          <div className="space-y-6">
            {/* Search Input */}
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-4 top-3.5 w-5 h-5" style={{ color: "var(--muted)" }} />
                <input
                  type="text"
                  placeholder="Search exams..."
                  value={examSearch}
                  onChange={(e) => setExamSearch(e.target.value)}
                  className="w-full pl-12 pr-10 py-3 rounded-lg border-2 focus:outline-none focus:border-indigo-600 placeholder-opacity-50 transition-colors"
                  style={{
                    borderColor: "var(--card-border)",
                    background: "var(--card-bg)",
                    color: "var(--foreground)"
                  }}
                  onMouseEnter={(e) => {
                    if (e.currentTarget !== document.activeElement) {
                      e.currentTarget.style.borderColor = "#818cf8";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (e.currentTarget !== document.activeElement) {
                      e.currentTarget.style.borderColor = "var(--card-border)";
                    }
                  }}
                />
                {examSearch && (
                  <button
                    onClick={() => setExamSearch('')}
                    className="absolute right-3 top-3.5 hover:opacity-70"
                    style={{ color: "var(--muted)" }}
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Filtered Exams */}
            <div>
              {exams.filter(e => e.name.toLowerCase().includes(examSearch.toLowerCase())).length === 0 ? (
                <div className="text-center py-12">
                  <p style={{ color: "var(--muted)" }}>No exams found matching "{examSearch}"</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {exams
                    .filter(e => e.name.toLowerCase().includes(examSearch.toLowerCase()))
                    .map((exam) => (
                      <button
                        key={exam.id}
                        onClick={() => {
                          setSelectedExam(exam.id);
                          setSelectedSubject(null);
                          setExamSearch('');
                          setStep('subject');
                        }}
                        className="p-6 text-left rounded-lg transition-all flex items-start gap-4"
                        style={{
                          background: "var(--card-bg)",
                          borderColor: "var(--card-border)",
                          borderWidth: "2px",
                          borderStyle: "solid"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "#818cf8";
                          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "var(--card-border)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        <div className="flex-shrink-0 mt-1">
                          <ColorfulExamIcon examId={exam.id} size={40} />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold" style={{ color: "var(--foreground)" }}>{exam.name}</p>
                          <p className="text-sm mt-1" style={{ color: "var(--foreground-secondary)" }}>
                            Share materials for {exam.name}
                          </p>
                        </div>
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Select Subject */}
        {step === 'subject' && examName && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 p-4 rounded-lg" style={{ background: "var(--background)", borderColor: "#818cf8", borderWidth: "1px", borderStyle: "solid" }}>
              <CheckCircle className="w-5 h-5 text-indigo-600" />
              <p style={{ color: "var(--foreground)" }}>Selected: <span className="font-semibold">{examName}</span></p>
            </div>

            <h2 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>Select Subject</h2>

            {/* Search Input */}
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-4 top-3.5 w-5 h-5" style={{ color: "var(--muted)" }} />
                <input
                  type="text"
                  placeholder="Search subjects..."
                  value={subjectSearch}
                  onChange={(e) => setSubjectSearch(e.target.value)}
                  className="w-full pl-12 pr-10 py-3 rounded-lg border-2 focus:outline-none focus:border-indigo-600 placeholder-opacity-50 transition-colors"
                  style={{
                    borderColor: "var(--card-border)",
                    background: "var(--card-bg)",
                    color: "var(--foreground)"
                  }}
                  onMouseEnter={(e) => {
                    if (e.currentTarget !== document.activeElement) {
                      e.currentTarget.style.borderColor = "#818cf8";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (e.currentTarget !== document.activeElement) {
                      e.currentTarget.style.borderColor = "var(--card-border)";
                    }
                  }}
                />
                {subjectSearch && (
                  <button
                    onClick={() => setSubjectSearch('')}
                    className="absolute right-3 top-3.5 hover:opacity-70"
                    style={{ color: "var(--muted)" }}
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Filtered Subjects */}
            {subjects.filter(s => s.name.toLowerCase().includes(subjectSearch.toLowerCase())).length === 0 ? (
              <div className="text-center py-12">
                <p style={{ color: "var(--muted)" }}>No subjects found matching "{subjectSearch}"</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {subjects
                  .filter(s => s.name.toLowerCase().includes(subjectSearch.toLowerCase()))
                  .map((subject) => (
                    <button
                      key={subject.id}
                      onClick={() => {
                        setSelectedSubject(subject.id);
                        setSubjectSearch('');
                        setStep('upload');
                      }}
                      className="p-6 text-left rounded-lg transition-all flex items-start gap-4"
                      style={{
                        background: "var(--card-bg)",
                        borderColor: "var(--card-border)",
                        borderWidth: "2px",
                        borderStyle: "solid"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#818cf8";
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "var(--card-border)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <div className="flex-shrink-0 mt-1">
                        <ColorfulCategoryIcon categoryId={subject.id} size={40} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold" style={{ color: "var(--foreground)" }}>{subject.name}</p>
                      </div>
                    </button>
                  ))}
              </div>
            )}

            <button
              onClick={() => {
                setSelectedExam(null);
                setExamSearch('');
                setSubjectSearch('');
                setStep('exam');
              }}
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              ← Change Exam
            </button>
          </div>
        )}

        {/* Step 3: Upload Files */}
        {step === 'upload' && examName && subjectName && (
          <div className="space-y-8">
            <div className="flex items-center gap-4 p-4 rounded-lg" style={{ background: "var(--background)", borderColor: "#818cf8", borderWidth: "1px", borderStyle: "solid" }}>
              <CheckCircle className="w-5 h-5 text-indigo-600 flex-shrink-0" />
              <div>
                <p style={{ color: "var(--foreground)" }}>
                  <span className="font-semibold">{examName}</span> • <span className="font-semibold">{subjectName}</span>
                </p>
              </div>
            </div>

            {/* Status Messages */}
            {uploadStatus === 'success' && (
              <div className="bg-green-50 rounded-lg p-4 flex gap-3" style={{ borderColor: "var(--card-border)", borderWidth: "1px", borderStyle: "solid" }}>
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-green-900">Upload successful!</p>
                  <p className="text-sm text-green-800 mt-1">{uploadMessage}</p>
                </div>
              </div>
            )}

            {uploadStatus === 'error' && (
              <div className="bg-red-50 rounded-lg p-4 flex gap-3" style={{ borderColor: "var(--card-border)", borderWidth: "1px", borderStyle: "solid" }}>
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-900">Upload failed</p>
                  <p className="text-sm text-red-800 mt-1">{uploadMessage}</p>
                </div>
              </div>
            )}

            {/* File Uploader */}
            <StudyMaterialUploader
              onFilesSelected={handleFilesSelected}
              isLoading={isUploading}
              maxFiles={10}
              maxFileSize={50}
              maxBatchSize={200}
            />

            {/* Action Buttons */}
            <div className="flex gap-4 flex-wrap">
              <button
                onClick={handleUpload}
                disabled={isUploading || files.length === 0 || files.some((f) => f.error)}
                className="flex-1 px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Upload Materials
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setStep('subject');
                  setSelectedSubject(null);
                }}
                disabled={isUploading}
                className="px-8 py-3 border-2 rounded-lg font-semibold hover:opacity-80 disabled:opacity-50 transition-colors"
                style={{
                  borderColor: "var(--card-border)",
                  color: "var(--foreground)"
                }}
              >
                ← Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    </AccessibilityWrapper>
  );
}
