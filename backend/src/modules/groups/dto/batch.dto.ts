import { IsString, IsInt, Min, Max, IsOptional, IsEmail, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for creating a group exam batch
 */
export class CreateBatchDto {
  @ApiProperty({ 
    description: '批次名稱',
    example: '2024 春季測驗'
  })
  @IsString()
  batchName!: string;

  @ApiPropertyOptional({ 
    description: '批次描述',
    example: '春季新人培訓測驗'
  })
  @IsOptional()
  @IsString()
  batchDescription?: string;

  @ApiProperty({ 
    description: '測驗類型',
    example: 'peripheral_blood'
  })
  @IsString()
  examType!: string;

  @ApiProperty({ 
    description: '受測者人數',
    example: 20,
    minimum: 5,
    maximum: 100
  })
  @IsInt()
  @Min(5)
  @Max(100)
  takerCount!: number;

  @ApiProperty({ 
    description: '題目數量',
    example: 30,
    minimum: 10,
    maximum: 50
  })
  @IsInt()
  @Min(10)
  @Max(50)
  questionCount!: number;
}

/**
 * DTO for configuring batch takers
 */
export class ConfigureTakersDto {
  @ApiProperty({ 
    description: '受測者 Email 列表',
    example: ['taker1@example.com', 'taker2@example.com'],
    type: [String]
  })
  @IsArray()
  @IsString({ each: true })
  takerEmails!: string[];

  @ApiPropertyOptional({ 
    description: '邀請訊息',
    example: '歡迎參加本次測驗，請於期限內完成測驗。'
  })
  @IsOptional()
  @IsString()
  invitationMessage?: string;
}

/**
 * DTO for taker invitation
 */
export class TakerInvitationDto {
  @ApiProperty({ 
    description: '受測者姓名',
    example: '張三'
  })
  @IsString()
  takerName!: string;

  @ApiProperty({ 
    description: '受測者 Email',
    example: 'taker@example.com'
  })
  @IsEmail()
  takerEmail!: string;
}

/**
 * Response DTO for batch info
 */
export class BatchResponseDto {
  @ApiProperty({ description: '批次 ID', example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({ description: '批次名稱', example: '2024 春季測驗' })
  batchName!: string;

  @ApiPropertyOptional({ description: '批次描述', example: '春季新人培訓測驗' })
  batchDescription?: string;

  @ApiProperty({ description: '批次狀態', example: 'active' })
  status!: string;

  @ApiProperty({ description: '測驗類型', example: 'peripheral_blood' })
  examType!: string;

  @ApiProperty({ description: '題目數量', example: 30 })
  questionCount!: number;

  @ApiProperty({ description: '受測者人數', example: 20 })
  takerCount!: number;

  @ApiProperty({ description: '已完成人數', example: 5 })
  completedCount!: number;

  @ApiProperty({ description: '群組正確率', example: 85.5 })
  groupAccuracyRate!: number;

  @ApiPropertyOptional({ description: '開始時間', example: '2024-01-15T09:00:00Z' })
  startedAt?: Date;

  @ApiPropertyOptional({ description: '完成時間', example: '2024-01-20T18:00:00Z' })
  completedAt?: Date;

  @ApiPropertyOptional({ description: '檢視過期時間', example: '2024-02-15T23:59:59Z' })
  viewExpiresAt?: Date;

  @ApiPropertyOptional({ description: '管理者 Token', example: 'admin_token_abc123' })
  adminToken?: string;

  @ApiPropertyOptional({ description: '批次 Token', example: 'batch_token_xyz789' })
  batchToken?: string;

  @ApiPropertyOptional({ description: '受測者列表', type: () => [TakerDetailDto] })
  takers?: TakerDetailDto[];

  @ApiProperty({ description: '建立時間', example: '2024-01-10T10:00:00Z' })
  createdAt!: Date;

  @ApiProperty({ description: '更新時間', example: '2024-01-15T12:30:00Z' })
  updatedAt!: Date;
}

/**
 * Response DTO for taker details
 */
export class TakerDetailDto {
  @ApiProperty({ description: '受測者 ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  id!: string;

  @ApiProperty({ description: '受測者姓名', example: '張三' })
  takerName!: string;

  @ApiProperty({ description: '受測者 Email', example: 'taker@example.com' })
  takerEmail!: string;

  @ApiProperty({ description: '測驗狀態', example: 'completed' })
  status!: string;

  @ApiPropertyOptional({ description: '正確答案數', example: 25 })
  correctAnswers?: number;

  @ApiPropertyOptional({ description: '總題數', example: 30 })
  totalQuestions?: number;

  @ApiPropertyOptional({ description: '正確率', example: 83.33 })
  accuracyRate?: number;

  @ApiPropertyOptional({ description: '作答時間(秒)', example: 1800 })
  timeSpentSeconds?: number;

  @ApiPropertyOptional({ description: '開始時間', example: '2024-01-15T10:00:00Z' })
  startedAt?: Date;

  @ApiPropertyOptional({ description: '完成時間', example: '2024-01-15T10:30:00Z' })
  completedAt?: Date;
}

/**
 * Response DTO for batch status
 */
export class BatchStatusDto {
  @ApiProperty({ description: '批次 ID', example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({ description: '批次名稱', example: '2024 春季測驗' })
  batchName!: string;

  @ApiProperty({ description: '批次狀態', example: 'active' })
  status!: string;

  @ApiProperty({ description: '受測者人數', example: 20 })
  takerCount!: number;

  @ApiProperty({ description: '已完成人數', example: 5 })
  completedCount!: number;

  @ApiProperty({ description: '群組正確率', example: 85.5 })
  groupAccuracyRate!: number;

  @ApiProperty({ description: '受測者列表', type: () => [TakerDetailDto] })
  takers!: TakerDetailDto[];
}
