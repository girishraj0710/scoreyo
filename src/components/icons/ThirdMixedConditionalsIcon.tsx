import React from 'react';

interface IconProps {
  className?: string;
}

export const ThirdMixedConditionalsIcon: React.FC<IconProps> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Third and Mixed Conditionals"
    >
      <defs>
        {/* Gradient for the road/fork (slate) */}
        <linearGradient id="tmc-road-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>

        {/* Path A (teal - path taken) */}
        <linearGradient id="tmc-path-a" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2dd4bf" />
          <stop offset="100%" stopColor="#0f766e" />
        </linearGradient>

        {/* Path B (amber - path not taken / regret) */}
        <linearGradient id="tmc-path-b" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fcd34d" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>

        {/* Mirror gradient (cool blue-grey glass) */}
        <radialGradient id="tmc-mirror-gradient" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#e0f2fe" />
          <stop offset="60%" stopColor="#7dd3fc" />
          <stop offset="100%" stopColor="#0369a1" />
        </radialGradient>

        <linearGradient id="tmc-frame-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>

        <linearGradient id="tmc-highlight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        <filter id="tmc-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Background glow */}
      <circle cx="32" cy="32" r="28" fill="#f1f5f9" opacity="0.4" />

      {/* Fork in the road - two diverging 3D paths */}
      <g filter="url(#tmc-shadow)">
        {/* Stem of the fork */}
        <path d="M 27 58 L 37 58 L 34 40 L 30 40 Z" fill="url(#tmc-road-gradient)" />
        <path d="M 30 40 L 34 40 L 32 34 L 32 34 Z" fill="url(#tmc-road-gradient)" />

        {/* Path A - diverging left (teal, taken path) */}
        <path d="M 32 36 L 8 14 L 14 10 L 34 32 Z" fill="url(#tmc-path-a)" />
        <path d="M 32 36 L 8 14 L 14 10 L 34 32 Z" fill="url(#tmc-highlight)" />

        {/* Path B - diverging right (amber, path not taken) */}
        <path d="M 34 32 L 54 12 L 60 16 L 36 36 Z" fill="url(#tmc-path-b)" />
        <path d="M 34 32 L 54 12 L 60 16 L 36 36 Z" fill="url(#tmc-highlight)" />

        {/* Center pivot node */}
        <circle cx="32" cy="35" r="3.5" fill="#334155" />
        <circle cx="32" cy="35" r="2" fill="#cbd5e1" />
      </g>

      {/* Small reflection/regret mirror hovering above path B (not taken) */}
      <g filter="url(#tmc-shadow)">
        <ellipse cx="52" cy="8" rx="8" ry="8" fill="url(#tmc-frame-gradient)" />
        <ellipse cx="52" cy="8" rx="6" ry="6" fill="url(#tmc-mirror-gradient)" />
        <ellipse cx="49.5" cy="5.5" rx="2.2" ry="1.2" fill="#ffffff" opacity="0.5" transform="rotate(-30 49.5 5.5)" />
        {/* Tiny reflected figure inside mirror representing "what could have been" */}
        <circle cx="52" cy="7" r="1.1" fill="#075985" opacity="0.7" />
        <path d="M 50.5 10 Q 52 8.5 53.5 10" stroke="#075985" strokeWidth="0.8" fill="none" opacity="0.7" strokeLinecap="round" />
      </g>

      {/* Endpoint markers */}
      <circle cx="10" cy="11" r="2.5" fill="#134e4a" opacity="0.8" />
      <circle cx="57" cy="14" r="2.5" fill="#78350f" opacity="0.8" />

      {/* Decorative sparkles */}
      <g opacity="0.5">
        <circle cx="6" cy="30" r="1" fill="#5eead4" />
        <circle cx="58" cy="40" r="1.1" fill="#fde68a" />
        <circle cx="20" cy="52" r="0.8" fill="#94a3b8" />
      </g>
    </svg>
  );
};
