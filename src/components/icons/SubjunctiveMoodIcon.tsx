import React from 'react';

interface IconProps {
  className?: string;
}

export const SubjunctiveMoodIcon: React.FC<IconProps> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Subjunctive Mood"
    >
      <defs>
        {/* Gradient for lamp body (deep gold/bronze) */}
        <linearGradient id="sm-lamp-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#a16207" />
        </linearGradient>
        <linearGradient id="sm-lamp-side" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ca8a04" />
          <stop offset="100%" stopColor="#713f12" />
        </linearGradient>

        {/* Gradient for magical smoke/wish bubble (purple-teal) */}
        <radialGradient id="sm-wish-gradient" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#a5f3fc" stopOpacity="0.9" />
          <stop offset="55%" stopColor="#67e8f9" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.5" />
        </radialGradient>

        {/* Gradient for lamp spout glow */}
        <radialGradient id="sm-glow-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef9c3" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#fde047" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="sm-highlight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        <filter id="sm-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Background glow */}
      <circle cx="30" cy="30" r="28" fill="#ede9fe" opacity="0.3" />

      {/* Floating wish bubble emerging from lamp spout */}
      <g filter="url(#sm-shadow)">
        <circle cx="45" cy="16" r="12" fill="url(#sm-wish-gradient)" />
        <ellipse cx="41" cy="12" rx="3" ry="1.8" fill="#ffffff" opacity="0.5" transform="rotate(-20 41 12)" />
        {/* Small star inside wish bubble */}
        <path
          d="M 45 10 L 46.4 13.8 L 50.4 13.8 L 47.2 16.2 L 48.4 20 L 45 17.7 L 41.6 20 L 42.8 16.2 L 39.6 13.8 L 43.6 13.8 Z"
          fill="#fefce8"
          opacity="0.9"
        />
      </g>

      {/* Trailing magic smoke dots connecting lamp to bubble */}
      <g opacity="0.6">
        <circle cx="37" cy="26" r="2.6" fill="#a5f3fc" />
        <circle cx="40" cy="21" r="1.8" fill="#67e8f9" />
      </g>

      {/* 3D genie lamp body */}
      <g filter="url(#sm-shadow)">
        {/* Base */}
        <ellipse cx="24" cy="52" rx="16" ry="3.5" fill="#78350f" opacity="0.5" />

        {/* Lamp side (depth) */}
        <path d="M 10 38 Q 8 48 14 52 L 34 52 Q 40 48 38 38 Z" fill="url(#sm-lamp-side)" />

        {/* Lamp body front */}
        <path
          d="M 8 36 Q 6 48 14 52 L 32 52 Q 40 48 38 36 Q 34 30 24 30 Q 12 30 8 36 Z"
          fill="url(#sm-lamp-gradient)"
        />
        <path
          d="M 8 36 Q 6 48 14 52 L 32 52 Q 40 48 38 36 Q 34 30 24 30 Q 12 30 8 36 Z"
          fill="url(#sm-highlight)"
        />

        {/* Lamp lid knob */}
        <ellipse cx="24" cy="29" rx="6" ry="2.5" fill="#ca8a04" />
        <circle cx="24" cy="26" r="2.5" fill="#fde047" />

        {/* Lamp spout */}
        <path d="M 36 34 Q 44 30 46 24 L 42 22 Q 38 28 32 32 Z" fill="url(#sm-lamp-gradient)" />
        <path d="M 36 34 Q 44 30 46 24 L 42 22 Q 38 28 32 32 Z" fill="url(#sm-highlight)" />

        {/* Glow at spout tip */}
        <circle cx="43" cy="23" r="6" fill="url(#sm-glow-gradient)" />

        {/* Decorative lamp band */}
        <rect x="10" y="42" width="28" height="2" rx="1" fill="#713f12" opacity="0.6" />
      </g>

      {/* Decorative sparkles */}
      <g opacity="0.5">
        <circle cx="6" cy="14" r="1" fill="#fde68a" />
        <circle cx="56" cy="46" r="1.1" fill="#c4b5fd" />
        <circle cx="16" cy="8" r="0.8" fill="#a5f3fc" />
        <circle cx="52" cy="30" r="0.9" fill="#67e8f9" />
      </g>
    </svg>
  );
};
