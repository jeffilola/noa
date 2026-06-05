import { Module } from '@nestjs/common';
import { PresentationModule } from '../presentation/presentation.module';
import { WalletPassController } from './wallet-pass.controller';
import { WalletPassService } from './wallet-pass.service';

@Module({
  imports: [PresentationModule],
  controllers: [WalletPassController],
  providers: [WalletPassService],
  exports: [WalletPassService],
})
export class WalletModule {}
