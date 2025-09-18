import { Injectable, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { User, Prisma, Level, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../database/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    if (adminEmail && typeof data.email === 'string' && data.email.toLowerCase() === adminEmail) {
      data.role = 'ADMIN';
    }

    return this.prisma.user.create({
      data,
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
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
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findMany(params: { skip?: number; take?: number; search?: string }) {
    const { skip = 0, take = 25, search } = params;

    return this.prisma.user.findMany({
      skip,
      take,
      where: search
        ? {
            OR: [
              { email: { contains: search, mode: 'insensitive' } },
              { name: { contains: search, mode: 'insensitive' } },
            ],
          }
        : undefined,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        level: true,
        xp: true,
        streak: true,
        emailVerified: true,
        lastActiveDate: true,
        createdAt: true,
        updatedAt: true,
      },
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

  async updateProfile(id: string, payload: UpdateProfileDto): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updateData: Prisma.UserUpdateInput = {};

    if (typeof payload.name === 'string') {
      const trimmedName = payload.name.trim();
      updateData.name = trimmedName.length ? trimmedName : null;
    }

    if (typeof payload.avatar === 'string') {
      updateData.avatar = payload.avatar;
    }

    const normalizedInputEmail = payload.email ? payload.email.trim().toLowerCase() : null;
    const emailChanged = normalizedInputEmail !== null && normalizedInputEmail !== user.email;

    const requiresPasswordCheck = Boolean(payload.newPassword) || emailChanged;

    if (requiresPasswordCheck) {
      if (!payload.currentPassword) {
        throw new BadRequestException('Current password is required');
      }

      const isPasswordValid = await bcrypt.compare(payload.currentPassword, user.password);
      if (!isPasswordValid) {
        throw new BadRequestException('Current password is incorrect');
      }
    }

    if (payload.email) {
      const normalizedEmail = normalizedInputEmail ?? payload.email.trim().toLowerCase();

      if (emailChanged) {
        const existing = await this.prisma.user.findUnique({ where: { email: normalizedEmail } });
        if (existing && existing.id !== user.id) {
          throw new ConflictException('Email is already in use');
        }

        updateData.email = normalizedEmail;

        if (typeof user.emailVerified !== 'undefined') {
          updateData.emailVerified = true;
        }

        await this.prisma.emailVerificationToken.deleteMany({ where: { userId: id } });
      }
    }

    if (payload.newPassword) {
      const hashedPassword = await bcrypt.hash(payload.newPassword, 12);
      updateData.password = hashedPassword;
    }

    if (Object.keys(updateData).length === 0) {
      const freshUser = await this.prisma.user.findUnique({
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

      if (!freshUser) {
        throw new NotFoundException('User not found');
      }

      return freshUser;
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
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

  async updateUserAdmin(
    id: string,
    payload: Partial<{
      name?: string | null;
      email?: string;
      level?: Level;
      xp?: number;
      streak?: number;
      role?: UserRole;
      emailVerified?: boolean;
      password?: string;
    }>,
  ) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updateData: Prisma.UserUpdateInput = {};
    let emailChanged = false;

    if (payload.name !== undefined) {
      const trimmed = payload.name?.trim() || null;
      updateData.name = trimmed;
    }

    if (payload.email !== undefined) {
      const normalizedEmail = payload.email.trim().toLowerCase();

      if (!normalizedEmail) {
        throw new BadRequestException('Email cannot be empty');
      }

      if (normalizedEmail !== user.email) {
        const existing = await this.prisma.user.findUnique({ where: { email: normalizedEmail } });
        if (existing && existing.id !== user.id) {
          throw new ConflictException('Email is already in use');
        }

        emailChanged = true;
        updateData.email = normalizedEmail;
        await this.prisma.emailVerificationToken.deleteMany({ where: { userId: id } });
      }
    }

    if (payload.level) {
      updateData.level = payload.level;
    }

    if (payload.xp !== undefined) {
      updateData.xp = payload.xp;
    }

    if (payload.streak !== undefined) {
      updateData.streak = payload.streak;
    }

    if (payload.role) {
      updateData.role = payload.role;
    }

    if (payload.emailVerified !== undefined) {
      updateData.emailVerified = payload.emailVerified;
    } else if (emailChanged) {
      updateData.emailVerified = false;
    }

    if (payload.password) {
      const hashedPassword = await bcrypt.hash(payload.password, 12);
      updateData.password = hashedPassword;
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        level: true,
        xp: true,
        streak: true,
        emailVerified: true,
        lastActiveDate: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updated;
  }
}
