import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ExamType, ExamStatus, ExamVersion } from '@/common/constants';

export class ExamQuestionDto {
  @ApiProperty({ description: '題目 ID' })
  id!: string;

  @ApiProperty({ description: '題目順序 (1-based)' })
  order!: number;

  @ApiProperty({ description: '細胞圖片 URL' })
  imageUrl!: string;

  @ApiProperty({ description: '縮圖 URL' })
  thumbnailUrl?: string;

  @ApiProperty({ description: '題目描述' })
  description?: string;
}

export class ExamResponseDto {
  @ApiProperty({ description: '測驗 ID' })
  id!: string;

  @ApiPropertyOptional({ description: '使用者 ID' })
  userId?: string;

  @ApiPropertyOptional({ description: 'Session ID' })
  sessionId?: string;

  @ApiProperty({ description: '測驗類型', enum: ExamType })
  examType!: ExamType;

  @ApiProperty({ description: '測驗版本', enum: ExamVersion })
  version!: ExamVersion;

  @ApiProperty({ description: '測驗狀態', enum: ExamStatus })
  status!: ExamStatus;

  @ApiProperty({ description: '總題數' })
  totalQuestions!: number;

  @ApiProperty({ description: '當前題號 (0-based)' })
  currentQuestion!: number;

  @ApiPropertyOptional({ description: '開始時間' })
  startedAt?: Date;

  @ApiPropertyOptional({ description: '完成時間' })
  completedAt?: Date;

  @ApiPropertyOptional({ description: '到期時間' })
  expiresAt?: Date;

  @ApiPropertyOptional({ description: '已花費時間 (秒)' })
  timeSpentSeconds?: number;

  @ApiProperty({ description: '建立時間' })
  createdAt!: Date;

  @ApiProperty({ description: '更新時間' })
  updatedAt!: Date;

  constructor(partial: Partial<ExamResponseDto>) {
    Object.assign(this, partial);
  }
}

export class CurrentQuestionResponseDto extends ExamResponseDto {
  @ApiPropertyOptional({ description: '當前題目資訊' })
  currentQuestionData?: ExamQuestionDto;
}
