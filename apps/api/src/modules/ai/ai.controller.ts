import { Controller, Post, Get, Body, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('AI')
@Controller('ai')
export class AiController {
  constructor(private aiService: AiService) {}

  @Get('insights')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get AI insights for the user' })
  async getInsights(@Request() req: any) {
    return this.aiService.getInsights(req.user.userId || req.user.sub);
  }

  @Post('analyze')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Trigger AI analysis of user transactions' })
  async analyzeTransactions(@Request() req: any) {
    return this.aiService.analyzeTransactions(req.user.userId || req.user.sub);
  }

  @Post('chat')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Chat with AI copilot' })
  async chat(@Body() body: { message: string; context?: any }, @Request() req: any) {
    return this.aiService.chat(body.message, req.user.userId || req.user.sub);
  }
}
