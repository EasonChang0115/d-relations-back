import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, Min } from 'class-validator';

export class SubmitAnswerDto {
  @ApiProperty({ description: '測驗 ID' })
  @IsString()
  examId: string;

  @ApiProperty({ description: '題目 ID' })
  @IsString()
  questionId: string;

  @ApiProperty({ description: '使用者答案' })
  @IsString()
  userAnswer: string;

  @ApiPropertyOptional({ description: '答題時間 (秒)', minimum: 0 })
  @IsInt()
  @IsOptional()
  @Min(0)
  timeSpentSeconds?: number;
}
