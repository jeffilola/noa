import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { Permission } from '@noa/domain';
import { ClerkAuthGuard } from '../common/guards/clerk-auth.guard';
import { RequireOrgAdmin } from '../common/guards/org-role.guard';
import { RequireOrgScope, RequirePermission } from '../common/guards/permission.guard';
import { OrganizationService } from './organization.service';

@Controller('organizations')
@UseGuards(ClerkAuthGuard)
export class OrganizationController {
  constructor(private readonly orgs: OrganizationService) {}

  @Post()
  create(@Body() body: { name: string; slug: string }) {
    return this.orgs.create(body.name, body.slug);
  }

  @Get(':id/overview')
  @UseGuards(RequireOrgScope(), RequirePermission(Permission.REPORTS_VIEW))
  getOverview(@Param('id') id: string, @Req() req: Request) {
    return this.orgs.getOverview(id, req.auth!.userId, req.auth!.isPlatformAdmin);
  }

  @Get(':id/members')
  @UseGuards(RequireOrgScope(), RequirePermission(Permission.ORG_USERS_MANAGE))
  listMembers(@Param('id') id: string, @Req() req: Request) {
    return this.orgs.listMembers(id, req.auth!.userId, req.auth!.isPlatformAdmin);
  }

  @Post(':id/members/invite')
  @UseGuards(RequireOrgAdmin())
  invite(
    @Param('id') id: string,
    @Body() body: { userId: string; role?: string },
    @Req() req: Request,
  ) {
    return this.orgs.inviteMember(id, body.userId, body.role ?? 'org_admin', req.auth!.userId);
  }

  @Delete(':id/members/:userId')
  @UseGuards(RequireOrgAdmin())
  remove(@Param('id') id: string, @Param('userId') userId: string, @Req() req: Request) {
    return this.orgs.removeMember(id, userId, req.auth!.userId);
  }

  @Patch(':id/members/:userId/role')
  @UseGuards(RequireOrgAdmin())
  assignRole(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Body() body: { role: string },
    @Req() req: Request,
  ) {
    return this.orgs.assignRole(id, userId, body.role, req.auth!.userId);
  }
}
