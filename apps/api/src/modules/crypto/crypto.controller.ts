import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CryptoService } from './crypto.service';

@ApiTags('Crypto')
@Controller('crypto')
export class CryptoController {
  constructor(private cryptoService: CryptoService) {}

  @Get('rate')
  @ApiOperation({ summary: 'Get current INR to USDC conversion rate' })
  async getRate() {
    const rate = await this.cryptoService.getCurrentRate();
    return { rate, currency: 'USDC', base: 'INR' };
  }

  @Get('convert')
  @ApiOperation({ summary: 'Convert INR to USDC' })
  async convert(@Query('amount') amount: string) {
    const inrAmount = parseFloat(amount);
    if (isNaN(inrAmount) || inrAmount <= 0) {
      return { error: 'Invalid amount' };
    }
    return this.cryptoService.convertINRtoUSDC(inrAmount);
  }
}