/**
 * 3D Illustrated Icons - Krakkify Premium Style
 *
 * True 3D illustrated SVG icons with:
 * - Isometric/perspective views
 * - Multiple colors and gradients within icons
 * - Shadows and highlights for depth
 * - Complex detailed illustrations
 * - Modern premium feel (Duolingo/Quizlet style)
 */

import React from 'react';

interface Icon3DProps {
  className?: string;
}

// ===== LEARNING & COURSES (BLUE THEME) =====

export const Book3DIcon: React.FC<Icon3DProps> = ({ className = "w-12 h-12" }) => (
  <div className={`${className} flex items-center justify-center`}>
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        {/* Gradients for 3D effect */}
        <linearGradient id="bookCover" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5B7CFF" />
          <stop offset="100%" stopColor="#4A6AE8" />
        </linearGradient>
        <linearGradient id="bookSpine" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3A4DB8" />
          <stop offset="100%" stopColor="#2A3D98" />
        </linearGradient>
        <linearGradient id="bookPages" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F0F4FF" />
          <stop offset="100%" stopColor="#E0E8FF" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx="32" cy="54" rx="20" ry="3" fill="#1E293B" opacity="0.15"/>

      {/* Book spine (left side) */}
      <path d="M 16 18 L 16 46 L 20 48 L 20 20 Z" fill="url(#bookSpine)"/>

      {/* Book pages (right side) */}
      <path d="M 20 20 L 20 48 L 48 48 L 48 20 Z" fill="url(#bookPages)"/>
      <path d="M 22 48 L 46 48 L 46 49 L 22 49 Z" fill="#D1D5DB"/>
      <path d="M 23 49 L 45 49 L 45 49.5 L 23 49.5 Z" fill="#9CA3AF"/>

      {/* Book cover (front) */}
      <path d="M 20 16 L 20 44 L 48 44 L 48 16 Z" fill="url(#bookCover)"/>

      {/* Bookmark */}
      <path d="M 36 16 L 36 32 L 38 30 L 40 32 L 40 16 Z" fill="#FBBF24" opacity="0.9"/>

      {/* Cover details - page lines */}
      <line x1="26" y1="24" x2="42" y2="24" stroke="white" strokeWidth="1" opacity="0.3"/>
      <line x1="26" y1="28" x2="42" y2="28" stroke="white" strokeWidth="1" opacity="0.3"/>
      <line x1="26" y1="32" x2="38" y2="32" stroke="white" strokeWidth="1" opacity="0.3"/>

      {/* Highlight */}
      <path d="M 22 18 L 46 18 L 46 20 L 22 20 Z" fill="white" opacity="0.2"/>

      {/* Shadow on spine */}
      <path d="M 20 20 L 20 48 L 21 48 L 21 20 Z" fill="black" opacity="0.1"/>
    </svg>
  </div>
);

export const Documents3DIcon: React.FC<Icon3DProps> = ({ className = "w-12 h-12" }) => (
  <div className={`${className} flex items-center justify-center`}>
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="doc1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6B8CFF" />
          <stop offset="100%" stopColor="#5B7CFF" />
        </linearGradient>
        <linearGradient id="doc2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5B7CFF" />
          <stop offset="100%" stopColor="#4A6AE8" />
        </linearGradient>
        <linearGradient id="doc3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4A6AE8" />
          <stop offset="100%" stopColor="#3A4DB8" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx="32" cy="54" rx="22" ry="3" fill="#1E293B" opacity="0.15"/>

      {/* Document 3 (back) */}
      <rect x="22" y="16" width="24" height="32" rx="2" fill="url(#doc3)"/>
      <line x1="26" y1="22" x2="38" y2="22" stroke="white" strokeWidth="0.8" opacity="0.2"/>
      <line x1="26" y1="26" x2="38" y2="26" stroke="white" strokeWidth="0.8" opacity="0.2"/>

      {/* Document 2 (middle) */}
      <rect x="20" y="14" width="24" height="32" rx="2" fill="url(#doc2)"/>
      <line x1="24" y1="20" x2="38" y2="20" stroke="white" strokeWidth="1" opacity="0.3"/>
      <line x1="24" y1="24" x2="38" y2="24" stroke="white" strokeWidth="1" opacity="0.3"/>
      <line x1="24" y1="28" x2="34" y2="28" stroke="white" strokeWidth="1" opacity="0.3"/>

      {/* Document 1 (front) */}
      <rect x="18" y="12" width="24" height="32" rx="2" fill="url(#doc1)"/>
      <line x1="22" y1="18" x2="38" y2="18" stroke="white" strokeWidth="1" opacity="0.4"/>
      <line x1="22" y1="22" x2="38" y2="22" stroke="white" strokeWidth="1" opacity="0.4"/>
      <line x1="22" y1="26" x2="34" y2="26" stroke="white" strokeWidth="1" opacity="0.4"/>
      <line x1="22" y1="30" x2="36" y2="30" stroke="white" strokeWidth="1" opacity="0.4"/>

      {/* Checkmark badge */}
      <circle cx="38" cy="38" r="6" fill="#10B981"/>
      <path d="M 36 38 L 37.5 39.5 L 40 36.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>

      {/* Highlights */}
      <rect x="18" y="12" width="24" height="3" rx="2" fill="white" opacity="0.15"/>
    </svg>
  </div>
);

