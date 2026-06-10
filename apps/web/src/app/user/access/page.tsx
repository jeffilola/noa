import { PageHeader } from '@/components/page-header';
import { HolderAccessHistoryPanel } from '@/components/access/holder-access-history-panel';
import { ApiOfflineBanner } from '@/components/user/dashboard-primitives';
import { fetchHolderAccessEvents } from '@/lib/org-data';

export const dynamic = 'force-dynamic';

export default async function HolderAccessHistoryPage() {
  const { events, apiReachable } = await fetchHolderAccessEvents(50);

  return (
    <div className="content-stack">
      <PageHeader
        title="Site access history"
        description="Recent door and check-in events synced from your organizations’ PACS integrations."
      />

      {!apiReachable ? <ApiOfflineBanner /> : null}

      <HolderAccessHistoryPanel initialEvents={events} initialApiReachable={apiReachable} />
    </div>
  );
}
