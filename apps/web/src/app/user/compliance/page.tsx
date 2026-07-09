import { PageHeader } from '@/components/page-header';
import { ApiOfflineBanner } from '@/components/user/dashboard-primitives';
import { HolderComplianceRecordsPanel } from '@/components/user/holder-compliance-records-panel';
import { fetchHolderComplianceRecords } from '@/lib/org-data';

export const dynamic = 'force-dynamic';

export default async function HolderCompliancePage() {
  const { records, apiReachable } = await fetchHolderComplianceRecords();

  return (
    <div className="content-stack">
      <PageHeader
        title="Training & certs"
        description="Training completions and certifications your organizations use for access decisions."
      />

      {!apiReachable ? <ApiOfflineBanner /> : null}

      <HolderComplianceRecordsPanel initialRecords={records} initialApiReachable={apiReachable} />
    </div>
  );
}
