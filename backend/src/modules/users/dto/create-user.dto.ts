import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsEnum, MinLength, MaxLength } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @ApiPropertyOptional({ description: '使用者姓名', example: '王小明' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({ description: '電子郵件', example: 'user@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: '密碼', minLength: 6, example: 'password123' })
  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;

  @ApiPropertyOptional({ description: '手機號碼', example: '0912345678' })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone?: string;

  @ApiPropertyOptional({ description: '機構單位', example: '台大醫院' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  institution?: string;

  @ApiPropertyOptional({ description: '部門', example: '檢驗科' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  department?: string;

  @ApiPropertyOptional({ description: '職稱', example: '醫檢師' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  jobTitle?: string;

  @ApiPropertyOptional({ 
    description: '使用者角色', 
    enum: UserRole,
    default: UserRole.GUEST 
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiPropertyOptional({ description: 'Session ID' })
  @IsString()
  @IsOptional()
  sessionId?: string;
}
