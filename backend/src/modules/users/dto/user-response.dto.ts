import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { UserRole } from '../entities/user.entity';

export class UserResponseDto {
  @ApiProperty({ 
    description: '使用者 ID',
    example: 'user_abc123xyz'
  })
  id!: string;

  @ApiPropertyOptional({ 
    description: '使用者姓名',
    example: '王小明'
  })
  name?: string;

  @ApiPropertyOptional({ 
    description: '電子郵件',
    example: 'user@example.com'
  })
  email?: string;

  @Exclude()
  password?: string;

  @ApiPropertyOptional({ 
    description: '手機號碼',
    example: '0912345678'
  })
  phone?: string;

  @ApiProperty({ 
    description: '使用者角色', 
    enum: UserRole,
    example: 'user'
  })
  role!: UserRole;

  @ApiPropertyOptional({ 
    description: 'Session ID',
    example: 'session_xyz789'
  })
  sessionId?: string;

  @ApiPropertyOptional({ 
    description: '機構單位',
    example: '台大醫院'
  })
  institution?: string;

  @ApiPropertyOptional({ 
    description: '部門',
    example: '檢驗科'
  })
  department?: string;

  @ApiPropertyOptional({ 
    description: '職稱',
    example: '醫檢師'
  })
  jobTitle?: string;

  @ApiProperty({ 
    description: '是否已驗證電子郵件',
    example: true
  })
  emailVerified!: boolean;

  @ApiPropertyOptional({ 
    description: '最後登入時間',
    example: '2024-01-15T08:30:00Z'
  })
  lastLoginAt?: Date;

  @ApiProperty({ 
    description: '是否啟用',
    example: true
  })
  isActive!: boolean;

  @ApiProperty({ 
    description: '建立時間',
    example: '2024-01-01T00:00:00Z'
  })
  createdAt!: Date;

  @ApiProperty({ 
    description: '更新時間',
    example: '2024-01-15T10:00:00Z'
  })
  updatedAt!: Date;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
