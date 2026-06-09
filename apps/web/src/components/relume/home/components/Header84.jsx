'use client';

import { Button } from '@relume_io/relume-ui';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import React from 'react';
import { marketingRoutes } from '../../shared/routes';
import { useNoaColors } from '@/hooks/use-noa-colors';
import { WalletHubAnimation } from './WalletHubAnimation';

export function Header84() {
  const c = useNoaColors();
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <section className="marketing-section relative overflow-hidden">
      <div className="marketing-shell relative grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="max-w-xl">
          <p
            className="mb-5 text-xs font-bold uppercase tracking-[0.2em]"
            style={{ color: c.accent }}
          >
            Universal identity wallet
          </p>
          <h1
            className="mb-6 text-4xl font-bold leading-[1.08] tracking-tight md:text-5xl lg:text-[3.25rem]"
            style={{ color: c.ink }}
          >
            All your credentials in one place
          </h1>
          <p className="mb-10 max-w-lg text-base leading-relaxed md:text-lg" style={{ color: c.sage }}>
            Noa is built for people who demand control. Hold credentials from every organization
            you work with, access them instantly, and revoke them just as fast.
          </p>
          <div className="flex flex-wrap gap-4">
            {isLoaded && isSignedIn ? (
              <Link href={marketingRoutes.holderDashboard} className="no-underline">
                <Button
                  title="Dashboard"
                  className="rounded-full px-7 py-3"
                  style={{ background: c.accent, color: c.onAccent }}
                >
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link href={marketingRoutes.signUp} className="no-underline">
                <Button
                  title="Get started"
                  className="rounded-full px-7 py-3"
                  style={{ background: c.accent, color: c.onAccent }}
                >
                  Get started
                </Button>
              </Link>
            )}
            <Link href="/contact" className="no-underline">
              <Button
                title="Watch demo"
                variant="secondary"
                className="rounded-full border bg-transparent px-7 py-3"
                style={{ borderColor: c.sage, color: c.sage }}
              >
                Watch demo
              </Button>
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
          <WalletHubAnimation />
        </div>
      </div>
    </section>
  );
}
