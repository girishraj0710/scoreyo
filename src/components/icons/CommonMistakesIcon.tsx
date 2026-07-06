import React from 'react';

interface IconProps {
  className?: string;
}

export const CommonMistakesIcon: React.FC<IconProps> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Common Mistakes"
    >
      <defs>
        {/* Gradients for warning triangle (amber/orange) */}
        <linearGradient id="cm-triangle-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="cm-triangle-side" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>
        <linearGradient id="cm-triangle-highlight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        {/* Gradient for cross-out X (red) */}
        <linearGradient id="cm-x-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="100%" stopColor="#dc2626" />
        </linearGradient>

        {/* Gradient for checkmark badge (green) */}
        <radialGradient id="cm-check-gradient" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#6ee7b7" />
          <stop offset="100%" stopColor="#059669" />
        </radialGradient>

        <filter id="cm-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.3" />
        </filter>
        <filter id="cm-small-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Background glow */}
      <circle cx="30" cy="30" r="27" fill="#fef3c7" opacity="0.3" />

      {/* 3D warning triangle */}
      <g filter="url(#cm-shadow)">
        {/* Side face (depth) */}
        <path d="M 30 10 L 52 46 L 34 50 Z" fill="url(#cm-triangle-side)" />

        {/* Front face */}
        <path
          d="M 28 10 L 6 46 L 50 46 Z"
          fill="url(#cm-triangle-gradient)"
          stroke="#92400e"
          strokeWidth="1"
          strokeLinejoin="round"
        />

        {/* Highlight overlay */}
        <path d="M 28 10 L 6 46 L 50 46 Z" fill="url(#cm-triangle-highlight)" />

        {/* Inner rounded rect for exclamation background */}
        <rect x="24" y="22" width="8" height="16" rx="3" fill="#78350f" opacity="0.15" />

        {/* Exclamation mark */}
        <rect x="26.5" y="20" width="3" height="12" rx="1.5" fill="#fffbeb" />
        <circle cx="28" cy="36" r="1.8" fill="#fffbeb" />
      </g>

      {/* Red X badge (top-left, the mistake) */}
      <g filter="url(#cm-small-shadow)">
        <circle cx="14" cy="16" r="8" fill="url(#cm-x-gradient)" />
        <circle cx="14" cy="16" r="8" fill="url(#cm-triangle-highlight)" />
        <line x1="10.5" y1="12.5" x2="17.5" y2="19.5" stroke="#fff5f5" strokeWidth="2" strokeLinecap="round" />
        <line x1="17.5" y1="12.5" x2="10.5" y2="19.5" stroke="#fff5f5" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Arrow from X to check */}
      <path
        d="M 20 18 Q 32 26 42 40"
        stroke="#a8a29e"
        strokeWidth="1.5"
        strokeDasharray="2 2"
        fill="none"
        opacity="0.5"
      />

      {/* Green checkmark badge (bottom-right, the correction) */}
      <g filter="url(#cm-small-shadow)">
        <circle cx="47" cy="46" r="9" fill="url(#cm-check-gradient)" />
        <circle cx="47" cy="46" r="9" fill="url(#cm-triangle-highlight)" />
        <path
          d="M 42.5 46.5 L 45.5 49.5 L 51.5 42.5"
          stroke="#ffffff"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>

      {/* Decorative sparkles */}
      <g opacity="0.5">
        <circle cx="8" cy="52" r="1" fill="#fde68a" />
        <circle cx="58" cy="20" r="1.1" fill="#6ee7b7" />
        <circle cx="52" cy="8" r="0.8" fill="#fca5a5" />
      </g>
    </svg>
  );
};
