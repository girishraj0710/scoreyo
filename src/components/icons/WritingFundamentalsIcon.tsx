import React from 'react';

interface IconProps {
  className?: string;
}

export const WritingFundamentalsIcon: React.FC<IconProps> = ({ className = '' }) => {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Writing Fundamentals">
      <defs>
        <linearGradient id="wfPageBack" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#BAE6FD" />
          <stop offset="100%" stopColor="#7DD3FC" />
        </linearGradient>
        <linearGradient id="wfPageFront" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F0FDFA" />
          <stop offset="100%" stopColor="#CCFBF1" />
        </linearGradient>
        <linearGradient id="wfPenBody" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#22D3EE" />
          <stop offset="100%" stopColor="#1E3A8A" />
        </linearGradient>
        <linearGradient id="wfNib" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <linearGradient id="wfInk" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0D9488" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
        <filter id="wfShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.6" floodColor="#000" floodOpacity="0.26" />
        </filter>
      </defs>

      <ellipse cx="26" cy="56" rx="18" ry="3.5" fill="#000" opacity="0.15" />

      <g filter="url(#wfShadow)">
        {/* stacked notepad */}
        <rect x="6" y="31" width="36" height="23" rx="2" fill="url(#wfPageBack)" transform="rotate(-4 24 42)" />
        <rect x="9" y="29" width="36" height="23" rx="2" fill="url(#wfPageFront)" />

        {/* text lines */}
        <rect x="13" y="35" width="22" height="1.6" rx="0.8" fill="#0D9488" opacity="0.28" />
        <rect x="13" y="40" width="20" height="1.6" rx="0.8" fill="#0D9488" opacity="0.28" />
        <rect x="13" y="45" width="16" height="1.6" rx="0.8" fill="#0D9488" opacity="0.28" />

        {/* ink trail */}
        <path d="M24,47 Q32,44 40,47 T54,42" stroke="url(#wfInk)" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.85" />

        {/* pen */}
        <g transform="rotate(-42 24 44)">
          <rect x="21" y="6" width="7" height="32" rx="3.5" fill="url(#wfPenBody)" />
          <rect x="21" y="11" width="7" height="3" fill="#0C4A6E" opacity="0.5" />
          <polygon points="21,38 28,38 24.5,48" fill="url(#wfNib)" />
          <circle cx="24.5" cy="41" r="1" fill="#78350F" />
        </g>

        {/* highlight */}
        <ellipse cx="16" cy="33" rx="7" ry="3" fill="#FFFFFF" opacity="0.3" />
      </g>

      {/* sparkles */}
      <circle cx="52" cy="14" r="1.3" fill="#FFFFFF" opacity="0.5" />
      <circle cx="58" cy="26" r="1" fill="#FFFFFF" opacity="0.4" />
      <circle cx="46" cy="8" r="0.9" fill="#FFFFFF" opacity="0.45" />
    </svg>
  );
};
