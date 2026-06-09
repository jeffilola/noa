'use client';

import { Button } from '@relume_io/relume-ui';
import Link from 'next/link';
import React from 'react';
import { useNoaColors } from '@/hooks/use-noa-colors';

export function PageHero({ eyebrow, title, description, primaryHref, primaryLabel, secondaryHref, secondaryLabel }) {
  const c = useNoaColors();
  return (
    <section className="marketing-section">
      <div className="marketing-shell mx-auto max-w-3xl text-center">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em]" style={{ color: c.accent }}>
          {eyebrow}
        </p>
        <h1
          className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-[3.25rem]"
          style={{ color: c.ink }}
        >
          {title}
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed md:text-lg" style={{ color: c.sage }}>
          {description}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href={primaryHref} className="no-underline">
            <Button title={primaryLabel} className="rounded-full px-7 py-3" style={{ background: c.accent, color: c.onAccent }}>
              {primaryLabel}
            </Button>
          </Link>
          <Link href={secondaryHref} className="no-underline">
            <Button
              title={secondaryLabel}
              variant="secondary"
              className="rounded-full border bg-transparent px-7 py-3"
              style={{ borderColor: c.sage, color: c.sage }}
            >
              {secondaryLabel}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
