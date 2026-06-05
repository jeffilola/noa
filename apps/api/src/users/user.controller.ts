import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { AccessService } from '../auth/access.service';
import { RbacService } from '../auth/rbac.service';
import { ClerkAuthGuard } from '../common/guards/clerk-auth.guard';
import { UserService } from './user.service';

@Controller('users')
@UseGuards(ClerkAuthGuard)
export class UserController {
  constructor(
    private readonly users: UserService,
    private readonly access: AccessService,
    private readonly rbac: RbacService,
  ) {}

  @Get('me')
  getMe(@Req() req: Request) {
    return this.users.getMe(req.auth!.userId);
  }

  @Get('me/memberships')
  listMemberships(@Req() req: Request) {
    return this.users.listMemberships(req.auth!.userId);
  }

  @Get('me/access')
  async getAccess(@Req() req: Request) {
    const auth = req.auth!;
    const access = await this.rbac.resolveAccess(auth.userId, auth.organizationId);
    const roleAssignments = await this.rbac.listUserRoleAssignments(auth.userId);

    return {
      userId: auth.userId,
      organizationId: access.organizationId,
      roles: access.roles,
      permissions: access.permissions,
      isReadOnly: access.isReadOnly,
      isPlatformAdmin: access.isPlatformAdmin,
      holderNavigation: access.holderNavigation,
      dashboards: access.dashboards,
      roleAssignments,
    };
  }
}
