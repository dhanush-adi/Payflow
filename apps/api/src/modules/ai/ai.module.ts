import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { AutomationService } from './automation.service';
import { BlockchainModule } from '../blockchain/blockchain.module';

@Module({
  imports: [HttpModule, BlockchainModule],
  controllers: [AiController],
  providers: [AiService, AutomationService],
  exports: [AiService, AutomationService],
})
export class AiModule {}