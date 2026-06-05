import { Global, Module } from '@nestjs/common';
import { AccessService } from './access.service';
import { RbacController } from './rbac.controller';
import { RbacService } from './rbac.service';
import { ClerkAuthGuard } from '../common/guards/clerk-auth.guard';
import { UserModule } from '../users/user.module';

@Global()
@Module({
  imports: [UserModule],
  controllers: [RbacController],
  providers: [RbacService, AccessService, ClerkAuthGuard],
  exports: [RbacService, AccessService, ClerkAuthGuard, UserModule],
})
export class AuthModule {}
