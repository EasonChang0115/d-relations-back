import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ description: 'HTTP 狀態碼' })
  statusCode: number;

  @ApiProperty({ description: '錯誤訊息' })
  message: string;

  @ApiPropertyOptional({ description: '錯誤代碼' })
  error?: string;

  @ApiPropertyOptional({ description: '詳細錯誤資訊' })
  details?: any;

  @ApiProperty({ description: '時間戳記' })
  timestamp: string;

  @ApiProperty({ description: '請求路徑' })
  path: string;

  constructor(statusCode: number, message: string, path: string, error?: string, details?: any) {
    this.statusCode = statusCode;
    this.message = message;
    this.error = error;
    this.details = details;
    this.timestamp = new Date().toISOString();
    this.path = path;
  }
}
