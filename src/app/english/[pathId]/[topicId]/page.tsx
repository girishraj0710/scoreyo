"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/context/user-context";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { getPathById, getTopicById } from "@/lib/english-content";
import { getPremiumTopicIcon } from "@/lib/english-topic-icons";
import { trackTopicVisit } from "@/lib/english-activity-tracker";
import { ChevronLeft, Play, Clock, BookOpen, Award, Target, GraduationCap } from "lucide-react";

export default function EnglishTopicPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const params = useParams();
  const pathId = params.pathId as string;
  const topicId = params.topicId as string;

  const path = getPathById(pathId);
  const topic = path ? getTopicById(pathId, topicId) : null;

  const [progress, setProgress] = useState({
    completed: 0,
    accuracy: 0,
    mastery: 0,
    lastPracticed: null as string | null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user && path && topic) {
      fetchProgress();

      // Track activity when user visits this topic
      trackTopicVisit(
        user.id,
        topicId,
        topic.name,
        pathId,
        path.name
      );
    }
  }, [user, path, topic, pathId, topicId]);

  const fetchProgress = async () => {
    try {
      const res = await fetch(`/api/english/progress?pathId=${pathId}&topicId=${topicId}`);
      if (res.ok) {
        const data = await res.json();
        setProgress(data);
      }
    } catch (error) {
      console.error("Failed to fetch progress:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartPractice = (questionCount: number) => {
    router.push(`/english/${pathId}/${topicId}/practice?count=${questionCount}`);
  };

  if (isLoading || !user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--card-bg)" }}>
        <div className="w-12 h-12 border-4 rounded-full animate-spin" style={{ borderColor: "var(--muted)", borderTopColor: "var(--foreground)" }}></div>
      </div>
    );
  }

  if (!path || !topic) {
    return (
      <div className="min-h-screen" style={{ background: "var(--card-bg)" }}>
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--foreground)" }}>Topic not found</h1>
          <Link href="/english">
            <button className="hover:underline" style={{ color: "var(--foreground)" }}>← Back to English Hub</button>
          </Link>
        </div>
      </div>
    );
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner": return { background: "rgba(16, 185, 129, 0.1)", color: "#10b981", border: "1px solid rgba(16, 185, 129, 0.3)" };
      case "intermediate": return { background: "rgba(251, 146, 60, 0.1)", color: "#fb923c", border: "1px solid rgba(251, 146, 60, 0.3)" };
      case "advanced": return { background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.3)" };
      default: return { background: "var(--primary-bg)", color: "var(--foreground)", border: "1px solid var(--card-border)" };
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--card-bg)" }}>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href={`/english/${pathId}`}>
          <button className="flex items-center gap-2 mb-6 transition-colors" style={{ color: "var(--foreground-secondary)" }}>
            <ChevronLeft className="w-5 h-5" />
            Back to {path.name}
          </button>
        </Link>

        {/* Topic Header */}
        <div
          className="mb-8 rounded-2xl p-8 shadow-sm transition-all"
          style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", borderWidth: "1px", borderStyle: "solid" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.1)";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "0 1px 3px 0 rgb(0 0 0 / 0.1)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <div className="flex items-start gap-6">
            {(() => {
              const TopicIcon = getPremiumTopicIcon(topic.id);
              return (
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <TopicIcon className="w-16 h-16" />
                </div>
              );
            })()}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold" style={{ color: "var(--foreground)" }}>{topic.name}</h1>
                <span className="px-3 py-1 text-sm font-medium rounded-full" style={getLevelColor(topic.level)}>
                  {topic.level}
                </span>
              </div>
              <p className="mb-4" style={{ color: "var(--foreground-secondary)" }}>{topic.description}</p>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: "var(--hover-bg)" }}>
                  <BookOpen className="w-4 h-4 text-[#4255FF]" />
                  <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                    {topic.questionCount} questions
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: "var(--hover-bg)" }}>
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                    ~{topic.estimatedTime} min
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Stats */}
        {progress.completed > 0 && (
          <div className="mb-8 rounded-2xl p-6 shadow-lg transition-all" style={{ background: "linear-gradient(135deg, rgba(66, 85, 255, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)", borderColor: "rgba(66, 85, 255, 0.2)", borderWidth: "1px", borderStyle: "solid" }}>
            <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--foreground)" }}>Your Progress</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-3xl font-bold" style={{ color: "var(--foreground)" }}>{progress.completed}</div>
                <div className="text-sm" style={{ color: "var(--foreground-secondary)" }}>Questions Completed</div>
              </div>
              <div>
                <div className="text-3xl font-bold" style={{ color: "var(--foreground)" }}>{progress.accuracy.toFixed(0)}%</div>
                <div className="text-sm" style={{ color: "var(--foreground-secondary)" }}>Accuracy</div>
              </div>
              <div>
                <div className="text-3xl font-bold" style={{ color: "var(--foreground)" }}>{progress.mastery.toFixed(0)}%</div>
                <div className="text-sm" style={{ color: "var(--foreground-secondary)" }}>Mastery</div>
              </div>
            </div>
          </div>
        )}

        {/* Subtopics */}
        <div
          className="mb-8 rounded-2xl p-6 shadow-sm transition-all"
          style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", borderWidth: "1px", borderStyle: "solid" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.1)";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "0 1px 3px 0 rgb(0 0 0 / 0.1)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: "var(--foreground)" }}>
            <Target className="w-5 h-5 text-[#4255FF]" />
            What You'll Learn
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {topic.subtopics.map((subtopic, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: "var(--hover-bg)" }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--card-bg)", color: "var(--foreground)" }}>
                  <span className="font-semibold text-sm">{idx + 1}</span>
                </div>
                <span style={{ color: "var(--foreground)" }}>{subtopic}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Study First Option */}
        <div
          className="mb-6 rounded-2xl p-6 shadow-sm transition-all"
          style={{ background: "linear-gradient(135deg, rgba(66, 85, 255, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)", borderColor: "var(--card-border)", borderWidth: "1px", borderStyle: "solid" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.1)";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "0 1px 3px 0 rgb(0 0 0 / 0.1)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#4255FF] flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-2" style={{ color: "var(--foreground)" }}>📚 Study First, Then Practice</h2>
              <p className="mb-4" style={{ color: "var(--foreground-secondary)" }}>
                Want to learn the concepts before testing yourself? We've got comprehensive study material ready for you!
              </p>
              <Link href={`/english/${pathId}/${topicId}/study`}>
                <button
                  className="px-6 py-3 bg-[#4255FF] text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <BookOpen className="w-5 h-5" />
                  View Study Material
                  <span className="text-xs opacity-90">(~30-45 min)</span>
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Practice Options */}
        <div
          className="rounded-2xl p-6 shadow-sm transition-all"
          style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", borderWidth: "1px", borderStyle: "solid" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.1)";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "0 1px 3px 0 rgb(0 0 0 / 0.1)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--foreground)" }}>Or Jump Straight to Practice</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => handleStartPractice(5)}
              className="p-6 border-2 rounded-xl transition-all group"
              style={{ borderColor: "var(--card-border)", background: "var(--card-bg)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--primary)";
                e.currentTarget.style.background = "var(--hover-bg)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--card-border)";
                e.currentTarget.style.background = "var(--card-bg)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <Play className="w-8 h-8 text-[#4255FF] mb-2" />
              <div className="font-bold mb-1" style={{ color: "var(--foreground)" }}>Quick Practice</div>
              <div className="text-sm" style={{ color: "var(--foreground-secondary)" }}>5 questions</div>
              <div className="text-xs mt-2" style={{ color: "var(--muted)" }}>~5 minutes</div>
            </button>

            <button
              onClick={() => handleStartPractice(10)}
              className="p-6 border-2 rounded-xl transition-all group"
              style={{ borderColor: "var(--primary)", background: "var(--hover-bg)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--primary)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--primary)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <Play className="w-8 h-8 text-[#4255FF] mb-2" />
              <div className="font-bold mb-1" style={{ color: "var(--foreground)" }}>Standard Practice</div>
              <div className="text-sm" style={{ color: "var(--foreground-secondary)" }}>10 questions</div>
              <div className="text-xs mt-2" style={{ color: "var(--muted)" }}>~10 minutes</div>
            </button>

            <button
              onClick={() => handleStartPractice(20)}
              className="p-6 border-2 rounded-xl transition-all group"
              style={{ borderColor: "var(--card-border)", background: "var(--card-bg)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--primary)";
                e.currentTarget.style.background = "var(--hover-bg)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--card-border)";
                e.currentTarget.style.background = "var(--card-bg)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <Play className="w-8 h-8 text-[#4255FF] mb-2" />
              <div className="font-bold mb-1" style={{ color: "var(--foreground)" }}>Deep Practice</div>
              <div className="text-sm" style={{ color: "var(--foreground-secondary)" }}>20 questions</div>
              <div className="text-xs mt-2" style={{ color: "var(--muted)" }}>~20 minutes</div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
