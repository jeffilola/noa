'use client';

import { Button, Input } from '@relume_io/relume-ui';
import React from 'react';
import { noaColors as c } from '../../shared/theme';
import { WalletPassAnimation } from './WalletPassAnimation';

export function Cta40() {
  return (
    <section
      id="relume"
      className="marketing-section cta-newsletter relative z-[1] border-t"
      style={{
        borderColor: `color-mix(in srgb, #ffffff 10%, transparent)`,
      }}
    >
      <div className="marketing-shell">
        <div className="cta-newsletter__card grid auto-cols-fr grid-cols-1 overflow-hidden rounded-2xl border lg:grid-cols-2">
          <div className="cta-newsletter__copy flex flex-col justify-center p-8 md:p-10 lg:p-12">
            <h2
              className="mb-5 text-3xl font-bold tracking-tight md:mb-6 md:text-4xl lg:text-[2.75rem] lg:leading-[1.15]"
              style={{ color: c.ink }}
            >
              Stay informed on security
            </h2>
            <p className="text-base leading-relaxed md:text-lg" style={{ color: c.sage }}>
              Get updates on product features and security best practices delivered to your inbox.
            </p>
            <div className="mt-6 w-full max-w-sm md:mt-8">
              <form className="rb-4 mb-4 grid w-full max-w-sm grid-cols-1 gap-y-3 sm:grid-cols-[1fr_max-content] sm:gap-4">
                <Input id="email" type="email" placeholder="Enter your email" />
                <Button
                  title="Subscribe"
                  variant="primary"
                  size="sm"
                  className="items-center justify-center rounded-full px-6 py-3"
                >
                  Subscribe
                </Button>
              </form>
              <p className="text-xs leading-relaxed" style={{ color: c.sage }}>
                By clicking Subscribe you&apos;re confirming that you agree with our Terms and
                Conditions.
              </p>
            </div>
          </div>
          <div
            className="cta-newsletter__media relative min-h-[16rem] md:min-h-[20rem]"
            role="img"
            aria-label="Animated Noa mobile credential in Apple Wallet and Google Wallet"
          >
            <WalletPassAnimation />
          </div>
        </div>
      </div>
    </section>
  );
}
