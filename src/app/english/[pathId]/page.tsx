"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/context/user-context";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { getPathById, getPathModules, type EnglishTopic, type EnglishModule } from "@/lib/english-content";
import { getPremiumTopicIcon } from "@/lib/english-topic-icons";
import { ChevronLeft, Clock, Target, CheckCircle2 } from "lucide-react";

interface TopicProgress {
  topicId: string;
  completed: number;
  total: number;
  accuracy: number;
  mastery: number;
}

export default function EnglishPathPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const params = useParams();
  const pathId = params.pathId as string;
  const [progress, setProgress] = useState<TopicProgress[]>([]);
  const [loading, setLoading] = useState(true);

  const path = getPathById(pathId);
  const modules: EnglishModule[] = getPathModules(pathId);
  const accent = path?.color ?? "#E76F51";

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user && path) {
      fetchProgress();
    }
  }, [user, path]);

  const fetchProgress = async () => {
    try {
      const res = await fetch(`/api/english/progress?pathId=${pathId}`);
      if (res.ok) {
        const data = await res.json();
        setProgress(data.progress || []);
      }
    } catch (error) {
      console.error("Failed to fetch progress:", error);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || !user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--card-bg)" }}>
        <div className="w-12 h-12 border-4 rounded-full animate-spin" style={{ borderColor: "var(--muted)", borderTopColor: accent }}></div>
      </div>
    );
  }

  if (!path) {
    return (
      <div className="min-h-screen" style={{ background: "var(--card-bg)" }}>
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--foreground)" }}>Path not found</h1>
          <Link href="/english">
            <button className="hover:underline" style={{ color: "var(--foreground)" }}>← Back to English Hub</button>
          </Link>
        </div>
      </div>
    );
  }

  const getTopicProgress = (topicId: string): TopicProgress =>
    progress.find((p) => p.topicId === topicId) || {
      topicId,
      completed: 0,
      total: 0,
      accuracy: 0,
      mastery: 0,
    };

  const totalTopics = modules.reduce((acc, m) => acc + m.topics.length, 0);

  const renderTopicCard = (topic: EnglishTopic) => {
    const tp = getTopicProgress(topic.id);
    const isStarted = tp.completed > 0;
    const isCompleted = tp.mastery >= 90;
    const TopicIcon = getPremiumTopicIcon(topic.id);
    const progressPct = topic.questionCount > 0
      ? Math.min(100, Math.round((tp.completed / topic.questionCount) * 100))
      : 0;

    return (
      <Link key={topic.id} href={`/english/${pathId}/${topic.id}`} className="block h-full">
        <div
          className="group relative h-full p-5 rounded-xl border-2 transition-all text-left"
          style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = accent;
            e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.10)";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--card-border)";
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          {/* CEFR badge — top right */}
          {topic.cefrLevel && (
            <div
              className="absolute top-4 right-4 px-2 py-0.5 rounded-md text-[10px] font-bold"
              style={{ background: `${accent}15`, color: accent }}
            >
              {topic.cefrLevel}
            </div>
          )}

          {/* Icon + title */}
          <div className="grid grid-cols-[3rem_1fr] gap-3 items-center mb-3">
            <TopicIcon className="w-12 h-12" />
            <h3
              className="font-semibold text-sm leading-tight pr-10 break-words transition-colors"
              style={{ color: "var(--foreground)" }}
            >
              {topic.name}
            </h3>
          </div>

          {/* Description */}
          <p className="text-xs mb-4 line-clamp-2 leading-relaxed" style={{ color: "var(--foreground-secondary)" }}>
            {topic.description}
          </p>

          {/* Progress bar (only once started) */}
          {isStarted && (
            <div className="mb-3">
              <div className="w-full rounded-full h-1.5 overflow-hidden" style={{ background: "var(--hover-bg)" }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${progressPct}%`, background: accent }} />
              </div>
            </div>
          )}

          {/* Meta + status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs" style={{ color: "var(--muted)" }}>
              <span className="flex items-center gap-1" title="Estimated time">
                <Clock className="w-3.5 h-3.5" />
                {topic.estimatedTime}m
              </span>
              <span className="flex items-center gap-1" title="Practice questions">
                <Target className="w-3.5 h-3.5" />
                {topic.questionCount}Q
              </span>
            </div>

            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500" aria-label="Mastered" />
            ) : isStarted ? (
              <span className="text-[11px] font-semibold" style={{ color: accent }}>
                {tp.mastery.toFixed(0)}%
              </span>
            ) : null}
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--card-bg)" }}>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <Link href="/english">
          <button className="flex items-center gap-2 mb-6 transition-colors" style={{ color: "var(--foreground-secondary)" }}>
            <ChevronLeft className="w-5 h-5" />
            Back to English Hub
          </button>
        </Link>

        {/* Path header */}
        <div className="flex items-start justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--foreground)" }}>{path.name}</h1>
            <p style={{ color: "var(--foreground-secondary)" }}>{path.description}</p>
          </div>
          <div className="flex items-center gap-6 flex-shrink-0">
            <div className="text-right">
              <p className="text-xs" style={{ color: "var(--muted)" }}>Total Topics</p>
              <p className="text-lg font-bold" style={{ color: accent }}>{totalTopics}</p>
            </div>
            <div className="text-right">
              <p className="text-xs" style={{ color: "var(--muted)" }}>Est. Time</p>
              <p className="text-lg font-bold text-emerald-500">{path.estimatedWeeks} weeks</p>
            </div>
          </div>
        </div>

        {/* Modules */}
        <div className="space-y-6">
          {modules.map((module, moduleIndex) => (
            <section
              key={module.id}
              className="rounded-2xl border p-6"
              style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
            >
              {/* Module header */}
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${accent}15` }}
                >
                  <span className="text-xl font-bold" style={{ color: accent }}>{moduleIndex + 1}</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>{module.name}</h2>
                  <p className="text-sm" style={{ color: "var(--foreground-secondary)" }}>{module.description}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs" style={{ color: "var(--muted)" }}>Topics</p>
                  <p className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>{module.topics.length}</p>
                </div>
              </div>

              {/* Topics grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {module.topics.map((topic) => renderTopicCard(topic))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
