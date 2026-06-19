import { PageHeader } from '@/components/page-header';
import { ApiOfflineBanner, EmptyPanel } from '@/components/user/dashboard-primitives';
import { fetchUserDashboardData } from '@/lib/user-data';
import { formatCredentialDate, formatCredentialType } from '@/lib/user-dashboard';

export const dynamic = 'force-dynamic';

function WalletPreviewCard({
  platform,
  accent,
  holderLabel,
  credentialLabel,
  validity,
}: {
  platform: 'Apple Wallet' | 'Google Wallet';
  accent: string;
  holderLabel: string;
  credentialLabel: string;
  validity: string;
}) {
  return (
    <article className="card wallet-preview-card" aria-label={`${platform} pass preview`}>
      <div className="wallet-preview-card__topline">
        <span>{platform}</span>
        <span className="badge badge-muted">Preview only</span>
      </div>
      <div className="wallet-preview-card__pass" style={{ borderColor: accent }}>
        <p className="wallet-preview-card__eyebrow">Noa Credential</p>
        <h2>{credentialLabel}</h2>
        <p>{holderLabel}</p>
        <div className="wallet-preview-card__qr" aria-hidden>
          <span />
          <span />
          <span />
          <span />
        </div>
        <p className="wallet-preview-card__validity">{validity}</p>
      </div>
      <p className="dashboard-muted">
        This stub reserves the user experience for wallet passes. It does not generate, sign, or
        issue a real pass.
      </p>
    </article>
  );
}

export default async function UserWalletPreviewPage() {
  const { profile, credentials, apiReachable } = await fetchUserDashboardData();
  const primaryCredential = credentials.find((credential) => credential.status === 'active') ?? credentials[0];
  const holderLabel =
    [profile?.firstName, profile?.lastName].filter(Boolean).join(' ') ||
    profile?.email ||
    'Demo Holder';
  const credentialLabel = primaryCredential
    ? primaryCredential.label ?? formatCredentialType(primaryCredential.type)
    : 'Building Access';
  const validity = primaryCredential?.validUntil
    ? `Valid until ${formatCredentialDate(primaryCredential.validUntil)}`
    : 'Validity appears after credential issuance';

  return (
    <div className="content-stack">
      <PageHeader
        title="Wallet pass preview"
        description="Placeholder Apple and Google Wallet cards for holder review before live issuance is wired."
      />

      {!apiReachable ? <ApiOfflineBanner /> : null}

      {!apiReachable || credentials.length > 0 ? (
        <section className="wallet-preview-grid">
          <WalletPreviewCard
            platform="Apple Wallet"
            accent="#111827"
            holderLabel={holderLabel}
            credentialLabel={credentialLabel}
            validity={validity}
          />
          <WalletPreviewCard
            platform="Google Wallet"
            accent="#2563eb"
            holderLabel={holderLabel}
            credentialLabel={credentialLabel}
            validity={validity}
          />
        </section>
      ) : (
        <EmptyPanel
          title="No wallet-ready credentials"
          body="Seed demo data or issue a holder credential before previewing pass content."
        />
      )}

      <div className="callout callout-warning">
        <p className="callout__title">Stub scope</p>
        <p>
          M8 is preview-only: no PassKit package, Google Wallet object, barcode signing, or provider
          enrollment is created from this screen.
        </p>
      </div>
    </div>
  );
}