export const Notebook3DIcon: React.FC<Icon3DProps> = ({ className = "w-12 h-12" }) => (
  <div className={`${className} flex items-center justify-center`}>
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="notebookCover" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5B7CFF" />
          <stop offset="100%" stopColor="#4A6AE8" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx="32" cy="54" rx="20" ry="3" fill="#1E293B" opacity="0.15"/>

      {/* Notebook */}
      <rect x="18" y="14" width="28" height="36" rx="2" fill="url(#notebookCover)"/>

      {/* Spiral binding */}
      <rect x="18" y="14" width="4" height="36" fill="#3A4DB8"/>
      <circle cx="20" cy="18" r="1.5" fill="#CBD5E1"/>
      <circle cx="20" cy="24" r="1.5" fill="#CBD5E1"/>
      <circle cx="20" cy="30" r="1.5" fill="#CBD5E1"/>
      <circle cx="20" cy="36" r="1.5" fill="#CBD5E1"/>
      <circle cx="20" cy="42" r="1.5" fill="#CBD5E1"/>
      <circle cx="20" cy="48" r="1.5" fill="#CBD5E1"/>

      {/* Pages */}
      <line x1="26" y1="22" x2="42" y2="22" stroke="white" strokeWidth="1" opacity="0.3"/>
      <line x1="26" y1="26" x2="42" y2="26" stroke="white" strokeWidth="1" opacity="0.3"/>
      <line x1="26" y1="30" x2="42" y2="30" stroke="white" strokeWidth="1" opacity="0.3"/>
      <line x1="26" y1="34" x2="38" y2="34" stroke="white" strokeWidth="1" opacity="0.3"/>

      {/* Pencil */}
      <rect x="38" y="38" width="4" height="16" fill="#FBBF24" transform="rotate(-45 40 46)"/>
      <path d="M 42 42 L 44 44 L 43 45 L 41 43 Z" fill="#EA580C"/>
      <path d="M 41 43 L 40 44 L 39 43 L 40 42 Z" fill="#1E293B"/>

      {/* Highlight */}
      <rect x="18" y="14" width="28" height="4" rx="2" fill="white" opacity="0.15"/>
    </svg>
  </div>
);

// ===== PERFORMANCE & ANALYTICS (PURPLE THEME) =====

export const Chart3DIcon: React.FC<Icon3DProps> = ({ className = "w-12 h-12" }) => (
  <div className={`${className} flex items-center justify-center`}>
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="bar1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
        <linearGradient id="bar2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
        <linearGradient id="bar3" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#6D28D9" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx="32" cy="54" rx="24" ry="3" fill="#1E293B" opacity="0.15"/>

      {/* Base platform */}
      <path d="M 12 48 L 8 50 L 8 52 L 56 52 L 56 50 L 52 48 Z" fill="#E2E8F0"/>
      <rect x="8" y="48" width="48" height="2" fill="#CBD5E1"/>

      {/* Bar 1 (shortest) - 3D effect */}
      <rect x="14" y="36" width="8" height="12" fill="url(#bar1)"/>
      <path d="M 14 36 L 12 34 L 20 34 L 22 36 Z" fill="#C4B5FD"/>
      <path d="M 22 36 L 22 48 L 20 50 L 20 34 Z" fill="#9333EA"/>

      {/* Bar 2 (medium) - 3D effect */}
      <rect x="28" y="28" width="8" height="20" fill="url(#bar2)"/>
      <path d="M 28 28 L 26 26 L 34 26 L 36 28 Z" fill="#A78BFA"/>
      <path d="M 36 28 L 36 48 L 34 50 L 34 26 Z" fill="#7C3AED"/>

      {/* Bar 3 (tallest) - 3D effect */}
      <rect x="42" y="18" width="8" height="30" fill="url(#bar3)"/>
      <path d="M 42 18 L 40 16 L 48 16 L 50 18 Z" fill="#8B5CF6"/>
      <path d="M 50 18 L 50 48 L 48 50 L 48 16 Z" fill="#6D28D9"/>

      {/* Trend arrow */}
      <path d="M 10 26 L 20 20 L 28 22 L 38 14" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M 38 14 L 34 14 L 38 10 L 42 14 L 38 14 Z" fill="#10B981"/>

      {/* Sparkles */}
      <circle cx="48" cy="12" r="1.5" fill="#FBBF24" opacity="0.8"/>
      <circle cx="44" cy="8" r="1" fill="#FBBF24" opacity="0.6"/>
    </svg>
  </div>
);

