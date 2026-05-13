"use client";

import { useState, useEffect } from "react";
import { Target, CheckCircle2, Clock, Gift } from "lucide-react";

interface DailyChallenge {
  id: string;
  challenge_type: string;
  title: string;
  description: string;
  requirement: string;
  target_value: number;
  reward_points: number;
  badge_reward?: string;
  progress?: {
    current_value: number;
    completed: boolean;
    completed_at?: string;
  };
}

export function DailyChallengeWidget() {
  const [challenge, setChallenge] = useState<DailyChallenge | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadChallenge();
  }, []);

  async function loadChallenge() {
    try {
      const res = await fetch("/api/daily-challenge");
      const data = await res.json();
      setChallenge(data.challenge);
    } catch (error) {
      console.error("Failed to load daily challenge:", error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 shimmer h-56" />
    );
  }

  if (!challenge) {
    return (
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 shadow-sm border border-amber-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Daily Challenge</h3>
            <p className="text-sm text-slate-500">Come back tomorrow</p>
          </div>
        </div>

        <div className="text-center py-6">
          <div className="text-5xl mb-3">⏳</div>
          <p className="text-slate-600">New challenge coming soon!</p>
        </div>
      </div>
    );
  }

  const progress = challenge.progress
    ? (challenge.progress.current_value / challenge.target_value) * 100
    : 0;

  const isCompleted = challenge.progress?.completed || false;

  return (
    <div className={`rounded-xl p-6 shadow-sm border-2 ${
      isCompleted
        ? "bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200"
        : "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200"
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            isCompleted
              ? "bg-gradient-to-br from-emerald-500 to-green-500"
              : "bg-gradient-to-br from-amber-500 to-orange-500"
          }`}>
            {isCompleted ? (
              <CheckCircle2 className="w-6 h-6 text-white" />
            ) : (
              <Target className="w-6 h-6 text-white" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Daily Challenge</h3>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Clock className="w-3 h-3" />
              <span>Resets at midnight</span>
            </div>
          </div>
        </div>

        {!isCompleted && challenge.reward_points && (
          <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-full border border-amber-200">
            <Gift className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-bold text-amber-700">
              +{challenge.reward_points}
            </span>
          </div>
        )}

        {isCompleted && (
          <div className="bg-emerald-500 text-white px-4 py-1.5 rounded-full text-sm font-bold">
            ✓ Completed
          </div>
        )}
      </div>

      {/* Challenge Details */}
      <div className="bg-white rounded-lg p-4 border border-slate-200 mb-4">
        <h4 className="font-bold text-slate-800 mb-1">{challenge.title}</h4>
        <p className="text-sm text-slate-600 mb-3">{challenge.description}</p>

        {/* Progress Bar */}
        {!isCompleted && (
          <>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500">{challenge.requirement}</span>
              <span className="text-sm font-bold text-slate-700">
                {challenge.progress?.current_value || 0} / {challenge.target_value}
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${
                  isCompleted
                    ? "bg-gradient-to-r from-emerald-500 to-green-500"
                    : "bg-gradient-to-r from-amber-500 to-orange-500"
                }`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </>
        )}

        {isCompleted && challenge.progress?.completed_at && (
          <div className="text-center py-2">
            <div className="text-4xl mb-2">🎉</div>
            <p className="text-sm text-emerald-700 font-medium">
              Completed at{" "}
              {new Date(challenge.progress.completed_at).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        )}
      </div>

      {/* Reward Info */}
      {!isCompleted && challenge.badge_reward && (
        <div className="bg-amber-100 border border-amber-200 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            <div className="flex-1">
              <p className="text-xs text-amber-700 font-medium">
                Bonus Reward
              </p>
              <p className="text-sm text-amber-900 font-bold">
                Unlock "{challenge.badge_reward}" badge!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      {!isCompleted && (
        <a
          href="/"
          className="block w-full mt-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-center font-semibold rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all"
        >
          Start Challenge
        </a>
      )}
    </div>
  );
}
