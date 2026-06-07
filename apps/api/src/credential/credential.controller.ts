import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { CredentialStatus, CredentialType } from '@noa/database';
import { Permission } from '@noa/domain';
import { ClerkAuthGuard } from '../common/guards/clerk-auth.guard';
import { CredentialService, IssueCredentialDto } from './credential.service';

@Controller('credentials')
@UseGuards(ClerkAuthGuard)
export class CredentialController {
  constructor(private readonly credentialService: CredentialService) {}

  @Post('issue')
  issue(@Body() body: IssueCredentialDto) {
    return this.credentialService.issue(body);
  }

  @Get()
  async list(
    @Req() req: Request,
    @Query('organizationId') organizationId?: string,
    @Query('userId') userId?: string,
    @Query('type') type?: CredentialType,
    @Query('status') status?: CredentialStatus,
    @Query('all') all?: string,
  ) {
    const auth = req.auth!;

    if (all === 'true') {
      const canViewOrgInventory =
        auth.permissions.includes(Permission.CREDENTIALS_INVENTORY_VIEW) ||
        auth.permissions.includes(Permission.CREDENTIALS_VIEW_ORG) ||
        auth.permissions.includes(Permission.PLATFORM_ORGANIZATIONS_MANAGE);

      if (!canViewOrgInventory) {
        throw new ForbiddenException('Insufficient permission to list organization credentials');
      }

      if (!organizationId) {
        throw new ForbiddenException('organizationId is required for organization credential inventory');
      }

      if (
        auth.organizationId &&
        auth.organizationId !== organizationId &&
        !auth.isPlatformAdmin
      ) {
        throw new ForbiddenException('Organization scope mismatch');
      }

      return this.credentialService.list({
        organizationId,
        userId,
        type,
        status,
      });
    }

    let scopeUserId: string | undefined = auth.userId;

    if (userId && userId !== auth.userId) {
      throw new ForbiddenException('Cannot list another user’s credentials');
    }

    return this.credentialService.list({
      organizationId,
      userId: scopeUserId,
      type,
      status,
    });
  }
}