export const Report3DIcon: React.FC<Icon3DProps> = ({ className = "w-12 h-12" }) => (
  <div className={`${className} flex items-center justify-center`}>
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="reportBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx="32" cy="54" rx="20" ry="3" fill="#1E293B" opacity="0.15"/>

      {/* Clipboard */}
      <rect x="16" y="12" width="32" height="40" rx="3" fill="url(#reportBg)"/>

      {/* Clip top */}
      <rect x="26" y="10" width="12" height="6" rx="1" fill="#6D28D9"/>
      <rect x="28" y="8" width="8" height="4" rx="1" fill="#CBD5E1"/>

      {/* Paper with chart */}
      <rect x="20" y="18" width="24" height="30" rx="2" fill="white"/>

      {/* Mini chart */}
      <path d="M 24 36 L 28 32 L 32 34 L 36 28 L 40 30" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <circle cx="24" cy="36" r="2" fill="#8B5CF6"/>
      <circle cx="28" cy="32" r="2" fill="#8B5CF6"/>
      <circle cx="32" cy="34" r="2" fill="#8B5CF6"/>
      <circle cx="36" cy="28" r="2" fill="#8B5CF6"/>
      <circle cx="40" cy="30" r="2" fill="#8B5CF6"/>

      {/* Text lines */}
      <line x1="24" y1="24" x2="40" y2="24" stroke="#94A3B8" strokeWidth="1"/>
      <line x1="24" y1="42" x2="40" y2="42" stroke="#94A3B8" strokeWidth="1"/>
      <line x1="24" y1="45" x2="36" y2="45" stroke="#94A3B8" strokeWidth="1"/>

      {/* Checkmark badge */}
      <circle cx="42" cy="44" r="6" fill="#10B981"/>
      <path d="M 40 44 L 41.5 45.5 L 44 42.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>

      {/* Highlight */}
      <rect x="16" y="12" width="32" height="4" rx="3" fill="white" opacity="0.15"/>
    </svg>
  </div>
);

export const Trophy3DIcon: React.FC<Icon3DProps> = ({ className = "w-12 h-12" }) => (
  <div className={`${className} flex items-center justify-center`}>
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="trophyGold" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
        <radialGradient id="trophyShine">
          <stop offset="0%" stopColor="#FEF3C7" />
          <stop offset="100%" stopColor="#F59E0B" />
        </radialGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx="32" cy="54" rx="18" ry="3" fill="#1E293B" opacity="0.2"/>

      {/* Base */}
      <rect x="22" y="48" width="20" height="4" rx="1" fill="#D97706"/>
      <rect x="20" y="52" width="24" height="2" rx="1" fill="#B45309"/>

      {/* Stem */}
      <rect x="28" y="40" width="8" height="8" fill="#D97706"/>
      <path d="M 28 40 L 26 38 L 38 38 L 36 40 Z" fill="#FBBF24"/>
      <path d="M 36 40 L 36 48 L 38 48 L 38 38 Z" fill="#B45309"/>

      {/* Cup */}
      <path d="M 20 20 L 18 38 L 46 38 L 44 20 Z" fill="url(#trophyGold)"/>
      <ellipse cx="32" cy="20" rx="12" ry="3" fill="#FCD34D"/>

      {/* Handles */}
      <path d="M 18 24 L 14 24 Q 12 28 14 32 L 18 32" stroke="#D97706" strokeWidth="2" fill="none"/>
      <path d="M 46 24 L 50 24 Q 52 28 50 32 L 46 32" stroke="#D97706" strokeWidth="2" fill="none"/>

      {/* Shine effect */}
      <ellipse cx="28" cy="26" rx="4" ry="8" fill="white" opacity="0.3"/>

      {/* Star on cup */}
      <path d="M 32 28 L 33 31 L 36 31 L 34 33 L 35 36 L 32 34 L 29 36 L 30 33 L 28 31 L 31 31 Z" fill="#FEF3C7"/>

      {/* Rim highlight */}
      <ellipse cx="32" cy="20" rx="12" ry="2" fill="white" opacity="0.2"/>
    </svg>
  </div>
);

// ===== PRACTICE & DAILY (ORANGE THEME) =====

