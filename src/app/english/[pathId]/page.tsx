"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/context/user-context";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { getPathById, type EnglishTopic } from "@/lib/english-content";
import { getPathIcon, getTopicIcon } from "@/lib/english-icons";
import { ChevronLeft, Clock, BookOpen, Award, CheckCircle2, Lock } from "lucide-react";

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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#90CAF9] border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!path) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Path not found</h1>
          <Link href="/english">
            <button className="text-[#4255FF] hover:underline">← Back to English Hub</button>
          </Link>
        </div>
      </div>
    );
  }

  const getTopicProgress = (topicId: string): TopicProgress => {
    return progress.find(p => p.topicId === topicId) || {
      topicId,
      completed: 0,
      total: 0,
      accuracy: 0,
      mastery: 0
    };
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case "beginner": return "bg-green-100 text-green-700";
      case "intermediate": return "bg-yellow-100 text-yellow-700";
      case "advanced": return "bg-red-100 text-red-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  // Sort topics by level: beginner → intermediate → advanced
  const sortedTopics = [...path.topics].sort((a, b) => {
    const levelOrder = { beginner: 1, intermediate: 2, advanced: 3 };
    return (levelOrder[a.level as keyof typeof levelOrder] || 0) - (levelOrder[b.level as keyof typeof levelOrder] || 0);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/english">
          <button className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors">
            <ChevronLeft className="w-5 h-5" />
            Back to English Hub
          </button>
        </Link>

        {/* Path Header */}
        <div className="mb-8 bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
          <div className="flex items-start gap-6">
            {(() => {
              const PathIcon = getPathIcon(path.id);
              return (
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${path.color}15` }}
                >
                  <PathIcon className="w-10 h-10" style={{ color: path.color }} />
                </div>
              );
            })()}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{path.name}</h1>
              <p className="text-slate-600 mb-4">{path.description}</p>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-[#E8EAFF] rounded-lg">
                  <BookOpen className="w-4 h-4 text-[#4255FF]" />
                  <span className="text-sm font-medium text-slate-700">
                    {path.topics.length} topics
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-lg">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-medium text-slate-700">
                    {path.totalQuestions}+ questions
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-lg">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-slate-700">
                    ~{path.estimatedWeeks} weeks
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Topics Grid */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">Topics</h2>
          {sortedTopics.map((topic: EnglishTopic) => {
            const topicProgress = getTopicProgress(topic.id);
            const isStarted = topicProgress.completed > 0;
            const isCompleted = topicProgress.mastery >= 90;
            const TopicIcon = getTopicIcon(topic.id);

            return (
              <Link key={topic.id} href={`/english/${pathId}/${topic.id}`}>
                <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="w-14 h-14 bg-[#E8EAFF] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#E8EAFF] transition-colors">
                      <TopicIcon className="w-7 h-7 text-[#4255FF]" />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#4255FF] transition-colors">
                            {topic.name}
                          </h3>
                          <p className="text-sm text-slate-600">{topic.description}</p>
                        </div>
                        {isCompleted && (
                          <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                        )}
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getLevelBadgeColor(topic.level)}`}>
                          {topic.level}
                        </span>
                        <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
                          {topic.questionCount} questions
                        </span>
                        <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
                          ~{topic.estimatedTime} min
                        </span>
                      </div>

                      {/* Progress Bar */}
                      {isStarted && (
                        <div className="mb-2">
                          <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                            <span>Progress: {topicProgress.completed}/{topic.questionCount}</span>
                            <span>Mastery: {topicProgress.mastery.toFixed(0)}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#4255FF] to-purple-500 transition-all"
                              style={{ width: `${(topicProgress.completed / topic.questionCount) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Subtopics */}
                      <div className="text-xs text-slate-500">
                        <span className="font-medium">Covers:</span> {topic.subtopics.slice(0, 3).join(", ")}
                        {topic.subtopics.length > 3 && ` +${topic.subtopics.length - 3} more`}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
