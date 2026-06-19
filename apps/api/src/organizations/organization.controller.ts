import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { Permission } from '@noa/domain';
import { ClerkAuthGuard } from '../common/guards/clerk-auth.guard';
import { RequireOrgAdmin } from '../common/guards/org-role.guard';
import { RequireOrgScope, RequirePermission } from '../common/guards/permission.guard';
import { OrganizationService } from './organization.service';
import type {
  PlatformOrganizationFilter,
  PlatformOrganizationSearchField,
  PlatformOrganizationSort,
} from './organization.service';

const PLATFORM_SEARCH_FIELDS = new Set<PlatformOrganizationSearchField>(['all', 'name', 'clerkOrgId']);
const PLATFORM_FILTERS = new Set<PlatformOrganizationFilter>([
  'all',
  'hasMembers',
  'hasCredentials',
  'hasProviders',
  'missingClerkOrg',
]);
const PLATFORM_SORTS = new Set<PlatformOrganizationSort>(['name', 'updated']);

function parsePlatformOrganizationField(value?: string): PlatformOrganizationSearchField {
  return value && PLATFORM_SEARCH_FIELDS.has(value as PlatformOrganizationSearchField)
    ? (value as PlatformOrganizationSearchField)
    : 'all';
}

function parsePlatformOrganizationFilter(value?: string): PlatformOrganizationFilter {
  return value && PLATFORM_FILTERS.has(value as PlatformOrganizationFilter)
    ? (value as PlatformOrganizationFilter)
    : 'all';
}

function parsePlatformOrganizationSort(value?: string): PlatformOrganizationSort {
  return value && PLATFORM_SORTS.has(value as PlatformOrganizationSort)
    ? (value as PlatformOrganizationSort)
    : 'name';
}

@Controller('organizations')
@UseGuards(ClerkAuthGuard)
export class OrganizationController {
  constructor(private readonly orgs: OrganizationService) {}

  @Get()
  @UseGuards(RequirePermission(Permission.PLATFORM_ORGANIZATIONS_MANAGE))
  listPlatform(
    @Query('search') search?: string,
    @Query('field') field?: string,
    @Query('filter') filter?: string,
    @Query('sort') sort?: string,
  ) {
    return this.orgs.listPlatformOrganizations({
      search,
      field: parsePlatformOrganizationField(field),
      filter: parsePlatformOrganizationFilter(filter),
      sort: parsePlatformOrganizationSort(sort),
    });
  }

  @Post()
  @UseGuards(RequirePermission(Permission.PLATFORM_ORGANIZATIONS_MANAGE))
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

  @Get(':id/users/:userId/compliance-records')
  @UseGuards(
    RequireOrgScope(),
    RequirePermission(
      Permission.ORG_USERS_MANAGE,
      Permission.USERS_VIEW_ORG,
      Permission.COMPLIANCE_REPORTS_GENERATE,
      Permission.AUDIT_VIEW_ORG,
    ),
  )
  listComplianceRecords(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Req() req: Request,
  ) {
    return this.orgs.listComplianceRecords(
      id,
      userId,
      req.auth!.userId,
      req.auth!.isPlatformAdmin,
    );
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
