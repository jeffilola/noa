'use client';

import { useNoaColors } from '@/hooks/use-noa-colors';

function artBg(c) {
  return `color-mix(in srgb, ${c.surfaceAlt} 88%, ${c.mist})`;
}

function line(c, pct = 22) {
  return `color-mix(in srgb, ${c.ink} ${pct}%, transparent)`;
}

function fill(c, pct = 8) {
  return `color-mix(in srgb, ${c.ink} ${pct}%, ${c.surface})`;
}

/** Enterprise — corporate towers + access nodes */
export function EnterpriseSolutionArt() {
  const c = useNoaColors();
  const h = 220;

  return (
    <svg
      className="solution-tile__svg"
      viewBox="0 0 400 220"
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      <rect width="400" height={h} fill={artBg(c)} />
      {[48, 88, 128, 168, 208, 248, 288, 328].map((x, i) => (
        <rect
          key={x}
          x={x}
          y={h - 48 - (i % 5) * 22}
          width={22 + (i % 3) * 10}
          height={48 + (i % 4) * 28}
          fill={fill(c, 10 + (i % 3) * 4)}
          stroke={line(c, 18)}
          strokeWidth="0.8"
          rx="1"
        />
      ))}
      <circle cx="200" cy={h * 0.42} r="12" fill={c.accent} opacity="0.9" />
      <circle cx="200" cy={h * 0.42} r="20" stroke={line(c, 35)} strokeWidth="1.2" />
      {[140, 260].map((x) => (
        <g key={x}>
          <line x1="200" y1={h * 0.42} x2={x} y2={h * 0.52} stroke={line(c)} strokeWidth="1" />
          <rect x={x - 8} y={h * 0.5} width="16" height="12" rx="2" fill={fill(c)} stroke={c.accent} strokeWidth="0.8" />
        </g>
      ))}
    </svg>
  );
}

/** Hospitality — hotel / gym / events venue */
export function HospitalitySolutionArt() {
  const c = useNoaColors();
  const h = 220;

  return (
    <svg className="solution-tile__svg" viewBox={`0 0 400 ${h}`} fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      <rect width="400" height={h} fill={artBg(c)} />
      <path
        d={`M 80 ${h - 40} L 80 ${h - 120} L 200 ${h - 148} L 320 ${h - 120} L 320 ${h - 40} Z`}
        fill={fill(c, 10)}
        stroke={line(c)}
        strokeWidth="1"
      />
      <rect x="120" y={h - 88} width="48" height="48" rx="2" fill={fill(c, 6)} stroke={line(c, 14)} />
      <rect x="232" y={h - 88} width="48" height="48" rx="2" fill={fill(c, 6)} stroke={line(c, 14)} />
      <rect x="176" y={h - 72} width="48" height="64" rx="2" fill={c.accent} opacity="0.88" />
      <circle cx="200" cy={h - 118} r="6" fill={c.onAccent} opacity="0.5" />
      <path d={`M 160 ${h - 40} L 240 ${h - 40}`} stroke={line(c, 30)} strokeWidth="1.2" />
    </svg>
  );
}

/** Issuers — digital pass at the reader */
export function IssuerSolutionArt() {
  const c = useNoaColors();
  const h = 220;

  return (
    <svg className="solution-tile__svg" viewBox={`0 0 400 ${h}`} fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      <rect width="400" height={h} fill={artBg(c)} />
      <rect x="248" y={h - 130} width="56" height="90" rx="8" fill={fill(c)} stroke={line(c)} strokeWidth="1.2" />
      <rect x="256" y={h - 122} width="40" height="74" rx="4" fill={`color-mix(in srgb, ${c.ink} 5%, ${c.surfaceAlt})`} />
      <rect x="264" y={h - 108} width="24" height="14" rx="2" fill={c.accent} opacity="0.9" />

      <rect x="96" y={h - 108} width="72" height="112" rx="12" fill={c.surface} stroke={line(c)} strokeWidth="1.2" />
      <rect x="104" y={h - 100} width="56" height="96" rx="8" fill={`color-mix(in srgb, ${c.ink} 4%, ${c.surfaceAlt})`} />
      <rect x="112" y={h - 88} width="40" height="22" rx="3" fill={c.accent} />

      <path
        d={`M 168 ${h - 72} Q 208 ${h - 92} 248 ${h - 72}`}
        stroke={c.accent}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d={`M 168 ${h - 72} Q 208 ${h - 102} 248 ${h - 72}`}
        stroke={c.accent}
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.3"
      />
    </svg>
  );
}
