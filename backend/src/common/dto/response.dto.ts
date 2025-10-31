import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationMetaDto } from './pagination.dto';

export class ResponseDto<T> {
  @ApiProperty({ description: '是否成功' })
  success: boolean;

  @ApiProperty({ description: '訊息' })
  message: string;

  @ApiPropertyOptional({ description: '回應資料' })
  data?: T;

  @ApiPropertyOptional({ description: '分頁資訊' })
  meta?: PaginationMetaDto;

  @ApiPropertyOptional({ description: '時間戳記' })
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
