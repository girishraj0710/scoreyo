"use client";

import { useState, useEffect } from "react";
import { useLocale } from "@/context/locale-context";
import { getExamById, getSubjectById } from "@/lib/exams";
import { getExamIcon } from "@/lib/professional-icons";
import { BarChart3, Star, TrendingUp, Target, Zap, CheckCircle2 } from "lucide-react";

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
          setData(await res.json());
        }
      } catch {
        // ignore
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
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-amber-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">{t("reportsProOnly")}</h2>
          <p className="text-slate-500 mb-6">{t("reportsProDesc")}</p>
          <div className="flex gap-3 justify-center">
            <a href="/pricing" className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-500 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-violet-600 shadow-lg">
              {t("upgradeToPro")}
            </a>
            <a href="/dashboard" className="px-6 py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200">
              {t("dashboard")}
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!data || !data.stats) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl p-12 shadow-lg border border-slate-200">
          <div className="flex justify-center mb-6">
            <BarChart3 className="w-20 h-20 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">{t("noReportData")}</h2>
          <p className="text-slate-500 mb-6">{t("noReportDataDesc")}</p>
          <a href="/" className="inline-block px-8 py-3 bg-gradient-to-r from-indigo-600 to-violet-500 text-white font-semibold rounded-xl shadow-lg">
            {t("startQuiz")}
          </a>
        </div>
      </div>
    );
  }

  const { stats, subjectBreakdown, dailyActivity, difficultyBreakdown, timeTrend, accuracyTrend, strongTopics, weakTopics, mockTestHistory } = data;

  // Calculate max for bar charts
  const maxDailyQuestions = Math.max(...dailyActivity.map((d: any) => d.questions), 1);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">
          <span className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
            {t("reportsTitle")}
          </span>
        </h1>
        <p className="text-slate-500">{t("reportsSubtitle")}</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 text-center">
          <div className="text-3xl font-bold text-violet-600">{stats.totalSessions}</div>
          <div className="text-xs text-slate-500 mt-1">{t("totalQuizzes")}</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 text-center">
          <div className="text-3xl font-bold text-emerald-600">{stats.totalQuestions}</div>
          <div className="text-xs text-slate-500 mt-1">{t("questionsSolved")}</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 text-center">
          <div className="text-3xl font-bold text-cyan-600">{stats.accuracy}%</div>
          <div className="text-xs text-slate-500 mt-1">{t("accuracy")}</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 text-center">
          <div className="text-3xl font-bold text-amber-500">{stats.streak}</div>
          <div className="text-xs text-slate-500 mt-1">{t("dayStreak")}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Subject-wise Breakdown */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">{t("subjectPerformance")}</h3>
          {subjectBreakdown.length === 0 ? (
            <p className="text-slate-400 text-sm">{t("noExamData")}</p>
          ) : (
            <div className="space-y-3">
              {subjectBreakdown.map((s: any, idx: number) => {
                const exam = getExamById(s.exam_id);
                const subject = getSubjectById(s.exam_id, s.subject_id);
                return (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-700 truncate">
                          {subject?.name || s.subject_id}
                          <span className="text-xs text-slate-400 ml-1">({exam?.name})</span>
                        </span>
                        <span className={`text-sm font-bold ${s.accuracy >= 70 ? "text-slate-500" : s.accuracy >= 50 ? "text-amber-600" : "text-red-600"}`}>
                          {s.accuracy}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 mt-1">
                        <div
                          className={`h-2 rounded-full ${s.accuracy >= 70 ? "bg-cyan-400" : s.accuracy >= 50 ? "bg-amber-500" : "bg-red-500"}`}
                          style={{ width: `${s.accuracy}%` }}
                        />
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        {s.total_correct}/{s.total_questions} {t("correct")} | {s.total_sessions} {t("quizzes")}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quiz Performance Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">{t("performanceDistribution")}</h3>
          {difficultyBreakdown.length === 0 ? (
            <p className="text-slate-400 text-sm">{t("noExamData")}</p>
          ) : (
            <div className="space-y-4">
              {[
                { band: "excellent", label: t("excellentRange"), color: "bg-cyan-400", textColor: "text-slate-500", IconComponent: Star },
                { band: "good", label: t("goodRange"), color: "bg-slate-500", textColor: "text-indigo-600", IconComponent: TrendingUp },
                { band: "average", label: t("averageRange"), color: "bg-amber-500", textColor: "text-amber-600", IconComponent: BarChart3 },
                { band: "needs_work", label: t("needsWorkRange"), color: "bg-red-500", textColor: "text-red-600", IconComponent: Target },
              ].map((band) => {
                const item = difficultyBreakdown.find((d: any) => d.performance_band === band.band);
                const count = item?.count || 0;
                const total = difficultyBreakdown.reduce((sum: number, d: any) => sum + d.count, 0);
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={band.band}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-slate-600 flex items-center gap-1.5">
                        <band.IconComponent className={`w-3.5 h-3.5 ${band.textColor}`} />
                        {band.label}
                      </span>
                      <span className={`text-sm font-bold ${band.textColor}`}>{count} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3">
                      <div className={`h-3 rounded-full ${band.color}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Daily Activity Chart */}
      {dailyActivity.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">{t("dailyActivity")}</h3>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm bg-emerald-400"></div>
                <span>≥70% accuracy</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm bg-amber-400"></div>
                <span>50-69%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm bg-red-400"></div>
                <span>&lt;50%</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {/* Y-axis title (rotated) */}
            <div className="flex items-center justify-center w-4">
              <span className="text-[10px] text-slate-500 font-medium -rotate-90 whitespace-nowrap">Questions</span>
            </div>
            {/* Y-axis labels */}
            <div className="flex flex-col items-end justify-between text-xs text-slate-400 h-48 py-1 pr-2 border-r border-slate-200">
              <span>{maxDailyQuestions}</span>
              <span>{Math.round(maxDailyQuestions * 0.75)}</span>
              <span>{Math.round(maxDailyQuestions * 0.5)}</span>
              <span>{Math.round(maxDailyQuestions * 0.25)}</span>
              <span>0</span>
            </div>
            {/* Chart bars */}
            <div className="flex-1 flex items-end gap-1 h-48 relative">
              {dailyActivity.map((d: any, idx: number) => {
                const heightPx = Math.max((d.questions / maxDailyQuestions) * 192, 4); // 192px = h-48
                const acc = d.questions > 0 ? Math.round((d.correct / d.questions) * 100) : 0;
                return (
                  <div key={idx} className="flex-1 flex flex-col justify-end group h-full">
                    <div
                      className="w-full rounded-t-sm relative"
                      style={{ height: `${heightPx}px` }}
                      title={`${d.day}: ${d.questions} questions, ${acc}% accuracy`}
                    >
                      {/* Bar color */}
                      <div className={`w-full h-full rounded-t-sm ${acc >= 70 ? "bg-emerald-400" : acc >= 50 ? "bg-amber-400" : "bg-red-400"}`} />
                      {/* Tooltip - positioned above the bar */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-800 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap z-20 pointer-events-none shadow-lg">
                        <div className="font-semibold">{new Date(d.day).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</div>
                        <div className="text-slate-300">{d.questions} questions attempted</div>
                        <div className={`font-semibold ${acc >= 70 ? "text-emerald-300" : acc >= 50 ? "text-amber-300" : "text-red-300"}`}>{acc}% accuracy</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* X-axis labels and title */}
          <div className="ml-16">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>{dailyActivity.length > 0 ? new Date(dailyActivity[0].day).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : ""}</span>
              <span>{dailyActivity.length > 0 ? new Date(dailyActivity[dailyActivity.length - 1].day).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : ""}</span>
            </div>
            <div className="text-center text-[10px] text-slate-500 font-medium">Date</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Strongest Topics */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-emerald-500" /> {t("strongestTopics")}
          </h3>
          {strongTopics.length === 0 ? (
            <p className="text-slate-400 text-sm">{t("moreQuizzesNeeded")}</p>
          ) : (
            <div className="space-y-2">
              {strongTopics.map((topic: any, idx: number) => {
                const exam = getExamById(topic.exam_id);
                return (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-emerald-100">
                    <div>
                      <div className="text-sm font-medium text-slate-700">{topic.topic}</div>
                      <div className="text-xs text-slate-400">{exam?.name} | {topic.total_attempted} Q</div>
                    </div>
                    <div className="text-lg font-bold text-slate-500">{Math.round(topic.mastery_score)}%</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Weakest Topics */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-red-500" /> {t("weakestTopics")}
          </h3>
          {weakTopics.length === 0 ? (
            <p className="text-slate-400 text-sm">{t("moreQuizzesNeeded")}</p>
          ) : (
            <div className="space-y-2">
              {weakTopics.map((topic: any, idx: number) => {
                const exam = getExamById(topic.exam_id);
                return (
                  <div key={idx} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                    <div>
                      <div className="text-sm font-medium text-slate-700">{topic.topic}</div>
                      <div className="text-xs text-slate-400">{exam?.name} | {topic.total_attempted} Q</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-red-600">{Math.round(topic.mastery_score)}%</span>
                      <a
                        href={`/quiz?examId=${topic.exam_id}&subjectId=${topic.subject_id}&topic=${encodeURIComponent(topic.topic)}&count=5&difficulty=mixed`}
                        className="text-xs text-indigo-600 bg-slate-50 px-2 py-1 rounded hover:bg-indigo-100"
                      >
                        {t("practice")}
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Accuracy Trend */}
      {accuracyTrend.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">{t("accuracyTrend")}</h3>
          <div className="flex gap-2">
            {/* Y-axis title (rotated) */}
            <div className="flex items-center justify-center w-4">
              <span className="text-[10px] text-slate-500 font-medium -rotate-90 whitespace-nowrap">Accuracy</span>
            </div>
            {/* Y-axis labels */}
            <div className="flex flex-col items-end justify-between text-xs text-slate-400 h-48 py-1 pr-2 border-r border-slate-200">
              <span>100%</span>
              <span>75%</span>
              <span>50%</span>
              <span>25%</span>
              <span>0%</span>
            </div>
            {/* Chart bars */}
            <div className="flex-1 flex items-end gap-2 h-48 relative">
              {accuracyTrend.map((item: any, idx: number) => {
                const accuracy = item.accuracy || 0;
                const heightPx = Math.max((accuracy / 100) * 192, 4); // 192px = h-48, accuracy is 0-100
                return (
                  <div key={idx} className="flex-1 flex flex-col justify-end group h-full">
                    <div
                      className="w-full rounded-t-sm relative"
                      style={{ height: `${heightPx}px` }}
                    >
                      {/* Bar color */}
                      <div className={`w-full h-full rounded-t-sm ${heightPx >= 134 ? "bg-indigo-400" : heightPx >= 96 ? "bg-indigo-300" : "bg-indigo-200"}`} />
                      {/* Tooltip - positioned above the bar */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-800 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap z-20 pointer-events-none shadow-lg">
                        <div className="font-semibold">{item.topic || `Quiz #${accuracyTrend.length - idx}`}</div>
                        <div className="text-indigo-300">{accuracy}% accuracy</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* X-axis label */}
          <div className="ml-16 mt-2">
            <div className="text-center text-xs text-slate-400 mb-1">{t("last20Quizzes")}</div>
            <div className="text-center text-[10px] text-slate-500 font-medium">Quiz Sequence (Oldest → Newest)</div>
          </div>
        </div>
      )}

      {/* Mock Test History */}
      {mockTestHistory.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">{t("mockTestHistory")}</h3>
          <div className="space-y-2">
            {mockTestHistory.map((test: any, idx: number) => {
              const exam = getExamById(test.exam_id);
              const acc = test.total_questions > 0 ? Math.round((test.correct_answers / test.total_questions) * 100) : 0;
              const timeUsed = Math.round((test.time_taken_seconds / test.time_limit_seconds) * 100);
              const ExamIcon = getExamIcon(test.exam_id);
              return (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-3">
                    <ExamIcon className="w-5 h-5" style={{ color: exam?.color || "#6366f1" }} />
                    <div>
                      <div className="text-sm font-medium text-slate-700">{exam?.name || test.exam_id}</div>
                      <div className="text-xs text-slate-400">
                        {new Date(test.completed_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        {" | "}{test.correct_answers}/{test.total_questions}
                        {" | "}{timeUsed}% {t("timeUsed")}
                      </div>
                    </div>
                  </div>
                  <div className={`text-lg font-bold ${acc >= 70 ? "text-slate-500" : acc >= 50 ? "text-amber-600" : "text-red-600"}`}>
                    {acc}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
