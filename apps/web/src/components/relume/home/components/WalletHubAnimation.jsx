'use client';

import React from 'react';
import { useNoaColors } from '@/hooks/use-noa-colors';

const PROVIDERS = [
  { id: 'hid', name: 'HID', tag: 'Origo', accent: '#FFFFFF' },
  { id: 'brivo', name: 'Brivo', tag: 'Access', accent: '#D4D4D4' },
  { id: 'blue', name: 'BlueDiamond', tag: 'Lenel', accent: '#A3A3A3' },
];

export function WalletHubAnimation() {
  const c = useNoaColors();
  return (
    <div
      className="hero-wallet-hub rounded-[1.25rem] border p-6 md:p-8"
      style={{
        borderColor: `color-mix(in srgb, ${c.ink} 12%, transparent)`,
        background: c.cardBgSoft,
        boxShadow: c.hubShadow,
      }}
    >
      <svg
        className="hero-wallet-hub__svg"
        viewBox="0 0 420 300"
        fill="none"
        aria-hidden="true"
      >
        <path d="M 210 118 L 210 148" className="hero-wallet-hub__stem" />
        <path d="M 210 148 L 75 210" className="hero-wallet-hub__sync-line" style={{ '--delay': '0s' }} />
        <path d="M 210 148 L 210 210" className="hero-wallet-hub__sync-line" style={{ '--delay': '0.4s' }} />
        <path d="M 210 148 L 345 210" className="hero-wallet-hub__sync-line" style={{ '--delay': '0.8s' }} />

        <circle r="3" className="hero-wallet-hub__pulse" style={{ '--delay': '0s' }}>
          <animateMotion dur="2.8s" repeatCount="indefinite" path="M 75 210 Q 140 170 210 118" />
        </circle>
        <circle r="3" className="hero-wallet-hub__pulse" style={{ '--delay': '0.5s' }}>
          <animateMotion dur="2.8s" repeatCount="indefinite" begin="0.5s" path="M 210 210 Q 210 170 210 118" />
        </circle>
        <circle r="3" className="hero-wallet-hub__pulse" style={{ '--delay': '1s' }}>
          <animateMotion dur="2.8s" repeatCount="indefinite" begin="1s" path="M 345 210 Q 280 170 210 118" />
        </circle>
      </svg>

      <div className="hero-wallet-hub__noa">
        <div className="hero-wallet-hub__noa-glow" />
        <div className="hero-wallet-hub__noa-card">
          <div className="hero-wallet-hub__noa-header">
            <span className="hero-wallet-hub__noa-mark">N</span>
            <div>
              <p className="hero-wallet-hub__noa-title">Noa Wallet</p>
              <p className="hero-wallet-hub__noa-sub">Universal credential hub</p>
            </div>
            <span className="hero-wallet-hub__noa-badge">Active</span>
          </div>
          <div className="hero-wallet-hub__noa-stack">
            <span className="hero-wallet-hub__pass hero-wallet-hub__pass--1" />
            <span className="hero-wallet-hub__pass hero-wallet-hub__pass--2" />
            <span className="hero-wallet-hub__pass hero-wallet-hub__pass--3" />
          </div>
        </div>
      </div>

      <div className="hero-wallet-hub__providers">
        {PROVIDERS.map((provider, index) => (
          <div
            key={provider.id}
            className="hero-wallet-hub__provider"
            style={{ '--provider-accent': provider.accent, '--i': index }}
          >
            <div
              className="hero-wallet-hub__provider-icon"
              style={{ background: `${provider.accent}22`, borderColor: `${provider.accent}55` }}
            >
              <span style={{ color: provider.accent }}>{provider.name.slice(0, 2)}</span>
            </div>
            <p className="hero-wallet-hub__provider-name">{provider.name}</p>
            <p className="hero-wallet-hub__provider-tag">{provider.tag} · Mobile credential</p>
            <span className="hero-wallet-hub__provider-dot" style={{ background: provider.accent }} />
          </div>
        ))}
      </div>

      <p className="hero-wallet-hub__caption" style={{ color: c.sage }}>
        PACS-led credentials sync into one wallet
      </p>
    </div>
  );
}
