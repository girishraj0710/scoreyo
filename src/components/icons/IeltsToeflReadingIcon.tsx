import React from 'react';

interface IconProps {
  className?: string;
}

export const IeltsToeflReadingIcon: React.FC<IconProps> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="IELTS TOEFL Reading"
    >
      <defs>
        {/* Gradient for exam paper */}
        <linearGradient id="reading-paper-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="reading-paper-highlight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#065f46" stopOpacity="0.2" />
        </linearGradient>

        {/* Gradient for highlighted passage */}
        <linearGradient id="reading-highlight-band" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#facc15" />
        </linearGradient>

        {/* Gradient for clock badge */}
        <radialGradient id="reading-clock-gradient" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#fca5a5" />
          <stop offset="100%" stopColor="#dc2626" />
        </radialGradient>

        {/* Shadow filters */}
        <filter id="reading-doc-shadow">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.3" />
        </filter>
        <filter id="reading-clock-shadow">
          <feDropShadow dx="1" dy="2" stdDeviation="2" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Background glow */}
      <circle cx="28" cy="30" r="24" fill="#d1fae5" opacity="0.35" />

      {/* Exam paper (3D) */}
      <g filter="url(#reading-doc-shadow)">
        <rect x="10" y="8" width="34" height="46" rx="2" fill="url(#reading-paper-gradient)" />
        <rect x="10" y="8" width="34" height="46" rx="2" fill="url(#reading-paper-highlight)" />

        {/* Folded corner */}
        <path d="M 38 8 L 44 8 L 44 14 Z" fill="#065f46" opacity="0.6" />
        <path d="M 38 8 L 44 14 L 38 14 Z" fill="#6ee7b7" opacity="0.4" />

        {/* Title line */}
        <rect x="15" y="14" width="20" height="2.2" rx="1" fill="#ffffff" opacity="0.9" />

        {/* Highlighted passage line */}
        <rect x="14" y="20" width="26" height="3.2" rx="1" fill="url(#reading-highlight-band)" opacity="0.9" />
        <rect x="14" y="20" width="26" height="3.2" rx="1" fill="none" />

        {/* Regular text lines */}
        <rect x="14" y="26" width="24" height="1.4" rx="0.5" fill="#d1fae5" opacity="0.85" />
        <rect x="14" y="29" width="22" height="1.4" rx="0.5" fill="#d1fae5" opacity="0.8" />
        <rect x="14" y="32" width="25" height="1.4" rx="0.5" fill="#a7f3d0" opacity="0.75" />
        <rect x="14" y="35" width="20" height="1.4" rx="0.5" fill="#a7f3d0" opacity="0.7" />
        <rect x="14" y="40" width="23" height="1.4" rx="0.5" fill="#6ee7b7" opacity="0.7" />
        <rect x="14" y="43" width="19" height="1.4" rx="0.5" fill="#6ee7b7" opacity="0.65" />
        <rect x="14" y="46" width="21" height="1.4" rx="0.5" fill="#6ee7b7" opacity="0.6" />

        {/* Magnifier-like underline near highlighted passage */}
        <rect x="14" y="23.6" width="20" height="0.8" rx="0.4" fill="#b45309" opacity="0.5" />
      </g>

      {/* Clock badge (timer) */}
      <g filter="url(#reading-clock-shadow)">
        <circle cx="47" cy="46" r="12" fill="url(#reading-clock-gradient)" />
        <circle cx="47" cy="46" r="12" fill="#ffffff" opacity="0.08" />
        {/* Clock face */}
        <circle cx="47" cy="46" r="8.5" fill="#fff5f5" opacity="0.95" />
        {/* Clock hands */}
        <rect x="46.4" y="40" width="1.2" height="6.5" rx="0.6" fill="#b91c1c" />
        <rect x="47" y="45.4" width="4.5" height="1.2" rx="0.6" fill="#b91c1c" transform="rotate(20, 47, 46)" />
        <circle cx="47" cy="46" r="1" fill="#7f1d1d" />
        {/* Ticks */}
        <circle cx="47" cy="38.5" r="0.5" fill="#dc2626" />
        <circle cx="55" cy="46" r="0.5" fill="#dc2626" />
        <circle cx="47" cy="53.5" r="0.5" fill="#dc2626" />
        <circle cx="39" cy="46" r="0.5" fill="#dc2626" />
        {/* Highlight */}
        <path d="M 40 40 A 10 10 0 0 1 50 37" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" fill="none" />
      </g>

      {/* Decorative sparkles */}
      <g opacity="0.5">
        <circle cx="8" cy="52" r="1" fill="#34d399" />
        <circle cx="50" cy="12" r="0.9" fill="#fde047" />
        <circle cx="6" cy="14" r="0.8" fill="#a7f3d0" />
      </g>
    </svg>
  );
};
