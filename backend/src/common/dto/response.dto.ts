import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationMetaDto } from './pagination.dto';

export class ResponseDto<T> {
  @ApiProperty({ 
    description: '是否成功',
    example: true
  })
  success: boolean;

  @ApiProperty({ 
    description: '訊息',
    example: '操作成功'
  })
  message: string;

  @ApiPropertyOptional({ 
    description: '回應資料',
    example: {}
  })
  data?: T;

  @ApiPropertyOptional({ 
    description: '分頁資訊',
    type: () => PaginationMetaDto
  })
  meta?: PaginationMetaDto;

  @ApiPropertyOptional({ 
    description: '時間戳記',
    example: '2024-01-15T10:00:00.000Z'
  })
  timestamp?: string;

  constructor(success: boolean, message: string, data?: T, meta?: PaginationMetaDto) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.meta = meta;
    this.timestamp = new Date().toISOString();
  }

  static success<T>(data?: T, message = 'Success'): ResponseDto<T> {
    return new ResponseDto(true, message, data);
  }

  static successWithMeta<T>(
    data: T,
    meta: PaginationMetaDto,
    message = 'Success',
  ): ResponseDto<T> {
    return new ResponseDto(true, message, data, meta);
  }

  static error(message: string): ResponseDto<null> {
    return new ResponseDto(false, message);
  }
}
