import { IsEmail, IsString } from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({ 
    description: 'JWT 存取令牌',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  @IsString()
  access_token!: string;

  @ApiProperty({ 
    description: 'JWT 刷新令牌',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  @IsString()
  refresh_token!: string;

  @ApiProperty({ 
    description: '使用者 Email',
    example: 'user@example.com'
  })
  @IsEmail()
  email!: string;

  @ApiProperty({ 
    description: '使用者姓名',
    example: '王小明'
  })
  @IsString()
  name!: string;
}
