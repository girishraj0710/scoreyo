"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Flame, BookOpen, Sparkles, CheckCircle2 } from "lucide-react";

interface DPPData {
  dpp: {
    id: string;
    date: string;
    title: string;
    duration: number;
  };
  completed: boolean;
  completionData: {
    score: number;
    total_questions: number;
  } | null;
  streak: number;
}

export function DPPCard() {
  const [data, setData] = useState<DPPData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadDPP() {
      try {
        const res = await fetch('/api/dpp');
        if (res.ok) {
          const dppData = await res.json();
          setData(dppData);
        }
      } catch (err) {
        console.error('Failed to load DPP:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDPP();
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl p-6 shadow-lg text-white" style={{ background: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)" }}>
        <div className="animate-pulse">
          <div className="h-6 bg-white/20 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-white/20 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const { dpp, completed, completionData, streak } = data;

  return (
    <div className="rounded-2xl p-6 shadow-lg text-white relative overflow-hidden h-[400px]" style={{ background: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)" }}>
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-8 h-8" />
            <div>
              <div className="text-xs font-semibold text-indigo-100">
                Daily Practice Problem
              </div>
              <div className="text-lg font-bold">{dpp.title}</div>
            </div>
          </div>

          {streak > 0 && (
            <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
              <Flame className="w-5 h-5" />
              <span className="text-sm font-bold">{streak}</span>
            </div>
          )}
        </div>

        {!completed ? (
          <>
            <div className="flex items-center gap-4 mb-4 text-sm">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span>{dpp.duration} minutes</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
                <span>10 questions</span>
              </div>
            </div>

            <button
              onClick={() => router.push(`/dpp/${dpp.id}`)}
              className="w-full px-4 py-3 bg-white text-[#00A1E0] font-bold rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
            >
              <span>Start Today's DPP</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>

            <div className="mt-3 text-xs text-center text-indigo-100 flex items-center justify-center gap-1">
              Complete daily to build your streak! <Flame className="w-3.5 h-3.5 inline" />
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-white/20 rounded-lg p-3">
              <span className="text-sm font-medium">Your Score</span>
              <span className="text-2xl font-bold">
                {completionData?.score}/{completionData?.total_questions}
              </span>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-2">
                <CheckCircle2 className="w-12 h-12 text-cyan-400" />
              </div>
              <div className="text-sm font-medium">Completed!</div>
              <div className="text-xs text-indigo-100 mt-1">
                Come back tomorrow for a new challenge
              </div>
            </div>

            {streak >= 3 && (
              <div className="text-center text-sm bg-white/20 rounded-lg p-2 flex items-center justify-center gap-1">
                <Sparkles className="w-4 h-4" /> Amazing! {streak}-day streak!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
