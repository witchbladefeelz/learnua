import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { EmailService } from '../email/email.service';
import { PrismaService } from '../database/prisma.service';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly prisma: PrismaService,
  ) {}

  private isVerificationEnabled() {
    return false;
  }

  async register(registerDto: RegisterDto) {
    const { email, password, name } = registerDto;

    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await this.usersService.create({
      email,
      password: hashedPassword,
      name,
      emailVerified: true,
    });

    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);
    return {
      access_token: token,
      user: this.sanitizeUser(user),
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.usersService.updateLastActive(user.id);

    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: this.sanitizeUser(user),
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && user.emailVerified && (await bcrypt.compare(password, user.password))) {
      const { password: _password, ...result } = user;
      return result;
    }
    return null;
  }

  async verifyEmail(token: string) {
    if (!token) {
      throw new BadRequestException('Verification token is required');
    }

    if (!this.isVerificationEnabled()) {
      return { message: 'Email verification is disabled.' };
    }

    const verification = await this.prisma.emailVerificationToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!verification) {
      throw new NotFoundException('Verification token is invalid or has already been used');
    }

    if (verification.expiresAt < new Date()) {
      await this.prisma.emailVerificationToken.delete({ where: { token } });
      throw new BadRequestException('Verification token has expired');
    }

    await this.prisma.user.update({
      where: { id: verification.userId },
      data: { emailVerified: true },
    });

    await this.prisma.emailVerificationToken.deleteMany({ where: { userId: verification.userId } });

    return { message: 'Email verified successfully. You can now sign in.' };
  }

  async resendVerification({ email }: ResendVerificationDto) {
    if (!this.isVerificationEnabled()) {
      return { message: 'Email verification is disabled.' };
    }

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User with this email does not exist');
    }

    if (user.emailVerified) {
      throw new BadRequestException('Email is already verified');
    }

    await this.createAndSendVerificationToken(user);

    return { message: 'Verification email has been sent again.' };
  }

  private async createAndSendVerificationToken(user: User) {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresInHours = parseInt(process.env.EMAIL_VERIFICATION_EXPIRATION_HOURS ?? '24', 10);
    const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);

    await this.prisma.emailVerificationToken.deleteMany({ where: { userId: user.id } });

    await this.prisma.emailVerificationToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    });

    await this.emailService.sendVerificationEmail(user.email, token, user.name ?? undefined);
  }

  private sanitizeUser(user: User) {
    const { password, ...rest } = user;
    return rest;
  }
}
