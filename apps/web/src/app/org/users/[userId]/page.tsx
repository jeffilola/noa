import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AccessEventsTable } from '@/components/access/access-events-table';
import { PageHeader } from '@/components/page-header';
import { OrgAccessDecisionPanel } from '@/components/org/org-access-decision-panel';
import { ApiOfflineBanner, EmptyPanel } from '@/components/user/dashboard-primitives';
import {
  fetchOrgAccessEvents,
  fetchOrgAccessSummary,
  fetchOrgComplianceRecords,
  fetchOrgCredentials,
  fetchOrgMembers,
  ORG_ADMIN_ACCESS_EMPTY,
  resolveOrgContext,
} from '@/lib/org-data';

export default async function OrgMemberAccessPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const orgContext = await resolveOrgContext();

  if (!orgContext) {
    return (
      <div className="content-stack">
        <PageHeader title="Member access" description="Organization-scoped access decision view." />
        <EmptyPanel title={ORG_ADMIN_ACCESS_EMPTY.title} body={ORG_ADMIN_ACCESS_EMPTY.body} />
      </div>
    );
  }

  const [
    { members },
    { credentials },
    { summary, apiReachable: summaryReachable },
    accessEventsResult,
    complianceResult,
  ] =
    await Promise.all([
      fetchOrgMembers(orgContext.id),
      fetchOrgCredentials(orgContext.id, userId),
      fetchOrgAccessSummary(orgContext.id, userId),
      fetchOrgAccessEvents(orgContext.id, { userId, limit: 10 }),
      fetchOrgComplianceRecords(orgContext.id, userId),
    ]);

  const member = members.find((entry) => entry.userId === userId);
  if (!member) {
    notFound();
  }

  const apiOffline =
    !summaryReachable || !accessEventsResult.apiReachable || !complianceResult.apiReachable;

  return (
    <div className="content-stack">
      <PageHeader
        title="Member access"
        description={
          <>
            Access decision for <code className="org-member-id">{member.user.clerkUserId}</code> in{' '}
            {orgContext.name}.
          </>
        }
      >
        <p>
          <Link href="/org/users" className="text-link">
            Back to users
          </Link>
        </p>
      </PageHeader>

      {apiOffline ? <ApiOfflineBanner /> : null}

      <OrgAccessDecisionPanel
        member={member}
        credentials={credentials}
        accessSummary={summary}
        complianceRecords={complianceResult.records}
      />

      <section className="content-stack__section">
        <h2 className="section-heading">Recent access events</h2>
        <AccessEventsTable
          events={accessEventsResult.events}
          emptyMessage="No access events for this member yet. Seed data or post a mock PACS event to populate history."
        />
      </section>
    </div>
  );
}
