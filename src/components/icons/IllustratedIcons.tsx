/**
 * Illustrated Icons - Krakkify Style
 *
 * Based on reference screenshot: ChatGPT Image Jun 24, 2026, 05_00_46 PM.png
 *
 * These icons are multi-layered SVG illustrations with:
 * - Gradient backgrounds
 * - Multiple visual elements (not just single icons)
 * - Depth through shadows and layering
 * - Decorative accents
 * - Friendly, premium feel
 */

import React from 'react';

interface IllustratedIconProps {
  className?: string;
}

// ===== LEARNING & COURSES (BLUE) =====

export const StudyIcon: React.FC<IllustratedIconProps> = ({ className = "w-12 h-12" }) => (
  <div className={`${className} relative rounded-xl bg-gradient-to-br from-[#5B7CFF] to-[#4A6AE8] flex items-center justify-center shadow-sm overflow-hidden group-hover:from-[#6B8CFF] group-hover:to-[#5B7CFF] transition-all`}>
    {/* Background decoration */}
    <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-white/10" />
    <div className="absolute bottom-1 left-1 w-3 h-3 rounded-full bg-white/5" />

    {/* Main book icon with pages */}
    <svg className="w-6 h-6 relative z-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Page lines */}
      <path d="M8 7h8M8 11h8M8 15h5" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
    </svg>
  </div>
);

export const TopicsIcon: React.FC<IllustratedIconProps> = ({ className = "w-12 h-12" }) => (
  <div className={`${className} relative rounded-xl bg-gradient-to-br from-[#5B7CFF] to-[#4A6AE8] flex items-center justify-center shadow-sm overflow-hidden group-hover:from-[#6B8CFF] group-hover:to-[#5B7CFF] transition-all`}>
    {/* Layered documents */}
    <svg className="w-6 h-6 relative z-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Back layer */}
      <rect x="5" y="6" width="14" height="16" rx="2" fill="white" opacity="0.2"/>
      {/* Middle layer */}
      <rect x="4" y="4" width="14" height="16" rx="2" fill="white" opacity="0.4"/>
      {/* Front layer */}
      <rect x="3" y="2" width="14" height="16" rx="2" fill="white" stroke="white" strokeWidth="0.5"/>
      {/* Lines on front document */}
      <line x1="6" y1="6" x2="13" y2="6" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
      <line x1="6" y1="9" x2="13" y2="9" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
      <line x1="6" y1="12" x2="10" y2="12" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
    </svg>
  </div>
);

export const ReadingIcon: React.FC<IllustratedIconProps> = ({ className = "w-12 h-12" }) => (
  <div className={`${className} relative rounded-xl bg-gradient-to-br from-[#5B7CFF] to-[#4A6AE8] flex items-center justify-center shadow-sm overflow-hidden group-hover:from-[#6B8CFF] group-hover:to-[#5B7CFF] transition-all`}>
    {/* Sparkle decorations */}
    <div className="absolute top-2 right-2">
      <svg className="w-2 h-2" viewBox="0 0 8 8" fill="white" opacity="0.6">
        <path d="M4 0L4.5 3.5L8 4L4.5 4.5L4 8L3.5 4.5L0 4L3.5 3.5L4 0Z"/>
      </svg>
    </div>

    {/* Open book */}
    <svg className="w-7 h-7 relative z-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" fill="white" fillOpacity="0.9"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" fill="white" fillOpacity="0.7"/>
    </svg>
  </div>
);

// ===== PERFORMANCE & ANALYTICS (PURPLE) =====

export const AnalyticsIcon: React.FC<IllustratedIconProps> = ({ className = "w-12 h-12" }) => (
  <div className={`${className} relative rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] flex items-center justify-center shadow-sm overflow-hidden group-hover:from-[#8B5CF6] group-hover:to-[#7C3AED] transition-all`}>
    {/* Grid background */}
    <div className="absolute inset-0">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="4" height="4" patternUnits="userSpaceOnUse">
            <path d="M 4 0 L 0 0 0 4" fill="none" stroke="white" strokeOpacity="0.05" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>

    {/* Bar chart with trend */}
    <svg className="w-6 h-6 relative z-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="14" width="3" height="6" rx="1" fill="white" opacity="0.6"/>
      <rect x="9" y="10" width="3" height="10" rx="1" fill="white" opacity="0.8"/>
      <rect x="14" y="6" width="3" height="14" rx="1" fill="white"/>
      {/* Trend arrow */}
      <path d="M17 3l3 3-3 3M20 6H8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.9"/>
    </svg>
  </div>
);

