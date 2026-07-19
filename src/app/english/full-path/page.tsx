"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/user-context';
import {
  Brain, BookOpen, Target, Zap, Clock, ChevronRight, CheckCircle,
  Lock, Star, TrendingUp, Award, Sparkles
} from 'lucide-react';

export default function FullPathPage() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const [hasCompletedAssessment, setHasCompletedAssessment] = useState(false);
  const [userLevel, setUserLevel] = useState<string>('B1');
  const [assessmentData, setAssessmentData] = useState<any>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [isLoading, user, router]);

  // Check assessment status
  useEffect(() => {
    if (user) {
      const data = localStorage.getItem(`english_assessment_${user.id}`);
      if (data) {
        const parsed = JSON.parse(data);
        setAssessmentData(parsed);
        setHasCompletedAssessment(true);
        setUserLevel(parsed.level);
      }
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#0F1419]">
        <div className="w-12 h-12 border-4 border-[#E76F51] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // State 1: User HAS completed assessment - Show Personalized Study Plan
  if (hasCompletedAssessment) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F1419]">
        <div className="max-w-7xl mx-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.push('/english')}
              className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-4 transition-colors"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              Back to Dashboard
            </button>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">
              Your Personalized Learning Path
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Based on your {userLevel} ({assessmentData?.levelName}) assessment result
            </p>
          </div>

          {/* Assessment Summary Card */}
          <div className="bg-white dark:bg-[#1A1F2E] rounded-2xl border border-slate-200 dark:border-slate-700 p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 flex items-center justify-center">
                  <Award className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Your Level
                  </div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">
                    {userLevel} - {assessmentData?.levelName}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Overall Score</div>
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  {assessmentData?.overallScore}%
                </div>
              </div>
            </div>

            {/* Skill Breakdown */}
            <div className="grid grid-cols-4 gap-4">
              {Object.entries(assessmentData?.skillScores || {}).map(([skill, score]: [string, any]) => (
                <div key={skill} className="text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">
                    {skill}
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {score}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Path Roadmap */}
          <div className="bg-white dark:bg-[#1A1F2E] rounded-2xl border border-slate-200 dark:border-slate-700 p-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Your Learning Roadmap
            </h2>

            {/* Level Progression */}
            <div className="space-y-6">
              {getLevelRoadmap(userLevel).map((levelData, index) => (
                <LevelCard
                  key={levelData.level}
                  {...levelData}
                  index={index}
                />
              ))}
            </div>
          </div>

          {/* Recommendations */}
          {assessmentData?.recommendations && assessmentData.recommendations.length > 0 && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 p-8 mt-8">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  AI Recommendations
                </h3>
              </div>
              <div className="space-y-3">
                {assessmentData.recommendations.map((rec: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-3 p-4 bg-white dark:bg-slate-800/50 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-slate-700 dark:text-slate-300">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // State 2: User has NOT completed assessment - Show Assessment Prompt
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F1419]">
      <div className="max-w-5xl mx-auto p-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <button
            onClick={() => router.push('/english')}
            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-6 transition-colors"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to Dashboard
          </button>
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 flex items-center justify-center mx-auto mb-6">
            <Brain className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Create Your Personalized Learning Path
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Take our AI-powered assessment to discover your exact English proficiency level and get a customized study plan
          </p>
        </div>

        {/* Assessment Benefits */}
        <div className="bg-white dark:bg-[#1A1F2E] rounded-2xl border border-slate-200 dark:border-slate-700 p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            What You'll Get
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <BenefitCard
              icon={<Target className="w-6 h-6" />}
              title="Accurate Level Assessment"
              description="Get your exact CEFR level (A1 to C2) based on adaptive testing"
              color="blue"
            />
            <BenefitCard
              icon={<BookOpen className="w-6 h-6" />}
              title="Personalized Study Plan"
              description="Topics and exercises tailored to your current proficiency"
              color="purple"
            />
            <BenefitCard
              icon={<TrendingUp className="w-6 h-6" />}
              title="Skill-Specific Insights"
              description="Detailed breakdown of your grammar, vocabulary, reading, and usage"
              color="emerald"
            />
            <BenefitCard
              icon={<Zap className="w-6 h-6" />}
              title="AI-Powered Recommendations"
              description="Smart suggestions on what to focus on to improve fastest"
              color="amber"
            />
          </div>
        </div>

        {/* Assessment Details */}
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 mb-8">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
            How It Works
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="font-semibold text-slate-900 dark:text-white mb-2">5 Minutes</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Quick and easy adaptive test</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="font-semibold text-slate-900 dark:text-white mb-2">10-15 Questions</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">AI adjusts difficulty based on your answers</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="font-semibold text-slate-900 dark:text-white mb-2">Instant Results</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Get your level and personalized plan immediately</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={() => router.push('/english')}
            className="px-12 py-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center gap-3 mx-auto"
          >
            <Brain className="w-6 h-6" />
            Start Assessment Now
            <ChevronRight className="w-6 h-6" />
          </button>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
            No credit card required • Takes only 5 minutes
          </p>
        </div>
      </div>
    </div>
  );
}

// Helper: Get level roadmap based on user's current level
function getLevelRoadmap(currentLevel: string) {
  const allLevels = [
    {
      level: 'A1',
      name: 'Beginner',
      status: 'mastered' as const,
      topics: ['Alphabet & Phonetics', 'Basic Greetings', 'Numbers & Dates', 'Simple Present Tense'],
      color: '#3B82F6'
    },
    {
      level: 'A2',
      name: 'Elementary',
      status: 'mastered' as const,
      topics: ['Past Simple', 'Future Tense', 'Comparatives', 'Basic Conversation'],
      color: '#8B5CF6'
    },
    {
      level: 'B1',
      name: 'Intermediate',
      status: 'active' as const,
      topics: ['Present Perfect', 'Modal Verbs', 'Conditionals', 'Complex Sentences'],
      color: '#10B981'
    },
    {
      level: 'B2',
      name: 'Upper-Intermediate',
      status: 'locked' as const,
      topics: ['Passive Voice', 'Reported Speech', 'Advanced Grammar', 'Idiomatic Expressions'],
      color: '#F59E0B'
    },
    {
      level: 'C1',
      name: 'Advanced',
      status: 'locked' as const,
      topics: ['Subjunctive Mood', 'Formal Writing', 'Complex Structures', 'Academic English'],
      color: '#EC4899'
    },
    {
      level: 'C2',
      name: 'Proficient',
      status: 'locked' as const,
      topics: ['IELTS/TOEFL Prep', 'Native-level Fluency', 'Professional Writing', 'Public Speaking'],
      color: '#EF4444'
    }
  ];

  const levelOrder = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const currentIndex = levelOrder.indexOf(currentLevel);

  return allLevels.map((level, index) => {
    if (index < currentIndex) {
      return { ...level, status: 'mastered' as const };
    } else if (index === currentIndex) {
      return { ...level, status: 'active' as const };
    } else {
      return { ...level, status: 'locked' as const };
    }
  });
}

// Component: Level Card
function LevelCard({ level, name, status, topics, color, index }: any) {
  return (
    <div
      className={`p-6 rounded-2xl border-2 transition-all ${
        status === 'active'
          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
          : status === 'mastered'
          ? 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30'
          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/10 opacity-60'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div
            className={`w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg ${
              status === 'mastered' ? 'bg-green-500' : status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'
            }`}
          >
            {status === 'mastered' ? <CheckCircle className="w-7 h-7" /> : status === 'locked' ? <Lock className="w-7 h-7" /> : level}
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{name}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Level {level}</p>
          </div>
        </div>
        {status === 'active' && (
          <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
            Current Level
          </span>
        )}
        {status === 'mastered' && (
          <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold">
            Mastered
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {topics.map((topic: string, idx: number) => (
          <span
            key={idx}
            className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium"
          >
            {topic}
          </span>
        ))}
      </div>
    </div>
  );
}

// Component: Benefit Card
function BenefitCard({ icon, title, description, color }: any) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    emerald: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
    amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
  };

  return (
    <div className="flex gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClasses[color]}`}>
        {icon}
      </div>
      <div>
        <h4 className="font-semibold text-slate-900 dark:text-white mb-1">{title}</h4>
        <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>
      </div>
    </div>
  );
}
