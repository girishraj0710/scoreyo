"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/user-context';
import {
  BookOpen, Trophy, Flame, Zap, Star, Clock, Bell,
  Brain, Layers, GraduationCap, ChevronRight, Play
} from 'lucide-react';

export default function EnglishLearningDashboard() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

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

  // ────────────────────────────────────────────────────────────
  // ACTION HANDLERS
  // ────────────────────────────────────────────────────────────

  // Navigate to specific learning path
  const handleCourseClick = (courseId: string) => {
    setSelectedCourse(courseId);
    // Route to the specific course path
    switch (courseId) {
      case 'foundation':
        router.push('/learn/english/foundation');
        break;
      case 'advanced':
        router.push('/learn/english/advanced');
        break;
      case 'vocabulary':
        router.push('/learn/english/vocabulary');
        break;
      case 'ielts-toefl':
        router.push('/learn/english/ielts-toefl');
        break;
      default:
        router.push('/learn/english');
    }
  };

  // Resume current lesson
  const handleContinueLesson = () => {
    // Navigate to the last active topic
    router.push('/learn/english/advanced/conditional-structures');
  };

  // Navigate to full learning path view
  const handleViewFullPath = () => {
    router.push('/english/path');
  };

  // View full leaderboard
  const handleViewLeaderboard = () => {
    router.push('/english/leaderboard');
  };

  // View all achievements
  const handleViewAchievements = () => {
    router.push('/english/achievements');
  };

  // Click on level node
  const handleLevelClick = (level: string) => {
    console.log(`Navigating to ${level} level content`);
    // Could open a modal or navigate to level-specific page
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F1419]">
      <div className="flex">
        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto">
          {/* Header */}
          <header className="bg-white/50 dark:bg-[#1A1F2E]/50 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-700/40 px-8 py-5 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back, {user.name?.split(' ')[0] || 'Alex'}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Sunday, June 22 — Keep the streak alive</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFF4E6] dark:bg-[#7C2D12]/20 border border-[#FFE4C4]/60 dark:border-[#7C2D12]/40">
                  <Flame className="w-4 h-4 text-[#FF8C42]" strokeWidth={2.5} />
                  <span className="text-sm font-bold text-[#D97706] dark:text-[#FFA500]">45</span>
                  <span className="text-sm text-[#B45309] dark:text-[#F59E0B]">day streak</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FEF5F3] dark:bg-[#8B4034]/20 border border-[#DBEAFE]/60 dark:border-[#8B4034]/40">
                  <Zap className="w-4 h-4 text-[#E76F51]" strokeWidth={2.5} />
                  <span className="text-sm font-bold text-[#E76F51] dark:text-[#F4A79D]">2,590</span>
                  <span className="text-sm text-[#E76F51] dark:text-[#F4A79D]">XP</span>
                </div>
                <button className="relative p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                  <div className="w-2 h-2 bg-[#E76F51] rounded-full absolute top-1.5 right-1.5" />
                  <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" strokeWidth={2} />
                </button>
              </div>
            </div>
          </header>

          <div className="p-8 space-y-6">
            {/* Learning Path Progression */}
            <section className="bg-white/70 dark:bg-[#1A1F2E]/70 backdrop-blur-xl rounded-2xl border border-slate-200/60 dark:border-slate-700/40 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Your Learning Path</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Currently active at B1 / B2 Intermediate</p>
                </div>
                <button
                  onClick={handleViewFullPath}
                  className="text-sm font-semibold text-[#E76F51] dark:text-[#F4A79D] hover:text-[#D65A3D] dark:hover:text-[#F4A79D] flex items-center gap-1"
                >
                  Full path
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Progress Nodes */}
              <div className="flex items-center justify-between relative px-8">
                {/* Connection Lines */}
                <div className="absolute top-8 left-24 right-24 h-0.5 bg-slate-300 dark:bg-slate-600" style={{ zIndex: 0 }} />

                <LevelNode title="Beginner" subtitle="A1" completed onClick={() => handleLevelClick('A1')} />
                <LevelNode title="Elementary" subtitle="A2" completed onClick={() => handleLevelClick('A2')} />
                <LevelNode title="Intermediate" subtitle="B1/B2" active onClick={() => handleLevelClick('B1/B2')} />
                <LevelNode title="Advanced" subtitle="C1" onClick={() => handleLevelClick('C1')} />
                <LevelNode title="Test Prep" subtitle="IELTS" onClick={() => handleLevelClick('IELTS')} />
              </div>
            </section>

            {/* Next Up Card */}
            <section className="bg-gradient-to-br from-[#E76F51] via-[#E15838] to-[#D65A3D] rounded-2xl p-6 text-white relative overflow-hidden shadow-lg shadow-[#E76F51]/20">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-60" />

              <div className="relative flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <BookOpen className="w-4 h-4" strokeWidth={2.5} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-white/90">NEXT UP</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-1">Intermediate & Advanced Mastery</h3>
                  <p className="text-base text-white/95 mb-4">Unit 12 — Conditional Structures</p>
                  <div className="flex items-center gap-4 text-sm text-white/90">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" strokeWidth={2} />
                      <span>25 min</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Zap className="w-4 h-4" strokeWidth={2} />
                      <span>+40 XP</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleContinueLesson}
                  className="px-8 py-3 rounded-xl bg-white text-[#E76F51] font-bold hover:bg-[#FEF5F3] transition-colors flex items-center gap-2 shadow-xl"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Continue
                </button>
              </div>
            </section>

            {/* Course Tracks */}
            <section>
              <div className="flex items-center justify-between mb-6 pt-1">
                <h3 className="text-sm font-bold" style={{ color: "#0d1117" }}>Course Tracks</h3>
                <span className="text-[11px] font-semibold" style={{ color: "#94a3b8" }}>4 courses enrolled</span>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <CourseCard
                  icon={<BookOpen className="w-5 h-5" />}
                  tag="CEFR A1-A2 Level"
                  title="Basic English & Vocabulary"
                  description="Build your core grammar, everyday conversational vocabulary, and sentence structures from scratch."
                  progress={85}
                  color="blue"
                  courseId="foundation"
                  onResume={handleCourseClick}
                />

                <CourseCard
                  icon={<Brain className="w-5 h-5" />}
                  tag="CEFR B1-C1 Level"
                  title="Intermediate & Advanced Mastery"
                  description="Master complex grammar, nuanced vocabulary expressions, professional business writing, and confident rhetoric."
                  progress={60}
                  color="purple"
                  courseId="advanced"
                  onResume={handleCourseClick}
                />

                <CourseCard
                  icon={<Layers className="w-5 h-5" />}
                  tag="All Levels"
                  title="Dedicated Vocabulary Builder"
                  description="Learn 5,000+ high-frequency words, contextual idioms, phrasal verbs, and professional jargon via smart flashcards."
                  progress={32}
                  color="amber"
                  courseId="vocabulary"
                  onResume={handleCourseClick}
                />

                <CourseCard
                  icon={<GraduationCap className="w-5 h-5" />}
                  tag="Exam Track"
                  title="Standardized Test Prep: IELTS & TOEFL"
                  description="Targeted strategies, practice questions, mock tests, and evaluation tools to crack academic reading, writing, listening, and speaking modules."
                  progress={10}
                  color="teal"
                  courseId="ielts-toefl"
                  onResume={handleCourseClick}
                />
              </div>
            </section>
          </div>
        </main>

        {/* RIGHT SIDEBAR */}
        <aside className="w-80 min-h-screen bg-white/50 dark:bg-[#1A1F2E]/50 backdrop-blur-xl border-l border-slate-200/60 dark:border-slate-700/40 p-6 space-y-6 overflow-y-auto">
          {/* Daily Goal */}
          <div className="bg-white/90 dark:bg-[#1A1F2E]/90 backdrop-blur-xl rounded-2xl border border-slate-200/60 dark:border-slate-700/40 p-6">
            <h4 className="text-xs font-bold mb-4" style={{ color: "#475569" }}>Daily Goal</h4>
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32">
                <svg className="transform -rotate-90 w-32 h-32">
                  <circle cx="64" cy="64" r="56" stroke="#E2E8F0" className="dark:stroke-slate-700" strokeWidth="8" fill="none" />
                  <circle
                    cx="64" cy="64" r="56"
                    stroke="url(#blueGradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - 0.68)}`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#E76F51" />
                      <stop offset="100%" stopColor="#D65A3D" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold" style={{ color: "#0d1117" }}>68%</span>
                  <span className="text-[10px] font-medium" style={{ color: "#94a3b8" }}>of 30 min</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-6 w-full">
                <StatItem label="Lessons" value="3/5" icon={<BookOpen className="w-3.5 h-3.5" />} color="#2563eb" />
                <StatItem label="Words" value="12/20" icon={<Brain className="w-3.5 h-3.5" />} color="#6d28d9" />
                <StatItem label="XP Today" value="85" icon={<Zap className="w-3.5 h-3.5" />} color="#d97706" />
              </div>
            </div>
          </div>

          {/* Weekly XP */}
          <div className="bg-white/90 dark:bg-[#1A1F2E]/90 backdrop-blur-xl rounded-2xl border border-slate-200/60 dark:border-slate-700/40 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold" style={{ color: "#475569" }}>Weekly XP</h4>
              <span className="text-xs font-semibold text-[#10B981] dark:text-[#34D399]">+23% this week</span>
            </div>
            <div className="flex items-end justify-between h-32 gap-2">
              {[
                { day: 'M', height: 40 },
                { day: 'T', height: 55 },
                { day: 'W', height: 60 },
                { day: 'T', height: 45 },
                { day: 'F', height: 65 },
                { day: 'S', height: 70 },
                { day: 'S', height: 100, active: true },
              ].map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className={`w-full rounded-lg transition-all ${
                      bar.active
                        ? 'bg-gradient-to-t from-[#E76F51] to-[#F4A79D]'
                        : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                    style={{ height: `${bar.height}%` }}
                  />
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{bar.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-white/90 dark:bg-[#1A1F2E]/90 backdrop-blur-xl rounded-2xl border border-slate-200/60 dark:border-slate-700/40 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold" style={{ color: "#475569" }}>Leaderboard</h4>
              <Trophy className="w-3.5 h-3.5" style={{ color: "#d97706" }} />
            </div>
            <div className="space-y-3">
              <LeaderboardItem rank="1st" name="Yuki T." country="JP" xp="2,840" isTop />
              <LeaderboardItem rank="#2" name="Sofia M." country="BR" xp="2,710" />
              <LeaderboardItem rank="#3" name={`${user.name?.split(' ')[0] || 'Alex'} (You)`} country="US" xp="2,590" isUser />
              <LeaderboardItem rank="#4" name="Arjun P." country="IN" xp="2,430" />
            </div>
            <button
              onClick={handleViewLeaderboard}
              className="mt-4 w-full text-sm font-semibold text-[#E76F51] dark:text-[#F4A79D] hover:text-[#D65A3D] dark:hover:text-[#F4A79D] flex items-center justify-center gap-1"
            >
              Full leaderboard
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Achievements */}
          <div className="bg-white/90 dark:bg-[#1A1F2E]/90 backdrop-blur-xl rounded-2xl border border-slate-200/60 dark:border-slate-700/40 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold" style={{ color: "#475569" }}>Achievements</h4>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
            </div>
            <div className="space-y-3">
              <AchievementCard
                icon={<Flame className="w-5 h-5 text-white" strokeWidth={2.5} />}
                title="45-Day Streak!"
                description="Consistency champion"
                gradient="from-[#FF8C42] to-[#F97316]"
                featured
              />
              <AchievementCard
                icon={<Zap className="w-4 h-4 text-[#F59E0B]" strokeWidth={2.5} />}
                title="Speed Learner"
                description="Completed in record time"
                gradient="from-[#FEF3C7] to-[#FDE68A] dark:from-[#78350F]/20 dark:to-[#92400E]/20"
              />
              <AchievementCard
                icon={<Star className="w-4 h-4 text-[#E76F51]" strokeWidth={2.5} />}
                title="Perfect Score"
                description="100% on Grammar Quiz"
                gradient="from-[#DBEAFE] to-[#BFDBFE] dark:from-[#8B4034]/20 dark:to-[#1E40AF]/20"
              />
            </div>
            <button
              onClick={handleViewAchievements}
              className="mt-4 w-full text-sm font-semibold text-[#E76F51] dark:text-[#F4A79D] hover:text-[#D65A3D] dark:hover:text-[#F4A79D] flex items-center justify-center gap-1"
            >
              View all achievements
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

// Component: Level Node
function LevelNode({ title, subtitle, completed = false, active = false, onClick }: {
  title: string;
  subtitle: string;
  completed?: boolean;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center relative z-10 hover:scale-110 transition-transform cursor-pointer"
    >
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all ${
          active
            ? 'bg-[#E76F51] border-[#F4A79D] shadow-lg shadow-[#E76F51]/40'
            : completed
            ? 'bg-[#10B981] border-[#6EE7B7]'
            : 'bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600'
        }`}
      >
        {completed ? (
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : active ? (
          <span className="text-base font-bold text-white">{subtitle}</span>
        ) : (
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{subtitle}</span>
        )}
      </div>
      <div className="mt-3 text-center">
        <p className={`text-sm font-semibold ${active ? 'text-[#E76F51] dark:text-[#F4A79D]' : completed ? 'text-[#10B981] dark:text-[#34D399]' : 'text-slate-500 dark:text-slate-400'}`}>
          {title}
        </p>
        {!completed && !active && (
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{subtitle}</p>
        )}
      </div>
    </button>
  );
}

