import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AnswerResponseDto {
  @ApiProperty({ description: '答案記錄 ID' })
  id!: string;

  @ApiProperty({ description: '測驗 ID' })
  examId!: string;

  @ApiProperty({ description: '題目 ID' })
  questionId!: string;

  @ApiProperty({ description: '題目順序' })
  questionOrder!: number;

  @ApiProperty({ description: '使用者答案' })
  userAnswer!: string;

  @ApiProperty({ description: '正確答案' })
  correctAnswer!: string;

  @ApiProperty({ description: '是否正確' })
  isCorrect!: boolean;

  @ApiPropertyOptional({ description: '答題時間 (秒)' })
  timeSpentSeconds?: number;

  @ApiProperty({ description: '作答時間' })
  answeredAt!: Date;

  @ApiProperty({ description: '建立時間' })
  createdAt!: Date;

  constructor(partial: Partial<AnswerResponseDto>) {
    Object.assign(this, partial);
  }
}
