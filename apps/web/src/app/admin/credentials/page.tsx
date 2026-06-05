import { PageHeader } from '../../../components/page-header';
import { CredentialsTable, type CredentialRow } from './credentials-ui';
import { apiFetch } from '../../../lib/api';

async function fetchCredentials(): Promise<CredentialRow[]> {
  try {
    const data = await apiFetch<CredentialRow[]>('/credentials?all=true');
    return data.map((c) => ({
      id: c.id,
      type: c.type,
      status: c.status,
      issuanceSource: c.issuanceSource,
      label: c.label,
      cardNumber: c.cardNumber,
      externalCredentialId: c.externalCredentialId,
    }));
  } catch {
    return [];
  }
}
export default async function AdminCredentialsPage() {
  const credentials = await fetchCredentials();

  return (
    <div className="content-stack">
      <PageHeader
        title="Credentials"
        description="Corporate access credentials are PACS-led in v1. Issue mobile badges in Lenel Elements; Noa mirrors them from HID Origo webhooks."
      />
      <div className="callout callout-warning">
        <p>
          <strong>PACS-led v1:</strong> You cannot issue corporate access from Noa. Use Lenel Elements
          and let HID webhooks sync credentials here.
        </p>
      </div>
      <CredentialsTable credentials={credentials} />
    </div>
  );
}
