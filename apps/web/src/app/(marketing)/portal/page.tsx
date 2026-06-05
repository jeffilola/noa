import Link from 'next/link';
import { AppShell } from '@/components/app-shell';

const portals = [
  {
    href: '/user/credentials',
    title: 'Holder dashboard',
    description: 'View your credentials, wallet passes, and devices in one place.',
    cta: 'Open my credentials',
  },
  {
    href: '/admin/credentials',
    title: 'Admin credentials',
    description: 'Monitor synced badges from PACS. Corporate access is issued in Lenel Elements.',
    cta: 'Manage credentials',
  },
  {
    href: '/admin/integrations',
    title: 'Org integrations',
    description: 'Connect HID Origo, Brivo, and other provider APIs for your organization.',
    cta: 'Configure integrations',
  },
];

const features = [
  {
    title: 'PACS-led v1',
    body: 'Corporate access mirrors from HID webhooks — no duplicate issuance from Noa.',
  },
  {
    title: 'Wallet ready',
    body: 'Apple & Google Wallet passes with rotating QR and NFC presentation.',
  },
  {
    title: 'Privacy first',
    body: 'Encrypted PII, audited decrypts, and GDPR export/delete flows.',
  },
];

export default function PortalPage() {
  return (
    <AppShell>
      <section className="hero">
        <p className="hero-eyebrow">Credential orchestration platform</p>
        <h1 className="hero-title">
          One identity.
          <br />
          Every door, key, and pass.
        </h1>
        <p className="hero-subtitle">
          Noa syncs building access from your PACS, delivers credentials to mobile wallets,
          and keeps holder data encrypted and auditable.
        </p>
        <div className="hero-actions">
          <Link href="/user/credentials" className="btn btn-primary">
            Go to holder dashboard
          </Link>
          <Link href="/admin/credentials" className="btn btn-ghost">
            Admin console
          </Link>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Choose a workspace</h2>
        <div className="card-grid">
          {portals.map((portal) => (
            <Link key={portal.href} href={portal.href} className="card portal-card">
              <h2>{portal.title}</h2>
              <p>{portal.description}</p>
              <span className="arrow">{portal.cta} →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Built for v1</h2>
        <div className="card-grid">
          {features.map((feature) => (
            <article key={feature.title} className="card">
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-body">{feature.body}</p>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
