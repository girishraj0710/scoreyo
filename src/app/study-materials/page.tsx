'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/context/user-context';
import { getAllExams, getExamById } from '@/lib/exams';
import {
  Download,
  ChevronRight,
  FileText,
  Calendar,
  HardDrive,
  BarChart3,
  AlertCircle,
  Loader,
} from 'lucide-react';
import { AccessibilityWrapper } from '@/components/accessibility-wrapper';

interface StudyMaterial {
  id: string;
  title: string;
  description: string;
  file_type: string;
  file_size: number;
  download_count: number;
  created_at: string;
  contributor_name: string;
}

type Step = 'exam' | 'subject' | 'materials';

export default function StudyMaterialsPage() {
  const { user } = useUser();

  const [step, setStep] = useState<Step>('exam');
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set());

  const exams = getAllExams();
  const selectedExamObj = selectedExam ? getExamById(selectedExam) : null;
  const subjects = selectedExamObj?.subjects || [];

  // Get names
  const examName = selectedExam
    ? exams.find((e) => e.id === selectedExam)?.name
    : null;

  const subjectName = selectedSubject
    ? subjects.find((s) => s.id === selectedSubject)?.name
    : null;

  // Fetch materials when exam and subject are selected
  useEffect(() => {
    if (selectedExam && selectedSubject && step === 'materials') {
      fetchMaterials();
    }
  }, [selectedExam, selectedSubject, step]);

  const fetchMaterials = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await fetch(
        `/api/study-materials?examId=${selectedExam}&subjectId=${selectedSubject}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch materials');
      }

      const data = await response.json();
      setMaterials(data.data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load materials'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (materialId: string) => {
    setDownloadingIds((prev) => new Set([...prev, materialId]));
    window.location.href = `/api/study-materials/${materialId}/download`;

    // Clear downloading state after 1 second
    setTimeout(() => {
      setDownloadingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(materialId);
        return newSet;
      });
    }, 1000);
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return 'PDF';
      case 'docx':
        return 'DOCX';
      case 'ppt':
        return 'PPT';
      default:
        return 'FILE';
    }
  };

  const getFileSizeFormatted = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(1) + 'MB';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <AccessibilityWrapper>
      <div className="min-h-screen bg-white pt-8 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Study Materials
          </h1>
          <p className="text-lg text-slate-600">
            Download resources shared by contributors
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-12">
          <div className={`flex items-center gap-2 ${step !== 'exam' ? 'opacity-60' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
              step === 'exam' ? 'bg-indigo-600' : 'bg-slate-300'
            }`}>
              1
            </div>
            <span className="font-medium text-slate-700">Select Exam</span>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-300" />
          <div className={`flex items-center gap-2 ${step !== 'subject' ? 'opacity-60' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
              step === 'subject' ? 'bg-indigo-600' : 'bg-slate-300'
            }`}>
              2
            </div>
            <span className="font-medium text-slate-700">Select Subject</span>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-300" />
          <div className={`flex items-center gap-2 ${step !== 'materials' ? 'opacity-60' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
              step === 'materials' ? 'bg-indigo-600' : 'bg-slate-300'
            }`}>
              3
            </div>
            <span className="font-medium text-slate-700">Browse Materials</span>
          </div>
        </div>

        {/* Step 1: Select Exam */}
        {step === 'exam' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Select Exam</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {exams.map((exam) => (
                <button
                  key={exam.id}
                  onClick={() => {
                    setSelectedExam(exam.id);
                    setSelectedSubject(null);
                    setStep('subject');
                  }}
                  className="p-6 text-left border-2 border-slate-200 rounded-lg hover:border-indigo-400 hover:shadow-md transition-all"
                >
                  <p className="font-semibold text-slate-900">{exam.name}</p>
                  <p className="text-sm text-slate-600 mt-1">
                    Browse materials for {exam.name}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Select Subject */}
        {step === 'subject' && examName && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 p-4 bg-indigo-50 rounded-lg">
              <FileText className="w-5 h-5 text-indigo-600" />
              <p className="text-slate-700">
                Selected: <span className="font-semibold">{examName}</span>
              </p>
            </div>

            <h2 className="text-2xl font-bold text-slate-900">Select Subject</h2>

            <div className="grid md:grid-cols-2 gap-4">
              {subjects.map((subject) => (
                <button
                  key={subject.id}
                  onClick={() => {
                    setSelectedSubject(subject.id);
                    setStep('materials');
                  }}
                  className="p-6 text-left border-2 border-slate-200 rounded-lg hover:border-indigo-400 hover:shadow-md transition-all"
                >
                  <p className="font-semibold text-slate-900">{subject.name}</p>
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setSelectedExam(null);
                setStep('exam');
              }}
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              ← Change Exam
            </button>
          </div>
        )}

        {/* Step 3: Browse Materials */}
        {step === 'materials' && examName && subjectName && (
          <div className="space-y-8">
            <div className="flex items-center gap-4 p-4 bg-indigo-50 rounded-lg">
              <FileText className="w-5 h-5 text-indigo-600 flex-shrink-0" />
              <div>
                <p className="text-slate-700">
                  <span className="font-semibold">{examName}</span> • <span className="font-semibold">{subjectName}</span>
                </p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <Loader className="w-8 h-8 text-indigo-600 animate-spin" />
                  <p className="text-slate-600">Loading materials...</p>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && materials.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-lg font-semibold text-slate-900">
                  No materials yet
                </p>
                <p className="text-slate-600 mt-2">
                  Check back soon for study materials from contributors
                </p>
              </div>
            )}

            {/* Materials List */}
            {!isLoading && materials.length > 0 && (
              <div className="space-y-4">
                <p className="text-sm text-slate-600">
                  Found {materials.length} material{materials.length !== 1 ? 's' : ''}
                </p>

                {materials.map((material) => (
                  <div
                    key={material.id}
                    className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3">
                          <div className="px-2 py-1 bg-slate-100 rounded text-xs font-bold text-slate-600 flex-shrink-0">
                            {getFileIcon(material.file_type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-slate-900 truncate">
                              {material.title}
                            </h3>
                            {material.description && (
                              <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                                {material.description}
                              </p>
                            )}

                            {/* Stats */}
                            <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-600">
                              <div className="flex items-center gap-1">
                                <HardDrive className="w-4 h-4" />
                                {getFileSizeFormatted(material.file_size)}
                              </div>
                              <div className="flex items-center gap-1">
                                <Download className="w-4 h-4" />
                                {material.download_count} download
                                {material.download_count !== 1 ? 's' : ''}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {formatDate(material.created_at)}
                              </div>
                            </div>

                            {/* Contributor */}
                            <p className="text-xs text-slate-500 mt-2">
                              By <span className="font-medium">{material.contributor_name}</span>
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Download Button */}
                      <button
                        onClick={() => handleDownload(material.id)}
                        disabled={downloadingIds.has(material.id)}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center gap-2 transition-colors flex-shrink-0 whitespace-nowrap"
                      >
                        {downloadingIds.has(material.id) ? (
                          <>
                            <Loader className="w-4 h-4 animate-spin" />
                            Downloading...
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4" />
                            Download
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => {
                setStep('subject');
                setSelectedSubject(null);
              }}
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              ← Change Subject
            </button>
          </div>
        )}
      </div>
    </div>
    </AccessibilityWrapper>
  );
}
