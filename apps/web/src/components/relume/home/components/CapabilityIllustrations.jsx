'use client';

import { useNoaColors } from '@/hooks/use-noa-colors';

/** Monochrome enterprise identity network — matches light/dark tokens */
export function SingleIdentityArt() {
  const c = useNoaColors();
  const line = `color-mix(in srgb, ${c.ink} 22%, transparent)`;
  const fill = `color-mix(in srgb, ${c.ink} 8%, ${c.surface})`;
  const accent = c.accent;
  const glow = `color-mix(in srgb, ${c.accent} 35%, transparent)`;

  return (
    <svg
      className="capability-card__svg"
      viewBox="0 0 400 280"
      fill="none"
      aria-hidden="true"
    >
      <rect width="400" height="280" fill={`color-mix(in srgb, ${c.surfaceAlt} 88%, ${c.mist})`} />
      <rect x="0" y="200" width="400" height="80" fill={`color-mix(in srgb, ${c.ink} 5%, transparent)`} />

      {/* City silhouette */}
      {[40, 70, 110, 150, 190, 230, 280, 320, 350].map((x, i) => (
        <rect
          key={x}
          x={x}
          y={168 - (i % 4) * 14}
          width={18 + (i % 3) * 8}
          height={32 + (i % 5) * 10}
          fill={`color-mix(in srgb, ${c.ink} ${10 + (i % 4) * 3}%, transparent)`}
          rx="1"
        />
      ))}

      {/* Desk + monitor */}
      <rect x="118" y="178" width="164" height="8" rx="2" fill={fill} stroke={line} strokeWidth="1" />
      <rect x="138" y="92" width="124" height="86" rx="6" fill={c.surface} stroke={line} strokeWidth="1.2" />
      <rect x="148" y="102" width="104" height="66" rx="4" fill={`color-mix(in srgb, ${c.ink} 6%, ${c.surface})`} />

      {/* Network on screen */}
      <circle cx="200" cy="128" r="10" fill={accent} opacity="0.9" />
      <circle cx="200" cy="128" r="16" stroke={glow} strokeWidth="1.5" />
      {[
        [168, 118],
        [232, 118],
        [172, 148],
        [228, 148],
      ].map(([cx, cy]) => (
        <g key={`${cx}-${cy}`}>
          <line x1="200" y1="128" x2={cx} y2={cy} stroke={line} strokeWidth="1" />
          <rect x={cx - 6} y={cy - 5} width="12" height="10" rx="1.5" fill={fill} stroke={accent} strokeWidth="0.8" />
        </g>
      ))}

      {/* Figure */}
      <circle cx="200" cy="168" r="9" fill={fill} stroke={line} />
      <path
        d="M 186 178 Q 200 172 214 178 L 220 196 L 180 196 Z"
        fill={`color-mix(in srgb, ${c.ink} 12%, ${c.surface})`}
        stroke={line}
        strokeWidth="0.8"
      />
    </svg>
  );
}

/** Wallet pass on device — monochrome, security-forward */
export function CredentialWalletArt() {
  const c = useNoaColors();
  const line = `color-mix(in srgb, ${c.ink} 22%, transparent)`;
  const fill = `color-mix(in srgb, ${c.ink} 8%, ${c.surface})`;
  const accent = c.accent;

  return (
    <svg
      className="capability-card__svg"
      viewBox="0 0 400 280"
      fill="none"
      aria-hidden="true"
    >
      <rect width="400" height="280" fill={`color-mix(in srgb, ${c.surfaceAlt} 88%, ${c.mist})`} />

      {/* Shield / lock motif */}
      <path
        d="M 200 48 L 228 62 V 98 Q 228 128 200 142 Q 172 128 172 98 V 62 Z"
        fill={`color-mix(in srgb, ${c.accent} 8%, ${c.surface})`}
        stroke={line}
        strokeWidth="1.2"
      />
      <rect x="194" y="88" width="12" height="14" rx="2" fill={accent} opacity="0.85" />
      <circle cx="200" cy="84" r="5" stroke={accent} strokeWidth="1.5" fill="none" />

      {/* Hand + phone */}
      <ellipse cx="200" cy="218" rx="72" ry="18" fill={`color-mix(in srgb, ${c.ink} 8%, transparent)`} />
      <rect x="158" y="118" width="84" height="148" rx="14" fill={c.surface} stroke={line} strokeWidth="1.5" />
      <rect x="166" y="126" width="68" height="132" rx="10" fill={`color-mix(in srgb, ${c.ink} 5%, ${c.surfaceAlt})`} />

      {/* Wallet passes */}
      <rect x="174" y="142" width="52" height="28" rx="4" fill={accent} opacity="0.92" />
      <rect x="174" y="152" width="52" height="28" rx="4" fill={fill} stroke={line} strokeWidth="0.8" opacity="0.85" />
      <rect x="174" y="162" width="52" height="28" rx="4" fill={fill} stroke={line} strokeWidth="0.8" opacity="0.7" />
      <rect x="180" y="148" width="16" height="10" rx="2" fill={c.onAccent} opacity="0.35" />

      {/* NFC pulse */}
      <path
        d="M 218 198 Q 228 188 238 198"
        stroke={accent}
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M 212 198 Q 228 180 244 198"
        stroke={accent}
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.35"
      />
    </svg>
  );
}
