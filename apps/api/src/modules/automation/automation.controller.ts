import { Controller, Get, Post, UseGuards, Request, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AutomationService } from './automation.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Automation')
@Controller('automation')
export class AutomationController {
  constructor(private automationService: AutomationService) {}

  @Get('rules')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user automation rules' })
  async getRules(@Request() req: any) {
    let rules = await this.automationService.getUserRules(req.user.userId);
    if (rules.length === 0) {
      await this.automationService.seedDefaultRules(req.user.userId);
      rules = await this.automationService.getUserRules(req.user.userId);
    }
    return rules;
  }

  @Post('rules/:id/toggle')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Toggle an automation rule' })
  async toggleRule(@Param('id') id: string, @Request() req: any) {
    return this.automationService.toggleRule(req.user.userId, id);
  }
}
