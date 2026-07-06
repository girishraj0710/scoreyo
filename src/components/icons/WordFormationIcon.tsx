import React from 'react';

interface IconProps {
  className?: string;
}

export const WordFormationIcon: React.FC<IconProps> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Word Formation"
    >
      <defs>
        <linearGradient id="gear-root-top" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="100%" stopColor="#0891b2" />
        </linearGradient>
        <linearGradient id="gear-root-front" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#0e7490" />
        </linearGradient>
        <linearGradient id="gear-prefix-top" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbcfe8" />
          <stop offset="100%" stopColor="#db2777" />
        </linearGradient>
        <linearGradient id="gear-prefix-front" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f472b6" />
          <stop offset="100%" stopColor="#be185d" />
        </linearGradient>
        <linearGradient id="gear-suffix-top" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="gear-suffix-front" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        <filter id="gear-shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodOpacity="0.3" />
        </filter>
      </defs>

      <ellipse cx="32" cy="56" rx="24" ry="3" fill="#164e63" opacity="0.2" />

      {/* Prefix gear (small, left) */}
      <g filter="url(#gear-shadow)">
        <path d="M 8 30 l 2 -3 l 3 0.5 l 1.5 2.8 l 3 0.5 l 0 3.4 l -3 0.5 l -1.5 2.8 l -3 0.5 l -2 -3 l -2.5 -1.5 l 0 -2.6 Z" fill="url(#gear-prefix-top)" />
        <circle cx="14" cy="32" r="3.5" fill="url(#gear-prefix-front)" />
        <circle cx="14" cy="32" r="1.4" fill="#500724" opacity="0.4" />
      </g>

      {/* Root gear (large, center) */}
      <g filter="url(#gear-shadow)">
        <path d="M 32 16 l 3 -4 l 4 1 l 2 4 l 4 1 l 0 4.6 l -4 1 l -2 4 l -4 1 l -3 -4 l -4 -2 l 0 -4.6 Z" fill="url(#gear-root-top)" />
        <circle cx="32" cy="32" r="12" fill="url(#gear-root-top)" />
        <circle cx="32" cy="33" r="12" fill="url(#gear-root-front)" opacity="0.6" />
        <circle cx="32" cy="32" r="5" fill="#083344" opacity="0.4" />
        <circle cx="29" cy="29" r="3" fill="#ffffff" opacity="0.25" />
      </g>

      {/* Suffix gear (medium, right) */}
      <g filter="url(#gear-shadow)">
        <path d="M 48 40 l 2.5 -3.5 l 3.5 0.7 l 2 3.3 l 3.5 0.7 l 0 4 l -3.5 0.7 l -2 3.3 l -3.5 0.7 l -2.5 -3.5 l -3 -1.7 l 0 -3 Z" fill="url(#gear-suffix-top)" />
        <circle cx="52" cy="42" r="6" fill="url(#gear-suffix-front)" />
        <circle cx="52" cy="42" r="2.4" fill="#78350f" opacity="0.4" />
      </g>

      {/* Sparkles */}
      <g opacity="0.55">
        <circle cx="10" cy="14" r="1" fill="#67e8f9" />
        <circle cx="56" cy="16" r="1.1" fill="#fde68a" />
        <circle cx="6" cy="48" r="0.8" fill="#fbcfe8" />
      </g>
    </svg>
  );
};
