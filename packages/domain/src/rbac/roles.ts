/** Canonical Noa RBAC roles. */
export const NoaRole = {
  IDENTITY_HOLDER: 'identity_holder',
  ORG_ADMIN: 'org_admin',
  SECURITY_ADMIN: 'security_admin',
  COMPLIANCE_AUDITOR: 'compliance_auditor',
  INTEGRATION_ADMIN: 'integration_admin',
  PLATFORM_ADMIN: 'platform_admin',
} as const;

export type NoaRoleKey = (typeof NoaRole)[keyof typeof NoaRole];

export const NOA_ROLE_VALUES = Object.values(NoaRole) as NoaRoleKey[];

export const RoleScope = {
  PLATFORM: 'platform',
  ORGANIZATION: 'organization',
} as const;

export type RoleScopeName = (typeof RoleScope)[keyof typeof RoleScope];

export interface RoleDefinition {
  key: NoaRoleKey;
  name: string;
  description: string;
  scope: RoleScopeName;
}

export const ROLE_DEFINITIONS: Record<NoaRoleKey, RoleDefinition> = {
  [NoaRole.IDENTITY_HOLDER]: {
    key: NoaRole.IDENTITY_HOLDER,
    name: 'Identity Holder',
    description: 'End user managing personal identity, credentials visibility, devices, and privacy.',
    scope: RoleScope.PLATFORM,
  },
  [NoaRole.ORG_ADMIN]: {
    key: NoaRole.ORG_ADMIN,
    name: 'Organization Administrator',
    description: 'Manages organization users, credential inventory visibility, and org reporting.',
    scope: RoleScope.ORGANIZATION,
  },
  [NoaRole.SECURITY_ADMIN]: {
    key: NoaRole.SECURITY_ADMIN,
    name: 'Security Administrator',
    description: 'Monitors credentials, suspends or revokes lifecycle state, and investigates activity.',
    scope: RoleScope.ORGANIZATION,
  },
  [NoaRole.COMPLIANCE_AUDITOR]: {
    key: NoaRole.COMPLIANCE_AUDITOR,
    name: 'Compliance Auditor',
    description: 'Read-only access to audit trails, lifecycle history, and compliance exports.',
    scope: RoleScope.ORGANIZATION,
  },
  [NoaRole.INTEGRATION_ADMIN]: {
    key: NoaRole.INTEGRATION_ADMIN,
    name: 'Integration Administrator',
    description: 'Configures provider connections, webhooks, and monitors integration health.',
    scope: RoleScope.ORGANIZATION,
  },
  [NoaRole.PLATFORM_ADMIN]: {
    key: NoaRole.PLATFORM_ADMIN,
    name: 'Platform Administrator',
    description: 'Operates the Noa platform across tenants, providers, billing, and health.',
    scope: RoleScope.PLATFORM,
  },
};

export function isNoaRoleKey(value: string): value is NoaRoleKey {
  return NOA_ROLE_VALUES.includes(value as NoaRoleKey);
}

export function assertNoaRoleKey(role: string): NoaRoleKey {
  if (!isNoaRoleKey(role)) {
    throw new Error(`Invalid role: ${role}. Expected one of: ${NOA_ROLE_VALUES.join(', ')}`);
  }
  return role;
}

/** Maps legacy Membership.role strings to Noa RBAC roles. */
export function legacyMembershipRoleToNoaRole(membershipRole: string): NoaRoleKey | undefined {
  const normalized = membershipRole.toLowerCase();

  if (normalized === 'admin' || normalized === 'owner') return NoaRole.ORG_ADMIN;
  if (normalized === 'security') return NoaRole.SECURITY_ADMIN;
  if (normalized === 'compliance' || normalized === 'auditor') return NoaRole.COMPLIANCE_AUDITOR;
  if (normalized === 'integration' || normalized === 'operator') return NoaRole.INTEGRATION_ADMIN;

  return undefined;
}

export const PLATFORM_SCOPE_KEY = '__platform__';

export function userRoleScopeKey(organizationId?: string | null): string {
  return organizationId ?? PLATFORM_SCOPE_KEY;
}
