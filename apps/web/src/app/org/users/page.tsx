import { PageHeader } from '@/components/page-header';
import { OrgMembersTable } from '@/components/org/org-members-table';
import { ApiOfflineBanner, EmptyPanel } from '@/components/user/dashboard-primitives';
import { fetchOrgMembers, ORG_ADMIN_ACCESS_EMPTY, resolveOrgContext } from '@/lib/org-data';

export default async function OrgUsersPage() {
  const orgContext = await resolveOrgContext();

  if (!orgContext) {
    return (
      <div className="content-stack">
        <PageHeader
          title="Organization users"
          description="View organization memberships and roles."
        />
        <EmptyPanel title={ORG_ADMIN_ACCESS_EMPTY.title} body={ORG_ADMIN_ACCESS_EMPTY.body} />
      </div>
    );
  }

  const { members, apiReachable } = await fetchOrgMembers(orgContext.id);

  return (
    <div className="content-stack">
      <PageHeader
        title="Organization users"
        description={`Members of ${orgContext.name} — read-only in this milestone. Invite and role changes come later.`}
      />

      {apiReachable ? null : <ApiOfflineBanner />}

      <OrgMembersTable members={members} />
    </div>
  );
}
