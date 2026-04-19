import { Controller, Post, Get, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new payment' })
  async createPayment(@Body() dto: CreatePaymentDto, @Request() req: any) {
    return this.paymentsService.createPayment({
      ...dto,
      userId: req.user.userId,
    });
  }

  @Post(':id/confirm')
  @ApiOperation({ summary: 'Confirm UPI payment (simulator)' })
  async confirmUPI(@Param('id') id: string) {
    const transaction = await this.paymentsService.getTransaction(id);
    return this.paymentsService.confirmUPI(transaction.upiTxnId!);
  }

  @Get('my')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user transactions' })
  async getMyTransactions(
    @Request() req: any,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.paymentsService.getUserTransactions(
      req.user.userId,
      limit || 10,
      offset || 0,
    );
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get transaction by ID' })
  async getTransaction(@Param('id') id: string) {
    return this.paymentsService.getTransaction(id);
  }

  @Post('upi-callback')
  @ApiOperation({ summary: 'Mock UPI callback (Simulator)' })
  async mockUPI(@Body() body: { upiTxnId: string; status: string }) {
    return this.paymentsService.processFullTransaction(body.upiTxnId);
  }

  @Post(':id/simulate-success')
  @ApiOperation({ summary: 'Simulate successful UPI payment & settle on Solana' })
  async simulateSuccess(@Param('id') id: string) {
    const transaction = await this.paymentsService.getTransaction(id);
    return this.paymentsService.processFullTransaction(transaction.upiTxnId!);
  }
}