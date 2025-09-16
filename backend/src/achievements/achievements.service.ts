import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AchievementsService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  async getAllAchievements() {
    return this.prisma.achievement.findMany({
      orderBy: {
        xpReward: 'asc',
      },
    });
  }

  async getUserAchievements(userId: string) {
    return this.prisma.userAchievement.findMany({
      where: { userId },
      include: {
        achievement: true,
      },
      orderBy: {
        unlockedAt: 'desc',
      },
    });
  }

  async checkAndUnlockAchievements(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        completedLessons: true,
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

    const unlockedAchievements = user.achievements.map(ua => ua.achievement.name);
    const newAchievements = [];

    // First Steps - complete first lesson
    if (user.completedLessons.length >= 1 && !unlockedAchievements.includes('First Steps')) {
      await this.unlockAchievement(userId, 'First Steps');
      newAchievements.push('First Steps');
    }

    // Bookworm - complete 10 lessons
    if (user.completedLessons.length >= 10 && !unlockedAchievements.includes('Bookworm')) {
      await this.unlockAchievement(userId, 'Bookworm');
      newAchievements.push('Bookworm');
    }

    // Scholar - complete 25 lessons
    if (user.completedLessons.length >= 25 && !unlockedAchievements.includes('Scholar')) {
      await this.unlockAchievement(userId, 'Scholar');
      newAchievements.push('Scholar');
    }

    // Lightning - 7 day streak
    if (user.streak >= 7 && !unlockedAchievements.includes('Lightning')) {
      await this.unlockAchievement(userId, 'Lightning');
      newAchievements.push('Lightning');
    }

    // Fire - 30 day streak
    if (user.streak >= 30 && !unlockedAchievements.includes('Fire')) {
      await this.unlockAchievement(userId, 'Fire');
      newAchievements.push('Fire');
    }

    // Star - reach B1 level
    if (user.level === 'B1' && !unlockedAchievements.includes('Star')) {
      await this.unlockAchievement(userId, 'Star');
      newAchievements.push('Star');
    }

    // Master - reach B2 level
    if (user.level === 'B2' && !unlockedAchievements.includes('Master')) {
      await this.unlockAchievement(userId, 'Master');
      newAchievements.push('Master');
    }

    return newAchievements;
  }

  private async unlockAchievement(userId: string, achievementName: string) {
    const achievement = await this.prisma.achievement.findUnique({
      where: { name: achievementName },
    });

    if (!achievement) {
      console.error(`Achievement ${achievementName} not found`);
      return;
    }

    // Check if already unlocked
    const existing = await this.prisma.userAchievement.findUnique({
      where: {
        userId_achievementId: {
          userId,
          achievementId: achievement.id,
        },
      },
    });

    if (existing) {
      return;
    }

    // Unlock achievement
    await this.prisma.userAchievement.create({
      data: {
        userId,
        achievementId: achievement.id,
      },
    });

    // Award XP if any
    if (achievement.xpReward > 0) {
      await this.usersService.updateXP(userId, achievement.xpReward);
    }
  }

  async getAchievementProgress(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        completedLessons: true,
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

    const progress = {
      'First Steps': {
        name: 'First Steps',
        description: 'Complete your first lesson',
        icon: '🔥',
        current: Math.min(user.completedLessons.length, 1),
        target: 1,
        completed: user.completedLessons.length >= 1,
      },
      'Bookworm': {
        name: 'Bookworm',
        description: 'Complete 10 lessons',
        icon: '📚',
        current: Math.min(user.completedLessons.length, 10),
        target: 10,
        completed: user.completedLessons.length >= 10,
      },
      'Scholar': {
        name: 'Scholar',
        description: 'Complete 25 lessons',
        icon: '🎓',
        current: Math.min(user.completedLessons.length, 25),
        target: 25,
        completed: user.completedLessons.length >= 25,
      },
      'Lightning': {
        name: 'Lightning',
        description: '7 day streak',
        icon: '⚡',
        current: Math.min(user.streak, 7),
        target: 7,
        completed: user.streak >= 7,
      },
      'Fire': {
        name: 'Fire',
        description: '30 day streak',
        icon: '🔥',
        current: Math.min(user.streak, 30),
        target: 30,
        completed: user.streak >= 30,
      },
      'Star': {
        name: 'Star',
        description: 'Reach B1 level',
        icon: '🌟',
        current: this.getLevelNumber(user.level),
        target: this.getLevelNumber('B1'),
        completed: ['B1', 'B2', 'C1', 'C2'].includes(user.level),
      },
      'Master': {
        name: 'Master',
        description: 'Reach B2 level',
        icon: '👑',
        current: this.getLevelNumber(user.level),
        target: this.getLevelNumber('B2'),
        completed: ['B2', 'C1', 'C2'].includes(user.level),
      },
    };

    return progress;
  }

  private getLevelNumber(level: string): number {
    const levels = { 'A1': 1, 'A2': 2, 'B1': 3, 'B2': 4, 'C1': 5, 'C2': 6 };
    return levels[level as keyof typeof levels] || 0;
  }
}
