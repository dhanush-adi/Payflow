import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
// @ts-ignore
import { InsightType, Transaction, AutomationType } from '@prisma/client';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(private prisma: PrismaService) {}

  async analyzeTransactions(userId: string) {
    this.logger.log(`AI Engine: Analyzing transactions for user ${userId}`);
    
    // @ts-ignore
    const transactions = await this.prisma.transaction.findMany({
      where: { userId, status: 'COMPLETED' },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }) as any[];

    if (transactions.length < 3) return [];

    const insights = [];

    // 4. Category Breakdown
    const categoryInsights = await this.generateCategoryInsights(userId, transactions);
    insights.push(...categoryInsights);

    // Save generated insights
    for (const insight of insights) {
      // @ts-ignore
      await this.prisma.aiInsight.create({
        data: {
          userId,
          type: insight.type,
          title: insight.title,
          description: insight.description,
          data: JSON.stringify(insight.data),
        },
      });
    }

    return insights;
  }

  private async generateCategoryInsights(userId: string, transactions: any[]) {
    const categories: Record<string, number> = {};
    transactions.forEach(tx => {
      const cat = tx.category || 'Miscellaneous';
      categories[cat] = (categories[cat] || 0) + tx.amountINR;
    });

    const topCategory = Object.entries(categories).sort((a,b) => b[1] - a[1])[0];
    
    if (topCategory && topCategory[1] > 1000) {
      return [{
        type: InsightType.SPENDING_ANALYSIS,
        title: 'Spending Breakdown',
        description: `Your highest spend is on ${topCategory[0]} (₹${topCategory[1].toFixed(0)}), accounts for ${((topCategory[1] / transactions.reduce((a,b) => a + b.amountINR, 0)) * 100).toFixed(0)}% of your total.`,
        data: { categories },
      }];
    }
    return [];
  }

  private async detectSubscriptions(userId: string, transactions: any[]) {
    const descriptions = transactions.map(t => t.description?.toLowerCase() || '');
    const subscriptionKeywords = ['netflix', 'spotify', 'amazon prime', 'hotstar', 'youtube', 'gym', 'rent', 'zomato gold', 'swiggy one'];
    
    const found = subscriptionKeywords.filter(kw => descriptions.some(desc => desc.includes(kw)));
    
    return found.map(kw => ({
      type: InsightType.SUBSCRIPTION_ALERT,
      title: 'Recurring Payment Found',
      description: `We detected a potential subscription to ${kw.toUpperCase()}. Should we automate this via stablecoins to avoid late fees?`,
      data: { service: kw },
    }));
  }

  private async checkSpendingVelocity(userId: string, transactions: any[]) {
    const totalSpent = transactions.reduce((acc, tx) => acc + tx.amountINR, 0);
    const avgSpent = totalSpent / transactions.length;

    if (avgSpent > 2000) {
      return [{
        type: InsightType.BUDGET_WARNING,
        title: 'High Burn Rate',
        description: `Your average transaction size is ₹${avgSpent.toFixed(2)}, which is 30% higher than last month.`,
        data: { avgSpent },
      }];
    }
    return [];
  }

  private async suggestRoundUp(userId: string, transactions: any[]) {
    const totalPotential = transactions.reduce((acc, tx) => {
      const nextTen = Math.ceil(tx.amountINR / 10) * 10;
      return acc + (nextTen - tx.amountINR);
    }, 0);

    if (totalPotential > 50) {
      return [{
        type: InsightType.SAVINGS_SUGGESTION,
        title: 'Auto-Save Opportunity',
        description: `You could have saved ₹${totalPotential.toFixed(2)} this week by rounding up your transactions. Enable Auto-Round-Up?`,
        data: { potentialSavings: totalPotential, type: AutomationType.ROUND_UP },
      }];
    }
    return [];
  }

  async getInsights(userId: string) {
    // @ts-ignore
    return this.prisma.aiInsight.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
  }
}
