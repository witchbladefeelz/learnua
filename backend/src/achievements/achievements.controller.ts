import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { AchievementsService } from './achievements.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Achievements')
@Controller('achievements')
export class AchievementsController {
  constructor(private achievementsService: AchievementsService) {}

  @ApiOperation({ summary: 'Get all available achievements' })
  @ApiResponse({ status: 200, description: 'Achievements retrieved successfully' })
  @Get()
  async getAllAchievements() {
    return this.achievementsService.getAllAchievements();
  }

  @ApiOperation({ summary: 'Get user achievements' })
  @ApiResponse({ status: 200, description: 'User achievements retrieved successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('my')
  async getMyAchievements(@Request() req) {
    return this.achievementsService.getUserAchievements(req.user.id);
  }

  @ApiOperation({ summary: 'Get achievement progress' })
  @ApiResponse({ status: 200, description: 'Achievement progress retrieved successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('progress')
  async getAchievementProgress(@Request() req) {
    return this.achievementsService.getAchievementProgress(req.user.id);
  }

  @ApiOperation({ summary: 'Check and unlock new achievements' })
  @ApiResponse({ status: 200, description: 'Achievements checked and unlocked' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('check')
  async checkAchievements(@Request() req) {
    return this.achievementsService.checkAndUnlockAchievements(req.user.id);
  }
}
