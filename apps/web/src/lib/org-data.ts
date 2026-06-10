import { apiFetch } from '@/lib/api';
import {
  canAccessOrgDashboard,
  fetchUserAccess,
  resolveOrgContextFromAccess,
  type UserAccessSummary,
} from '@/lib/access-data';
import type { UserCredential, UserMembership } from '@/lib/user-types';

export const ORG_ADMIN_ACCESS_EMPTY = {
  title: 'No organization admin access',
  body: 'You need an Org Admin role on an organization to view this page. In local dev, set DEMO_CLERK_USER_ID in packages/database/.env to your Clerk user id, run pnpm db:seed, restart the API and web servers, and add CLERK_SECRET_KEY to both apps/api/.env and apps/web/.env.local.',
} as const;

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

export interface OrgIntegrationProvider {
  id: string;
  name: string;
  adapterKey: string;
}

export interface OrgIntegrationConnection {
  id: string;
  status: string;
  apiBaseUrl: string;
  lastTestedAt?: string | null;
  lastError?: string | null;
}

export interface OrgIntegrationRow {
  provider: OrgIntegrationProvider;
  connection: OrgIntegrationConnection | null;
}

export interface AccessEventRecord {
  id: string;
  organizationId: string;
  userId: string;
  credentialId: string | null;
  externalEventId: string | null;
  occurredAt: string;
  locationLabel: string;
  readerLabel: string | null;
  direction: string;
  source: string;
  createdAt: string;
  organization?: { id: string; name: string; slug: string };
}

export interface AccessSummary {
  lastAccess: {
    occurredAt: string;
    locationLabel: string;
    readerLabel: string | null;
    direction: string;
  } | null;
  recentCount: number;
}

function orgFromMemberships(memberships: UserMembership[]): OrgSummary | null {
  const orgAdminMembership =
    memberships.find((membership) => membership.role === 'org_admin' && membership.organization?.id) ??
    memberships.find((membership) => membership.organization?.slug === 'demo-org') ??
    memberships.find((membership) => membership.organization?.id);

  return orgAdminMembership?.organization ?? null;
}

export async function resolveOrgContext(): Promise<OrgSummary | null> {
  const access = await fetchUserAccess();
  if (!access) return null;

  const fromAccess = resolveOrgContextFromAccess(access);
  if (fromAccess) return fromAccess;

  if (!canAccessOrgDashboard(access)) return null;

  try {
    const memberships = await apiFetch<UserMembership[]>('/users/me/memberships');
    const fromMemberships = orgFromMemberships(memberships);
    if (fromMemberships) return fromMemberships;
  } catch {
    // fall through to organizationId lookup
  }

  if (access.organizationId) {
    const { overview } = await fetchOrgOverview(access.organizationId);
    if (overview) {
      return { id: overview.id, name: overview.name, slug: overview.slug };
    }
  }

  return null;
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

export async function fetchOrgCredentials(organizationId: string, userId?: string) {
  const query = new URLSearchParams({
    organizationId,
    all: 'true',
  });
  if (userId) query.set('userId', userId);
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

export async function fetchOrgIntegrations(organizationId: string) {
  const integrations = await apiFetch<OrgIntegrationRow[]>(
    `/organizations/${organizationId}/integrations`,
    { organizationId },
  ).catch(() => null);

  return {
    integrations: integrations ?? [],
    apiReachable: integrations !== null,
  };
}

export async function fetchOrgAccessEvents(
  organizationId: string,
  options?: { userId?: string; limit?: number },
) {
  const query = new URLSearchParams();
  if (options?.userId) query.set('userId', options.userId);
  if (options?.limit) query.set('limit', String(options.limit));

  const suffix = query.size > 0 ? `?${query.toString()}` : '';
  const events = await apiFetch<AccessEventRecord[]>(
    `/organizations/${organizationId}/access-events${suffix}`,
    { organizationId },
  ).catch(() => null);

  return {
    events: events ?? [],
    apiReachable: events !== null,
  };
}

export async function fetchOrgAccessSummary(organizationId: string, userId: string) {
  const summary = await apiFetch<AccessSummary>(
    `/organizations/${organizationId}/users/${userId}/access-summary`,
    { organizationId },
  ).catch(() => null);

  return {
    summary,
    apiReachable: summary !== null,
  };
}

export async function fetchHolderAccessEvents(limit = 50) {
  const query = new URLSearchParams({ limit: String(limit) });
  const events = await apiFetch<AccessEventRecord[]>(`/users/me/access-events?${query.toString()}`).catch(
    () => null,
  );

  return {
    events: events ?? [],
    apiReachable: events !== null,
  };
}

export type { UserAccessSummary };
