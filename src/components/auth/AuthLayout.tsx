"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface AuthLayoutProps {
  children: ReactNode;
  side?: "left" | "right";
}

export function AuthLayout({ children, side = "right" }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex bg-white dark:bg-slate-950">
      {/* Left Side - Modern Illustration + Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#6366f1] via-[#8b5cf6] to-[#a855f7]"
      >
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }} />
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          {/* Top - Logo */}
          <Link href="/" className="inline-flex items-center gap-2.5 group hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 rounded-xl bg-white/25 backdrop-blur-md flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight">Krakkify</span>
          </Link>

          {/* Center - Floating UI Elements + Message */}
          <div className="flex flex-col items-center justify-center space-y-12">
            {/* Modern Floating Cards Design */}
            <div className="relative w-full max-w-lg h-80">
              {/* Background Glow */}
              <div className="absolute inset-0 bg-white/5 rounded-3xl blur-3xl" />

              {/* Floating Card 1 - Progress Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="absolute top-8 left-8 w-48 bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-2xl"
                style={{ transform: 'rotate(-6deg)' }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs font-semibold text-gray-600">Your Progress</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">87%</div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '87%' }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                  />
                </div>
              </motion.div>

              {/* Floating Card 2 - Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="absolute top-4 right-8 w-44 bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-2xl"
                style={{ transform: 'rotate(4deg)' }}
              >
                <div className="text-sm text-gray-600 mb-2">Questions Solved</div>
                <div className="text-4xl font-bold text-gray-900">2,847</div>
                <div className="flex items-center gap-1 mt-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span className="text-xs font-semibold text-green-600">+12% this week</span>
                </div>
              </motion.div>

              {/* Floating Card 3 - Streak */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="absolute bottom-8 left-12 w-40 bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl p-5 shadow-2xl"
                style={{ transform: 'rotate(-3deg)' }}
              >
                <div className="text-white/90 text-sm mb-2">Daily Streak</div>
                <div className="flex items-center gap-2">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C12 2 6 7 6 12C6 15.31 8.69 18 12 18C15.31 18 18 15.31 18 12C18 7 12 2 12 2ZM12 16C9.79 16 8 14.21 8 12C8 10.39 9 8.95 10.29 8.03C10.56 8.32 10.81 8.63 11.04 8.96C11.64 9.84 12 10.88 12 12C12 12.55 12.45 13 13 13C13.55 13 14 12.55 14 12C14 10.88 14.36 9.84 14.96 8.96C15.19 8.63 15.44 8.32 15.71 8.03C17 8.95 18 10.39 18 12C18 14.21 16.21 16 14 16H12Z" />
                  </svg>
                  <span className="text-4xl font-bold text-white">15</span>
                </div>
              </motion.div>

              {/* Floating Card 4 - Achievement */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="absolute bottom-12 right-12 w-36 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl"
                style={{ transform: 'rotate(5deg)' }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                </div>
                <div className="text-xs text-center font-semibold text-gray-900">Top 5%</div>
                <div className="text-xs text-center text-gray-600">Nationwide</div>
              </motion.div>

              {/* Decorative Dots */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0.2, 0.5, 0.2],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    duration: 3,
                    delay: i * 0.3,
                    repeat: Infinity
                  }}
                  className="absolute w-2 h-2 bg-white rounded-full"
                  style={{
                    top: `${20 + Math.random() * 60}%`,
                    left: `${10 + Math.random() * 80}%`,
                  }}
                />
              ))}
            </div>

            {/* Text Content */}
            <div className="text-center space-y-4 px-6">
              <h1 className="text-4xl font-bold leading-tight tracking-tight">
                Your journey to success
                <br />
                starts here
              </h1>
              <p className="text-lg text-white/90 leading-relaxed">
                Join 10,000+ students achieving their exam goals
              </p>
            </div>
          </div>

          {/* Bottom - Attribution */}
          <p className="text-sm text-white/50 text-center">
            © 2026 Krakkify
          </p>
        </div>

        {/* Gradient Overlay for Depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
      </motion.div>

      {/* Right Side - Form */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex-1 flex items-center justify-center p-8 lg:p-16 bg-gray-50 dark:bg-slate-900"
      >
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <Link href="/" className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-[#16213E] dark:text-white">Krakkify</span>
          </Link>

          {/* Content */}
          {children}
        </div>
      </motion.div>
    </div>
  );
}
