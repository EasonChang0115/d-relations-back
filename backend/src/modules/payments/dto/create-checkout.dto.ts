import { IsEmail, IsNumber, IsString, IsEnum, Min, Max } from 'class-validator';

export enum ExamTypeEnum {
  FREE = 'free',
  PERSONAL = 'personal',
  GROUP = 'group',
}

export class CreateCheckoutDto {
  @IsEmail()
  email!: string;

  @IsEnum(ExamTypeEnum)
  examType!: ExamTypeEnum;

  @IsString()
  successUrl!: string;

  @IsString()
  cancelUrl!: string;
}

export class PaymentResponseDto {
  @IsString()
  sessionId!: string;

  @IsString()
  url!: string;

  @IsString()
  paymentId!: string;

  @IsString()
  status!: string;

  @IsNumber()
  amount!: number;

  @IsString()
  currency!: string;
}

export class PaymentWebhookDto {
  @IsString()
  type!: string;

  @IsString()
  id!: string;

  data: {
    object: {
      id: string;
      status: string;
      amount: number;
      currency: string;
      customer_email: string;
      payment_intent: string;
    };
  }!;
}
