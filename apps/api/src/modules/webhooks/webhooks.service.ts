import { Injectable, Logger } from '@nestjs/common';
import { PaymentsService } from '../payments/payments.service';
import { PrismaService } from '../../common/prisma.service';
// @ts-ignore
import { TxStatus } from '@prisma/client';

interface UPIWebhookBody {
  txnId: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  amount: number;
  timestamp: string;
  payerVpa: string;
  payerName: string;
  payeeVpa: string;
}

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(
    // @ts-ignore
    private paymentsService: PaymentsService,
    private prisma: PrismaService,
  ) {}

  async handleUPIWebhook(body: UPIWebhookBody) {
    this.logger.log(`Received UPI webhook: ${body.txnId} - ${body.status}`);

    const transaction = await this.prisma.transaction.findUnique({
      where: { upiTxnId: body.txnId },
    });

    if (!transaction) {
      this.logger.warn(`Transaction not found for txnId: ${body.txnId}`);
      return { success: false, message: 'Transaction not found' };
    }

    if (body.status === 'SUCCESS') {
      await this.prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: TxStatus.UPI_CONFIRMED,
          upiStatus: 'SUCCESS',
        },
      });

      this.logger.log(`Transaction ${transaction.id} confirmed, initiating USDC transfer`);
      
      return { success: true, status: 'UPI_CONFIRMED', transactionId: transaction.id };
    }

    if (body.status === 'FAILED') {
      await this.prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: TxStatus.FAILED,
          upiStatus: 'FAILED',
        },
      });

      return { success: false, status: 'FAILED', transactionId: transaction.id };
    }

    return { success: true, status: 'PENDING' };
  }
}