export const Pencil3DIcon: React.FC<Icon3DProps> = ({ className = "w-12 h-12" }) => (
  <div className={`${className} flex items-center justify-center`}>
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="pencilBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx="32" cy="52" rx="20" ry="3" fill="#1E293B" opacity="0.15"/>

      {/* Paper */}
      <rect x="12" y="16" width="28" height="36" rx="2" fill="white" stroke="#E5E7EB" strokeWidth="1"/>
      <line x1="16" y1="24" x2="36" y2="24" stroke="#CBD5E1" strokeWidth="1"/>
      <line x1="16" y1="28" x2="36" y2="28" stroke="#CBD5E1" strokeWidth="1"/>
      <line x1="16" y1="32" x2="32" y2="32" stroke="#CBD5E1" strokeWidth="1"/>
      <line x1="16" y1="36" x2="34" y2="36" stroke="#CBD5E1" strokeWidth="1"/>

      {/* Pencil body */}
      <rect x="32" y="20" width="8" height="32" rx="1" fill="url(#pencilBody)" transform="rotate(-30 36 36)"/>

      {/* Pencil stripes */}
      <rect x="32" y="24" width="8" height="2" fill="#EA580C" opacity="0.3" transform="rotate(-30 36 36)"/>
      <rect x="32" y="30" width="8" height="2" fill="#EA580C" opacity="0.3" transform="rotate(-30 36 36)"/>

      {/* Eraser */}
      <rect x="32" y="20" width="8" height="4" fill="#EC4899" transform="rotate(-30 36 36)"/>
      <rect x="32" y="20" width="8" height="1" fill="#F472B6" transform="rotate(-30 36 36)"/>

      {/* Metal band */}
      <rect x="32" y="24" width="8" height="1.5" fill="#94A3B8" transform="rotate(-30 36 36)"/>

      {/* Pencil tip */}
      <path d="M 48 46 L 52 50 L 50 52 L 46 48 Z" fill="#78350F" transform="rotate(-30 49 49)"/>
      <path d="M 50 52 L 49 53 L 47 51 L 48 50 Z" fill="#1E293B"/>

      {/* Wood texture on tip */}
      <path d="M 48 46 L 50 48 L 48.5 49.5 L 46.5 47.5 Z" fill="#D97706" transform="rotate(-30 49 49)"/>

      {/* Highlight */}
      <rect x="33" y="26" width="2" height="20" fill="white" opacity="0.3" transform="rotate(-30 36 36)"/>

      {/* Writing mark */}
      <path d="M 26 40 Q 28 42 30 40" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    </svg>
  </div>
);

export const Target3DIcon: React.FC<Icon3DProps> = ({ className = "w-12 h-12" }) => (
  <div className={`${className} flex items-center justify-center`}>
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <radialGradient id="targetGlow">
          <stop offset="0%" stopColor="#FCD34D" opacity="0.3"/>
          <stop offset="100%" stopColor="#F59E0B" opacity="0"/>
        </radialGradient>
      </defs>

      {/* Glow effect */}
      <circle cx="32" cy="32" r="28" fill="url(#targetGlow)"/>

      {/* Shadow */}
      <ellipse cx="32" cy="54" rx="20" ry="3" fill="#1E293B" opacity="0.15"/>

      {/* Outer ring - 3D effect */}
      <circle cx="32" cy="32" r="20" fill="#DC2626"/>
      <circle cx="32" cy="32" r="20" fill="url(#targetGlow)"/>
      <circle cx="32" cy="30" r="20" fill="#EF4444"/>

      {/* Middle ring - 3D effect */}
      <circle cx="32" cy="32" r="14" fill="#F59E0B"/>
      <circle cx="32" cy="30" r="14" fill="#FBBF24"/>

      {/* Inner ring - 3D effect */}
      <circle cx="32" cy="32" r="8" fill="#10B981"/>
      <circle cx="32" cy="30" r="8" fill="#34D399"/>

      {/* Center bullseye - 3D effect */}
      <circle cx="32" cy="32" r="4" fill="#FCD34D"/>
      <circle cx="32" cy="30" r="4" fill="#FEF3C7"/>

      {/* Arrow in bullseye */}
      <rect x="30" y="12" width="4" height="20" fill="#DC2626" transform="rotate(15 32 22)"/>
      <path d="M 32 12 L 28 18 L 36 18 Z" fill="#7C2D12" transform="rotate(15 32 15)"/>
      <rect x="30" y="28" width="4" height="6" fill="#FBBF24" transform="rotate(15 32 31)"/>

      {/* Highlight on arrow */}
      <rect x="31" y="14" width="1" height="16" fill="white" opacity="0.4" transform="rotate(15 32 22)"/>

      {/* Shine effect */}
      <circle cx="28" cy="26" r="3" fill="white" opacity="0.3"/>
    </svg>
  </div>
);

