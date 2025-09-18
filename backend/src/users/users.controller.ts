import {
  Controller,
  Get,
  UseGuards,
  Request,
  Param,
  Query,
  Patch,
  Body,
  UploadedFile,
  BadRequestException,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import type { File as MulterFile } from 'multer';

import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';

const AVATAR_UPLOAD_DIR = join(process.cwd(), 'uploads', 'avatars');

const avatarStorage = diskStorage({
  destination: (req, file, cb) => {
    if (!existsSync(AVATAR_UPLOAD_DIR)) {
      mkdirSync(AVATAR_UPLOAD_DIR, { recursive: true });
    }
    cb(null, AVATAR_UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
  },
});

const avatarFileFilter = (req: any, file: MulterFile, cb: (error: Error | null, acceptFile: boolean) => void) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new BadRequestException('Only image files are allowed'), false);
  }
  cb(null, true);
};

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Get current user profile with detailed info' })
  @ApiResponse({ status: 200, description: 'User profile retrieved' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Request() req) {
    const user = await this.usersService.findById(req.user.id);
    if (!user) {
      throw new Error('User not found');
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  @ApiOperation({ summary: 'Get leaderboard' })
  @ApiResponse({ status: 200, description: 'Leaderboard retrieved' })
  @Get('leaderboard')
  async getLeaderboard(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.usersService.getLeaderboard(limitNum);
  }

  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
    const user = await this.usersService.updateProfile(req.user.id, updateProfileDto);
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  @ApiOperation({ summary: 'Upload new avatar for current user' })
  @ApiResponse({ status: 200, description: 'Avatar updated' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('me/avatar')
  @UseInterceptors(FileInterceptor('avatar', {
    storage: avatarStorage,
    fileFilter: avatarFileFilter,
    limits: { fileSize: 4 * 1024 * 1024 },
  }))
  async uploadAvatar(@Request() req, @UploadedFile() file: MulterFile) {
    if (!file) {
      throw new BadRequestException('Avatar file is required');
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const avatarUrl = `${baseUrl}/uploads/avatars/${file.filename}`;

    const user = await this.usersService.updateProfile(req.user.id, { avatar: avatarUrl });
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    const { password, email, ...publicUser } = user;
    return publicUser;
  }
}
