import { IssuanceSourceBadge } from '@/components/credentials/issuance-source-badge';
import {
  formatCredentialDate,
  formatCredentialType,
  statusBadgeClass,
} from '@/lib/user-dashboard';
import type { UserCredential } from '@/lib/user-types';

export function CredentialsGrid({ credentials }: { credentials: UserCredential[] }) {
  return (
    <div className="credential-grid">
      {credentials.map((credential) => (
        <article key={credential.id} className="credential-card card">
          <div className="credential-card__top">
            <div>
              <p className="credential-card__eyebrow">{formatCredentialType(credential.type)}</p>
              <h3 className="credential-card__title">
                {credential.label ?? credential.externalCredentialId ?? credential.id.slice(0, 8)}
              </h3>
            </div>
            <div className="badges">
              <span className={statusBadgeClass(credential.status)}>{credential.status}</span>
              <IssuanceSourceBadge source={credential.issuanceSource} />
            </div>
          </div>

          <dl className="credential-card__meta">
            {credential.cardNumber ? (
              <div>
                <dt>Card #</dt>
                <dd>{credential.cardNumber}</dd>
              </div>
            ) : null}
            {credential.provider?.name ? (
              <div>
                <dt>Provider</dt>
                <dd>{credential.provider.name}</dd>
              </div>
            ) : null}
            {credential.validUntil ? (
              <div>
                <dt>Valid until</dt>
                <dd>{formatCredentialDate(credential.validUntil)}</dd>
              </div>
            ) : null}
          </dl>

          <div className="credential-card__actions">
            <span className="credential-card__hint">Present via Wallet, NFC, or rotating QR in the mobile app.</span>
          </div>
        </article>
      ))}
    </div>
  );
}
