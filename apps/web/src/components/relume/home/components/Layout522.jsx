'use client';

import { Button } from '@relume_io/relume-ui';
import Link from 'next/link';
import React from 'react';
import { RxChevronRight } from 'react-icons/rx';
import { useNoaColors } from '@/hooks/use-noa-colors';
import {
  EnterpriseSolutionArt,
  HospitalitySolutionArt,
  IssuerSolutionArt,
} from './SolutionIllustrations';

const tiles = [
  {
    id: 'enterprise',
    label: 'Enterprise',
    title: 'Streamline credential management across departments and reduce security overhead.',
    art: <EnterpriseSolutionArt />,
    links: [{ label: 'Security teams', href: '/security' }],
  },
  {
    id: 'hospitality',
    label: 'Hospitality',
    title: 'Audit logs and device controls give you complete visibility.',
    art: <HospitalitySolutionArt />,
    links: [{ label: 'Hotels, gyms, and events', href: '/portal' }],
  },
  {
    id: 'issuers',
    label: 'Issuers',
    title: 'Issue digital passes and manage access with confidence.',
    art: <IssuerSolutionArt />,
    links: [{ label: 'Issuers and admins', href: '/org/credentials' }],
  },
];

function SolutionTile({ tile }) {
  const c = useNoaColors();

  return (
    <article
      className="solution-tile flex h-full flex-col overflow-hidden rounded-2xl border"
      style={{
        borderColor: `color-mix(in srgb, ${c.ink} 12%, transparent)`,
        background: c.cardBg,
        boxShadow: c.cardShadow,
      }}
    >
      <div className="solution-tile__art">{tile.art}</div>
      <div className="solution-tile__body p-6 md:p-8">
        <p className="mb-2 text-sm font-semibold" style={{ color: c.accent }}>
          {tile.label}
        </p>
        <h3
          className="mb-4 text-xl font-bold leading-[1.2] md:mb-5 md:text-2xl"
          style={{ color: c.ink }}
        >
          {tile.title}
        </h3>
        <div className="mt-auto flex flex-wrap items-center gap-4 pt-2">
          {tile.links.map((link) => (
            <Link key={link.label} href={link.href} className="no-underline">
              <Button
                title={link.label}
                iconRight={<RxChevronRight />}
                variant="link"
                size="link"
              >
                {link.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}

export function Layout522() {
  const c = useNoaColors();

  return (
    <section id="solutions" className="marketing-section px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 md:mb-18 lg:mb-20">
          <div className="mx-auto max-w-lg text-center">
            <p className="mb-3 text-sm font-semibold md:mb-4" style={{ color: c.accent }}>
              Solutions
            </p>
            <h2
              className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl"
              style={{ color: c.ink }}
            >
              Built for your industry
            </h2>
            <p className="text-base leading-relaxed md:text-lg" style={{ color: c.sage }}>
              Whether you manage access or hold credentials, NOA works for you.
            </p>
          </div>
        </div>

        <div className="solutions-grid grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {tiles.map((tile) => (
            <SolutionTile key={tile.id} tile={tile} />
          ))}
        </div>
      </div>
    </section>
  );
}
