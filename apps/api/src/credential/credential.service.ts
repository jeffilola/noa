import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CredentialStatus,
  CredentialType,
  IssuanceSource,
  Prisma,
} from '@noa/database';
import {
  isPacsLedCorporateBlocked,
  parseOrganizationSettings,
  PacsLedIssuanceNotAllowedError,
  type CredentialTypeName,
} from '@noa/domain';
import { providerIntegrationService } from '@noa/integrations';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';

export interface IssueCredentialDto {
  organizationId: string;
  userId: string;
  providerId: string;
  type: CredentialTypeName;
  label?: string;
  validFrom?: string;
  validUntil?: string;
}

@Injectable()
export class CredentialService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async issue(dto: IssueCredentialDto) {
    const org = await this.prisma.organization.findUnique({
      where: { id: dto.organizationId },
    });
    if (!org) {
      throw new NotFoundException('Organization not found');
    }

    const settings = parseOrganizationSettings(org.settings);
    if (isPacsLedCorporateBlocked(dto.type, settings)) {
      throw new ConflictException({
        message:
          'Corporate access credentials must be issued in PACS (e.g. Lenel Elements). Noa mirrors credentials from HID webhooks.',
        issueInPacs: true,
      });
    }

    const provider = await this.prisma.credentialProvider.findUnique({
      where: { id: dto.providerId },
    });
    if (!provider) {
      throw new NotFoundException('Credential provider not found');
    }

    const connection = await this.prisma.organizationProviderConnection.findUnique({
      where: {
        organizationId_providerId: {
          organizationId: dto.organizationId,
          providerId: dto.providerId,
        },
      },
    });
    if (!connection || connection.status !== 'active') {
      throw new ConflictException('No active provider connection for this organization');
    }

    const adapter = providerIntegrationService.resolveAdapter(provider.adapterKey);
    const config = providerIntegrationService.buildConfig({
      connectionId: connection.id,
      adapterKey: provider.adapterKey,
      apiBaseUrl: connection.apiBaseUrl,
      credentialsEnc: connection.credentialsEnc,
      credentialsIv: connection.credentialsIv,
    });

    let externalCredentialId: string | undefined;
    try {
      const result = await adapter.issue(
        {
          organizationId: dto.organizationId,
          userId: dto.userId,
          type: dto.type,
          label: dto.label,
          validFrom: dto.validFrom ? new Date(dto.validFrom) : undefined,
          validUntil: dto.validUntil ? new Date(dto.validUntil) : undefined,
        },
        config,
      );
      externalCredentialId = result.externalCredentialId;
    } catch (err) {
      if (err instanceof PacsLedIssuanceNotAllowedError) {
        throw new ConflictException({
          message: err.message,
          issueInPacs: err.issueInPacs,
        });
      }
      throw err;
    }

    const credential = await this.prisma.credential.create({
      data: {
        organizationId: dto.organizationId,
        providerId: dto.providerId,
        type: dto.type as CredentialType,
        issuanceSource: IssuanceSource.NOA,
        status: CredentialStatus.active,
        externalCredentialId,
        label: dto.label,
        validFrom: dto.validFrom ? new Date(dto.validFrom) : undefined,
        validUntil: dto.validUntil ? new Date(dto.validUntil) : undefined,
        assignments: {
          create: {
            userId: dto.userId,
            organizationId: dto.organizationId,
          },
        },
      },
      include: { assignments: true },
    });

    await this.audit.log({
      action: 'credential_issued',
      organizationId: dto.organizationId,
      resourceType: 'credential',
      resourceId: credential.id,
      metadata: { issuanceSource: 'NOA', type: dto.type },
    });

    return credential;
  }

  async list(filters: {
    organizationId?: string;
    userId?: string;
    type?: CredentialType;
    status?: CredentialStatus;
  }) {
    return this.prisma.credential.findMany({
      where: {
        organizationId: filters.organizationId,
        type: filters.type,
        status: filters.status,
        assignments: filters.userId
          ? { some: { userId: filters.userId, unassignedAt: null } }
          : undefined,
      },
      include: {
        provider: true,
        assignments: { where: { unassignedAt: null } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
