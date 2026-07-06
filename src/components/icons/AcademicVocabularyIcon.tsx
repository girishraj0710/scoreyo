import React from 'react';

interface IconProps {
  className?: string;
}

export const AcademicVocabularyIcon: React.FC<IconProps> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Academic Vocabulary"
    >
      <defs>
        {/* Gradients for graduation cap */}
        <linearGradient id="cap-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9333ea" />
          <stop offset="100%" stopColor="#6b21a8" />
        </linearGradient>
        <linearGradient id="cap-shadow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#581c87" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#3b0764" stopOpacity="0.4" />
        </linearGradient>

        {/* Gradients for books */}
        <linearGradient id="book-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#7e22ce" />
        </linearGradient>
        <linearGradient id="book-gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#9333ea" />
        </linearGradient>
        <linearGradient id="book-gradient-3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d8b4fe" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>

        {/* Shadow filter */}
        <filter id="shadow-deep">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Background circle for depth */}
      <circle cx="32" cy="32" r="28" fill="url(#cap-shadow)" opacity="0.2" />

      {/* Stack of academic books */}
      <g filter="url(#shadow-deep)">
        {/* Book 3 (bottom, tilted left) */}
        <rect
          x="14"
          y="38"
          width="20"
          height="14"
          rx="1.5"
          fill="url(#book-gradient-3)"
          transform="rotate(-5, 24, 45)"
        />
        <rect x="16" y="39" width="1" height="12" fill="#faf5ff" opacity="0.6" transform="rotate(-5, 24, 45)" />

        {/* Book 2 (middle, tilted right) */}
        <rect
          x="22"
          y="32"
          width="20"
          height="14"
          rx="1.5"
          fill="url(#book-gradient-2)"
          transform="rotate(5, 32, 39)"
        />
        <rect x="24" y="33" width="1" height="12" fill="#f3e8ff" opacity="0.6" transform="rotate(5, 32, 39)" />

        {/* Book 1 (top, straight) */}
        <rect
          x="18"
          y="26"
          width="20"
          height="14"
          rx="1.5"
          fill="url(#book-gradient-1)"
        />
        <rect x="20" y="27" width="1" height="12" fill="#e9d5ff" opacity="0.6" />

        {/* Book pages detail */}
        <line x1="37" y1="27" x2="37" y2="39" stroke="#f5f3ff" strokeWidth="0.5" opacity="0.8" />
        <line x1="36.5" y1="27" x2="36.5" y2="39" stroke="#f5f3ff" strokeWidth="0.5" opacity="0.6" />
      </g>

      {/* Graduation cap */}
      <g filter="url(#shadow-deep)">
        {/* Cap base (mortarboard) */}
        <path
          d="M 32 12 L 48 18 L 32 24 L 16 18 Z"
          fill="url(#cap-gradient)"
        />

        {/* Cap 3D bottom face */}
        <path
          d="M 16 18 L 16 20 L 32 26 L 48 20 L 48 18 L 32 24 Z"
          fill="url(#cap-shadow)"
          opacity="0.9"
        />

        {/* Tassel string */}
        <line x1="48" y1="18" x2="48" y2="28" stroke="#fbbf24" strokeWidth="0.8" />

        {/* Tassel top knot */}
        <circle cx="48" cy="17" r="1.2" fill="#fde047" />

        {/* Tassel bottom */}
        <g>
          <circle cx="48" cy="28" r="2" fill="#fde047" opacity="0.9" />
          <circle cx="48" cy="28" r="1.5" fill="#facc15" />
          <line x1="47" y1="30" x2="46.5" y2="32" stroke="#f59e0b" strokeWidth="0.5" opacity="0.7" />
          <line x1="48" y1="30" x2="48" y2="32" stroke="#f59e0b" strokeWidth="0.5" opacity="0.7" />
          <line x1="49" y1="30" x2="49.5" y2="32" stroke="#f59e0b" strokeWidth="0.5" opacity="0.7" />
        </g>

        {/* Cap highlights */}
        <path
          d="M 32 12 L 40 15 L 32 18 L 24 15 Z"
          fill="#ffffff"
          opacity="0.25"
        />
      </g>

      {/* Decorative academic sparkles */}
      <g opacity="0.6">
        <circle cx="12" cy="16" r="1" fill="#c084fc" />
        <circle cx="52" cy="44" r="1.2" fill="#a855f7" />
        <circle cx="10" cy="48" r="0.8" fill="#d8b4fe" />
      </g>
    </svg>
  );
};
