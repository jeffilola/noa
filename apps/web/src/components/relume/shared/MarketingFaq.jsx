'use client';

import Link from 'next/link';
import React from 'react';
import { useNoaColors } from '@/hooks/use-noa-colors';

function FaqCard({ item, index }) {
  const c = useNoaColors();
  return (
    <article
      className="faq-card group relative flex h-full flex-col rounded-2xl border p-6 md:p-7"
      style={{
        borderColor: `color-mix(in srgb, #ffffff 12%, transparent)`,
        background: c.cardBg,
        boxShadow: '0 10px 28px rgb(0 0 0 / 28%)',
      }}
    >
      <div
        className="absolute inset-x-0 top-0 h-1 rounded-t-2xl opacity-80 transition-opacity group-hover:opacity-100"
        style={{ background: `linear-gradient(90deg, ${c.accent}, ${c.glow})` }}
      />

      <div className="mb-4 flex items-start justify-between gap-3">
        <span
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
          style={{ background: c.deep }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>
        {item.badge ? (
          <span
            className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider"
            style={{ background: c.accentSoft, color: c.ink }}
          >
            {item.badge}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col">
        <h3 className="mb-3 text-lg font-bold leading-snug md:text-xl" style={{ color: c.ink }}>
          {item.title}
        </h3>
        <p className="text-sm leading-relaxed md:text-base" style={{ color: c.sage }}>
          {item.body}
        </p>
      </div>
    </article>
  );
}

export function MarketingFaq({
  eyebrow = 'FAQ',
  title,
  subtitle,
  items,
  ctaTitle = 'Still deciding?',
  ctaBody = 'Talk to our team about rollout, integrations, and enterprise support.',
  ctaHref = '/contact',
  ctaLabel = 'Contact sales',
}) {
  const c = useNoaColors();
  return (
    <section
      id="faq"
      className="marketing-section relative z-[1] border-t"
      style={{
        borderColor: `color-mix(in srgb, #ffffff 10%, transparent)`,
        background: c.glass,
      }}
    >
      <div className="marketing-shell">
        <div className="mb-8 grid gap-6 lg:mb-10 lg:grid-cols-[1fr_1.1fr] lg:items-end">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em]" style={{ color: c.accent }}>
              {eyebrow}
            </p>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl" style={{ color: c.ink }}>
              {title}
            </h2>
          </div>
          <p className="max-w-xl text-base leading-relaxed md:text-lg lg:justify-self-end" style={{ color: c.sage }}>
            {subtitle}
          </p>
        </div>

        <div className="faq-grid grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {items.map((item, index) => (
            <FaqCard key={item.title} item={item} index={index} />
          ))}
        </div>

        <div
          className="mt-12 flex flex-col gap-6 rounded-2xl border p-8 md:mt-16 md:flex-row md:items-center md:justify-between md:p-10"
          style={{
            borderColor: `color-mix(in srgb, #ffffff 10%, transparent)`,
            background: c.ctaBg,
          }}
        >
          <div className="max-w-xl">
            <h3 className="text-2xl font-bold tracking-tight text-white md:text-3xl">{ctaTitle}</h3>
            <p className="mt-2 text-sm leading-relaxed md:text-base" style={{ color: c.glow }}>
              {ctaBody}
            </p>
          </div>
          <Link
            href={ctaHref}
            className="inline-flex shrink-0 items-center justify-center rounded-full px-8 py-3.5 text-sm font-bold no-underline transition-opacity hover:opacity-90"
            style={{ background: c.accent, color: c.onAccent }}
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
