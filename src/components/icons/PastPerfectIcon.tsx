import React from 'react';

interface IconProps {
  className?: string;
}

export const PastPerfectIcon: React.FC<IconProps> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Past Perfect"
    >
      <defs>
        <linearGradient id="ppf-track-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>
        <linearGradient id="ppf-marker1-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f472b6" />
          <stop offset="100%" stopColor="#be185d" />
        </linearGradient>
        <linearGradient id="ppf-marker2-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#5b21b6" />
        </linearGradient>
        <radialGradient id="ppf-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#c084fc" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#c084fc" stopOpacity="0" />
        </radialGradient>
        <filter id="ppf-shadow">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.3" />
        </filter>
      </defs>

      <circle cx="32" cy="32" r="26" fill="url(#ppf-glow)" />

      <g filter="url(#ppf-shadow)">
        {/* Isometric timeline track (3D ribbon receding into distance) */}
        <path
          d="M 6 46 L 22 40 L 58 26 L 58 32 L 22 46 L 6 52 Z"
          fill="url(#ppf-track-gradient)"
        />
        <path
          d="M 6 46 L 22 40 L 22 46 L 6 52 Z"
          fill="#8b5cf6"
          opacity="0.7"
        />

        {/* Tick marks along the track */}
        <rect x="14" y="44" width="1.6" height="5" fill="#4c1d95" opacity="0.5" transform="rotate(-14 14 44)" />
        <rect x="30" y="37" width="1.6" height="5" fill="#4c1d95" opacity="0.5" transform="rotate(-14 30 37)" />
        <rect x="46" y="30" width="1.6" height="5" fill="#4c1d95" opacity="0.5" transform="rotate(-14 46 30)" />

        {/* Marker further back (earlier past - smaller, distant) */}
        <g transform="translate(46,20)">
          <rect x="-1" y="-14" width="2" height="14" fill="#5b21b6" />
          <path d="M 1 -14 L 11 -11 L 1 -8 Z" fill="url(#ppf-marker2-gradient)" />
          <ellipse cx="0" cy="0" rx="4" ry="1.4" fill="#4c1d95" opacity="0.4" />
        </g>

        {/* Marker closer (simple past - larger, nearer) */}
        <g transform="translate(16,38)">
          <rect x="-1.4" y="-20" width="2.8" height="20" fill="#831843" />
          <path d="M 1.4 -20 L 15 -15.5 L 1.4 -11 Z" fill="url(#ppf-marker1-gradient)" />
          <ellipse cx="0" cy="0" rx="6" ry="2" fill="#581c47" opacity="0.4" />
        </g>

        {/* Highlight overlay */}
        <path d="M 22 40 L 58 26 L 58 28 L 22 42 Z" fill="#ffffff" opacity="0.25" />
      </g>

      {/* Decorative sparkles */}
      <circle cx="52" cy="14" r="1" fill="#f472b6" opacity="0.5" />
      <circle cx="10" cy="20" r="0.9" fill="#c4b5fd" opacity="0.4" />
      <circle cx="58" cy="44" r="1.1" fill="#a78bfa" opacity="0.4" />
    </svg>
  );
};
