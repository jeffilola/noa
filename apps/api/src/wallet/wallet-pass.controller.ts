import { Body, Controller, Delete, Param, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { WalletPlatform } from '@noa/database';
import { ClerkAuthGuard } from '../common/guards/clerk-auth.guard';
import { WalletPassService } from './wallet-pass.service';

@Controller('wallet/passes')
@UseGuards(ClerkAuthGuard)
export class WalletPassController {
  constructor(private readonly wallet: WalletPassService) {}

  @Post('issue')
  issue(
    @Req() req: Request,
    @Body() body: { credentialId: string; platform: 'apple' | 'google' },
  ) {
    const platform = body.platform === 'google' ? WalletPlatform.google : WalletPlatform.apple;
    return this.wallet.issuePass(req.auth!.userId, body.credentialId, platform);
  }

  @Post(':id/refresh')
  refresh(@Req() req: Request, @Param('id') id: string) {
    return this.wallet.refreshPass(id, req.auth!.userId);
  }

  @Delete(':id')
  revoke(@Req() req: Request, @Param('id') id: string) {
    return this.wallet.revokePass(id, req.auth!.userId);
  }
}
