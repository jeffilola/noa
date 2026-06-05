import { Module } from '@nestjs/common';
import { PacsIngestController } from './pacs-ingest.controller';
import { PacsIngestService } from './pacs-ingest.service';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [AuditModule],
  controllers: [PacsIngestController],
  providers: [PacsIngestService],
  exports: [PacsIngestService],
})
export class PacsIngestModule {}
