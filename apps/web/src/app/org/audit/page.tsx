import { OrgAuditTable } from '@/components/org/org-audit-table';
import { PageHeader } from '@/components/page-header';
import { ApiOfflineBanner, EmptyPanel } from '@/components/user/dashboard-primitives';
import { fetchOrgAuditLogs, resolveOrgContext } from '@/lib/org-data';

export default async function OrgAuditPage() {
  const orgContext = await resolveOrgContext();

  if (!orgContext) {
    return (
      <div className="content-stack">
        <PageHeader
          title="Organization audit logs"
          description="Immutable record of organization activity."
        />
        <EmptyPanel
          title="No organization admin access"
          body="You need an Org Admin role with audit visibility on an organization to view these logs."
        />
      </div>
    );
  }

  const { logs, apiReachable } = await fetchOrgAuditLogs(orgContext.id);

  return (
    <div className="content-stack">
      <PageHeader
        title="Audit logs"
        description={`Read-only activity for ${orgContext.name}. Member changes, credential updates, and admin actions appear here.`}
      />

      {!apiReachable ? <ApiOfflineBanner /> : null}

      <OrgAuditTable logs={logs} />
    </div>
  );
}
