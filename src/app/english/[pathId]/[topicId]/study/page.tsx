"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { BookOpen, CheckCircle, ArrowRight, ArrowLeft, Clock, Target } from "lucide-react";
import { StudyMaterialContent } from "@/components/study-material-content-v2";
import { getPathById, getTopicById } from "@/lib/english-content";

interface StudyMaterial {
  id: number;
  subject_id: string;
  topic_id: string;
  path_id: string | null;
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

export default function StudyMaterialPage() {
  const params = useParams();
  const router = useRouter();

  const pathId = params.pathId as string;
  const topicId = params.topicId as string;

  const path = getPathById(pathId);
  const topic = path ? getTopicById(pathId, topicId) : null;

  const [studyMaterial, setStudyMaterial] = useState<StudyMaterial | null>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState(new Set<number>());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStudyMaterial();
  }, [pathId, topicId]);

  const fetchStudyMaterial = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await fetch(`/api/study-content?subject=english&topic=${topicId}&path=${pathId}`);

      if (!res.ok) {
        throw new Error("Study material not found");
      }

      const data = await res.json();
      setStudyMaterial(data.material);
    } catch (error) {
      console.error("Failed to fetch study material:", error);
      setError("Study material not available for this topic yet.");
    } finally {
      setIsLoading(false);
    }
  };

  const sections = studyMaterial?.content?.sections || [];
  const currentSectionData = sections[currentSection];

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
    // Add referrer parameter so practice page can link back to study
    router.push(`/english/${pathId}/${topicId}/practice?count=10&from=study`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--card-bg)" }}>
        <div className="text-center">
          <div
            className="w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: "var(--muted)", borderTopColor: "#4255FF" }}
          />
          <p style={{ color: "var(--foreground-secondary)" }}>Loading study material...</p>
        </div>
      </div>
    );
  }

  if (error || !studyMaterial) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--card-bg)" }}>
        <div className="max-w-md text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--foreground)" }}>
            Study Material Not Available
          </h2>
          <p className="mb-6" style={{ color: "var(--foreground-secondary)" }}>
            {error || "We're working on adding study material for this topic."}
          </p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-[#4255FF] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--card-bg)" }}>
      {/* Header */}
      <div className="border-b" style={{ borderColor: "var(--card-border)" }}>
        <div className="max-w-5xl mx-auto px-4 py-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 mb-4 transition-colors"
            style={{ color: "var(--foreground-secondary)" }}
            onMouseEnter={(e) => e.currentTarget.style.color = "var(--foreground)"}
            onMouseLeave={(e) => e.currentTarget.style.color = "var(--foreground-secondary)"}
          >
            <ArrowLeft className="w-4 h-4" /> Back to {topic?.name || 'Topic'}
          </button>
          <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--foreground)" }}>
            {studyMaterial.title}
          </h1>
          <p style={{ color: "var(--foreground-secondary)" }}>{studyMaterial.subtitle}</p>
          <div className="flex items-center gap-4 mt-4 text-sm flex-wrap">
            <span className="flex items-center gap-2" style={{ color: "var(--foreground-secondary)" }}>
              <Clock className="w-4 h-4" />
              {studyMaterial.estimated_time_minutes} min read
            </span>
            <span className="flex items-center gap-2" style={{ color: "var(--foreground-secondary)" }}>
              <BookOpen className="w-4 h-4" />
              {studyMaterial.curriculum_standard}
            </span>
            <span
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{ background: "var(--hover-bg)", color: "var(--foreground)" }}
            >
              {studyMaterial.difficulty_level}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="border-b" style={{ borderColor: "var(--card-border)" }}>
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            {sections.map((section: any, idx: number) => (
              <button
                key={idx}
                className="flex-1 h-2 rounded-full cursor-pointer transition-all"
                style={{
                  background: completedSections.has(idx)
                    ? "#10B981"
                    : idx === currentSection
                    ? "#4255FF"
                    : "var(--muted)"
                }}
                onClick={() => setCurrentSection(idx)}
                aria-label={`Go to section ${idx + 1}: ${section.title}`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs" style={{ color: "var(--foreground-secondary)" }}>
            <span>Section {currentSection + 1} of {sections.length}</span>
            <span>{completedSections.size} completed</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <StudyMaterialContent
          section={currentSectionData}
          onSectionComplete={goToNextSection}
        />

        {/* Navigation - Hidden on Core Concepts section (flashcard navigation handles it) */}
        {!currentSectionData?.title?.toLowerCase().includes('core concepts') && (
          <div className="flex justify-between mt-12 pt-8 border-t" style={{ borderColor: "var(--card-border)" }}>
            <button
              onClick={goToPreviousSection}
              disabled={currentSection === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: "var(--hover-bg)", color: "var(--foreground)" }}
            >
              <ArrowLeft className="w-5 h-5" />
              Previous
            </button>

            {currentSection === sections.length - 1 ? (
              <button
                onClick={goToQuiz}
                className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                <CheckCircle className="w-5 h-5" />
                Start Quiz Now
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={goToNextSection}
                className="flex items-center gap-2 px-6 py-3 bg-[#4255FF] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Next Section
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
