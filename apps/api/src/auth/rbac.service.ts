import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
  dashboardsForRoles,
  DASHBOARD_NAVIGATION,
  IDENTITY_HOLDER_PERMISSIONS,
  legacyMembershipRoleToNoaRole,
  NoaRole,
  permissionsForRoles,
  RBAC_PERMISSION_SEEDS,
  RBAC_ROLE_SEEDS,
  type NoaRoleKey,
  type PermissionName,
  userRoleScopeKey,
  isReadOnlyAccess,
} from '@noa/domain';
import { PrismaService } from '../prisma/prisma.service';

export interface ResolvedAccess {
  userId: string;
  organizationId?: string;
  roles: NoaRoleKey[];
  permissions: PermissionName[];
  isReadOnly: boolean;
  isPlatformAdmin: boolean;
  dashboards: ReturnType<typeof dashboardsForRoles>;
  holderNavigation: typeof DASHBOARD_NAVIGATION.identity_holder;
}

export interface AssignRoleInput {
  userId: string;
  roleKey: NoaRoleKey;
  organizationId?: string;
  grantedByUserId?: string;
}

@Injectable()
export class RbacService implements OnModuleInit {
  private readonly logger = new Logger(RbacService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    try {
      await this.syncCatalog();
      this.logger.log('RBAC catalog synced');
    } catch (error) {
      this.logger.warn(`RBAC catalog sync skipped: ${error instanceof Error ? error.message : error}`);
    }
  }

  async syncCatalog(): Promise<void> {
    for (const permission of RBAC_PERMISSION_SEEDS) {
      await this.prisma.permission.upsert({
        where: { key: permission.key },
        update: {
          name: permission.name,
          description: permission.description,
          category: permission.category,
        },
        create: {
          key: permission.key,
          name: permission.name,
          description: permission.description,
          category: permission.category,
        },
      });
    }

    for (const role of RBAC_ROLE_SEEDS) {
      const roleRecord = await this.prisma.role.upsert({
        where: { key: role.key },
        update: {
          name: role.name,
          description: role.description,
          scope: role.scope,
          isSystem: true,
        },
        create: {
          key: role.key,
          name: role.name,
          description: role.description,
          scope: role.scope,
          isSystem: true,
        },
      });

      for (const permissionKey of role.permissionKeys) {
        const permission = await this.prisma.permission.findUniqueOrThrow({
          where: { key: permissionKey },
        });

        await this.prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId: roleRecord.id,
              permissionId: permission.id,
            },
          },
          update: {},
          create: {
            roleId: roleRecord.id,
            permissionId: permission.id,
          },
        });
      }
    }
  }

  async resolveAccess(userId: string, organizationId?: string): Promise<ResolvedAccess> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { isPlatformAdmin: true },
    });

    const roleKeys = new Set<NoaRoleKey>([NoaRole.IDENTITY_HOLDER]);

    const userRoles = await this.prisma.userRole.findMany({
      where: { userId, revokedAt: null },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: { permission: true },
            },
          },
        },
      },
    });

    for (const assignment of userRoles) {
      const roleKey = assignment.role.key as NoaRoleKey;

      if (assignment.role.scope === 'platform') {
        roleKeys.add(roleKey);
        continue;
      }

      if (!organizationId || assignment.organizationId === organizationId) {
        roleKeys.add(roleKey);
      }
    }

    if (user?.isPlatformAdmin) {
      roleKeys.add(NoaRole.PLATFORM_ADMIN);
    }

    if (organizationId) {
      const membership = await this.prisma.membership.findUnique({
        where: { userId_organizationId: { userId, organizationId } },
        select: { role: true, status: true },
      });

      if (membership?.status === 'active') {
        const legacyRole = legacyMembershipRoleToNoaRole(membership.role);
        if (legacyRole) roleKeys.add(legacyRole);
      }
    }

    const roles = [...roleKeys];
    let permissions = permissionsForRoles(roles);

    const dbPermissions = await this.loadPermissionsFromDb(roles);
    if (dbPermissions.length > 0) {
      permissions = dbPermissions;
    }

    const isReadOnly = isReadOnlyAccess(permissions);

    return {
      userId,
      organizationId,
      roles,
      permissions,
      isReadOnly,
      isPlatformAdmin: roles.includes(NoaRole.PLATFORM_ADMIN),
      dashboards: dashboardsForRoles(roles),
      holderNavigation: DASHBOARD_NAVIGATION[NoaRole.IDENTITY_HOLDER],
    };
  }

  async listUserRoleAssignments(userId: string) {
    const assignments = await this.prisma.userRole.findMany({
      where: { userId, revokedAt: null },
      include: {
        role: true,
        organization: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { grantedAt: 'desc' },
    });

    return assignments.map((assignment) => ({
      id: assignment.id,
      role: assignment.role.key,
      roleName: assignment.role.name,
      scope: assignment.role.scope,
      organization: assignment.organization,
      grantedAt: assignment.grantedAt,
    }));
  }

  async assignRole(input: AssignRoleInput) {
    const role = await this.prisma.role.findUniqueOrThrow({ where: { key: input.roleKey } });

    if (role.scope === 'organization' && !input.organizationId) {
      throw new Error(`Role ${input.roleKey} requires organizationId`);
    }

    if (role.scope === 'platform' && input.organizationId) {
      throw new Error(`Role ${input.roleKey} cannot be organization-scoped`);
    }

    const scopeKey = userRoleScopeKey(input.organizationId);

    return this.prisma.userRole.upsert({
      where: {
        userId_roleId_scopeKey: {
          userId: input.userId,
          roleId: role.id,
          scopeKey,
        },
      },
      update: {
        revokedAt: null,
        grantedByUserId: input.grantedByUserId,
        grantedAt: new Date(),
      },
      create: {
        userId: input.userId,
        roleId: role.id,
        organizationId: input.organizationId,
        scopeKey,
        grantedByUserId: input.grantedByUserId,
      },
      include: {
        role: true,
        organization: { select: { id: true, name: true, slug: true } },
      },
    });
  }

  async revokeRole(userId: string, roleKey: NoaRoleKey, organizationId?: string) {
    const role = await this.prisma.role.findUniqueOrThrow({ where: { key: roleKey } });
    const scopeKey = userRoleScopeKey(organizationId);

    return this.prisma.userRole.updateMany({
      where: {
        userId,
        roleId: role.id,
        scopeKey,
        revokedAt: null,
      },
      data: { revokedAt: new Date() },
    });
  }

  private async loadPermissionsFromDb(roles: NoaRoleKey[]): Promise<PermissionName[]> {
    const roleRecords = await this.prisma.role.findMany({
      where: { key: { in: roles } },
      include: {
        rolePermissions: {
          include: { permission: true },
        },
      },
    });

    if (roleRecords.length === 0) {
      return [];
    }

    const set = new Set<PermissionName>(IDENTITY_HOLDER_PERMISSIONS);

    for (const role of roleRecords) {
      for (const link of role.rolePermissions) {
        set.add(link.permission.key as PermissionName);
      }
    }

    return [...set];
  }
}
