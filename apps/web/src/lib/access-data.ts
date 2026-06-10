import { apiFetch } from '@/lib/api';
import {
  DASHBOARD_NAVIGATION,
  filterNavItems,
  type DashboardNavConfig,
  type PermissionName,
} from '@/lib/rbac/navigation';
import type { OrgSummary } from '@/lib/org-data';

export interface UserAccessSummary {
  clerkUserId?: string;
  userId: string;
  organizationId?: string;
  roles: string[];
  permissions: string[];
  isReadOnly: boolean;
  isPlatformAdmin: boolean;
  dashboards: DashboardNavConfig[];
  roleAssignments: Array<{
    role: string;
    organization?: OrgSummary | null;
  }>;
}

export async function fetchUserAccess(): Promise<UserAccessSummary | null> {
  try {
    return await apiFetch<UserAccessSummary>('/users/me/access');
  } catch {
    return null;
  }
}

export function resolveOrgContextFromAccess(access: UserAccessSummary): OrgSummary | null {
  const assignments = access.roleAssignments ?? [];

  const orgAdminAssignment = assignments.find(
    (assignment) => assignment.role === 'org_admin' && assignment.organization?.id,
  );
  if (orgAdminAssignment?.organization) {
    return orgAdminAssignment.organization;
  }

  if (access.roles?.includes('org_admin')) {
    const orgFromAssignment = assignments.find((assignment) => assignment.organization?.id);
    if (orgFromAssignment?.organization) {
      return orgFromAssignment.organization;
    }
  }

  const orgScopedAssignment = assignments.find((assignment) => assignment.organization?.id);
  if (orgScopedAssignment?.organization) {
    return orgScopedAssignment.organization;
  }

  return null;
}

export function canAccessOrgDashboard(access: UserAccessSummary | null): boolean {
  if (!access) return false;

  if (access.roles?.includes('org_admin')) return true;
  if (access.roleAssignments?.some((assignment) => assignment.role === 'org_admin')) return true;
  if (access.dashboards?.some((dashboard) => dashboard.basePath === '/org')) return true;

  const permissions = (access.permissions ?? []) as PermissionName[];
  return filterNavItems(DASHBOARD_NAVIGATION.org_admin, permissions).length > 0;
}

export function dashboardSwitcherLinks(access: UserAccessSummary | null) {
  const links: Array<{ label: string; basePath: string }> = [
    { label: 'Identity Holder', basePath: '/user' },
  ];

  if (!access?.dashboards?.length) return links;

  for (const dashboard of access.dashboards) {
    if (dashboard.basePath === '/user') continue;
    links.push({ label: dashboard.label, basePath: dashboard.basePath });
  }

  return links;
}
