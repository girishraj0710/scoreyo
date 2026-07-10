"use client";

import { useState, useEffect, useMemo } from "react";
import { useUser } from "@/context/user-context";
import { useRouter } from "next/navigation";
import { examCategories, type Exam, type Subject } from "@/lib/exams";
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
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null); // Start with no exam selected
  const [selectedTopic, setSelectedTopic] = useState<{
    examId: string;
    subjectId: string;
    subjectName: string;
    topicName: string;
  } | null>(null);
  const [topicContent, setTopicContent] = useState<TopicContent | null>(null);
  const [isContentLoading, setIsContentLoading] = useState(false);
  const [activeTOCSection, setActiveTOCSection] = useState<string>("");
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(new Set()); // Start with all collapsed

  // Auth check
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth");
    }
  }, [user, isLoading, router]);

  // Get selected exam
  const selectedExam = examCategories
    .flatMap(cat => cat.exams)
    .find(exam => exam.id === selectedExamId);

  // Group subjects for accordion display
  const subjects = useMemo(() => {
    if (!selectedExam) return [];
    return selectedExam.subjects;
  }, [selectedExam]);

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
      } else {
        // Mock content for topics without database entries
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

  // Handle exam filter change
  const handleExamChange = (examId: string) => {
    setSelectedExamId(examId);
    setSelectedTopic(null);
    setTopicContent(null);
    setSearchQuery("");
    // Reset expanded subjects - start with all collapsed
    setExpandedSubjects(new Set());
  };

  // Toggle subject expansion
  const toggleSubject = (subjectName: string) => {
    setExpandedSubjects(prev => {
      const newSet = new Set(prev);
      if (newSet.has(subjectName)) {
        newSet.delete(subjectName);
      } else {
        newSet.add(subjectName);
      }
      return newSet;
    });
  };

  // Generate Table of Contents from content
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5] dark:bg-slate-950">
        <div className="w-12 h-12 border-4 border-[#F26A4B]/20 border-t-[#F26A4B] rounded-full animate-spin"></div>
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
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              <BookOpen className="w-4 h-4" />
              <span>Study Guides</span>
            </div>
            <h1 className="font-heading text-2xl font-bold text-[#16213E] dark:text-white">
              {selectedExam?.fullName || "Select an Exam"}
            </h1>
          </div>

          {/* Exam Filters + Search */}
          <div className="flex items-center gap-4">
            {/* Exam Pills */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1">
              {EXAM_FILTERS.map((exam) => (
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
        {/* LEFT SIDEBAR - Subjects Accordion (only show when exam is selected) */}
        {selectedExamId && (
          <aside className="w-[280px] flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-y-auto">
          <div className="p-4">
            {/* Syllabus Header */}
            <div className="mb-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F26A4B] mb-1">
                SYLLABUS
              </p>
              <h2 className="text-xl font-heading font-black text-[#16213E] dark:text-white">
                {selectedExam?.name || "Select Exam"}
              </h2>
            </div>

            {/* Subjects Accordion */}
            <nav className="space-y-2">
              {subjects.map((subject) => {
                const isExpanded = expandedSubjects.has(subject.name);

                return (
                  <div key={subject.id} className="border-b border-slate-200 dark:border-slate-800 last:border-b-0">
                    {/* Subject Header - Clickable */}
                    <button
                      onClick={() => toggleSubject(subject.name)}
                      className="w-full flex items-center justify-between px-3 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors rounded-lg"
                    >
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {subject.name}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Topics - Expandable */}
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-1 pb-2 pl-3">
                          {subject.topics.map((topic, topicIndex) => {
                            const isActive =
                              selectedTopic?.subjectId === subject.id &&
                              selectedTopic?.topicName === topic;

                            return (
                              <button
                                key={`${subject.id}-${topic}`}
                                onClick={() =>
                                  handleTopicSelect(
                                    selectedExamId,
                                    subject.id,
                                    subject.name,
                                    topic
                                  )
                                }
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all group ${
                                  isActive
                                    ? "bg-[#F26A4B]/10 text-[#F26A4B] font-semibold"
                                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="truncate">{topic}</span>
                                  {isActive && (
                                    <ChevronRight className="w-4 h-4 text-[#F26A4B] flex-shrink-0" />
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Empty state */}
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
            /* Welcome Page - No Exam Selected */
            <div className="max-w-4xl mx-auto px-8 py-16">
              {/* Hero Section */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-[#F26A4B] to-[#E76F51] mb-6 shadow-lg">
                  <BookOpen className="w-10 h-10 text-white" />
                </div>
                <h1 className="font-heading text-5xl font-black text-[#16213E] dark:text-white mb-4">
                  Study Guides
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                  Comprehensive learning materials designed to help you master every topic before you practice.
                  Built by experts, optimized for retention.
                </p>
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
                    Topics organized by official syllabus with clear progression from basics to advanced concepts.
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
                    Real examples, formulas, diagrams, and practice questions - everything you need to truly understand.
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
                    Study materials link directly to quizzes and flashcards for immediate practice and retention.
                  </p>
                </div>
              </div>

              {/* How It Works */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 mb-12">
                <h2 className="font-heading text-2xl font-bold text-[#16213E] dark:text-white mb-6">
                  How to Use Study Guides
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#F26A4B] text-white flex items-center justify-center font-bold text-sm">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#16213E] dark:text-white mb-1">Select Your Exam</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Choose from UPSC, JEE, NEET, CAT, SSC, GATE, CLAT and more from the filters above.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#F26A4B] text-white flex items-center justify-center font-bold text-sm">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#16213E] dark:text-white mb-1">Pick a Subject & Topic</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Browse subjects in the left sidebar, expand to see topics, and click to start learning.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#F26A4B] text-white flex items-center justify-center font-bold text-sm">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#16213E] dark:text-white mb-1">Study, Practice, Review</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Read the content, solve practice questions, then take a quiz or review flashcards to reinforce.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="text-center">
                <p className="text-lg font-semibold text-[#16213E] dark:text-white mb-4">
                  Ready to start learning?
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                  Select an exam from the filters above to begin
                </p>
                <div className="flex items-center justify-center gap-2 text-[#F26A4B]">
                  <ChevronRight className="w-5 h-5 animate-pulse" />
                  <span className="text-sm font-semibold">Choose your exam above</span>
                </div>
              </div>
            </div>
          ) : !selectedTopic ? (
            /* Exam Overview - Exam Selected but No Topic */
            <div className="max-w-4xl mx-auto px-8 py-12">
              {/* Exam Header */}
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F26A4B] to-[#E76F51] mb-4 shadow-md">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h1 className="font-heading text-4xl font-black text-[#16213E] dark:text-white mb-3">
                  {selectedExam?.fullName}
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  {selectedExam?.description}
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid md:grid-cols-3 gap-4 mb-10">
                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                  <List className="w-6 h-6 text-[#F26A4B] mx-auto mb-2" />
                  <div className="text-2xl font-bold text-[#16213E] dark:text-white mb-1">
                    {subjects.length}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Subjects
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                  <BookOpen className="w-6 h-6 text-[#2A9D8F] mx-auto mb-2" />
                  <div className="text-2xl font-bold text-[#16213E] dark:text-white mb-1">
                    {subjects.reduce((acc, s) => acc + s.topics.length, 0)}
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
                          {subject.topics.length} topics
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
              {/* Topic Header */}
              <div className="mb-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">
                  <span>{selectedExam?.name}</span>
                  <ChevronRight className="w-3 h-3" />
                  <span>{selectedTopic.subjectName}</span>
                </div>

                {/* Title */}
                <h1 className="font-heading text-4xl font-black text-[#16213E] dark:text-white mb-4 leading-tight">
                  {topicContent.title}
                </h1>

                {/* Meta Info */}
                <div className="flex items-center gap-6 text-sm">
                  {topicContent.estimated_time_minutes && (
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <Clock className="w-4 h-4" />
                      <span>{topicContent.estimated_time_minutes} min read</span>
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

              {/* Content Sections */}
              {isContentLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-8 h-8 border-4 border-[#F26A4B]/20 border-t-[#F26A4B] rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="space-y-8">
                  {topicContent.content.sections.map((section, sectionIdx) => (
                    <div
                      key={sectionIdx}
                      id={`section-${sectionIdx}`}
                      className="scroll-mt-8"
                    >
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

              {/* Action Buttons */}
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
                    className="flex items-center gap-2 px-6 py-3 bg-[#F26A4B] hover:bg-[#E76F51] text-white rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
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

        {/* RIGHT SIDEBAR - Table of Contents (only show when topic is selected) */}
        {selectedTopic && topicContent && (
          <aside className="w-[240px] flex-shrink-0 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-y-auto">
            <div className="p-4 sticky top-0">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
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
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {item.title}
                  </button>
                ))}
              </nav>

              {/* Progress Indicator */}
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-600 dark:text-slate-400">
                      Progress
                    </span>
                    <span className="font-bold text-[#F26A4B]">64%</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "64%" }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-[#F26A4B] to-[#E76F51] rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
