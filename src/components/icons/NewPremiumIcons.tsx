/**
 * New Premium 3D Topic Icons - Advanced English Grammar
 *
 * Design Principles:
 * - Unique visual metaphors for each concept
 * - Premium 3D quality with depth, shadows, gradients
 * - Educational and immediately recognizable
 * - Consistent with existing icon family
 */

import React from 'react';

interface IconProps {
  className?: string;
}

// 1. Passive Voice - Toggle Switch showing ACTIVE/PASSIVE transformation
export const PassiveVoiceIcon: React.FC<IconProps> = ({ className = "w-12 h-12" }) => (
  <div className={`${className} flex items-center justify-center`}>
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="toggleBase" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#6D28D9" />
        </linearGradient>
        <linearGradient id="activeBtn" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
        <linearGradient id="passiveBtn" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F472B6" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
        <linearGradient id="arrowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx="32" cy="54" rx="24" ry="3" fill="#1E293B" opacity="0.15"/>

      {/* Toggle base (3D rounded rectangle) */}
      <rect x="12" y="26" width="40" height="12" rx="6" fill="url(#toggleBase)"/>
      <rect x="12" y="24" width="40" height="10" rx="5" fill="#9333EA" opacity="0.3"/>

      {/* Inner track */}
      <rect x="14" y="28" width="36" height="8" rx="4" fill="#5B21B6"/>

      {/* Active button (left side) */}
      <circle cx="22" cy="32" r="7" fill="url(#activeBtn)"/>
      <circle cx="20" cy="30" r="3" fill="white" opacity="0.5"/>
      <text x="22" y="36" fontSize="5" fontWeight="bold" fill="white" textAnchor="middle">ON</text>

      {/* Passive button (right side) */}
      <circle cx="42" cy="32" r="7" fill="url(#passiveBtn)"/>
      <circle cx="40" cy="30" r="3" fill="white" opacity="0.5"/>
      <text x="42" y="36" fontSize="5" fontWeight="bold" fill="white" textAnchor="middle">OFF</text>

      {/* Transformation arrows */}
      <path d="M 26 24 L 30 20 L 30 22 L 34 22 L 34 20 L 38 24 L 34 28 L 34 26 L 30 26 L 30 28 Z"
            fill="url(#arrowGrad)"/>
      <circle cx="32" cy="24" r="1.5" fill="#FCD34D"/>

      {/* Labels */}
      <text x="22" y="18" fontSize="6" fontWeight="bold" fill="#10B981" textAnchor="middle">ACTIVE</text>
      <text x="42" y="18" fontSize="6" fontWeight="bold" fill="#EC4899" textAnchor="middle">PASSIVE</text>

      {/* Example text */}
      <text x="32" y="46" fontSize="5" fill="#64748B" textAnchor="middle" fontWeight="600">Voice Transform</text>
      <text x="32" y="52" fontSize="4" fill="#94A3B8" textAnchor="middle">I eat → It is eaten</text>

      {/* Sparkle effect */}
      <circle cx="48" cy="16" r="2" fill="#FBBF24" opacity="0.8"/>
      <path d="M 48 16 L 48.5 17.5 L 50 18 L 48.5 18.5 L 48 20 L 47.5 18.5 L 46 18 L 47.5 17.5 Z"
            fill="#FCD34D"/>
    </svg>
  </div>
);

