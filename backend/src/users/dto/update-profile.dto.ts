import {
  IsOptional,
  IsUrl,
  IsString,
  MaxLength,
  IsEmail,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({ description: 'Display name' })
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'Name must not exceed 50 characters' })
  name?: string;

  @ApiPropertyOptional({ description: 'Avatar image URL' })
  @IsOptional()
  @IsString()
  @IsUrl({ require_protocol: true }, { message: 'Avatar must be a valid URL' })
  avatar?: string;

  @ApiPropertyOptional({ description: 'New email address' })
  @IsOptional()
  @IsEmail({}, { message: 'Email must be valid' })
  email?: string;

  @ApiPropertyOptional({ description: 'Current password (required for email or password changes)' })
  @ValidateIf((dto: UpdateProfileDto) => Boolean(dto.newPassword) || Boolean(dto.email))
  @IsString()
  @MinLength(6, { message: 'Current password must be at least 6 characters long' })
  currentPassword?: string;

  @ApiPropertyOptional({ description: 'New password' })
  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'New password must be at least 6 characters long' })
  newPassword?: string;
}
