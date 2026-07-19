'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useUser } from '@/context/user-context';
import { useSearchParams } from 'next/navigation';
import { getAllExams, getExamById, examCategories } from '@/lib/exams';
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
  const searchParams = useSearchParams();

  const [step, setStep] = useState<Step>('exam');
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<StudyMaterial[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredExams, setFilteredExams] = useState<any[]>([]);
  const [filteredSubjects, setFilteredSubjects] = useState<any[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Memoize these so they don't change on every render
  const exams = useMemo(() => getAllExams(), []);
  const selectedExamObj = useMemo(() => selectedExam ? getExamById(selectedExam) : null, [selectedExam]);
  const subjects = useMemo(() => selectedExamObj?.subjects || [], [selectedExamObj]);

  // Get names
  const examName = useMemo(() => selectedExam
    ? exams.find((e) => e.id === selectedExam)?.name
    : null, [selectedExam, exams]);

  const subjectName = useMemo(() => selectedSubject
    ? subjects.find((s) => s.id === selectedSubject)?.name
    : null, [selectedSubject, subjects]);

  // Auto-select exam from URL parameter or user's current exam
  useEffect(() => {
    if (selectedExam) return; // Already selected

    // Priority 1: URL parameter (from Study Guides button)
    const examIdFromUrl = searchParams.get('examId');
    if (examIdFromUrl) {
      const examExists = exams.find(e => e.id === examIdFromUrl);
      if (examExists) {
        console.log(`✅ Auto-selecting exam from URL: ${examIdFromUrl}`);
        setSelectedExam(examIdFromUrl);
        setStep('subject');
        return;
      }
    }

    // Priority 2: User's current exam (for regular users)
    if (user?.current_exam && user.role !== 'admin' && user.role !== 'contributor') {
      // Map legacy exam IDs to current IDs
      const examIdMap: Record<string, string> = {
        'jee': 'jee-main',
        'neet': 'neet-ug',
        'upsc': 'upsc-cse',
        'ssc': 'ssc-cgl',
        'ibps': 'ibps-po',
        'sbi': 'sbi-po'
      };

      const mappedExamId = examIdMap[user.current_exam] || user.current_exam;
      const examExists = exams.find(e => e.id === mappedExamId);

      if (examExists) {
        console.log(`✅ Auto-selecting user's current exam: ${mappedExamId}`);
        setSelectedExam(mappedExamId);
        setStep('subject');
      }
    }
  }, [user, exams, selectedExam, searchParams]);

  // Handle click outside to close search results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Unified search logic for exams and subjects
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;

    const query = searchQuery.toLowerCase();
    const results: Array<{
      type: "exam" | "subject";
      exam: any;
      subject?: { id: string; name: string; icon: string };
      category: string;
    }> = [];

    examCategories.forEach((category) => {
      category.exams.forEach((exam) => {
        // Check exam name
        if (exam.name.toLowerCase().includes(query) ||
            exam.fullName.toLowerCase().includes(query) ||
            exam.description.toLowerCase().includes(query)) {
          results.push({
            type: "exam",
            exam,
            category: category.name,
          });
        }

        // Check subjects
        exam.subjects.forEach((subject) => {
          if (subject.name.toLowerCase().includes(query)) {
            results.push({
              type: "subject",
              exam,
              subject: { id: subject.id, name: subject.name, icon: subject.icon },
              category: category.name,
            });
          }
        });
      });
    });

    return results.slice(0, 10); // Limit to 10 results
  }, [searchQuery]);

  const handleSearchSelect = (result: any) => {
    if (result.type === "subject" && result.subject) {
      // Auto-fill exam and subject
      setSelectedExam(result.exam.id);
      setSelectedSubject(result.subject.id);
      setStep('materials');
      setSearchQuery('');
      setShowSearchDropdown(false);
    } else if (result.type === "exam") {
      // Auto-fill exam
      setSelectedExam(result.exam.id);
      setSelectedSubject(null);
      setStep('subject');
      setSearchQuery('');
      setShowSearchDropdown(false);
    }
  };

  // Fetch materials when exam and subject are selected
  useEffect(() => {
    if (selectedExam && selectedSubject && step === 'materials') {
      let isMounted = true;
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
          if (isMounted) {
            setMaterials(data.data || []);
            setSearchQuery('');
          }
        } catch (err) {
          if (isMounted) {
            setError(
              err instanceof Error ? err.message : 'Failed to load materials'
            );
          }
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      };

      fetchMaterials();
      return () => {
        isMounted = false;
      };
    }
  }, [selectedExam, selectedSubject, step]);

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
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="mb-6 flex items-center gap-2 text-sm font-medium transition-colors hover:gap-3"
          style={{ color: "var(--muted)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--muted)";
          }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold" style={{ color: "var(--foreground)" }}>
            Study Materials
          </h1>
          <p style={{ color: "var(--muted)" }}>
            Download resources shared by contributors
          </p>
        </div>

        {/* Unified Search Bar - Always Visible */}
        <div ref={searchContainerRef} className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Quick search: exams, subjects..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={(e) => {
                setShowSearchDropdown(true);
                e.currentTarget.style.borderColor = '#E76F51';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(231, 111, 81, 0.2)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--card-border)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              className="w-full px-6 py-3 rounded-xl border-2 focus:outline-none text-base"
              style={{ background: "var(--card-bg)", color: "var(--foreground)", borderColor: "var(--card-border)" }}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 p-2" style={{ color: "var(--muted)" }}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Search Results Dropdown */}
          {showSearchDropdown && searchQuery.trim() && searchResults && searchResults.length > 0 && (
            <div className="mt-3 rounded-xl shadow-lg border-2 overflow-hidden" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
              <div className="p-3 border-b" style={{ borderColor: "var(--card-border)", background: "var(--hover-bg)" }}>
                <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                  Found {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {searchResults.map((result, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearchSelect(result)}
                    className="w-full px-4 py-3 transition-colors text-left border-b last:border-b-0 cursor-pointer"
                    style={{ borderColor: "var(--card-border)" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--hover-bg)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        <ColorfulExamIcon
                          examId={result.exam.id}
                          size={36}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold" style={{ color: "var(--foreground)" }}>{result.exam.name}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--primary-bg)", color: "var(--primary)" }}>
                            {result.category}
                          </span>
                        </div>
                        {result.type === "exam" && (
                          <p className="text-sm" style={{ color: "var(--foreground-secondary)" }}>Full exam</p>
                        )}
                        {result.type === "subject" && result.subject && (
                          <p className="text-sm" style={{ color: "var(--foreground-secondary)" }}>
                            <span className="font-medium">{result.subject.name}</span>
                          </p>
                        )}
                      </div>
                      <svg className="w-5 h-5 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "var(--muted)" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {showSearchDropdown && searchQuery.trim() && searchResults && searchResults.length === 0 && (
            <div className="mt-3 rounded-xl shadow-lg border-2 p-6 text-center" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
              <div className="flex justify-center mb-2">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "var(--muted)" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="font-semibold mb-1" style={{ color: "var(--foreground)" }}>No results found</p>
              <p className="text-sm" style={{ color: "var(--foreground-secondary)" }}>Try searching for JEE, NEET, UPSC, SSC, Physics, etc.</p>
            </div>
          )}
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-8 justify-center flex-wrap">
          <div className={`flex items-center gap-2 ${step !== 'exam' ? 'opacity-60' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
              step === 'exam' ? 'bg-[#E76F51]' : 'bg-slate-300'
            }`}>
              1
            </div>
            <span className="font-medium text-sm" style={{ color: "var(--foreground-secondary)" }}>Select Exam</span>
          </div>
          <ChevronRight className="w-5 h-5" style={{ color: "var(--card-border)" }} />
          <div className={`flex items-center gap-2 ${step !== 'subject' ? 'opacity-60' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
              step === 'subject' ? 'bg-[#E76F51]' : 'bg-slate-300'
            }`}>
              2
            </div>
            <span className="font-medium text-sm" style={{ color: "var(--foreground-secondary)" }}>Select Subject</span>
          </div>
          <ChevronRight className="w-5 h-5" style={{ color: "var(--card-border)" }} />
          <div className={`flex items-center gap-2 ${step !== 'materials' ? 'opacity-60' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
              step === 'materials' ? 'bg-[#E76F51]' : 'bg-slate-300'
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
              {(filteredExams.length > 0 ? filteredExams : exams).map((exam) => (
                <button
                  key={exam.id}
                  onClick={() => {
                    setSelectedExam(exam.id);
                    setSelectedSubject(null);
                    setStep('subject');
                  }}
                  className="p-5 text-left rounded-xl border transition-all cursor-pointer flex items-center gap-4"
                  style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", borderWidth: "1px", borderStyle: "solid" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                    e.currentTarget.style.borderColor = "#E76F51";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor = "var(--card-border)";
                  }}
                >
                  <div className="flex-shrink-0">
                    <ColorfulExamIcon examId={exam.id} size={56} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold" style={{ color: "var(--foreground)" }}>{exam.name}</p>
                    <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
                      {exam.subjects.length} subjects
                    </p>
                  </div>
                </button>
              ))}
            </div>
            {searchQuery.trim() && filteredExams.length === 0 && (
              <div className="text-center py-8">
                <p style={{ color: "var(--muted)" }}>No exams found matching "{searchQuery}"</p>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Select Subject */}
        {step === 'subject' && examName && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: "rgba(231, 111, 81, 0.1)", borderLeft: "4px solid #E76F51" }}>
              <FileText className="w-6 h-6 flex-shrink-0" style={{ color: "#E76F51" }} />
              <p style={{ color: "var(--foreground)" }}>
                Selected: <span className="font-semibold">{examName}</span>
              </p>
            </div>

            <h2 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>Select Subject</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(filteredSubjects.length > 0 ? filteredSubjects : subjects).map((subject) => (
                <button
                  key={subject.id}
                  onClick={() => {
                    setSelectedSubject(subject.id);
                    setStep('materials');
                  }}
                  className="p-5 text-left rounded-xl border transition-all cursor-pointer flex items-center gap-4"
                  style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", borderWidth: "1px", borderStyle: "solid" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                    e.currentTarget.style.borderColor = "#E76F51";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor = "var(--card-border)";
                  }}
                >
                  <div className="flex-shrink-0">
                    <ColorfulSubjectIcon subjectId={subject.id} size={56} />
                  </div>
                  <p className="font-semibold" style={{ color: "var(--foreground)" }}>{subject.name}</p>
                </button>
              ))}
            </div>

            {searchQuery.trim() && filteredSubjects.length === 0 && (
              <div className="text-center py-8">
                <p style={{ color: "var(--muted)" }}>No subjects found matching "{searchQuery}"</p>
              </div>
            )}

            <button
              onClick={() => {
                setSelectedExam(null);
                setStep('exam');
                setSearchQuery('');
              }}
              className="font-medium"
              style={{ color: "#E76F51" }}
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
            <input
              type="text"
              placeholder="Search materials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-3 rounded-xl border transition-colors text-base"
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
                  <Loader className="w-8 h-8 animate-spin" style={{ color: "#E76F51" }} />
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
                    className="rounded-xl p-7 border transition-all"
                    style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", borderWidth: "1px", borderStyle: "solid" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                      e.currentTarget.style.borderColor = "#E76F51";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.borderColor = "var(--card-border)";
                    }}
                  >
                    <div className="flex flex-col md:flex-row md:items-start gap-5">
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-4">
                          <div className="px-3 py-2 rounded font-bold flex-shrink-0" style={{ background: "rgba(231, 111, 81, 0.1)", color: "#E76F51" }}>
                            {getFileIcon(material.file_type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg truncate" style={{ color: "var(--foreground)" }}>
                              {material.title}
                            </h3>
                            {material.description && (
                              <p className="text-sm mt-2 line-clamp-2" style={{ color: "var(--muted)" }}>
                                {material.description}
                              </p>
                            )}

                            {/* Stats */}
                            <div className="flex flex-wrap gap-5 mt-4 text-sm" style={{ color: "var(--muted)" }}>
                              <div className="flex items-center gap-2">
                                <HardDrive className="w-5 h-5" />
                                {getFileSizeFormatted(material.file_size)}
                              </div>
                              <div className="flex items-center gap-2">
                                <Download className="w-5 h-5" />
                                {material.download_count} download
                                {material.download_count !== 1 ? 's' : ''}
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                {formatDate(material.created_at)}
                              </div>
                            </div>

                            {/* Contributor */}
                            <p className="text-sm mt-3" style={{ color: "var(--card-border)" }}>
                              By <span className="font-medium" style={{ color: "var(--foreground-secondary)" }}>{material.contributor_name}</span>
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Download Button */}
                      <button
                        onClick={() => handleDownload(material.id)}
                        disabled={downloadingIds.has(material.id)}
                        className="px-7 py-3 text-white rounded-lg font-medium flex items-center gap-2 transition-all flex-shrink-0 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ backgroundColor: downloadingIds.has(material.id) ? "#9ca3af" : "#E76F51" }}
                        onMouseEnter={(e) => {
                          if (!downloadingIds.has(material.id)) {
                            e.currentTarget.style.backgroundColor = "#d96043";
                            e.currentTarget.style.transform = "scale(1.02)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#E76F51";
                          e.currentTarget.style.transform = "scale(1)";
                        }}
                      >
                        {downloadingIds.has(material.id) ? (
                          <>
                            <Loader className="w-5 h-5 animate-spin" />
                            Downloading...
                          </>
                        ) : (
                          <>
                            <Download className="w-5 h-5" />
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
              style={{ color: "#E76F51" }}
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
