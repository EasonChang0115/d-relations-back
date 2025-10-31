import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { UserRole } from '../entities/user.entity';

export class UserResponseDto {
  @ApiProperty({ description: '使用者 ID' })
  id!: string;

  @ApiPropertyOptional({ description: '使用者姓名' })
  name?: string;

  @ApiPropertyOptional({ description: '電子郵件' })
  email?: string;

  @Exclude()
  password?: string;

  @ApiPropertyOptional({ description: '手機號碼' })
  phone?: string;

  @ApiProperty({ description: '使用者角色', enum: UserRole })
  role!: UserRole;

  @ApiPropertyOptional({ description: 'Session ID' })
  sessionId?: string;

  @ApiPropertyOptional({ description: '機構單位' })
  institution?: string;

  @ApiPropertyOptional({ description: '部門' })
  department?: string;

  @ApiPropertyOptional({ description: '職稱' })
  jobTitle?: string;

  @ApiProperty({ description: '是否已驗證電子郵件' })
  emailVerified!: boolean;

  @ApiPropertyOptional({ description: '最後登入時間' })
  lastLoginAt?: Date;

  @ApiProperty({ description: '是否啟用' })
  isActive!: boolean;

  @ApiProperty({ description: '建立時間' })
  createdAt!: Date;

  @ApiProperty({ description: '更新時間' })
  updatedAt!: Date;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
