import React from 'react';

interface IconProps {
  className?: string;
}

export const ClockKeyringIcon: React.FC<IconProps> = ({ className = '' }) => {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Past Modals and Nuances">
      <defs>
        <radialGradient id="pmn-face" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#E7ECFF" />
          <stop offset="55%" stopColor="#748FFC" />
          <stop offset="100%" stopColor="#3B5BDB" />
        </radialGradient>
        <linearGradient id="pmn-rim" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1E2A78" />
          <stop offset="100%" stopColor="#0B1550" />
        </linearGradient>
        <linearGradient id="pmn-ring" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ADB5BD" />
          <stop offset="100%" stopColor="#495057" />
        </linearGradient>
        <linearGradient id="pmn-goldKey" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFE066" />
          <stop offset="100%" stopColor="#E8A200" />
        </linearGradient>
        <linearGradient id="pmn-purpleKey" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D0BFFF" />
          <stop offset="100%" stopColor="#7048E8" />
        </linearGradient>
        <linearGradient id="pmn-tealKey" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#99E9F2" />
          <stop offset="100%" stopColor="#0C8599" />
        </linearGradient>
        <filter id="pmn-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="1.8" floodColor="#0B1550" floodOpacity="0.4" />
        </filter>
      </defs>

      <ellipse cx="30" cy="56" rx="20" ry="3.6" fill="#0B1550" opacity="0.2" />

      <g filter="url(#pmn-shadow)">
        <circle cx="27" cy="35" r="17" fill="url(#pmn-rim)" />
        <circle cx="27" cy="32" r="17" fill="url(#pmn-rim)" />
        <circle cx="27" cy="32" r="13.5" fill="url(#pmn-face)" />

        <circle cx="27" cy="32" r="1.6" fill="#1E2A78" />
        <line x1="27" y1="32" x2="27" y2="23" stroke="#1E2A78" strokeWidth="2" strokeLinecap="round" />
        <line x1="27" y1="32" x2="33" y2="35" stroke="#1E2A78" strokeWidth="2" strokeLinecap="round" />

        <path d="M27 15 C27 10 30 7 35 6" stroke="url(#pmn-ring)" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        <circle cx="37" cy="6" r="5" fill="none" stroke="url(#pmn-ring)" strokeWidth="2.6" />

        <g transform="translate(37,10)">
          <rect x="-1.6" y="0" width="3.2" height="12" rx="1" fill="url(#pmn-goldKey)" />
          <circle cx="0" cy="16" r="5.5" fill="none" stroke="url(#pmn-goldKey)" strokeWidth="3" />
          <rect x="-1.6" y="10" width="4.5" height="2" fill="url(#pmn-goldKey)" />
        </g>
        <g transform="translate(45,12) rotate(14)">
          <rect x="-1.4" y="0" width="2.8" height="14" rx="1" fill="url(#pmn-purpleKey)" />
          <circle cx="0" cy="18" r="5" fill="none" stroke="url(#pmn-purpleKey)" strokeWidth="2.8" />
          <rect x="-1.4" y="11" width="4" height="1.8" fill="url(#pmn-purpleKey)" />
        </g>
        <g transform="translate(30,13) rotate(-18)">
          <rect x="-1.4" y="0" width="2.8" height="10" rx="1" fill="url(#pmn-tealKey)" />
          <circle cx="0" cy="13" r="4.2" fill="none" stroke="url(#pmn-tealKey)" strokeWidth="2.4" />
        </g>
      </g>

      <path d="M17 22 A13.5 13.5 0 0 1 27 18.5" stroke="#FFFFFF" strokeWidth="2.2" opacity="0.35" fill="none" strokeLinecap="round" />

      <circle cx="50" cy="24" r="1.3" fill="#E7ECFF" opacity="0.7" />
      <circle cx="10" cy="20" r="1" fill="#D0BFFF" opacity="0.6" />
      <circle cx="14" cy="48" r="0.9" fill="#99E9F2" opacity="0.6" />
    </svg>
  );
};
