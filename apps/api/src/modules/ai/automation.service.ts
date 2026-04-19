import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { BlockchainService } from '../blockchain/blockchain.service';
// @ts-ignore
import { AutomationType } from '@prisma/client';

@Injectable()
export class AutomationService {
  private readonly logger = new Logger(AutomationService.name);

  constructor(
    private prisma: PrismaService,
    private blockchainService: BlockchainService,
  ) {}

  async processAutomation(userId: string, transactionId: string) {
    this.logger.log(`Processing automation for user ${userId} on transaction ${transactionId}`);

    // @ts-ignore
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) return;

    // @ts-ignore
    const rules = await this.prisma.automationRule.findMany({
      where: { userId, isActive: true },
    });

    for (const rule of rules) {
      try {
        if (rule.type === 'ROUND_UP') {
          await this.handleRoundUp(userId, transaction, rule);
        } else if (rule.type === 'PERCENTAGE_SAVE') {
          await this.handlePercentageSave(userId, transaction, rule);
        }
      } catch (error) {
        this.logger.error(`Failed to execute automation rule ${rule.id}:`, error);
      }
    }
  }

  private async handleRoundUp(userId: string, transaction: any, rule: any) {
    const amountINR = transaction.amountINR;
    const nextTen = Math.ceil(amountINR / 10) * 10;
    const diffINR = nextTen - amountINR;

    if (diffINR > 0) {
      this.logger.log(`Round-up: Saving ₹${diffINR} for user ${userId}`);
      // In a real app, we'd convert diffINR to USDC and transfer to a vault
      // For the demo, we simulate a successful "Save"
      
      // Update rule last run
      // @ts-ignore
      await this.prisma.automationRule.update({
        where: { id: rule.id },
        data: { lastRunAt: new Date() },
      });
    }
  }

  private async handlePercentageSave(userId: string, transaction: any, rule: any) {
    const config = JSON.parse(rule.config || '{}');
    const percentage = config.percentage || 0;
    
    if (percentage > 0) {
      const saveAmountUSDC = (transaction.amountUSDC * percentage) / 100;
      this.logger.log(`Percentage-Save: Saving ${saveAmountUSDC} USDC (${percentage}%) for user ${userId}`);
      
      // Update rule last run
      // @ts-ignore
      await this.prisma.automationRule.update({
        where: { id: rule.id },
        data: { lastRunAt: new Date() },
      });
    }
  }

  async getRules(userId: string) {
    // @ts-ignore
    return this.prisma.automationRule.findMany({
      where: { userId },
    });
  }

  async toggleRule(ruleId: string, isActive: boolean) {
    // @ts-ignore
    return this.prisma.automationRule.update({
      where: { id: ruleId },
      data: { isActive },
    });
  }
}
