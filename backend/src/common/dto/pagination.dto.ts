import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginationDto {
  @ApiPropertyOptional({ 
    minimum: 1, 
    default: 1, 
    description: '頁碼',
    example: 1
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ 
    minimum: 1, 
    maximum: 100, 
    default: 10, 
    description: '每頁筆數',
    example: 10
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 10;
}

export class PaginationMetaDto {
  @ApiPropertyOptional({ 
    description: '當前頁碼',
    example: 1
  })
  page!: number;

  @ApiPropertyOptional({ 
    description: '每頁筆數',
    example: 10
  })
  limit!: number;

  @ApiPropertyOptional({ 
    description: '總筆數',
    example: 50
  })
  totalItems!: number;

  @ApiPropertyOptional({ 
    description: '總頁數',
    example: 5
  })
  totalPages!: number;

  @ApiPropertyOptional({ 
    description: '是否有下一頁',
    example: true
  })
  hasNextPage!: boolean;

  @ApiPropertyOptional({ 
    description: '是否有上一頁',
    example: false
  })
  hasPreviousPage!: boolean;
}