export const Calendar3DIcon: React.FC<Icon3DProps> = ({ className = "w-12 h-12" }) => (
  <div className={`${className} flex items-center justify-center`}>
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="calendarBg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx="32" cy="54" rx="22" ry="3" fill="#1E293B" opacity="0.15"/>

      {/* Calendar body - 3D */}
      <rect x="14" y="20" width="36" height="30" rx="3" fill="url(#calendarBg)"/>
      <path d="M 14 20 L 12 18 L 48 18 L 50 20 Z" fill="#FCD34D"/>
      <path d="M 50 20 L 50 50 L 48 52 L 48 18 Z" fill="#D97706"/>

      {/* Binding rings */}
      <rect x="20" y="16" width="3" height="8" rx="1.5" fill="#94A3B8"/>
      <rect x="41" y="16" width="3" height="8" rx="1.5" fill="#94A3B8"/>

      {/* Header */}
      <rect x="14" y="20" width="36" height="6" fill="#D97706"/>

      {/* Days grid */}
      <rect x="18" y="28" width="28" height="18" fill="white" rx="1"/>

      {/* Grid lines */}
      <line x1="18" y1="33" x2="46" y2="33" stroke="#E5E7EB" strokeWidth="1"/>
      <line x1="18" y1="38" x2="46" y2="38" stroke="#E5E7EB" strokeWidth="1"/>
      <line x1="18" y1="43" x2="46" y2="43" stroke="#E5E7EB" strokeWidth="1"/>
      <line x1="25" y1="28" x2="25" y2="46" stroke="#E5E7EB" strokeWidth="1"/>
      <line x1="32" y1="28" x2="32" y2="46" stroke="#E5E7EB" strokeWidth="1"/>
      <line x1="39" y1="28" x2="39" y2="46" stroke="#E5E7EB" strokeWidth="1"/>

      {/* Selected day */}
      <circle cx="28.5" cy="40.5" r="3" fill="#10B981"/>
      <text x="28.5" y="42" fontSize="6" fill="white" textAnchor="middle" fontWeight="bold">15</text>

      {/* Checkmark badge */}
      <circle cx="44" cy="44" r="5" fill="#10B981"/>
      <path d="M 42 44 L 43.5 45.5 L 46 42.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>

      {/* Highlight */}
      <rect x="14" y="20" width="36" height="3" fill="white" opacity="0.2"/>
    </svg>
  </div>
);

// ===== AI TOOLS (PINK/MAGENTA THEME) =====

export const Brain3DIcon: React.FC<Icon3DProps> = ({ className = "w-12 h-12" }) => (
  <div className={`${className} flex items-center justify-center`}>
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="brainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F472B6" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
        <radialGradient id="sparkleGlow">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#F59E0B" />
        </radialGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx="32" cy="54" rx="20" ry="3" fill="#1E293B" opacity="0.15"/>

      {/* Brain left hemisphere */}
      <path d="M 24 18 Q 16 18 14 26 Q 13 32 16 38 Q 18 44 24 46 L 32 46 L 32 18 Z" fill="url(#brainGrad)"/>

      {/* Brain right hemisphere */}
      <path d="M 40 18 Q 48 18 50 26 Q 51 32 48 38 Q 46 44 40 46 L 32 46 L 32 18 Z" fill="#EC4899"/>

      {/* Brain details - left */}
      <path d="M 20 22 Q 18 24 18 28" stroke="#D946EF" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M 18 32 Q 18 36 20 38" stroke="#D946EF" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M 24 24 Q 22 28 22 32" stroke="#D946EF" strokeWidth="1.5" fill="none" strokeLinecap="round"/>

      {/* Brain details - right */}
      <path d="M 44 22 Q 46 24 46 28" stroke="#BE185D" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M 46 32 Q 46 36 44 38" stroke="#BE185D" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M 40 24 Q 42 28 42 32" stroke="#BE185D" strokeWidth="1.5" fill="none" strokeLinecap="round"/>

      {/* Center split */}
      <line x1="32" y1="18" x2="32" y2="46" stroke="#C026D3" strokeWidth="1" opacity="0.5"/>

      {/* Sparkles */}
      <circle cx="22" cy="20" r="2" fill="url(#sparkleGlow)"/>
      <circle cx="42" cy="20" r="2" fill="url(#sparkleGlow)"/>
      <circle cx="32" cy="14" r="2.5" fill="url(#sparkleGlow)"/>

      {/* Star sparkles */}
      <path d="M 22 20 L 22.5 21.5 L 24 22 L 22.5 22.5 L 22 24 L 21.5 22.5 L 20 22 L 21.5 21.5 Z" fill="#FBBF24"/>
      <path d="M 42 20 L 42.5 21.5 L 44 22 L 42.5 22.5 L 42 24 L 41.5 22.5 L 40 22 L 41.5 21.5 Z" fill="#FBBF24"/>

      {/* Neural connections */}
      <circle cx="24" cy="32" r="1.5" fill="#FCD34D"/>
      <circle cx="32" cy="28" r="1.5" fill="#FCD34D"/>
      <circle cx="40" cy="32" r="1.5" fill="#FCD34D"/>
      <line x1="24" y1="32" x2="32" y2="28" stroke="#FCD34D" strokeWidth="1" opacity="0.6"/>
      <line x1="32" y1="28" x2="40" y2="32" stroke="#FCD34D" strokeWidth="1" opacity="0.6"/>

      {/* Highlight */}
      <ellipse cx="28" cy="24" rx="4" ry="6" fill="white" opacity="0.2"/>
    </svg>
  </div>
);

