import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ExamType, ExamVersion } from '@/common/constants';

export class StartExamDto {
  @ApiProperty({ 
    description: '測驗類型', 
    enum: ExamType,
    example: ExamType.PERIPHERAL_BLOOD
  })
  @IsEnum(ExamType)
  examType!: ExamType;

  @ApiProperty({ 
    description: '測驗版本', 
    enum: ExamVersion,
    default: ExamVersion.FREE,
    example: ExamVersion.FREE
  })
  @IsEnum(ExamVersion)
  version!: ExamVersion;

  @ApiPropertyOptional({ description: 'Session ID (免費版使用)' })
  @IsString()
  @IsOptional()
  sessionId?: string;

  @ApiPropertyOptional({ description: '使用者 ID (付費版使用)' })
  @IsString()
  @IsOptional()
  userId?: string;
}
