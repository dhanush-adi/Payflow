import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class MerchantService {
  constructor(private prisma: PrismaService) {}

  async getMerchantByApiKey(apiKey: string) {
    const merchant = await this.prisma.merchant.findUnique({
      where: { apiKey },
    });
    if (!merchant) {
      throw new NotFoundException('Invalid Merchant API Key');
    }
    return merchant;
  }

  async getMerchantProfile(id: string) {
    const merchant = await this.prisma.merchant.findUnique({
      where: { id },
      include: {
        _count: {
          select: { transactions: true }
        }
      }
    });
    if (!merchant) {
       throw new NotFoundException('Merchant not found');
    }
    return merchant;
  }

  async getSettlementHistory(id: string) {
    return this.prisma.transaction.findMany({
      where: { merchantId: id, status: 'COMPLETED' },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
  }
}
