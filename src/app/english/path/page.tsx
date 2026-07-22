'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/user-context';
import {
  CheckCircle, Clock, Award, TrendingUp, Target,
  ChevronRight, Play, ArrowLeft, Sparkles, Compass, Gauge, Crown, Zap
} from 'lucide-react';
import EnglishAssessmentModal from '@/components/EnglishAssessmentModal';
import { AssessmentResult } from '@/lib/english-assessment-algorithm';
import {
  generateStudyPath,
  type StudyPath,
  type SkillKey,
} from '@/lib/english-study-path';

const SKILL_LABEL: Record<SkillKey, string> = {
  grammar: 'Grammar',
  vocabulary: 'Vocabulary',
  reading: 'Reading',
  usage: 'Writing & Usage',
};

const LEVEL_COLOR: Record<string, string> = {
  A1: '#10B981',
  A2: '#3B82F6',
  B1: '#F59E0B',
  B2: '#8B5CF6',
  C1: '#EF4444',
  C2: '#E76F51',
};

export default function EnglishFullPathPage() {
  const router = useRouter();
  const { user, isLoading } = useUser();

  const [hasCompletedAssessment, setHasCompletedAssessment] = useState(false);
  const [assessmentChecked, setAssessmentChecked] = useState(false);
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [studyPath, setStudyPath] = useState<StudyPath | null>(null);
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set());
  const [expandedLevel, setExpandedLevel] = useState<string | null>(null);

  // Load placement + generated path + real completion state.
  useEffect(() => {
    if (!user) return;

    const cached = localStorage.getItem(`english_assessment_${user.id}`);
    let cachedData: { level?: string; levelName?: string; skillScores?: Record<string, number> } | null = null;
    if (cached) {
      try {
        cachedData = JSON.parse(cached);
        if (cachedData?.level) {
          setHasCompletedAssessment(true);
          setStudyPath(generateStudyPath(cachedData.level, cachedData.skillScores ?? {}));
          setExpandedLevel(cachedData.level);
        }
      } catch {
        /* ignore malformed cache */
      }
    }

    (async () => {
      try {
        const res = await fetch('/api/english/assessment');
        if (res.ok) {
          const data = await res.json();
          if (data.completed) {
            setHasCompletedAssessment(true);
            setStudyPath(
              data.studyPath ?? generateStudyPath(data.level, data.skillScores ?? {})
            );
            setExpandedLevel(data.level);
            localStorage.setItem(
              `english_assessment_${user.id}`,
              JSON.stringify({
                level: data.level,
                levelName: data.levelName,
                skillScores: data.skillScores,
              })
            );
          } else if (cachedData?.level) {
            // Back-compat: placed only in localStorage before server persistence.
            // Backfill the DB (which also generates + stores the path) rather
            // than downgrade the user.
            try {
              await fetch('/api/english/assessment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  level: cachedData.level,
                  levelName: cachedData.levelName || cachedData.level,
                  skillScores: cachedData.skillScores ?? {},
                }),
              });
              setHasCompletedAssessment(true);
              setStudyPath(generateStudyPath(cachedData.level, cachedData.skillScores ?? {}));
              setExpandedLevel(cachedData.level);
            } catch {
              setHasCompletedAssessment(false);
            }
          } else {
            setHasCompletedAssessment(false);
          }
        }
      } catch {
        /* keep optimistic state on network error */
      } finally {
        setAssessmentChecked(true);
      }
    })();

    // Real per-topic completion, independent of assessment.
    (async () => {
      try {
        const res = await fetch('/api/english/completed-topics');
        if (res.ok) {
          const data = await res.json();
          setCompletedTopics(new Set<string>(data.completed ?? []));
        }
      } catch {
        /* non-fatal */
      }
    })();
  }, [user]);

  const handleAssessmentComplete = (result: AssessmentResult) => {
    localStorage.setItem(
      `english_assessment_${user?.id}`,
      JSON.stringify({
        level: result.level,
        levelName: result.levelName,
        skillScores: result.skillScores,
        completedAt: new Date().toISOString(),
      })
    );
    setHasCompletedAssessment(true);
    setStudyPath(generateStudyPath(result.level, result.skillScores));
    setExpandedLevel(result.level);
    setShowAssessmentModal(false);

    fetch('/api/english/assessment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        level: result.level,
        levelName: result.levelName,
        overallScore: result.overallScore,
        skillScores: result.skillScores,
        recommendations: result.recommendations,
        confidence: result.confidence,
      }),
    })
      .then((res) => res.ok && res.json())
      .then((data) => {
        if (data?.studyPath) setStudyPath(data.studyPath);
      })
      .catch((err) => console.error('Failed to persist assessment:', err));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#0F1419]">
        <div className="w-12 h-12 border-4 border-[#E76F51] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    router.push('/');
    return null;
  }

  const handleTopicClick = (pathId: string, topicId: string) => {
    router.push(`/english/${pathId}/${topicId}`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F1419]">
      <EnglishAssessmentModal
        isOpen={showAssessmentModal}
        onClose={() => setShowAssessmentModal(false)}
        onComplete={handleAssessmentComplete}
      />

      <main className="w-full overflow-y-auto">
        <div className="max-w-5xl mx-auto p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => router.push('/english')}
              className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </button>
          </div>

          <div className="bg-white/70 dark:bg-[#1A1F2E]/70 backdrop-blur-xl rounded-2xl border border-slate-200/60 dark:border-slate-700/40 p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#E76F51] to-[#F4A79D] flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  Your Personalized Path to Expert
                </h1>
                <p className="text-slate-600 dark:text-slate-300">
                  A step-by-step roadmap from where you are today all the way to{' '}
                  <span className="font-semibold text-[#E76F51]">Expert (C2)</span> — tailored to
                  your assessment.
                </p>
              </div>
            </div>

            {hasCompletedAssessment && studyPath ? (
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium">
                  <Target className="w-4 h-4" />
                  Starting at {studyPath.currentLevel}
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/30 text-[#E76F51] dark:text-[#F4A79D] font-medium">
                  <Crown className="w-4 h-4" />
                  Goal: Expert (C2)
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                  <Zap className="w-4 h-4" />
                  {studyPath.totalTopics} topics · ~{studyPath.estTotalWeeks} weeks
                </div>
              </div>
            ) : (
              /* Friendly assessment prompt (assessment not taken) */
              <div className="rounded-2xl border border-[#E76F51]/30 bg-gradient-to-br from-[#FFF4F0] to-[#FFECE5] dark:from-[#2A1F1B] dark:to-[#231A16] p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#E76F51] flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                      Find your starting point
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Take a quick 5-minute placement assessment so we can build a path that starts
                      exactly where you are — and takes you all the way to Expert. No time wasted on
                      what you already know.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                  <div className="flex items-start gap-2">
                    <Gauge className="w-5 h-5 text-[#E76F51] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">Know your level</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Get your CEFR level (A1–C1) in minutes.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Compass className="w-5 h-5 text-[#E76F51] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">Skip the basics</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Start from where you belong.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Target className="w-5 h-5 text-[#E76F51] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">Focus your effort</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">See which skills need the most work.</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowAssessmentModal(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E76F51] hover:bg-[#d96043] text-white text-sm font-bold transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  Take the Assessment
                </button>
              </div>
            )}
          </div>

          {/* Generated phased path (only when assessed) */}
          {hasCompletedAssessment && studyPath && (
            <div className="space-y-4">
              {studyPath.phases.map((phase, phaseIndex) => {
                const isExpanded = expandedLevel === phase.cefrLevel;
                const isCurrent = phase.cefrLevel === studyPath.currentLevel;
                const color = LEVEL_COLOR[phase.cefrLevel] ?? '#64748B';
                const doneCount = phase.topics.filter((t) => completedTopics.has(t.id)).length;

                return (
                  <div
                    key={phase.cefrLevel}
                    className="bg-white/70 dark:bg-[#1A1F2E]/70 backdrop-blur-xl rounded-xl border border-slate-200/60 dark:border-slate-700/40 overflow-hidden"
                  >
                    <button
                      onClick={() =>
                        setExpandedLevel(isExpanded ? null : phase.cefrLevel)
                      }
                      className="w-full p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                          style={{ backgroundColor: color }}
                        >
                          {phase.cefrLevel === 'C2' ? <Crown className="w-6 h-6" /> : phase.cefrLevel}
                        </div>
                        <div className="text-left">
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            {phase.name}
                            {isCurrent && (
                              <span className="px-2 py-0.5 text-xs rounded-full bg-[#E76F51] text-white">
                                Start here
                              </span>
                            )}
                            {phase.comingSoon && (
                              <span className="px-2 py-0.5 text-xs rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                                Coming soon
                              </span>
                            )}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-300">
                            {phase.description}
                          </p>
                          {phase.focusSkills.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5 mt-2">
                              <span className="text-[11px] text-slate-400">Focus for you:</span>
                              {phase.focusSkills.map((s) => (
                                <span
                                  key={s}
                                  className="px-2 py-0.5 text-[11px] rounded-full bg-orange-100 dark:bg-orange-900/30 text-[#E76F51] dark:text-[#F4A79D] font-medium"
                                >
                                  {SKILL_LABEL[s]}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {!phase.comingSoon && (
                          <span className="text-sm text-slate-500 dark:text-slate-400">
                            {doneCount}/{phase.topics.length}
                          </span>
                        )}
                        <ChevronRight
                          className={`w-5 h-5 text-slate-400 transition-transform ${
                            isExpanded ? 'rotate-90' : ''
                          }`}
                        />
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-6 pb-6 space-y-3">
                        {phase.comingSoon ? (
                          <div className="rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700 p-6 text-center">
                            <Crown className="w-8 h-8 text-[#E76F51] mx-auto mb-2" />
                            <p className="font-semibold text-slate-900 dark:text-white mb-1">
                              Expert (C2) content is on the way
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              You'll unlock full Proficiency-level lessons here as they're added —
                              the final step to true mastery.
                            </p>
                          </div>
                        ) : (
                          phase.topics.map((topic, index) => {
                            const isDone = completedTopics.has(topic.id);
                            return (
                              <button
                                key={topic.id}
                                onClick={() => handleTopicClick(topic.pathId, topic.id)}
                                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                                  isDone
                                    ? 'border-green-300 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                                    : 'border-slate-200 dark:border-slate-700 hover:border-[#E76F51] hover:bg-orange-50 dark:hover:bg-orange-900/20'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-start gap-4 flex-1">
                                    <div className="mt-1">
                                      {isDone ? (
                                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                                      ) : (
                                        <Play className="w-5 h-5 text-[#E76F51]" />
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="font-semibold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                                        {index + 1}. {topic.name}
                                        {topic.isFocus && (
                                          <span className="px-1.5 py-0.5 text-[10px] rounded bg-orange-100 dark:bg-orange-900/30 text-[#E76F51] dark:text-[#F4A79D] font-semibold">
                                            {SKILL_LABEL[topic.skill]}
                                          </span>
                                        )}
                                      </h4>
                                      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                                        <div className="flex items-center gap-1">
                                          <Clock className="w-3 h-3" />
                                          {topic.estMinutes} min
                                        </div>
                                        <div className="flex items-center gap-1 capitalize">
                                          <Target className="w-3 h-3" />
                                          {SKILL_LABEL[topic.skill]}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <ChevronRight className="w-5 h-5 text-slate-400" />
                                </div>
                              </button>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Legend */}
          <div className="bg-slate-100 dark:bg-slate-800/50 rounded-xl p-6">
            <h3 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-[#E76F51]" />
              How It Works
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Completed</p>
                  <p className="text-slate-600 dark:text-slate-300">Topics you've practiced</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Play className="w-5 h-5 text-[#E76F51] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Available</p>
                  <p className="text-slate-600 dark:text-slate-300">Ready to start anytime</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Crown className="w-5 h-5 text-[#E76F51] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Expert (C2)</p>
                  <p className="text-slate-600 dark:text-slate-300">The final goal — full mastery</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
