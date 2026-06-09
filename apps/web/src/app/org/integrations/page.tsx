import { PageHeader } from '@/components/page-header';
import { OrgIntegrationsTable } from '@/components/org/org-integrations-table';
import { ApiOfflineBanner, EmptyPanel } from '@/components/user/dashboard-primitives';
import { fetchOrgIntegrations, ORG_ADMIN_ACCESS_EMPTY, resolveOrgContext } from '@/lib/org-data';

export const dynamic = 'force-dynamic';

export default async function OrgIntegrationsPage() {
  const orgContext = await resolveOrgContext();

  if (!orgContext) {
    return (
      <div className="content-stack">
        <PageHeader
          title="Integrations"
          description="Provider connection status for your organization."
        />
        <EmptyPanel title={ORG_ADMIN_ACCESS_EMPTY.title} body={ORG_ADMIN_ACCESS_EMPTY.body} />
      </div>
    );
  }

  const { integrations, apiReachable } = await fetchOrgIntegrations(orgContext.id);

  return (
    <div className="content-stack">
      <PageHeader
        title="Integrations"
        description={`Credential provider connections for ${orgContext.name} — read-only in v1.`}
      />

      {apiReachable ? null : <ApiOfflineBanner />}

      <div className="callout">
        <p>
          <strong>PACS-led v1:</strong> Corporate access credentials sync from HID Origo webhooks when
          a provider connection is active. Use the mock webhook script in local dev to simulate ingest.
        </p>
      </div>

      <OrgIntegrationsTable rows={integrations} />
    </div>
  );
}
