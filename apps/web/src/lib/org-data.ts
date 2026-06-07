import { apiFetch } from '@/lib/api';
import { fetchUserAccess, resolveOrgContextFromAccess, type UserAccessSummary } from '@/lib/access-data';
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

export interface OrgAuditLog {
  id: string;
  action: string;
  organizationId: string | null;
  resourceType: string;
  resourceId: string | null;
  actorUserId: string | null;
  createdAt: string;
}

export interface OrgMemberUser {
  id: string;
  clerkUserId: string;
  isDisabled: boolean;
}

export interface OrgMember {
  id: string;
  userId: string;
  organizationId: string;
  role: string;
  status: string;
  joinedAt: string | null;
  invitedAt: string | null;
  user: OrgMemberUser;
}

export async function resolveOrgContext(): Promise<OrgSummary | null> {
  const access = await fetchUserAccess();
  if (!access) return null;
  return resolveOrgContextFromAccess(access);
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

export async function fetchOrgMembers(organizationId: string) {
  const members = await apiFetch<OrgMember[]>(`/organizations/${organizationId}/members`, {
    organizationId,
  }).catch(() => null);

  return {
    members: members ?? [],
    apiReachable: members !== null,
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

export async function fetchOrgAuditLogs(organizationId: string, limit = 50) {
  const query = new URLSearchParams({
    organizationId,
    limit: String(limit),
  });
  const logs = await apiFetch<OrgAuditLog[]>(`/audit/logs?${query.toString()}`, {
    organizationId,
  }).catch(() => null);

  return {
    logs: logs ?? [],
    apiReachable: logs !== null,
  };
}

export type { UserAccessSummary };
