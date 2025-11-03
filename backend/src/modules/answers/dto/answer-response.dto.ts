import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AnswerResponseDto {
  @ApiProperty({ 
    description: '答案記錄 ID',
    example: '789e4567-e89b-12d3-a456-426614174000'
  })
  id!: string;

  @ApiProperty({ 
    description: '測驗 ID',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  examId!: string;

  @ApiProperty({ 
    description: '題目 ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  questionId!: string;

  @ApiProperty({ 
    description: '題目順序',
    example: 1
  })
  questionOrder!: number;

  @ApiProperty({ 
    description: '使用者答案',
    example: 'A'
  })
  userAnswer!: string;

  @ApiProperty({ 
    description: '正確答案',
    example: 'B'
  })
  correctAnswer!: string;

  @ApiProperty({ 
    description: '是否正確',
    example: false
  })
  isCorrect!: boolean;

  @ApiPropertyOptional({ 
    description: '答題時間 (秒)',
    example: 45
  })
  timeSpentSeconds?: number;

  @ApiProperty({ 
    description: '作答時間',
    example: '2024-01-15T10:15:00Z'
  })
  answeredAt!: Date;

  @ApiProperty({ 
    description: '建立時間',
    example: '2024-01-15T10:15:00Z'
  })
  createdAt!: Date;

  constructor(partial: Partial<AnswerResponseDto>) {
    Object.assign(this, partial);
  }
}
