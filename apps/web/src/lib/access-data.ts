import { apiFetch } from '@/lib/api';
import {
  DASHBOARD_NAVIGATION,
  filterNavItems,
  type DashboardNavConfig,
  type PermissionName,
} from '@/lib/rbac/navigation';
import type { OrgSummary } from '@/lib/org-data';

export interface UserAccessSummary {
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
  const orgAdminAssignment = access.roleAssignments.find(
    (assignment) => assignment.role === 'org_admin' && assignment.organization?.id,
  );
  if (orgAdminAssignment?.organization) {
    return orgAdminAssignment.organization;
  }

  return null;
}

export function canAccessOrgDashboard(access: UserAccessSummary | null): boolean {
  if (!access) return false;
  if (!resolveOrgContextFromAccess(access)) return false;

  const permissions = access.permissions as PermissionName[];
  const visibleItems = filterNavItems(DASHBOARD_NAVIGATION.org_admin, permissions);
  return visibleItems.length > 0;
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
