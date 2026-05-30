"use client";

import { useState, useEffect } from "react";
import { useLocale } from "@/context/locale-context";

export default function ReportsPage() {
  const { t } = useLocale();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [proRequired, setProRequired] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/reports");
        if (res.status === 403) {
          setProRequired(true);
          return;
        }
        if (res.ok) {
          const jsonData = await res.json();
          setData(jsonData);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6 h-48 shimmer" />
          ))}
        </div>
      </div>
    );
  }

  if (proRequired) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl p-12 shadow-lg border border-amber-200">
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Pro Feature</h2>
          <p className="text-slate-500 mb-6">Upgrade to access detailed reports</p>
          <a href="/pricing" className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-500 text-white font-semibold rounded-xl">
            Upgrade to Pro
          </a>
        </div>
      </div>
    );
  }

  const totalSessions = data?.stats?.totalSessions ? Number(data.stats.totalSessions) : 0;

  if (!data || !data.stats || totalSessions === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl p-12 shadow-lg border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-3">No Report Data</h2>
          <p className="text-slate-500 mb-6">Take some quizzes to see your performance reports</p>
          <a href="/" className="inline-block px-8 py-3 bg-gradient-to-r from-indigo-600 to-violet-500 text-white font-semibold rounded-xl shadow-lg">
            Start Quiz
          </a>
        </div>
      </div>
    );
  }

  const { stats } = data;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">
          <span className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
            Performance Reports
          </span>
        </h1>
        <p className="text-slate-500">Detailed analytics of your preparation</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 text-center">
          <div className="text-3xl font-bold text-violet-600">{stats.totalSessions}</div>
          <div className="text-xs text-slate-500 mt-1">Total Quizzes</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 text-center">
          <div className="text-3xl font-bold text-emerald-600">{stats.totalQuestions}</div>
          <div className="text-xs text-slate-500 mt-1">Questions Solved</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 text-center">
          <div className="text-3xl font-bold text-cyan-600">{stats.accuracy}%</div>
          <div className="text-xs text-slate-500 mt-1">Accuracy</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 text-center">
          <div className="text-3xl font-bold text-amber-500">{stats.streak}</div>
          <div className="text-xs text-slate-500 mt-1">Day Streak</div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <p className="text-slate-600 text-center">
          Detailed charts and breakdowns are being optimized and will be available soon.
        </p>
      </div>
    </div>
  );
}
