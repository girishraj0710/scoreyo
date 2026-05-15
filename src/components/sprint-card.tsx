"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Zap, Clock, Users, Trophy } from "lucide-react";
import { sounds } from "@/lib/sounds";

interface SprintData {
  sprint: {
    id: string;
    topic: string;
    startTime: string;
    endTime: string;
  };
  participated: boolean;
  totalParticipants: number;
  userRank?: number;
}

export function SprintCard() {
  const router = useRouter();
  const [sprintData, setSprintData] = useState<SprintData | null>(null);
  const [noActiveSprint, setNoActiveSprint] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  useEffect(() => {
    fetchSprintData();
  }, []);

  useEffect(() => {
    if (!sprintData || !sprintData.sprint) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(sprintData.sprint.endTime).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeRemaining("Ended");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m`);
      } else {
        setTimeRemaining(`${minutes}m`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [sprintData]);

  async function fetchSprintData() {
    try {
      const res = await fetch("/api/sprint");
      const data = await res.json();

      if (data.noActiveSprint) {
        setNoActiveSprint(true);
      } else if (data.sprints && data.sprints.length > 0) {
        // API now returns array of sprints, pick the first one for the card
        const firstSprint = data.sprints[0];
        if (firstSprint && firstSprint.sprint) {
          setSprintData(firstSprint);
        } else {
          setNoActiveSprint(true);
        }
      } else {
        setNoActiveSprint(true);
      }
    } catch (error) {
      console.error("Failed to fetch sprint:", error);
      setNoActiveSprint(true);
    }
  }

  function handleViewSprint() {
    sounds.click();
    router.push("/sprint");
  }

  if (noActiveSprint) {
    return null; // Don't show card if no active sprint
  }

  if (!sprintData) {
    return null; // Loading or no data
  }

  const { sprint, participated, totalParticipants, userRank } = sprintData;

  return (
    <div className="bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 rounded-xl p-6 shadow-lg text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="w-6 h-6" />
          <h3 className="text-lg font-bold">Live Sprint Challenge</h3>
        </div>
        {participated && (
          <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold">
            ✓ Participated
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-white/80 text-xs mb-1">Topic</p>
          <p className="font-semibold truncate">{sprint?.topic || "Sprint Challenge"}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <div className="flex items-center gap-1.5 text-white/80 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-xs">Time Left</span>
            </div>
            <p className="font-bold">{timeRemaining}</p>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-white/80 mb-1">
              <Users className="w-4 h-4" />
              <span className="text-xs">Participants</span>
            </div>
            <p className="font-bold">{totalParticipants}</p>
          </div>
        </div>

        {participated && userRank && (
          <div className="p-3 bg-white/10 backdrop-blur-sm rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                <span className="text-sm font-semibold">Your Rank</span>
              </div>
              <span className="text-2xl font-bold">#{userRank}</span>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={handleViewSprint}
        className="w-full mt-4 py-2.5 bg-white text-orange-600 font-semibold rounded-lg hover:bg-orange-50 transition-colors flex items-center justify-center gap-2"
      >
        <Zap className="w-4 h-4" />
        {participated ? "View Leaderboard" : "Join Sprint Now"}
      </button>
    </div>
  );
}
