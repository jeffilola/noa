'use client';

import React from 'react';
import { MarketingFaq } from '../../shared/MarketingFaq';

const homeFaqs = [
  {
    badge: '256-bit',
    title: 'Your data is encrypted end-to-end. Period.',
    body: 'Credentials are encrypted at rest and in transit. ISO 27001 certified infrastructure with continuous audits—not a yearly checkbox.',
  },
  {
    badge: 'Unlimited',
    title: 'One wallet. Every organization.',
    body: 'Link employers, hotels, gyms, and contractors without switching apps. One account runs your entire access life.',
  },
  {
    badge: 'Instant',
    title: 'Lost device? Access dies in seconds.',
    body: 'Remote revoke from any browser. Organizations cut credentials immediately. Sensitive data never lives on the device.',
  },
  {
    badge: 'Built-in',
    title: 'GDPR is the architecture—not an add-on.',
    body: 'Export, delete, and consent controls ship by default. Holders own their data. Admins stay compliant without extra tooling.',
  },
  {
    badge: 'At scale',
    title: 'Issue credentials. Automate the rest.',
    body: 'Self-serve portal for admins. APIs for your stack. PACS sync for corporate badges—no spreadsheets, no manual handoffs.',
  },
  {
    badge: 'Zero lag',
    title: 'Revocation is instant. Audit is automatic.',
    body: 'One action invalidates a credential everywhere—wallet, PACS, and door. Every event lands in an immutable audit trail.',
  },
];

export function Faq13() {
  return (
    <MarketingFaq
      eyebrow="FAQ"
      title="Straight answers. No hedging."
      subtitle="Noa is built for teams that can't afford slow rollouts, weak security, or access that lingers after someone leaves."
      items={homeFaqs}
      ctaTitle="Ready to move faster?"
      ctaBody="We'll map your PACS, wallet, and compliance requirements—and show you a rollout plan that doesn't drag for months."
      ctaHref="/contact"
      ctaLabel="Talk to our team"
    />
  );
}
