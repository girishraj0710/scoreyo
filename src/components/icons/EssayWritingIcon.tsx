import React from 'react';

interface IconProps {
  className?: string;
}

export const EssayWritingIcon: React.FC<IconProps> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Essay Writing"
    >
      <defs>
        {/* Gradients for document */}
        <linearGradient id="paper-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1e40af" />
        </linearGradient>
        <linearGradient id="paper-highlight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.2" />
        </linearGradient>

        {/* Gradient for pen */}
        <linearGradient id="pen-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>

        {/* Shadow filters */}
        <filter id="doc-shadow">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.3" />
        </filter>
        <filter id="pen-shadow">
          <feDropShadow dx="1" dy="2" stdDeviation="2" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Background glow */}
      <circle cx="32" cy="32" r="26" fill="#dbeafe" opacity="0.3" />

      {/* Document with essay structure */}
      <g filter="url(#doc-shadow)">
        {/* Main document body */}
        <rect
          x="14"
          y="10"
          width="36"
          height="44"
          rx="2"
          fill="url(#paper-gradient)"
        />

        {/* Document highlight overlay */}
        <rect
          x="14"
          y="10"
          width="36"
          height="44"
          rx="2"
          fill="url(#paper-highlight)"
        />

        {/* Folded corner (3D effect) */}
        <path
          d="M 44 10 L 50 10 L 50 16 Z"
          fill="#1e3a8a"
          opacity="0.6"
        />
        <path
          d="M 44 10 L 50 16 L 44 16 Z"
          fill="#60a5fa"
          opacity="0.4"
        />

        {/* Essay structure lines */}
        {/* Title line (centered, bold) */}
        <rect x="20" y="16" width="24" height="2.5" rx="1" fill="#ffffff" opacity="0.9" />

        {/* Introduction paragraph */}
        <rect x="18" y="22" width="28" height="1.5" rx="0.5" fill="#dbeafe" opacity="0.85" />
        <rect x="18" y="25" width="26" height="1.5" rx="0.5" fill="#dbeafe" opacity="0.8" />
        <rect x="18" y="28" width="24" height="1.5" rx="0.5" fill="#dbeafe" opacity="0.75" />

        {/* Body paragraph 1 */}
        <rect x="18" y="33" width="27" height="1.5" rx="0.5" fill="#bfdbfe" opacity="0.8" />
        <rect x="18" y="36" width="25" height="1.5" rx="0.5" fill="#bfdbfe" opacity="0.75" />
        <rect x="18" y="39" width="23" height="1.5" rx="0.5" fill="#bfdbfe" opacity="0.7" />

        {/* Body paragraph 2 */}
        <rect x="18" y="44" width="26" height="1.5" rx="0.5" fill="#93c5fd" opacity="0.75" />
        <rect x="18" y="47" width="24" height="1.5" rx="0.5" fill="#93c5fd" opacity="0.7" />

        {/* Paragraph indentation markers */}
        <circle cx="17" cy="22.5" r="0.8" fill="#60a5fa" opacity="0.6" />
        <circle cx="17" cy="33.5" r="0.8" fill="#60a5fa" opacity="0.6" />
        <circle cx="17" cy="44.5" r="0.8" fill="#60a5fa" opacity="0.6" />
      </g>

      {/* Fountain pen (3D style) */}
      <g filter="url(#pen-shadow)">
        {/* Pen body */}
        <path
          d="M 42 46 L 52 36 L 54 38 L 44 48 Z"
          fill="url(#pen-gradient)"
        />

        {/* Pen cap accent */}
        <rect
          x="50"
          y="34"
          width="3"
          height="1.5"
          rx="0.3"
          fill="#1e40af"
          transform="rotate(45, 52, 36)"
        />

        {/* Pen nib (gold) */}
        <path
          d="M 42 46 L 40 48 L 42 50 L 44 48 Z"
          fill="#fbbf24"
        />
        <path
          d="M 42 46 L 40 48 L 42 49 Z"
          fill="#f59e0b"
          opacity="0.8"
        />

        {/* Pen highlight */}
        <path
          d="M 43 47 L 51 39 L 52 40 L 44 48 Z"
          fill="#ffffff"
          opacity="0.25"
        />

        {/* Ink dot */}
        <circle cx="39" cy="49" r="0.8" fill="#1e40af" opacity="0.7" />
      </g>

      {/* Decorative writing sparkles */}
      <g opacity="0.5">
        <circle cx="12" cy="24" r="1" fill="#60a5fa" />
        <circle cx="54" cy="20" r="0.8" fill="#93c5fd" />
        <circle cx="10" cy="44" r="1.2" fill="#3b82f6" />
      </g>
    </svg>
  );
};
