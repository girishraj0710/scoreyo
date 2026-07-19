"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface AuthLayoutProps {
  children: ReactNode;
  side?: "left" | "right";
}

export function AuthLayout({ children, side = "right" }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex bg-white dark:bg-slate-950 relative">
      {/* Left Side - Solid Premium Color */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#4F46E5]"
      >
        {/* Subtle Texture */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
            backgroundSize: '48px 48px'
          }} />
        </div>

        {/* Content Container */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-semibold">Krakkify</span>
          </Link>

          {/* Center Content */}
          <div className="max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h1 className="text-5xl font-bold leading-[1.1] mb-6" style={{ letterSpacing: '-0.02em' }}>
                Excel in your
                <br />
                competitive exams
              </h1>
              <p className="text-lg text-white/90 leading-relaxed">
                AI-powered practice platform trusted by thousands of students across India.
              </p>
            </motion.div>
          </div>

          {/* Footer */}
          <div className="text-sm text-white/60">
            © 2026 Krakkify
          </div>
        </div>
      </motion.div>

      {/* 3D Educational Illustration - Cuts through divider */}
      <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative w-[450px] h-[450px]"
        >
          {/* 3D Illustration Container */}
          <div className="w-full h-full relative">
            <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              {/* Indigo Base Surface (matches left panel) */}
              <ellipse cx="250" cy="400" rx="200" ry="30" fill="#4F46E5" opacity="0.3" />

              {/* Book Stack - Bottom Book (Purple) */}
              <g transform="translate(140, 300)">
                {/* Shadow */}
                <rect x="2" y="52" width="160" height="20" rx="2" fill="#000000" opacity="0.15" />
                {/* Book spine */}
                <path d="M0 10 L160 0 L160 50 L0 60 Z" fill="#7C3AED" />
                {/* Book top */}
                <path d="M0 10 L160 0 L170 5 L10 15 Z" fill="#8B5CF6" />
                {/* Book front */}
                <rect x="0" y="10" width="10" height="50" fill="#6D28D9" />
              </g>

              {/* Book Stack - Middle Book (Pink) */}
              <g transform="translate(145, 270)">
                {/* Book spine */}
                <path d="M0 10 L150 5 L150 45 L0 50 Z" fill="#EC4899" />
                {/* Book top */}
                <path d="M0 10 L150 5 L160 10 L10 15 Z" fill="#F472B6" />
                {/* Book front */}
                <rect x="0" y="10" width="10" height="40" fill="#DB2777" />
              </g>

              {/* Book Stack - Top Book (Yellow) */}
              <g transform="translate(150, 245)">
                {/* Book spine */}
                <path d="M0 10 L140 8 L140 38 L0 40 Z" fill="#FBBF24" />
                {/* Book top */}
                <path d="M0 10 L140 8 L148 12 L8 14 Z" fill="#FCD34D" />
                {/* Book front */}
                <rect x="0" y="10" width="8" height="30" fill="#F59E0B" />
              </g>

              {/* Tablet/iPad */}
              <g transform="translate(200, 200)">
                {/* Shadow */}
                <rect x="4" y="124" width="140" height="10" rx="5" fill="#000000" opacity="0.2" />
                {/* Tablet body */}
                <rect x="0" y="0" width="140" height="120" rx="8" fill="#1F2937" stroke="#374151" strokeWidth="2" />
                {/* Screen */}
                <rect x="8" y="8" width="124" height="104" rx="4" fill="#4F46E5" />
                {/* Screen content - lines */}
                <rect x="18" y="20" width="80" height="4" rx="2" fill="#818CF8" opacity="0.8" />
                <rect x="18" y="32" width="100" height="4" rx="2" fill="#818CF8" opacity="0.6" />
                <rect x="18" y="44" width="90" height="4" rx="2" fill="#818CF8" opacity="0.6" />
                <rect x="18" y="56" width="70" height="4" rx="2" fill="#818CF8" opacity="0.6" />
                {/* Quiz icon on screen */}
                <circle cx="100" cy="75" r="18" fill="#FCD34D" opacity="0.9" />
                <path d="M95 70 L100 75 L105 65" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" fill="none" />
              </g>

              {/* Graduation Cap */}
              <g transform="translate(320, 180)">
                {/* Shadow */}
                <ellipse cx="40" cy="75" rx="35" ry="8" fill="#000000" opacity="0.15" />
                {/* Cap base (board) */}
                <path d="M40 40 L80 45 L40 50 L0 45 Z" fill="#1F2937" />
                <path d="M40 40 L80 45 L80 48 L40 53 Z" fill="#374151" />
                {/* Cap top (tassel holder) */}
                <circle cx="40" cy="40" r="8" fill="#1F2937" />
                {/* Tassel */}
                <line x1="40" y1="40" x2="40" y2="60" stroke="#FBBF24" strokeWidth="2" />
                <circle cx="40" cy="62" r="4" fill="#F59E0B" />
              </g>

              {/* Floating Notebook */}
              <g transform="translate(100, 160)">
                {/* Notebook */}
                <rect x="0" y="0" width="60" height="80" rx="3" fill="#60A5FA" />
                <rect x="0" y="0" width="8" height="80" fill="#3B82F6" />
                {/* Lines */}
                <line x1="15" y1="20" x2="50" y2="20" stroke="#DBEAFE" strokeWidth="1.5" />
                <line x1="15" y1="30" x2="50" y2="30" stroke="#DBEAFE" strokeWidth="1.5" />
                <line x1="15" y1="40" x2="50" y2="40" stroke="#DBEAFE" strokeWidth="1.5" />
                <line x1="15" y1="50" x2="50" y2="50" stroke="#DBEAFE" strokeWidth="1.5" />
              </g>

              {/* Floating Pen */}
              <g transform="translate(360, 240)">
                <rect x="0" y="0" width="8" height="70" rx="4" fill="#8B5CF6" />
                <rect x="0" y="0" width="8" height="20" rx="4" fill="#A78BFA" />
                <path d="M0 70 L4 80 L8 70 Z" fill="#1F2937" />
              </g>

              {/* Sparkle Stars */}
              <g opacity="0.6">
                <path d="M420 120 L422 126 L428 128 L422 130 L420 136 L418 130 L412 128 L418 126 Z" fill="#FCD34D" />
                <path d="M100 240 L101 244 L105 245 L101 246 L100 250 L99 246 L95 245 L99 244 Z" fill="#F472B6" />
                <path d="M380 320 L382 325 L387 327 L382 329 L380 334 L378 329 L373 327 L378 325 Z" fill="#818CF8" />
                <path d="M130 360 L131 363 L134 364 L131 365 L130 368 L129 365 L126 364 L129 363 Z" fill="#60A5FA" />
              </g>
            </svg>
          </div>

          {/* Floating badge - 10K+ Students */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="absolute top-8 right-4 bg-white dark:bg-slate-800 rounded-xl shadow-xl px-4 py-3 border border-slate-100 dark:border-slate-700"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-semibold text-slate-900 dark:text-white">10K+ Students</span>
            </div>
          </motion.div>

          {/* Floating badge - Top Rated */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="absolute bottom-8 left-4 bg-[#4F46E5] rounded-xl shadow-xl px-4 py-3"
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
              <span className="text-sm font-semibold text-white">Top Rated</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Side - Clean Form */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex-1 flex items-center justify-center p-8 lg:p-12 bg-white dark:bg-slate-950"
      >
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <Link href="/" className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-[#4F46E5] flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-semibold text-slate-900 dark:text-white">Krakkify</span>
          </Link>

          {/* Form Content */}
          {children}
        </div>
      </motion.div>
    </div>
  );
}
