import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('AI Copilot')
@Controller('ai')
export class AiController {
  constructor(private aiService: AiService) {}

  @Get('insights')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get AI spending insights' })
  async getInsights(@Request() req: any) {
    return this.aiService.getInsights(req.user.userId);
  }

  @Post('refresh-insights')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Manually trigger insight analysis' })
  async refreshInsights(@Request() req: any) {
    return this.aiService.analyzeTransactions(req.user.userId);
  }
}
