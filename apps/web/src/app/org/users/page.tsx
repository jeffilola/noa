import { PageHeader } from '@/components/page-header';
import { OrgMembersTable } from '@/components/org/org-members-table';
import { ApiOfflineBanner, EmptyPanel } from '@/components/user/dashboard-primitives';
import { fetchOrgMembers, resolveOrgContext } from '@/lib/org-data';

export default async function OrgUsersPage() {
  const orgContext = await resolveOrgContext();

  if (!orgContext) {
    return (
      <div className="content-stack">
        <PageHeader
          title="Organization users"
          description="View organization memberships and roles."
        />
        <EmptyPanel
          title="No organization admin access"
          body="You need an Org Admin role on an organization to view members. In local dev, seed data includes user_demo_org_admin on Demo Organization."
        />
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
