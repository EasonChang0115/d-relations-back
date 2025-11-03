import { IsEmail, IsString, MinLength, MaxLength, Matches, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ 
    description: '使用者 Email',
    example: 'user@example.com'
  })
  @IsEmail({}, { message: 'Email 格式不正確' })
  email!: string;

  @ApiProperty({ 
    description: '密碼 (至少8個字元，需包含大小寫字母和數字)',
    example: 'Password123',
    minLength: 8,
    maxLength: 50
  })
  @IsString()
  @MinLength(8, { message: '密碼至少需要 8 個字元' })
  @MaxLength(50)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: '密碼必須包含大小寫字母和數字',
  })
  password!: string;

  @ApiProperty({ 
    description: '使用者姓名',
    example: '王小明',
    minLength: 1,
    maxLength: 100
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name!: string;

  @ApiPropertyOptional({ 
    description: '組織代碼',
    example: 'ORG-12345',
    maxLength: 100
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  organization_code?: string;

  @ApiPropertyOptional({ 
    description: '職稱',
    example: '醫檢師',
    maxLength: 50
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  job_title?: string;

  @ApiPropertyOptional({ 
    description: '認證狀態',
    example: 'certified',
    maxLength: 50
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  certification_status?: string;
}
