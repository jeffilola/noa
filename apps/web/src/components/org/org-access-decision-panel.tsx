import type { AccessSummary, ComplianceRecord, OrgMember } from '@/lib/org-data';
import type { UserCredential } from '@/lib/user-types';
import {
  formatCredentialDate,
  formatCredentialType,
  sourceBadgeClass,
  statusBadgeClass,
} from '@/lib/user-dashboard';

function formatRole(role: string) {
  return role.replace(/_/g, ' ');
}

function formatLastAccess(summary: AccessSummary | null) {
  if (!summary?.lastAccess) {
    return 'No site access recorded yet';
  }

  const { occurredAt, locationLabel, readerLabel } = summary.lastAccess;
  const when = formatCredentialDate(occurredAt);
  const reader = readerLabel ? ` · ${readerLabel}` : '';
  return `${when} · ${locationLabel}${reader}`;
}

function DecisionModule({
  title,
  status,
  detail,
  muted = false,
}: {
  title: string;
  status: string;
  detail: string;
  muted?: boolean;
}) {
  return (
    <div className={`access-decision__module${muted ? ' access-decision__module--muted' : ''}`}>
      <p className="access-decision__module-title">{title}</p>
      <p className="access-decision__module-status">{status}</p>
      <p className="access-decision__module-detail">{detail}</p>
    </div>
  );
}

function formatComplianceStatus(record: ComplianceRecord | undefined, fallback: string) {
  if (!record) return fallback;

  const expires = record.expiresAt ? ` until ${formatCredentialDate(record.expiresAt)}` : '';
  return `${record.title} ${record.status}${expires}`;
}

function formatComplianceDetail(record: ComplianceRecord | undefined, fallback: string) {
  if (!record) return fallback;

  const issued = record.issuedAt ? `Issued ${formatCredentialDate(record.issuedAt)}. ` : '';
  return `${issued}Source: ${record.source}.`;
}

export function OrgAccessDecisionPanel({
  member,
  credentials,
  accessSummary,
  complianceRecords,
}: {
  member: OrgMember;
  credentials: UserCredential[];
  accessSummary: AccessSummary | null;
  complianceRecords: ComplianceRecord[];
}) {
  const activeCredentials = credentials.filter((credential) => credential.status === 'active');
  const primaryCredential = activeCredentials[0];
  const trainingRecord = complianceRecords.find((record) => record.recordType === 'training');
  const certificationRecord = complianceRecords.find(
    (record) => record.recordType === 'certification',
  );

  const identityStatus = member.user.isDisabled ? 'Disabled account' : 'Verified — signed in';
  const identityDetail = member.user.isDisabled
    ? 'This account cannot authenticate until re-enabled.'
    : 'Profile on file with organization membership.';

  const workforceStatus =
    member.status === 'active'
      ? `Active ${formatRole(member.role)}`
      : `${member.status} ${formatRole(member.role)}`;
  const workforceDetail =
    member.status === 'active'
      ? 'Workforce status is current for this organization.'
      : 'Membership is not active for site access decisions.';

  const credentialStatus = primaryCredential
    ? `${primaryCredential.label ?? formatCredentialType(primaryCredential.type)} (${primaryCredential.status})`
    : 'No active credential';
  const credentialDetail = primaryCredential
    ? `Card ${primaryCredential.cardNumber ?? '—'} · valid through ${
        primaryCredential.validUntil
          ? formatCredentialDate(primaryCredential.validUntil)
          : '—'
      }`
    : 'Issue or assign a building credential to complete the access picture.';

  return (
    <section className="card access-decision" aria-labelledby="access-decision-heading">
      <div className="access-decision__header">
        <h2 id="access-decision-heading">Access decision</h2>
        <p className="access-decision__question">Does this person have access?</p>
      </div>

      <div className="access-decision__grid">
        <DecisionModule
          title="Identity verified"
          status={identityStatus}
          detail={identityDetail}
        />
        <DecisionModule
          title="Workforce status"
          status={workforceStatus}
          detail={workforceDetail}
        />
        <DecisionModule
          title="Training & compliance"
          status={formatComplianceStatus(trainingRecord, 'No training record on file')}
          detail={formatComplianceDetail(
            trainingRecord,
            'Sync LMS records or seed demo data to complete the access picture.',
          )}
          muted={!trainingRecord}
        />
        <DecisionModule
          title="Credential"
          status={credentialStatus}
          detail={credentialDetail}
        />
        <DecisionModule
          title="Last site access"
          status={formatLastAccess(accessSummary)}
          detail={
            accessSummary?.lastAccess
              ? 'From PACS access events — not admin guesswork.'
              : 'Access events sync from door systems when integrated.'
          }
        />
        <DecisionModule
          title="Certification"
          status={formatComplianceStatus(certificationRecord, 'No certification on file')}
          detail={formatComplianceDetail(
            certificationRecord,
            'Certification expiry and renewal dates appear here once recorded.',
          )}
          muted={!certificationRecord}
        />
      </div>

      {activeCredentials.length > 0 ? (
        <div className="access-decision__credentials">
          <p className="access-decision__credentials-label">Active credentials</p>
          <ul className="access-decision__credential-list">
            {activeCredentials.map((credential) => (
              <li key={credential.id}>
                <span className={statusBadgeClass(credential.status)}>{credential.status}</span>
                <span className={sourceBadgeClass(credential.issuanceSource)}>
                  {credential.issuanceSource}
                </span>
                <span>
                  {credential.label ?? formatCredentialType(credential.type)}
                  {credential.cardNumber ? ` · ${credential.cardNumber}` : ''}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
