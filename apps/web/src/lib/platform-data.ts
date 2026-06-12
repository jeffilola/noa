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

export async function fetchPlatformOrganizations(search?: string) {
  const query = new URLSearchParams();
  if (search?.trim()) query.set('search', search.trim());
  const suffix = query.size > 0 ? `?${query.toString()}` : '';

  const organizations = await apiFetch<PlatformOrganization[]>(`/organizations${suffix}`).catch(
    () => null,
  );

  return {
    organizations: organizations ?? [],
    apiReachable: organizations !== null,
  };
}
