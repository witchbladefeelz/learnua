import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  async getUserProgress(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        completedLessons: {
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
        },
        achievements: {
          include: {
            achievement: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const totalLessons = await this.prisma.lesson.count({
      where: { isActive: true },
    });

    const progressStats = await this.prisma.progress.groupBy({
      by: ['userId'],
      where: { userId },
      _sum: {
        xpGained: true,
        timeSpent: true,
      },
      _avg: {
        accuracy: true,
      },
      _count: true,
    });

    const categoryProgress = await this.prisma.completedLesson.findMany({
      where: { userId },
      include: {
        lesson: {
          select: {
            category: true,
          },
        },
      },
    });

    // Group by category
    const progressByCategory = categoryProgress.reduce((acc, completed) => {
      const category = completed.lesson.category;
      if (!acc[category]) {
        acc[category] = { completed: 0, totalXP: 0 };
      }
      acc[category].completed += 1;
      acc[category].totalXP += completed.xpEarned;
      return acc;
    }, {} as Record<string, { completed: number; totalXP: number }>);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        level: user.level,
        xp: user.xp,
        streak: user.streak,
        avatar: user.avatar,
      },
      stats: {
        completedLessons: user.completedLessons.length,
        totalLessons,
        completionRate: Math.round((user.completedLessons.length / totalLessons) * 100),
        totalXPGained: progressStats[0]?._sum?.xpGained || 0,
        totalTimeSpent: progressStats[0]?._sum?.timeSpent || 0,
        averageAccuracy: Math.round(progressStats[0]?._avg?.accuracy || 0),
        activeDays: progressStats[0]?._count || 0,
      },
      categoryProgress: progressByCategory,
      achievements: user.achievements.map(ua => ({
        ...ua.achievement,
        unlockedAt: ua.unlockedAt,
      })),
      recentCompletions: user.completedLessons
        .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
        .slice(0, 5),
    };
  }

  async getStreakInfo(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        streak: true,
        lastActiveDate: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let isActiveToday = false;
    if (user.lastActiveDate) {
      const lastActive = new Date(user.lastActiveDate);
      lastActive.setHours(0, 0, 0, 0);
      isActiveToday = lastActive.getTime() === today.getTime();
    }

    return {
      currentStreak: user.streak,
      isActiveToday,
      nextMilestone: this.getNextStreakMilestone(user.streak),
    };
  }

  private getNextStreakMilestone(currentStreak: number): number {
    const milestones = [3, 7, 14, 30, 60, 100, 365];
    return milestones.find(milestone => milestone > currentStreak) || currentStreak + 100;
  }

  async getDailyStats(userId: string, days: number = 7) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const progress = await this.prisma.progress.findMany({
      where: {
        userId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Group by day
    const dailyStats = progress.reduce((acc, record) => {
      const day = record.createdAt.toISOString().split('T')[0];
      if (!acc[day]) {
        acc[day] = {
          date: day,
          xpGained: 0,
          lessonsCompleted: 0,
          timeSpent: 0,
          averageAccuracy: 0,
          accuracyCount: 0,
        };
      }
      
      acc[day].xpGained += record.xpGained;
      if (record.lessonId) acc[day].lessonsCompleted += 1;
      if (record.timeSpent) acc[day].timeSpent += record.timeSpent;
      if (record.accuracy) {
        acc[day].averageAccuracy = 
          (acc[day].averageAccuracy * acc[day].accuracyCount + record.accuracy) / 
          (acc[day].accuracyCount + 1);
        acc[day].accuracyCount += 1;
      }
      
      return acc;
    }, {} as Record<string, any>);

    return Object.values(dailyStats);
  }
}
