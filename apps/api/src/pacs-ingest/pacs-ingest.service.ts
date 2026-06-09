import { Injectable, NotFoundException } from '@nestjs/common';
import {
  AuditAction,
  CredentialStatus,
  CredentialType,
  IssuanceSource,
} from '@noa/database';
import {
  mapHidCloudEventToIngest,
  type HidOrigoCloudEvent,
  type PacsIngestPayload,
} from '@noa/integrations';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';

export interface IngestResult {
  processed: number;
  skipped: number;
  credentials: Array<{ id: string; externalCredentialId: string; action: string }>;
}

@Injectable()
export class PacsIngestService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async ingestHidOrigoEvents(events: HidOrigoCloudEvent[]): Promise<IngestResult> {
    const result: IngestResult = { processed: 0, skipped: 0, credentials: [] };

    for (const event of events) {
      const payload = mapHidCloudEventToIngest(event);
      if (!payload) {
        result.skipped += 1;
        continue;
      }

      const credential = await this.processIngestPayload(payload);
      result.processed += 1;
      result.credentials.push({
        id: credential.id,
        externalCredentialId: credential.externalCredentialId ?? payload.externalCredentialId,
        action: payload.action,
      });
    }

    return result;
  }

  async processIngestPayload(payload: PacsIngestPayload) {
    const org = await this.prisma.organization.findUnique({
      where: { id: payload.organizationId },
    });
    if (!org) {
      throw new NotFoundException(`Organization not found: ${payload.organizationId}`);
    }

    const hidProvider = await this.prisma.credentialProvider.findFirst({
      where: { adapterKey: 'hid_origo' },
    });
    if (!hidProvider) {
      throw new NotFoundException('HID Origo provider not configured');
    }

    const credentialType = this.normalizeCredentialType(payload.credentialType);

    if (payload.action === 'issued') {
      return this.upsertIssued(payload, hidProvider.id, credentialType);
    }
    if (payload.action === 'revoked') {
      return this.updateStatus(payload, CredentialStatus.revoked, 'credential_revoked', {
        revokedAt: new Date(),
      });
    }
    return this.updateStatus(payload, CredentialStatus.suspended, 'credential_suspended', {
      suspendedAt: new Date(),
    });
  }

  private async upsertIssued(
    payload: PacsIngestPayload,
    providerId: string,
    type: CredentialType,
  ) {
    const existing = await this.prisma.credential.findUnique({
      where: {
        organizationId_externalCredentialId: {
          organizationId: payload.organizationId,
          externalCredentialId: payload.externalCredentialId,
        },
      },
      include: { assignments: true },
    });

    if (existing) {
      const updated = await this.prisma.credential.update({
        where: { id: existing.id },
        data: {
          status: CredentialStatus.active,
          cardNumber: payload.cardNumber ?? existing.cardNumber,
          pacsCardholderId: payload.pacsCardholderId ?? existing.pacsCardholderId,
          label: payload.label ?? existing.label,
          validFrom: payload.validFrom ?? existing.validFrom,
          validUntil: payload.validUntil ?? existing.validUntil,
          revokedAt: null,
          suspendedAt: null,
        },
      });

      if (payload.userId) {
        await this.ensureAssignment(updated.id, payload.userId, payload.organizationId);
      }

      return updated;
    }

    const credential = await this.prisma.credential.create({
      data: {
        organizationId: payload.organizationId,
        providerId,
        type,
        issuanceSource: IssuanceSource.PACS,
        status: CredentialStatus.active,
        externalCredentialId: payload.externalCredentialId,
        cardNumber: payload.cardNumber,
        pacsCardholderId: payload.pacsCardholderId,
        label: payload.label,
        validFrom: payload.validFrom,
        validUntil: payload.validUntil,
        metadata: { lastEventId: payload.eventId },
        assignments: payload.userId
          ? {
              create: {
                userId: payload.userId,
                organizationId: payload.organizationId,
              },
            }
          : undefined,
      },
    });

    await this.audit.log({
      action: AuditAction.credential_issued,
      organizationId: payload.organizationId,
      resourceType: 'credential',
      resourceId: credential.id,
      metadata: {
        issuanceSource: 'PACS',
        externalCredentialId: payload.externalCredentialId,
        eventId: payload.eventId,
      },
    });

    return credential;
  }

  private async updateStatus(
    payload: PacsIngestPayload,
    status: CredentialStatus,
    auditAction: AuditAction,
    extra: { revokedAt?: Date; suspendedAt?: Date },
  ) {
    const existing = await this.prisma.credential.findUnique({
      where: {
        organizationId_externalCredentialId: {
          organizationId: payload.organizationId,
          externalCredentialId: payload.externalCredentialId,
        },
      },
    });

    if (!existing) {
      throw new NotFoundException(
        `Credential not found for external id: ${payload.externalCredentialId}`,
      );
    }

    const updated = await this.prisma.credential.update({
      where: { id: existing.id },
      data: { status, ...extra },
    });

    await this.audit.log({
      action: auditAction,
      organizationId: payload.organizationId,
      resourceType: 'credential',
      resourceId: updated.id,
      metadata: { eventId: payload.eventId, issuanceSource: 'PACS' },
    });

    return updated;
  }

  private async ensureAssignment(
    credentialId: string,
    userId: string,
    organizationId: string,
  ) {
    await this.prisma.credentialAssignment.updateMany({
      where: {
        credentialId,
        userId: { not: userId },
        unassignedAt: null,
      },
      data: { unassignedAt: new Date() },
    });

    await this.prisma.credentialAssignment.upsert({
      where: {
        credentialId_userId: { credentialId, userId },
      },
      update: { unassignedAt: null },
      create: { credentialId, userId, organizationId },
    });
  }

  private normalizeCredentialType(raw: string): CredentialType {
    const allowed = Object.values(CredentialType);
    if (allowed.includes(raw as CredentialType)) {
      return raw as CredentialType;
    }
    return CredentialType.corporate_access;
  }
}