export const ProgressIcon: React.FC<IllustratedIconProps> = ({ className = "w-12 h-12" }) => (
  <div className={`${className} relative rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] flex items-center justify-center shadow-sm overflow-hidden group-hover:from-[#8B5CF6] group-hover:to-[#7C3AED] transition-all`}>
    {/* Circular progress */}
    <svg className="w-7 h-7 relative z-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background circle */}
      <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2" opacity="0.2"/>
      {/* Progress arc */}
      <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2" strokeDasharray="56.5" strokeDashoffset="14" strokeLinecap="round" transform="rotate(-90 12 12)"/>
      {/* Center checkmark */}
      <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
);

export const ReportsIcon: React.FC<IllustratedIconProps> = ({ className = "w-12 h-12" }) => (
  <div className={`${className} relative rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] flex items-center justify-center shadow-sm overflow-hidden group-hover:from-[#8B5CF6] group-hover:to-[#7C3AED] transition-all`}>
    {/* Document with chart */}
    <svg className="w-6 h-6 relative z-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="white" fillOpacity="0.9"/>
      <polyline points="14,2 14,8 20,8" fill="white" fillOpacity="0.7"/>
      {/* Mini chart inside */}
      <path d="M8 14l2-2 2 3 3-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4"/>
    </svg>
  </div>
);

// Additional purple-themed icons for Advanced topics
export const AdvancedStudyIcon: React.FC<IllustratedIconProps> = ({ className = "w-12 h-12" }) => (
  <div className={`${className} relative rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] flex items-center justify-center shadow-sm overflow-hidden group-hover:from-[#8B5CF6] group-hover:to-[#7C3AED] transition-all`}>
    {/* Decorative dots */}
    <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-white/20" />
    <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-white/15" />

    {/* Advanced book with bookmark */}
    <svg className="w-6 h-6 relative z-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Bookmark */}
      <path d="M14 2v8l-2-1.5L10 10V2" fill="white" fillOpacity="0.6"/>
    </svg>
  </div>
);

export const AdvancedTopicsIcon: React.FC<IllustratedIconProps> = ({ className = "w-12 h-12" }) => (
  <div className={`${className} relative rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] flex items-center justify-center shadow-sm overflow-hidden group-hover:from-[#8B5CF6] group-hover:to-[#7C3AED] transition-all`}>
    {/* Complex layered structure */}
    <svg className="w-6 h-6 relative z-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="7" height="7" rx="1" fill="white" fillOpacity="0.8"/>
      <rect x="3" y="13" width="7" height="7" rx="1" fill="white" fillOpacity="0.8"/>
      <rect x="13" y="3" width="7" height="7" rx="1" fill="white" fillOpacity="0.8"/>
      <rect x="13" y="13" width="7" height="7" rx="1" fill="white" fillOpacity="0.8"/>
      {/* Connection lines */}
      <line x1="10" y1="6.5" x2="13" y2="6.5" stroke="white" strokeWidth="1" opacity="0.4"/>
      <line x1="6.5" y1="10" x2="6.5" y2="13" stroke="white" strokeWidth="1" opacity="0.4"/>
    </svg>
  </div>
);

export const AdvancedWritingIcon: React.FC<IllustratedIconProps> = ({ className = "w-12 h-12" }) => (
  <div className={`${className} relative rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] flex items-center justify-center shadow-sm overflow-hidden group-hover:from-[#8B5CF6] group-hover:to-[#7C3AED] transition-all`}>
    {/* Paper with pen */}
    <svg className="w-6 h-6 relative z-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="2" width="14" height="20" rx="2" fill="white" fillOpacity="0.9"/>
      <line x1="7" y1="7" x2="15" y2="7" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
      <line x1="7" y1="11" x2="15" y2="11" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
      <line x1="7" y1="15" x2="12" y2="15" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
      {/* Pen overlay */}
      <path d="M16 18l-3-3 1.5-1.5 3 3z" fill="white" opacity="0.7"/>
      <path d="M19.5 14.5l-1.5 1.5-3-3 1.5-1.5z" fill="white"/>
    </svg>
  </div>
);

