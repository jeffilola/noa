import Link from 'next/link';
import type { OrgMember } from '@/lib/org-data';
import { formatCredentialDate } from '@/lib/user-dashboard';

function formatRole(role: string) {
  return role.replace(/_/g, ' ');
}

function formatDate(value: string | null) {
  if (!value) return '—';
  return formatCredentialDate(value);
}

export function OrgMembersTable({ members }: { members: OrgMember[] }) {
  if (members.length === 0) {
    return (
      <div className="card empty-state">
        <p>No members found for this organization.</p>
      </div>
    );
  }

  return (
    <div className="data-table-wrap card">
      <table className="data-table">
        <thead>
          <tr>
            <th>Member</th>
            <th>Role</th>
            <th>Status</th>
            <th>Joined</th>
            <th aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id}>
              <td>
                <code className="org-member-id">{member.user.clerkUserId}</code>
                {member.user.isDisabled ? (
                  <span className="badge badge-muted">Disabled</span>
                ) : null}
              </td>
              <td>
                <span className="badge badge-muted">{formatRole(member.role)}</span>
              </td>
              <td>
                <span
                  className={`badge ${member.status === 'active' ? 'badge-active' : 'badge-muted'}`}
                >
                  {member.status}
                </span>
              </td>
              <td>{formatDate(member.joinedAt ?? member.invitedAt)}</td>
              <td className="data-table__actions">
                <Link href={`/org/users/${member.userId}`} className="text-link">
                  Access view
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
