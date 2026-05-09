"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/context/user-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { englishPaths, type EnglishPath } from "@/lib/english-content";
import { BookOpen, Target, TrendingUp, Award, Calendar, Zap } from "lucide-react";

export default function EnglishHubPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [dailyStreak, setDailyStreak] = useState(0);
  const [todayCompleted, setTodayCompleted] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      fetchDailyStreak();
    }
  }, [user]);

  const fetchDailyStreak = async () => {
    try {
      const res = await fetch("/api/english/daily-streak");
      if (res.ok) {
        const data = await res.json();
        setDailyStreak(data.streak || 0);
        setTodayCompleted(data.todayCompleted || false);
      }
    } catch (error) {
      console.error("Failed to fetch daily streak:", error);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const getLevelBadge = (path: EnglishPath) => {
    const levels = [...new Set(path.topics.map(t => t.level))];
    return levels.join(" → ");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold text-slate-900">
              English Learning Hub
            </h1>
            <div className="flex items-center gap-6">
              {/* Daily Streak */}
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-orange-200">
                <Zap className={`w-5 h-5 ${todayCompleted ? 'text-orange-500' : 'text-slate-400'}`} />
                <div>
                  <div className="text-xs text-slate-500">Daily Streak</div>
                  <div className="text-xl font-bold text-orange-600">{dailyStreak} days</div>
                </div>
              </div>
            </div>
          </div>
          <p className="text-slate-600 text-lg">
            Master English for competitive exams, IELTS, TOEFL, and real-world communication
          </p>
        </div>

        {/* Quick Assessment */}
        <div className="mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">🎯 Quick Level Assessment</h2>
              <p className="text-indigo-100 mb-4">
                Take a 3-minute test to find your English level and get a personalized learning path
              </p>
              <Link href="/english/assessment">
                <button className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-all">
                  Start Assessment →
                </button>
              </Link>
            </div>
            <div className="hidden md:block">
              <Target className="w-24 h-24 text-indigo-200 opacity-50" />
            </div>
          </div>
        </div>

        {/* Learning Paths */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Choose Your Learning Path</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {englishPaths.map((path) => (
              <Link key={path.id} href={`/english/${path.id}`}>
                <div
                  className="bg-white rounded-2xl p-6 shadow-sm border-2 border-slate-200 hover:border-indigo-400 hover:shadow-lg transition-all cursor-pointer group"
                  style={{ borderColor: `${path.color}20` }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
                      style={{ backgroundColor: `${path.color}15` }}
                    >
                      {path.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                        {path.name}
                      </h3>
                      <p className="text-sm text-slate-600 mb-3">
                        {path.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                          {getLevelBadge(path)}
                        </span>
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                          {path.totalQuestions} questions
                        </span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                          {path.estimatedWeeks} weeks
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <BookOpen className="w-4 h-4" />
                        <span>{path.topics.length} topics</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Features Highlight */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Why Choose Our English Hub?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">AI-Powered Learning</h3>
                <p className="text-sm text-slate-600">
                  Personalized recommendations based on your performance and goals
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Daily Practice</h3>
                <p className="text-sm text-slate-600">
                  10-minute daily sessions to build habits and maintain streaks
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Award className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Rich Explanations</h3>
                <p className="text-sm text-slate-600">
                  Detailed explanations with examples, traps, and common mistakes
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
