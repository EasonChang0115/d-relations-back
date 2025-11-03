import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, Min } from 'class-validator';

export class SubmitAnswerDto {
  @ApiProperty({ 
    description: '測驗 ID',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsString()
  examId!: string;

  @ApiProperty({ 
    description: '題目 ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsString()
  questionId!: string;

  @ApiProperty({ 
    description: '使用者答案',
    example: 'A'
  })
  @IsString()
  userAnswer!: string;

  @ApiPropertyOptional({ 
    description: '答題時間 (秒)', 
    minimum: 0,
    example: 45
  })
  @IsInt()
  @IsOptional()
  @Min(0)
  timeSpentSeconds?: number;
}
