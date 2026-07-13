"use client";

import { useState, useEffect, useMemo } from "react";
import { useUser } from "@/context/user-context";
import { useRouter } from "next/navigation";
import { useFilteredExams } from "@/hooks/use-exam-filter";
import {
  Search,
  BookOpen,
  Clock,
  BarChart3,
  ChevronRight,
  CheckCircle2,
  Zap,
  RotateCcw,
  ChevronDown,
  Target,
  Brain,
  TrendingUp,
  Lightbulb,
  List,
  Award
} from "lucide-react";
import { motion } from "framer-motion";
import { ContentRenderer } from "@/components/study-guides/ContentRenderer";

// Popular exam quick filters
const EXAM_FILTERS = [
  { id: "upsc-cse", name: "UPSC", category: "civil-services" },
  { id: "jee-main", name: "JEE", category: "engineering" },
  { id: "neet-ug", name: "NEET", category: "medical" },
  { id: "cat", name: "CAT", category: "management" },
  { id: "ssc-cgl", name: "SSC & Banking", category: "government" },
  { id: "gate", name: "GATE", category: "engineering" },
  { id: "clat", name: "CLAT", category: "law" },
];

// Types from dimensional model API
interface Topic {
  id: number;
  name: string;
  category?: string;
  scope?: string;
  description?: string;
  isMandatory?: boolean;
  weightage?: number;
}

interface Subject {
  id: string;
  name: string;
  category?: string;
  topicCount: number;
  mandatoryCount?: number;
  topics: Topic[];
}

interface Exam {
  id: string;
  name: string;
  fullName: string;
  category: string;
  conductingBody?: string;
  subjectCount: number;
  topicCount: number;
  subjects: Subject[];
}

interface TopicContent {
  title: string;
  overview?: string;
  content: {
    sections: Array<{
      title: string;
      content: Array<any>;
    }>;
  };
  difficulty_level?: string;
  estimated_time_minutes?: number;
}

