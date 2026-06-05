import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { presentationTokenMint, tokenStore } from './presentation.tokens';

@Injectable()
export class PresentationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async getCurrentToken(userId: string, credentialId: string) {
    const assignment = await this.prisma.credentialAssignment.findFirst({
      where: { userId, credentialId, unassignedAt: null },
      include: { credential: true },
    });
    if (!assignment) throw new NotFoundException('Credential not assigned to user');

    const minted = presentationTokenMint.mint(userId, credentialId);

    await this.prisma.presentationToken.create({
      data: {
        credentialId,
        userId,
        tokenHash: minted.tokenHash,
        windowStart: minted.windowStart,
        expiresAt: minted.expiresAt,
      },
    });

    await this.audit.log({
      action: 'presentation_token_minted',
      actorUserId: userId,
      organizationId: assignment.organizationId,
      resourceType: 'credential',
      resourceId: credentialId,
      metadata: { windowStart: minted.windowStart.toISOString() },
    });

    return {
      token: minted.opaqueToken,
      expiresAt: minted.expiresAt,
      qrPayload: minted.opaqueToken,
      nfcUri: `https://present.noa.app/v1/t/${minted.opaqueToken}`,
    };
  }

  async verify(opaqueToken: string, verifierOrgId?: string, channel = 'qr') {
    const tokenHash = presentationTokenMint.hash(opaqueToken);
    const record = await this.prisma.presentationToken.findUnique({
      where: { tokenHash },
      include: { credential: true },
    });

    if (!record) {
      await this.audit.log({
        action: 'presentation_token_rejected',
        organizationId: verifierOrgId,
        resourceType: 'presentation_token',
        metadata: { reason: 'unknown_token', channel },
      });
      throw new UnauthorizedException('Invalid token');
    }

    if (record.expiresAt < new Date()) {
      await this.audit.log({
        action: 'presentation_token_rejected',
        organizationId: verifierOrgId ?? record.credential.organizationId,
        resourceType: 'presentation_token',
        resourceId: record.id,
        metadata: { reason: 'expired', channel },
      });
      throw new UnauthorizedException('Token expired');
    }

    if (record.consumedAt || tokenStore.isConsumed(tokenHash)) {
      await this.audit.log({
        action: 'presentation_token_rejected',
        organizationId: verifierOrgId ?? record.credential.organizationId,
        resourceType: 'presentation_token',
        resourceId: record.id,
        metadata: { reason: 'already_used', channel },
      });
      throw new ConflictException({ message: 'TOKEN_ALREADY_USED', accessDecision: 'deny' });
    }

    const consumed = await tokenStore.markConsumed(tokenHash);
    if (!consumed) {
      throw new ConflictException({ message: 'TOKEN_ALREADY_USED', accessDecision: 'deny' });
    }

    await this.prisma.presentationToken.update({
      where: { id: record.id },
      data: { consumedAt: new Date(), consumedBy: verifierOrgId, channel },
    });

    await this.audit.log({
      action: channel === 'nfc' ? 'presentation_nfc_tapped' : 'presentation_qr_scanned',
      organizationId: verifierOrgId ?? record.credential.organizationId,
      resourceType: 'credential',
      resourceId: record.credentialId,
      metadata: { channel },
    });

    await this.audit.log({
      action: 'presentation_token_consumed',
      organizationId: verifierOrgId ?? record.credential.organizationId,
      resourceType: 'presentation_token',
      resourceId: record.id,
      metadata: { channel },
    });

    return {
      accessDecision: 'allow',
      credentialId: record.credentialId,
      credentialType: record.credential.type,
    };
  }
}
