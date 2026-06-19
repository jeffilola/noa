import { ProviderTestModeForm } from '@/components/integrations/provider-test-mode-form';
import { PageHeader } from '@/components/page-header';
import { EmptyPanel } from '@/components/user/dashboard-primitives';
import {
  INTEGRATION_ADMIN_ACCESS_EMPTY,
  resolveIntegrationAdminOrgContext,
} from '@/lib/org-data';

export default async function IntegrationProvidersPage() {
  const orgContext = await resolveIntegrationAdminOrgContext();

  if (!orgContext) {
    return (
      <div className="content-stack">
        <PageHeader
          title="Provider connections"
          description="Validate test-mode provider settings for integration administrators."
        />
        <EmptyPanel
          title={INTEGRATION_ADMIN_ACCESS_EMPTY.title}
          body={INTEGRATION_ADMIN_ACCESS_EMPTY.body}
        />
      </div>
    );
  }

  return (
    <div className="content-stack">
      <PageHeader
        title="Provider connections"
        description={`Validate test-mode provider settings for ${orgContext.name}. No live API keys are stored.`}
      />

      <ProviderTestModeForm organizationId={orgContext.id} />
    </div>
  );
}
