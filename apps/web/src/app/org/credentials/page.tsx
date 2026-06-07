import { PageHeader } from '@/components/page-header';
import { OrgCredentialsTable } from '@/components/org/org-credentials-table';
import { ApiOfflineBanner, EmptyPanel } from '@/components/user/dashboard-primitives';
import { fetchOrgCredentials, resolveOrgContext } from '@/lib/org-data';

export default async function OrgCredentialsPage() {
  const orgContext = await resolveOrgContext();

  if (!orgContext) {
    return (
      <div className="content-stack">
        <PageHeader
          title="Credential inventory"
          description="View organization credential visibility."
        />
        <EmptyPanel
          title="No organization admin access"
          body="You need an Org Admin role on an organization to view credential inventory."
        />
      </div>
    );
  }

  const { credentials, apiReachable } = await fetchOrgCredentials(orgContext.id);

  return (
    <div className="content-stack">
      <PageHeader
        title="Credential inventory"
        description={`Credentials issued or mirrored for ${orgContext.name} — read-only in this milestone.`}
      />

      {apiReachable ? null : <ApiOfflineBanner />}

      <div className="callout callout-warning">
        <p>
          <strong>Read-only:</strong> Org admins can inspect inventory here. Issuance and revocation
          workflows are planned for later milestones.
        </p>
      </div>

      <OrgCredentialsTable credentials={credentials} />
    </div>
  );
}
