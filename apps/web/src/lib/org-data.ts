import { apiFetch } from '@/lib/api';
import type { UserCredential } from '@/lib/user-types';

export interface OrgSummary {
  id: string;
  name: string;
  slug: string;
}

export interface OrgOverview extends OrgSummary {
  memberCount: number;
  activeMemberCount: number;
  credentialCount: number;
  activeCredentialCount: number;
}

export interface UserAccessSummary {
  organizationId?: string;
  roles: string[];
  permissions: string[];
  roleAssignments: Array<{
    role: string;
    organization?: OrgSummary | null;
  }>;
}

export async function resolveOrgContext(): Promise<OrgSummary | null> {
  try {
    const access = await apiFetch<UserAccessSummary>('/users/me/access');
    const orgAdminAssignment = access.roleAssignments.find(
      (assignment) => assignment.role === 'org_admin' && assignment.organization?.id,
    );
    if (orgAdminAssignment?.organization) {
      return orgAdminAssignment.organization;
    }

    if (access.organizationId && access.permissions.includes('reports:view')) {
      const overview = await apiFetch<OrgOverview>(
        `/organizations/${access.organizationId}/overview`,
        { organizationId: access.organizationId },
      ).catch(() => null);
      if (overview) {
        return { id: overview.id, name: overview.name, slug: overview.slug };
      }
    }

    return null;
  } catch {
    return null;
  }
}

export async function fetchOrgOverview(organizationId: string) {
  const overview = await apiFetch<OrgOverview>(`/organizations/${organizationId}/overview`, {
    organizationId,
  }).catch(() => null);

  return {
    overview,
    apiReachable: overview !== null,
  };
}

export async function fetchOrgCredentials(organizationId: string) {
  const query = new URLSearchParams({
    organizationId,
    all: 'true',
  });
  const credentials = await apiFetch<UserCredential[]>(`/credentials?${query.toString()}`, {
    organizationId,
  }).catch(() => null);

  return {
    credentials: credentials ?? [],
    apiReachable: credentials !== null,
  };
}
