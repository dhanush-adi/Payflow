import { Controller, Get, UseGuards, Request, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MerchantService } from './merchant.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Merchants')
@Controller('merchants')
export class MerchantController {
  constructor(private merchantService: MerchantService) {}

  @Get('profile')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get merchant profile' })
  async getProfile(@Request() req: any) {
    // In a real app, the user context would map to a merchant
    // For the prototype, we assume the user is the merchant
    return this.merchantService.getMerchantProfile(req.user.userId);
  }

  @Get('settlements')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get merchant settlement history' })
  async getSettlements(@Request() req: any) {
    return this.merchantService.getSettlementHistory(req.user.userId);
  }
}
