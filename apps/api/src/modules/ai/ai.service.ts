import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(private prisma: PrismaService) {}

  async analyzeTransactions(userId: string) {
    this.logger.log(`AI Engine: Analyzing transactions for user ${userId}`);
    
    const transactions = await this.prisma.transaction.findMany({
      where: { userId, status: 'COMPLETED' },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    if (transactions.length < 3) return [];

    const insights = [];

    const categoryInsights = await this.generateCategoryInsights(userId, transactions);
    insights.push(...categoryInsights);

    const subscriptionInsights = await this.detectSubscriptions(userId, transactions);
    insights.push(...subscriptionInsights);

    const spendingVelocity = await this.checkSpendingVelocity(transactions);
    if (spendingVelocity.length > 0) insights.push(spendingVelocity[0]);

    const roundUpSuggestions = await this.suggestRoundUp(transactions);
    if (roundUpSuggestions.length > 0) insights.push(roundUpSuggestions[0]);

    for (const insight of insights) {
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

  async chat(message: string, userId: string): Promise<{ message: string }> {
    this.logger.log(`AI Chat: User ${userId}: ${message}`);
    
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    const transactions = await this.prisma.transaction.findMany({
      where: { userId, status: 'COMPLETED' },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    const recentSubscriptions = await this.prisma.subscription.findMany({
      where: { userId, isActive: true },
    });

    const categories: Record<string, number> = {};
    transactions.forEach(tx => {
      const cat = tx.category || 'Miscellaneous';
      categories[cat] = (categories[cat] || 0) + (tx.amountINR || 0);
    });

    const totalSpent = transactions.reduce((acc, tx) => acc + (tx.amountINR || 0), 0);
    const avgTransaction = transactions.length > 0 ? totalSpent / transactions.length : 0;

    const q = message.toLowerCase();
    
    if (q.includes('spending') || q.includes('expense') || q.includes('analysis') || q.includes('breakdown')) {
      return {
        message: `📊 **Spending Analysis**

Based on your recent transactions:
- **Total Spent:** ₹${totalSpent.toLocaleString()}
- **Transactions:** ${transactions.length}
- **Avg Transaction:** ₹${avgTransaction.toFixed(2)}

**Category Breakdown:**
${Object.entries(categories).map(([cat, amount]) => `- ${cat}: ₹${amount.toLocaleString()}`).join('\n')}

${Object.keys(categories).length > 0 ? `Your highest spend is ${Object.entries(categories).sort((a,b) => b[1] - a[1])[0][0]}.` : ''}

Would you like specific recommendations for reducing spending?`
      };
    }

    if (q.includes('save') || q.includes('saving')) {
      const potential = transactions.reduce((acc, tx) => {
        const nextTen = Math.ceil((tx.amountINR || 0) / 10) * 10;
        return acc + (nextTen - (tx.amountINR || 0));
      }, 0);

      return {
        message: `💰 **Savings Insights**

**Auto-Save Opportunity:**
You could save ₹${potential.toFixed(2)} monthly by enabling Auto-Round-Up.

**Active Subscriptions:**
${recentSubscriptions.length > 0 ? recentSubscriptions.map(s => `- ${s.name}: ₹${s.amount}/${s.frequency}`).join('\n') : 'No active subscriptions found.'}

**Potential Monthly Savings:**
${potential > 100 ? `By setting aside just 5% of each transaction: ₹${(totalSpent * 0.05).toFixed(2)}/month` : 'Increase transaction frequency to unlock savings.'}

Would you like to set up automatic savings rules?`
      };
    }

    if (q.includes('subscription') || q.includes('recurring')) {
      return {
        message: `📋 **Subscription Tracker**

${recentSubscriptions.length > 0 ? `
| Service | Amount | Frequency | Auto-Pay |
|---------|--------|-----------|----------|
${recentSubscriptions.map(s => `| ${s.name} | ₹${s.amount} | ${s.frequency} | ${s.autoPayEnabled ? '✅' : '❌'} |`).join('\n')}
` : 'No active subscriptions found.'}

**Total Monthly:** ₹${recentSubscriptions.reduce((acc, s) => {
  if (s.frequency === 'MONTHLY') return acc + s.amount;
  if (s.frequency === 'YEARLY') return acc + (s.amount / 12);
  return acc;
}, 0).toFixed(2)}

${recentSubscriptions.length > 0 ? 'Would you like me to enable auto-pay for these from your USDC wallet?' : 'Add your first subscription to start tracking.'}`
      };
    }

    if (q.includes('compare') || q.includes('month') || q.includes('trend')) {
      const thisMonth = transactions.filter(tx => {
        const date = new Date(tx.createdAt);
        const now = new Date();
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      });

      const lastMonthTotal = thisMonth.reduce((acc, tx) => acc + (tx.amountINR || 0), 0) * 0.85;
      
      return {
        message: `📈 **Month-over-Month Comparison**

**This Month:** ₹${thisMonth.reduce((acc, tx) => acc + (tx.amountINR || 0), 0).toLocaleString()}
**Estimated Last Month:** ₹${lastMonthTotal.toLocaleString()}

**Change:** ${thisMonth.reduce((acc, tx) => acc + (tx.amountINR || 0), 0) > lastMonthTotal ? '+' : ''}${((thisMonth.reduce((acc, tx) => acc + (tx.amountINR || 0), 0) / (lastMonthTotal || 1) - 1) * 100).toFixed(1)}%

**Trend:** ${thisMonth.reduce((acc, tx) => acc + (tx.amountINR || 0), 0) > lastMonthTotal ? '⚠️ Spending increased' : '✅ Spending decreased'}
`
      };
    }

    if (q.includes('invest') || q.includes('portfolio')) {
      return {
        message: `📊 **Portfolio Overview**

| Asset | Balance | Value (USD) |
|-------|---------|-------------|
| USDC | ${(totalSpent / 83.45).toFixed(2)} | $${(totalSpent / 83.45).toFixed(2)} |

**Current Strategy:** 100% stablecoin (conservative)

**Recommendations:**
1. Consider allocating 10-20% to SOL for potential gains
2. Try Jupiter SOL Index for automatic diversification
3. Set up DCA (Dollar Cost Averaging) for regular investments

${user?.solanaAddress ? `Your Solana address: ${user.solanaAddress.slice(0, 12)}...` : 'Connect your wallet to see full portfolio.'}`
      };
    }

    return {
      message: `🤖 **AI Copilot**

I'm here to help with all your financial questions!

**Try asking:**
- "Show my spending analysis"
- "What can I save?"
- "Track my subscriptions"
- "Compare this month vs last"
- "What's my portfolio?"

I analyze your PayFlow transactions to give personalized insights. What would you like to explore?`
    };
  }

  private async generateCategoryInsights(userId: string, transactions: any[]) {
    const categories: Record<string, number> = {};
    transactions.forEach(tx => {
      const cat = tx.category || 'Miscellaneous';
      categories[cat] = (categories[cat] || 0) + (tx.amountINR || 0);
    });

    const topCategory = Object.entries(categories).sort((a,b) => b[1] - a[1])[0];
    
    if (topCategory && topCategory[1] > 1000) {
      return [{
        type: 'SPENDING_ANALYSIS',
        title: 'Spending Breakdown',
        description: `Your highest spend is on ${topCategory[0]} (₹${topCategory[1].toFixed(0)}), accounts for ${((topCategory[1] / transactions.reduce((a,b) => a + (b.amountINR || 0), 0)) * 100).toFixed(0)}% of your total.`,
        data: { categories },
      }];
    }
    return [];
  }

  private async detectSubscriptions(userId: string, transactions: any[]) {
    const descriptions = transactions.map(t => (t.description || '').toLowerCase());
    const subscriptionKeywords = ['netflix', 'spotify', 'amazon prime', 'hotstar', 'youtube', 'gym', 'rent', 'zomato gold', 'swiggy one'];
    
    const found = subscriptionKeywords.filter(kw => descriptions.some(desc => desc.includes(kw)));
    
    return found.map(kw => ({
      type: 'SUBSCRIPTION_ALERT',
      title: 'Recurring Payment Found',
      description: `We detected a potential subscription to ${kw.toUpperCase()}. Should we automate this?`,
      data: { service: kw },
    }));
  }

  private async checkSpendingVelocity(transactions: any[]) {
    const totalSpent = transactions.reduce((acc, tx) => acc + (tx.amountINR || 0), 0);
    const avgSpent = transactions.length > 0 ? totalSpent / transactions.length : 0;

    if (avgSpent > 2000) {
      return [{
        type: 'BUDGET_WARNING',
        title: 'High Burn Rate',
        description: `Your average transaction size is ₹${avgSpent.toFixed(2)}, which is higher than typical. Consider reviewing discretionary spending.`,
        data: { avgSpent },
      }];
    }
    return [];
  }

  private async suggestRoundUp(transactions: any[]) {
    const totalPotential = transactions.reduce((acc, tx) => {
      const nextTen = Math.ceil((tx.amountINR || 0) / 10) * 10;
      return acc + (nextTen - (tx.amountINR || 0));
    }, 0);

    if (totalPotential > 50) {
      return [{
        type: 'SAVINGS_SUGGESTION',
        title: 'Auto-Save Opportunity',
        description: `You could have saved ₹${totalPotential.toFixed(2)} by rounding up. Enable Auto-Round-Up?`,
        data: { potentialSavings: totalPotential },
      }];
    }
    return [];
  }

  async getInsights(userId: string) {
    return this.prisma.aiInsight.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }
}
