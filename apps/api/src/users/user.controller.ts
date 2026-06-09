import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { ensureCombinedDemoForClerkUser } from '@noa/database';
import { AccessService } from '../auth/access.service';
import { RbacService } from '../auth/rbac.service';
import { ClerkAuthGuard } from '../common/guards/clerk-auth.guard';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from './user.service';

@Controller('users')
@UseGuards(ClerkAuthGuard)
export class UserController {
  constructor(
    private readonly users: UserService,
    private readonly access: AccessService,
    private readonly rbac: RbacService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('me')
  getMe(@Req() req: Request) {
    return this.users.getMe(req.auth!.userId);
  }

  @Patch('me')
  updateMe(
    @Req() req: Request,
    @Body() body: { phoneNumber?: string; dateOfBirth?: string },
  ) {
    return this.users.updateMe(req.auth!.userId, body);
  }

  @Get('me/memberships')
  listMemberships(@Req() req: Request) {
    return this.users.listMemberships(req.auth!.userId);
  }

  @Get('me/access')
  async getAccess(@Req() req: Request) {
    const auth = req.auth!;

    if (process.env.NODE_ENV !== 'production') {
      await ensureCombinedDemoForClerkUser(this.prisma, auth.clerkUserId).catch((error) => {
        console.warn('[UserController] Dev combined demo bootstrap failed:', error);
      });
    }

    const access = await this.rbac.resolveAccess(auth.userId, auth.organizationId);
    const roleAssignments = await this.rbac.listUserRoleAssignments(auth.userId);

    return {
      clerkUserId: auth.clerkUserId,
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
