import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CellTypeStatDto {
  @ApiProperty({ 
    description: '細胞類型',
    example: 'neutrophil'
  })
  cellType!: string;

  @ApiProperty({ 
    description: '細胞類型名稱',
    example: '嗜中性球'
  })
  cellTypeName!: string;

  @ApiProperty({ 
    description: '總題數',
    example: 10
  })
  total!: number;

  @ApiProperty({ 
    description: '答對數',
    example: 8
  })
  correct!: number;

  @ApiProperty({ 
    description: '答錯數',
    example: 2
  })
  wrong!: number;

  @ApiProperty({ 
    description: '正答率 (%)',
    example: 80.0
  })
  accuracyRate!: number;
}

export class ReportResponseDto {
  @ApiProperty({ 
    description: '報表 ID',
    example: 'report_abc123xyz'
  })
  id!: string;

  @ApiProperty({ 
    description: '測驗 ID',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  examId!: string;

  @ApiProperty({ 
    description: '總題數',
    example: 30
  })
  totalQuestions!: number;

  @ApiProperty({ 
    description: '答對數',
    example: 25
  })
  correctAnswers!: number;

  @ApiProperty({ 
    description: '答錯數',
    example: 5
  })
  wrongAnswers!: number;

  @ApiProperty({ 
    description: '正答率 (%)',
    example: 83.33
  })
  accuracyRate!: number;

  @ApiPropertyOptional({ 
    description: '總作答時間 (秒)',
    example: 1800
  })
  totalTimeSeconds?: number;

  @ApiPropertyOptional({ 
    description: '平均每題時間 (秒)',
    example: 60
  })
  avgTimePerQuestion?: number;

  @ApiPropertyOptional({ 
    description: '各細胞類型統計', 
    type: [CellTypeStatDto]
  })
  cellTypeStats?: CellTypeStatDto[];

  @ApiProperty({ 
    description: '報表生成時間',
    example: '2024-01-15T10:45:00Z'
  })
  generatedAt!: Date;

  @ApiProperty({ 
    description: '報表到期時間',
    example: '2024-02-15T10:45:00Z'
  })
  expiresAt!: Date;

  @ApiProperty({ 
    description: '是否已過期',
    example: false
  })
  isExpired!: boolean;

  @ApiProperty({ 
    description: '建立時間',
    example: '2024-01-15T10:45:00Z'
  })
  createdAt!: Date;

  constructor(partial: Partial<ReportResponseDto> | any) {
    Object.assign(this, partial);

    // Convert cellTypeStats if it's a Record to array
    if (partial.cellTypeStats && !Array.isArray(partial.cellTypeStats)) {
      this.cellTypeStats = partial.cellTypeStats as CellTypeStatDto[];
    }
  }
}
