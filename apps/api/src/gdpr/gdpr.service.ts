import { Injectable, NotFoundException } from '@nestjs/common';
import { CredentialStatus } from '@noa/database';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { UserRepository } from '../users/user.repository';

@Injectable()
export class GdprService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly users: UserRepository,
  ) {}

  async exportUserData(userId: string, actorUserId: string) {
    const profile = await this.users.findByIdDecrypted(userId, actorUserId);
    if (!profile) throw new NotFoundException('User not found');

    const [memberships, assignments, devices, walletPasses] = await Promise.all([
      this.prisma.membership.findMany({ where: { userId } }),
      this.prisma.credentialAssignment.findMany({
        where: { userId },
        include: { credential: true },
      }),
      this.prisma.device.findMany({ where: { userId } }),
      this.prisma.walletPass.findMany({ where: { userId } }),
    ]);

    await this.audit.log({
      action: 'data_export',
      actorUserId,
      resourceType: 'user',
      resourceId: userId,
    });

    return { profile, memberships, assignments, devices, walletPasses, exportedAt: new Date().toISOString() };
  }

  async deleteUser(userId: string, actorUserId: string) {
    await this.audit.log({
      action: 'data_delete_requested',
      actorUserId,
      resourceType: 'user',
      resourceId: userId,
    });

    const assignments = await this.prisma.credentialAssignment.findMany({
      where: { userId, unassignedAt: null },
      include: { credential: true },
    });

    for (const assignment of assignments) {
      await this.prisma.credential.update({
        where: { id: assignment.credentialId },
        data: { status: CredentialStatus.revoked, revokedAt: new Date() },
      });
      await this.audit.log({
        action: 'credential_revoked',
        actorUserId,
        organizationId: assignment.organizationId,
        resourceType: 'credential',
        resourceId: assignment.credentialId,
        metadata: { reason: 'gdpr_delete' },
      });
    }

    await this.anonymizeUser(userId, actorUserId);
  }

  async anonymizeUser(userId: string, actorUserId: string) {
    const anonId = `anon-${userId.slice(0, 8)}`;

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        firstNameEnc: null,
        firstNameIv: null,
        lastNameEnc: null,
        lastNameIv: null,
        emailEnc: null,
        emailIv: null,
        emailHash: null,
        phoneNumberEnc: null,
        phoneNumberIv: null,
        isDisabled: true,
        anonymizedAt: new Date(),
      },
    });

    await this.prisma.auditLog.updateMany({
      where: { actorUserId: userId },
      data: { actorUserId: null, actorUserIdAnon: anonId },
    });

    await this.audit.log({
      action: 'data_anonymized',
      actorUserId,
      resourceType: 'user',
      resourceId: userId,
    });
  }
}
