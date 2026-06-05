import { Injectable, NotFoundException } from '@nestjs/common';
import { ConnectionStatus, type CredentialProvider, type OrganizationProviderConnection } from '@noa/database';
import { EncryptionService } from '@noa/encryption';
import { providerIntegrationService } from '@noa/integrations';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class IntegrationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly encryption: EncryptionService,
  ) {}

  async listIntegrations(organizationId: string) {
    const providers = await this.prisma.credentialProvider.findMany({ where: { isEnabled: true } });
    const connections = await this.prisma.organizationProviderConnection.findMany({
      where: { organizationId },
    });
    return providers.map((p: CredentialProvider) => ({
      provider: p,
      connection: connections.find((c: OrganizationProviderConnection) => c.providerId === p.id) ?? null,
    }));
  }

  async connect(
    organizationId: string,
    providerId: string,
    apiBaseUrl: string,
    credentials: Record<string, string>,
    actorUserId: string,
  ) {
    const enc = await this.encryption.encrypt(JSON.stringify(credentials), 'employee_id');

    const connection = await this.prisma.organizationProviderConnection.upsert({
      where: { organizationId_providerId: { organizationId, providerId } },
      update: {
        apiBaseUrl,
        credentialsEnc: enc.ciphertext,
        credentialsIv: enc.iv,
        encryptionKeyVersion: enc.keyVersion,
        status: ConnectionStatus.active,
      },
      create: {
        organizationId,
        providerId,
        apiBaseUrl,
        credentialsEnc: enc.ciphertext,
        credentialsIv: enc.iv,
        encryptionKeyVersion: enc.keyVersion,
        status: ConnectionStatus.active,
      },
    });

    await this.audit.log({
      action: 'provider_connection_created',
      actorUserId,
      organizationId,
      resourceType: 'organization_provider_connection',
      resourceId: connection.id,
    });

    return connection;
  }

  async testConnection(organizationId: string, connectionId: string, actorUserId: string) {
    const connection = await this.prisma.organizationProviderConnection.findFirst({
      where: { id: connectionId, organizationId },
      include: { provider: true },
    });
    if (!connection) throw new NotFoundException('Connection not found');

    const adapter = providerIntegrationService.resolveAdapter(connection.provider.adapterKey);
    const config = providerIntegrationService.buildConfig({
      connectionId: connection.id,
      adapterKey: connection.provider.adapterKey,
      apiBaseUrl: connection.apiBaseUrl,
      credentialsEnc: connection.credentialsEnc,
      credentialsIv: connection.credentialsIv,
    });

    const health = await adapter.testConnection(config);

    await this.prisma.organizationProviderConnection.update({
      where: { id: connectionId },
      data: { lastTestedAt: new Date(), lastError: health.ok ? null : health.message },
    });

    await this.audit.log({
      action: 'provider_connection_tested',
      actorUserId,
      organizationId,
      resourceType: 'organization_provider_connection',
      resourceId: connectionId,
      metadata: { ok: health.ok, adapterKey: connection.provider.adapterKey },
    });

    return health;
  }

  async disable(organizationId: string, connectionId: string, actorUserId: string) {
    const connection = await this.prisma.organizationProviderConnection.update({
      where: { id: connectionId },
      data: { status: ConnectionStatus.disabled },
    });
    await this.audit.log({
      action: 'provider_connection_disabled',
      actorUserId,
      organizationId,
      resourceType: 'organization_provider_connection',
      resourceId: connectionId,
    });
    return connection;
  }
}
