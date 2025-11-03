import { IsEmail, IsString, MinLength, MaxLength, Matches, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Email 格式不正確' })
  email!: string;

  @IsString()
  @MinLength(8, { message: '密碼至少需要 8 個字元' })
  @MaxLength(50)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: '密碼必須包含大小寫字母和數字',
  })
  password!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  organization_code?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  job_title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  certification_status?: string;
}
