import { apiFetch } from '@/lib/api';

export interface PlatformOrganization {
  id: string;
  name: string;
  slug: string;
  clerkOrgId: string | null;
  createdAt: string;
  updatedAt: string;
  memberCount: number;
  credentialCount: number;
  providerConnectionCount: number;
}

export type PlatformOrganizationSearchField = 'all' | 'name' | 'clerkOrgId';
export type PlatformOrganizationFilter =
  | 'all'
  | 'hasMembers'
  | 'hasCredentials'
  | 'hasProviders'
  | 'missingClerkOrg';
export type PlatformOrganizationSort = 'name' | 'updated';

export interface PlatformOrganizationQuery {
  search?: string;
  field?: PlatformOrganizationSearchField;
  filter?: PlatformOrganizationFilter;
  sort?: PlatformOrganizationSort;
}

const SEARCH_FIELDS = new Set<PlatformOrganizationSearchField>(['all', 'name', 'clerkOrgId']);
const FILTERS = new Set<PlatformOrganizationFilter>([
  'all',
  'hasMembers',
  'hasCredentials',
  'hasProviders',
  'missingClerkOrg',
]);
const SORTS = new Set<PlatformOrganizationSort>(['name', 'updated']);

export function parsePlatformOrganizationQuery(
  params: Record<string, string | undefined>,
): PlatformOrganizationQuery {
  const field = params.field;
  const filter = params.filter;
  const sort = params.sort;

  return {
    search: params.search?.trim() || undefined,
    field: field && SEARCH_FIELDS.has(field as PlatformOrganizationSearchField)
      ? (field as PlatformOrganizationSearchField)
      : 'all',
    filter: filter && FILTERS.has(filter as PlatformOrganizationFilter)
      ? (filter as PlatformOrganizationFilter)
      : 'all',
    sort: sort && SORTS.has(sort as PlatformOrganizationSort)
      ? (sort as PlatformOrganizationSort)
      : 'name',
  };
}

export function hasActivePlatformOrganizationFilters(query: PlatformOrganizationQuery) {
  return Boolean(
    query.search ||
      (query.field && query.field !== 'all') ||
      (query.filter && query.filter !== 'all') ||
      (query.sort && query.sort !== 'name'),
  );
}

export async function fetchPlatformOrganizations(query: PlatformOrganizationQuery = {}) {
  const params = new URLSearchParams();
  if (query.search) params.set('search', query.search);
  if (query.field && query.field !== 'all') params.set('field', query.field);
  if (query.filter && query.filter !== 'all') params.set('filter', query.filter);
  if (query.sort && query.sort !== 'name') params.set('sort', query.sort);
  const suffix = params.size > 0 ? `?${params.toString()}` : '';

  try {
    const organizations = await apiFetch<PlatformOrganization[]>(`/organizations${suffix}`);
    return {
      organizations,
      apiReachable: true,
      forbidden: false,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    if (message.includes('403')) {
      return {
        organizations: [],
        apiReachable: true,
        forbidden: true,
      };
    }

    return {
      organizations: [],
      apiReachable: false,
      forbidden: false,
    };
  }
}
