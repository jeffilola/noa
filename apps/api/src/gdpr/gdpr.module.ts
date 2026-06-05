import { Module } from '@nestjs/common';
import { UserModule } from '../users/user.module';
import { GdprController } from './gdpr.controller';
import { GdprService } from './gdpr.service';

@Module({
  imports: [UserModule],
  controllers: [GdprController],
  providers: [GdprService],
  exports: [GdprService],
})
export class GdprModule {}
