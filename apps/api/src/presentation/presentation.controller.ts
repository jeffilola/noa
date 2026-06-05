import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { ClerkAuthGuard } from '../common/guards/clerk-auth.guard';
import { PresentationService } from './presentation.service';

@Controller('presentation')
export class PresentationController {
  constructor(private readonly presentation: PresentationService) {}

  @Get('token/current')
  @UseGuards(ClerkAuthGuard)
  current(@Req() req: Request, @Query('credentialId') credentialId: string) {
    return this.presentation.getCurrentToken(req.auth!.userId, credentialId);
  }

  @Post('verify')
  verify(@Body() body: { token: string; organizationId?: string; channel?: string }) {
    return this.presentation.verify(body.token, body.organizationId, body.channel ?? 'qr');
  }
}
