import React from 'react';

interface IconProps {
  className?: string;
}

export const PrepositionsMasteryIcon: React.FC<IconProps> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Prepositions Mastery"
    >
      <defs>
        <linearGradient id="prep-box-top" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5eead4" />
          <stop offset="100%" stopColor="#0d9488" />
        </linearGradient>
        <linearGradient id="prep-box-side" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0f766e" />
          <stop offset="100%" stopColor="#134e4a" />
        </linearGradient>
      <linearGradient id="prep-box-front" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2dd4bf" />
          <stop offset="100%" stopColor="#0d9488" />
        </linearGradient>
        <radialGradient id="prep-orb-in" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#f59e0b" />
        </radialGradient>
        <radialGradient id="prep-orb-on" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fda4af" />
          <stop offset="100%" stopColor="#e11d48" />
        </radialGradient>
        <radialGradient id="prep-orb-under" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="100%" stopColor="#7c3aed" />
        </radialGradient>
        <filter id="prep-shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodOpacity="0.3" />
        </filter>
      </defs>

      <ellipse cx="32" cy="56" rx="22" ry="3" fill="#134e4a" opacity="0.25" />

      {/* Platform shelf (ON) */}
      <g filter="url(#prep-shadow)">
        <path d="M 40 20 L 56 24 L 44 28 L 28 24 Z" fill="url(#prep-box-top)" />
        <circle cx="42" cy="21" r="4" fill="url(#prep-orb-on)" />
        <circle cx="40.5" cy="19.5" r="1.2" fill="#ffffff" opacity="0.5" />
      </g>

      {/* Glass cube container (IN) */}
      <g filter="url(#prep-shadow)">
        <path d="M 14 30 L 26 26 L 38 30 L 26 34 Z" fill="url(#prep-box-top)" opacity="0.85" />
        <path d="M 14 30 L 14 44 L 26 48 L 26 34 Z" fill="url(#prep-box-front)" opacity="0.55" />
        <path d="M 38 30 L 38 44 L 26 48 L 26 34 Z" fill="url(#prep-box-side)" opacity="0.55" />
        <path d="M 14 30 L 26 26 L 38 30 L 26 34 Z" fill="none" stroke="#5eead4" strokeWidth="0.6" opacity="0.6" />
        <circle cx="26" cy="38" r="4.5" fill="url(#prep-orb-in)" />
        <circle cx="24.5" cy="36" r="1.3" fill="#ffffff" opacity="0.6" />
      </g>

      {/* Shelf with orb underneath (UNDER) */}
      <g filter="url(#prep-shadow)">
        <path d="M 30 46 L 46 42 L 58 46 L 42 50 Z" fill="url(#prep-box-front)" />
        <path d="M 30 46 L 30 48 L 42 52 L 58 48 L 58 46 L 42 50 Z" fill="url(#prep-box-side)" opacity="0.9" />
        <circle cx="44" cy="56" r="3.6" fill="url(#prep-orb-under)" />
        <circle cx="43" cy="54.5" r="1" fill="#ffffff" opacity="0.5" />
      </g>

      {/* Highlight overlay */}
      <path d="M 14 30 L 26 26 L 26 30 L 16 33 Z" fill="#ffffff" opacity="0.2" />

      {/* Sparkles */}
      <g opacity="0.55">
        <circle cx="8" cy="14" r="1" fill="#5eead4" />
        <circle cx="58" cy="12" r="1.1" fill="#fda4af" />
        <circle cx="10" cy="56" r="0.8" fill="#c4b5fd" />
        <circle cx="52" cy="58" r="0.9" fill="#fef08a" />
      </g>
    </svg>
  );
};
