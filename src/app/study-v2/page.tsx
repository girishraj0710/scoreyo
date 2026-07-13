"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock, BookOpen, Sparkles } from "lucide-react";
import { StudyContentPremium } from "@/components/study-content-premium";
import { StudyNavigationPremium } from "@/components/study-navigation-premium";
import { StudyProgressPremium } from "@/components/study-progress-premium";
import { getExamById } from "@/lib/exams";

interface StudyMaterial {
  id: number;
  subject_id: string;
  topic_id: string;
  title: string;
  subtitle: string;
  overview: string;
  content: {
    sections: any[];
  };
  difficulty_level: string;
  estimated_time_minutes: number;
  curriculum_standard: string;
  textbook_references: string[];
}

function StudyPagePremiumContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const examId = searchParams.get("exam");
  const subjectId = searchParams.get("subject");
  const topic = searchParams.get("topic");
  const originalSubject = searchParams.get("originalSubject") || subjectId;
  const originalTopic = searchParams.get("originalTopic") || topic;

  const [studyMaterial, setStudyMaterial] = useState<StudyMaterial | null>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState(new Set<number>());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Time tracking
  const [readingSessionId, setReadingSessionId] = useState<number | null>(null);
  const [sectionsViewed, setSectionsViewed] = useState(new Set<number>());

  const exam = examId ? getExamById(examId) : null;

  useEffect(() => {
    if (subjectId && topic) {
      fetchStudyMaterial();
    }
  }, [subjectId, topic]);

  const fetchStudyMaterial = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const subjectMap: Record<string, string> = {
        "phy": "physics",
        "physics": "physics",
        "chem": "chemistry",
        "chemistry": "chemistry",
        "math": "maths",
        "maths": "maths",
        "mathematics": "maths",
        "bio": "biology",
        "biology": "biology",
        "english": "english"
      };

      const subjectName = subjectMap[subjectId?.toLowerCase() || ""] || subjectId;

      const res = await fetch(`/api/study-content?subject=${subjectName}&topic=${encodeURIComponent(topic || "")}`);

      if (!res.ok) {
        throw new Error("Study material not found");
      }

      const data = await res.json();
      setStudyMaterial(data.material);

      // Start reading session tracking
      try {
        const sessionRes = await fetch('/api/study/start-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subjectId: subjectName,
            topicId: topic,
            pathId: '' // Optional, can be added if available
          })
        });
        if (sessionRes.ok) {
          const sessionData = await sessionRes.json();
          setReadingSessionId(sessionData.sessionId);
        }
      } catch {
        // Time tracking is optional - don't fail if it errors
      }
    } catch (error) {
      console.error("Failed to fetch study material:", error);
      setError("Study material not available for this topic yet.");
    } finally {
      setIsLoading(false);
    }
  };

  const sections = studyMaterial?.content?.sections || [];
  const currentSectionData = sections[currentSection];

  // Track when section is viewed
  useEffect(() => {
    if (currentSectionData) {
      setSectionsViewed(prev => new Set([...prev, currentSection]));
    }
  }, [currentSection, currentSectionData]);

  // End reading session on unmount
  useEffect(() => {
    return () => {
      if (readingSessionId && sectionsViewed.size > 0) {
        const totalSections = sections.length || 1;
        const completionPct = Math.round((sectionsViewed.size / totalSections) * 100);

        // Fire and forget - don't block navigation
        fetch('/api/study/end-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: readingSessionId,
            sectionsRead: sectionsViewed.size,
            completionPercentage: completionPct
          }),
          keepalive: true // Ensure request completes even if page unloads
        }).catch(() => {
          // Ignore errors - time tracking is optional
        });
      }
    };
  }, [readingSessionId, sectionsViewed, sections.length]);

  const markSectionComplete = () => {
    setCompletedSections(prev => new Set([...prev, currentSection]));
  };

  const goToNextSection = () => {
    markSectionComplete();
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPreviousSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToQuiz = () => {
    markSectionComplete();
    router.push(`/quiz?examId=${examId}&subjectId=${originalSubject}&topic=${encodeURIComponent(originalTopic || "")}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--card-bg)" }}>
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div
              className="absolute inset-0 border-4 rounded-full animate-spin"
              style={{ borderColor: "var(--muted)", borderTopColor: "#4255FF" }}
            />
            <div className="absolute inset-2 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 animate-pulse" />
          </div>
          <p className="text-lg font-medium" style={{ color: "var(--foreground-secondary)" }}>
            Loading study material...
          </p>
        </div>
      </div>
    );
  }

  if (error || !studyMaterial) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--card-bg)" }}>
        <div className="max-w-md text-center">
          <div className="text-7xl mb-6 animate-bounce">📚</div>
          <h2 className="text-3xl font-bold mb-3" style={{ color: "var(--foreground)" }}>
            Coming Soon
          </h2>
          <p className="text-lg mb-8" style={{ color: "var(--foreground-secondary)" }}>
            {error || "We're working on adding comprehensive study material for this topic."}
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={() => router.back()}
              className="px-6 py-3 rounded-2xl font-semibold transition-all hover:scale-105 active:scale-95"
              style={{ background: "var(--hover-bg)", color: "var(--foreground)" }}
            >
              ← Go Back
            </button>
            <button
              onClick={goToQuiz}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl font-semibold hover:shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              Take Quiz Instead →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--card-bg)" }}>
      {/* Hero Header */}
      <div className="relative border-b" style={{ borderColor: "var(--card-border)" }}>
        {/* Background gradient */}
        <div
          className="absolute inset-0 opacity-50"
          style={{
            background: 'linear-gradient(135deg, rgba(66, 85, 255, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)'
          }}
        />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-2 mb-6 transition-all hover:gap-3"
            style={{ color: "var(--foreground-secondary)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Topic Selection</span>
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-4 text-sm flex-wrap" style={{ color: "var(--foreground-secondary)" }}>
            <span className="font-medium">{exam?.name}</span>
            <span>•</span>
            <span className="capitalize">{subjectId}</span>
            <span>•</span>
            <span>{topic}</span>
          </div>

          {/* Title section */}
          <div className="mb-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-3 leading-tight" style={{ color: "var(--foreground)" }}>
              {studyMaterial.title}
            </h1>
            <p className="text-lg sm:text-xl" style={{ color: "var(--foreground-secondary)" }}>
              {studyMaterial.subtitle}
            </p>
          </div>

          {/* Meta info pills */}
          <div className="flex items-center gap-3 flex-wrap">
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm"
              style={{ background: "var(--hover-bg)", color: "var(--foreground)" }}
            >
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">{studyMaterial.estimated_time_minutes} min</span>
            </div>
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm"
              style={{ background: "var(--hover-bg)", color: "var(--foreground)" }}
            >
              <BookOpen className="w-4 h-4" />
              <span className="text-sm font-medium">{studyMaterial.curriculum_standard}</span>
            </div>
            <div
              className="px-4 py-2 rounded-full font-medium text-sm capitalize"
              style={{
                background: studyMaterial.difficulty_level === 'beginner'
                  ? 'rgba(16, 185, 129, 0.1)'
                  : studyMaterial.difficulty_level === 'advanced'
                    ? 'rgba(239, 68, 68, 0.1)'
                    : 'rgba(245, 158, 11, 0.1)',
                color: studyMaterial.difficulty_level === 'beginner'
                  ? '#10B981'
                  : studyMaterial.difficulty_level === 'advanced'
                    ? '#EF4444'
                    : '#F59E0B'
              }}
            >
              {studyMaterial.difficulty_level}
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="px-4 sm:px-6 py-8 sm:py-12">
        <StudyContentPremium section={currentSectionData} />
      </div>

      {/* Floating progress indicator (top-right) */}
      <StudyProgressPremium
        currentSection={currentSection}
        totalSections={sections.length}
        completedSections={completedSections}
        sections={sections}
        onSectionClick={setCurrentSection}
      />

      {/* Bottom navigation bar */}
      <StudyNavigationPremium
        currentSection={currentSection}
        totalSections={sections.length}
        onPrevious={goToPreviousSection}
        onNext={goToNextSection}
        onStartQuiz={goToQuiz}
        canGoPrevious={currentSection > 0}
        canGoNext={currentSection < sections.length - 1}
        isLastSection={currentSection === sections.length - 1}
      />
    </div>
  );
}

export default function StudyPagePremium() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--card-bg)" }}>
        <div className="relative w-20 h-20">
          <div
            className="absolute inset-0 border-4 rounded-full animate-spin"
            style={{ borderColor: "var(--muted)", borderTopColor: "#4255FF" }}
          />
        </div>
      </div>
    }>
      <StudyPagePremiumContent />
    </Suspense>
  );
}
