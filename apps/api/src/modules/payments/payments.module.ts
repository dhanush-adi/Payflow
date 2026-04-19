import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { CryptoModule } from '../crypto/crypto.module';
import { BlockchainModule } from '../blockchain/blockchain.module';

@Module({
  imports: [CryptoModule, BlockchainModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}