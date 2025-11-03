import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ExamType, ExamStatus, ExamVersion } from '@/common/constants';

export class ExamQuestionDto {
  @ApiProperty({ 
    description: '題目 ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  id!: string;

  @ApiProperty({ 
    description: '題目順序 (1-based)',
    example: 1
  })
  order!: number;

  @ApiProperty({ 
    description: '細胞圖片 URL',
    example: 'https://storage.example.com/images/cell_001.jpg'
  })
  imageUrl!: string;

  @ApiProperty({ 
    description: '縮圖 URL',
    example: 'https://storage.example.com/thumbnails/cell_001_thumb.jpg'
  })
  thumbnailUrl?: string;

  @ApiProperty({ 
    description: '題目描述',
    example: '請辨識此細胞類型'
  })
  description?: string;
}

export class ExamResponseDto {
  @ApiProperty({ 
    description: '測驗 ID',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  id!: string;

  @ApiPropertyOptional({ 
    description: '使用者 ID',
    example: 'user_abc123'
  })
  userId?: string;

  @ApiPropertyOptional({ 
    description: 'Session ID',
    example: 'session_xyz789'
  })
  sessionId?: string;

  @ApiProperty({ 
    description: '測驗類型', 
    enum: ExamType,
    example: 'peripheral_blood'
  })
  examType!: ExamType;

  @ApiProperty({ 
    description: '測驗版本', 
    enum: ExamVersion,
    example: 'free'
  })
  version!: ExamVersion;

  @ApiProperty({ 
    description: '測驗狀態', 
    enum: ExamStatus,
    example: 'in_progress'
  })
  status!: ExamStatus;

  @ApiProperty({ 
    description: '總題數',
    example: 30
  })
  totalQuestions!: number;

  @ApiProperty({ 
    description: '當前題號 (0-based)',
    example: 5
  })
  currentQuestion!: number;

  @ApiPropertyOptional({ 
    description: '開始時間',
    example: '2024-01-15T10:00:00Z'
  })
  startedAt?: Date;

  @ApiPropertyOptional({ 
    description: '完成時間',
    example: '2024-01-15T10:45:00Z'
  })
  completedAt?: Date;

  @ApiPropertyOptional({ 
    description: '到期時間',
    example: '2024-01-15T12:00:00Z'
  })
  expiresAt?: Date;

  @ApiPropertyOptional({ 
    description: '已花費時間 (秒)',
    example: 1800
  })
  timeSpentSeconds?: number;

  @ApiProperty({ 
    description: '建立時間',
    example: '2024-01-15T10:00:00Z'
  })
  createdAt!: Date;

  @ApiProperty({ 
    description: '更新時間',
    example: '2024-01-15T10:30:00Z'
  })
  updatedAt!: Date;

  constructor(partial: Partial<ExamResponseDto>) {
    Object.assign(this, partial);
  }
}

export class CurrentQuestionResponseDto extends ExamResponseDto {
  @ApiPropertyOptional({ 
    description: '當前題目資訊',
    type: () => ExamQuestionDto
  })
  currentQuestionData?: ExamQuestionDto;
}
