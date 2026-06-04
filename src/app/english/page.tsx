"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/context/user-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { englishPaths, type EnglishPath } from "@/lib/english-content";
import { getPathIcon } from "@/lib/english-icons";
import { BookOpen, Target, TrendingUp, Award, Calendar, Zap } from "lucide-react";

export default function EnglishHubPage() {
  const router = useRouter();
  const { user, isLoading, setShowLoginModal } = useUser();

  // Redirect contributors to contributor portal
  useEffect(() => {
    if (!isLoading && user && ["contributor", "admin"].includes(user.role || "")) {
      router.push("/contributor");
    }
  }, [user, isLoading, router]);
  const [dailyStreak, setDailyStreak] = useState(0);
  const [todayCompleted, setTodayCompleted] = useState(false);

  useEffect(() => {
    if (user) {
      fetchDailyStreak();
    }
  }, [user]);

  const fetchDailyStreak = async () => {
    try {
      const res = await fetch("/api/english/daily-streak");
      if (res.ok) {
        const data = await res.json();
        setDailyStreak(data.streak || 0);
        setTodayCompleted(data.todayCompleted || false);
      }
    } catch (error) {
      console.error("Failed to fetch daily streak:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
        <div className="w-12 h-12 border-4 rounded-full animate-spin" style={{ borderColor: 'var(--primary-light)', borderTopColor: 'var(--primary)' }}></div>
      </div>
    );
  }

  // Landing page for non-authenticated users
  if (!user) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
        <div className="max-w-6xl mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#4255FF] rounded-2xl mb-6 shadow-lg">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[#4255FF] via-violet-600 to-violet-500 bg-clip-text text-transparent">
                Master English Language
              </span>
            </h1>
            <p className="text-xl max-w-3xl mx-auto mb-8" style={{ color: 'var(--foreground-secondary)' }}>
              Comprehensive English learning for competitive exams, IELTS, TOEFL, and professional communication
            </p>
            <button
              onClick={() => setShowLoginModal(true)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#4255FF] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Start Learning English
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>

          {/* Learning Paths Preview */}
          <div className="grid md:grid-cols-3 gap-6 mb-16 items-stretch">
            {/* Foundation Builder - First Card */}
            <div className="rounded-2xl p-8 shadow-lg flex flex-col h-full" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 flex-shrink-0" style={{ background: 'var(--primary-bg)' }}>
                <BookOpen className="w-6 h-6" style={{ color: 'var(--primary)' }} />
              </div>
              <h3 className="text-xl font-bold mb-2 min-h-[2rem]" style={{ color: 'var(--foreground)' }}>Foundation Builder</h3>
              <p className="mb-4 min-h-[3rem]" style={{ color: 'var(--foreground-secondary)' }}>Build strong foundations from A1 to B1 level</p>
              <ul className="space-y-2.5 text-sm" style={{ color: 'var(--foreground-secondary)' }}>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" style={{ color: 'var(--primary)' }}>
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Start from scratch - complete beginner friendly</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" style={{ color: 'var(--primary)' }}>
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Essential grammar rules with examples</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" style={{ color: 'var(--primary)' }}>
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Common vocabulary for daily communication</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" style={{ color: 'var(--primary)' }}>
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Pronunciation & conversation practice</span>
                </li>
              </ul>
            </div>

            {/* Competitive Exams - Second Card */}
            <div className="rounded-2xl p-8 shadow-lg flex flex-col h-full" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 flex-shrink-0" style={{ background: 'var(--hover-bg)' }}>
                <Target className="w-6 h-6" style={{ color: 'var(--primary)' }} />
              </div>
              <h3 className="text-xl font-bold mb-2 min-h-[2rem]" style={{ color: 'var(--foreground)' }}>Competitive Exams</h3>
              <p className="mb-4 min-h-[3rem]" style={{ color: 'var(--foreground-secondary)' }}>Master English for SSC, Banking, Railways, state exams</p>
              <ul className="space-y-2.5 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-[#4255FF] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Grammar fundamentals & advanced topics</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-[#4255FF] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Vocabulary building with exam patterns</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-[#4255FF] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Reading comprehension strategies</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-[#4255FF] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Error spotting & sentence correction</span>
                </li>
              </ul>
            </div>

            {/* IELTS/TOEFL - Third Card */}
            <div className="rounded-2xl p-8 shadow-lg flex flex-col h-full" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 flex-shrink-0" style={{ background: 'var(--hover-bg)' }}>
                <Award className="w-6 h-6" style={{ color: 'var(--primary)' }} />
              </div>
              <h3 className="text-xl font-bold mb-2 min-h-[2rem]" style={{ color: 'var(--foreground)' }}>IELTS/TOEFL</h3>
              <p className="mb-4 min-h-[3rem]" style={{ color: 'var(--foreground-secondary)' }}>Achieve your target band score for study abroad</p>
              <ul className="space-y-2.5 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-[#4255FF] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Academic writing techniques & templates</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-[#4255FF] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Speaking fluency & pronunciation drills</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-[#4255FF] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Listening practice with native speakers</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-[#4255FF] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Test-taking strategies & time management</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Features */}
          <div className="rounded-2xl p-8 shadow-lg mb-16" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
            <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: 'var(--primary)' }}>Why Choose Our English Hub?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: 'var(--hover-bg)' }}>
                  <TrendingUp className="w-8 h-8" style={{ color: 'var(--primary)' }} />
                </div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--primary)' }}>AI-Powered Learning</h3>
                <p className="text-sm" style={{ color: 'var(--foreground-secondary)' }}>Personalized recommendations based on your performance and goals</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: 'var(--warning-light)' }}>
                  <Calendar className="w-8 h-8" style={{ color: 'var(--warning)' }} />
                </div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--primary)' }}>Daily Practice Streaks</h3>
                <p className="text-sm" style={{ color: 'var(--foreground-secondary)' }}>10-minute daily sessions to build habits and maintain learning momentum</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: 'var(--hover-bg)' }}>
                  <Zap className="w-8 h-8" style={{ color: 'var(--primary)' }} />
                </div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--primary)' }}>Rich Explanations</h3>
                <p className="text-sm" style={{ color: 'var(--foreground-secondary)' }}>Detailed explanations with examples, grammar rules, and common mistakes</p>
              </div>
            </div>
          </div>

          {/* Learning Topics */}
          <div className="bg-gradient-to-r from-[#4255FF] via-violet-600 to-violet-500 rounded-2xl p-8 text-white mb-16">
            <h2 className="text-2xl font-bold mb-6 text-center">What You'll Learn</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Grammar: Tenses, Voice, Narration, Articles</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Vocabulary: Synonyms, Antonyms, Idioms</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Reading: Comprehension & Speed Reading</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Writing: Essays, Letters, Reports</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Speaking: Pronunciation & Fluency</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Listening: Accent Training & Comprehension</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#3242CC] mb-4">Ready to Master English?</h2>
            <p className="text-slate-600 mb-8">Join thousands of students improving their English skills every day</p>
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-8 py-4 bg-[#4255FF] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Get Started - It's Free
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getLevelBadge = (path: EnglishPath) => {
    const levels = [...new Set(path.topics.map(t => t.level))];
    return levels.join(" → ");
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold" style={{ color: 'var(--foreground)' }}>
              English Learning Hub
            </h1>
            <div className="flex items-center gap-6">
              {/* Daily Streak */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl shadow-sm" style={{ background: 'var(--card-bg)', border: '1px solid var(--warning-light)' }}>
                <Zap className={`w-5 h-5`} style={{ color: todayCompleted ? 'var(--warning)' : 'var(--foreground-tertiary)' }} />
                <div>
                  <div className="text-xs" style={{ color: 'var(--foreground-tertiary)' }}>Daily Streak</div>
                  <div className="text-xl font-bold" style={{ color: 'var(--warning)' }}>{dailyStreak} days</div>
                </div>
              </div>
            </div>
          </div>
          <p className="text-lg" style={{ color: 'var(--foreground-secondary)' }}>
            Master English for competitive exams, IELTS, TOEFL, and real-world communication
          </p>
        </div>

        {/* Quick Assessment */}
        <div className="mb-8 bg-gradient-to-r from-[#4255FF] via-violet-600 to-violet-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                Comprehensive Level Assessment
              </h2>
              <p className="text-blue-100 mb-4">
                Take a 10-minute test with 20 questions to accurately find your English level and get a personalized learning path
              </p>
              <Link href="/english/assessment">
                <button className="bg-white text-[#4255FF] px-6 py-3 rounded-lg font-semibold hover:bg-slate-50 transition-all">
                  Start Assessment →
                </button>
              </Link>
            </div>
            <div className="hidden md:block">
              <Target className="w-24 h-24 text-blue-300 opacity-50" />
            </div>
          </div>
        </div>

        {/* Learning Paths */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>Choose Your Learning Path</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {englishPaths.map((path) => {
              const PathIcon = getPathIcon(path.id);
              return (
              <Link key={path.id} href={`/english/${path.id}`} className="h-full">
                <div
                  className="rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all cursor-pointer group h-full flex flex-col"
                  style={{ background: 'var(--card-bg)', border: `2px solid ${path.color}30`, borderColor: `${path.color}30` }}
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${path.color}15` }}
                    >
                      <PathIcon className="w-8 h-8" style={{ color: path.color }} />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-[#4255FF] transition-colors min-h-[3.5rem]" style={{ color: 'var(--foreground)' }}>
                        {path.name}
                      </h3>
                      <p className="text-sm mb-3 min-h-[2.5rem]" style={{ color: 'var(--foreground-secondary)' }}>
                        {path.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-3 py-1 text-xs font-medium rounded-full" style={{ background: 'var(--hover-bg)', color: 'var(--primary)' }}>
                          {getLevelBadge(path)}
                        </span>
                        <span className="px-3 py-1 text-xs font-medium rounded-full" style={{ background: 'var(--hover-bg)', color: 'var(--primary)' }}>
                          {path.totalQuestions}+ questions
                        </span>
                        <span className="px-3 py-1 text-xs font-medium rounded-full" style={{ background: 'var(--warning-light)', color: 'var(--warning)' }}>
                          {path.estimatedWeeks} weeks
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm mt-auto" style={{ color: 'var(--foreground-tertiary)' }}>
                        <BookOpen className="w-4 h-4" />
                        <span>{path.topics.length} topics</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
              );
            })}
          </div>
        </div>

        {/* Features Highlight */}
        <div className="rounded-2xl p-8 shadow-sm" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>Why Choose Our English Hub?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--hover-bg)' }}>
                <TrendingUp className="w-5 h-5" style={{ color: 'var(--primary)' }} />
              </div>
              <div>
                <h3 className="font-semibold mb-1" style={{ color: 'var(--foreground)' }}>AI-Powered Learning</h3>
                <p className="text-sm" style={{ color: 'var(--foreground-secondary)' }}>
                  Personalized recommendations based on your performance and goals
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--warning-light)' }}>
                <Calendar className="w-5 h-5" style={{ color: 'var(--warning)' }} />
              </div>
              <div>
                <h3 className="font-semibold mb-1" style={{ color: 'var(--foreground)' }}>Daily Practice</h3>
                <p className="text-sm" style={{ color: 'var(--foreground-secondary)' }}>
                  10-minute daily sessions to build habits and maintain streaks
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--hover-bg)' }}>
                <Award className="w-5 h-5" style={{ color: 'var(--primary)' }} />
              </div>
              <div>
                <h3 className="font-semibold mb-1" style={{ color: 'var(--foreground)' }}>Rich Explanations</h3>
                <p className="text-sm" style={{ color: 'var(--foreground-secondary)' }}>
                  Detailed explanations with examples, traps, and common mistakes
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
