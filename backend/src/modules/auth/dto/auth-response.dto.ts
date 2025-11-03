import { IsEmail, IsString } from 'class-validator';

export class AuthResponseDto {
  @IsString()
  access_token!: string;

  @IsString()
  refresh_token!: string;

  @IsEmail()
  email!: string;

  @IsString()
  name!: string;
}
