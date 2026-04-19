import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CryptoService } from '../crypto/crypto.service';
import { BlockchainService } from '../blockchain/blockchain.service';
// @ts-ignore
import { generateUPITxnId } from '@payflowai/utils';
// @ts-ignore
import { TxStatus } from '@prisma/client';

export interface CreatePaymentDto {
  userId: string;
  merchantId: string;
  amount: number;
  description?: string;
}

export interface PaymentResponse {
  id: string;
  upiQR?: string;
  upiDeepLink?: string;
  status: TxStatus;
  amountINR: number;
  amountUSDC: number;
  conversionRate: number;
}

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private prisma: PrismaService,
    private cryptoService: CryptoService,
    private blockchainService: BlockchainService,
  ) {}

  async createPayment(dto: CreatePaymentDto): Promise<PaymentResponse> {
    if (dto.amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    const merchant = await // @ts-ignore
    this.prisma.merchant.findUnique({
      where: { id: dto.merchantId },
    });
    if (!merchant || !merchant.isActive) {
      throw new NotFoundException('Merchant not found or inactive');
    }

    const conversion = await this.cryptoService.convertINRtoUSDC(dto.amount);
    const upiTxnId = generateUPITxnId();

    const transaction = await // @ts-ignore
    this.prisma.transaction.create({
      data: {
        userId: dto.userId,
        merchantId: dto.merchantId,
        amountINR: dto.amount,
        amountUSDC: conversion.usdcAmount,
        conversionRate: conversion.rate,
        upiTxnId,
        status: TxStatus.PENDING,
        description: dto.description,
      },
    });

    const upiQR = this.generateUPIQRCode(merchant.solanaAddress, dto.amount, upiTxnId);

    return {
      id: transaction.id,
      upiQR,
      upiDeepLink: `upi://pay?pa=${merchant.solanaAddress}&pn=PayFlow&am=${dto.amount}&tn=${upiTxnId}`,
      status: transaction.status,
      amountINR: transaction.amountINR ?? 0,
      amountUSDC: transaction.amountUSDC ?? 0,
      conversionRate: transaction.conversionRate ?? 0,
    };
  }

  async confirmUPI(txnId: string): Promise<{ success: boolean; status: string }> {
    const transaction = await // @ts-ignore
    this.prisma.transaction.findUnique({
      where: { upiTxnId: txnId },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    await // @ts-ignore
    this.prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        status: TxStatus.UPI_CONFIRMED,
        upiStatus: 'SUCCESS',
      },
    });

    return { success: true, status: 'UPI_CONFIRMED' };
  }

  async processFullTransaction(upiTxnId: string) {
    this.logger.log(`Processing full transaction pipeline for UPI ID: ${upiTxnId}`);

    const transaction = await // @ts-ignore
    this.prisma.transaction.findUnique({
      where: { upiTxnId },
      include: { merchant: true, user: true },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    // 1. Mark UPI as confirmed
    await // @ts-ignore
    this.prisma.transaction.update({
      where: { id: transaction.id },
      data: { status: TxStatus.UPI_CONFIRMED, upiStatus: 'SUCCESS' },
    });

    // 2. Settlement on Blockchain
    await // @ts-ignore
    this.prisma.transaction.update({
      where: { id: transaction.id },
      data: { status: TxStatus.BLOCKCHAIN_PENDING },
    });

    try {
      // 2. Determine Category
      const category = this.categorizeDescription(transaction.description || '');

      const settlement = await this.blockchainService.transferUSDC(
        'platform_hot_wallet', // Simulation
        transaction.merchant.solanaAddress,
        transaction.amountUSDC ?? 0
      );

      // 3. Complete Transaction
      const updated = await // @ts-ignore
    this.prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: TxStatus.COMPLETED,
          solanaTxHash: settlement.txHash,
          solanaStatus: settlement.status,
          category,
        },
      });

      // 4. Trigger Automation Rules (Round-up, etc.)
      // We'll call automationService here in a real implementation
      // for now we'll simulate the call logic
      this.logger.log(`Triggering automation for user ${transaction.userId} on transaction ${transaction.id}`);

      return { success: true, transaction: updated };
    } catch (error: any) {
      this.logger.error(`Blockchain settlement failed: ${error?.message || 'Unknown error'}`);
      await // @ts-ignore
    this.prisma.transaction.update({
        where: { id: transaction.id },
        data: { status: TxStatus.FAILED },
      });
      throw error;
    }
  }

  private categorizeDescription(description: string): string {
    const desc = description.toLowerCase();
    if (desc.includes('food') || desc.includes('zomato') || desc.includes('swiggy')) return 'Food & Dining';
    if (desc.includes('uber') || desc.includes('ola') || desc.includes('petrol') || desc.includes('fuel')) return 'Travel & Transport';
    if (desc.includes('netflix') || desc.includes('spotify') || desc.includes('hotstar')) return 'Subscriptions';
    if (desc.includes('amazon') || desc.includes('flipkart') || desc.includes('myntra')) return 'Shopping';
    if (desc.includes('electricity') || desc.includes('recharge') || desc.includes('wifi')) return 'Utility Bills';
    return 'Miscellaneous';
  }

  async getTransaction(id: string) {
    const transaction = await // @ts-ignore
    this.prisma.transaction.findUnique({
      where: { id },
      include: { merchant: true, user: true },
    });
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    return transaction;
  }

  async getUserTransactions(userId: string, limit = 10, offset = 0) {
    const [items, total] = await Promise.all([
      // @ts-ignore
    this.prisma.transaction.findMany({
        where: { userId },
        include: { merchant: true },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      // @ts-ignore
    this.prisma.transaction.count({ where: { userId } }),
    ]);

    return { items, total, limit, offset, hasMore: offset + limit < total };
  }

  async getMerchantTransactions(merchantId: string, limit = 10, offset = 0) {
    const [items, total] = await Promise.all([
      // @ts-ignore
    this.prisma.transaction.findMany({
        where: { merchantId },
        include: { user: true },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      // @ts-ignore
    this.prisma.transaction.count({ where: { merchantId } }),
    ]);

    return { items, total, limit, offset, hasMore: offset + limit < total };
  }

  private generateUPIQRCode(upiId: string, amount: number, ref: string): string {
    // @ts-ignore
    const params = new URLSearchParams({
      pa: upiId,
      pn: 'PayFlow Merchant',
      am: amount.toString(),
      tn: ref,
      cu: 'INR',
    });
    return `upi://pay?${params.toString()}`;
  }
}