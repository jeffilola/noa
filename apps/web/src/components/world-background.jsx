'use client';

import { usePathname } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState } from 'react';

/** Industry verticals positioned on the globe */
const VERTICALS = [
  { id: 'corporate', cx: 20, cy: 36, label: 'Corporate', type: 'corporate' },
  { id: 'hotel', cx: 38, cy: 20, label: 'Hotel', type: 'hotel' },
  { id: 'healthcare', cx: 58, cy: 28, label: 'Healthcare', type: 'healthcare' },
  { id: 'gym', cx: 82, cy: 34, label: 'Gym', type: 'gym' },
  { id: 'campus', cx: 78, cy: 62, label: 'Campus', type: 'campus' },
  { id: 'events', cx: 24, cy: 68, label: 'Events', type: 'events' },
];

const VERTICAL_BY_ID = Object.fromEntries(VERTICALS.map((v) => [v.id, v]));

/** Card visits each vertical in sequence */
const CARD_LOOP = ['corporate', 'hotel', 'healthcare', 'gym', 'campus', 'events', 'corporate'];

const PAGE_VERTICALS = [
  { id: 'corporate', short: 'Corporate' },
  { id: 'hotel', short: 'Hotel' },
  { id: 'healthcare', short: 'Healthcare' },
  { id: 'gym', short: 'Gym' },
  { id: 'campus', short: 'Campus' },
  { id: 'events', short: 'Events' },
];

function resolveRouteVertical(pathname) {
  if (pathname === '/') return 'corporate';
  if (pathname.startsWith('/about')) return 'healthcare';
  if (pathname.startsWith('/security')) return 'campus';
  if (pathname.startsWith('/contact')) return 'events';
  if (pathname.startsWith('/portal')) return 'hotel';
  if (pathname.startsWith('/user')) return 'gym';
  if (pathname.startsWith('/admin')) return 'corporate';
  return 'corporate';
}

function arcBetweenPoints(a, b, lift = 10) {
  const mx = (a.cx + b.cx) / 2;
  const my = Math.min(a.cy, b.cy) - lift;
  return `M ${a.cx} ${a.cy} Q ${mx} ${my} ${b.cx} ${b.cy}`;
}

function buildLoopPath(ids) {
  const points = ids.map((id) => VERTICAL_BY_ID[id]).filter(Boolean);
  if (points.length < 2) return '';
  let d = `M ${points[0].cx} ${points[0].cy}`;
  for (let i = 1; i < points.length; i += 1) {
    const prev = points[i - 1];
    const curr = points[i];
    const mx = (prev.cx + curr.cx) / 2;
    const my = Math.min(prev.cy, curr.cy) - 12;
    d += ` Q ${mx} ${my} ${curr.cx} ${curr.cy}`;
  }
  return d;
}

function verticalIndex(id) {
  return PAGE_VERTICALS.findIndex((v) => v.id === id);
}

function CredentialCard({ className = '' }) {
  return (
    <g className={`world-bg__credential-card ${className}`.trim()}>
      <rect x="-5" y="-3.2" width="10" height="6.4" rx="1.2" className="world-bg__card-body" />
      <rect x="-3" y="-1.4" width="2.4" height="1.8" rx="0.35" className="world-bg__card-chip" />
      <line x1="-3.5" y1="2" x2="3.5" y2="2" className="world-bg__card-stripe" />
    </g>
  );
}

function VerticalBuilding({ type, active }) {
  const cls = active ? 'world-bg__building is-active' : 'world-bg__building';

  switch (type) {
    case 'corporate':
      return (
        <g className={cls}>
          <rect x="-3.5" y="-1" width="7" height="9" rx="0.5" className="world-bg__building-fill" />
          {[0, 1, 2].map((row) =>
            [0, 1].map((col) => (
              <rect
                key={`${row}-${col}`}
                x={-2 + col * 2.4}
                y={-0.2 + row * 2.2}
                width="1.4"
                height="1.4"
                rx="0.15"
                className="world-bg__building-window"
              />
            )),
          )}
        </g>
      );
    case 'hotel':
      return (
        <g className={cls}>
          <path d="M -4 8 L -4 2 L 0 -1 L 4 2 L 4 8 Z" className="world-bg__building-fill" />
          <rect x="-2.5" y="4" width="5" height="4" className="world-bg__building-door" />
          <path d="M -5 1 Q 0 -2 5 1" className="world-bg__building-roof" />
        </g>
      );
    case 'gym':
      return (
        <g className={cls}>
          <rect x="-4.5" y="1" width="9" height="7" rx="0.5" className="world-bg__building-fill" />
          <rect x="-1.5" y="-2" width="3" height="3" rx="0.4" className="world-bg__building-accent" />
          <line x1="-3" y1="4" x2="-1" y2="4" className="world-bg__building-detail" strokeWidth="0.6" />
          <line x1="1" y1="4" x2="3" y2="4" className="world-bg__building-detail" strokeWidth="0.6" />
        </g>
      );
    case 'campus':
      return (
        <g className={cls}>
          <rect x="-6" y="2" width="12" height="6" rx="0.4" className="world-bg__building-fill" />
          <rect x="-5" y="-1" width="2.5" height="3" className="world-bg__building-fill" />
          <rect x="-1.2" y="-2" width="2.4" height="4" className="world-bg__building-fill" />
          <rect x="2.5" y="-1" width="2.5" height="3" className="world-bg__building-fill" />
        </g>
      );
    case 'events':
      return (
        <g className={cls}>
          <path d="M -5 8 L -5 4 Q 0 0 5 4 L 5 8 Z" className="world-bg__building-fill" />
          <path d="M -6 4 L 0 1 L 6 4" className="world-bg__building-roof" />
          <rect x="-1" y="5" width="2" height="3" className="world-bg__building-door" />
        </g>
      );
    case 'healthcare':
      return (
        <g className={cls}>
          <rect x="-4" y="0" width="8" height="8" rx="0.5" className="world-bg__building-fill" />
          <rect x="-0.6" y="2" width="1.2" height="4" className="world-bg__building-accent" />
          <rect x="-2" y="3.4" width="4" height="1.2" className="world-bg__building-accent" />
        </g>
      );
    default:
      return null;
  }
}