export const Lightbulb3DIcon: React.FC<Icon3DProps> = ({ className = "w-12 h-12" }) => (
  <div className={`${className} flex items-center justify-center`}>
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <radialGradient id="bulbGlow">
          <stop offset="0%" stopColor="#FEF3C7" />
          <stop offset="50%" stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#F59E0B" />
        </radialGradient>
        <radialGradient id="lightGlow">
          <stop offset="0%" stopColor="#FEF3C7" opacity="0.6"/>
          <stop offset="100%" stopColor="#F59E0B" opacity="0"/>
        </radialGradient>
      </defs>

      {/* Glow effect */}
      <circle cx="32" cy="26" r="22" fill="url(#lightGlow)"/>

      {/* Shadow */}
      <ellipse cx="32" cy="54" rx="12" ry="2" fill="#1E293B" opacity="0.15"/>

      {/* Light rays */}
      <line x1="32" y1="8" x2="32" y2="4" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
      <line x1="46" y1="14" x2="50" y2="10" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
      <line x1="50" y1="26" x2="54" y2="26" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
      <line x1="18" y1="14" x2="14" y2="10" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
      <line x1="14" y1="26" x2="10" y2="26" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>

      {/* Bulb glass */}
      <path d="M 32 14 Q 22 14 20 24 Q 20 32 24 36 L 24 40 L 40 40 L 40 36 Q 44 32 44 24 Q 42 14 32 14 Z" fill="url(#bulbGlow)"/>

      {/* Filament */}
      <path d="M 30 22 Q 30 26 32 28 Q 34 26 34 22" stroke="#DC2626" strokeWidth="2" fill="none"/>
      <line x1="32" y1="28" x2="32" y2="36" stroke="#DC2626" strokeWidth="1.5"/>

      {/* Socket */}
      <rect x="26" y="40" width="12" height="3" fill="#94A3B8"/>
      <rect x="26" y="43" width="12" height="2" fill="#64748B"/>
      <rect x="26" y="45" width="12" height="3" fill="#94A3B8"/>
      <rect x="28" y="48" width="8" height="4" rx="1" fill="#475569"/>

      {/* Shine effect on glass */}
      <ellipse cx="28" cy="20" rx="4" ry="6" fill="white" opacity="0.4"/>
      <ellipse cx="36" cy="24" rx="2" ry="3" fill="white" opacity="0.3"/>

      {/* AI sparkle */}
      <circle cx="38" cy="18" r="2" fill="#EC4899"/>
      <path d="M 38 18 L 38.5 19.5 L 40 20 L 38.5 20.5 L 38 22 L 37.5 20.5 L 36 20 L 37.5 19.5 Z" fill="#F472B6"/>
    </svg>
  </div>
);

// ===== TESTS & ASSESSMENTS (TEAL THEME) =====

