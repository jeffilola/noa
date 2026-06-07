export function OrgAuditTable({ logs }: { logs: import('@/lib/org-data').OrgAuditLog[] }) {
  if (logs.length === 0) {
    return (
      <div className="card empty-state">
        <p>
          No audit events for this organization yet. Member invites, credential changes, and admin
          actions will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="data-table-wrap card">
      <table className="data-table">
        <thead>
          <tr>
            <th>Action</th>
            <th>Resource</th>
            <th>Resource ID</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td>{log.action.replace(/_/g, ' ')}</td>
              <td>{log.resourceType}</td>
              <td>{log.resourceId ?? '—'}</td>
              <td>{new Date(log.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
