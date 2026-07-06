import React from 'react';

interface IconProps {
  className?: string;
}

export const BriefcaseReportIcon: React.FC<IconProps> = ({ className = '' }) => {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Report and Business Writing">
      <defs>
        <linearGradient id="rbw-caseFront" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#495057" />
          <stop offset="100%" stopColor="#212529" />
        </linearGradient>
        <linearGradient id="rbw-caseTop" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#868E96" />
          <stop offset="100%" stopColor="#495057" />
        </linearGradient>
        <linearGradient id="rbw-caseSide" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#343A40" />
          <stop offset="100%" stopColor="#16181B" />
        </linearGradient>
        <linearGradient id="rbw-clip" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F1F3F5" />
          <stop offset="100%" stopColor="#CED4DA" />
        </linearGradient>
        <linearGradient id="rbw-bar1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFA94D" />
          <stop offset="100%" stopColor="#E8590C" />
        </linearGradient>
        <linearGradient id="rbw-bar2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#99E9F2" />
          <stop offset="100%" stopColor="#0C8599" />
        </linearGradient>
        <linearGradient id="rbw-bar3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFE066" />
          <stop offset="100%" stopColor="#F08C00" />
        </linearGradient>
        <filter id="rbw-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.6" floodColor="#0B0C0E" floodOpacity="0.35" />
        </filter>
      </defs>

      <ellipse cx="30" cy="56" rx="22" ry="3.6" fill="#0B0C0E" opacity="0.2" />

      <g filter="url(#rbw-shadow)">
        <rect x="6" y="30" width="10" height="6" rx="2" fill="none" stroke="url(#rbw-caseSide)" strokeWidth="2.6" />
        <polygon points="10,26 34,26 40,22 16,22" fill="url(#rbw-caseTop)" />
        <rect x="10" y="26" width="24" height="20" fill="url(#rbw-caseFront)" />
        <polygon points="34,26 34,46 40,42 40,22" fill="url(#rbw-caseSide)" />
        <rect x="19" y="30" width="6" height="4" rx="1" fill="#868E96" />

        <g transform="translate(30,6)">
          <rect x="0" y="4" width="18" height="24" rx="2" fill="url(#rbw-clip)" />
          <rect x="5" y="0" width="8" height="5" rx="1.5" fill="#ADB5BD" />
          <rect x="3" y="10" width="12" height="1.6" fill="#868E96" />
          <rect x="3" y="14" width="9" height="1.6" fill="#868E96" />

          <rect x="3" y="20" width="3" height="6" fill="url(#rbw-bar2)" />
          <rect x="7.5" y="16" width="3" height="10" fill="url(#rbw-bar1)" />
          <rect x="12" y="18" width="3" height="8" fill="url(#rbw-bar3)" />
        </g>
      </g>

      <polygon points="10,26 34,26 34,28 10,28" fill="#FFFFFF" opacity="0.25" />
      <rect x="30" y="10" width="18" height="4" fill="#FFFFFF" opacity="0.25" />

      <circle cx="52" cy="40" r="1.3" fill="#99E9F2" opacity="0.7" />
      <circle cx="8" cy="16" r="1" fill="#ADB5BD" opacity="0.6" />
      <circle cx="46" cy="52" r="0.9" fill="#FFE066" opacity="0.6" />
    </svg>
  );
};
