"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/context/user-context";
import { useRouter } from "next/navigation";
import { Trophy, Clock, Users, Zap } from "lucide-react";
import { sounds } from "@/lib/sounds";
import { Icon } from "@iconify/react";

interface SprintData {
  sprint: {
    id: string;
    topic: string;
    examId: string;
    subjectId: string;
    startTime: string;
    endTime: string;
    questions: any[];
  };
  participated: boolean;
  participation: any;
  leaderboard: Array<{
    rank: number;
    userId: string;
    name: string;
    score: number;
    total: number;
    time: number;
    isTop10: boolean;
  }>;
  userRank: number;
  isTop10Percent: boolean;
  totalParticipants: number;
}

export default function SprintPage() {
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();

  // Redirect contributors to contributor portal
  useEffect(() => {
    if (!userLoading && user && ["contributor", "admin"].includes(user.role || "")) {
      router.push("/contributor");
    }
  }, [user, userLoading, router]);
  const [sprints, setSprints] = useState<SprintData[]>([]);
  const [noActiveSprint, setNoActiveSprint] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedSprintId, setSelectedSprintId] = useState<string | null>(null);
  const [, setTick] = useState(0); // Force re-render every second for countdown

  useEffect(() => {
    fetchSprintData();
    const interval = setInterval(fetchSprintData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Update countdown every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  async function fetchSprintData() {
    try {
      const res = await fetch("/api/sprint");
      const data = await res.json();

      if (data.error === "Unauthorized") {
        // User not logged in, redirect to login
        router.push("/login?redirect=/sprint");
        return;
      }

      if (data.noActiveSprint) {
        setNoActiveSprint(true);
        setSprints([]);
      } else {
        setNoActiveSprint(false);
        const validSprints = (data.sprints || []).filter((s: any) => {
          if (!s || !s.sprint || !s.sprint.topic) {
            console.warn("Invalid sprint data:", s);
            return false;
          }
          return true;
        });
        console.log("Valid sprints loaded:", validSprints.length);
        setSprints(validSprints);
        // Don't auto-select - let user click a sprint card
      }
    } catch (error) {
      console.error("Failed to fetch sprint:", error);
    } finally {
      setLoading(false);
    }
  }

  function joinSprint(sprintId: string) {
    sounds.click();
    router.push(`/quiz?mode=sprint&sprintId=${sprintId}`);
  }

  function getTimeRemaining(endTime: string): string {
    const now = new Date().getTime();
    const end = new Date(endTime).getTime();
    const diff = end - now;

    if (diff <= 0) return "Ended";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="h-8 w-64 /70 rounded shimmer mb-2" style={{ background: "var(--background)" }}></div>
            <div className="h-4 w-96 /70 rounded shimmer" style={{ background: "var(--background)" }}></div>
          </div>
          <div className="/70 rounded-xl p-6 mb-6 shimmer h-48" style={{ background: "var(--background)" }}></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="/70 backdrop-blur-sm rounded-xl p-6 h-64 shimmer" style={{ background: "var(--card-bg)" }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (noActiveSprint) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="relative overflow-hidden bg-[#4255FF] rounded-2xl shadow-xl shadow-indigo-500/20 p-12 text-center">
            <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full /10 blur-3xl" style={{ background: "var(--card-bg)" }} />
            <div className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-fuchsia-400/20 blur-3xl" />
            <div className="relative">
              <div className="w-16 h-16 /15 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg" style={{ background: "var(--card-bg)" }}>
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">No Active Sprints</h2>
              <p className="text-indigo-100 mb-6">
                Check back soon for the next competitive sprint challenge!
              </p>
              <button
                onClick={() => router.push("/dashboard")}
                className="px-6 py-2 bg-white text-[#4255FF] hover:/90 font-medium rounded-lg transition-colors shadow-lg" style={{ background: "var(--card-bg)" }}
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function getCategory(examId: string): {
    name: string;
    icon: string;
    color: string;
    iconBg: string;
    accent: string;
    glow: string;
  } {
    const categories: Record<string, { name: string; icon: string; color: string; iconBg: string; accent: string; glow: string }> = {
      "general": {
        name: "General Knowledge",
        icon: "noto:globe-showing-asia-australia",
        color: "text-[#4255FF]",
        iconBg: "bg-gradient-to-br from-blue-500 to-cyan-500",
        accent: "from-blue-500/10 to-cyan-500/5",
        glow: "hover:shadow-blue-500/20",
      },
      "jee-main": {
        name: "JEE Main",
        icon: "noto:gear",
        color: "text-orange-600",
        iconBg: "bg-gradient-to-br from-orange-500 to-red-500",
        accent: "from-orange-500/10 to-red-500/5",
        glow: "hover:shadow-orange-500/20",
      },
      "neet": {
        name: "NEET",
        icon: "noto:stethoscope",
        color: "text-emerald-600",
        iconBg: "bg-gradient-to-br from-emerald-500 to-teal-500",
        accent: "from-emerald-500/10 to-teal-500/5",
        glow: "hover:shadow-emerald-500/20",
      },
      "upsc-prelims": {
        name: "UPSC",
        icon: "noto:classical-building",
        color: "text-purple-600",
        iconBg: "bg-gradient-to-br from-purple-500 to-fuchsia-500",
        accent: "from-purple-500/10 to-fuchsia-500/5",
        glow: "hover:shadow-purple-500/20",
      },
      "cat": {
        name: "CAT",
        icon: "noto:briefcase",
        color: "text-[#4255FF]",
        iconBg: "bg-gradient-to-br from-[#4255FF] to-violet-500",
        accent: "from-[#4255FF]/10 to-violet-500/5",
        glow: "hover:shadow-indigo-500/20",
      },
      "gate-cse": {
        name: "GATE CSE",
        icon: "noto:laptop",
        color: "text-cyan-600",
        iconBg: "bg-gradient-to-br from-cyan-500 to-sky-500",
        accent: "from-cyan-500/10 to-sky-500/5",
        glow: "hover:shadow-cyan-500/20",
      },
      "ssc-cgl": {
        name: "SSC CGL",
        icon: "noto:office-building",
        color: "text-pink-600",
        iconBg: "bg-gradient-to-br from-pink-500 to-rose-500",
        accent: "from-pink-500/10 to-rose-500/5",
        glow: "hover:shadow-pink-500/20",
      },
      "ibps-po": {
        name: "Banking",
        icon: "noto:bank",
        color: "text-amber-600",
        iconBg: "bg-gradient-to-br from-amber-500 to-yellow-500",
        accent: "from-amber-500/10 to-yellow-500/5",
        glow: "hover:shadow-amber-500/20",
      },
    };
    return categories[examId] || {
      name: examId.toUpperCase(),
      icon: "noto:books",
      color: "text-slate-600",
      iconBg: "bg-gradient-to-br from-slate-500 to-slate-600",
      accent: "from-slate-500/10 to-slate-400/5",
      glow: "hover:shadow-slate-500/20",
    };
  }

  const selectedSprint = sprints.find((s) => s.sprint.id === selectedSprintId);

  // Group sprints by exam ID
  const groupedSprints: Record<string, SprintData[]> = {};
  sprints.forEach((sprint) => {
    if (!sprint || !sprint.sprint) return; // Safety check
    const examId = sprint.sprint.examId;
    if (!examId) return; // Safety check
    if (!groupedSprints[examId]) {
      groupedSprints[examId] = [];
    }
    groupedSprints[examId].push(sprint);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#4255FF] rounded-lg shadow-md shadow-indigo-500/20">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold " style={{ color: "var(--foreground)" }}>Live Sprint Challenges</h1>
          </div>
          <p className=" text-sm" style={{ color: "var(--foreground)" }}>
            {sprints.length} active challenges • Compete with students across India in real-time
          </p>
        </div>

        {/* Leaderboard Section */}
        <div className="mb-8">
        {!selectedSprint ? (
          <div key="placeholder" className="relative overflow-hidden bg-[#4255FF] rounded-2xl shadow-xl shadow-indigo-500/20 p-8 text-center transition-all duration-300">
            <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full /10 blur-3xl" style={{ background: "var(--card-bg)" }} />
            <div className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-fuchsia-400/20 blur-3xl" />
            <div className="relative">
              <div className="w-16 h-16 /15 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg" style={{ background: "var(--card-bg)" }}>
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Select a Sprint to View Leaderboard</h3>
              <p className="text-indigo-100 text-sm max-w-md mx-auto">
                Click on any sprint challenge below to see live rankings and compete with others
              </p>
              <div className="flex items-center justify-center gap-8 mt-6 text-sm text-indigo-100">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Live Rankings</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>24h Challenges</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  <span>Instant Results</span>
                </div>
              </div>
            </div>
          </div>
        ) : selectedSprint && selectedSprint.sprint ? (
          <div key={selectedSprint.sprint.id} className="relative overflow-hidden bg-[#4255FF] rounded-2xl shadow-xl shadow-indigo-500/20 p-4 transition-all duration-300">
            <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full /10 blur-3xl" style={{ background: "var(--card-bg)" }} />
            <div className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-fuchsia-400/20 blur-3xl" />
            <div className="relative">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/20">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 /15 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: "var(--card-bg)" }}>
                  <Icon icon={getCategory(selectedSprint.sprint.examId).icon} className="w-9 h-9" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">
                    {selectedSprint.sprint.topic || "Sprint Challenge"}
                  </h2>
                  <div className="flex items-center gap-3 text-sm text-indigo-100">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {selectedSprint.totalParticipants || 0} competing
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Trophy className="w-4 h-4 text-yellow-300" />
                      Live Rankings
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedSprintId(null)}
                className="shrink-0 text-xs font-semibold text-white/90 bg-white/10 hover:/20 border border-white/20 rounded-full px-3 py-1.5 transition-colors" style={{ background: "var(--card-bg)" }}
                aria-label="Close leaderboard"
              >
                Close
              </button>
            </div>

            {selectedSprint.leaderboard.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 /15 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg" style={{ background: "var(--card-bg)" }}>
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Be the First Champion!</h4>
                <p className="text-indigo-100 text-sm mb-4 max-w-sm mx-auto">
                  No one has attempted this sprint yet. Start now and claim the #1 spot on the leaderboard!
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    joinSprint(selectedSprint.sprint.id);
                  }}
                  className="px-6 py-2 bg-white text-[#4255FF] hover:/90 font-medium rounded-lg transition-colors shadow-lg" style={{ background: "var(--card-bg)" }}
                >
                  Start Sprint Challenge
                </button>
              </div>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {selectedSprint.leaderboard.map((entry) => (
                  <div
                    key={entry.userId}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors backdrop-blur-sm ${
                      entry.isTop10
                        ? "bg-yellow-50/90 border-yellow-200/70 shadow-sm"
                        : "bg-white/90 border-white/30 hover:bg-white/95 shadow-sm"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                          entry.rank === 1
                            ? "bg-gradient-to-br from-yellow-400 to-yellow-500 text-white shadow-md"
                            : entry.rank === 2
                            ? "bg-gradient-to-br from-slate-300 to-slate-400 text-white shadow-md"
                            : entry.rank === 3
                            ? "bg-gradient-to-br from-orange-400 to-orange-500 text-white shadow-md"
                            : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {entry.rank <= 3 ? (
                          <span className="text-lg">{entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : "🥉"}</span>
                        ) : (
                          `#${entry.rank}`
                        )}
                      </div>
                      <div>
                        <div className="font-semibold  mb-1" style={{ color: "var(--foreground)" }}>{entry.name}</div>
                        <div className="flex items-center gap-3 text-xs " style={{ color: "var(--foreground)" }}>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {Math.floor(entry.time / 60)}:{(entry.time % 60).toString().padStart(2, '0')}
                          </span>
                          <span>•</span>
                          <span>{entry.score}/{entry.total} correct</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold  mb-1" style={{ color: "var(--foreground)" }}>
                        {Math.round((entry.score / entry.total) * 100)}%
                      </div>
                      {entry.isTop10 && (
                        <div className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 border border-yellow-300 text-yellow-700 text-xs font-semibold rounded-full">
                          <Trophy className="w-3 h-3" />
                          Top 10%
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            </div>
          </div>
        ) : null}
        </div>

        {/* Grouped Sprint Cards */}
        {Object.entries(groupedSprints).map(([examId, categorysprints]) => {
          const category = getCategory(examId);
          return (
          <div key={examId} className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Icon icon={category.icon} className="w-6 h-6" />
              <h2 className="text-lg font-semibold " style={{ color: "var(--foreground)" }}>{category.name}</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categorysprints.filter((s) => s && s.sprint).map((sprintData) => {
            const timeLeft = getTimeRemaining(sprintData.sprint.endTime);
            const isSelected = selectedSprintId === sprintData.sprint.id;
            const sprintCategory = getCategory(sprintData.sprint.examId);

            return (
              <div
                key={sprintData.sprint.id}
                onClick={() =>
                  setSelectedSprintId((current) =>
                    current === sprintData.sprint.id ? null : sprintData.sprint.id
                  )
                }
                className={`group relative overflow-hidden bg-white rounded-2xl border p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1 ${sprintCategory.glow} ${
                  isSelected
                    ? "border-indigo-400 shadow-xl ring-2 ring-indigo-100"
                    : "border-slate-200/80 shadow-sm hover:shadow-xl"
                }`}
              >
                {/* Soft gradient accent in the background */}
                <div
                  className={`pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full bg-gradient-to-br ${sprintCategory.accent} blur-2xl opacity-70 group-hover:opacity-100 transition-opacity`}
                />

                {/* Subtle top accent bar in category color */}
                <div className={`absolute top-0 left-0 right-0 h-1 ${sprintCategory.iconBg}`} />

                <div className="relative">
                  <div className="flex justify-between items-start gap-3 mb-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-semibold  mb-1.5 line-clamp-2" style={{ color: "var(--foreground)" }}>
                        {sprintData.sprint?.topic || "Sprint Challenge"}
                      </h3>
                      <div className="inline-flex items-center gap-1.5 text-xs " style={{ color: "var(--foreground)" }}>
                        <Clock className="w-3.5 h-3.5" />
                        <span className="font-medium">{timeLeft} remaining</span>
                      </div>
                    </div>
                    {sprintData.participated && (
                      <div className="shrink-0 inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold px-2 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Done
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mb-4">
                    <div className="flex items-center gap-1.5  border /70  text-xs font-medium px-2.5 py-1.5 rounded-lg" style={{ background: "var(--background)" }} style={{ borderColor: "var(--card-border)" }} style={{ color: "var(--foreground)" }}>
                      <Users className="w-3.5 h-3.5 " style={{ color: "var(--foreground)" }} />
                      <span>{sprintData.totalParticipants}</span>
                    </div>
                    <div className="flex items-center gap-1.5  border /70  text-xs font-medium px-2.5 py-1.5 rounded-lg" style={{ background: "var(--background)" }} style={{ borderColor: "var(--card-border)" }} style={{ color: "var(--foreground)" }}>
                      <Trophy className="w-3.5 h-3.5 " style={{ color: "var(--foreground)" }} />
                      <span>{sprintData.sprint.questions.length} Qs</span>
                    </div>
                  </div>

                  {sprintData.participated ? (
                    <div className="/80 backdrop-blur-sm rounded-xl p-3 border /70" style={{ background: "var(--background)" }} style={{ borderColor: "var(--card-border)" }}>
                      <div className="text-[11px] uppercase tracking-wide  mb-1 font-semibold" style={{ color: "var(--foreground)" }}>Your Score</div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold  leading-tight" style={{ color: "var(--foreground)" }}>
                            {sprintData.participation.score}/{sprintData.participation.total_questions}
                          </div>
                          <div className="text-xs " style={{ color: "var(--foreground)" }}>
                            {Math.round((sprintData.participation.score / sprintData.participation.total_questions) * 100)}% accuracy
                          </div>
                        </div>
                        {sprintData.userRank && (
                          <div className="text-right">
                            <div className={`text-xl font-bold ${sprintCategory.color}`}>
                              #{sprintData.userRank}
                            </div>
                            {sprintData.isTop10Percent && (
                              <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-semibold rounded-full">
                                <Trophy className="w-3 h-3" />
                                Top 10%
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        joinSprint(sprintData.sprint.id);
                      }}
                      className="w-full px-4 py-2.5 bg-slate-900 hover: text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 group/btn" style={{ background: "var(--background)" }}
                    >
                      Join Sprint
                      <span className="transition-transform group-hover/btn:translate-x-0.5">→</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
            </div>
          </div>
        );
        })}
      </div>
    </div>
  );
}