export default function StudyGuidesPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  // State management
  const [exams, setExams] = useState<Exam[]>([]);
  const [examsLoading, setExamsLoading] = useState(true);

  // Single-exam-focus: Filter exams by enrolled exams
  const filteredExams = useFilteredExams(exams);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<{
    examId: string;
    subjectId: string;
    subjectName: string;
    topicName: string;
  } | null>(null);
  const [topicContent, setTopicContent] = useState<TopicContent | null>(null);
  const [isContentLoading, setIsContentLoading] = useState(false);
  const [activeTOCSection, setActiveTOCSection] = useState<string>("");
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(new Set());

  // Topics lazy loading state
  const [subjectTopics, setSubjectTopics] = useState<Record<string, Topic[]>>({});
  const [loadingTopics, setLoadingTopics] = useState<Set<string>>(new Set());

  // Time tracking
  const [readingSessionId, setReadingSessionId] = useState<number | null>(null);
  const [sectionsViewed, setSectionsViewed] = useState(new Set<string>());

  // Auth check
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth");
    }
  }, [user, isLoading, router]);

  // Fetch exams from dimensional model on mount
  useEffect(() => {
    const fetchExams = async () => {
      try {
        console.log('📚 Fetching exams from dimensional model...');
        const response = await fetch('/api/study-guides/exams');
        const data = await response.json();

        if (data.success) {
          console.log(`✅ Loaded ${data.exams.length} exams from dimensional model`);
          setExams(data.exams);
        } else {
          console.error('❌ Failed to fetch exams:', data.error);
        }
      } catch (error) {
        console.error('❌ Error fetching exams:', error);
      } finally {
        setExamsLoading(false);
      }
    };

    fetchExams();
  }, []);

  // Get selected exam
  const selectedExam = exams.find(exam => exam.id === selectedExamId);

  // Get subjects for selected exam
  const subjects = useMemo(() => {
    if (!selectedExam) return [];
    return selectedExam.subjects;
  }, [selectedExam]);

  // Lazy load topics when subject is expanded
  const handleSubjectExpand = async (subjectId: string, subjectName: string) => {
    if (!selectedExamId) return;

    const key = `${selectedExamId}-${subjectId}`;

    // Check if already loaded
    if (subjectTopics[key]) {
      return; // Already have topics
    }

    // Check if currently loading
    if (loadingTopics.has(key)) {
      return;
    }

    setLoadingTopics(prev => new Set(prev).add(key));

    try {
      console.log(`📚 Loading topics for ${subjectName}...`);
      const response = await fetch(
        `/api/study-guides/topics?exam=${selectedExamId}&subject=${subjectId}`
      );
      const data = await response.json();

      if (data.success) {
        console.log(`✅ Loaded ${data.topics.length} topics for ${subjectName}`);
        setSubjectTopics(prev => ({
          ...prev,
          [key]: data.topics
        }));
      } else {
        console.error('❌ Failed to fetch topics:', data.error);
      }
    } catch (error) {
      console.error('❌ Error fetching topics:', error);
    } finally {
      setLoadingTopics(prev => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
    }
  };

  // Toggle subject expansion
  const toggleSubject = async (subjectId: string, subjectName: string) => {
    const isExpanding = !expandedSubjects.has(subjectId);

    setExpandedSubjects(prev => {
      const newSet = new Set(prev);
      if (newSet.has(subjectId)) {
        newSet.delete(subjectId);
      } else {
        newSet.add(subjectId);
      }
      return newSet;
    });

    // Load topics when expanding
    if (isExpanding) {
      await handleSubjectExpand(subjectId, subjectName);
    }
  };

  // Handle topic selection
  const handleTopicSelect = async (
    examId: string,
    subjectId: string,
    subjectName: string,
    topicName: string
  ) => {
    setSelectedTopic({ examId, subjectId, subjectName, topicName });
    setIsContentLoading(true);
    setActiveTOCSection("");

    try {
      const response = await fetch(
        `/api/study-content?exam=${examId}&subject=${subjectId}&topic=${encodeURIComponent(topicName)}`
      );

      if (response.ok) {
        const data = await response.json();
        setTopicContent(data.material || data);

        // Start time tracking session
        try {
          const sessionRes = await fetch('/api/study/start-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              subjectId,
              topicId: topicName,
              pathId: examId
            })
          });
          if (sessionRes.ok) {
            const sessionData = await sessionRes.json();
            setReadingSessionId(sessionData.sessionId);
            setSectionsViewed(new Set());
          }
        } catch {
          // Time tracking is optional
        }
      } else {
        // Fallback content for topics without database entries
        setTopicContent({
          title: topicName,
          overview: `Comprehensive study material for ${topicName}.`,
          content: {
            sections: [
              {
                title: "Overview",
                content: [
                  {
                    type: "paragraph",
                    text: `Deep dive material for ${topicName} is being crafted by our subject matter experts.`
                  },
                  {
                    type: "note",
                    text: "This content is currently under development. In the meantime, you can practice with quizzes and review flashcards.",
                    variant: "info"
                  }
                ]
              }
            ]
          },
          difficulty_level: "intermediate",
          estimated_time_minutes: 30
        });
      }
    } catch (error) {
      console.error("Failed to fetch topic content:", error);
      setTopicContent(null);
    } finally {
      setIsContentLoading(false);
    }
  };

  // Track section views
  useEffect(() => {
    if (activeTOCSection) {
      setSectionsViewed(prev => new Set([...prev, activeTOCSection]));
    }
  }, [activeTOCSection]);

  // End reading session on unmount
  useEffect(() => {
    return () => {
      if (readingSessionId && sectionsViewed.size > 0 && topicContent) {
        const totalSections = topicContent.content?.sections?.length || 1;
        const completionPct = Math.round((sectionsViewed.size / totalSections) * 100);

        fetch('/api/study/end-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: readingSessionId,
            sectionsRead: sectionsViewed.size,
            completionPercentage: completionPct
          }),
          keepalive: true
        }).catch(() => {});
      }
    };
  }, [readingSessionId, sectionsViewed, topicContent]);

  // Handle exam change
  const handleExamChange = (examId: string) => {
    // End previous session
    if (readingSessionId && sectionsViewed.size > 0 && topicContent) {
      const totalSections = topicContent.content?.sections?.length || 1;
      const completionPct = Math.round((sectionsViewed.size / totalSections) * 100);

      fetch('/api/study/end-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: readingSessionId,
          sectionsRead: sectionsViewed.size,
          completionPercentage: completionPct
        })
      }).catch(() => {});
    }

    setSelectedExamId(examId);
    setSelectedTopic(null);
    setTopicContent(null);
    setReadingSessionId(null);
    setSectionsViewed(new Set());
    setExpandedSubjects(new Set());
    setSubjectTopics({}); // Clear loaded topics
  };

  // Generate Table of Contents
  const tableOfContents = useMemo(() => {
    if (!topicContent) return [];
    return topicContent.content.sections.map((section, idx) => ({
      id: `section-${idx}`,
      title: section.title,
    }));
  }, [topicContent]);

  // Scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveTOCSection(sectionId);
    }
  };

  if (isLoading || examsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5] dark:bg-slate-950">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#F26A4B]/20 border-t-[#F26A4B] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-slate-600 dark:text-slate-400">Loading study guides...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-slate-950">
      {/* Top Header - Sticky */}
      <div className="sticky top-0 md:top-[96px] z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="px-6 py-4">
          {/* Breadcrumb & Title */}
          <div className="mb-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1" style={{ letterSpacing: '0.2em' }}>
              <BookOpen className="w-4 h-4" />
              <span>Study Guides</span>
            </div>
            <h1 className="font-heading text-2xl font-bold text-[#16213E] dark:text-white">
              {selectedExam?.fullName || "Select an Exam"}
            </h1>
          </div>

          {/* Exam Filters */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1">
              {EXAM_FILTERS.filter(exam =>
                filteredExams.some(e => e.id === exam.id)
              ).map((exam) => (
                <button
                  key={exam.id}
                  onClick={() => handleExamChange(exam.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                    selectedExamId === exam.id
                      ? "bg-[#F26A4B] text-white shadow-md"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {exam.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Three-Panel Layout */}
      <div className="flex gap-0 h-[calc(100vh-140px)]">
        {/* LEFT SIDEBAR - Subjects */}
        {selectedExamId && (
          <aside className="w-[280px] flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-y-auto">
            <div className="p-4">
              <div className="mb-4">
                <p className="text-[10px] font-bold uppercase text-[#F26A4B] mb-1" style={{ letterSpacing: '0.2em' }}>
                  SYLLABUS
                </p>
                <h2 className="text-xl font-heading font-black text-[#16213E] dark:text-white">
                  {selectedExam?.name || "Select Exam"}
                </h2>
              </div>

              <nav className="space-y-2">
                {subjects.map((subject) => {
                  const isExpanded = expandedSubjects.has(subject.id);
                  const key = `${selectedExamId}-${subject.id}`;
                  const topics = subjectTopics[key] || [];
                  const isLoadingTopics = loadingTopics.has(key);

                  return (
                    <div key={subject.id} className="border-b border-slate-200 dark:border-slate-800 last:border-b-0">
                      <button
                        onClick={() => toggleSubject(subject.id, subject.name)}
                        className="w-full flex items-center justify-between px-3 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors rounded-lg"
                      >
                        <div className="flex-1">
                          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 block">
                            {subject.name}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {subject.topicCount} topics
                          </span>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-1 pb-2 pl-3">
                            {isLoadingTopics ? (
                              <div className="px-3 py-2 text-xs text-slate-500 dark:text-slate-400">
                                Loading topics...
                              </div>
                            ) : topics.length > 0 ? (
                              topics.map((topic) => {
                                const isActive =
                                  selectedTopic?.subjectId === subject.id &&
                                  selectedTopic?.topicName === topic.name;

                                return (
                                  <button
                                    key={topic.id}
                                    onClick={() =>
                                      handleTopicSelect(
                                        selectedExamId,
                                        subject.id,
                                        subject.name,
                                        topic.name
                                      )
                                    }
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                                      isActive
                                        ? "bg-[#F26A4B]/10 text-[#F26A4B] font-semibold"
                                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="truncate">{topic.name}</span>
                                      {isActive && <ChevronRight className="w-4 h-4 flex-shrink-0" />}
                                    </div>
                                  </button>
                                );
                              })
                            ) : (
                              <div className="px-3 py-2 text-xs text-slate-500 dark:text-slate-400">
                                No topics found
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </nav>

              {subjects.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    No subjects found
                  </p>
                </div>
              )}
            </div>
          </aside>
        )}

        {/* CENTER - Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#FAF8F5] dark:bg-slate-950">
          {!selectedExamId ? (
            /* Welcome Page */
            <div className="max-w-4xl mx-auto px-8 py-16">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-[#F26A4B] to-[#E76F51] mb-6 shadow-lg">
                  <BookOpen className="w-10 h-10 text-white" />
                </div>
                <h1 className="font-heading text-5xl font-black text-[#16213E] dark:text-white mb-4">
                  Study Guides
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                  Master every topic with structured learning materials designed for Indian competitive exams. Study smarter, not harder.
                </p>
                <div className="flex items-center justify-center gap-6 mt-6 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    <span>{exams.length}+ Exams</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <List className="w-4 h-4" />
                    <span>{exams.reduce((sum, e) => sum + e.subjectCount, 0)}+ Subjects</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>{exams.reduce((sum, e) => sum + e.topicCount, 0)}+ Topics</span>
                  </div>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-[#F26A4B]/10 flex items-center justify-center mb-4">
                    <Target className="w-6 h-6 text-[#F26A4B]" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-[#16213E] dark:text-white mb-2">
                    Structured Learning
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Topics organized by official syllabus with clear progression.
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-[#2A9D8F]/10 flex items-center justify-center mb-4">
                    <Brain className="w-6 h-6 text-[#2A9D8F]" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-[#16213E] dark:text-white mb-2">
                    Concept Clarity
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Real examples, formulas, and practice questions.
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-[#E9C46A]/10 flex items-center justify-center mb-4">
                    <TrendingUp className="w-6 h-6 text-[#E9C46A]" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-[#16213E] dark:text-white mb-2">
                    Learn → Practice → Review
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Study materials link to quizzes and flashcards.
                  </p>
                </div>
              </div>

              {/* How It Works */}
              <div className="bg-gradient-to-br from-[#F26A4B]/5 to-[#2A9D8F]/5 dark:from-[#F26A4B]/10 dark:to-[#2A9D8F]/10 p-8 rounded-2xl border border-[#F26A4B]/20 dark:border-[#F26A4B]/30 mb-12">
                <h2 className="font-heading text-2xl font-bold text-[#16213E] dark:text-white mb-6 text-center">
                  How Study Guides Work
                </h2>
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="w-12 h-12 rounded-full bg-[#F26A4B] text-white font-bold text-xl flex items-center justify-center mx-auto mb-3">
                      1
                    </div>
                    <h3 className="font-semibold text-[#16213E] dark:text-white mb-2">Choose Your Exam</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Select from JEE, NEET, UPSC, CAT, SSC, and 70+ other competitive exams
                    </p>
                  </div>
                  <div>
                    <div className="w-12 h-12 rounded-full bg-[#2A9D8F] text-white font-bold text-xl flex items-center justify-center mx-auto mb-3">
                      2
                    </div>
                    <h3 className="font-semibold text-[#16213E] dark:text-white mb-2">Pick a Subject</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Explore subjects like Physics, Chemistry, Mathematics, History, and more
                    </p>
                  </div>
                  <div>
                    <div className="w-12 h-12 rounded-full bg-[#E9C46A] text-white font-bold text-xl flex items-center justify-center mx-auto mb-3">
                      3
                    </div>
                    <h3 className="font-semibold text-[#16213E] dark:text-white mb-2">Study Topics</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Learn with clear explanations, examples, formulas, and practice questions
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-lg font-semibold text-[#16213E] dark:text-white mb-4">
                  Ready to start learning?
                </p>
                <div className="flex items-center justify-center gap-2 text-[#F26A4B]">
                  <ChevronRight className="w-5 h-5 animate-pulse" />
                  <span className="text-sm font-semibold">Choose your exam above</span>
                </div>
              </div>
            </div>
          ) : !selectedTopic ? (
            /* Exam Overview */
            <div className="max-w-4xl mx-auto px-8 py-12">
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F26A4B] to-[#E76F51] mb-4 shadow-md">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h1 className="font-heading text-4xl font-black text-[#16213E] dark:text-white mb-3">
                  {selectedExam?.fullName}
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  {selectedExam?.category}
                  {selectedExam?.conductingBody && ` • Conducted by ${selectedExam.conductingBody}`}
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid md:grid-cols-3 gap-4 mb-10">
                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                  <List className="w-6 h-6 text-[#F26A4B] mx-auto mb-2" />
                  <div className="text-2xl font-bold text-[#16213E] dark:text-white mb-1">
                    {selectedExam?.subjectCount || 0}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Subjects
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                  <BookOpen className="w-6 h-6 text-[#2A9D8F] mx-auto mb-2" />
                  <div className="text-2xl font-bold text-[#16213E] dark:text-white mb-1">
                    {selectedExam?.topicCount || 0}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Topics
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                  <Award className="w-6 h-6 text-[#E9C46A] mx-auto mb-2" />
                  <div className="text-2xl font-bold text-[#16213E] dark:text-white mb-1">
                    100%
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Syllabus Coverage
                  </div>
                </div>
              </div>

              {/* What's Inside */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 mb-8">
                <h2 className="font-heading text-2xl font-bold text-[#16213E] dark:text-white mb-6 flex items-center gap-2">
                  <Lightbulb className="w-6 h-6 text-[#F26A4B]" />
                  What You'll Find in Each Topic
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#2A9D8F] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-[#16213E] dark:text-white text-sm mb-1">
                        Concept Explanations
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Clear, structured content with real-world examples
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#2A9D8F] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-[#16213E] dark:text-white text-sm mb-1">
                        Formulas & Diagrams
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Visual aids and key formulas for quick reference
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#2A9D8F] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-[#16213E] dark:text-white text-sm mb-1">
                        Common Mistakes
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Learn what to avoid with correct vs incorrect examples
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#2A9D8F] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-[#16213E] dark:text-white text-sm mb-1">
                        Practice Questions
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Embedded questions to test your understanding
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subjects Preview */}
              <div className="bg-gradient-to-br from-[#F26A4B]/5 to-[#E76F51]/5 rounded-2xl border border-[#F26A4B]/20 p-8">
                <h2 className="font-heading text-xl font-bold text-[#16213E] dark:text-white mb-4">
                  Available Subjects
                </h2>
                <div className="grid md:grid-cols-2 gap-3 mb-6">
                  {subjects.slice(0, 6).map((subject) => (
                    <div
                      key={subject.id}
                      className="flex items-center gap-3 bg-white dark:bg-slate-900 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#F26A4B]/10 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-4 h-4 text-[#F26A4B]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-[#16213E] dark:text-white truncate">
                          {subject.name}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {subject.topicCount} topics
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {subjects.length > 6 && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
                    + {subjects.length - 6} more subjects
                  </p>
                )}
              </div>

              {/* CTA */}
              <div className="text-center mt-10">
                <p className="text-lg font-semibold text-[#16213E] dark:text-white mb-3">
                  Ready to dive in?
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Select a subject from the left sidebar to start learning
                </p>
                <div className="flex items-center justify-center gap-2 text-[#F26A4B]">
                  <ChevronRight className="w-5 h-5" />
                  <span className="text-sm font-semibold">Expand a subject to see topics</span>
                </div>
              </div>
            </div>
          ) : topicContent ? (
            <div className="max-w-4xl mx-auto px-8 py-8">
              <div className="mb-8">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">
                  <span>{selectedExam?.name}</span>
                  <ChevronRight className="w-3 h-3" />
                  <span>{selectedTopic.subjectName}</span>
                </div>

                <h1 className="font-heading text-4xl font-black text-[#16213E] dark:text-white mb-4">
                  {topicContent.title}
                </h1>

                <div className="flex items-center gap-6 text-sm">
                  {topicContent.estimated_time_minutes && (
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <Clock className="w-4 h-4" />
                      <span>{topicContent.estimated_time_minutes} min</span>
                    </div>
                  )}
                  {topicContent.difficulty_level && (
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <BarChart3 className="w-4 h-4" />
                      <span className="capitalize">{topicContent.difficulty_level}</span>
                    </div>
                  )}
                </div>
              </div>

              {isContentLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-8 h-8 border-4 border-[#F26A4B]/20 border-t-[#F26A4B] rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="space-y-8">
                  {topicContent.content.sections.map((section, sectionIdx) => (
                    <div key={sectionIdx} id={`section-${sectionIdx}`} className="scroll-mt-8">
                      {section.title && (
                        <h2 className="font-heading text-2xl font-bold text-[#16213E] dark:text-white mb-6">
                          {section.title}
                        </h2>
                      )}
                      <ContentRenderer content={section.content} />
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      const params = new URLSearchParams({
                        examId: selectedTopic.examId,
                        subjectId: selectedTopic.subjectId,
                        topic: selectedTopic.topicName,
                        count: "10",
                        difficulty: "mixed"
                      });
                      router.push(`/quiz?${params.toString()}`);
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-[#F26A4B] hover:bg-[#E76F51] text-white rounded-lg font-semibold transition-colors shadow-md"
                  >
                    <Zap className="w-5 h-5" />
                    <span>Practice Quiz</span>
                  </button>

                  <button
                    onClick={() => router.push("/review")}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-semibold transition-colors"
                  >
                    <RotateCcw className="w-5 h-5" />
                    <span>Review Flashcards</span>
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </main>

        {/* RIGHT SIDEBAR - TOC */}
        {selectedTopic && topicContent && (
          <aside className="w-[240px] flex-shrink-0 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-y-auto">
            <div className="p-4 sticky top-0">
              <h3 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-4" style={{ letterSpacing: '0.2em' }}>
                On This Page
              </h3>
              <nav className="space-y-1">
                {tableOfContents.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      activeTOCSection === item.id
                        ? "bg-[#F26A4B]/10 text-[#F26A4B] font-semibold"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    {item.title}
                  </button>
                ))}
              </nav>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
