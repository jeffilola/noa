import { Module } from '@nestjs/common';
import { UserModule } from '../users/user.module';
import { WebhooksController } from './webhooks.controller';

@Module({
  imports: [UserModule],
  controllers: [WebhooksController],
})
export class WebhooksModule {}
