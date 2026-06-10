import { NoaRole, type NoaRoleKey } from './roles.js';
import { Permission, type PermissionName } from './permissions.js';

export interface DashboardNavItem {
  href: string;
  label: string;
  requiredPermission?: PermissionName;
}

export interface DashboardNavConfig {
  role: NoaRoleKey;
  label: string;
  basePath: string;
  items: DashboardNavItem[];
}

export const DASHBOARD_NAVIGATION: Record<NoaRoleKey, DashboardNavConfig> = {
  [NoaRole.IDENTITY_HOLDER]: {
    role: NoaRole.IDENTITY_HOLDER,
    label: 'Identity Holder',
    basePath: '/user',
    items: [
      { href: '/user/identity', label: 'My Identity', requiredPermission: Permission.PROFILE_VIEW },
      { href: '/user/credentials', label: 'My Credentials', requiredPermission: Permission.CREDENTIALS_VIEW_OWN },
      { href: '/user/organizations', label: 'Organizations', requiredPermission: Permission.ORGANIZATIONS_VIEW },
      { href: '/user/devices', label: 'Devices', requiredPermission: Permission.DEVICES_MANAGE },
      { href: '/user/security', label: 'Security', requiredPermission: Permission.PRIVACY_SETTINGS },
    ],
  },
  [NoaRole.ORG_ADMIN]: {
    role: NoaRole.ORG_ADMIN,
    label: 'Organization Admin',
    basePath: '/org',
    items: [
      { href: '/org', label: 'Overview', requiredPermission: Permission.REPORTS_VIEW },
      { href: '/org/users', label: 'Users', requiredPermission: Permission.ORG_USERS_MANAGE },
      { href: '/org/access', label: 'Site access', requiredPermission: Permission.ORG_USERS_MANAGE },
      { href: '/org/credentials', label: 'Credentials', requiredPermission: Permission.CREDENTIALS_INVENTORY_VIEW },
      { href: '/org/integrations', label: 'Integrations', requiredPermission: Permission.INTEGRATIONS_HEALTH_VIEW },
      { href: '/org/reports', label: 'Reports', requiredPermission: Permission.REPORTS_VIEW },
      { href: '/org/audit', label: 'Audit Logs', requiredPermission: Permission.AUDIT_VIEW_ORG },
    ],
  },
  [NoaRole.SECURITY_ADMIN]: {
    role: NoaRole.SECURITY_ADMIN,
    label: 'Security Admin',
    basePath: '/security-admin',
    items: [
      { href: '/security-admin', label: 'Security Center', requiredPermission: Permission.ACTIVITY_INVESTIGATE },
      { href: '/security-admin/credentials', label: 'Credential Monitoring', requiredPermission: Permission.CREDENTIALS_VIEW_ORG },
      { href: '/security-admin/revocations', label: 'Revocations', requiredPermission: Permission.CREDENTIALS_REVOKE },
      { href: '/security-admin/audit', label: 'Audit Logs', requiredPermission: Permission.AUDIT_VIEW },
      { href: '/security-admin/compliance', label: 'Compliance', requiredPermission: Permission.COMPLIANCE_REPORTS_GENERATE },
    ],
  },
  [NoaRole.COMPLIANCE_AUDITOR]: {
    role: NoaRole.COMPLIANCE_AUDITOR,
    label: 'Compliance',
    basePath: '/compliance',
    items: [
      { href: '/compliance/reports', label: 'Reports', requiredPermission: Permission.REPORTS_EXPORT },
      { href: '/compliance/audit', label: 'Audit Logs', requiredPermission: Permission.AUDIT_VIEW },
      { href: '/compliance/exports', label: 'Exports', requiredPermission: Permission.REPORTS_EXPORT },
    ],
  },
  [NoaRole.INTEGRATION_ADMIN]: {
    role: NoaRole.INTEGRATION_ADMIN,
    label: 'Integration Admin',
    basePath: '/integrations-admin',
    items: [
      { href: '/integrations-admin/providers', label: 'Providers', requiredPermission: Permission.INTEGRATIONS_PROVIDERS_CONFIGURE },
      { href: '/integrations-admin/webhooks', label: 'Webhooks', requiredPermission: Permission.WEBHOOKS_MANAGE },
      { href: '/integrations-admin/sync', label: 'Sync Monitoring', requiredPermission: Permission.INTEGRATIONS_SYNC_MONITOR },
      { href: '/integrations-admin/health', label: 'Integration Health', requiredPermission: Permission.INTEGRATIONS_HEALTH_VIEW },
    ],
  },
  [NoaRole.PLATFORM_ADMIN]: {
    role: NoaRole.PLATFORM_ADMIN,
    label: 'Platform Admin',
    basePath: '/platform',
    items: [
      { href: '/platform/organizations', label: 'Organizations', requiredPermission: Permission.PLATFORM_ORGANIZATIONS_MANAGE },
      { href: '/platform/users', label: 'Users', requiredPermission: Permission.PLATFORM_TENANTS_MANAGE },
      { href: '/platform/providers', label: 'Providers', requiredPermission: Permission.PLATFORM_PROVIDERS_MANAGE },
      { href: '/platform/health', label: 'System Health', requiredPermission: Permission.PLATFORM_HEALTH_VIEW },
      { href: '/platform/billing', label: 'Billing', requiredPermission: Permission.PLATFORM_BILLING_MANAGE },
    ],
  },
};

export function dashboardsForRoles(roles: NoaRoleKey[]): DashboardNavConfig[] {
  const seen = new Set<NoaRoleKey>();
  const dashboards: DashboardNavConfig[] = [];

  for (const role of roles) {
    if (seen.has(role) || role === NoaRole.IDENTITY_HOLDER) continue;
    seen.add(role);
    dashboards.push(DASHBOARD_NAVIGATION[role]);
  }

  return dashboards;
}

export function filterNavItems(
  config: DashboardNavConfig,
  permissions: PermissionName[],
): DashboardNavItem[] {
  return config.items.filter(
    (item) => !item.requiredPermission || permissions.includes(item.requiredPermission),
  );
}
