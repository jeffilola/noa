import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { ApiErrorBanner, ApiOfflineBanner, EmptyPanel } from '@/components/user/dashboard-primitives';
import {
  fetchPlatformOrganizations,
  hasActivePlatformOrganizationFilters,
  parsePlatformOrganizationQuery,
} from '@/lib/platform-data';

function formatDate(value: string) {
  return value.slice(0, 10);
}

export default async function PlatformOrganizationsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const query = parsePlatformOrganizationQuery(params);
  const { organizations, apiReachable, forbidden } = await fetchPlatformOrganizations(query);
  const filtersActive = hasActivePlatformOrganizationFilters(query);

  return (
    <div className="content-stack">
      <PageHeader
        title="Organizations"
        description="Search and review customer organizations across the Noa platform."
      />

      {forbidden ? (
        <ApiErrorBanner message="Platform admin access is required to list organizations. Sign in with a platform admin account, or re-run pnpm db:seed after pulling the latest changes so your demo Clerk user receives the platform_admin role." />
      ) : null}
      {!apiReachable ? <ApiOfflineBanner /> : null}

      <form className="dashboard-search-form dashboard-filter-form" action="/platform/organizations" method="get">
        <div className="dashboard-filter-form__section">
          <label htmlFor="platform-org-search">Search organizations</label>
          <div className="dashboard-filter-form__search-row">
            <input
              id="platform-org-search"
              name="search"
              defaultValue={query.search ?? ''}
              placeholder="Name or Clerk org id"
            />
            <select name="field" defaultValue={query.field ?? 'all'} aria-label="Search by">
              <option value="all">All fields</option>
              <option value="name">Name only</option>
              <option value="clerkOrgId">Clerk org id only</option>
            </select>
            <button className="btn btn-primary" type="submit">
              Search
            </button>
          </div>
        </div>

        <div className="dashboard-filter-form__inline-row">
          <div className="dashboard-filter-form__field">
            <label htmlFor="platform-org-filter">Show</label>
            <select id="platform-org-filter" name="filter" defaultValue={query.filter ?? 'all'}>
              <option value="all">All organizations</option>
              <option value="hasMembers">Has members</option>
              <option value="hasCredentials">Has credentials</option>
              <option value="hasProviders">Connected to a provider</option>
              <option value="missingClerkOrg">Missing Clerk org id</option>
            </select>
          </div>

          <div className="dashboard-filter-form__field">
            <label htmlFor="platform-org-sort">Sort by</label>
            <select id="platform-org-sort" name="sort" defaultValue={query.sort ?? 'name'}>
              <option value="name">Name (A–Z)</option>
              <option value="updated">Recently updated</option>
            </select>
          </div>

          <div className="dashboard-filter-form__field dashboard-filter-form__field--actions">
            <span className="dashboard-filter-form__field-spacer" aria-hidden="true">
              Actions
            </span>
            <div className="dashboard-filter-form__actions">
              <button className="btn btn-ghost" type="submit">
                Apply filters
              </button>
              {filtersActive ? (
                <Link className="btn btn-ghost" href="/platform/organizations">
                  Clear all
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </form>

      {apiReachable && !forbidden ? (
        <p className="dashboard-result-summary">
          Showing {organizations.length} organization{organizations.length === 1 ? '' : 's'}
          {filtersActive ? ' matching your filters' : ''}
        </p>
      ) : null}

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
          title={filtersActive ? 'No organizations matched your filters' : 'No organizations found'}
          body={
            filtersActive
              ? 'Try a different search term, choose All organizations, or clear filters to see everything.'
              : 'Create or seed organizations before reviewing the platform admin list.'
          }
        />
      )}
    </div>
  );
}
