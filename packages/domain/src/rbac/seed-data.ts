import { assertNoaPermissionKey } from './boundary.js';
import { Permission, ROLE_PERMISSION_MAP, type PermissionName } from './permissions.js';
import { NoaRole, ROLE_DEFINITIONS, type NoaRoleKey } from './roles.js';

export type PermissionCategoryName =
  | 'identity'
  | 'organization'
  | 'credential'
  | 'security'
  | 'compliance'
  | 'integration'
  | 'platform';

export interface PermissionSeed {
  key: PermissionName;
  name: string;
  description: string;
  category: PermissionCategoryName;
}

export interface RoleSeed {
  key: NoaRoleKey;
  name: string;
  description: string;
  scope: 'platform' | 'organization';
  permissionKeys: PermissionName[];
}

const PERMISSION_META: Record<
  PermissionName,
  { name: string; description: string; category: PermissionCategoryName }
> = {
  [Permission.PROFILE_VIEW]: {
    name: 'View profile',
    description: 'View own identity profile.',
    category: 'identity',
  },
  [Permission.ORGANIZATIONS_VIEW]: {
    name: 'View organizations',
    description: 'View organizations the user belongs to.',
    category: 'identity',
  },
  [Permission.CREDENTIALS_VIEW_OWN]: {
    name: 'View credentials',
    description: 'View credentials assigned to the signed-in user.',
    category: 'credential',
  },
  [Permission.DEVICES_MANAGE]: {
    name: 'Manage devices',
    description: 'Register and deactivate personal devices.',
    category: 'identity',
  },
  [Permission.PRIVACY_EXPORT]: {
    name: 'Export personal data',
    description: 'Export personal data for GDPR requests.',
    category: 'identity',
  },
  [Permission.PRIVACY_SETTINGS]: {
    name: 'Privacy settings',
    description: 'Manage privacy and data deletion preferences.',
    category: 'identity',
  },
  [Permission.ORG_USERS_MANAGE]: {
    name: 'Manage organization users',
    description: 'Invite, remove, and assign roles for organization members.',
    category: 'organization',
  },
  [Permission.CREDENTIALS_INVENTORY_VIEW]: {
    name: 'View credential inventory',
    description: 'View organization credential inventory (visibility only).',
    category: 'credential',
  },
  [Permission.CREDENTIALS_PROVISION_REQUEST]: {
    name: 'Request credential provisioning',
    description: 'Request provisioning from a connected provider; Noa does not issue credentials.',
    category: 'credential',
  },
  [Permission.REPORTS_VIEW]: {
    name: 'View reports',
    description: 'View organization operational reports.',
    category: 'organization',
  },
  [Permission.AUDIT_VIEW_ORG]: {
    name: 'View audit activity',
    description: 'View organization-scoped audit activity.',
    category: 'organization',
  },
  [Permission.USERS_VIEW_ORG]: {
    name: 'View all users',
    description: 'View all users within the organization scope.',
    category: 'security',
  },
  [Permission.CREDENTIALS_VIEW_ORG]: {
    name: 'View all credentials',
    description: 'View all credentials within the organization scope.',
    category: 'security',
  },
  [Permission.CREDENTIALS_SUSPEND]: {
    name: 'Suspend credentials',
    description: 'Suspend credential lifecycle state (orchestration only).',
    category: 'security',
  },
  [Permission.CREDENTIALS_REVOKE]: {
    name: 'Revoke credentials',
    description: 'Revoke credential lifecycle state (orchestration only).',
    category: 'security',
  },
  [Permission.ACTIVITY_INVESTIGATE]: {
    name: 'Investigate activity',
    description: 'Investigate security-relevant activity within scope.',
    category: 'security',
  },
  [Permission.AUDIT_VIEW]: {
    name: 'Access audit logs',
    description: 'Access audit logs within authorized scope.',
    category: 'security',
  },
  [Permission.COMPLIANCE_REPORTS_GENERATE]: {
    name: 'Generate compliance reports',
    description: 'Generate compliance reports from audit and lifecycle data.',
    category: 'compliance',
  },
  [Permission.ACCESS_READONLY]: {
    name: 'Read-only access',
    description: 'Read-only access to compliance views; no mutating actions.',
    category: 'compliance',
  },
  [Permission.REPORTS_EXPORT]: {
    name: 'Export reports',
    description: 'Export compliance and audit reports.',
    category: 'compliance',
  },
  [Permission.CREDENTIALS_LIFECYCLE_VIEW]: {
    name: 'Review credential lifecycle history',
    description: 'Review credential lifecycle history and state transitions.',
    category: 'compliance',
  },
  [Permission.INTEGRATIONS_HID_CONFIGURE]: {
    name: 'Configure HID integrations',
    description: 'Configure HID Origo and related provider connections.',
    category: 'integration',
  },
  [Permission.INTEGRATIONS_PROVIDERS_CONFIGURE]: {
    name: 'Configure provider connections',
    description: 'Configure credential provider connections for an organization.',
    category: 'integration',
  },
  [Permission.WEBHOOKS_MANAGE]: {
    name: 'Manage webhooks',
    description: 'Manage inbound and outbound integration webhooks.',
    category: 'integration',
  },
  [Permission.INTEGRATIONS_SYNC_MONITOR]: {
    name: 'Monitor sync status',
    description: 'Monitor provider synchronization status.',
    category: 'integration',
  },
  [Permission.INTEGRATIONS_HEALTH_VIEW]: {
    name: 'View integration health',
    description: 'View integration health dashboards and alerts.',
    category: 'integration',
  },
  [Permission.PLATFORM_ORGANIZATIONS_MANAGE]: {
    name: 'Manage organizations',
    description: 'Create and manage customer organizations.',
    category: 'platform',
  },
  [Permission.PLATFORM_TENANTS_MANAGE]: {
    name: 'Manage tenants',
    description: 'Manage tenant configuration and platform users.',
    category: 'platform',
  },
  [Permission.PLATFORM_HEALTH_VIEW]: {
    name: 'Monitor platform health',
    description: 'Monitor platform-wide health and availability.',
    category: 'platform',
  },
  [Permission.PLATFORM_BILLING_MANAGE]: {
    name: 'Manage billing',
    description: 'Manage platform billing configuration.',
    category: 'platform',
  },
  [Permission.PLATFORM_PROVIDERS_MANAGE]: {
    name: 'Manage providers',
    description: 'Manage global credential provider catalog.',
    category: 'platform',
  },
};

function buildPermissionSeeds(): PermissionSeed[] {
  return Object.values(Permission).map((key) => {
    assertNoaPermissionKey(key);
    const meta = PERMISSION_META[key];
    return { key, ...meta };
  });
}

function buildRoleSeeds(): RoleSeed[] {
  return Object.values(NoaRole).map((key) => {
    const definition = ROLE_DEFINITIONS[key];
    return {
      key,
      name: definition.name,
      description: definition.description,
      scope: definition.scope,
      permissionKeys: ROLE_PERMISSION_MAP[key],
    };
  });
}

export const RBAC_PERMISSION_SEEDS = buildPermissionSeeds();
export const RBAC_ROLE_SEEDS = buildRoleSeeds();
