'use client';

import React from 'react';
import { useNoaColors } from '@/hooks/use-noa-colors';

const DEVICE_IMAGE = '/marketing/noa-wallet-devices.png';

const DEVICES = [
  {
    id: 'iphone',
    alt: "Sarah Chen's Grand Plaza hotel key in Apple Wallet on an iPhone 17",
  },
  {
    id: 'pixel',
    alt: "Marcus Webb's FitCore gym pass in Google Wallet on a Pixel phone",
  },
];

export function WalletPassAnimation() {
  const c = useNoaColors();
  return (
    <div className="wallet-pass-anim wallet-pass-anim--photo">
      <div className="wallet-pass-anim__glow wallet-pass-anim__glow--photo" style={{ background: c.accentSoft }} />

      <div className="wallet-pass-anim__device-stage" aria-live="polite">
        {DEVICES.map((device) => (
          <div
            key={device.id}
            className={`wallet-pass-anim__device wallet-pass-anim__device--${device.id}`}
          >
            <img
              src={DEVICE_IMAGE}
              alt={device.alt}
              className="wallet-pass-anim__photo"
              width={960}
              height={720}
              loading="eager"
              decoding="async"
            />
          </div>
        ))}
        <span className="wallet-pass-anim__shine" aria-hidden="true" />
      </div>
    </div>
  );
}
