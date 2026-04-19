import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
// @ts-ignore
import { AutomationType } from '@prisma/client';

@Injectable()
export class AutomationService {
  constructor(private prisma: PrismaService) {}

  async getUserRules(userId: string) {
    // @ts-ignore
    return this.prisma.automationRule.findMany({
      where: { userId },
    });
  }

  async toggleRule(userId: string, ruleId: string) {
    // @ts-ignore
    const rule = await this.prisma.automationRule.findUnique({
      where: { id: ruleId },
    });

    if (!rule || rule.userId !== userId) {
      throw new Error('Rule not found');
    }

    // @ts-ignore
    return this.prisma.automationRule.update({
      where: { id: ruleId },
      data: { isActive: !rule.isActive },
    });
  }

  async seedDefaultRules(userId: string) {
     const defaults = [
       { name: 'Coffee Round-Up', type: AutomationType.ROUND_UP, description: 'Invest spare change into USDC.' },
       { name: 'Auto-Save 5%', type: AutomationType.PERCENTAGE_SAVE, description: 'Move 5% of all credits to savings.' },
       { name: 'Subscription Shield', type: AutomationType.SUBSCRIPTION_AUTOPAY, description: 'Manage recurring bills.' },
     ];

     for (const d of defaults) {
       // @ts-ignore
       await this.prisma.automationRule.create({
         data: { ...d, userId, config: {} }
       });
     }
  }
}
