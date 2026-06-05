import type { NoaRoleKey, PermissionName } from '@noa/domain';

export interface AuthContext {
  clerkUserId: string;
  userId: string;
  organizationId?: string;
  orgId?: string;
  clerkOrgId?: string;
  roles: NoaRoleKey[];
  permissions: PermissionName[];
  isReadOnly: boolean;
  isPlatformAdmin: boolean;
}

declare module 'express' {
  interface Request {
    auth?: AuthContext;
  }
}
