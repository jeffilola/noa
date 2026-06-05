import { Injectable } from '@nestjs/common';
import type { NoaRoleKey, PermissionName } from '@noa/domain';
import { PrismaService } from '../prisma/prisma.service';
import { RbacService } from './rbac.service';

export interface ResolvedSessionAccess {
  userId: string;
  organizationId?: string;
  clerkOrgId?: string;
  roles: NoaRoleKey[];
  permissions: PermissionName[];
  isReadOnly: boolean;
  isPlatformAdmin: boolean;
}

@Injectable()
export class AccessService {
  constructor(
    private readonly rbac: RbacService,
    private readonly prisma: PrismaService,
  ) {}

  async resolveForUser(
    userId: string,
    options?: { organizationId?: string; clerkOrgId?: string },
  ): Promise<ResolvedSessionAccess> {
    let organizationId = options?.organizationId;

    if (!organizationId && options?.clerkOrgId) {
      const org = await this.prisma.organization.findUnique({
        where: { clerkOrgId: options.clerkOrgId },
        select: { id: true },
      });
      organizationId = org?.id;
    }

    const access = await this.rbac.resolveAccess(userId, organizationId);

    return {
      userId: access.userId,
      organizationId: access.organizationId,
      clerkOrgId: options?.clerkOrgId,
      roles: access.roles,
      permissions: access.permissions,
      isReadOnly: access.isReadOnly,
      isPlatformAdmin: access.isPlatformAdmin,
    };
  }

  listMembershipRoles(userId: string) {
    return this.rbac.listUserRoleAssignments(userId);
  }
}
