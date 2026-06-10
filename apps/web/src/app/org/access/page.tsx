import Link from 'next/link';
import { AccessEventsTable } from '@/components/access/access-events-table';
import { PageHeader } from '@/components/page-header';
import { ApiOfflineBanner, EmptyPanel } from '@/components/user/dashboard-primitives';
import {
  fetchOrgAccessEvents,
  fetchOrgMembers,
  ORG_ADMIN_ACCESS_EMPTY,
  resolveOrgContext,
} from '@/lib/org-data';

export default async function OrgAccessPage() {
  const orgContext = await resolveOrgContext();

  if (!orgContext) {
    return (
      <div className="content-stack">
        <PageHeader
          title="Site access"
          description="Organization-wide door and check-in events."
        />
        <EmptyPanel title={ORG_ADMIN_ACCESS_EMPTY.title} body={ORG_ADMIN_ACCESS_EMPTY.body} />
      </div>
    );
  }

  const [{ events, apiReachable }, { members }] = await Promise.all([
    fetchOrgAccessEvents(orgContext.id, { limit: 50 }),
    fetchOrgMembers(orgContext.id),
  ]);

  const memberLabels = Object.fromEntries(
    members.map((member) => [member.userId, member.user.clerkUserId]),
  );

  return (
    <div className="content-stack">
      <PageHeader
        title="Site access"
        description={`Recent badge and door events for ${orgContext.name}. Open a member’s access view for the full access decision panel.`}
      >
        <p>
          <Link href="/org/users" className="text-link">
            View members → access decision
          </Link>
        </p>
      </PageHeader>

      {!apiReachable ? <ApiOfflineBanner /> : null}

      <AccessEventsTable
        events={events}
        memberLabels={memberLabels}
        emptyMessage="No access events for this organization yet. Run pnpm db:seed or post a mock PACS event."
      />
    </div>
  );
}
