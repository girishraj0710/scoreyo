import React from 'react';

interface IconProps {
  className?: string;
}

export const IeltsToeflWritingIcon: React.FC<IconProps> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="IELTS TOEFL Writing"
    >
      <defs>
        {/* Gradient for lined exam paper */}
        <linearGradient id="writing-paper-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="writing-paper-highlight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#4c1d95" stopOpacity="0.2" />
        </linearGradient>

        {/* Gradient for pencil */}
        <linearGradient id="writing-pencil-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>

        {/* Gradient for score badge */}
        <radialGradient id="writing-score-gradient" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#6ee7b7" />
          <stop offset="100%" stopColor="#059669" />
        </radialGradient>

        {/* Shadow filters */}
        <filter id="writing-doc-shadow">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.3" />
        </filter>
        <filter id="writing-pencil-shadow">
          <feDropShadow dx="1" dy="2" stdDeviation="2" floodOpacity="0.4" />
        </filter>
        <filter id="writing-badge-shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Background glow */}
      <circle cx="28" cy="30" r="24" fill="#ede9fe" opacity="0.35" />

      {/* Lined exam paper (3D) */}
      <g filter="url(#writing-doc-shadow)">
        <rect x="9" y="8" width="34" height="46" rx="2" fill="url(#writing-paper-gradient)" />
        <rect x="9" y="8" width="34" height="46" rx="2" fill="url(#writing-paper-highlight)" />

        {/* Folded corner */}
        <path d="M 37 8 L 43 8 L 43 14 Z" fill="#4c1d95" opacity="0.6" />
        <path d="M 37 8 L 43 14 L 37 14 Z" fill="#ddd6fe" opacity="0.4" />

        {/* Title line */}
        <rect x="14" y="14" width="18" height="2.2" rx="1" fill="#ffffff" opacity="0.9" />

        {/* Essay lines (some partially written to show progress) */}
        <rect x="13" y="20" width="24" height="1.4" rx="0.5" fill="#ede9fe" opacity="0.85" />
        <rect x="13" y="23" width="22" height="1.4" rx="0.5" fill="#ede9fe" opacity="0.8" />
        <rect x="13" y="26" width="20" height="1.4" rx="0.5" fill="#ddd6fe" opacity="0.75" />
        <rect x="13" y="29" width="23" height="1.4" rx="0.5" fill="#ddd6fe" opacity="0.7" />
        <rect x="13" y="32" width="16" height="1.4" rx="0.5" fill="#c4b5fd" opacity="0.7" />
        {/* Empty (not yet written) lines */}
        <rect x="13" y="37" width="24" height="1" rx="0.5" fill="#ffffff" opacity="0.25" />
        <rect x="13" y="40" width="22" height="1" rx="0.5" fill="#ffffff" opacity="0.2" />
        <rect x="13" y="43" width="20" height="1" rx="0.5" fill="#ffffff" opacity="0.15" />
      </g>

      {/* 3D pencil writing on the paper */}
      <g filter="url(#writing-pencil-shadow)">
        {/* Pencil body */}
        <path d="M 24 40 L 40 24 L 45 29 L 29 45 Z" fill="url(#writing-pencil-gradient)" />
        {/* Pencil metal band */}
        <path d="M 38 26 L 42 30 L 40 32 L 36 28 Z" fill="#e5e7eb" />
        {/* Pencil tip */}
        <path d="M 24 40 L 21 45 L 26 42 Z" fill="#78350f" />
        <path d="M 24 40 L 21 45 L 23.5 43 Z" fill="#1f2937" />
        {/* Pencil highlight */}
        <path d="M 26 38 L 39 25 L 41 27 L 28 40 Z" fill="#ffffff" opacity="0.3" />
        {/* Motion line from pencil tip showing writing */}
        <path d="M 21 45 L 15 47" stroke="#4c1d95" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
      </g>

      {/* Score badge */}
      <g filter="url(#writing-badge-shadow)">
        <circle cx="48" cy="46" r="11" fill="url(#writing-score-gradient)" />
        <circle cx="48" cy="46" r="11" fill="#ffffff" opacity="0.08" />
        {/* Band-style ribbon shape suggests score badge */}
        <path d="M 43 51 L 40 58 L 48 54 L 56 58 L 53 51 Z" fill="#047857" opacity="0.85" />
        {/* Star mark for score */}
        <path
          d="M 48 40.5 L 49.6 44 L 53.2 44.4 L 50.6 47 L 51.4 50.7 L 48 48.8 L 44.6 50.7 L 45.4 47 L 42.8 44.4 L 46.4 44 Z"
          fill="#ecfdf5"
        />
      </g>

      {/* Decorative sparkles */}
      <g opacity="0.5">
        <circle cx="7" cy="50" r="1" fill="#c4b5fd" />
        <circle cx="52" cy="10" r="0.9" fill="#6ee7b7" />
        <circle cx="6" cy="12" r="0.8" fill="#ddd6fe" />
      </g>
    </svg>
  );
};
