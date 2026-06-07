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
  Search,
  Library,
} from 'lucide-react';
import { AccessibilityWrapper } from '@/components/accessibility-wrapper';
import { ColorfulExamIcon, ColorfulSubjectIcon } from '@/lib/colorful-exam-icons';

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
  const [filteredMaterials, setFilteredMaterials] = useState<StudyMaterial[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

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

  // Filter materials based on search query
  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      setFilteredMaterials(
        materials.filter((m) =>
          m.title.toLowerCase().includes(query) ||
          m.description.toLowerCase().includes(query) ||
          m.contributor_name.toLowerCase().includes(query)
        )
      );
    } else {
      setFilteredMaterials(materials);
    }
  }, [searchQuery, materials]);

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
      setSearchQuery('');
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
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Library className="w-8 h-8" style={{ color: '#4255FF' }} />
            <h1 className="text-3xl font-bold" style={{ color: "var(--foreground)" }}>
              Study Materials
            </h1>
          </div>
          <p style={{ color: "var(--muted)" }}>
            Download resources shared by contributors
          </p>
        </div>

        {/* Search Bar - Always Visible */}
        {(step === 'exam' || step === 'subject') && (
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "var(--muted)" }} />
              <input
                type="text"
                placeholder="🔍 Quick search materials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border transition-colors"
                style={{
                  background: "var(--card-bg)",
                  borderColor: "var(--card-border)",
                  borderWidth: "1px",
                  borderStyle: "solid",
                  color: "var(--foreground)"
                }}
                onFocus={(e) => (e.target.style.borderColor = "#4255FF")}
                onBlur={(e) => (e.target.style.borderColor = "var(--card-border)")}
              />
            </div>
          </div>
        )}

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-8 justify-center flex-wrap">
          <div className={`flex items-center gap-2 ${step !== 'exam' ? 'opacity-60' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
              step === 'exam' ? 'bg-[#4255FF]' : 'bg-slate-300'
            }`}>
              1
            </div>
            <span className="font-medium text-sm" style={{ color: "var(--foreground-secondary)" }}>Select Exam</span>
          </div>
          <ChevronRight className="w-5 h-5" style={{ color: "var(--card-border)" }} />
          <div className={`flex items-center gap-2 ${step !== 'subject' ? 'opacity-60' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
              step === 'subject' ? 'bg-[#4255FF]' : 'bg-slate-300'
            }`}>
              2
            </div>
            <span className="font-medium text-sm" style={{ color: "var(--foreground-secondary)" }}>Select Subject</span>
          </div>
          <ChevronRight className="w-5 h-5" style={{ color: "var(--card-border)" }} />
          <div className={`flex items-center gap-2 ${step !== 'materials' ? 'opacity-60' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
              step === 'materials' ? 'bg-[#4255FF]' : 'bg-slate-300'
            }`}>
              3
            </div>
            <span className="font-medium text-sm" style={{ color: "var(--foreground-secondary)" }}>Browse</span>
          </div>
        </div>

        {/* Step 1: Select Exam */}
        {step === 'exam' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>Select Exam</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {exams.map((exam) => (
                <button
                  key={exam.id}
                  onClick={() => {
                    setSelectedExam(exam.id);
                    setSelectedSubject(null);
                    setStep('subject');
                  }}
                  className="p-6 text-left rounded-xl border transition-all cursor-pointer"
                  style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", borderWidth: "1px", borderStyle: "solid" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.1)";
                    e.currentTarget.style.borderColor = "#4255FF";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor = "var(--card-border)";
                  }}
                >
                  <div className="mb-4 flex justify-center">
                    <ColorfulExamIcon examId={exam.id} size={56} />
                  </div>
                  <p className="font-semibold" style={{ color: "var(--foreground)" }}>{exam.name}</p>
                  <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
                    {exam.subjects.length} subjects
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Select Subject */}
        {step === 'subject' && examName && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: "rgba(66, 85, 255, 0.1)", borderLeft: "4px solid #4255FF" }}>
              <FileText className="w-5 h-5 flex-shrink-0" style={{ color: "#4255FF" }} />
              <p style={{ color: "var(--foreground)" }}>
                Selected: <span className="font-semibold">{examName}</span>
              </p>
            </div>

            <h2 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>Select Subject</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjects.map((subject) => (
                <button
                  key={subject.id}
                  onClick={() => {
                    setSelectedSubject(subject.id);
                    setStep('materials');
                  }}
                  className="p-6 text-left rounded-xl border transition-all cursor-pointer"
                  style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", borderWidth: "1px", borderStyle: "solid" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.1)";
                    e.currentTarget.style.borderColor = "#4255FF";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor = "var(--card-border)";
                  }}
                >
                  <div className="mb-4 flex justify-center">
                    <ColorfulSubjectIcon subjectId={subject.id} size={56} />
                  </div>
                  <p className="font-semibold" style={{ color: "var(--foreground)" }}>{subject.name}</p>
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setSelectedExam(null);
                setStep('exam');
              }}
              className="font-medium"
              style={{ color: "#4255FF" }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              ← Change Exam
            </button>
          </div>
        )}

        {/* Step 3: Browse Materials */}
        {step === 'materials' && examName && subjectName && (
          <div className="space-y-8">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: "rgba(66, 85, 255, 0.1)", borderLeft: "4px solid #4255FF" }}>
              <FileText className="w-5 h-5 flex-shrink-0" style={{ color: "#4255FF" }} />
              <p style={{ color: "var(--foreground)" }}>
                <span className="font-semibold">{examName}</span> • <span className="font-semibold">{subjectName}</span>
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "var(--muted)" }} />
              <input
                type="text"
                placeholder="Search materials by title, description, or contributor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border transition-colors"
                style={{
                  background: "var(--card-bg)",
                  borderColor: "var(--card-border)",
                  borderWidth: "1px",
                  borderStyle: "solid",
                  color: "var(--foreground)"
                }}
                onFocus={(e) => (e.target.style.borderColor = "#4255FF")}
                onBlur={(e) => (e.target.style.borderColor = "var(--card-border)")}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-xl p-4 flex gap-3 border-l-4" style={{ background: "rgba(220, 38, 38, 0.1)", borderLeftColor: "#dc2626" }}>
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#dc2626" }} />
                <p style={{ color: "#dc2626" }}>{error}</p>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <Loader className="w-8 h-8 animate-spin" style={{ color: "#4255FF" }} />
                  <p style={{ color: "var(--muted)" }}>Loading materials...</p>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && materials.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 mx-auto mb-3" style={{ color: "var(--card-border)" }} />
                <p className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
                  No materials yet
                </p>
                <p style={{ color: "var(--muted)" }} className="mt-2">
                  Check back soon for study materials from contributors
                </p>
              </div>
            )}

            {/* No Search Results */}
            {!isLoading && materials.length > 0 && filteredMaterials.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-12 h-12 mx-auto mb-3" style={{ color: "var(--card-border)" }} />
                <p className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
                  No materials found
                </p>
                <p style={{ color: "var(--muted)" }} className="mt-2">
                  Try adjusting your search terms
                </p>
              </div>
            )}

            {/* Materials List */}
            {!isLoading && filteredMaterials.length > 0 && (
              <div className="space-y-4">
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  Found {filteredMaterials.length} material{filteredMaterials.length !== 1 ? 's' : ''}
                </p>

                {filteredMaterials.map((material) => (
                  <div
                    key={material.id}
                    className="rounded-xl p-6 border transition-all"
                    style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", borderWidth: "1px", borderStyle: "solid" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                      e.currentTarget.style.borderColor = "#4255FF";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.borderColor = "var(--card-border)";
                    }}
                  >
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3">
                          <div className="px-2 py-1 rounded text-xs font-bold flex-shrink-0" style={{ background: "rgba(66, 85, 255, 0.1)", color: "#4255FF" }}>
                            {getFileIcon(material.file_type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate" style={{ color: "var(--foreground)" }}>
                              {material.title}
                            </h3>
                            {material.description && (
                              <p className="text-sm mt-1 line-clamp-2" style={{ color: "var(--muted)" }}>
                                {material.description}
                              </p>
                            )}

                            {/* Stats */}
                            <div className="flex flex-wrap gap-4 mt-3 text-xs" style={{ color: "var(--muted)" }}>
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
                            <p className="text-xs mt-2" style={{ color: "var(--card-border)" }}>
                              By <span className="font-medium" style={{ color: "var(--foreground-secondary)" }}>{material.contributor_name}</span>
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Download Button */}
                      <button
                        onClick={() => handleDownload(material.id)}
                        disabled={downloadingIds.has(material.id)}
                        className="px-6 py-2 text-white rounded-lg font-medium flex items-center gap-2 transition-all flex-shrink-0 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ backgroundColor: downloadingIds.has(material.id) ? "#9ca3af" : "#4255FF" }}
                        onMouseEnter={(e) => {
                          if (!downloadingIds.has(material.id)) {
                            e.currentTarget.style.backgroundColor = "#3242CC";
                            e.currentTarget.style.transform = "scale(1.02)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#4255FF";
                          e.currentTarget.style.transform = "scale(1)";
                        }}
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
              className="font-medium"
              style={{ color: "#4255FF" }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              ← Change Subject
            </button>
          </div>
        )}
      </div>
    </AccessibilityWrapper>
  );
}
