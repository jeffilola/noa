import { DEFAULT_ISSUANCE_POLICY, isPacsLedCorporateBlocked } from '@noa/domain';
import { IssuanceSourceBadge } from '@/components/credentials/issuance-source-badge';

export { IssuanceSourceBadge };

export interface CredentialRow {
  id: string;
  type: string;
  status: string;
  issuanceSource: 'PACS' | 'NOA';
  label?: string | null;
  cardNumber?: string | null;
  externalCredentialId?: string | null;
}

export function canIssueCredential(type: string, settings = DEFAULT_ISSUANCE_POLICY): boolean {
  return !isPacsLedCorporateBlocked(type as 'corporate_access', { issuancePolicy: settings });
}

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  const className =
    normalized === 'active'
      ? 'badge badge-active'
      : normalized === 'revoked'
        ? 'badge badge-muted'
        : 'badge badge-muted';

  return <span className={className}>{status}</span>;
}

export function CredentialIssueButton({
  type,
  onIssue,
}: {
  type: string;
  onIssue?: () => void;
}) {
  const blocked = !canIssueCredential(type);

  if (blocked) {
    return (
      <button
        type="button"
        className="btn btn-ghost"
        disabled
        title="Issue in Lenel Elements — credentials sync from HID webhooks"
      >
        Issue in Elements
      </button>
    );
  }

  return (
    <button type="button" className="btn btn-primary" onClick={onIssue}>
      Issue
    </button>
  );
}

export function CredentialsTable({ credentials }: { credentials: CredentialRow[] }) {
  if (credentials.length === 0) {
    return (
      <div className="card empty-state">
        <p>No credentials yet. Corporate badges sync from HID Origo webhooks when PACS-led mode is enabled.</p>
      </div>
    );
  }

  return (
    <div className="data-table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Label</th>
            <th>Type</th>
            <th>Status</th>
            <th>Source</th>
            <th>Card #</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {credentials.map((cred) => (
            <tr key={cred.id}>
              <td>{cred.label ?? cred.externalCredentialId ?? cred.id.slice(0, 8)}</td>
              <td>{cred.type.replace(/_/g, ' ')}</td>
              <td>
                <StatusBadge status={cred.status} />
              </td>
              <td>
                <IssuanceSourceBadge source={cred.issuanceSource} />
              </td>
              <td>{cred.cardNumber ?? '—'}</td>
              <td>
                <CredentialIssueButton type={cred.type} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
