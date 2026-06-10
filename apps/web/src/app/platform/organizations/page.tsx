import { PageHeader } from '@/components/page-header';
import { ApiOfflineBanner, EmptyPanel } from '@/components/user/dashboard-primitives';
import { fetchPlatformOrganizations } from '@/lib/platform-data';

function formatDate(value: string) {
  return value.slice(0, 10);
}

export default async function PlatformOrganizationsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search = '' } = await searchParams;
  const { organizations, apiReachable } = await fetchPlatformOrganizations(search);

  return (
    <div className="content-stack">
      <PageHeader
        title="Organizations"
        description="Search and review customer organizations across the Noa platform."
      />

      {!apiReachable ? <ApiOfflineBanner /> : null}

      <form className="dashboard-search-form" action="/platform/organizations">
        <label htmlFor="platform-org-search">Search organizations</label>
        <div>
          <input
            id="platform-org-search"
            name="search"
            defaultValue={search}
            placeholder="Name, slug, or Clerk org id"
          />
          <button className="btn btn-primary" type="submit">
            Search
          </button>
        </div>
      </form>

      {organizations.length > 0 ? (
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Organization</th>
                <th>Clerk org</th>
                <th>Members</th>
                <th>Credentials</th>
                <th>Providers</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {organizations.map((org) => (
                <tr key={org.id}>
                  <td>
                    <strong>{org.name}</strong>
                    <br />
                    <span className="dashboard-muted">{org.slug}</span>
                  </td>
                  <td>{org.clerkOrgId ?? '—'}</td>
                  <td>{org.memberCount}</td>
                  <td>{org.credentialCount}</td>
                  <td>{org.providerConnectionCount}</td>
                  <td>{formatDate(org.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyPanel
          title={search ? 'No organizations matched' : 'No organizations found'}
          body="Create or seed organizations before reviewing the platform admin list."
        />
      )}
    </div>
  );
}