export function WorldBackground() {
  const pathname = usePathname();
  const prevPath = useRef(pathname);
  const [journey, setJourney] = useState(null);
  const [progress, setProgress] = useState(0);

  const activeVerticalId = useMemo(() => resolveRouteVertical(pathname), [pathname]);
  const activeIndex = verticalIndex(activeVerticalId);
  const loopPath = useMemo(() => buildLoopPath(CARD_LOOP), []);
  const journeyPath = journey
    ? arcBetweenPoints(VERTICAL_BY_ID[journey.fromId], VERTICAL_BY_ID[journey.toId], 14)
    : null;

  useEffect(() => {
    const target = activeIndex >= 0 ? ((activeIndex + 1) / PAGE_VERTICALS.length) * 100 : 0;
    setProgress(target);
  }, [activeIndex]);

  useEffect(() => {
    if (prevPath.current === pathname) return;

    const fromId = resolveRouteVertical(prevPath.current);
    const toId = resolveRouteVertical(pathname);

    if (fromId !== toId) {
      setJourney({ fromId, toId, key: Date.now() });
      const timer = window.setTimeout(() => setJourney(null), 2800);
      prevPath.current = pathname;
      return () => window.clearTimeout(timer);
    }

    prevPath.current = pathname;
  }, [pathname]);

  return (
    <div className="world-bg" aria-hidden="true">
      <div className="world-bg__vignette" />
      <div className="world-bg__aurora" />

      <div className="world-bg__lat-grid">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} className="world-bg__lat-line" style={{ '--i': i }} />
        ))}
      </div>

      <div className="world-bg__page-bridge">
        <p className="world-bg__page-bridge-tag">One card · Every vertical · Every door</p>
        <div className="world-bg__page-rail">
          <div className="world-bg__page-rail-track">
            <div className="world-bg__page-rail-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="world-bg__page-stops">
            {PAGE_VERTICALS.map((stop, i) => (
              <span
                key={stop.id}
                className={`world-bg__page-stop${i <= activeIndex ? ' is-active' : ''}${i === activeIndex ? ' is-current' : ''}`}
                title={stop.short}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="world-bg__globe-wrap">
        <svg className="world-bg__globe" viewBox="0 0 400 400" fill="none">
          <defs>
            <radialGradient id="noa-globe-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--world-glow-start)" />
              <stop offset="55%" stopColor="var(--world-glow-mid)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          <circle cx="200" cy="200" r="198" fill="url(#noa-globe-glow)" />
          <g className="world-bg__globe-spin">
            <circle cx="200" cy="200" r="175" className="world-bg__globe-ring" strokeWidth="1.1" />
            {[0, 28, 56, 84, 112, 140, 168].map((ry) => (
              <ellipse
                key={`lat-${ry}`}
                cx="200"
                cy="200"
                rx="175"
                ry={ry === 0 ? 175 : Math.max(ry * 0.52, 16)}
                className="world-bg__globe-lat"
                strokeWidth="0.85"
              />
            ))}
            {[0, 32, 64, 96, 128, 160].map((rx) => (
              <ellipse
                key={`lon-${rx}`}
                cx="200"
                cy="200"
                rx={rx === 0 ? 175 : Math.max(rx * 0.52, 16)}
                ry="175"
                className="world-bg__globe-lat"
                strokeWidth="0.85"
              />
            ))}
          </g>
        </svg>

        <svg className="world-bg__network" viewBox="0 0 100 100" fill="none">
          {CARD_LOOP.slice(0, -1).map((fromId, i) => {
            const toId = CARD_LOOP[i + 1];
            const from = VERTICAL_BY_ID[fromId];
            const to = VERTICAL_BY_ID[toId];
            return (
              <path
                key={`route-${fromId}-${toId}`}
                d={arcBetweenPoints(from, to, 12)}
                className="world-bg__route"
              />
            );
          })}

          {VERTICALS.map((vertical) => {
            const isActive = vertical.id === activeVerticalId;
            return (
              <g
                key={vertical.id}
                transform={`translate(${vertical.cx} ${vertical.cy})`}
                className={isActive ? 'world-bg__vertical is-active' : 'world-bg__vertical'}
              >
                <ellipse cx="0" cy="9.5" rx="6" ry="1.2" className="world-bg__vertical-base" />
                <VerticalBuilding type={vertical.type} active={isActive} />
                <text y="13" textAnchor="middle" className="world-bg__vertical-label">
                  {vertical.label}
                </text>
              </g>
            );
          })}

          {!journey && loopPath ? (
            <g className="world-bg__card-jumper">
              <path d={loopPath} className="world-bg__jump-path" />
              <g>
                <CredentialCard />
                <animateMotion dur="22s" repeatCount="indefinite" path={loopPath} rotate="auto" />
              </g>
            </g>
          ) : null}

          {journey && journeyPath ? (
            <g key={journey.key} className="world-bg__journey">
              <path d={journeyPath} className="world-bg__journey-arc" />
              <path d={journeyPath} className="world-bg__journey-arc-glow" />
              <g>
                <CredentialCard className="is-jumping" />
                <animateMotion dur="2.4s" repeatCount="1" fill="freeze" path={journeyPath} rotate="auto" />
              </g>
            </g>
          ) : null}
        </svg>
      </div>
    </div>
  );
}
