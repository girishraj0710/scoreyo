import React from 'react';

interface IconProps {
  className?: string;
}

export const ConjunctionsConnectorsIcon: React.FC<IconProps> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Conjunctions and Connectors"
    >
      <defs>
        <linearGradient id="conj-platform-top" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fdba74" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
        <linearGradient id="conj-platform-front" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#c2410c" />
        </linearGradient>
        <linearGradient id="conj-link-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
        <linearGradient id="conj-link-shadow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#a16207" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#713f12" stopOpacity="0.5" />
        </linearGradient>
        <filter id="conj-shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodOpacity="0.35" />
        </filter>
      </defs>

      <ellipse cx="32" cy="56" rx="26" ry="3" fill="#78350f" opacity="0.2" />

      {/* Left platform */}
      <g filter="url(#conj-shadow)">
        <path d="M 4 32 L 18 27 L 22 30 L 8 35 Z" fill="url(#conj-platform-top)" />
        <path d="M 4 32 L 4 42 L 8 45 L 8 35 Z" fill="url(#conj-platform-front)" />
        <path d="M 22 30 L 22 40 L 8 45 L 8 35 Z" fill="url(#conj-platform-front)" opacity="0.85" />
        <rect x="6" y="33" width="1" height="8" fill="#ffedd5" opacity="0.5" />
      </g>

      {/* Right platform */}
      <g filter="url(#conj-shadow)">
        <path d="M 42 30 L 46 27 L 60 32 L 56 35 Z" fill="url(#conj-platform-top)" />
        <path d="M 56 35 L 56 45 L 60 42 L 60 32 Z" fill="url(#conj-platform-front)" />
        <path d="M 42 30 L 42 40 L 56 45 L 56 35 Z" fill="url(#conj-platform-front)" opacity="0.85" />
        <rect x="44" y="32" width="1" height="8" fill="#ffedd5" opacity="0.5" />
      </g>

      {/* Chain bridge connecting them */}
      <g filter="url(#conj-shadow)">
        {[0,1,2,3,4].map((i) => (
          <g key={i} transform={`translate(${20 + i * 6}, ${37 - Math.abs(2 - i) * 1.2})`}>
            <ellipse cx="0" cy="0" rx="3.6" ry="2.6" fill="none" stroke="url(#conj-link-gradient)" strokeWidth="2.2" />
            <ellipse cx="0" cy="0.6" rx="3.6" ry="2.6" fill="none" stroke="url(#conj-link-shadow)" strokeWidth="0.8" opacity="0.5" />
          </g>
        ))}
      </g>

      {/* Highlight overlay */}
      <path d="M 4 32 L 18 27 L 20 28.5 L 8 33.5 Z" fill="#ffffff" opacity="0.25" />
      <path d="M 42 30 L 46 27 L 48 28.5 L 44 31.5 Z" fill="#ffffff" opacity="0.25" />

      {/* Sparkles */}
      <g opacity="0.55">
        <circle cx="10" cy="16" r="1" fill="#fde047" />
        <circle cx="54" cy="16" r="1.1" fill="#fdba74" />
        <circle cx="32" cy="14" r="0.9" fill="#fef9c3" />
      </g>
    </svg>
  );
};
