import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ 
    description: 'HTTP 狀態碼',
    example: 400
  })
  statusCode: number;

  @ApiProperty({ 
    description: '錯誤訊息',
    example: '請求參數錯誤'
  })
  message: string;

  @ApiPropertyOptional({ 
    description: '錯誤代碼',
    example: 'BAD_REQUEST'
  })
  error?: string;

  @ApiPropertyOptional({ 
    description: '詳細錯誤資訊',
    example: { field: 'email', message: 'Email 格式不正確' }
  })
  details?: any;

  @ApiProperty({ 
    description: '時間戳記',
    example: '2024-01-15T10:00:00.000Z'
  })
  timestamp: string;

  @ApiProperty({ 
    description: '請求路徑',
    example: '/api/auth/login'
  })
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
