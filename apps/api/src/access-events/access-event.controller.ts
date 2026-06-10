import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import type { PacsAccessEventPayload } from '@noa/integrations';
import { Permission } from '@noa/domain';
import { ClerkAuthGuard } from '../common/guards/clerk-auth.guard';
import { RequireOrgScope, RequirePermission } from '../common/guards/permission.guard';
import { AccessEventService } from './access-event.service';

const ORG_ACCESS_READ_PERMISSIONS = [
  Permission.USERS_VIEW_ORG,
  Permission.ORG_USERS_MANAGE,
  Permission.ACTIVITY_INVESTIGATE,
  Permission.AUDIT_VIEW_ORG,
] as const;

@Controller()
export class AccessEventController {
  constructor(private readonly accessEvents: AccessEventService) {}

  @Get('organizations/:id/access-events')
  @UseGuards(
    ClerkAuthGuard,
    RequireOrgScope(),
    RequirePermission(...ORG_ACCESS_READ_PERMISSIONS),
  )
  listForOrganization(
    @Param('id') organizationId: string,
    @Query('userId') userId: string | undefined,
    @Query('limit') limit: string | undefined,
    @Req() req: Request,
  ) {
    return this.accessEvents.listForOrganization(
      organizationId,
      req.auth!.userId,
      req.auth!.isPlatformAdmin,
      {
        userId: userId?.trim() || undefined,
        limit: limit ? Number(limit) : undefined,
      },
    );
  }

  @Get('organizations/:id/users/:userId/access-summary')
  @UseGuards(
    ClerkAuthGuard,
    RequireOrgScope(),
    RequirePermission(...ORG_ACCESS_READ_PERMISSIONS),
  )
  getUserAccessSummary(
    @Param('id') organizationId: string,
    @Param('userId') userId: string,
    @Req() req: Request,
  ) {
    return this.accessEvents.getUserAccessSummary(
      organizationId,
      userId,
      req.auth!.userId,
      req.auth!.isPlatformAdmin,
    );
  }
}

@Controller('webhooks')
export class AccessEventIngestController {
  constructor(private readonly accessEvents: AccessEventService) {}

  @Post('pacs/access-events')
  ingestPacsAccessEvents(@Body() body: PacsAccessEventPayload | PacsAccessEventPayload[]) {
    const payloads = Array.isArray(body) ? body : [body];
    return this.accessEvents.ingestPacsAccessEvents(payloads);
  }
}
