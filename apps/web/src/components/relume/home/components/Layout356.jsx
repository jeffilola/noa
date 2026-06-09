'use client';

import Link from 'next/link';
import React from 'react';
import { useNoaColors } from '@/hooks/use-noa-colors';

const steps = [
  {
    number: '01',
    label: 'Setup',
    title: 'Add credentials',
    headline: 'Download Noa and connect your organizations',
    body: 'Start with one account. Link employers, hotels, gyms, and contractors — Noa keeps every pass in a single wallet.',
    cta: { href: '/user/credentials', label: 'Open holder dashboard' },
    preview: ['Corporate badge', 'Hotel key', 'Gym membership'],
  },
  {
    number: '02',
    label: 'Control',
    title: 'Manage access',
    headline: 'Issue, sync, and revoke from one place',
    body: 'Administrators mirror PACS credentials while holders see updates instantly. Revoke access in seconds when someone leaves.',
    cta: { href: '/admin/credentials', label: 'Admin console' },
    preview: ['PACS sync active', 'Revoke queued', 'Audit logged'],
  },
  {
    number: '03',
    label: 'Present',
    title: 'Use everywhere',
    headline: 'Wallet, NFC, and QR — ready when you are',
    body: 'Present credentials from Apple or Google Wallet, tap at the reader, or fall back to a rotating QR code.',
    cta: { href: '/security', label: 'See security model' },
    preview: ['Apple Wallet', 'NFC tap', 'Rotating QR'],
  },
];

function StepPreview({ items, accent }) {
  const c = useNoaColors();
  return (
    <div
      className="flex h-full min-h-[220px] flex-col justify-center gap-3 rounded-2xl border p-5"
      style={{
        borderColor: `color-mix(in srgb, #ffffff 10%, transparent)`,
        background: `linear-gradient(160deg, ${c.surface} 0%, ${c.surfaceAlt} 100%)`,
      }}
    >
      {items.map((item) => (
        <div
          key={item}
          className="flex items-center justify-between rounded-xl border px-4 py-3"
          style={{
            borderColor: `color-mix(in srgb, ${c.sage} 15%, transparent)`,
            background: c.surface,
          }}
        >
          <span className="text-sm font-medium" style={{ color: c.ink }}>
            {item}
          </span>
          <span className="size-2 rounded-full" style={{ background: accent }} />
        </div>
      ))}
    </div>
  );
}

export function Layout356() {
  const c = useNoaColors();
  return (
    <section className="marketing-section border-t" style={{ borderColor: `color-mix(in srgb, ${c.sage} 18%, transparent)` }}>
      <div className="marketing-shell">
        <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em]" style={{ color: c.accent }}>
            How it works
          </p>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl" style={{ color: c.ink }}>
            Three steps to unified access
          </h2>
          <p className="mt-4 text-base leading-relaxed md:text-lg" style={{ color: c.sage }}>
            From onboarding to presentation, Noa keeps credential lifecycle simple for holders and admins.
          </p>
        </div>

        <div className="flex flex-col gap-8 lg:gap-10">
          {steps.map((step, index) => (
            <article
              key={step.number}
              className="grid overflow-hidden rounded-[1.25rem] border lg:grid-cols-2"
              style={{
                borderColor: `color-mix(in srgb, #ffffff 10%, transparent)`,
                background: c.cardBgSoft,
                boxShadow: '0 16px 48px rgb(0 0 0 / 28%)',
              }}
            >
              <div className="flex flex-col justify-center p-8 md:p-10 lg:p-12">
                <div className="mb-5 flex items-center gap-3">
                  <span
                    className="inline-flex size-10 items-center justify-center rounded-full text-sm font-bold"
                    style={{ background: c.accent, color: c.onAccent }}
                  >
                    {step.number}
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: c.accent }}>
                      {step.label}
                    </p>
                    <p className="text-sm font-semibold" style={{ color: c.sage }}>
                      {step.title}
                    </p>
                  </div>
                </div>

                <h3 className="mb-4 text-2xl font-bold leading-tight tracking-tight md:text-3xl" style={{ color: c.ink }}>
                  {step.headline}
                </h3>
                <p className="mb-8 max-w-lg text-base leading-relaxed" style={{ color: c.sage }}>
                  {step.body}
                </p>

                <Link
                  href={step.cta.href}
                  className="inline-flex w-fit items-center rounded-full px-6 py-3 text-sm font-semibold no-underline transition-opacity hover:opacity-90"
                  style={{ background: c.accent, color: c.onAccent }}
                >
                  {step.cta.label}
                </Link>
              </div>

              <div
                className="border-t p-8 md:p-10 lg:border-l lg:border-t-0"
                style={{
                  borderColor: `color-mix(in srgb, ${c.sage} 15%, transparent)`,
                  background: index % 2 === 1 ? c.mist : c.surfaceAlt,
                }}
              >
                <StepPreview items={step.preview} accent={c.accent} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
