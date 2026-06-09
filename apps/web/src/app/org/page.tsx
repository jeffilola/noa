import { PageHeader } from '@/components/page-header';
import { ApiOfflineBanner, DashboardStatGrid, EmptyPanel } from '@/components/user/dashboard-primitives';
import { UserQuickLink } from '@/components/user/user-quick-link';
import { fetchOrgOverview, ORG_ADMIN_ACCESS_EMPTY, resolveOrgContext } from '@/lib/org-data';

const unavailableStat = { value: '—' as const, hint: 'Unavailable while API is offline', unavailable: true };

function formatCount(count: number, emptyHint: string) {
  return {
    value: count,
    hint: count === 0 ? emptyHint : undefined,
  };
}

export default async function OrgOverviewPage() {
  const orgContext = await resolveOrgContext();

  if (!orgContext) {
    return (
      <div className="content-stack">
        <PageHeader
          title="Organization overview"
          description="Operational summary for organization administrators."
        />
        <EmptyPanel title={ORG_ADMIN_ACCESS_EMPTY.title} body={ORG_ADMIN_ACCESS_EMPTY.body} />
      </div>
    );
  }

  const { overview, apiReachable } = await fetchOrgOverview(orgContext.id);
  const apiOffline = !apiReachable;
  const statUnavailable = apiOffline ? unavailableStat : null;

  const stats = [
    {
      label: 'Active members',
      ...(statUnavailable ??
        formatCount(overview?.activeMemberCount ?? 0, 'No active members yet')),
      hint:
        statUnavailable?.hint ??
        (overview && overview.memberCount === 0
          ? 'No members yet'
          : overview
            ? `${overview.memberCount} total`
            : undefined),
    },
    {
      label: 'Active credentials',
      ...(statUnavailable ??
        formatCount(overview?.activeCredentialCount ?? 0, 'No active credentials in this org')),
      hint:
        statUnavailable?.hint ??
        (overview && overview.credentialCount === 0
          ? 'No credentials issued yet'
          : overview
            ? `${overview.credentialCount} total`
            : undefined),
    },
    {
      label: 'Organization',
      value: apiOffline ? '—' : orgContext.slug,
      hint: apiOffline ? 'Unavailable while API is offline' : orgContext.name,
      unavailable: apiOffline,
    },
  ];

  const tileStat = (count: number | undefined) => (apiOffline ? '—' : String(count ?? 0));

  return (
    <div className="content-stack">
      <PageHeader
        title={orgContext.name}
        description="Organization admin dashboard — inspect members, credentials, and audit activity (read-only in this milestone)."
      />

      {apiOffline ? <ApiOfflineBanner /> : null}

      <DashboardStatGrid stats={stats} />

      <div className="dashboard-tiles">
        <UserQuickLink
          href="/org/users"
          title="Users"
          description="View organization memberships and roles."
          stat={tileStat(overview?.memberCount)}
          statUnavailable={apiOffline}
        />
        <UserQuickLink
          href="/org/credentials"
          title="Credentials"
          description="Browse credential inventory for this organization."
          stat={tileStat(overview?.credentialCount)}
          statUnavailable={apiOffline}
        />
        <UserQuickLink
          href="/org/integrations"
          title="Integrations"
          description="HID Origo and other provider connection status."
          statUnavailable={apiOffline}
        />
        <UserQuickLink
          href="/org/audit"
          title="Audit logs"
          description="Review organization activity and compliance events."
        />
      </div>
    </div>
  );
}
