'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/user-context';
import {
  BookOpen, Lock, CheckCircle, Clock, Star, Award,
  TrendingUp, Target, ChevronRight, Play, ArrowLeft
} from 'lucide-react';

interface Topic {
  id: string;
  title: string;
  duration: string;
  xp: number;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
  isUnlocked: boolean;
  isCompleted: boolean;
  description: string;
}

interface LevelData {
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
  name: string;
  description: string;
  color: string;
  topics: Topic[];
}

export default function EnglishFullPathPage() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const [userLevel, setUserLevel] = useState<string>('B1');
  const [expandedLevel, setExpandedLevel] = useState<string | null>('B1');

  useEffect(() => {
    if (user) {
      // Load user's assessment data
      const assessmentData = localStorage.getItem(`english_assessment_${user.id}`);
      if (assessmentData) {
        const data = JSON.parse(assessmentData);
        setUserLevel(data.level);
        setExpandedLevel(data.level); // Auto-expand current level
      }
    }
  }, [user]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#0F1419]">
        <div className="w-12 h-12 border-4 border-[#E76F51] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    router.push('/');
    return null;
  }

  // Full learning path data
  const learningPath: LevelData[] = [
    {
      level: 'A1',
      name: 'Beginner',
      description: 'Master the basics: alphabet, simple sentences, common phrases',
      color: '#10B981',
      topics: [
        {
          id: 'alphabet-phonetics',
          title: 'Alphabet & Phonetics',
          duration: '20 min',
          xp: 50,
          level: 'A1',
          isUnlocked: true,
          isCompleted: true,
          description: 'Learn English alphabet, sounds, and pronunciation basics'
        },
        {
          id: 'greetings-introductions',
          title: 'Greetings & Introductions',
          duration: '15 min',
          xp: 40,
          level: 'A1',
          isUnlocked: true,
          isCompleted: true,
          description: 'How to greet people and introduce yourself'
        },
        {
          id: 'basic-nouns',
          title: 'Basic Nouns & Articles',
          duration: '25 min',
          xp: 60,
          level: 'A1',
          isUnlocked: true,
          isCompleted: true,
          description: 'Common nouns, singular/plural, a/an/the'
        },
        {
          id: 'to-be-verb',
          title: 'To Be Verb (am/is/are)',
          duration: '30 min',
          xp: 70,
          level: 'A1',
          isUnlocked: true,
          isCompleted: false,
          description: 'Present tense of to be, positive & negative forms'
        },
        {
          id: 'numbers-time',
          title: 'Numbers & Telling Time',
          duration: '20 min',
          xp: 50,
          level: 'A1',
          isUnlocked: true,
          isCompleted: false,
          description: 'Cardinal numbers, ordinal numbers, clock time'
        }
      ]
    },
    {
      level: 'A2',
      name: 'Elementary',
      description: 'Build confidence with everyday conversations and basic grammar',
      color: '#3B82F6',
      topics: [
        {
          id: 'present-simple',
          title: 'Present Simple Tense',
          duration: '35 min',
          xp: 80,
          level: 'A2',
          isUnlocked: true,
          isCompleted: false,
          description: 'Daily routines, habits, general truths'
        },
        {
          id: 'question-formation',
          title: 'Question Formation',
          duration: '30 min',
          xp: 75,
          level: 'A2',
          isUnlocked: true,
          isCompleted: false,
          description: 'Yes/No questions, Wh- questions, question words'
        },
        {
          id: 'past-simple',
          title: 'Past Simple Tense',
          duration: '40 min',
          xp: 90,
          level: 'A2',
          isUnlocked: true,
          isCompleted: false,
          description: 'Regular & irregular verbs, talking about past events'
        },
        {
          id: 'prepositions',
          title: 'Prepositions (in/on/at)',
          duration: '25 min',
          xp: 65,
          level: 'A2',
          isUnlocked: false,
          isCompleted: false,
          description: 'Time prepositions, place prepositions, common uses'
        }
      ]
    },
    {
      level: 'B1',
      name: 'Intermediate',
      description: 'Express ideas clearly, understand main points, handle most situations',
      color: '#F59E0B',
      topics: [
        {
          id: 'present-perfect',
          title: 'Present Perfect Tense',
          duration: '45 min',
          xp: 100,
          level: 'B1',
          isUnlocked: true,
          isCompleted: false,
          description: 'Life experiences, unfinished actions, recent events'
        },
        {
          id: 'modal-verbs',
          title: 'Modal Verbs',
          duration: '40 min',
          xp: 95,
          level: 'B1',
          isUnlocked: true,
          isCompleted: false,
          description: 'Can, could, should, must, may, might - usage & meanings'
        },
        {
          id: 'passive-voice',
          title: 'Passive Voice',
          duration: '50 min',
          xp: 110,
          level: 'B1',
          isUnlocked: true,
          isCompleted: false,
          description: 'When and how to use passive constructions'
        },
        {
          id: 'conditionals-1-2',
          title: 'Conditionals (Type 1 & 2)',
          duration: '45 min',
          xp: 100,
          level: 'B1',
          isUnlocked: false,
          isCompleted: false,
          description: 'Real & hypothetical conditions, if-clauses'
        }
      ]
    },
    {
      level: 'B2',
      name: 'Upper Intermediate',
      description: 'Understand complex texts, interact fluently, produce detailed writing',
      color: '#8B5CF6',
      topics: [
        {
          id: 'conditionals',
          title: 'Advanced Conditionals (Type 3 & Mixed)',
          duration: '50 min',
          xp: 120,
          level: 'B2',
          isUnlocked: userLevel >= 'B2',
          isCompleted: false,
          description: 'Past unreal conditions, mixed conditional structures'
        },
        {
          id: 'reported-speech',
          title: 'Reported Speech',
          duration: '45 min',
          xp: 110,
          level: 'B2',
          isUnlocked: userLevel >= 'B2',
          isCompleted: false,
          description: 'Indirect speech, reporting statements & questions'
        },
        {
          id: 'relative-clauses',
          title: 'Relative Clauses',
          duration: '40 min',
          xp: 100,
          level: 'B2',
          isUnlocked: false,
          isCompleted: false,
          description: 'Defining & non-defining clauses, relative pronouns'
        }
      ]
    },
    {
      level: 'C1',
      name: 'Advanced',
      description: 'Master nuance, formality, complex structures, near-native fluency',
      color: '#EF4444',
      topics: [
        {
          id: 'subjunctive-mood',
          title: 'Subjunctive Mood',
          duration: '55 min',
          xp: 130,
          level: 'C1',
          isUnlocked: userLevel === 'C1',
          isCompleted: false,
          description: 'Expressing wishes, demands, suggestions in formal contexts'
        },
        {
          id: 'inversion',
          title: 'Inversion & Emphasis',
          duration: '50 min',
          xp: 125,
          level: 'C1',
          isUnlocked: userLevel === 'C1',
          isCompleted: false,
          description: 'Formal inversions, cleft sentences, emphatic structures'
        },
        {
          id: 'idioms-collocations',
          title: 'Idioms & Collocations',
          duration: '60 min',
          xp: 140,
          level: 'C1',
          isUnlocked: false,
          isCompleted: false,
          description: 'Natural phrase combinations, idiomatic expressions'
        }
      ]
    }
  ];

  const handleTopicClick = (topic: Topic) => {
    if (topic.isUnlocked) {
      router.push(`/learn/english/foundation/${topic.id}`);
    }
  };

  const handleBackToDashboard = () => {
    router.push('/english');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F1419]">
      <main className="w-full overflow-y-auto">
        <div className="max-w-5xl mx-auto p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleBackToDashboard}
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
                  Your Complete English Learning Path
                </h1>
                <p className="text-slate-600 dark:text-slate-300">
                  From A1 (Beginner) to C1 (Advanced) - Follow your personalized roadmap to mastery
                </p>
              </div>
            </div>

            {/* Current Level Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium mb-6">
              <Target className="w-4 h-4" />
              Your Level: {userLevel}
            </div>
          </div>

          {/* Learning Path Levels */}
          <div className="space-y-4">
            {learningPath.map((levelData) => {
              const isExpanded = expandedLevel === levelData.level;
              const isCurrentLevel = userLevel === levelData.level;
              const isUnlocked = userLevel >= levelData.level;

              return (
                <div
                  key={levelData.level}
                  className="bg-white/70 dark:bg-[#1A1F2E]/70 backdrop-blur-xl rounded-xl border border-slate-200/60 dark:border-slate-700/40 overflow-hidden"
                >
                  {/* Level Header */}
                  <button
                    onClick={() => setExpandedLevel(isExpanded ? null : levelData.level)}
                    className="w-full p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                        style={{ backgroundColor: levelData.color }}
                      >
                        {levelData.level}
                      </div>
                      <div className="text-left">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          {levelData.name}
                          {isCurrentLevel && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-[#E76F51] text-white">
                              Current
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          {levelData.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {!isUnlocked && (
                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                          <Lock className="w-4 h-4" />
                          Locked
                        </div>
                      )}
                      <ChevronRight
                        className={`w-5 h-5 text-slate-400 transition-transform ${
                          isExpanded ? 'rotate-90' : ''
                        }`}
                      />
                    </div>
                  </button>

                  {/* Level Topics */}
                  {isExpanded && (
                    <div className="px-6 pb-6 space-y-3">
                      {levelData.topics.map((topic, index) => (
                        <button
                          key={topic.id}
                          onClick={() => handleTopicClick(topic)}
                          disabled={!topic.isUnlocked}
                          className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                            topic.isCompleted
                              ? 'border-green-300 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                              : topic.isUnlocked
                              ? 'border-slate-200 dark:border-slate-700 hover:border-[#E76F51] hover:bg-orange-50 dark:hover:bg-orange-900/20'
                              : 'border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/30 opacity-50 cursor-not-allowed'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-start gap-4 flex-1">
                              <div className="mt-1">
                                {topic.isCompleted ? (
                                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                                ) : topic.isUnlocked ? (
                                  <Play className="w-5 h-5 text-[#E76F51]" />
                                ) : (
                                  <Lock className="w-5 h-5 text-slate-400" />
                                )}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                                  {index + 1}. {topic.title}
                                </h4>
                                <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                                  {topic.description}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {topic.duration}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3" />
                                    {topic.xp} XP
                                  </div>
                                </div>
                              </div>
                            </div>
                            {topic.isUnlocked && (
                              <ChevronRight className="w-5 h-5 text-slate-400" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

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
                  <p className="text-slate-600 dark:text-slate-300">Topics you've finished</p>
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
                <Lock className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Locked</p>
                  <p className="text-slate-600 dark:text-slate-300">Complete previous topics first</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
