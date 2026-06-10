import { Module } from '@nestjs/common';
import { OrganizationModule } from '../organizations/organization.module';
import { AccessEventController, AccessEventIngestController } from './access-event.controller';
import { AccessEventService } from './access-event.service';

@Module({
  imports: [OrganizationModule],
  controllers: [AccessEventController, AccessEventIngestController],
  providers: [AccessEventService],
  exports: [AccessEventService],
})
export class AccessEventModule {}
