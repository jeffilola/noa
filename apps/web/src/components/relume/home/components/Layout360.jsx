'use client';

import { Button } from '@relume_io/relume-ui';
import Link from 'next/link';
import React from 'react';
import { RxChevronRight } from 'react-icons/rx';
import { useNoaColors } from '@/hooks/use-noa-colors';
import { CredentialWalletArt, SingleIdentityArt } from './CapabilityIllustrations';

function CapabilityCard({ eyebrow, title, body, primaryHref, primaryLabel, secondaryHref, secondaryLabel, art }) {
  const c = useNoaColors();

  return (
    <article
      className="capability-card flex flex-col overflow-hidden rounded-2xl border"
      style={{
        borderColor: `color-mix(in srgb, ${c.ink} 12%, transparent)`,
        background: c.cardBg,
        boxShadow: c.cardShadow,
      }}
    >
      <div className="p-6 md:p-8 lg:p-12">
        <p className="mb-2 text-sm font-semibold" style={{ color: c.accent }}>
          {eyebrow}
        </p>
        <h3
          className="mb-5 text-4xl font-bold leading-[1.2] md:mb-6 md:text-5xl lg:text-6xl"
          style={{ color: c.ink }}
        >
          {title}
        </h3>
        <p className="text-base leading-relaxed" style={{ color: c.sage }}>
          {body}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
          <Button title={primaryLabel} variant="secondary" asChild>
            <Link href={primaryHref}>{primaryLabel}</Link>
          </Button>
          <Button
            title={secondaryLabel}
            variant="link"
            size="link"
            iconRight={<RxChevronRight />}
            asChild
          >
            <Link href={secondaryHref}>{secondaryLabel}</Link>
          </Button>
        </div>
      </div>
      <div className="capability-card__media mt-auto">{art}</div>
    </article>
  );
}

export function Layout360() {
  const c = useNoaColors();

  return (
    <section id="relume" className="marketing-section px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="rb-12 mb-12 md:mb-18 lg:mb-20">
          <div className="mx-auto max-w-lg text-center">
            <p className="mb-3 text-sm font-semibold md:mb-4" style={{ color: c.accent }}>
              Capabilities
            </p>
            <h2
              className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl"
              style={{ color: c.ink }}
            >
              Everything you need to manage identity
            </h2>
            <p className="text-base leading-relaxed md:text-lg" style={{ color: c.sage }}>
              NOA combines credential management, organization control, and security auditing into
              one platform. Built for enterprises that demand precision and trust.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 md:gap-8">
          <CapabilityCard
            eyebrow="Administration"
            title="Single identity"
            body="Administrators control issuance, revocation, and access across multiple organizations effortlessly."
            primaryHref="/admin/credentials"
            primaryLabel="Explore"
            secondaryHref="/about"
            secondaryLabel="More"
            art={<SingleIdentityArt />}
          />
          <CapabilityCard
            eyebrow="Holder"
            title="Credential wallet"
            body="GDPR controls and device management keep your data protected and compliant."
            primaryHref="/user/credentials"
            primaryLabel="Open wallet"
            secondaryHref="/security"
            secondaryLabel="Security model"
            art={<CredentialWalletArt />}
          />
        </div>
      </div>
    </section>
  );
}
