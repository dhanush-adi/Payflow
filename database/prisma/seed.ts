import { PrismaClient, Role, KycStatus, TxStatus, InsightType, Frequency } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const demoUser = await prisma.user.upsert({
    where: { email: 'user@payflow.ai' },
    update: {},
    create: {
      email: 'user@payflow.ai',
      phone: '+919999999999',
      name: 'Demo User',
      role: Role.USER,
      solanaAddress: 'DemoSolanaAddress123456789',
      upiId: 'demo@payflow',
      kycStatus: KycStatus.APPROVED,
    },
  });

  const demoMerchant = await prisma.merchant.upsert({
    where: { email: 'merchant@payflow.ai' },
    update: {},
    create: {
      businessName: 'Demo Merchant',
      email: 'merchant@payflow.ai',
      phone: '+919999999998',
      solanaAddress: 'MerchantSolanaAddress12345678',
      apiKey: 'pk_test_demo_merchant_key_12345',
      isActive: true,
    },
  });

  const transactions = [
    {
      userId: demoUser.id,
      merchantId: demoMerchant.id,
      amountINR: 500,
      amountUSDC: 6.02,
      conversionRate: 0.01204,
      status: TxStatus.COMPLETED,
      category: 'FOOD',
      description: 'Coffee and snacks',
      upiTxnId: 'UPI1234567890',
      upiStatus: 'SUCCESS',
      solanaTxHash: 'sol_test_hash_abc123',
      solanaStatus: 'CONFIRMED',
    },
    {
      userId: demoUser.id,
      merchantId: demoMerchant.id,
      amountINR: 1200,
      amountUSDC: 14.45,
      conversionRate: 0.01204,
      status: TxStatus.COMPLETED,
      category: 'SHOPPING',
      description: 'Clothing',
      upiTxnId: 'UPI0987654321',
      upiStatus: 'SUCCESS',
      solanaTxHash: 'sol_test_hash_def456',
      solanaStatus: 'CONFIRMED',
    },
    {
      userId: demoUser.id,
      merchantId: demoMerchant.id,
      amountINR: 2500,
      amountUSDC: 30.10,
      conversionRate: 0.01204,
      status: TxStatus.PENDING,
      category: 'TRANSPORT',
      description: 'Taxi fare',
    },
  ];

  for (const tx of transactions) {
    await prisma.transaction.upsert({
      where: { upiTxnId: tx.upiTxnId || 'pending_' + Math.random().toString(36) },
      update: {},
      create: tx,
    });
  }

  const insights = [
    {
      userId: demoUser.id,
      type: InsightType.SPENDING_ALERT,
      title: 'High spending on Food',
      description: 'Your food expenses increased by 25% this month compared to last month.',
      data: { category: 'FOOD', change: 25, threshold: 20 },
      actionTaken: false,
    },
    {
      userId: demoUser.id,
      type: InsightType.SAVINGS_SUGGESTION,
      title: 'Save ₹5,000 monthly',
      description: 'Based on your spending pattern, you could save ₹5,000 by reducing subscription services.',
      data: { potentialSavings: 5000, subscriptions: 3 },
      actionTaken: false,
    },
  ];

  for (const insight of insights) {
    await prisma.aiInsight.create({ data: insight });
  }

  const subscriptions = [
    {
      userId: demoUser.id,
      name: 'Netflix',
      amount: 499,
      frequency: Frequency.MONTHLY,
      nextDueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      isActive: true,
      autoPayEnabled: false,
    },
    {
      userId: demoUser.id,
      name: 'Spotify',
      amount: 299,
      frequency: Frequency.MONTHLY,
      nextDueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      isActive: true,
      autoPayEnabled: true,
    },
  ];

  for (const sub of subscriptions) {
    await prisma.subscription.create({ data: sub });
  }

  console.log('Database seeded successfully!');
  console.log({ demoUser: demoUser.id, demoMerchant: demoMerchant.id });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });