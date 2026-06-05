'use client';

import React from 'react';
import { MarketingFaq } from '../../shared/MarketingFaq';

const contactFaqs = [
  {
    title: 'How fast do you respond?',
    body: 'We respond to all inquiries within 24 hours on business days. For urgent security matters, contact support directly by phone.',
  },
  {
    title: 'What are your support hours?',
    body: 'Monday to Friday, 9am to 5pm AEST. Enterprise customers receive extended support options.',
  },
  {
    title: 'Is my data private and secure?',
    body: 'Yes. Noa is GDPR compliant with enterprise-grade encryption. We never share your data without explicit consent.',
  },
  {
    title: 'Can I request a demo?',
    body: 'Absolutely. Contact us to schedule a personalised demo tailored to your organisation.',
  },
  {
    title: 'Do you offer custom integrations?',
    body: 'We work with enterprises to build custom integrations. Reach out to discuss your requirements.',
  },
  {
    title: 'What about data retention?',
    body: 'You control your data. Delete credentials and audit logs whenever you need. We follow GDPR retention guidelines.',
  },
];

export function Faq13() {
  return (
    <MarketingFaq
      eyebrow="FAQ"
      title="Questions"
      subtitle="Find answers to common questions about Noa and how we support your organisation."
      items={contactFaqs}
      ctaTitle="Need more help?"
      ctaBody="Reach out to our team directly."
      ctaHref="/contact"
      ctaLabel="Contact"
    />
  );
}
