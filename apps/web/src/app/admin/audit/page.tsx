import { PageHeader } from '../../../components/page-header';
import { apiFetch } from '../../../lib/api';

interface AuditLog {
  id: string;
  action: string;
  resourceType: string;
  createdAt: string;
}

export default async function AuditPage() {
  let logs: AuditLog[] = [];
  try {
    logs = await apiFetch('/audit/logs?limit=20');
  } catch {
    logs = [];
  }

  return (
    <div className="content-stack">
      <PageHeader
        title="Access auditing"
        description="Immutable log of credential access, PII decrypts, and admin actions."
      />
      <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Action</th>
              <th>Resource</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id}>
                <td>{l.action}</td>
                <td>{l.resourceType}</td>
                <td>{new Date(l.createdAt).toLocaleString()}</td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={3} className="empty-state">
                  No audit logs yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
