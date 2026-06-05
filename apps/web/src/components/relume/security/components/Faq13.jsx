'use client';

import React from 'react';
import { MarketingFaq } from '../../shared/MarketingFaq';

const securityFaqs = [
  {
    title: 'What if my device is lost?',
    body: 'Remote revocation is immediate. Credentials vanish from the device within seconds. The wallet stays locked until you regain access or admins re-issue.',
  },
  {
    title: 'How does Noa verify organisations?',
    body: 'Multi-step verification—domain ownership, legal registration, and security compliance—before any credential issuance begins. No shortcuts.',
  },
  {
    title: 'Is my data encrypted?',
    body: 'AES-256 at rest, TLS 1.3 in transit. Encryption keys are managed separately from data. Your information stays yours alone.',
  },
  {
    title: 'Can I audit who accessed my credentials?',
    body: 'Complete audit logs track every access, revocation, and device change. Full transparency—no blind spots.',
  },
  {
    title: 'Does Noa comply with GDPR?',
    body: 'Built into the core platform. Data deletion, consent management, and privacy controls are native features.',
  },
  {
    title: 'What about biometric security?',
    body: 'Biometric authentication is optional and device-native. We never store fingerprint or face data—only your device does.',
  },
];

export function Faq13() {
  return (
    <MarketingFaq
      eyebrow="FAQ"
      title="Questions"
      subtitle="Everything you need to know about Noa security."
      items={securityFaqs}
      ctaTitle="Need more clarity?"
      ctaBody="Our security team is ready to discuss your specific requirements."
      ctaHref="/contact"
      ctaLabel="Contact"
    />
  );
}
