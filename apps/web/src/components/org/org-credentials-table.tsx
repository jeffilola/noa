import { IssuanceSourceBadge } from '@/app/admin/credentials/credentials-ui';
import { formatCredentialDate, formatCredentialType, statusBadgeClass } from '@/lib/user-dashboard';
import type { UserCredential } from '@/lib/user-types';

function StatusBadge({ status }: { status: string }) {
  return <span className={statusBadgeClass(status)}>{status}</span>;
}

export function OrgCredentialsTable({ credentials }: { credentials: UserCredential[] }) {
  if (credentials.length === 0) {
    return (
      <div className="card empty-state">
        <p>
          No credentials in this organization yet. Seeded demo data includes HQ Building Access and
          Demo Gym Membership after <code>pnpm db:seed</code>.
        </p>
      </div>
    );
  }

  return (
    <div className="data-table-wrap card">
      <table className="data-table">
        <thead>
          <tr>
            <th>Label</th>
            <th>Type</th>
            <th>Status</th>
            <th>Source</th>
            <th>Card #</th>
            <th>Provider</th>
            <th>Valid until</th>
          </tr>
        </thead>
        <tbody>
          {credentials.map((credential) => (
            <tr key={credential.id}>
              <td>{credential.label ?? credential.externalCredentialId ?? credential.id.slice(0, 8)}</td>
              <td>{formatCredentialType(credential.type)}</td>
              <td>
                <StatusBadge status={credential.status} />
              </td>
              <td>
                <IssuanceSourceBadge source={credential.issuanceSource as 'PACS' | 'NOA'} />
              </td>
              <td>{credential.cardNumber ?? '—'}</td>
              <td>{credential.provider?.name ?? '—'}</td>
              <td>
                {credential.validUntil
                  ? formatCredentialDate(credential.validUntil)
                  : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
