"use client";

import { useState, useEffect } from "react";
import { BookOpen, Award, Brain, Clock } from "lucide-react";

interface Activity {
  activity_type: string;
  timestamp: string;
  context_id: string;
  subject_id?: string;
  detail?: string;
  metric1?: number;
  metric2?: number;
  metric3?: number;
}

export function RecentlyStudied() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch("/api/activity-feed?limit=5");
        const data = await response.json();
        setActivities(data.activities || []);
      } catch (error) {
        console.error("Error fetching recent activities:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'exam_quiz':
        return <Award className="w-5 h-5 text-blue-500" />;
      case 'english_practice':
        return <Brain className="w-5 h-5 text-purple-500" />;
      case 'english_study':
        return <BookOpen className="w-5 h-5 text-green-500" />;
      case 'exam_study':
        return <BookOpen className="w-5 h-5 text-orange-500" />;
      case 'flashcard':
        return <Clock className="w-5 h-5 text-pink-500" />;
      default:
        return <BookOpen className="w-5 h-5 text-gray-500" />;
    }
  };

  const getActivityLabel = (activity: Activity) => {
    switch (activity.activity_type) {
      case 'exam_quiz':
        return `Quiz: ${activity.subject_id} - ${activity.metric2}/${activity.metric1} correct`;
      case 'english_practice':
        return `English: ${activity.subject_id} - ${activity.metric2}/${activity.metric1} correct`;
      case 'english_study':
        return `Studied: ${activity.subject_id} ${activity.detail ? `(${activity.detail})` : ''}`;
      case 'exam_study':
        return `Studied: ${activity.subject_id}`;
      case 'flashcard':
        return `Flashcards: ${activity.metric2}/${activity.metric1} correct`;
      default:
        return 'Activity';
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl bg-[#FAF8F5] dark:bg-slate-800 p-4 animate-pulse">
            <div className="h-4 bg-gray-300 dark:bg-slate-600 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.length === 0 ? (
        <div className="text-center py-8 text-[#5A6478] dark:text-slate-400">
          No recent activity. Start learning!
        </div>
      ) : (
        activities.map((activity, i) => (
          <div
            key={i}
            className="rounded-xl bg-[#FAF8F5] dark:bg-slate-800 p-4 flex items-center gap-3 hover:bg-white dark:hover:bg-slate-700 transition-colors"
          >
            {getActivityIcon(activity.activity_type)}
            <div className="flex-1">
              <div className="text-sm font-semibold text-[#16213E] dark:text-white">
                {getActivityLabel(activity)}
              </div>
              <div className="text-xs text-[#5A6478] dark:text-slate-400 mt-1">
                {getTimeAgo(activity.timestamp)}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
