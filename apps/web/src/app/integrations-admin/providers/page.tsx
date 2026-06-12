import { ProviderTestModeForm } from '@/components/integrations/provider-test-mode-form';
import { PageHeader } from '@/components/page-header';
import { EmptyPanel } from '@/components/user/dashboard-primitives';
import { resolveOrgContext, ORG_ADMIN_ACCESS_EMPTY } from '@/lib/org-data';

export default async function IntegrationProvidersPage() {
  const orgContext = await resolveOrgContext();

  if (!orgContext) {
    return (
      <div className="content-stack">
        <PageHeader
          title="Provider connections"
          description="Configure provider connection stubs for integration administrators."
        />
        <EmptyPanel title={ORG_ADMIN_ACCESS_EMPTY.title} body={ORG_ADMIN_ACCESS_EMPTY.body} />
      </div>
    );
  }

  return (
    <div className="content-stack">
      <PageHeader
        title="Provider connections"
        description={`Validate test-mode provider settings for ${orgContext.name}. Noa does not manage doors, readers, or access levels.`}
      />

      <ProviderTestModeForm organizationId={orgContext.id} />
    </div>
  );
}
