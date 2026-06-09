export interface OrgIntegrationProvider {
  id: string;
  name: string;
  adapterKey: string;
}

export interface OrgIntegrationConnection {
  id: string;
  status: string;
  apiBaseUrl: string;
  lastTestedAt?: string | null;
  lastError?: string | null;
}

export interface OrgIntegrationRow {
  provider: OrgIntegrationProvider;
  connection: OrgIntegrationConnection | null;
}

function connectionStatusBadge(status: string | undefined) {
  if (!status) {
    return <span className="badge badge-muted">Not connected</span>;
  }

  const normalized = status.toLowerCase();
  if (normalized === 'active') {
    return <span className="badge badge-active">Active</span>;
  }
  if (normalized === 'disabled') {
    return <span className="badge badge-muted">Disabled</span>;
  }

  return <span className="badge badge-muted">{status}</span>;
}

export function OrgIntegrationsTable({ rows }: { rows: OrgIntegrationRow[] }) {
  if (rows.length === 0) {
    return (
      <div className="card empty-state">
        <p>
          No credential providers are enabled yet. Run <code>pnpm db:seed</code> to load the HID Origo
          provider catalog for local development.
        </p>
      </div>
    );
  }

  const connectedCount = rows.filter((row) => row.connection?.status === 'active').length;

  return (
    <div className="content-stack">
      <p className="dashboard-muted">
        {connectedCount === 0
          ? 'No active provider connections for this organization.'
          : `${connectedCount} active connection${connectedCount === 1 ? '' : 's'}`}
      </p>

      <div className="data-table-wrap card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Provider</th>
              <th>Adapter</th>
              <th>Status</th>
              <th>API base URL</th>
              <th>Last tested</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ provider, connection }) => (
              <tr key={provider.id}>
                <td>{provider.name}</td>
                <td>
                  <code>{provider.adapterKey}</code>
                </td>
                <td>{connectionStatusBadge(connection?.status)}</td>
                <td>{connection?.apiBaseUrl ?? '—'}</td>
                <td>
                  {connection?.lastTestedAt
                    ? connection.lastTestedAt.slice(0, 10)
                    : connection
                      ? 'Not tested yet'
                      : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {connectedCount === 0 ? (
        <div className="callout callout-warning">
          <p>
            Connect HID Origo (or another provider) to enable PACS-led webhook ingest for this
            organization. In local dev, seed data includes an active HID Origo connection for{' '}
            <strong>demo-org</strong>.
          </p>
        </div>
      ) : null}
    </div>
  );
}
