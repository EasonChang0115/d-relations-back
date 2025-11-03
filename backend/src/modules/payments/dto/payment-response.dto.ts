import { IsString, IsEmail } from 'class-validator';

export class PaymentResponseDto {
  @IsString()
  id!: string;

  @IsEmail()
  email!: string;

  @IsString()
  status!: string;

  @IsString()
  stripePaymentId!: string;
}
