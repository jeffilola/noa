import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { Permission } from '@noa/domain';
import { ClerkAuthGuard } from '../common/guards/clerk-auth.guard';
import { RequireOrgScope, RequirePermission } from '../common/guards/permission.guard';
import { IntegrationsService } from './integrations.service';

@Controller('organizations/:orgId/integrations')
@UseGuards(
  ClerkAuthGuard,
  RequireOrgScope(),
  RequirePermission(Permission.INTEGRATIONS_PROVIDERS_CONFIGURE),
)
export class IntegrationsController {
  constructor(private readonly integrations: IntegrationsService) {}

  @Get()
  list(@Param('orgId') orgId: string) {
    return this.integrations.listIntegrations(orgId);
  }

  @Post()
  connect(
    @Param('orgId') orgId: string,
    @Body() body: { providerId: string; apiBaseUrl: string; credentials: Record<string, string> },
    @Req() req: Request,
  ) {
    return this.integrations.connect(
      orgId,
      body.providerId,
      body.apiBaseUrl,
      body.credentials,
      req.auth!.userId,
    );
  }

  @Post('validate-test-mode')
  validateTestModeConnection(
    @Body() body: { providerId?: string; apiBaseUrl?: string; mode?: string },
  ) {
    return this.integrations.validateTestModeConnection(body);
  }

  @Post(':connectionId/test')
  test(
    @Param('orgId') orgId: string,
    @Param('connectionId') connectionId: string,
    @Req() req: Request,
  ) {
    return this.integrations.testConnection(orgId, connectionId, req.auth!.userId);
  }

  @Delete(':connectionId')
  disable(
    @Param('orgId') orgId: string,
    @Param('connectionId') connectionId: string,
    @Req() req: Request,
  ) {
    return this.integrations.disable(orgId, connectionId, req.auth!.userId);
  }
}