export const AdvancedCommunicationIcon: React.FC<IllustratedIconProps> = ({ className = "w-12 h-12" }) => (
  <div className={`${className} relative rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] flex items-center justify-center shadow-sm overflow-hidden group-hover:from-[#8B5CF6] group-hover:to-[#7C3AED] transition-all`}>
    {/* Professional communication - multiple bubbles */}
    <svg className="w-6 h-6 relative z-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" fill="white" fillOpacity="0.9"/>
      {/* Inner dots for professional conversation */}
      <circle cx="9" cy="11" r="1" fill="currentColor" opacity="0.4"/>
      <circle cx="12" cy="11" r="1" fill="currentColor" opacity="0.4"/>
      <circle cx="15" cy="11" r="1" fill="currentColor" opacity="0.4"/>
    </svg>
  </div>
);

// ===== PRACTICE & DAILY (ORANGE) =====

export const PracticeIcon: React.FC<IllustratedIconProps> = ({ className = "w-12 h-12" }) => (
  <div className={`${className} relative rounded-xl bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center shadow-sm overflow-hidden group-hover:from-[#FBBF24] group-hover:to-[#F59E0B] transition-all`}>
    {/* Target circles */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-2 border-white/10" />
      <div className="absolute w-7 h-7 rounded-full border-2 border-white/15" />
    </div>

    {/* Pencil */}
    <svg className="w-6 h-6 relative z-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15 5l4 4" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
    </svg>
  </div>
);

export const QuizIcon: React.FC<IllustratedIconProps> = ({ className = "w-12 h-12" }) => (
  <div className={`${className} relative rounded-xl bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center shadow-sm overflow-hidden group-hover:from-[#FBBF24] group-hover:to-[#F59E0B] transition-all`}>
    {/* Clipboard with checkmarks */}
    <svg className="w-6 h-6 relative z-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" fill="white" fillOpacity="0.9"/>
      <path d="M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z" fill="white"/>
      {/* Checkmarks */}
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4"/>
      <path d="M9 17h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3"/>
    </svg>
  </div>
);

export const DPPIcon: React.FC<IllustratedIconProps> = ({ className = "w-12 h-12" }) => (
  <div className={`${className} relative rounded-xl bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center shadow-sm overflow-hidden group-hover:from-[#FBBF24] group-hover:to-[#F59E0B] transition-all`}>
    {/* Calendar with checkmark */}
    <svg className="w-6 h-6 relative z-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="4" width="18" height="18" rx="2" fill="white" fillOpacity="0.9"/>
      <line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" strokeWidth="2" opacity="0.2"/>
      <line x1="7" y1="2" x2="7" y2="6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <line x1="17" y1="2" x2="17" y2="6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      {/* Check in center */}
      <path d="M9 14l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
    </svg>
  </div>
);

// ===== AI TOOLS (PINK/MAGENTA) =====

export const AITutorIcon: React.FC<IllustratedIconProps> = ({ className = "w-12 h-12" }) => (
  <div className={`${className} relative rounded-xl bg-gradient-to-br from-[#EC4899] to-[#D946EF] flex items-center justify-center shadow-sm overflow-hidden group-hover:from-[#F472B6] group-hover:to-[#EC4899] transition-all`}>
    {/* Multiple sparkles */}
    <div className="absolute top-1 right-2">
      <svg className="w-2.5 h-2.5" viewBox="0 0 8 8" fill="white" opacity="0.8">
        <path d="M4 0L4.5 3.5L8 4L4.5 4.5L4 8L3.5 4.5L0 4L3.5 3.5L4 0Z"/>
      </svg>
    </div>
    <div className="absolute bottom-2 left-1">
      <svg className="w-2 h-2" viewBox="0 0 8 8" fill="white" opacity="0.6">
        <path d="M4 0L4.5 3.5L8 4L4.5 4.5L4 8L3.5 4.5L0 4L3.5 3.5L4 0Z"/>
      </svg>
    </div>

    {/* Brain with sparkle */}
    <svg className="w-6 h-6 relative z-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2a10 10 0 0 1 7.38 16.75l-1.63-1.63a7.5 7.5 0 1 0-11.5 0l-1.63 1.63A10 10 0 0 1 12 2z" fill="white" fillOpacity="0.9"/>
      <circle cx="12" cy="12" r="3" fill="white"/>
      {/* Sparkle on brain */}
      <path d="M15 7l.5 1.5L17 9l-1.5.5L15 11l-.5-1.5L13 9l1.5-.5L15 7z" fill="white"/>
    </svg>
  </div>
);

export const ClarifyIcon: React.FC<IllustratedIconProps> = ({ className = "w-12 h-12" }) => (
  <div className={`${className} relative rounded-xl bg-gradient-to-br from-[#EC4899] to-[#D946EF] flex items-center justify-center shadow-sm overflow-hidden group-hover:from-[#F472B6] group-hover:to-[#EC4899] transition-all`}>
    {/* Chat bubble with AI indicator */}
    <svg className="w-6 h-6 relative z-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" fill="white" fillOpacity="0.9"/>
      {/* AI sparkle inside */}
      <path d="M12 7l.8 2.4L15 10l-2.2.6L12 13l-.8-2.4L9 10l2.2-.6L12 7z" fill="currentColor" opacity="0.4"/>
    </svg>
  </div>
);

// ===== ACHIEVEMENTS (GOLD/AMBER) =====

export const LeaderboardIcon: React.FC<IllustratedIconProps> = ({ className = "w-12 h-12" }) => (
  <div className={`${className} relative rounded-xl bg-gradient-to-br from-[#F59E0B] to-[#EA580C] flex items-center justify-center shadow-sm overflow-hidden group-hover:from-[#FBBF24] group-hover:to-[#F59E0B] transition-all`}>
    {/* Stars decoration */}
    <div className="absolute top-0 right-1">
      <svg className="w-3 h-3" viewBox="0 0 8 8" fill="white" opacity="0.5">
        <path d="M4 0l.9 2.8L8 4l-3.1.9L4 8l-.9-3.1L0 4l3.1-.9L4 0z"/>
      </svg>
    </div>

    {/* Trophy */}
    <svg className="w-6 h-6 relative z-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 22h16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 14.66V22h4v-7.34" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18 2H6v7a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V2z" fill="white" stroke="white" strokeWidth="2"/>
    </svg>
  </div>
);

export const AchievementIcon: React.FC<IllustratedIconProps> = ({ className = "w-12 h-12" }) => (
  <div className={`${className} relative rounded-xl bg-gradient-to-br from-[#F59E0B] to-[#EA580C] flex items-center justify-center shadow-sm overflow-hidden group-hover:from-[#FBBF24] group-hover:to-[#F59E0B] transition-all`}>
    {/* Medal/Badge */}
    <svg className="w-6 h-6 relative z-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="14" r="6" fill="white" stroke="white" strokeWidth="2"/>
      <path d="M8.21 13.89L7 14l.77 1.73L7 18l1.73-.77L12 19l3.27-1.77L17 18l-.77-2.27L17 14l-1.21-.11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Ribbon */}
      <path d="M9.9 3L7 14l5-2 5 2-2.9-11z" fill="white" fillOpacity="0.8"/>
      <path d="M15 7l-3-4-3 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
);

// ===== REVISION & REVIEW (GREEN) =====

export const RevisionIcon: React.FC<IllustratedIconProps> = ({ className = "w-12 h-12" }) => (
  <div className={`${className} relative rounded-xl bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center shadow-sm overflow-hidden group-hover:from-[#34D399] group-hover:to-[#10B981] transition-all`}>
    {/* Rotating arrows */}
    <svg className="w-6 h-6 relative z-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 2v6h-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 22v-6h6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21 12a9 9 0 0 1-15 6.7L3 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
);

export const MistakesIcon: React.FC<IllustratedIconProps> = ({ className = "w-12 h-12" }) => (
  <div className={`${className} relative rounded-xl bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center shadow-sm overflow-hidden group-hover:from-[#34D399] group-hover:to-[#10B981] transition-all`}>
    {/* Alert with checkmark */}
    <svg className="w-6 h-6 relative z-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="white" fillOpacity="0.2"/>
      <circle cx="12" cy="12" r="8" fill="white"/>
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
    </svg>
  </div>
);

// ===== TESTS & ASSESSMENTS (TEAL) =====

export const MockTestIcon: React.FC<IllustratedIconProps> = ({ className = "w-12 h-12" }) => (
  <div className={`${className} relative rounded-xl bg-gradient-to-br from-[#14B8A6] to-[#0D9488] flex items-center justify-center shadow-sm overflow-hidden group-hover:from-[#2DD4BF] group-hover:to-[#14B8A6] transition-all`}>
    {/* Timer decoration */}
    <div className="absolute top-1 right-1">
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" opacity="0.4">
        <circle cx="12" cy="13" r="7"/>
        <path d="M12 9v4l2 2"/>
      </svg>
    </div>

    {/* Document with timer */}
    <svg className="w-6 h-6 relative z-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="white" fillOpacity="0.9"/>
      <polyline points="14,2 14,8 20,8" fill="white" fillOpacity="0.7"/>
      {/* Checkboxes */}
      <rect x="7" y="12" width="3" height="3" rx="0.5" fill="currentColor" opacity="0.3"/>
      <rect x="7" y="17" width="3" height="3" rx="0.5" fill="currentColor" opacity="0.3"/>
      <line x1="12" y1="13.5" x2="16" y2="13.5" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
      <line x1="12" y1="18.5" x2="16" y2="18.5" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
    </svg>
  </div>
);

export const ExamIcon: React.FC<IllustratedIconProps> = ({ className = "w-12 h-12" }) => (
  <div className={`${className} relative rounded-xl bg-gradient-to-br from-[#14B8A6] to-[#0D9488] flex items-center justify-center shadow-sm overflow-hidden group-hover:from-[#2DD4BF] group-hover:to-[#14B8A6] transition-all`}>
    {/* Graduation cap */}
    <svg className="w-7 h-7 relative z-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 12v5c3 3 9 3 12 0v-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 10l10 5 10-5" fill="white" fillOpacity="0.3"/>
    </svg>
  </div>
);

// Teal-themed icons for IELTS/TOEFL
export const IELTSReadingIcon: React.FC<IllustratedIconProps> = ({ className = "w-14 h-14" }) => (
  <div className={`${className} relative rounded-xl bg-gradient-to-br from-[#14B8A6] to-[#0D9488] flex items-center justify-center shadow-md overflow-hidden group-hover:from-[#2DD4BF] group-hover:to-[#14B8A6] transition-all`}>
    {/* Multiple pages/documents */}
    <svg className="w-7 h-7 relative z-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="4" width="14" height="16" rx="2" fill="white" fillOpacity="0.9"/>
      <line x1="8" y1="8" x2="16" y2="8" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
      <line x1="8" y1="11" x2="16" y2="11" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
      <line x1="8" y1="14" x2="13" y2="14" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
      {/* Magnifying glass overlay */}
      <circle cx="15" cy="15" r="3" stroke="white" strokeWidth="2" fill="none"/>
      <path d="M17 17l2 2" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  </div>
);

export const IELTSWritingIcon: React.FC<IllustratedIconProps> = ({ className = "w-14 h-14" }) => (
  <div className={`${className} relative rounded-xl bg-gradient-to-br from-[#14B8A6] to-[#0D9488] flex items-center justify-center shadow-md overflow-hidden group-hover:from-[#2DD4BF] group-hover:to-[#14B8A6] transition-all`}>
    {/* Document with active writing */}
    <svg className="w-7 h-7 relative z-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="2" width="14" height="20" rx="2" fill="white" fillOpacity="0.9"/>
      <line x1="7" y1="6" x2="15" y2="6" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
      <line x1="7" y1="10" x2="15" y2="10" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
      <line x1="7" y1="14" x2="12" y2="14" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
      {/* Pen writing */}
      <path d="M15 16l-2 2-1-1 2-2 1 1z" fill="white"/>
      <path d="M19 12l-3 3-1-1 3-3c.5-.5 1-.5 1 0v1z" fill="white"/>
    </svg>
  </div>
);

export const IELTSListeningIcon: React.FC<IllustratedIconProps> = ({ className = "w-14 h-14" }) => (
  <div className={`${className} relative rounded-xl bg-gradient-to-br from-[#14B8A6] to-[#0D9488] flex items-center justify-center shadow-md overflow-hidden group-hover:from-[#2DD4BF] group-hover:to-[#14B8A6] transition-all`}>
    {/* Sound waves */}
    <div className="absolute left-2">
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
        <path d="M3 12h2" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.3"/>
        <path d="M3 9h2M3 15h2" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.2"/>
      </svg>
    </div>

    {/* Headphones */}
    <svg className="w-7 h-7 relative z-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3v5zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3v5z" fill="white" fillOpacity="0.9"/>
    </svg>
  </div>
);

export const IELTSSpeakingIcon: React.FC<IllustratedIconProps> = ({ className = "w-14 h-14" }) => (
  <div className={`${className} relative rounded-xl bg-gradient-to-br from-[#14B8A6] to-[#0D9488] flex items-center justify-center shadow-md overflow-hidden group-hover:from-[#2DD4BF] group-hover:to-[#14B8A6] transition-all`}>
    {/* Sound waves radiating */}
    <div className="absolute right-1">
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <path d="M18 8c0 0 2 2 2 4s-2 4-2 4" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
        <path d="M21 5c0 0 3 3 3 7s-3 7-3 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.2"/>
      </svg>
    </div>

    {/* Microphone */}
    <svg className="w-6 h-6 relative z-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="9" y="2" width="6" height="11" rx="3" fill="white" fillOpacity="0.9"/>
      <path d="M5 10v2a7 7 0 0 0 14 0v-2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="12" y1="19" x2="12" y2="23" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <line x1="8" y1="23" x2="16" y2="23" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  </div>
);

// ===== REAL-WORLD SKILLS (INDIGO) =====

export const CommunicationIcon: React.FC<IllustratedIconProps> = ({ className = "w-12 h-12" }) => (
  <div className={`${className} relative rounded-xl bg-gradient-to-br from-[#6366F1] to-[#4F46E5] flex items-center justify-center shadow-sm overflow-hidden group-hover:from-[#818CF8] group-hover:to-[#6366F1] transition-all`}>
    {/* Multiple chat bubbles */}
    <svg className="w-6 h-6 relative z-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" fill="white" fillOpacity="0.9"/>
      <path d="M14 8H8M12 12H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
      {/* Second bubble */}
      <path d="M18 9a2 2 0 0 0-2-2h-2" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
    </svg>
  </div>
);

export const PresentationIcon: React.FC<IllustratedIconProps> = ({ className = "w-12 h-12" }) => (
  <div className={`${className} relative rounded-xl bg-gradient-to-br from-[#6366F1] to-[#4F46E5] flex items-center justify-center shadow-sm overflow-hidden group-hover:from-[#818CF8] group-hover:to-[#6366F1] transition-all`}>
    {/* Presentation screen */}
    <svg className="w-6 h-6 relative z-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 3h18v12H3z" fill="white" fillOpacity="0.9"/>
      <path d="M8 21l4-6 4 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Chart on screen */}
      <path d="M7 7v5M11 7v5M15 9v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3"/>
    </svg>
  </div>
);

// ===== SPECIAL ICONS =====

export const StreakIcon: React.FC<IllustratedIconProps> = ({ className = "w-10 h-10" }) => (
  <div className={`${className} relative rounded-lg bg-gradient-to-br from-[#F59E0B] to-[#EA580C] flex items-center justify-center shadow-sm overflow-hidden group-hover:from-[#FBBF24] group-hover:to-[#F59E0B] transition-all`}>
    {/* Flame */}
    <svg className="w-5 h-5 relative z-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.5 14.5A5.5 5.5 0 0 0 14 20c0-5-4-9-4-9s1.5 2 0 4.5z" fill="white" fillOpacity="0.7"/>
      <path d="M12 2s3 4 3 7a3 3 0 1 1-6 0c0-3 3-7 3-7z" fill="white"/>
    </svg>
  </div>
);

export const XPIcon: React.FC<IllustratedIconProps> = ({ className = "w-10 h-10" }) => (
  <div className={`${className} relative rounded-lg bg-gradient-to-br from-[#F59E0B] to-[#EA580C] flex items-center justify-center shadow-sm overflow-hidden group-hover:from-[#FBBF24] group-hover:to-[#F59E0B] transition-all`}>
    {/* Lightning bolt */}
    <svg className="w-5 h-5 relative z-10" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z"/>
    </svg>
  </div>
);
