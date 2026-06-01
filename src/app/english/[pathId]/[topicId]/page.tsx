"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/context/user-context";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { getPathById, getTopicById } from "@/lib/english-content";
import { getTopicIcon } from "@/lib/english-icons";
import { ChevronLeft, Play, Clock, BookOpen, Award, Target } from "lucide-react";

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
    }
  }, [user, path, topic]);

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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#90CAF9] border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!path || !topic) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Topic not found</h1>
          <Link href="/english">
            <button className="text-[#4255FF] hover:underline">← Back to English Hub</button>
          </Link>
        </div>
      </div>
    );
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner": return "text-green-600 bg-green-100";
      case "intermediate": return "text-yellow-600 bg-yellow-100";
      case "advanced": return "text-red-600 bg-red-100";
      default: return "text-slate-600 bg-slate-100";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href={`/english/${pathId}`}>
          <button className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors">
            <ChevronLeft className="w-5 h-5" />
            Back to {path.name}
          </button>
        </Link>

        {/* Topic Header */}
        <div className="mb-8 bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
          <div className="flex items-start gap-6">
            {(() => {
              const TopicIcon = getTopicIcon(topic.id);
              return (
                <div className="w-20 h-20 bg-[#E8EAFF] rounded-2xl flex items-center justify-center flex-shrink-0">
                  <TopicIcon className="w-10 h-10 text-[#00A1E0]" />
                </div>
              );
            })()}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-slate-900">{topic.name}</h1>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getLevelColor(topic.level)}`}>
                  {topic.level}
                </span>
              </div>
              <p className="text-slate-600 mb-4">{topic.description}</p>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-[#E8EAFF] rounded-lg">
                  <BookOpen className="w-4 h-4 text-[#4255FF]" />
                  <span className="text-sm font-medium text-slate-700">
                    {topic.questionCount} questions
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-lg">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-slate-700">
                    ~{topic.estimatedTime} min
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Stats */}
        {progress.completed > 0 && (
          <div className="mb-8 bg-gradient-to-r from-[#00A1E0] to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Your Progress</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-3xl font-bold">{progress.completed}</div>
                <div className="text-indigo-100 text-sm">Questions Completed</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{progress.accuracy.toFixed(0)}%</div>
                <div className="text-indigo-100 text-sm">Accuracy</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{progress.mastery.toFixed(0)}%</div>
                <div className="text-indigo-100 text-sm">Mastery</div>
              </div>
            </div>
          </div>
        )}

        {/* Subtopics */}
        <div className="mb-8 bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-[#00A1E0]" />
            What You'll Learn
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {topic.subtopics.map((subtopic, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <div className="w-8 h-8 bg-[#E8EAFF] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-[#4255FF] font-semibold text-sm">{idx + 1}</span>
                </div>
                <span className="text-slate-700">{subtopic}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Practice Options */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Start Practice</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => handleStartPractice(5)}
              className="p-6 border-2 border-slate-200 rounded-xl hover:border-indigo-400 hover:bg-[#E8EAFF] transition-all group"
            >
              <Play className="w-8 h-8 text-[#00A1E0] mb-2" />
              <div className="font-bold text-slate-900 mb-1">Quick Practice</div>
              <div className="text-sm text-slate-600">5 questions</div>
              <div className="text-xs text-slate-500 mt-2">~5 minutes</div>
            </button>

            <button
              onClick={() => handleStartPractice(10)}
              className="p-6 border-2 border-[#90CAF9] bg-[#E8EAFF] rounded-xl hover:border-[#00A1E0] hover:bg-[#E8EAFF] transition-all group"
            >
              <Play className="w-8 h-8 text-[#00A1E0] mb-2" />
              <div className="font-bold text-slate-900 mb-1">Standard Practice</div>
              <div className="text-sm text-slate-600">10 questions</div>
              <div className="text-xs text-slate-500 mt-2">~10 minutes</div>
            </button>

            <button
              onClick={() => handleStartPractice(20)}
              className="p-6 border-2 border-slate-200 rounded-xl hover:border-indigo-400 hover:bg-[#E8EAFF] transition-all group"
            >
              <Play className="w-8 h-8 text-[#00A1E0] mb-2" />
              <div className="font-bold text-slate-900 mb-1">Deep Practice</div>
              <div className="text-sm text-slate-600">20 questions</div>
              <div className="text-xs text-slate-500 mt-2">~20 minutes</div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
