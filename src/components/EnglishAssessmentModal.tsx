'use client';

import React, { useState, useEffect } from 'react';
import { X, Target, Brain, TrendingUp, Award, Clock, Zap, CheckCircle, AlertCircle, Sparkles, Star, BookOpen, Mic, Eye, MessageSquare, ArrowRight, ArrowLeft, ChevronRight } from 'lucide-react';
import { assessmentQuestions, AssessmentQuestion } from '@/lib/english-assessment-questions';
import {
  initializeAdaptiveTest,
  getNextAdaptiveQuestion,
  recordAttempt,
  calculateAssessmentResult,
  getPersonalizedPath,
  AdaptiveTestState,
  AssessmentResult
} from '@/lib/english-assessment-algorithm';

interface EnglishAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (result: AssessmentResult) => void;
}

type Step = 'calibration' | 'intro' | 'test' | 'results';
type CalibrationPage = 'goal' | 'study-time' | 'confidence';
type Goal = 'career' | 'academic' | 'travel' | 'business' | 'personal' | 'exams' | 'interviews';
type StudyGoal = 10 | 20 | 30 | 60;
type ConfidenceLevel = 'beginner' | 'elementary' | 'intermediate' | 'advanced' | 'fluent';

export default function EnglishAssessmentModal({
  isOpen,
  onClose,
  onComplete
}: EnglishAssessmentModalProps) {
  const [step, setStep] = useState<Step>('calibration');
  const [calibrationPage, setCalibrationPage] = useState<CalibrationPage>('goal');
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [studyGoal, setStudyGoal] = useState<StudyGoal>(20);
  const [preferredLanguage, setPreferredLanguage] = useState<string>('English');
  const [confidenceLevel, setConfidenceLevel] = useState<ConfidenceLevel>('intermediate');
  const [testState, setTestState] = useState<AdaptiveTestState>(initializeAdaptiveTest());
  const [currentQuestion, setCurrentQuestion] = useState<AssessmentQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [isLoading, setIsLoading] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Load first question when test starts
  useEffect(() => {
    if (step === 'test' && !currentQuestion) {
      loadNextQuestion();
    }
  }, [step]);

  // Keyboard shortcuts
  useEffect(() => {
    if (step !== 'test' || !currentQuestion) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && selectedAnswer !== null) {
        handleAnswerSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [step, selectedAnswer, currentQuestion]);

  const loadNextQuestion = () => {
    const nextQuestion = getNextAdaptiveQuestion(testState);
    if (nextQuestion) {
      setCurrentQuestion(nextQuestion);
      setSelectedAnswer(null);
      setQuestionStartTime(Date.now());
    } else {
      // Test complete - calculate results
      setIsLoading(true);
      setTimeout(() => {
        const result = calculateAssessmentResult(testState);
        setAssessmentResult(result);
        setIsLoading(false);
        setShowConfetti(true);
        setStep('results');
      }, 1500);
    }
  };

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null || !currentQuestion) return;

    const timeSpent = (Date.now() - questionStartTime) / 1000;
    recordAttempt(testState, currentQuestion, selectedAnswer, timeSpent);

    setTestState({ ...testState });
    loadNextQuestion();
  };

  const handleGoalSelect = (goal: Goal) => {
    setSelectedGoal(goal);
  };

  const handleNextCalibration = () => {
    if (calibrationPage === 'goal' && selectedGoal) {
      setCalibrationPage('study-time');
    } else if (calibrationPage === 'study-time') {
      setCalibrationPage('confidence');
    } else if (calibrationPage === 'confidence') {
      setStep('intro');
    }
  };

  const handleBackCalibration = () => {
    if (calibrationPage === 'confidence') {
      setCalibrationPage('study-time');
    } else if (calibrationPage === 'study-time') {
      setCalibrationPage('goal');
    }
  };

  const handleComplete = () => {
    if (assessmentResult) {
      onComplete(assessmentResult);
      onClose();
    }
  };

  if (!isOpen) return null;

  const progress = (testState.totalAttempts / 15) * 100; // Assuming max 15 questions
  const remainingQuestions = 15 - testState.totalAttempts;

  // Get current skill being tested
  const getCurrentSkillMessage = () => {
    if (!currentQuestion) return '';
    const skillNames: Record<string, string> = {
      grammar: 'Grammar',
      vocabulary: 'Vocabulary',
      reading: 'Reading Comprehension',
      usage: 'Practical Usage',
      speaking: 'Speaking',
      listening: 'Listening'
    };
    return `We're now testing your ${skillNames[currentQuestion.skill] || currentQuestion.skill}`;
  };

  // Calculate live skill scores
  const getLiveSkillScores = () => {
    const calculateSkillScore = (skill: AssessmentQuestion['skill']) => {
      const skillAttempts = testState.attempts.filter(a => a.skill === skill);
      if (skillAttempts.length === 0) return 0;
      const correct = skillAttempts.filter(a => a.isCorrect).length;
      return Math.round((correct / skillAttempts.length) * 100);
    };

    return {
      grammar: calculateSkillScore('grammar'),
      vocabulary: calculateSkillScore('vocabulary'),
      reading: calculateSkillScore('reading'),
      usage: calculateSkillScore('usage')
    };
  };

  const liveSkillScores = getLiveSkillScores();

  return (
    <>
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }

        @keyframes confetti-fall {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }

        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .float-animation {
          animation: float 3s ease-in-out infinite;
        }

        .pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .sparkle {
          animation: sparkle 1.5s ease-in-out infinite;
        }

        .confetti {
          animation: confetti-fall 3s linear forwards;
        }

        .slide-up {
          animation: slide-up 0.5s ease-out forwards;
        }

        .fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }

        .gradient-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.3;
          pointer-events: none;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          border: 1px solid rgba(255, 255, 255, 0.5);
        }

        .dark .glass-card {
          background: rgba(26, 31, 46, 0.98);
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .premium-shadow {
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08), 0 8px 24px rgba(0, 0, 0, 0.05);
        }

        .dark .premium-shadow {
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4), 0 8px 24px rgba(0, 0, 0, 0.2);
        }

        .skill-bar {
          transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hover-lift {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.12), 0 10px 28px rgba(0, 0, 0, 0.08);
        }

        .ai-avatar {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          animation: float 4s ease-in-out infinite;
        }
      `}</style>

      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-[100]">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="confetti absolute w-2 h-2"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10%',
                backgroundColor: ['#E76F51', '#F4A261', '#E9C46A', '#2A9D8F', '#264653', '#8B5CF6', '#EC4899'][Math.floor(Math.random() * 7)],
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Main Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden" style={{ backgroundColor: 'rgba(15, 20, 25, 0.85)' }}>
        {/* Animated gradient blobs */}
        <div className="gradient-blob fixed w-[500px] h-[500px] top-[-200px] left-[-200px]" style={{ background: 'radial-gradient(circle, #E76F51 0%, transparent 70%)' }} />
        <div className="gradient-blob fixed w-[400px] h-[400px] bottom-[-200px] right-[-200px]" style={{ background: 'radial-gradient(circle, #667eea 0%, transparent 70%)' }} />

        {/* Modal Container */}
        <div
          className="relative glass-card premium-shadow rounded-3xl overflow-hidden fade-in"
          style={{
            width: '1200px',
            maxWidth: '95vw',
            height: '800px',
            maxHeight: '92vh',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-all z-20 group"
          >
            <X className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
          </button>

          {/* Progress bar (test step only) */}
          {step === 'test' && (
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-200/50 dark:bg-slate-700/50 z-10">
              <div
                className="h-full bg-gradient-to-r from-[#E76F51] via-[#F4A261] to-[#E9C46A] skill-bar"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* Content */}
          <div className="relative flex-1 overflow-hidden">
            {/* CALIBRATION STEP */}
            {step === 'calibration' && (
              <div className="h-full flex flex-col p-12 slide-up overflow-hidden">
                {/* Progress Indicator */}
                <div className="flex items-center justify-center gap-2 mb-8">
                  <div className={`h-1.5 w-20 rounded-full transition-all ${calibrationPage === 'goal' ? 'bg-[#E76F51]' : 'bg-slate-300 dark:bg-slate-600'}`} />
                  <div className={`h-1.5 w-20 rounded-full transition-all ${calibrationPage === 'study-time' ? 'bg-[#E76F51]' : 'bg-slate-300 dark:bg-slate-600'}`} />
                  <div className={`h-1.5 w-20 rounded-full transition-all ${calibrationPage === 'confidence' ? 'bg-[#E76F51]' : 'bg-slate-300 dark:bg-slate-600'}`} />
                </div>

                <div className="flex-1 flex items-center justify-center">
                  <div className="w-full max-w-4xl">
                    {/* PAGE 1: Learning Goal */}
                    {calibrationPage === 'goal' && (
                      <div className="grid grid-cols-2 gap-12 items-center fade-in">
                        {/* Left: Decorative Illustration */}
                        <div className="flex flex-col items-center justify-center">
                          <div className="relative w-64 h-64 mb-6">
                            {/* Decorative circles */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 opacity-50 pulse-glow" />
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#E76F51]/20 to-[#F4A261]/20 opacity-70 pulse-glow" style={{ animationDelay: '0.5s' }} />
                            </div>
                            {/* Central icon */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#E76F51] to-[#F4A261] flex items-center justify-center shadow-2xl">
                                <Target className="w-12 h-12 text-white" />
                              </div>
                            </div>
                            {/* Floating mini icons */}
                            <div className="absolute top-8 right-8 w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center float-animation">
                              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="absolute bottom-8 left-8 w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center float-animation" style={{ animationDelay: '0.3s' }}>
                              <Star className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                          </div>
                          <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-xs">
                            Choose your primary motivation to get personalized content
                          </p>
                        </div>

                        {/* Right: Question & Options */}
                        <div className="space-y-4">
                          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                            Why are you learning English?
                          </h2>
                          <p className="text-slate-600 dark:text-slate-400 mb-6">
                            Select your primary goal
                          </p>

                          <div className="grid grid-cols-1 gap-3">
                      {[
                        {
                          id: 'career',
                          title: 'Career Growth',
                          desc: 'Professional skills',
                          icon: (
                            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
                              <rect x="4" y="6" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                              <path d="M8 6V4C8 3.44772 8.44772 3 9 3H15C15.5523 3 16 3.44772 16 4V6" stroke="currentColor" strokeWidth="2"/>
                              <line x1="12" y1="10" x2="12" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                          ),
                          color: '#E76F51'
                        },
                        {
                          id: 'exams',
                          title: 'Competitive Exams',
                          desc: 'UPSC, SSC, Banking',
                          icon: (
                            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
                              <path d="M9 11L12 14L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M21 12V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                          ),
                          color: '#2A9D8F'
                        },
                        {
                          id: 'academic',
                          title: 'Study Abroad',
                          desc: 'University applications',
                          icon: (
                            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
                              <path d="M12 3L2 8L12 13L22 8L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none"/>
                              <path d="M2 13L12 18L22 13" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                              <path d="M2 18L12 23L22 18" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                            </svg>
                          ),
                          color: '#8B5CF6'
                        },
                        {
                          id: 'interviews',
                          title: 'Job Interviews',
                          desc: 'Interview preparation',
                          icon: (
                            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
                              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" fill="none"/>
                              <path d="M6 21V19C6 16.7909 7.79086 15 10 15H14C16.2091 15 18 16.7909 18 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                              <path d="M19 8L21 10L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          ),
                          color: '#F4A261'
                        },
                        {
                          id: 'travel',
                          title: 'Travel',
                          desc: 'Conversations abroad',
                          icon: (
                            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
                              <path d="M12 2C8.13401 2 5 5.13401 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13401 15.866 2 12 2Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                              <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="2" fill="none"/>
                            </svg>
                          ),
                          color: '#3B82F6'
                        },
                        {
                          id: 'business',
                          title: 'Business',
                          desc: 'Meetings & negotiations',
                          icon: (
                            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
                              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                            </svg>
                          ),
                          color: '#EC4899'
                        }
                      ].map((goal) => (
                        <button
                          key={goal.id}
                          onClick={() => handleGoalSelect(goal.id as Goal)}
                          className={`text-left p-3 rounded-2xl border-2 transition-all hover-lift ${
                            selectedGoal === goal.id
                              ? 'border-[#E76F51] bg-orange-50 dark:bg-orange-900/20'
                              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: `${goal.color}15`, color: goal.color }}
                            >
                              <div className="scale-90">{goal.icon}</div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-slate-900 dark:text-white text-xs mb-0.5">
                                {goal.title}
                              </h4>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                                {goal.desc}
                              </p>
                            </div>
                            {selectedGoal === goal.id && (
                              <CheckCircle className="w-5 h-5 text-[#E76F51] flex-shrink-0" />
                            )}
                          </div>
                        </button>
                      ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* PAGE 2: Study Goal */}
                    {calibrationPage === 'study-time' && (
                      <div className="grid grid-cols-2 gap-12 items-center fade-in">
                        {/* Left: Decorative Illustration */}
                        <div className="flex flex-col items-center justify-center">
                          <div className="relative w-64 h-64 mb-6">
                            {/* Decorative clock rings */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-48 h-48 rounded-full border-4 border-blue-200 dark:border-blue-800/40 opacity-30 pulse-glow" />
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-36 h-36 rounded-full border-4 border-purple-200 dark:border-purple-800/40 opacity-40 pulse-glow" style={{ animationDelay: '0.3s' }} />
                            </div>
                            {/* Central clock icon */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-2xl">
                                <Clock className="w-12 h-12 text-white" />
                              </div>
                            </div>
                            {/* Time markers */}
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-lg font-bold text-blue-600 dark:text-blue-400 float-animation">
                              10
                            </div>
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-lg font-bold text-purple-600 dark:text-purple-400 float-animation" style={{ animationDelay: '0.4s' }}>
                              60
                            </div>
                          </div>
                          <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-xs">
                            Set a realistic daily goal to build consistency
                          </p>
                        </div>

                        {/* Right: Question & Options */}
                        <div className="space-y-4">
                          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                            Daily study goal
                          </h2>
                          <p className="text-slate-600 dark:text-slate-400 mb-6">
                            How much time can you commit each day?
                          </p>

                          <div className="grid grid-cols-2 gap-4">
                            {[
                              { minutes: 10, desc: 'Quick practice' },
                              { minutes: 20, desc: 'Regular learning' },
                              { minutes: 30, desc: 'Serious study' },
                              { minutes: 60, desc: 'Deep immersion' }
                            ].map((option) => (
                              <button
                                key={option.minutes}
                                onClick={() => setStudyGoal(option.minutes as StudyGoal)}
                                className={`p-6 rounded-2xl border-2 transition-all hover-lift ${
                                  studyGoal === option.minutes
                                    ? 'border-[#E76F51] bg-orange-50 dark:bg-orange-900/20 shadow-lg'
                                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                }`}
                              >
                                <div className="text-4xl font-bold text-slate-900 dark:text-white mb-1">
                                  {option.minutes}
                                </div>
                                <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                                  minutes
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-500">
                                  {option.desc}
                                </div>
                                {studyGoal === option.minutes && (
                                  <div className="mt-3 flex items-center justify-center">
                                    <CheckCircle className="w-5 h-5 text-[#E76F51]" />
                                  </div>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* PAGE 3: Confidence Level */}
                    {calibrationPage === 'confidence' && (
                      <div className="grid grid-cols-2 gap-12 items-center fade-in">
                        {/* Left: Decorative Illustration */}
                        <div className="flex flex-col items-center justify-center">
                          <div className="relative w-64 h-64 mb-6">
                            {/* Gradient background */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-56 h-56 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 opacity-60 pulse-glow" />
                            </div>
                            {/* Central trending icon */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#F59E0B] to-[#F97316] flex items-center justify-center shadow-2xl">
                                <TrendingUp className="w-12 h-12 text-white" />
                              </div>
                            </div>
                            {/* Level indicators */}
                            <div className="absolute top-8 right-8 w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center float-animation">
                              <Star className="w-7 h-7 text-green-600 dark:text-green-400 fill-green-600 dark:fill-green-400" />
                            </div>
                            <div className="absolute bottom-8 left-8 w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center float-animation" style={{ animationDelay: '0.3s' }}>
                              <Sparkles className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                            </div>
                          </div>
                          <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-xs">
                            Your self-rating helps us calibrate the starting difficulty
                          </p>
                        </div>

                        {/* Right: Question & Options */}
                        <div className="space-y-4">
                          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                            Self-rated confidence
                          </h2>
                          <p className="text-slate-600 dark:text-slate-400 mb-6">
                            How comfortable are you with English?
                          </p>

                          <div className="grid grid-cols-1 gap-3">
                            {[
                              {
                                id: 'beginner',
                                label: 'Beginner',
                                desc: 'Just starting out',
                                icon: (
                                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none"/>
                                    <path d="M12 12L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                  </svg>
                                ),
                                color: '#94A3B8'
                              },
                              {
                                id: 'elementary',
                                label: 'Elementary',
                                desc: 'Know some basics',
                                icon: (
                                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none"/>
                                    <path d="M12 12L12 6M12 12L16 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                  </svg>
                                ),
                                color: '#3B82F6'
                              },
                              {
                                id: 'intermediate',
                                label: 'Intermediate',
                                desc: 'Can hold conversations',
                                icon: (
                                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none"/>
                                    <path d="M12 12L12 6M12 12L16 8M12 12L16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                  </svg>
                                ),
                                color: '#F59E0B'
                              },
                              {
                                id: 'advanced',
                                label: 'Advanced',
                                desc: 'Comfortable in most situations',
                                icon: (
                                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none"/>
                                    <path d="M12 12L12 6M12 12L16 8M12 12L16 16M12 12L8 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                  </svg>
                                ),
                                color: '#8B5CF6'
                              },
                              {
                                id: 'fluent',
                                label: 'Fluent',
                                desc: 'Near-native proficiency',
                                icon: (
                                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.2"/>
                                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                                  </svg>
                                ),
                                color: '#10B981'
                              }
                            ].map((level) => (
                              <button
                                key={level.id}
                                onClick={() => setConfidenceLevel(level.id as ConfidenceLevel)}
                                className={`p-4 rounded-2xl border-2 transition-all hover-lift ${
                                  confidenceLevel === level.id
                                    ? 'border-[#E76F51] bg-orange-50 dark:bg-orange-900/20 shadow-lg'
                                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                }`}
                              >
                                <div className="flex items-center gap-4">
                                  <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                                    style={{
                                      backgroundColor: `${level.color}15`,
                                      color: confidenceLevel === level.id ? '#E76F51' : level.color
                                    }}
                                  >
                                    {level.icon}
                                  </div>
                                  <div className="flex-1 text-left">
                                    <h4 className="font-semibold text-slate-900 dark:text-white mb-0.5">
                                      {level.label}
                                    </h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                      {level.desc}
                                    </p>
                                  </div>
                                  {confidenceLevel === level.id && (
                                    <CheckCircle className="w-5 h-5 text-[#E76F51] flex-shrink-0" />
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-8">
                  {calibrationPage !== 'goal' && (
                    <button
                      onClick={handleBackCalibration}
                      className="px-6 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all flex items-center gap-2"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      Back
                    </button>
                  )}
                  {calibrationPage === 'goal' && <div />} {/* Spacer */}

                  <button
                    onClick={handleNextCalibration}
                    disabled={
                      (calibrationPage === 'goal' && !selectedGoal) ||
                      (calibrationPage === 'study-time' && !studyGoal)
                    }
                    className="px-8 py-3 rounded-2xl bg-gradient-to-r from-[#E76F51] to-[#F4A261] text-white font-bold text-base shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all hover-lift flex items-center gap-2"
                  >
                    {calibrationPage === 'confidence' ? 'Start Assessment' : 'Next'}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* INTRO STEP */}
            {step === 'intro' && (
              <div className="h-full flex items-center justify-center p-8 slide-up overflow-hidden">
                <div className="max-w-2xl text-center">
                  {/* AI Avatar with animation */}
                  <div className="mb-8">
                    <div className="relative inline-block">
                      <div className="ai-avatar w-24 h-24 rounded-3xl flex items-center justify-center relative mx-auto">
                        <Brain className="w-12 h-12 text-white" />
                        {/* Floating particles */}
                        <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-[#E9C46A] opacity-60 pulse-glow" />
                        <div className="absolute -bottom-2 -left-3 w-5 h-5 rounded-full bg-[#2A9D8F] opacity-60 pulse-glow" style={{ animationDelay: '0.5s' }} />
                        <div className="absolute top-0 right-0 w-3 h-3 rounded-full bg-[#F4A261] opacity-60 pulse-glow" style={{ animationDelay: '1s' }} />
                      </div>
                    </div>
                    {/* Speech bubble below avatar */}
                    <div className="mt-4 inline-block bg-white dark:bg-slate-800 rounded-2xl px-5 py-2 shadow-lg relative">
                      <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white dark:bg-slate-800 rotate-45" />
                      <div className="text-xs font-medium text-slate-700 dark:text-slate-300 relative z-10">
                        Let's understand your English level
                      </div>
                    </div>
                  </div>

                  <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                    Your AI-Powered Assessment
                  </h1>
                  <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                    We'll test 6 core skills to determine your precise proficiency level
                  </p>

                  {/* Skills Grid */}
                  <div className="grid grid-cols-3 gap-3 mb-8">
                    {[
                      { icon: BookOpen, label: 'Vocabulary', color: '#E76F51' },
                      { icon: Brain, label: 'Grammar', color: '#2A9D8F' },
                      { icon: Eye, label: 'Reading', color: '#E9C46A' },
                      { icon: Mic, label: 'Listening', color: '#F4A261' },
                      { icon: MessageSquare, label: 'Speaking', color: '#8B5CF6' },
                      { icon: Star, label: 'Writing', color: '#EC4899' }
                    ].map((skill, index) => (
                      <div
                        key={skill.label}
                        className="glass-card p-4 rounded-2xl hover-lift fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center mb-2 mx-auto"
                          style={{ backgroundColor: `${skill.color}20` }}
                        >
                          <skill.icon className="w-5 h-5" style={{ color: skill.color }} />
                        </div>
                        <div className="font-semibold text-slate-900 dark:text-white text-xs">
                          {skill.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Info cards */}
                  <div className="grid grid-cols-3 gap-3 mb-8">
                    <div className="glass-card p-3 rounded-2xl">
                      <div className="text-2xl font-bold text-[#E76F51] mb-0.5">5 min</div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">Duration</div>
                    </div>
                    <div className="glass-card p-3 rounded-2xl">
                      <div className="text-2xl font-bold text-[#2A9D8F] mb-0.5">10-15</div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">Questions</div>
                    </div>
                    <div className="glass-card p-3 rounded-2xl">
                      <div className="text-2xl font-bold text-[#E9C46A] mb-0.5">A1-C2</div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">CEFR Levels</div>
                    </div>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => setStep('test')}
                    className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#E76F51] via-[#F4A261] to-[#E9C46A] text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover-lift flex items-center gap-2 mx-auto"
                  >
                    <Zap className="w-5 h-5" />
                    Begin Assessment
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* TEST STEP */}
            {step === 'test' && currentQuestion && (
              <div className="h-full flex">
                {/* LEFT PANEL - Minimal & Clean */}
                <div className="w-[300px] bg-slate-50/80 dark:bg-slate-900/50 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-800/50 p-8 flex flex-col flex-shrink-0">
                  {/* Assessment Status */}
                  <div className="mb-10 slide-up">
                    <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/30 mb-4">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                        Live Assessment
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {getCurrentSkillMessage()}
                    </p>
                  </div>

                  {/* Skills Checklist */}
                  <div className="space-y-3 mb-auto slide-up" style={{ animationDelay: '0.1s' }}>
                    <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                      Skills Coverage
                    </div>
                    {[
                      { skill: 'Vocabulary', icon: BookOpen, tested: testState.skillsCovered.has('vocabulary') },
                      { skill: 'Grammar', icon: Target, tested: testState.skillsCovered.has('grammar') },
                      { skill: 'Reading', icon: Eye, tested: testState.skillsCovered.has('reading') },
                      { skill: 'Usage', icon: MessageSquare, tested: testState.skillsCovered.has('usage') }
                    ].map((item) => (
                      <div
                        key={item.skill}
                        className={`flex items-center gap-3 py-2.5 px-3 rounded-xl transition-all ${
                          item.tested
                            ? 'bg-white dark:bg-slate-800/50 shadow-sm'
                            : 'opacity-40'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all ${
                          item.tested
                            ? 'bg-emerald-500 text-white'
                            : 'border-2 border-slate-300 dark:border-slate-600'
                        }`}>
                          {item.tested && (
                            <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {item.skill}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Stats Card */}
                  <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm slide-up" style={{ animationDelay: '0.2s' }}>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Completed</span>
                        <span className="text-lg font-bold text-slate-900 dark:text-white">
                          {testState.totalAttempts}/15
                        </span>
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                          style={{ width: `${(testState.totalAttempts / 15) * 100}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Time left</span>
                        <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                          ~{Math.ceil((15 - testState.totalAttempts) * 0.4)} min
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CENTER PANEL - Premium Clean Design */}
                <div className="flex-1 flex flex-col bg-white dark:bg-slate-900" style={{ animationDelay: '0.1s' }}>
                  {/* Scrollable Content Area */}
                  <div className="flex-1 overflow-y-auto flex items-center justify-center px-12">
                    <div className="max-w-4xl w-full py-16">
                      {/* Skill Tag - Minimal */}
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 mb-8">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                          {currentQuestion.skill}
                        </span>
                      </div>

                      {/* Question Text - Clean Typography */}
                      <h1 className="text-3xl font-semibold text-slate-900 dark:text-white leading-relaxed mb-12" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
                        {currentQuestion.question}
                      </h1>

                      {/* Answer Options - Premium Cards */}
                      <div className="space-y-3">
                        {currentQuestion.options.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedAnswer(index)}
                            className={`group w-full text-left px-6 py-5 rounded-2xl transition-all duration-300 ${
                              selectedAnswer === index
                                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-2 border-emerald-500 shadow-lg shadow-emerald-500/10'
                                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md hover:-translate-y-0.5'
                            }`}
                          >
                            <div className="flex items-center gap-5">
                              {/* Letter Badge - Clean Design */}
                              <div
                                className={`w-11 h-11 rounded-xl flex items-center justify-center text-base font-bold transition-all flex-shrink-0 ${
                                  selectedAnswer === index
                                    ? 'bg-emerald-500 text-white shadow-md'
                                    : 'bg-slate-50 dark:bg-slate-700/50 text-slate-400 dark:text-slate-500 group-hover:bg-slate-100 dark:group-hover:bg-slate-700'
                                }`}
                              >
                                {String.fromCharCode(65 + index)}
                              </div>

                              {/* Option Text */}
                              <span className={`text-base font-medium flex-1 transition-colors ${
                                selectedAnswer === index
                                  ? 'text-slate-900 dark:text-white'
                                  : 'text-slate-700 dark:text-slate-300'
                              }`}>
                                {option}
                              </span>

                              {/* Checkmark for Selected */}
                              {selectedAnswer === index && (
                                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                                  <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Bar - Clean & Fixed */}
                  <div className="border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-12 py-6">
                    <div className="max-w-4xl w-full mx-auto flex items-center justify-between">
                      <div className="text-sm text-slate-400 dark:text-slate-500 flex items-center gap-2">
                        <span>Press</span>
                        <kbd className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-semibold shadow-sm">Enter</kbd>
                      </div>
                      <button
                        onClick={handleAnswerSubmit}
                        disabled={selectedAnswer === null}
                        className="px-10 py-4 rounded-xl bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 active:scale-95 disabled:bg-slate-200 dark:disabled:bg-slate-700 disabled:text-slate-400 dark:disabled:text-slate-500 text-white dark:text-slate-900 font-semibold text-base transition-all disabled:cursor-not-allowed shadow-lg hover:shadow-xl disabled:shadow-none disabled:scale-100"
                      >
                        {remainingQuestions <= 1 ? 'Submit' : 'Continue'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* LOADING STATE */}
            {step === 'test' && isLoading && (
              <div className="h-full flex items-center justify-center slide-up p-12 overflow-hidden">
                <div className="text-center">
                  <div className="relative inline-block mb-8">
                    <div className="ai-avatar w-32 h-32 rounded-3xl flex items-center justify-center">
                      <Brain className="w-16 h-16 text-white" />
                    </div>
                    <div className="absolute inset-0 rounded-3xl border-4 border-[#E76F51] border-t-transparent animate-spin" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    Analyzing Your Performance
                  </h3>
                  <p className="text-lg text-slate-600 dark:text-slate-400">
                    Our AI is calculating your precise proficiency level...
                  </p>
                </div>
              </div>
            )}

            {/* RESULTS STEP */}
            {step === 'results' && assessmentResult && (
              <div className="h-full overflow-y-auto p-12 slide-up">
                <div className="max-w-4xl mx-auto">
                  {/* Celebration Header */}
                  <div className="text-center mb-12">
                    <div className="relative inline-block mb-6">
                      <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-[#E76F51] via-[#F4A261] to-[#E9C46A] flex items-center justify-center shadow-2xl">
                        <Award className="w-16 h-16 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-gradient-to-br from-[#2A9D8F] to-[#264653] flex items-center justify-center">
                        <Star className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-3">
                      Assessment Complete!
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400">
                      Here's your personalized English proficiency report
                    </p>
                  </div>

                  {/* Level Badge */}
                  <div className="glass-card premium-shadow p-8 rounded-3xl mb-8 text-center">
                    <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                      Your English Level
                    </div>
                    <div className="text-7xl font-bold bg-gradient-to-r from-[#E76F51] via-[#F4A261] to-[#E9C46A] bg-clip-text text-transparent mb-2">
                      {assessmentResult.level}
                    </div>
                    <div className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                      {assessmentResult.levelName}
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium">
                      Confidence: {assessmentResult.confidence.toUpperCase()}
                    </div>
                  </div>

                  {/* Overall Score */}
                  <div className="glass-card premium-shadow p-8 rounded-3xl mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                        Overall Score
                      </span>
                      <span className="text-4xl font-bold text-[#E76F51]">
                        {assessmentResult.overallScore}%
                      </span>
                    </div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#E76F51] via-[#F4A261] to-[#E9C46A] skill-bar"
                        style={{ width: `${assessmentResult.overallScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Skill Breakdown */}
                  <div className="glass-card premium-shadow p-8 rounded-3xl mb-8">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                      Skill Breakdown
                    </h3>
                    <div className="grid grid-cols-2 gap-6">
                      {Object.entries(assessmentResult.skillScores).map(([skill, score]) => {
                        const colors: Record<string, string> = {
                          grammar: '#2A9D8F',
                          vocabulary: '#E76F51',
                          reading: '#E9C46A',
                          usage: '#8B5CF6'
                        };
                        return (
                          <div key={skill} className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 capitalize">
                                {skill}
                              </span>
                              <span className="text-2xl font-bold" style={{ color: colors[skill] }}>
                                {score}%
                              </span>
                            </div>
                            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className="h-full skill-bar"
                                style={{
                                  width: `${score}%`,
                                  backgroundColor: colors[skill]
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* AI Insights */}
                  <div className="glass-card premium-shadow p-8 rounded-3xl mb-8">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                      <Brain className="w-6 h-6 text-[#E76F51]" />
                      Personalized AI Insights
                    </h3>
                    <div className="space-y-3">
                      {assessmentResult.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl">
                          <Sparkles className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                            {rec}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Warning if suspicious clicks */}
                  {assessmentResult.suspiciousClickCount > 0 && (
                    <div className="glass-card p-6 rounded-2xl mb-8 border-2 border-yellow-200 dark:border-yellow-800">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-200 mb-1">
                            Quick Tip for Better Accuracy
                          </p>
                          <p className="text-xs text-yellow-700 dark:text-yellow-300">
                            Some answers were submitted very quickly. Taking more time to read questions carefully will give a more accurate assessment. You can retake this test anytime from Settings.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CTAs */}
                  <div className="flex items-center gap-4 justify-center">
                    <button
                      onClick={handleComplete}
                      className="px-10 py-5 rounded-2xl bg-gradient-to-r from-[#E76F51] via-[#F4A261] to-[#E9C46A] text-white font-bold text-xl shadow-xl hover:shadow-2xl transition-all hover-lift flex items-center gap-3"
                    >
                      <TrendingUp className="w-6 h-6" />
                      Start My Personalized Journey
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
