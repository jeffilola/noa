'use client';

import React from 'react';
import { MarketingFaq } from '../../shared/MarketingFaq';

const aboutFaqs = [
  {
    title: 'How does Noa work?',
    body: 'Noa is a universal identity wallet that consolidates credentials from every organization you belong to. Holders keep one app; admins keep full control over issuance and revocation.',
  },
  {
    title: 'Is my data secure with Noa?',
    body: 'Security is built into every layer—device-level encryption, encrypted storage, and comprehensive audit logging. GDPR controls give users full visibility and control over personal data.',
  },
  {
    title: 'Which organizations can use Noa?',
    body: 'Enterprises, security teams, contractors, hotels, gyms, and event organizers. Any organization that issues access credentials can integrate with Noa.',
  },
  {
    title: 'Can credentials be revoked?',
    body: 'Yes—immediately. Admins revoke through the portal and credentials invalidate across every device and door. Access stays current when people leave.',
  },
  {
    title: 'What happens if I lose my device?',
    body: 'Remote deactivation cuts access in seconds. Credentials stay protected in the cloud; restore on a new device through secure verification.',
  },
  {
    title: 'How do audit logs work?',
    body: 'Every action is logged and timestamped—issuance, revocation, access attempts, and admin activity. Full compliance trail, no gaps.',
  },
];

export function Faq13() {
  return (
    <MarketingFaq
      eyebrow="FAQ"
      title="Questions"
      subtitle="Everything you need to know about Noa and how it works."
      items={aboutFaqs}
      ctaTitle="Need more help?"
      ctaBody="Reach out to our team for additional support."
      ctaHref="/contact"
      ctaLabel="Contact"
    />
  );
}
