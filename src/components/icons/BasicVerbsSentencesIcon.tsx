import React from 'react';

interface IconProps {
  className?: string;
}

export const BasicVerbsSentencesIcon: React.FC<IconProps> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Basic Verbs and Sentence Structure"
    >
      <defs>
        <linearGradient id="blk-subject-top" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <linearGradient id="blk-subject-front" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id="blk-verb-top" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fca5a5" />
          <stop offset="100%" stopColor="#dc2626" />
        </linearGradient>
        <linearGradient id="blk-verb-front" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>
        <linearGradient id="blk-object-top" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="100%" stopColor="#16a34a" />
        </linearGradient>
        <linearGradient id="blk-object-front" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#15803d" />
        </linearGradient>
        <filter id="blk-shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodOpacity="0.3" />
        </filter>
      </defs>

      <ellipse cx="32" cy="52" rx="26" ry="3" fill="#1e3a8a" opacity="0.2" />

      {/* Subject block */}
      <g filter="url(#blk-shadow)">
        <path d="M 6 24 L 16 20 L 26 24 L 16 28 Z" fill="url(#blk-subject-top)" />
        <path d="M 6 24 L 6 38 L 16 42 L 16 28 Z" fill="url(#blk-subject-front)" />
        <path d="M 26 24 L 26 38 L 16 42 L 16 28 Z" fill="url(#blk-subject-front)" opacity="0.75" />
        {/* puzzle knob connecting to verb */}
        <circle cx="26" cy="31" r="3.2" fill="url(#blk-subject-front)" />
        <rect x="7" y="25" width="1" height="10" fill="#dbeafe" opacity="0.5" />
      </g>

      {/* Verb block */}
      <g filter="url(#blk-shadow)">
        <path d="M 26 22 L 36 18 L 46 22 L 36 26 Z" fill="url(#blk-verb-top)" />
        <path d="M 26 22 L 26 36 L 36 40 L 36 26 Z" fill="url(#blk-verb-front)" />
        <path d="M 46 22 L 46 36 L 36 40 L 36 26 Z" fill="url(#blk-verb-front)" opacity="0.75" />
        {/* puzzle socket for subject */}
        <circle cx="26" cy="29" r="3.2" fill="url(#blk-verb-front)" />
        {/* puzzle knob connecting to object */}
        <circle cx="46" cy="29" r="3.2" fill="url(#blk-verb-front)" />
        <rect x="27" y="23" width="1" height="10" fill="#fee2e2" opacity="0.5" />
      </g>

      {/* Object block */}
      <g filter="url(#blk-shadow)">
        <path d="M 46 24 L 56 20 L 66 24 L 56 28 Z" fill="url(#blk-object-top)" transform="translate(-8,0)" />
        <path d="M 38 24 L 48 20 L 58 24 L 48 28 Z" fill="url(#blk-object-top)" />
        <path d="M 38 24 L 38 38 L 48 42 L 48 28 Z" fill="url(#blk-object-front)" />
        <path d="M 58 24 L 58 38 L 48 42 L 48 28 Z" fill="url(#blk-object-front)" opacity="0.75" />
        <circle cx="38" cy="31" r="3.2" fill="url(#blk-object-front)" />
        <rect x="39" y="25" width="1" height="10" fill="#dcfce7" opacity="0.5" />
      </g>

      {/* Highlight overlay */}
      <path d="M 6 24 L 16 20 L 16 24 L 8 27 Z" fill="#ffffff" opacity="0.25" />

      {/* Sparkles */}
      <g opacity="0.55">
        <circle cx="12" cy="12" r="1" fill="#93c5fd" />
        <circle cx="36" cy="10" r="1.1" fill="#fca5a5" />
        <circle cx="58" cy="14" r="0.9" fill="#86efac" />
      </g>
    </svg>
  );
};
