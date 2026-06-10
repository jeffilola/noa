import type { AccessEventRecord } from '@/lib/org-data';
import { formatCredentialDate } from '@/lib/user-dashboard';
import Link from 'next/link';
function formatDirection(direction: string) {
  if (direction === 'entry') return 'Entry';
  if (direction === 'exit') return 'Exit';
  return 'Unknown';
}

function formatWhen(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const time = date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  return `${formatCredentialDate(value)} ${time}`;
}

export function AccessEventsTable({
  events,
  showOrganization = false,
  memberLabels,
  emptyMessage = 'No access events recorded yet.',
}: {
  events: AccessEventRecord[];
  showOrganization?: boolean;
  memberLabels?: Record<string, string>;
  emptyMessage?: string;
}) {
  if (events.length === 0) {
    return (
      <div className="card empty-state">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="data-table-wrap card">
      <table className="data-table">
        <thead>
          <tr>
            <th>When</th>
            {memberLabels ? <th>Member</th> : null}
            {showOrganization ? <th>Organization</th> : null}
            <th>Location</th>
            <th>Reader</th>
            <th>Direction</th>
            <th>Source</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              <td>{formatWhen(event.occurredAt)}</td>
              {memberLabels ? (
                <td>
                  {memberLabels[event.userId] ? (
                    <Link href={`/org/users/${event.userId}`} className="text-link">
                      <code className="org-member-id">{memberLabels[event.userId]}</code>
                    </Link>
                  ) : (
                    <code className="org-member-id">{event.userId.slice(0, 8)}…</code>
                  )}
                </td>
              ) : null}
              {showOrganization ? (
                <td>{event.organization?.name ?? event.organizationId}</td>
              ) : null}
              <td>{event.locationLabel}</td>
              <td>{event.readerLabel ?? '—'}</td>
              <td>
                <span className="badge badge-muted">{formatDirection(event.direction)}</span>
              </td>
              <td>
                <span
                  className={`badge ${event.source.toUpperCase() === 'PACS' ? 'badge-pacs' : 'badge-noa'}`}
                >
                  {event.source}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