export const Exam3DIcon: React.FC<Icon3DProps> = ({ className = "w-12 h-12" }) => (
  <div className={`${className} flex items-center justify-center`}>
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="examPaper" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5EEAD4" />
          <stop offset="100%" stopColor="#14B8A6" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx="32" cy="54" rx="22" ry="3" fill="#1E293B" opacity="0.15"/>

      {/* Paper stack - 3D effect */}
      <rect x="18" y="16" width="28" height="36" rx="2" fill="#0D9488"/>
      <rect x="17" y="14" width="28" height="36" rx="2" fill="#14B8A6"/>
      <rect x="16" y="12" width="28" height="36" rx="2" fill="url(#examPaper)"/>

      {/* Header line */}
      <line x1="20" y1="18" x2="40" y2="18" stroke="#0D9488" strokeWidth="2"/>

      {/* Questions with checkboxes */}
      <rect x="20" y="24" width="4" height="4" rx="1" stroke="#0D9488" strokeWidth="1" fill="white"/>
      <path d="M 21 26 L 22.5 27.5 L 23.5 25.5" stroke="#10B981" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="26" y1="26" x2="38" y2="26" stroke="#0D9488" strokeWidth="1" opacity="0.5"/>

      <rect x="20" y="30" width="4" height="4" rx="1" stroke="#0D9488" strokeWidth="1" fill="white"/>
      <path d="M 21 32 L 22.5 33.5 L 23.5 31.5" stroke="#10B981" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="26" y1="32" x2="36" y2="32" stroke="#0D9488" strokeWidth="1" opacity="0.5"/>

      <rect x="20" y="36" width="4" height="4" rx="1" stroke="#0D9488" strokeWidth="1" fill="white"/>
      <line x1="26" y1="38" x2="38" y2="38" stroke="#0D9488" strokeWidth="1" opacity="0.5"/>

      <rect x="20" y="42" width="4" height="4" rx="1" stroke="#0D9488" strokeWidth="1" fill="white"/>
      <line x1="26" y1="44" x2="34" y2="44" stroke="#0D9488" strokeWidth="1" opacity="0.5"/>

      {/* Timer badge */}
      <circle cx="40" cy="40" r="6" fill="#F59E0B"/>
      <circle cx="40" cy="40" r="4" stroke="white" strokeWidth="1.5" fill="none"/>
      <line x1="40" y1="38" x2="40" y2="40" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="40" y1="40" x2="41.5" y2="41.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>

      {/* Highlight */}
      <rect x="16" y="12" width="28" height="3" rx="2" fill="white" opacity="0.2"/>
    </svg>
  </div>
);

export const Headphones3DIcon: React.FC<Icon3DProps> = ({ className = "w-12 h-12" }) => (
  <div className={`${className} flex items-center justify-center`}>
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="headphoneBand" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2DD4BF" />
          <stop offset="100%" stopColor="#14B8A6" />
        </linearGradient>
        <linearGradient id="earcup" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#14B8A6" />
          <stop offset="100%" stopColor="#0D9488" />
        </linearGradient>
      </defs>

      {/* Sound waves */}
      <path d="M 10 28 Q 8 32 10 36" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.4"/>
      <path d="M 6 24 Q 4 32 6 40" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.3"/>
      <path d="M 54 28 Q 56 32 54 36" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.4"/>
      <path d="M 58 24 Q 60 32 58 40" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.3"/>

      {/* Shadow */}
      <ellipse cx="32" cy="54" rx="18" ry="2" fill="#1E293B" opacity="0.15"/>

      {/* Headband */}
      <path d="M 18 32 Q 18 12 32 10 Q 46 12 46 32" stroke="url(#headphoneBand)" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <path d="M 18 32 Q 18 14 32 12 Q 46 14 46 32" stroke="#5EEAD4" strokeWidth="2" fill="none" strokeLinecap="round"/>

      {/* Left earcup - 3D */}
      <ellipse cx="18" cy="32" rx="6" ry="8" fill="url(#earcup)"/>
      <ellipse cx="18" cy="32" rx="4" ry="6" fill="#0D9488"/>
      <ellipse cx="18" cy="32" rx="2.5" ry="4" fill="#134E4A"/>
      <ellipse cx="17" cy="30" rx="1" ry="2" fill="#2DD4BF" opacity="0.6"/>

      {/* Right earcup - 3D */}
      <ellipse cx="46" cy="32" rx="6" ry="8" fill="url(#earcup)"/>
      <ellipse cx="46" cy="32" rx="4" ry="6" fill="#0D9488"/>
      <ellipse cx="46" cy="32" rx="2.5" ry="4" fill="#134E4A"/>
      <ellipse cx="45" cy="30" rx="1" ry="2" fill="#2DD4BF" opacity="0.6"/>

      {/* Microphone */}
      <path d="M 18 38 Q 18 44 22 46 L 26 46" stroke="#475569" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="28" cy="46" r="2" fill="#64748B"/>

      {/* Detail lines on band */}
      <line x1="28" y1="12" x2="36" y2="12" stroke="#0D9488" strokeWidth="1" opacity="0.5"/>
    </svg>
  </div>
);

