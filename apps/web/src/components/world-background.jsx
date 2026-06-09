'use client';

import { usePathname } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState } from 'react';

/** Vertical hubs on a stylized world map (viewBox 0 0 100 52) */
const VERTICALS = [
  { id: 'corporate', cx: 17, cy: 22, label: 'Corporate', type: 'corporate' },
  { id: 'hotel', cx: 47, cy: 18, label: 'Hotel', type: 'hotel' },
  { id: 'healthcare', cx: 51, cy: 26, label: 'Healthcare', type: 'healthcare' },
  { id: 'gym', cx: 22, cy: 30, label: 'Gym', type: 'gym' },
  { id: 'campus', cx: 74, cy: 21, label: 'Campus', type: 'campus' },
  { id: 'events', cx: 81, cy: 34, label: 'Events', type: 'events' },
];

const VERTICAL_BY_ID = Object.fromEntries(VERTICALS.map((v) => [v.id, v]));

const CARD_LOOP = ['corporate', 'hotel', 'healthcare', 'gym', 'campus', 'events', 'corporate'];

const PAGE_VERTICALS = VERTICALS.map(({ id, label }) => ({ id, short: label }));

/** Minimal continent silhouettes — abstract, not geographic */
const MAP_LANDMASSES = [
  {
    id: 'americas',
    d: 'M 4 14 Q 10 8 18 10 T 28 16 Q 30 22 26 28 Q 22 34 18 38 Q 14 42 12 36 Q 8 28 4 22 Z',
  },
  {
    id: 'emea',
    d: 'M 42 10 Q 50 8 54 14 T 56 26 Q 54 34 50 40 Q 46 46 44 38 Q 42 28 40 18 Q 40 12 42 10 Z',
  },
  {
    id: 'asia',
    d: 'M 58 10 Q 72 8 88 12 T 94 22 Q 90 28 78 26 Q 66 24 58 18 Z',
  },
  {
    id: 'oceania',
    d: 'M 76 32 Q 84 30 90 34 T 86 40 Q 80 42 76 38 Z',
  },
];

const MAP_DOTS = [
  [12, 16],
  [20, 24],
  [28, 20],
  [46, 20],
  [52, 30],
  [68, 18],
  [82, 26],
  [74, 36],
  [38, 32],
  [60, 38],
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

function arcBetweenPoints(a, b, lift = 8) {
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
    const my = Math.min(prev.cy, curr.cy) - 10;
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
      <rect x="-6" y="-3.8" width="12" height="7.6" rx="1.4" className="world-bg__card-body" />
      <rect x="-4.2" y="-2" width="3.2" height="2.2" rx="0.4" className="world-bg__card-chip" />
      <line x1="-4.5" y1="2.2" x2="4.5" y2="2.2" className="world-bg__card-stripe" />
      <circle cx="4.6" cy="-2.4" r="0.75" className="world-bg__card-nfc" />
    </g>
  );
}

function VerticalHub({ vertical, isActive, loopIndex }) {
  return (
    <g
      transform={`translate(${vertical.cx} ${vertical.cy})`}
      className={isActive ? 'world-bg__hub is-active' : 'world-bg__hub'}
      style={{ '--hub-delay': `${loopIndex * 0.35}s` }}
    >
      <circle r="9" className="world-bg__hub-ripple world-bg__hub-ripple--1" />
      <circle r="6.5" className="world-bg__hub-ripple world-bg__hub-ripple--2" />
      <circle r="2.8" className="world-bg__hub-core" />
      <circle r="1.1" className="world-bg__hub-dot" />
      <text y="12.5" textAnchor="middle" className="world-bg__hub-label">
        {vertical.label}
      </text>
    </g>
  );
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
    ? arcBetweenPoints(VERTICAL_BY_ID[journey.fromId], VERTICAL_BY_ID[journey.toId], 12)
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
      <div className="world-bg__grid" />

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

      <div className="world-bg__map-stage">
        <svg className="world-bg__map" viewBox="0 0 100 52" fill="none" preserveAspectRatio="xMidYMid meet">
          <defs>
            <radialGradient id="world-map-shine" cx="50%" cy="42%" r="58%">
              <stop offset="0%" stopColor="var(--world-map-shine-center)" />
              <stop offset="100%" stopColor="var(--world-map-shine-edge)" />
            </radialGradient>
            <linearGradient id="world-route-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--world-route)" stopOpacity="0.2" />
              <stop offset="50%" stopColor="var(--world-accent)" stopOpacity="0.85" />
              <stop offset="100%" stopColor="var(--world-route)" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          <ellipse cx="50" cy="26" rx="48" ry="24" className="world-bg__map-disc" />
          <rect x="0" y="0" width="100" height="52" fill="url(#world-map-shine)" className="world-bg__map-shine" />

          {MAP_LANDMASSES.map((land) => (
            <path key={land.id} d={land.d} className="world-bg__land" />
          ))}

          {MAP_DOTS.map(([cx, cy], i) => (
            <circle key={`dot-${i}`} cx={cx} cy={cy} r="0.35" className="world-bg__map-dot" />
          ))}

          {CARD_LOOP.slice(0, -1).map((fromId, i) => {
            const toId = CARD_LOOP[i + 1];
            const from = VERTICAL_BY_ID[fromId];
            const to = VERTICAL_BY_ID[toId];
            const touchesActive =
              fromId === activeVerticalId ||
              toId === activeVerticalId ||
              fromId === journey?.toId ||
              toId === journey?.fromId;

            return (
              <g key={`route-${fromId}-${toId}`}>
                <path
                  d={arcBetweenPoints(from, to, 9)}
                  className={`world-bg__route-glow${touchesActive ? ' is-lit' : ''}`}
                />
                <path
                  d={arcBetweenPoints(from, to, 9)}
                  className={`world-bg__route${touchesActive ? ' is-lit' : ''}`}
                  style={{ '--route-delay': `${i * 0.6}s` }}
                />
              </g>
            );
          })}

          {!journey && loopPath ? (
            <path d={loopPath} className="world-bg__loop-trail" />
          ) : null}

          {VERTICALS.map((vertical, i) => (
            <VerticalHub
              key={vertical.id}
              vertical={vertical}
              isActive={vertical.id === activeVerticalId}
              loopIndex={i}
            />
          ))}

          {!journey && loopPath ? (
            <g className="world-bg__card-jumper">
              <path d={loopPath} className="world-bg__jump-path" />
              <g className="world-bg__card-traveler">
                <CredentialCard />
                <animateMotion dur="16s" repeatCount="indefinite" path={loopPath} rotate="auto" />
              </g>
            </g>
          ) : null}

          {journey && journeyPath ? (
            <g key={journey.key} className="world-bg__journey">
              <path d={journeyPath} className="world-bg__journey-arc-glow" />
              <path d={journeyPath} className="world-bg__journey-arc" />
              <g className="world-bg__card-traveler">
                <CredentialCard className="is-jumping" />
                <animateMotion dur="2.2s" repeatCount="1" fill="freeze" path={journeyPath} rotate="auto" />
              </g>
            </g>
          ) : null}
        </svg>
      </div>
    </div>
  );
}
