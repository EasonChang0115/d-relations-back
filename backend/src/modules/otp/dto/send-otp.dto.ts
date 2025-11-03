import { IsEmail, IsString, Length } from 'class-validator';

export class SendOtpDto {
  @IsEmail()
  email!: string;

  @IsString()
  verificationType?: string;
}

export class VerifyOtpDto {
  @IsEmail()
  email!: string;

  @IsString()
  @Length(6, 6)
  otpCode!: string;
}

export class OtpResponseDto {
  @IsString()
  message!: string;

  @IsString()
  expiresIn!: string;
}

export class OtpVerifyResponseDto {
  @IsString()
  message!: string;

  @IsString()
  sessionToken?: string;
}
