"use client";

import React from 'react';
import {
  Home, BookOpen, Library, Type, Mic, FileText, BarChart3,
  Settings, TrendingUp, Trophy, Flame, Zap, Star, Clock, Target
} from 'lucide-react';

export default function EnglishLearningDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      <div className="flex">
        {/* LEFT SIDEBAR */}
        <aside className="w-64 min-h-screen bg-white/80 backdrop-blur-xl border-r border-slate-200/60 flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-slate-200/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-900">English Hub</h1>
                <p className="text-xs text-slate-500">Learn. Practice. Excel</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            <NavItem icon={<Home className="w-5 h-5" />} label="Dashboard" active />
            <NavItem icon={<BookOpen className="w-5 h-5" />} label="Learning Path" />
            <NavItem icon={<Library className="w-5 h-5" />} label="Vocabulary" />
            <NavItem icon={<Type className="w-5 h-5" />} label="Grammar" />
            <NavItem icon={<Mic className="w-5 h-5" />} label="Speaking" />
            <NavItem icon={<FileText className="w-5 h-5" />} label="Exam Prep" />
            <NavItem icon={<BarChart3 className="w-5 h-5" />} label="Progress" />
          </nav>

          {/* Bottom Profile */}
          <div className="p-4 border-t border-slate-200/60">
            <button className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 w-full mb-4">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-200/60">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                A
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900">Alex Johnson</p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>2,590 XP</span>
                  <span>·</span>
                  <span>B1 Intermediate</span>
                </div>
              </div>
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <div className="mt-3 px-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-600">Progress to B2</span>
                <span className="text-blue-600 font-semibold">76%</span>
              </div>
              <div className="h-2 bg-slate-200/80 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-600 to-blue-500 rounded-full" style={{ width: '76%' }} />
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto">
          {/* Header */}
          <header className="bg-white/40 backdrop-blur-xl border-b border-slate-200/60 px-8 py-4 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Welcome back, Alex</h2>
                <p className="text-sm text-slate-500">Sunday, June 22 — Keep the streak alive</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200/60">
                  <Flame className="w-5 h-5 text-amber-600" />
                  <span className="text-sm font-bold text-amber-900">45</span>
                  <span className="text-sm text-amber-700">day streak</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 border border-blue-200/60">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-bold text-blue-900">2,590</span>
                  <span className="text-sm text-blue-700">XP</span>
                </div>
                <button className="relative">
                  <div className="w-2 h-2 bg-blue-600 rounded-full absolute top-0 right-0" />
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                    🔔
                  </div>
                </button>
              </div>
            </div>
          </header>

          <div className="p-8 space-y-6">
            {/* Learning Path Progression */}
            <section className="bg-white/60 backdrop-blur-xl rounded-2xl border border-slate-200/60 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Your Learning Path</h3>
                  <p className="text-sm text-slate-500">Currently active at B1 / B2 Intermediate</p>
                </div>
                <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  Full path
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Progress Nodes */}
              <div className="flex items-center justify-between relative">
                {/* Connection Lines */}
                <div className="absolute top-8 left-16 right-16 h-0.5 bg-slate-300" style={{ zIndex: 0 }} />

                <LevelNode title="Beginner" subtitle="A1" completed />
                <LevelNode title="Elementary" subtitle="A2" completed />
                <LevelNode title="Intermediate" subtitle="B1/B2" active />
                <LevelNode title="Advanced" subtitle="C1" />
                <LevelNode title="Test Prep" subtitle="IELTS" />
              </div>
            </section>

            {/* Next Up Card */}
            <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-2xl p-6 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />

              <div className="relative flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold uppercase text-white/80" style={{ letterSpacing: '0.2em' }}>NEXT UP</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-1">Intermediate & Advanced Mastery</h3>
                  <p className="text-base text-white/90 mb-4">Unit 12 — Conditional Structures</p>
                  <div className="flex items-center gap-4 text-sm text-white/80">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>25 min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap className="w-4 h-4" />
                      <span>+40 XP</span>
                    </div>
                  </div>
                </div>
                <button className="px-8 py-3 rounded-xl bg-white text-blue-700 font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2 shadow-lg">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Continue
                </button>
              </div>
            </section>

            {/* Course Tracks */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900">Course Tracks</h3>
                <span className="text-sm text-slate-500">4 courses enrolled</span>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <CourseCard
                  icon={<BookOpen className="w-5 h-5" />}
                  tag="CEFR A1-A2 LEVEL"
                  title="Basic English & Vocabulary"
                  description="Build your core grammar, everyday conversational vocabulary, and sentence structures from scratch."
                  progress={85}
                  color="blue"
                />

                <CourseCard
                  icon={<Target className="w-5 h-5" />}
                  tag="CEFR B1-C1 LEVEL"
                  title="Intermediate & Advanced Mastery"
                  description="Master complex grammar, nuanced vocabulary expressions, professional business writing, and confident rhetoric."
                  progress={60}
                  color="purple"
                />

                <CourseCard
                  icon={<Library className="w-5 h-5" />}
                  tag="ALL LEVELS"
                  title="Dedicated Vocabulary Builder"
                  description="Learn 5,000+ high-frequency words, contextual idioms, phrasal verbs, and professional jargon via smart flashcards."
                  progress={32}
                  color="amber"
                />

                <CourseCard
                  icon={<FileText className="w-5 h-5" />}
                  tag="EXAM TRACK"
                  title="Standardized Test Prep: IELTS & TOEFL"
                  description="Targeted strategies, practice questions, mock tests, and evaluation tools to crack academic reading, writing, listening, and speaking modules."
                  progress={10}
                  color="teal"
                />
              </div>
            </section>
          </div>
        </main>

        {/* RIGHT SIDEBAR & MOBILE VIEW */}
        <aside className="w-80 2xl:w-[800px] min-h-screen bg-white/40 backdrop-blur-xl border-l border-slate-200/60 p-6 space-y-6 overflow-y-auto">
          <div className="2xl:grid 2xl:grid-cols-2 2xl:gap-6 space-y-6 2xl:space-y-0">
            {/* Metrics Column */}
            <div className="space-y-6">
              {/* Daily Goal */}
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/60 p-6">
                <h4 className="text-sm font-bold text-slate-900 mb-4">Daily Goal</h4>
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32">
                    <svg className="transform -rotate-90 w-32 h-32">
                      <circle cx="64" cy="64" r="56" stroke="#e2e8f0" strokeWidth="8" fill="none" />
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
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#2563eb" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-slate-900">68%</span>
                      <span className="text-xs text-slate-500">of 30 min</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-6 mt-6 w-full">
                    <StatItem label="Lessons" value="5/5" />
                    <StatItem label="Words" value="12/20" />
                    <StatItem label="XP Today" value="85" />
                  </div>
                </div>
              </div>

              {/* Weekly XP */}
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/60 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-slate-900">Weekly XP</h4>
                  <span className="text-xs font-semibold text-green-600">+23% this week</span>
                </div>
                <div className="flex items-end justify-between h-32 gap-2">
                  {[
                    { day: 'M', height: 40, value: 180 },
                    { day: 'T', height: 55, value: 240 },
                    { day: 'W', height: 60, value: 280 },
                    { day: 'T', height: 45, value: 210 },
                    { day: 'F', height: 65, value: 290 },
                    { day: 'S', height: 70, value: 310 },
                    { day: 'S', height: 100, value: 450, active: true },
                  ].map((bar, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <div
                        className={`w-full rounded-lg transition-all ${
                          bar.active
                            ? 'bg-gradient-to-t from-blue-600 to-blue-400'
                            : 'bg-slate-200'
                        }`}
                        style={{ height: `${bar.height}%` }}
                      />
                      <span className="text-xs text-slate-500 font-medium">{bar.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Leaderboard */}
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/60 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-slate-900">Leaderboard</h4>
                  <Trophy className="w-4 h-4 text-amber-500" />
                </div>
                <div className="space-y-3">
                  <LeaderboardItem rank="1st" name="Yuki T." country="JP" xp="2,840" isTop />
                  <LeaderboardItem rank="#2" name="Sofia M." country="BR" xp="2,710" />
                  <LeaderboardItem rank="#3" name="Alex (You)" country="US" xp="2,590" isUser />
                  <LeaderboardItem rank="#4" name="Arjun P." country="IN" xp="2,430" />
                </div>
                <button className="mt-4 w-full text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1">
                  Full leaderboard
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>

              {/* Achievements */}
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/60 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-slate-900">Achievements</h4>
                  <Star className="w-4 h-4 text-purple-500" />
                </div>
                <div className="space-y-3">
                  <AchievementCard
                    icon={<Flame className="w-5 h-5 text-white" />}
                    title="45-Day Streak!"
                    description="Consistency champion"
                    gradient="from-orange-500 to-amber-600"
                    featured
                  />
                  <AchievementCard
                    icon={<Zap className="w-4 h-4 text-amber-600" />}
                    title="Speed Learner"
                    description="Completed in record time"
                    gradient="from-amber-50 to-amber-100"
                  />
                  <AchievementCard
                    icon={<Star className="w-4 h-4 text-blue-600" />}
                    title="Perfect Score"
                    description="100% on Grammar Quiz"
                    gradient="from-blue-50 to-blue-100"
                  />
                </div>
              </div>
            </div>

            {/* Mobile View Column (2xl screens only) */}
            <div className="hidden 2xl:block">
              <div className="sticky top-6">
                <div className="text-center mb-4">
                  <span className="text-xs font-semibold uppercase text-slate-500" style={{ letterSpacing: '0.2em' }}>MOBILE VIEW</span>
                </div>
                <MobilePreview />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

// Component: Navigation Item
function NavItem({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        active
          ? 'bg-blue-50 text-blue-600 font-semibold'
          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      {icon}
      <span className="text-sm">{label}</span>
      {active && (
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />
      )}
    </button>
  );
}

// Component: Level Node
function LevelNode({ title, subtitle, completed = false, active = false }: {
  title: string;
  subtitle: string;
  completed?: boolean;
  active?: boolean;
}) {
  return (
    <div className="flex flex-col items-center relative z-10">
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all ${
          active
            ? 'bg-blue-600 border-blue-300 shadow-lg shadow-blue-500/50'
            : completed
            ? 'bg-green-600 border-green-300'
            : 'bg-slate-200 border-slate-300'
        }`}
      >
        {completed ? (
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        ) : active ? (
          <span className="text-xl font-bold text-white">{subtitle}</span>
        ) : (
          <span className="text-sm font-semibold text-slate-500">{subtitle}</span>
        )}
      </div>
      <div className="mt-3 text-center">
        <p className={`text-sm font-semibold ${active ? 'text-blue-600' : completed ? 'text-green-600' : 'text-slate-500'}`}>
          {title}
        </p>
        {!completed && !active && (
          <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

// Component: Course Card
function CourseCard({
  icon,
  tag,
  title,
  description,
  progress,
  color
}: {
  icon: React.ReactNode;
  tag: string;
  title: string;
  description: string;
  progress: number;
  color: 'blue' | 'purple' | 'amber' | 'teal';
}) {
  const colorStyles = {
    blue: {
      bg: 'from-blue-50 to-blue-100/50',
      border: 'border-blue-200/60',
      iconBg: 'bg-blue-600',
      tagText: 'text-blue-700',
      tagBg: 'bg-blue-100',
      progressBg: 'bg-blue-200',
      progressFill: 'bg-blue-600',
      button: 'bg-blue-600 hover:bg-blue-700 text-white',
      ring: 'stroke-blue-600'
    },
    purple: {
      bg: 'from-purple-50 to-purple-100/50',
      border: 'border-purple-200/60',
      iconBg: 'bg-purple-600',
      tagText: 'text-purple-700',
      tagBg: 'bg-purple-100',
      progressBg: 'bg-purple-200',
      progressFill: 'bg-purple-600',
      button: 'bg-purple-600 hover:bg-purple-700 text-white',
      ring: 'stroke-purple-600'
    },
    amber: {
      bg: 'from-amber-50 to-orange-100/50',
      border: 'border-amber-200/60',
      iconBg: 'bg-amber-600',
      tagText: 'text-amber-800',
      tagBg: 'bg-amber-100',
      progressBg: 'bg-amber-200',
      progressFill: 'bg-amber-600',
      button: 'bg-amber-600 hover:bg-amber-700 text-white',
      ring: 'stroke-amber-600'
    },
    teal: {
      bg: 'from-teal-50 to-emerald-100/50',
      border: 'border-teal-200/60',
      iconBg: 'bg-teal-600',
      tagText: 'text-teal-800',
      tagBg: 'bg-teal-100',
      progressBg: 'bg-teal-200',
      progressFill: 'bg-teal-600',
      button: 'bg-teal-600 hover:bg-teal-700 text-white',
      ring: 'stroke-teal-600'
    }
  };

  const styles = colorStyles[color];

  return (
    <div className={`bg-gradient-to-br ${styles.bg} backdrop-blur-xl rounded-2xl border ${styles.border} p-6 hover:shadow-lg transition-shadow`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${styles.iconBg} flex items-center justify-center text-white`}>
          {icon}
        </div>
        <div className="relative w-16 h-16">
          <svg className="transform -rotate-90 w-16 h-16">
            <circle cx="32" cy="32" r="28" stroke="#e2e8f0" strokeWidth="4" fill="none" />
            <circle
              cx="32" cy="32" r="28"
              className={styles.ring}
              strokeWidth="4"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 28}`}
              strokeDashoffset={`${2 * Math.PI * 28 * (1 - progress / 100)}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-slate-900">{progress}%</span>
          </div>
        </div>
      </div>

      <div className={`inline-block px-2.5 py-1 rounded-lg ${styles.tagBg} mb-3`}>
        <span className={`text-xs font-bold uppercase tracking-wide ${styles.tagText}`}>{tag}</span>
      </div>

      <h4 className="text-base font-bold text-slate-900 mb-2">{title}</h4>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">{description}</p>

      <div className={`h-2 ${styles.progressBg} rounded-full overflow-hidden mb-4`}>
        <div className={`h-full ${styles.progressFill} rounded-full transition-all`} style={{ width: `${progress}%` }} />
      </div>

      <button className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 ${styles.button}`}>
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
        Resume
      </button>
    </div>
  );
}

// Component: Stat Item
function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-slate-100 flex items-center justify-center">
        <span className="text-xs">📚</span>
      </div>
      <p className="text-xs font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
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
    <div className={`flex items-center gap-3 p-3 rounded-xl ${isUser ? 'bg-blue-50 border-2 border-blue-200' : 'bg-slate-50'}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
        isTop ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white' : 'bg-slate-200 text-slate-600'
      }`}>
        {isTop ? '👑' : rank}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-900">{name}</p>
        <p className="text-xs text-slate-500">{country}</p>
      </div>
      <span className="text-sm font-bold text-slate-900">{xp}</span>
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
    <div className={`flex items-center gap-3 p-3 rounded-xl ${featured ? 'bg-gradient-to-r ' + gradient : 'bg-slate-50'}`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
        featured ? 'bg-white/20 backdrop-blur-sm' : 'bg-white'
      }`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-bold ${featured ? 'text-white' : 'text-slate-900'}`}>{title}</p>
        <p className={`text-xs ${featured ? 'text-white/90' : 'text-slate-500'}`}>{description}</p>
      </div>
    </div>
  );
}

// Component: Mobile Preview
function MobilePreview() {
  return (
    <div className="relative mx-auto" style={{ width: '320px' }}>
      {/* Phone Frame */}
      <div className="relative bg-slate-900 rounded-[3rem] p-3 shadow-2xl">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-3xl z-10" />

        {/* Screen */}
        <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 rounded-[2.5rem] overflow-hidden" style={{ height: '650px' }}>
          {/* Mobile Header */}
          <div className="bg-white/60 backdrop-blur-xl p-4 border-b border-slate-200/60">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-slate-900">Hi, Alex</span>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-xs">
                  <Flame className="w-3 h-3 text-amber-600" />
                  <span className="font-bold text-amber-900">45</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <Zap className="w-3 h-3 text-blue-600" />
                  <span className="font-bold text-blue-900">2,590</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-500">Sunday, June 22</p>
          </div>

          {/* Mobile Content */}
          <div className="p-4 space-y-3 overflow-y-auto" style={{ height: 'calc(650px - 80px)' }}>
            {/* Your Path */}
            <div className="bg-white/80 backdrop-blur-xl rounded-xl p-3 border border-slate-200/60">
              <p className="text-xs font-bold text-slate-900 mb-3">Your Path</p>
              <div className="flex items-center justify-between gap-2">
                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-blue-500/50">
                  B1
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-xs">
                  C1
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-xs">
                  IE
                </div>
              </div>
            </div>

            {/* Course Cards */}
            <div className="space-y-2">
              <MobileCourseCard
                title="Basic English & V..."
                tag="CEFR A1-A2 Level"
                progress={85}
                color="blue"
              />
              <MobileCourseCard
                title="Intermediate & A..."
                tag="CEFR B1-C1 Level"
                progress={60}
                color="purple"
              />
              <MobileCourseCard
                title="Dedicated Voca..."
                tag="All Levels"
                progress={32}
                color="amber"
              />
              <MobileCourseCard
                title="Standardized Test..."
                tag="Exam Track"
                progress={10}
                color="teal"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component: Mobile Course Card
function MobileCourseCard({
  title,
  tag,
  progress,
  color
}: {
  title: string;
  tag: string;
  progress: number;
  color: 'blue' | 'purple' | 'amber' | 'teal';
}) {
  const colorStyles = {
    blue: {
      bg: 'from-blue-50 to-blue-100/50',
      border: 'border-blue-200/60',
      tag: 'bg-blue-100 text-blue-700',
      progress: 'bg-blue-600'
    },
    purple: {
      bg: 'from-purple-50 to-purple-100/50',
      border: 'border-purple-200/60',
      tag: 'bg-purple-100 text-purple-700',
      progress: 'bg-purple-600'
    },
    amber: {
      bg: 'from-amber-50 to-orange-100/50',
      border: 'border-amber-200/60',
      tag: 'bg-amber-100 text-amber-800',
      progress: 'bg-amber-600'
    },
    teal: {
      bg: 'from-teal-50 to-emerald-100/50',
      border: 'border-teal-200/60',
      tag: 'bg-teal-100 text-teal-800',
      progress: 'bg-teal-600'
    }
  };

  const styles = colorStyles[color];

  return (
    <div className={`bg-gradient-to-br ${styles.bg} backdrop-blur-xl rounded-xl border ${styles.border} p-3`}>
      <div className="flex items-center justify-between mb-2">
        <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${styles.tag}`}>
          {tag}
        </div>
        <span className="text-xs font-bold text-slate-900">{progress}%</span>
      </div>
      <p className="text-sm font-bold text-slate-900 mb-2">{title}</p>
      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <div className={`h-full ${styles.progress} rounded-full`} style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}