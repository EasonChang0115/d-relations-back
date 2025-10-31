import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CellTypeStatDto {
  @ApiProperty({ description: '細胞類型' })
  cellType!: string;

  @ApiProperty({ description: '細胞類型名稱' })
  cellTypeName!: string;

  @ApiProperty({ description: '總題數' })
  total!: number;

  @ApiProperty({ description: '答對數' })
  correct!: number;

  @ApiProperty({ description: '答錯數' })
  wrong!: number;

  @ApiProperty({ description: '正答率 (%)' })
  accuracyRate!: number;
}

export class ReportResponseDto {
  @ApiProperty({ description: '報表 ID' })
  id!: string;

  @ApiProperty({ description: '測驗 ID' })
  examId!: string;

  @ApiProperty({ description: '總題數' })
  totalQuestions!: number;

  @ApiProperty({ description: '答對數' })
  correctAnswers!: number;

  @ApiProperty({ description: '答錯數' })
  wrongAnswers!: number;

  @ApiProperty({ description: '正答率 (%)' })
  accuracyRate!: number;

  @ApiPropertyOptional({ description: '總作答時間 (秒)' })
  totalTimeSeconds?: number;

  @ApiPropertyOptional({ description: '平均每題時間 (秒)' })
  avgTimePerQuestion?: number;

  @ApiPropertyOptional({ description: '各細胞類型統計', type: [CellTypeStatDto] })
  cellTypeStats?: CellTypeStatDto[];

  @ApiProperty({ description: '報表生成時間' })
  generatedAt!: Date;

  @ApiProperty({ description: '報表到期時間' })
  expiresAt!: Date;

  @ApiProperty({ description: '是否已過期' })
  isExpired!: boolean;

  @ApiProperty({ description: '建立時間' })
  createdAt!: Date;

  constructor(partial: Partial<ReportResponseDto> | any) {
    Object.assign(this, partial);

    // Convert cellTypeStats if it's a Record to array
    if (partial.cellTypeStats && !Array.isArray(partial.cellTypeStats)) {
      this.cellTypeStats = partial.cellTypeStats as CellTypeStatDto[];
    }
  }
}
