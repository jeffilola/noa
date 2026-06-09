import { NoaRole, type NoaRoleKey } from './roles.js';

/** Fine-grained permissions enforced by API guards and dashboard navigation. */
export const Permission = {
  // Identity Holder
  PROFILE_VIEW: 'profile:view',
  ORGANIZATIONS_VIEW: 'organizations:view',
  CREDENTIALS_VIEW_OWN: 'credentials:view:own',
  DEVICES_MANAGE: 'devices:manage',
  PRIVACY_EXPORT: 'privacy:export',
  PRIVACY_SETTINGS: 'privacy:settings',

  // Organization Administrator
  ORG_USERS_MANAGE: 'org:users:manage',
  CREDENTIALS_INVENTORY_VIEW: 'credentials:inventory:view',
  CREDENTIALS_PROVISION_REQUEST: 'credentials:provision:request',
  REPORTS_VIEW: 'reports:view',
  AUDIT_VIEW_ORG: 'audit:view:org',

  // Security Administrator
  USERS_VIEW_ORG: 'users:view:org',
  CREDENTIALS_VIEW_ORG: 'credentials:view:org',
  CREDENTIALS_SUSPEND: 'credentials:suspend',
  CREDENTIALS_REVOKE: 'credentials:revoke',
  ACTIVITY_INVESTIGATE: 'activity:investigate',
  AUDIT_VIEW: 'audit:view',
  COMPLIANCE_REPORTS_GENERATE: 'compliance:reports:generate',

  // Compliance Auditor
  ACCESS_READONLY: 'access:readonly',
  REPORTS_EXPORT: 'reports:export',
  CREDENTIALS_LIFECYCLE_VIEW: 'credentials:lifecycle:view',

  // Integration Administrator
  INTEGRATIONS_HID_CONFIGURE: 'integrations:hid:configure',
  INTEGRATIONS_PROVIDERS_CONFIGURE: 'integrations:providers:configure',
  WEBHOOKS_MANAGE: 'webhooks:manage',
  INTEGRATIONS_SYNC_MONITOR: 'integrations:sync:monitor',
  INTEGRATIONS_HEALTH_VIEW: 'integrations:health:view',

  // Platform Administrator
  PLATFORM_ORGANIZATIONS_MANAGE: 'platform:organizations:manage',
  PLATFORM_TENANTS_MANAGE: 'platform:tenants:manage',
  PLATFORM_HEALTH_VIEW: 'platform:health:view',
  PLATFORM_BILLING_MANAGE: 'platform:billing:manage',
  PLATFORM_PROVIDERS_MANAGE: 'platform:providers:manage',
} as const;

export type PermissionName = (typeof Permission)[keyof typeof Permission];

export const PERMISSION_VALUES = Object.values(Permission) as PermissionName[];

export const IDENTITY_HOLDER_PERMISSIONS: PermissionName[] = [
  Permission.PROFILE_VIEW,
  Permission.ORGANIZATIONS_VIEW,
  Permission.CREDENTIALS_VIEW_OWN,
  Permission.DEVICES_MANAGE,
  Permission.PRIVACY_EXPORT,
  Permission.PRIVACY_SETTINGS,
];

export const ROLE_PERMISSION_MAP: Record<NoaRoleKey, PermissionName[]> = {
  [NoaRole.IDENTITY_HOLDER]: IDENTITY_HOLDER_PERMISSIONS,
  [NoaRole.ORG_ADMIN]: [
    ...IDENTITY_HOLDER_PERMISSIONS,
    Permission.ORG_USERS_MANAGE,
    Permission.CREDENTIALS_INVENTORY_VIEW,
    Permission.CREDENTIALS_PROVISION_REQUEST,
    Permission.REPORTS_VIEW,
    Permission.AUDIT_VIEW_ORG,
    Permission.INTEGRATIONS_HEALTH_VIEW,
  ],
  [NoaRole.SECURITY_ADMIN]: [
    ...IDENTITY_HOLDER_PERMISSIONS,
    Permission.USERS_VIEW_ORG,
    Permission.CREDENTIALS_VIEW_ORG,
    Permission.CREDENTIALS_SUSPEND,
    Permission.CREDENTIALS_REVOKE,
    Permission.ACTIVITY_INVESTIGATE,
    Permission.AUDIT_VIEW,
    Permission.COMPLIANCE_REPORTS_GENERATE,
  ],
  [NoaRole.COMPLIANCE_AUDITOR]: [
    ...IDENTITY_HOLDER_PERMISSIONS,
    Permission.ACCESS_READONLY,
    Permission.REPORTS_EXPORT,
    Permission.AUDIT_VIEW,
    Permission.CREDENTIALS_LIFECYCLE_VIEW,
  ],
  [NoaRole.INTEGRATION_ADMIN]: [
    ...IDENTITY_HOLDER_PERMISSIONS,
    Permission.INTEGRATIONS_HID_CONFIGURE,
    Permission.INTEGRATIONS_PROVIDERS_CONFIGURE,
    Permission.WEBHOOKS_MANAGE,
    Permission.INTEGRATIONS_SYNC_MONITOR,
    Permission.INTEGRATIONS_HEALTH_VIEW,
  ],
  [NoaRole.PLATFORM_ADMIN]: [
    ...IDENTITY_HOLDER_PERMISSIONS,
    Permission.PLATFORM_ORGANIZATIONS_MANAGE,
    Permission.PLATFORM_TENANTS_MANAGE,
    Permission.PLATFORM_HEALTH_VIEW,
    Permission.PLATFORM_BILLING_MANAGE,
    Permission.PLATFORM_PROVIDERS_MANAGE,
    Permission.AUDIT_VIEW,
    Permission.CREDENTIALS_VIEW_ORG,
  ],
};

export interface AccessContext {
  roles?: NoaRoleKey[];
  permissions?: PermissionName[];
  organizationId?: string;
  isReadOnly?: boolean;
}

export function permissionsForRoles(roles: Iterable<NoaRoleKey>): PermissionName[] {
  const set = new Set<PermissionName>();

  for (const role of roles) {
    for (const permission of ROLE_PERMISSION_MAP[role] ?? []) {
      set.add(permission);
    }
  }

  return [...set];
}

export function hasPermission(
  granted: PermissionName[] | AccessContext,
  required: PermissionName,
): boolean {
  const permissions = Array.isArray(granted) ? granted : granted.permissions ?? permissionsForRoles(granted.roles ?? []);
  return permissions.includes(required);
}

export function hasAnyPermission(granted: PermissionName[], required: PermissionName[]): boolean {
  return required.some((permission) => granted.includes(permission));
}

export function hasRole(roles: NoaRoleKey[], required: NoaRoleKey | NoaRoleKey[]): boolean {
  const requiredRoles = Array.isArray(required) ? required : [required];
  return requiredRoles.some((role) => roles.includes(role));
}

export function isReadOnlyAccess(permissions: PermissionName[]): boolean {
  return (
    permissions.includes(Permission.ACCESS_READONLY) &&
    !permissions.includes(Permission.ORG_USERS_MANAGE) &&
    !permissions.includes(Permission.CREDENTIALS_SUSPEND)
  );
}
