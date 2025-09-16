import { Injectable } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        completedLessons: true,
        achievements: {
          include: {
            achievement: true,
          },
        },
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async updateLastActive(id: string): Promise<User> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Calculate streak
    let newStreak = user.streak;
    if (user.lastActiveDate) {
      const lastActive = new Date(user.lastActiveDate);
      lastActive.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        // Consecutive day
        newStreak += 1;
      } else if (diffDays > 1) {
        // Streak broken
        newStreak = 1;
      }
      // Same day, no change to streak
    } else {
      // First time
      newStreak = 1;
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        lastActiveDate: new Date(),
        streak: newStreak,
      },
    });
  }

  async updateXP(id: string, xpToAdd: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const newXP = user.xp + xpToAdd;
    let newLevel = user.level;

    // Level progression logic
    if (newXP >= 601 && user.level === 'B1') newLevel = 'B2';
    else if (newXP >= 301 && user.level === 'A2') newLevel = 'B1';
    else if (newXP >= 101 && user.level === 'A1') newLevel = 'A2';

    return this.prisma.user.update({
      where: { id },
      data: {
        xp: newXP,
        level: newLevel,
      },
    });
  }

  async getLeaderboard(limit: number = 10) {
    return this.prisma.user.findMany({
      take: limit,
      orderBy: {
        xp: 'desc',
      },
      select: {
        id: true,
        name: true,
        level: true,
        xp: true,
        streak: true,
        avatar: true,
      },
    });
  }
}
