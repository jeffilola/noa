import { PageHeader } from '../../../components/page-header';
import { apiFetch } from '../../../lib/api';

interface IntegrationRow {
  provider: { id: string; name: string; adapterKey: string };
  connection: { id: string; status: string; apiBaseUrl: string } | null;
}

function statusBadge(status: string | undefined) {
  if (!status || status === 'not connected') {
    return <span className="badge badge-muted">Not connected</span>;
  }
  if (status === 'active') {
    return <span className="badge badge-active">Active</span>;
  }
  return <span className="badge badge-muted">{status}</span>;
}

export default async function IntegrationsPage() {
  const orgId = process.env.NEXT_PUBLIC_DEMO_ORG_ID;
  let rows: IntegrationRow[] = [];
  try {
    if (orgId) rows = await apiFetch(`/organizations/${orgId}/integrations`);
  } catch {
    rows = [];
  }
  return (
    <div className="content-stack">
      <PageHeader
        title="Integrations"
        description="Connect HID Origo for webhook ingest in PACS-led v1. Brivo and other providers follow the same pattern."
      />
      <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Provider</th>
              <th>Status</th>
              <th>API base URL</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ provider, connection }) => (
              <tr key={provider.id}>
                <td>{provider.name}</td>
                <td>{statusBadge(connection?.status)}</td>
                <td>{connection?.apiBaseUrl ?? '—'}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={3} className="empty-state">
                  No providers configured. Set NEXT_PUBLIC_DEMO_ORG_ID to load org integrations.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
