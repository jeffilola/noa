import { Global, Module, OnModuleInit } from '@nestjs/common';
import { EncryptionService } from '@noa/encryption';
import { AuditService } from '../audit/audit.service';

@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: EncryptionService,
      useFactory: () => new EncryptionService(),
    },
  ],
  exports: [EncryptionService],
})
export class EncryptionModule implements OnModuleInit {
  constructor(
    private readonly encryption: EncryptionService,
    private readonly audit: AuditService,
  ) {}

  onModuleInit() {
    this.encryption.setAuditLogger(async (event) => {
      await this.audit.log({
        action: 'pii_decrypted',
        actorUserId: event.actorUserId,
        organizationId: event.organizationId,
        resourceType: event.resourceType,
        resourceId: event.resourceId,
        metadata: {
          field: event.field,
          purpose: event.purpose,
          ipAddress: event.ipAddress,
          userAgent: event.userAgent,
        },
      });
    });
  }
}