// Component: Course Card
function CourseCard({
  icon,
  tag,
  title,
  description,
  progress,
  color,
  courseId,
  onResume
}: {
  icon: React.ReactNode;
  tag: string;
  title: string;
  description: string;
  progress: number;
  color: 'blue' | 'purple' | 'amber' | 'teal';
  courseId: string;
  onResume: (id: string) => void;
}) {
  const colorConfig = {
    blue: {
      mainColor: '#2563eb',
      bgColor: '#eff6ff',
      ringBg: '#dbeafe'
    },
    purple: {
      mainColor: '#6d28d9',
      bgColor: '#f5f3ff',
      ringBg: '#ede9fe'
    },
    amber: {
      mainColor: '#c2410c',
      bgColor: '#fff7ed',
      ringBg: '#fed7aa'
    },
    teal: {
      mainColor: '#0f766e',
      bgColor: '#f0fdfa',
      ringBg: '#99f6e4'
    }
  };

  const config = colorConfig[color];

  // Progress ring calculation
  const size = 48;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div
      onClick={() => onResume(courseId)}
      className="relative rounded-2xl p-8 cursor-pointer overflow-hidden hover:-translate-y-1 transition-all duration-200 flex flex-col"
      style={{
        background: `linear-gradient(150deg, ${config.bgColor} 0%, #fff 100%)`,
        border: '1.5px solid rgba(255,255,255,0.95)',
        boxShadow: '0 2px 18px rgba(0,0,0,0.065)',
        minHeight: '280px'
      }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-4 gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div
            className="flex items-center justify-center rounded-xl flex-shrink-0"
            style={{
              width: 40,
              height: 40,
              background: `${config.mainColor}18`,
              color: config.mainColor
            }}
          >
            {icon}
          </div>
          <div className="min-w-0">
            <span
              className="inline-block text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md mb-1.5"
              style={{
                background: `${config.mainColor}15`,
                color: config.mainColor
              }}
            >
              {tag}
            </span>
            <h3 className="text-base font-extrabold leading-tight text-slate-800">
              {title}
            </h3>
          </div>
        </div>
        {/* Ring */}
        <div className="relative flex-shrink-0">
          <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', display: 'block' }}>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={config.ringBg}
              strokeWidth={strokeWidth}
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={config.mainColor}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1) 0.2s' }}
            />
          </svg>
          <span
            className="absolute inset-0 flex items-center justify-center text-xs font-bold"
            style={{ color: config.mainColor }}
          >
            {progress}%
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm font-normal leading-relaxed mb-6 flex-grow" style={{ color: '#64748b' }}>
        {description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 mt-auto">
        <div className="flex items-center gap-1.5 flex-1">
          <div
            className="h-1.5 rounded-full overflow-hidden"
            style={{ width: 80, background: config.ringBg }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${progress}%`,
                background: config.mainColor,
                transition: 'width 1.6s cubic-bezier(0.4,0,0.2,1) 0.3s'
              }}
            />
          </div>
          <span className="text-xs font-semibold whitespace-nowrap" style={{ color: '#94a3b8' }}>
            {progress}% complete
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click
            onResume(courseId);
          }}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold text-white flex-shrink-0 hover:scale-105 active:scale-95 transition-transform"
          style={{
            background: config.mainColor,
            boxShadow: `0 4px 14px ${config.mainColor}45`
          }}
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          Resume
        </button>
      </div>
    </div>
  );
}

// Component: Stat Item
function StatItem({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="flex flex-col items-center gap-1 p-2 rounded-xl" style={{ background: "#f8fafc" }}>
      <div style={{ color: color }}>
        {icon}
      </div>
      <span className="text-xs font-bold" style={{ color: "#0d1117" }}>{value}</span>
      <span className="text-[10px] font-medium" style={{ color: "#94a3b8" }}>{label}</span>
    </div>
  );
}

// Component: Leaderboard Item
function LeaderboardItem({
  rank,
  name,
  country,
  xp,
  isTop = false,
  isUser = false
}: {
  rank: string;
  name: string;
  country: string;
  xp: string;
  isTop?: boolean;
  isUser?: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isUser ? 'bg-[#FEF5F3] dark:bg-[#8B4034]/30 border-2 border-[#E76F51] dark:border-[#E76F51]' : 'bg-slate-50 dark:bg-slate-800/50'}`}>
      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
        isTop ? 'bg-gradient-to-br from-[#F59E0B] to-[#F97316] text-white shadow-sm' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
      }`}>
        {isTop ? '👑' : rank}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{name}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{country}</p>
      </div>
      <span className="text-sm font-bold text-slate-900 dark:text-white">{xp}</span>
    </div>
  );
}

// Component: Achievement Card
function AchievementCard({
  icon,
  title,
  description,
  gradient,
  featured = false
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  featured?: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl transition-all ${featured ? 'bg-gradient-to-r ' + gradient + ' shadow-sm' : 'bg-slate-50 dark:bg-slate-800/50'}`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
        featured ? 'bg-white/25 backdrop-blur-sm' : 'bg-white dark:bg-slate-700'
      }`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-bold ${featured ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{title}</p>
        <p className={`text-xs ${featured ? 'text-white/95' : 'text-slate-500 dark:text-slate-400'}`}>{description}</p>
      </div>
    </div>
  );
}
