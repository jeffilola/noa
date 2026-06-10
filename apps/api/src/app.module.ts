import { AuthModule } from './auth/auth.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AccessEventModule } from './access-events/access-event.module';
import { AuditModule } from './audit/audit.module';
import { CredentialModule } from './credential/credential.module';
import { PacsIngestModule } from './pacs-ingest/pacs-ingest.module';
import { EncryptionModule } from './encryption/encryption.module';
import { UserModule } from './users/user.module';
import { OrganizationModule } from './organizations/organization.module';
import { IntegrationsModule } from './integrations/integrations.module';
import { GdprModule } from './gdpr/gdpr.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { PresentationModule } from './presentation/presentation.module';
import { WalletModule } from './wallet/wallet.module';
import { DeviceModule } from './devices/device.module';
import { AuditContextMiddleware } from './common/middleware/audit-context.middleware';
import { HealthController } from './health.controller';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    AuditModule,
    EncryptionModule,
    UserModule,
    OrganizationModule,
    CredentialModule,
    PacsIngestModule,
    AccessEventModule,
    IntegrationsModule,
    GdprModule,
    WebhooksModule,
    PresentationModule,
    WalletModule,
    DeviceModule,
  ],
  controllers: [HealthController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuditContextMiddleware).forRoutes('*');
  }
}
