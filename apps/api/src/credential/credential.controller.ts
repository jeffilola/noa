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
    let scopeUserId: string | undefined = req.auth!.userId;

    if (all === 'true') {
      const canViewAll =
        req.auth!.permissions.includes(Permission.CREDENTIALS_VIEW_ORG) ||
        req.auth!.permissions.includes(Permission.PLATFORM_ORGANIZATIONS_MANAGE);
      if (!canViewAll) {
        throw new ForbiddenException('Insufficient permission to list all credentials');
      }
      scopeUserId = userId;
    } else if (userId && userId !== req.auth!.userId) {
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
