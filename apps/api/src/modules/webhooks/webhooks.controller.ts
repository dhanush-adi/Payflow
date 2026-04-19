import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { WebhooksService } from './webhooks.service';

interface UPIWebhookBody {
  txnId: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  amount: number;
  timestamp: string;
  payerVpa: string;
  payerName: string;
  payeeVpa: string;
}

@ApiTags('Webhooks')
@Controller('webhooks')
export class WebhooksController {
  constructor(private webhooksService: WebhooksService) {}

  @Post('upi')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'UPI payment webhook callback' })
  async handleUPIWebhook(@Body() body: UPIWebhookBody) {
    return this.webhooksService.handleUPIWebhook(body);
  }
}