import { Injectable, NotFoundException } from '@nestjs/common';
import { WalletPassStatus, WalletPlatform } from '@noa/database';
import { applePassBuilder, googlePassBuilder } from '@noa/wallet';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { PresentationService } from '../presentation/presentation.service';

@Injectable()
export class WalletPassService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly presentation: PresentationService,
  ) {}

  async issuePass(userId: string, credentialId: string, platform: WalletPlatform) {
    const assignment = await this.prisma.credentialAssignment.findFirst({
      where: { userId, credentialId, unassignedAt: null },
      include: { credential: { include: { organization: true } } },
    });
    if (!assignment) throw new NotFoundException('Credential assignment not found');

    const token = await this.presentation.getCurrentToken(userId, credentialId);
    const externalPassId = `${platform}-${credentialId}-${userId.slice(0, 8)}`;

    const passPayload =
      platform === WalletPlatform.apple
        ? applePassBuilder.build({
            serialNumber: externalPassId,
            organizationName: assignment.credential.organization.name,
            description: assignment.credential.label ?? 'Noa Access',
            barcode: {
              token: token.token,
              format: 'PKBarcodeFormatQR',
              messageEncoding: 'iso-8859-1',
            },
          })
        : googlePassBuilder.build({
            objectId: externalPassId,
            classId: process.env.GOOGLE_WALLET_CLASS_ID ?? 'noa.access',
            barcodeValue: token.token,
            header: assignment.credential.label ?? 'Noa Access',
          });

    const walletPass = await this.prisma.walletPass.upsert({
      where: {
        credentialId_platform_userId: { credentialId, platform, userId },
      },
      update: {
        status: WalletPassStatus.active,
        lastBarcodeUpdatedAt: new Date(),
      },
      create: {
        userId,
        credentialId,
        platform,
        externalPassId,
        passTypeIdentifier: process.env.APPLE_PASS_TYPE_ID,
        lastBarcodeUpdatedAt: new Date(),
      },
    });

    await this.audit.log({
      action: 'wallet_pass_issued',
      actorUserId: userId,
      organizationId: assignment.organizationId,
      resourceType: 'wallet_pass',
      resourceId: walletPass.id,
      metadata: { platform, stub: true },
    });

    return { walletPass, passPayload };
  }

  async refreshPass(walletPassId: string, userId: string) {
    const pass = await this.prisma.walletPass.findFirst({
      where: { id: walletPassId, userId },
    });
    if (!pass) throw new NotFoundException('Wallet pass not found');

    const token = await this.presentation.getCurrentToken(userId, pass.credentialId);
    await this.prisma.walletPass.update({
      where: { id: walletPassId },
      data: { lastBarcodeUpdatedAt: new Date() },
    });

    await this.audit.log({
      action: 'wallet_pass_updated',
      actorUserId: userId,
      resourceType: 'wallet_pass',
      resourceId: walletPassId,
      metadata: { barcodeToken: 'redacted' },
    });

    return { walletPassId, barcode: token.token, expiresAt: token.expiresAt };
  }

  async revokePass(walletPassId: string, userId: string) {
    const pass = await this.prisma.walletPass.update({
      where: { id: walletPassId },
      data: { status: WalletPassStatus.revoked },
    });
    await this.audit.log({
      action: 'wallet_pass_updated',
      actorUserId: userId,
      resourceType: 'wallet_pass',
      resourceId: walletPassId,
      metadata: { revoked: true },
    });
    return pass;
  }
}
