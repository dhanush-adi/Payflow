import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { CryptoModule } from './modules/crypto/crypto.module';
import { AiModule } from './modules/ai/ai.module';
import { MerchantModule } from './modules/merchant/merchant.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';
import { PrismaModule } from './common/prisma.module';
import { BlockchainModule } from './modules/blockchain/blockchain.module';
import { AutomationModule } from './modules/automation/automation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    PaymentsModule,
    CryptoModule,
    AiModule,
    MerchantModule,
    WebhooksModule,
    BlockchainModule,
    AutomationModule,
  ],
  controllers: [AppController],
})
export class AppModule {}