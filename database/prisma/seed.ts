import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo user
  const user = await prisma.user.upsert({
    where: { email: 'demo@payflow.ai' },
    update: {},
    create: {
      email: 'demo@payflow.ai',
      password: hashPassword('demo123'),
      name: 'Rahul Mehta',
      phone: '+919876543210',
      role: 'USER',
      kycStatus: 'APPROVED',
      solanaAddress: '7xKXjg2e3VWsk1x2zddS7pDhJvDkBnP3mC5vC5cWjQ8Z',
      upiId: 'rahul@payflow',
    },
  });
  console.log('✅ Created demo user:', user.email);

  // Create demo merchant
  const merchant = await prisma.merchant.upsert({
    where: { email: 'merchant@payflow.ai' },
    update: {},
    create: {
      email: 'merchant@payflow.ai',
      businessName: 'TechMart India',
      phone: '+919876543211',
      solanaAddress: '9fkj2Kjg2e3VWsk1x2zddS7pDhJvDkBnP3mC5vC5cWjQ8Z',
      apiKey: 'mk_live_demo_' + crypto.randomBytes(16).toString('hex'),
      isActive: true,
    },
  });
  console.log('✅ Created demo merchant:', merchant.businessName);

  // Create demo transactions
  const categories = ['Food & Dining', 'Shopping', 'Travel', 'Subscriptions', 'Entertainment'];
  const descriptions = [
    'Zomato order - Biryani',
    'Amazon purchase - Electronics',
    'Uber ride to airport',
    'Netflix subscription',
    'Spotify Premium',
    'Swiggy order - Pizza',
    'Myntra - Clothing',
    'Ola cab ride',
    'Hotstar VIP',
    'Flipkart order',
  ];

  for (let i = 0; i < 20; i++) {
    const inrAmount = Math.floor(Math.random() * 5000) + 100;
    const rate = 83.45;
    const usdcAmount = inrAmount / rate;
    
    await prisma.transaction.create({
      data: {
        userId: user.id,
        merchantId: merchant.id,
        amountINR: inrAmount,
        amountUSDC: usdcAmount,
        conversionRate: rate,
        upiTxnId: `UPI${Date.now().toString(36).toUpperCase()}${i}`,
        upiStatus: 'SUCCESS',
        solanaTxHash: `mock_tx_${crypto.randomBytes(8).toString('hex')}`,
        solanaStatus: 'CONFIRMED',
        status: 'COMPLETED',
        category: categories[Math.floor(Math.random() * categories.length)],
        description: descriptions[Math.floor(Math.random() * descriptions.length)],
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      },
    });
  }
  console.log('✅ Created 20 demo transactions');

  // Create AI Insights
  const insights = [
    { type: 'SPENDING_ALERT', title: 'High Spending Alert', description: 'Your spending this week is 25% higher than usual. Consider reviewing your discretionary purchases.' },
    { type: 'SAVINGS_SUGGESTION', title: 'Auto-Save Opportunity', description: 'You could save ₹1,250/month by enabling Auto-Round-Up. Every ₹10 spent, ₹1 saved automatically.' },
    { type: 'SUBSCRIPTION_ALERT', title: 'Subscription Found', description: 'We detected 3 recurring subscriptions: Netflix, Spotify, and Amazon Prime. Total: ₹799/month' },
    { type: 'INVESTMENT_TIP', title: 'Investment Opportunity', description: 'Based on your transaction patterns, consider setting aside 10% of income for investments.' },
    { type: 'BUDGET_WARNING', title: 'Budget Limit Warning', description: 'You\'ve used 85% of your monthly Food & Dining budget with 15 days remaining.' },
  ];

  for (const insight of insights) {
    await prisma.aiInsight.create({
      data: {
        userId: user.id,
        type: insight.type,
        title: insight.title,
        description: insight.description,
        data: JSON.stringify({ detected: true, source: 'ai-analysis' }),
      },
    });
  }
  console.log('✅ Created 5 AI insights');

  // Create Subscriptions
  const subscriptions = [
    { name: 'Netflix Premium', amount: 199, frequency: 'MONTHLY' },
    { name: 'Spotify Premium', amount: 129, frequency: 'MONTHLY' },
    { name: 'Amazon Prime', amount: 299, frequency: 'YEARLY' },
    { name: 'Hotstar VIP', amount: 899, frequency: 'YEARLY' },
    { name: 'Gym Membership', amount: 1500, frequency: 'MONTHLY' },
  ];

  for (const sub of subscriptions) {
    await prisma.subscription.create({
      data: {
        userId: user.id,
        name: sub.name,
        amount: sub.amount,
        frequency: sub.frequency,
        nextDueDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
        isActive: true,
        autoPayEnabled: Math.random() > 0.5,
      },
    });
  }
  console.log('✅ Created subscriptions');

  // Create Automation Rules
  const rules = [
    { type: 'ROUND_UP', name: 'Auto Round-up Savings', description: 'Round every transaction to nearest ₹10', config: JSON.stringify({ percentage: 10, maxAmount: 100 }) },
    { type: 'PERCENTAGE', name: '10% Investment Rule', description: 'Auto-invest 10% of every settlement', config: JSON.stringify({ percentage: 10 }) },
    { type: 'RESERVE', name: 'Emergency Fund', description: 'Set aside 5% for emergencies', config: JSON.stringify({ percentage: 5, wallet: 'emergency_vault' }) },
  ];

  for (const rule of rules) {
    await prisma.automationRule.create({
      data: {
        userId: user.id,
        type: rule.type,
        name: rule.name,
        description: rule.description,
        config: rule.config,
        isActive: Math.random() > 0.5,
        lastRunAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
      },
    });
  }
  console.log('✅ Created automation rules');

  console.log('\n🎉 Database seeded successfully!');
  console.log('\n📋 Demo Credentials:');
  console.log('   Email: demo@payflow.ai');
  console.log('   Password: demo123');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