// 2. Gerunds & Infinitives - Two 3D Blocks showing "TO + VERB" and "VERB-ING"
export const GerundsInfinitivesIcon: React.FC<IconProps> = ({ className = "w-12 h-12" }) => (
  <div className={`${className} flex items-center justify-center`}>
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="infinitiveBlock" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
        <linearGradient id="gerundBlock" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F472B6" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
        <radialGradient id="glow">
          <stop offset="0%" stopColor="#FBBF24" opacity="0.6"/>
          <stop offset="100%" stopColor="#F59E0B" opacity="0"/>
        </radialGradient>
      </defs>

      {/* Glow effect */}
      <circle cx="32" cy="32" r="26" fill="url(#glow)"/>

      {/* Shadow */}
      <ellipse cx="32" cy="54" rx="26" ry="3" fill="#1E293B" opacity="0.15"/>

      {/* Infinitive Block (left) - 3D cube "TO + VERB" */}
      {/* Right face */}
      <path d="M 22 24 L 30 20 L 30 32 L 22 36 Z" fill="#1D4ED8"/>
      {/* Left face */}
      <path d="M 22 24 L 22 36 L 14 32 L 14 20 Z" fill="url(#infinitiveBlock)"/>
      {/* Top face */}
      <path d="M 14 20 L 22 24 L 30 20 L 22 16 Z" fill="#93C5FD"/>

      {/* "TO" text on top */}
      <text x="22" y="21" fontSize="6" fontWeight="bold" fill="#1E3A8A" textAnchor="middle">TO</text>
      {/* "+VERB" text on front */}
      <text x="18" y="30" fontSize="5" fontWeight="bold" fill="white" textAnchor="middle">+</text>
      <text x="18" y="34" fontSize="4" fontWeight="600" fill="white" textAnchor="middle">VERB</text>

      {/* Gerund Block (right) - 3D cube "VERB-ING" */}
      {/* Right face */}
      <path d="M 42 28 L 50 24 L 50 36 L 42 40 Z" fill="#BE185D"/>
      {/* Left face */}
      <path d="M 42 28 L 42 40 L 34 36 L 34 24 Z" fill="url(#gerundBlock)"/>
      {/* Top face */}
      <path d="M 34 24 L 42 28 L 50 24 L 42 20 Z" fill="#F9A8D4"/>

      {/* "VERB" text on top */}
      <text x="42" y="25" fontSize="5" fontWeight="bold" fill="#831843" textAnchor="middle">VERB</text>
      {/* "-ING" text on front */}
      <text x="38" y="34" fontSize="5" fontWeight="bold" fill="white" textAnchor="middle">-ING</text>

      {/* Connection symbol - infinity/choice symbol */}
      <path d="M 26 42 Q 28 44 32 44 Q 36 44 38 42 Q 40 40 38 38 Q 36 36 32 36 Q 28 36 26 38 Q 24 40 26 42 Z"
            stroke="#FBBF24" strokeWidth="2" fill="none"/>
      <circle cx="26" cy="40" r="1.5" fill="#F59E0B"/>
      <circle cx="38" cy="40" r="1.5" fill="#F59E0B"/>

      {/* Examples */}
      <text x="10" y="48" fontSize="4" fill="#3B82F6" fontWeight="600">to swim</text>
      <text x="42" y="48" fontSize="4" fill="#EC4899" fontWeight="600">swimming</text>

      {/* Label */}
      <text x="32" y="56" fontSize="5" fill="#64748B" textAnchor="middle" fontWeight="600">Verb Forms</text>

      {/* Highlight sparkles */}
      <circle cx="28" cy="18" r="1.5" fill="#FCD34D"/>
      <path d="M 28 18 L 28.5 19 L 29.5 19.5 L 28.5 20 L 28 21 L 27.5 20 L 26.5 19.5 L 27.5 19 Z"
            fill="white" opacity="0.8"/>
    </svg>
  </div>
);

// 3. Conditionals - Branching Path with IF Diamond Decision
export const ConditionalsIcon: React.FC<IconProps> = ({ className = "w-12 h-12" }) => (
  <div className={`${className} flex items-center justify-center`}>
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="diamond" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
        <linearGradient id="truePath" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
        <linearGradient id="falsePath" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F87171" />
          <stop offset="100%" stopColor="#EF4444" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx="32" cy="54" rx="24" ry="3" fill="#1E293B" opacity="0.15"/>

      {/* Starting point - circle */}
      <circle cx="32" cy="12" r="4" fill="#8B5CF6"/>
      <circle cx="32" cy="11" r="3" fill="#A78BFA"/>

      {/* Arrow down to IF */}
      <path d="M 32 16 L 32 22" stroke="#64748B" strokeWidth="2" strokeLinecap="round"/>
      <path d="M 32 22 L 30 20 M 32 22 L 34 20" stroke="#64748B" strokeWidth="2" strokeLinecap="round"/>

      {/* IF Diamond (3D) */}
      <path d="M 32 24 L 44 32 L 32 40 L 20 32 Z" fill="url(#diamond)"/>
      <path d="M 32 24 L 44 32 L 32 36 L 20 32 Z" fill="#FCD34D" opacity="0.4"/>
      <text x="32" y="34" fontSize="8" fontWeight="bold" fill="white" textAnchor="middle">IF</text>

      {/* Question mark */}
      <text x="32" y="42" fontSize="6" fontWeight="bold" fill="#78350F" textAnchor="middle">?</text>

      {/* TRUE path (right) - green */}
      <path d="M 44 32 L 52 32" stroke="url(#truePath)" strokeWidth="3" strokeLinecap="round"/>
      <path d="M 52 32 L 50 30 M 52 32 L 50 34" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="56" cy="32" r="4" fill="#10B981"/>
      <path d="M 54 32 L 55.5 34 L 58 30" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <text x="48" y="28" fontSize="5" fontWeight="bold" fill="#10B981">TRUE</text>

      {/* FALSE path (left) - red */}
      <path d="M 20 32 L 12 32" stroke="url(#falsePath)" strokeWidth="3" strokeLinecap="round"/>
      <path d="M 12 32 L 14 30 M 12 32 L 14 34" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="8" cy="32" r="4" fill="#EF4444"/>
      <path d="M 6 30 L 10 34 M 6 34 L 10 30" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <text x="16" y="28" fontSize="5" fontWeight="bold" fill="#EF4444">FALSE</text>

      {/* Example text */}
      <text x="32" y="50" fontSize="4.5" fill="#64748B" textAnchor="middle" fontWeight="600">
        If it rains, I stay home
      </text>
      <text x="32" y="56" fontSize="4" fill="#94A3B8" textAnchor="middle">
        (condition → result)
      </text>

      {/* Sparkle on diamond */}
      <circle cx="36" cy="28" r="1.5" fill="white" opacity="0.8"/>
      <path d="M 36 28 L 36.5 29 L 37.5 29.5 L 36.5 30 L 36 31 L 35.5 30 L 34.5 29.5 L 35.5 29 Z"
            fill="white" opacity="0.6"/>
    </svg>
  </div>
);

