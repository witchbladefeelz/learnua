import { Controller, Get, Post, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { LessonsService } from './lessons.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CompleteLessonDto } from './dto/complete-lesson.dto';

@ApiTags('Lessons')
@Controller('lessons')
export class LessonsController {
  constructor(private lessonsService: LessonsService) {}

  @ApiOperation({ summary: 'Get all lessons' })
  @ApiResponse({ status: 200, description: 'Lessons retrieved successfully' })
  @Get()
  async getAllLessons(@Query('category') category?: string, @Query('userId') userId?: string) {
    if (category) {
      return this.lessonsService.findByCategory(category, userId);
    }
    return this.lessonsService.findAll(userId);
  }

  @ApiOperation({ summary: 'Get lessons for authenticated user' })
  @ApiResponse({ status: 200, description: 'User lessons retrieved successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('my')
  async getMyLessons(@Request() req, @Query('category') category?: string) {
    if (category) {
      return this.lessonsService.findByCategory(category, req.user.id);
    }
    return this.lessonsService.findAll(req.user.id);
  }

  @ApiOperation({ summary: 'Get lesson by ID' })
  @ApiResponse({ status: 200, description: 'Lesson found' })
  @ApiResponse({ status: 404, description: 'Lesson not found' })
  @Get(':id')
  async getLessonById(@Param('id') id: string) {
    const lesson = await this.lessonsService.findById(id, true);
    if (!lesson) {
      throw new Error('Lesson not found');
    }
    return lesson;
  }

  @ApiOperation({ summary: 'Get exercises for a lesson' })
  @ApiResponse({ status: 200, description: 'Exercises retrieved successfully' })
  @Get(':id/exercises')
  async getLessonExercises(@Param('id') id: string) {
    return this.lessonsService.getExercises(id);
  }

  @ApiOperation({ summary: 'Complete a lesson' })
  @ApiResponse({ status: 201, description: 'Lesson completed successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/complete')
  async completeLesson(
    @Request() req,
    @Param('id') id: string,
    @Body() completeLessonDto: CompleteLessonDto,
  ) {
    return this.lessonsService.completeLesson(req.user.id, id, completeLessonDto);
  }

  @ApiOperation({ summary: 'Get user progress' })
  @ApiResponse({ status: 200, description: 'Progress retrieved successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('progress/me')
  async getMyProgress(@Request() req) {
    return this.lessonsService.getUserProgress(req.user.id);
  }
}
