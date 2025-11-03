import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ 
    description: '使用者 Email',
    example: 'user@example.com'
  })
  @IsEmail({}, { message: 'Email 格式不正確' })
  email!: string;

  @ApiProperty({ 
    description: '密碼',
    example: 'Password123',
    minLength: 8,
    maxLength: 50
  })
  @IsString()
  @MinLength(8, { message: '密碼至少需要 8 個字元' })
  @MaxLength(50)
  password!: string;
}