// 4. Relative Clauses - Chain Links with WHO, WHICH, THAT Labels
export const RelativeClausesIcon: React.FC<IconProps> = ({ className = "w-12 h-12" }) => (
  <div className={`${className} flex items-center justify-center`}>
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="link1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#6D28D9" />
        </linearGradient>
        <linearGradient id="link2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
        <linearGradient id="link3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C084FC" />
          <stop offset="100%" stopColor="#A855F7" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx="32" cy="54" rx="26" ry="3" fill="#1E293B" opacity="0.15"/>

      {/* First link (left) - "WHO" */}
      <ellipse cx="16" cy="28" rx="8" ry="10" fill="none" stroke="url(#link1)" strokeWidth="4"/>
      <ellipse cx="16" cy="27" rx="6" ry="8" fill="none" stroke="#9333EA" strokeWidth="2" opacity="0.3"/>
      <text x="16" y="30" fontSize="7" fontWeight="bold" fill="#7C3AED" textAnchor="middle">WHO</text>
      <text x="16" y="44" fontSize="4" fill="#7C3AED" fontWeight="600" textAnchor="middle">person</text>

      {/* Second link (center) - "WHICH" interlocked */}
      <ellipse cx="32" cy="28" rx="8" ry="10" fill="none" stroke="url(#link2)" strokeWidth="4"/>
      <ellipse cx="32" cy="27" rx="6" ry="8" fill="none" stroke="#8B5CF6" strokeWidth="2" opacity="0.3"/>
      <text x="32" y="28" fontSize="6" fontWeight="bold" fill="#8B5CF6" textAnchor="middle">WHICH</text>
      <text x="32" y="44" fontSize="4" fill="#8B5CF6" fontWeight="600" textAnchor="middle">thing</text>

      {/* Third link (right) - "THAT" */}
      <ellipse cx="48" cy="28" rx="8" ry="10" fill="none" stroke="url(#link3)" strokeWidth="4"/>
      <ellipse cx="48" cy="27" rx="6" ry="8" fill="none" stroke="#A855F7" strokeWidth="2" opacity="0.3"/>
      <text x="48" y="30" fontSize="7" fontWeight="bold" fill="#A855F7" textAnchor="middle">THAT</text>
      <text x="48" y="44" fontSize="4" fill="#A855F7" fontWeight="600" textAnchor="middle">both</text>

      {/* Connection highlights - showing they link sentences */}
      <circle cx="24" cy="28" r="2" fill="#FBBF24"/>
      <circle cx="40" cy="28" r="2" fill="#FBBF24"/>

      {/* Example sentence */}
      <text x="32" y="52" fontSize="4.5" fill="#64748B" textAnchor="middle" fontWeight="600">
        The girl WHO likes math
      </text>
      <text x="32" y="58" fontSize="3.5" fill="#94A3B8" textAnchor="middle">
        (links two ideas together)
      </text>

      {/* 3D depth effect - shadow inside first link */}
      <ellipse cx="16" cy="30" rx="5" ry="6" fill="#5B21B6" opacity="0.2"/>
      <ellipse cx="32" cy="30" rx="5" ry="6" fill="#6D28D9" opacity="0.2"/>
      <ellipse cx="48" cy="30" rx="5" ry="6" fill="#7C3AED" opacity="0.2"/>

      {/* Sparkle showing connection */}
      <circle cx="32" cy="18" r="2" fill="#FBBF24"/>
      <path d="M 32 18 L 32.5 19.5 L 34 20 L 32.5 20.5 L 32 22 L 31.5 20.5 L 30 20 L 31.5 19.5 Z"
            fill="#FCD34D"/>

      {/* Shine on links */}
      <ellipse cx="14" cy="24" rx="2" ry="3" fill="white" opacity="0.4"/>
      <ellipse cx="30" cy="24" rx="2" ry="3" fill="white" opacity="0.4"/>
      <ellipse cx="46" cy="24" rx="2" ry="3" fill="white" opacity="0.4"/>
    </svg>
  </div>
);

// Export all new icons
export const NewPremiumIcons = {
  'passive-voice': PassiveVoiceIcon,
  'gerunds-infinitives': GerundsInfinitivesIcon,
  'conditionals': ConditionalsIcon,
  'relative-clauses': RelativeClausesIcon,
};
