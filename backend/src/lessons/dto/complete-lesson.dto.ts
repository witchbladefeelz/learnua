import { IsNumber, IsArray, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CompleteLessonDto {
  @ApiProperty({ 
    description: 'Score percentage (0-100)',
    example: 85,
    minimum: 0,
    maximum: 100
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  score: number;

  @ApiProperty({ 
    description: 'Time spent on lesson in seconds',
    example: 120
  })
  @IsNumber()
  @Min(1)
  timeSpent: number;

  @ApiProperty({ 
    description: 'Array of user answers',
    example: ['option1', 'option2', 'user input'],
    required: false
  })
  @IsOptional()
  @IsArray()
  answers?: string[];
}
