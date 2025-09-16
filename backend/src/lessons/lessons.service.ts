import { Injectable } from '@nestjs/common';
import { Lesson, Exercise, CompletedLesson, Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { UsersService } from '../users/users.service';
import { CompleteLessonDto } from './dto/complete-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  async findAll(userId?: string): Promise<Lesson[]> {
    const lessons = await this.prisma.lesson.findMany({
      where: { isActive: true },
      orderBy: [{ level: 'asc' }, { order: 'asc' }],
      include: {
        exercises: {
          select: {
            id: true,
            type: true,
            order: true,
          },
        },
        completedBy: userId ? {
          where: { userId },
          select: {
            id: true,
            score: true,
            completedAt: true,
          },
        } : false,
      },
    });

    return lessons;
  }

  async findByCategory(category: string, userId?: string): Promise<Lesson[]> {
    return this.prisma.lesson.findMany({
      where: { 
        category: category.toUpperCase() as any,
        isActive: true,
      },
      orderBy: { order: 'asc' },
      include: {
        exercises: {
          select: {
            id: true,
            type: true,
            order: true,
          },
        },
        completedBy: userId ? {
          where: { userId },
          select: {
            id: true,
            score: true,
            completedAt: true,
          },
        } : false,
      },
    });
  }

  async findById(id: string, includeExercises: boolean = false): Promise<Lesson | null> {
    return this.prisma.lesson.findUnique({
      where: { id },
      include: {
        exercises: includeExercises ? {
          orderBy: { order: 'asc' },
        } : false,
      },
    });
  }

  async getExercises(lessonId: string): Promise<Exercise[]> {
    return this.prisma.exercise.findMany({
      where: { lessonId },
      orderBy: { order: 'asc' },
    });
  }

  async completeLesson(
    userId: string,
    lessonId: string,
    completeLessonDto: CompleteLessonDto,
  ): Promise<CompletedLesson> {
    const { score, timeSpent, answers } = completeLessonDto;

    // Check if lesson exists
    const lesson = await this.findById(lessonId);
    if (!lesson) {
      throw new Error('Lesson not found');
    }

    // Calculate XP earned
    let xpEarned = lesson.xpReward;
    if (score === 100) {
      xpEarned += 5; // Perfect score bonus
    }

    // Check if already completed
    const existingCompletion = await this.prisma.completedLesson.findUnique({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
    });

    let completedLesson: CompletedLesson;

    if (existingCompletion) {
      // Update if score is better
      if (score > existingCompletion.score) {
        completedLesson = await this.prisma.completedLesson.update({
          where: { id: existingCompletion.id },
          data: {
            score,
            xpEarned,
            timeSpent,
            completedAt: new Date(),
          },
        });

        // Update user XP only if score improved
        const xpDifference = xpEarned - existingCompletion.xpEarned;
        if (xpDifference > 0) {
          await this.usersService.updateXP(userId, xpDifference);
        }
      } else {
        completedLesson = existingCompletion;
      }
    } else {
      // Create new completion
      completedLesson = await this.prisma.completedLesson.create({
        data: {
          userId,
          lessonId,
          score,
          xpEarned,
          timeSpent,
        },
      });

      // Update user XP
      await this.usersService.updateXP(userId, xpEarned);
    }

    // Record progress
    await this.prisma.progress.create({
      data: {
        userId,
        lessonId,
        xpGained: xpEarned,
        accuracy: score,
        timeSpent,
      },
    });

    // Update streak information
    await this.usersService.updateLastActive(userId);

    return completedLesson;
  }

  async getUserProgress(userId: string) {
    const completedLessons = await this.prisma.completedLesson.findMany({
      where: { userId },
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
            category: true,
            level: true,
          },
        },
      },
    });

    const totalLessons = await this.prisma.lesson.count({
      where: { isActive: true },
    });

    const progressByCategory = await this.prisma.completedLesson.groupBy({
      by: ['lessonId'],
      where: { 
        userId,
        lesson: { isActive: true },
      },
      _count: true,
    });

    return {
      completedLessons: completedLessons.length,
      totalLessons,
      completionRate: Math.round((completedLessons.length / totalLessons) * 100),
      completedLessonsData: completedLessons,
    };
  }
}
