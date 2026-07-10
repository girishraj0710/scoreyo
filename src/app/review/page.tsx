"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/context/user-context";
import { useRouter } from "next/navigation";
import { useLocale } from "@/context/locale-context";
import { getExamById } from "@/lib/exams";
import { ColorfulExamIcon } from "@/lib/colorful-exam-icons";
import { AccessibilityWrapper } from "@/components/accessibility-wrapper";

interface ReviewTopic {
  exam_id: string;
  subject_id: string;
  topic: string;
  total_attempted: number;
  total_correct: number;
  mastery_score: number;
  last_attempted: string;
  next_review: string;
}

export default function ReviewPage() {
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();

  // Redirect contributors to contributor portal
  useEffect(() => {
    if (!userLoading && user && ["contributor", "admin"].includes(user.role || "")) {
      router.push("/contributor");
    }
  }, [user, userLoading, router]);
  const { t } = useLocale();
  const [overdue, setOverdue] = useState<ReviewTopic[]>([]);
  const [dueToday, setDueToday] = useState<ReviewTopic[]>([]);
  const [upcoming, setUpcoming] = useState<ReviewTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/review")
      .then((r) => r.json())
      .then((data) => {
        setOverdue(data.overdue || []);
        setDueToday(data.dueToday || []);
        setUpcoming(data.upcoming || []);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  const totalDue = overdue.length + dueToday.length;

  if (isLoading) {
    return (
      <AccessibilityWrapper>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl p-6 h-24 shimmer" style={{ background: "var(--card-bg)" }} />
          ))}
        </div>
      </div>
      </AccessibilityWrapper>
    );
  }

  const TopicCard = ({ topic, urgency }: { topic: ReviewTopic; urgency: "overdue" | "today" | "upcoming" }) => {
    const exam = getExamById(topic.exam_id);
    const mastery = Math.round(topic.mastery_score);
    const masteryColorVar = mastery >= 70 ? "var(--muted)" : mastery >= 50 ? "var(--warning, #d97706)" : "var(--danger)";
    const masteryBg = mastery >= 70 ? "bg-cyan-400" : mastery >= 50 ? "bg-amber-500" : "bg-red-500";

    return (
      <div className="rounded-xl p-4 border-2" style={{
        background: "var(--card-bg)",
        borderColor: urgency === "overdue" ? "var(--danger-border, #fecaca)" : urgency === "today" ? "var(--warning-border, #fde68a)" : "var(--card-border)"
      }}>
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <ColorfulExamIcon
                examId={topic.exam_id}
                size={40}
              />
              <span className="text-sm font-medium text-[#E76F51]">{exam?.name || topic.exam_id}</span>
            </div>
            <h3 className="font-semibold truncate" style={{ color: "var(--foreground)" }}>{topic.topic}</h3>
            <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: "var(--muted)" }}>
              <span>{topic.total_attempted} {t("questionsAttempted")}</span>
              <span>|</span>
              <span>{t("lastPracticed")}: {formatDate(topic.last_attempted)}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 ml-4">
            {/* Mastery Score */}
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: masteryColorVar }}>{mastery}%</div>
              <div className="text-xs" style={{ color: "var(--muted)" }}>{t("mastery")}</div>
              <div className="w-16 rounded-full h-1.5 mt-1" style={{ background: "var(--hover-bg)" }}>
                <div className={`${masteryBg} h-1.5 rounded-full`} style={{ width: `${mastery}%` }} />
              </div>
            </div>

            {/* Review Button */}
            <a
              href={`/quiz?examId=${topic.exam_id}&subjectId=${topic.subject_id}&topic=${encodeURIComponent(topic.topic)}&count=5&difficulty=mixed`}
              className={`px-4 py-2 text-sm font-medium rounded-lg text-white shrink-0 ${
                urgency === "overdue"
                  ? "bg-red-500 hover:bg-red-600"
                  : urgency === "today"
                    ? "bg-amber-500 hover:bg-amber-600"
                    : "bg-slate-500 hover:bg-[#E76F51]"
              }`}
            >
              {t("reviewNow")}
            </a>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AccessibilityWrapper>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>{t("reviewTitle")}</h1>
        <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>{t("reviewSubtitle")}</p>
        {totalDue > 0 && (
          <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-full">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-amber-700">
              {totalDue} {t("topicsDueForReview")}
            </span>
          </div>
        )}
      </div>

      {/* Empty State */}
      {overdue.length === 0 && dueToday.length === 0 && upcoming.length === 0 && (
        <div className="rounded-2xl p-12 shadow-lg border text-center" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
          <div className="flex justify-center mb-4">
            <svg className="w-24 h-24 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--foreground)" }}>{t("allCaughtUp")}</h2>
          <p className="mb-6" style={{ color: "var(--muted)" }}>{t("noReviewsDesc")}</p>
          <a
            href="/"
            className="inline-block px-8 py-3 bg-[#E76F51] text-white font-semibold rounded-xl shadow-lg"
          >
            {t("startQuiz")} →
          </a>
        </div>
      )}

      {/* Overdue Section */}
      {overdue.length > 0 && (
        <section className="mb-8">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-red-600 mb-3">
            <span className="w-3 h-3 bg-red-500 rounded-full" />
            {t("overdueTopics")} ({overdue.length})
          </h2>
          <div className="space-y-3">
            {overdue.map((topic, idx) => (
              <TopicCard key={idx} topic={topic} urgency="overdue" />
            ))}
          </div>
        </section>
      )}

      {/* Due Today Section */}
      {dueToday.length > 0 && (
        <section className="mb-8">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-amber-600 mb-3">
            <span className="w-3 h-3 bg-amber-500 rounded-full" />
            {t("dueTodayTopics")} ({dueToday.length})
          </h2>
          <div className="space-y-3">
            {dueToday.map((topic, idx) => (
              <TopicCard key={idx} topic={topic} urgency="today" />
            ))}
          </div>
        </section>
      )}

      {/* Upcoming Section */}
      {upcoming.length > 0 && (
        <section className="mb-8">
          <h2 className="flex items-center gap-2 text-lg font-semibold mb-3" style={{ color: "var(--foreground-secondary)" }}>
            <span className="w-3 h-3 bg-indigo-400 rounded-full" />
            {t("upcomingTopics")} ({upcoming.length})
          </h2>
          <div className="space-y-3">
            {upcoming.map((topic, idx) => (
              <TopicCard key={idx} topic={topic} urgency="upcoming" />
            ))}
          </div>
        </section>
      )}
    </div>
    </AccessibilityWrapper>
  );
}