export const Microphone3DIcon: React.FC<Icon3DProps> = ({ className = "w-12 h-12" }) => (
  <div className={`${className} flex items-center justify-center`}>
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="micBody" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5EEAD4" />
          <stop offset="100%" stopColor="#14B8A6" />
        </linearGradient>
        <radialGradient id="micMesh">
          <stop offset="0%" stopColor="#99F6E4" />
          <stop offset="100%" stopColor="#14B8A6" />
        </radialGradient>
      </defs>

      {/* Sound waves radiating */}
      <path d="M 46 16 Q 50 20 50 28" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5"/>
      <path d="M 50 16 Q 54 20 54 28" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.3"/>
      <path d="M 18 16 Q 14 20 14 28" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5"/>
      <path d="M 14 16 Q 10 20 10 28" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.3"/>

      {/* Shadow */}
      <ellipse cx="32" cy="54" rx="16" ry="2" fill="#1E293B" opacity="0.15"/>

      {/* Stand base */}
      <ellipse cx="32" cy="52" rx="8" ry="2" fill="#475569"/>
      <rect x="30" y="40" width="4" height="12" fill="#64748B"/>

      {/* Mic clip/holder */}
      <rect x="28" y="38" width="8" height="4" rx="1" fill="#475569"/>

      {/* Microphone body - 3D */}
      <rect x="26" y="14" width="12" height="24" rx="6" fill="url(#micBody)"/>

      {/* Microphone mesh/grill - 3D effect */}
      <ellipse cx="32" cy="14" rx="6" ry="4" fill="url(#micMesh)"/>

      {/* Mesh pattern */}
      <line x1="28" y1="14" x2="28" y2="32" stroke="#0D9488" strokeWidth="0.5" opacity="0.5"/>
      <line x1="30" y1="14" x2="30" y2="34" stroke="#0D9488" strokeWidth="0.5" opacity="0.5"/>
      <line x1="32" y1="14" x2="32" y2="34" stroke="#0D9488" strokeWidth="0.5" opacity="0.5"/>
      <line x1="34" y1="14" x2="34" y2="34" stroke="#0D9488" strokeWidth="0.5" opacity="0.5"/>
      <line x1="36" y1="14" x2="36" y2="32" stroke="#0D9488" strokeWidth="0.5" opacity="0.5"/>

      {/* Highlight */}
      <ellipse cx="30" cy="20" rx="2" ry="6" fill="white" opacity="0.3"/>

      {/* Brand ring */}
      <circle cx="32" cy="32" r="5" stroke="#0D9488" strokeWidth="1" fill="none"/>

      {/* ON indicator */}
      <circle cx="32" cy="32" r="2" fill="#10B981"/>
    </svg>
  </div>
);

// ===== COMMUNICATION (INDIGO THEME) =====

export const ChatBubble3DIcon: React.FC<Icon3DProps> = ({ className = "w-12 h-12" }) => (
  <div className={`${className} flex items-center justify-center`}>
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="bubble1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818CF8" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>
        <linearGradient id="bubble2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#4F46E5" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx="32" cy="54" rx="24" ry="3" fill="#1E293B" opacity="0.15"/>

      {/* Chat bubble 2 (back) - 3D */}
      <rect x="24" y="28" width="28" height="20" rx="4" fill="url(#bubble2)"/>
      <path d="M 48 48 L 52 52 L 50 48 Z" fill="#4F46E5"/>
      <line x1="28" y1="34" x2="44" y2="34" stroke="white" strokeWidth="1" opacity="0.4"/>
      <line x1="28" y1="38" x2="40" y2="38" stroke="white" strokeWidth="1" opacity="0.4"/>
      <line x1="28" y1="42" x2="42" y2="42" stroke="white" strokeWidth="1" opacity="0.4"/>

      {/* Chat bubble 1 (front) - 3D */}
      <rect x="12" y="14" width="28" height="20" rx="4" fill="url(#bubble1)"/>
      <path d="M 16 34 L 12 38 L 14 34 Z" fill="#6366F1"/>

      {/* Chat dots */}
      <circle cx="20" cy="24" r="2" fill="white" opacity="0.9"/>
      <circle cx="26" cy="24" r="2" fill="white" opacity="0.9"/>
      <circle cx="32" cy="24" r="2" fill="white" opacity="0.9"/>

      {/* Highlight */}
      <ellipse cx="18" cy="18" rx="4" ry="3" fill="white" opacity="0.3"/>

      {/* AI sparkle */}
      <circle cx="36" cy="18" r="3" fill="#FBBF24"/>
      <path d="M 36 18 L 36.7 20 L 38.5 20.7 L 36.7 21.4 L 36 23.5 L 35.3 21.4 L 33.5 20.7 L 35.3 20 Z" fill="#FCD34D"/>
    </svg>
  </div>
);

// Export all icons
export const Illustrated3DIcons = {
  // Learning & Courses (Blue)
  Book3DIcon,
  Documents3DIcon,
  Notebook3DIcon,

  // Performance & Analytics (Purple)
  Chart3DIcon,
  Report3DIcon,
  Trophy3DIcon,

  // Practice & Daily (Orange)
  Pencil3DIcon,
  Target3DIcon,
  Calendar3DIcon,

  // AI Tools (Pink/Magenta)
  Brain3DIcon,
  Lightbulb3DIcon,

  // Tests & Assessments (Teal)
  Exam3DIcon,
  Headphones3DIcon,
  Microphone3DIcon,

  // Communication (Indigo)
  ChatBubble3DIcon,
};
