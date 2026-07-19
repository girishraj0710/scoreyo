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

          {/* Center - Illustration + Message */}
          <div className="flex flex-col items-center justify-center space-y-8">
            {/* Modern Illustration */}
            <div className="relative w-full max-w-md">
              <svg viewBox="0 0 400 320" className="w-full h-auto drop-shadow-2xl" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Background Circles */}
                <circle cx="200" cy="160" r="140" fill="white" opacity="0.1" />
                <circle cx="200" cy="160" r="110" fill="white" opacity="0.15" />

                {/* Main Book/Document */}
                <g transform="translate(120, 80)">
                  {/* Book Pages */}
                  <rect x="0" y="20" width="160" height="180" rx="8" fill="white" opacity="0.95" />
                  <rect x="5" y="25" width="150" height="170" rx="6" fill="#f8fafc" />

                  {/* Text Lines on Book */}
                  <line x1="20" y1="50" x2="140" y2="50" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" />
                  <line x1="20" y1="70" x2="120" y2="70" stroke="#a5b4fc" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="20" y1="85" x2="135" y2="85" stroke="#a5b4fc" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="20" y1="100" x2="110" y2="100" stroke="#a5b4fc" strokeWidth="2.5" strokeLinecap="round" />

                  {/* Checkmark Circle */}
                  <circle cx="80" cy="140" r="25" fill="#10b981" />
                  <path d="M70 140 L77 147 L92 132" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </g>

                {/* Floating Elements */}
                {/* Star 1 */}
                <g transform="translate(60, 60)">
                  <path d="M12 2 L14 10 L22 10 L16 15 L18 23 L12 18 L6 23 L8 15 L2 10 L10 10 Z" fill="#fbbf24" opacity="0.9" />
                </g>

                {/* Star 2 */}
                <g transform="translate(320, 100)">
                  <path d="M12 2 L14 10 L22 10 L16 15 L18 23 L12 18 L6 23 L8 15 L2 10 L10 10 Z" fill="#fbbf24" opacity="0.8" />
                </g>

                {/* Bulb Icon */}
                <g transform="translate(300, 220)">
                  <circle cx="20" cy="15" r="12" fill="white" opacity="0.9" />
                  <circle cx="20" cy="15" r="8" fill="#fbbf24" />
                  <rect x="17" y="25" width="6" height="4" rx="1" fill="white" opacity="0.8" />
                </g>

                {/* Trophy Icon */}
                <g transform="translate(40, 220)">
                  <ellipse cx="25" cy="35" rx="20" ry="4" fill="white" opacity="0.2" />
                  <path d="M15 10 L15 20 Q15 28 25 32 L35 32 Q45 28 45 20 L45 10 Z" fill="white" opacity="0.95" />
                  <rect x="22" y="32" width="6" height="8" fill="white" opacity="0.9" />
                  <ellipse cx="25" cy="8" rx="10" ry="3" fill="#fbbf24" />
                </g>

                {/* Animated Particles */}
                <circle cx="90" cy="140" r="3" fill="white" opacity="0.6">
                  <animate attributeName="cy" values="140;120;140" dur="3s" repeatCount="indefinite" />
                </circle>
                <circle cx="310" cy="180" r="2.5" fill="white" opacity="0.5">
                  <animate attributeName="cy" values="180;160;180" dur="4s" repeatCount="indefinite" />
                </circle>
                <circle cx="150" cy="60" r="2" fill="white" opacity="0.4">
                  <animate attributeName="cy" values="60;40;60" dur="5s" repeatCount="indefinite" />
                </circle>
              </svg>
            </div>

            {/* Text Content */}
            <div className="text-center space-y-4 px-6">
              <h1 className="text-4xl font-bold leading-tight tracking-tight">
                Your journey to success
                <br />
                starts here
              </h1>
              <p className="text-lg text-white/90 leading-relaxed">
                Smart preparation for every competitive exam
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
