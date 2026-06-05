import { Controller, Delete, Get, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { ClerkAuthGuard } from '../common/guards/clerk-auth.guard';
import { GdprService } from './gdpr.service';

@Controller('gdpr')
@UseGuards(ClerkAuthGuard)
export class GdprController {
  constructor(private readonly gdpr: GdprService) {}

  @Get('export')
  export(@Req() req: Request) {
    return this.gdpr.exportUserData(req.auth!.userId, req.auth!.userId);
  }

  @Delete('me')
  deleteMe(@Req() req: Request) {
    return this.gdpr.deleteUser(req.auth!.userId, req.auth!.userId);
  }
}
