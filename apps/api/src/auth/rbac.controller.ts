import { Body, Controller, Delete, Param, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { NoaRole, Permission, type NoaRoleKey } from '@noa/domain';
import { RbacService } from './rbac.service';
import { ClerkAuthGuard } from '../common/guards/clerk-auth.guard';
import { RequirePermission, RequireRole } from '../common/guards/permission.guard';

@Controller('rbac')
@UseGuards(ClerkAuthGuard)
export class RbacController {
  constructor(private readonly rbac: RbacService) {}

  @Post('sync')
  @UseGuards(RequireRole(NoaRole.PLATFORM_ADMIN))
  syncCatalog() {
    return this.rbac.syncCatalog();
  }

  @Post('organizations/:organizationId/users/:userId/roles')
  @UseGuards(RequirePermission(Permission.ORG_USERS_MANAGE))
  assignOrgRole(
    @Param('organizationId') organizationId: string,
    @Param('userId') userId: string,
    @Body() body: { role: NoaRoleKey },
    @Req() req: Request,
  ) {
    return this.rbac.assignRole({
      userId,
      roleKey: body.role,
      organizationId,
      grantedByUserId: req.auth!.userId,
    });
  }

  @Delete('organizations/:organizationId/users/:userId/roles/:roleKey')
  @UseGuards(RequirePermission(Permission.ORG_USERS_MANAGE))
  revokeOrgRole(
    @Param('organizationId') organizationId: string,
    @Param('userId') userId: string,
    @Param('roleKey') roleKey: NoaRoleKey,
  ) {
    return this.rbac.revokeRole(userId, roleKey, organizationId);
  }

  @Post('platform/users/:userId/roles/:roleKey')
  @UseGuards(RequireRole(NoaRole.PLATFORM_ADMIN))
  assignPlatformRole(
    @Param('userId') userId: string,
    @Param('roleKey') roleKey: NoaRoleKey,
    @Req() req: Request,
  ) {
    return this.rbac.assignRole({
      userId,
      roleKey,
      grantedByUserId: req.auth!.userId,
    });
  }
}
