import { IsEmail, IsString, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SendOtpDto {
  @ApiProperty({ 
    description: '接收 OTP 的 Email',
    example: 'user@example.com'
  })
  @IsEmail()
  email!: string;

  @ApiPropertyOptional({ 
    description: '驗證類型',
    example: 'registration'
  })
  @IsString()
  verificationType?: string;
}

export class VerifyOtpDto {
  @ApiProperty({ 
    description: '使用者 Email',
    example: 'user@example.com'
  })
  @IsEmail()
  email!: string;

  @ApiProperty({ 
    description: 'OTP 驗證碼 (6位數字)',
    example: '123456',
    minLength: 6,
    maxLength: 6
  })
  @IsString()
  @Length(6, 6)
  otpCode!: string;
}

export class OtpResponseDto {
  @ApiProperty({ 
    description: '回應訊息',
    example: 'OTP 已發送到您的信箱'
  })
  @IsString()
  message!: string;

  @ApiProperty({ 
    description: 'OTP 有效時間',
    example: '5 分鐘'
  })
  @IsString()
  expiresIn!: string;
}

export class OtpVerifyResponseDto {
  @ApiProperty({ 
    description: '回應訊息',
    example: 'OTP 驗證成功'
  })
  @IsString()
  message!: string;

  @ApiPropertyOptional({ 
    description: 'Session Token',
    example: 'session_abc123xyz'
  })
  @IsString()
  sessionToken?: string;
}
