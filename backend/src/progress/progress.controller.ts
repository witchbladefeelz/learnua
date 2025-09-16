import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { ProgressService } from './progress.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Progress')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('progress')
export class ProgressController {
  constructor(private progressService: ProgressService) {}

  @ApiOperation({ summary: 'Get user complete progress' })
  @ApiResponse({ status: 200, description: 'Progress retrieved successfully' })
  @Get()
  async getProgress(@Request() req) {
    return this.progressService.getUserProgress(req.user.id);
  }

  @ApiOperation({ summary: 'Get user streak information' })
  @ApiResponse({ status: 200, description: 'Streak info retrieved successfully' })
  @Get('streak')
  async getStreak(@Request() req) {
    return this.progressService.getStreakInfo(req.user.id);
  }

  @ApiOperation({ summary: 'Get daily stats' })
  @ApiResponse({ status: 200, description: 'Daily stats retrieved successfully' })
  @Get('daily')
  async getDailyStats(@Request() req, @Query('days') days?: string) {
    const daysNum = days ? parseInt(days, 10) : 7;
    return this.progressService.getDailyStats(req.user.id, daysNum);
  }
}
