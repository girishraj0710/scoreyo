import React from 'react';

interface IconProps {
  className?: string;
}

export const PuzzleCollocationIcon: React.FC<IconProps> = ({ className = '' }) => {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Collocations and Register">
      <defs>
        <linearGradient id="cr-magenta" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F783AC" />
          <stop offset="100%" stopColor="#C2255C" />
        </linearGradient>
        <linearGradient id="cr-magentaDark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#A61E4D" />
          <stop offset="100%" stopColor="#6E1339" />
        </linearGradient>
        <linearGradient id="cr-yellow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFE066" />
          <stop offset="100%" stopColor="#F08C00" />
        </linearGradient>
        <linearGradient id="cr-yellowDark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E8590C" />
          <stop offset="100%" stopColor="#A3410A" />
        </linearGradient>
        <radialGradient id="cr-socket" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#A3410A" />
          <stop offset="100%" stopColor="#7A2E0A" />
        </radialGradient>
        <filter id="cr-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.6" floodColor="#4A0F2C" floodOpacity="0.35" />
        </filter>
      </defs>

      <ellipse cx="30" cy="54" rx="22" ry="3.6" fill="#4A0F2C" opacity="0.2" />

      <g filter="url(#cr-shadow)">
        <rect x="33" y="20" width="20" height="22" rx="3" fill="url(#cr-yellowDark)" />
        <rect x="30" y="17" width="20" height="22" rx="3" fill="url(#cr-yellow)" />
        <circle cx="30" cy="28" r="6" fill="url(#cr-socket)" />

        <rect x="9" y="19" width="20" height="22" rx="3" fill="url(#cr-magentaDark)" />
        <rect x="6" y="16" width="20" height="22" rx="3" fill="url(#cr-magenta)" />
        <circle cx="26" cy="27" r="5.4" fill="url(#cr-magenta)" />
      </g>

      <rect x="6" y="16" width="20" height="4" rx="2" fill="#FFFFFF" opacity="0.3" />
      <rect x="30" y="17" width="20" height="4" rx="2" fill="#FFFFFF" opacity="0.3" />

      <circle cx="14" cy="46" r="1.3" fill="#FFC9DE" opacity="0.7" />
      <circle cx="46" cy="46" r="1" fill="#FFE8A3" opacity="0.7" />
      <circle cx="52" cy="14" r="0.9" fill="#FFF3BF" opacity="0.6" />
    </svg>
  );
};
