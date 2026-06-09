'use client';

import { Button } from '@relume_io/relume-ui';
import Link from 'next/link';
import React from 'react';
import { RxChevronRight } from 'react-icons/rx';
import { useNoaColors } from '@/hooks/use-noa-colors';

const STATS = [
  {
    value: '99.9%',
    title: 'Uptime guarantee',
    body: 'Enterprise-grade infrastructure ensures your credentials are always accessible.',
  },
  {
    value: '256-bit',
    title: 'End-to-end encryption',
    body: 'Every credential is encrypted at rest and in transit across the network.',
  },
  {
    value: 'GDPR',
    title: 'Privacy compliant',
    body: 'Full data controls and compliance with European privacy regulations built in.',
  },
  {
    value: 'ISO 27001',
    title: 'Security certified',
    body: 'Independent audits confirm our commitment to information security standards.',
  },
];

export function Stats31() {
  const c = useNoaColors();
  return (
    <section
      id="relume"
      className="marketing-section trust-stats relative z-[1] border-t"
      style={{
        borderColor: `color-mix(in srgb, #ffffff 10%, transparent)`,
        background: c.glass,
        backdropFilter: 'blur(20px)',
      }}
    >
      <div className="marketing-shell">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16 xl:gap-20">
          <div className="max-w-md lg:py-2">
            <p
              className="mb-4 text-xs font-bold uppercase tracking-[0.2em]"
              style={{ color: c.accent }}
            >
              Proven
            </p>
            <h2
              className="mb-6 text-3xl font-bold tracking-tight md:text-4xl lg:text-[2.75rem] lg:leading-[1.15]"
              style={{ color: c.ink }}
            >
              Built on trust and security
            </h2>
            <p className="text-base leading-relaxed md:text-lg" style={{ color: c.sage }}>
              Noa meets the standards enterprises demand. Our infrastructure is audited, certified,
              and designed to protect what matters most.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/security" className="no-underline">
                <Button title="Details" variant="secondary" className="rounded-full px-6">
                  Details
                </Button>
              </Link>
              <Link href="/about" className="no-underline">
                <Button
                  title="Learn"
                  variant="link"
                  size="link"
                  iconRight={<RxChevronRight />}
                  className="rounded-full"
                >
                  Learn
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
            {STATS.map((stat) => (
              <article
                key={stat.title}
                className="flex flex-col rounded-2xl border p-7 md:p-8 lg:p-9"
                style={{
                  borderColor: `color-mix(in srgb, #ffffff 12%, transparent)`,
                  background: c.cardBg,
                }}
              >
                <p
                  className="mb-5 text-3xl font-bold tabular-nums leading-none md:text-4xl"
                  style={{ color: c.ink }}
                >
                  {stat.value}
                </p>
                <h3 className="mb-2 text-base font-bold md:text-lg" style={{ color: c.ink }}>
                  {stat.title}
                </h3>
                <p className="text-sm leading-relaxed md:text-[0.9375rem]" style={{ color: c.sage }}>
                  {stat.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
