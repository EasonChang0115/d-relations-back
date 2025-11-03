import { IsString, IsInt, Min, Max, IsOptional, IsEmail, IsArray } from 'class-validator';

/**
 * DTO for creating a group exam batch
 */
export class CreateBatchDto {
  @IsString()
  batchName!: string;

  @IsOptional()
  @IsString()
  batchDescription?: string;

  @IsString()
  examType!: string;

  @IsInt()
  @Min(5)
  @Max(100)
  takerCount!: number;

  @IsInt()
  @Min(10)
  @Max(50)
  questionCount!: number;
}

/**
 * DTO for configuring batch takers
 */
export class ConfigureTakersDto {
  @IsArray()
  @IsString({ each: true })
  takerEmails!: string[];

  @IsOptional()
  @IsString()
  invitationMessage?: string;
}

/**
 * DTO for taker invitation
 */
export class TakerInvitationDto {
  @IsString()
  takerName!: string;

  @IsEmail()
  takerEmail!: string;
}

/**
 * Response DTO for batch info
 */
export class BatchResponseDto {
  id!: string;
  batchName!: string;
  batchDescription?: string;
  status!: string;
  examType!: string;
  questionCount!: number;
  takerCount!: number;
  completedCount!: number;
  groupAccuracyRate!: number;
  startedAt?: Date;
  completedAt?: Date;
  viewExpiresAt?: Date;
  adminToken?: string;
  batchToken?: string;
  takers?: TakerDetailDto[];
  createdAt!: Date;
  updatedAt!: Date;
}

/**
 * Response DTO for taker details
 */
export class TakerDetailDto {
  id!: string;
  takerName!: string;
  takerEmail!: string;
  status!: string;
  correctAnswers?: number;
  totalQuestions?: number;
  accuracyRate?: number;
  timeSpentSeconds?: number;
  startedAt?: Date;
  completedAt?: Date;
}

/**
 * Response DTO for batch status
 */
export class BatchStatusDto {
  id!: string;
  batchName!: string;
  status!: string;
  takerCount!: number;
  completedCount!: number;
  groupAccuracyRate!: number;
  takers!: TakerDetailDto[];
}
