import { IsEmail, IsNumber, IsString, IsEnum, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ExamTypeEnum {
  FREE = 'free',
  PERSONAL = 'personal',
  GROUP = 'group',
}

export class CreateCheckoutDto {
  @ApiProperty({ 
    description: '使用者 Email',
    example: 'user@example.com'
  })
  @IsEmail()
  email!: string;

  @ApiProperty({ 
    description: '測驗類型',
    enum: ExamTypeEnum,
    example: ExamTypeEnum.PERSONAL
  })
  @IsEnum(ExamTypeEnum)
  examType!: ExamTypeEnum;

  @ApiProperty({ 
    description: '付款成功後的重定向 URL',
    example: 'https://example.com/success'
  })
  @IsString()
  successUrl!: string;

  @ApiProperty({ 
    description: '付款取消後的重定向 URL',
    example: 'https://example.com/cancel'
  })
  @IsString()
  cancelUrl!: string;
}

export class PaymentResponseDto {
  @ApiProperty({ 
    description: 'Stripe Session ID',
    example: 'cs_test_abc123'
  })
  @IsString()
  sessionId!: string;

  @ApiProperty({ 
    description: '付款頁面 URL',
    example: 'https://checkout.stripe.com/pay/cs_test_abc123'
  })
  @IsString()
  url!: string;

  @ApiProperty({ 
    description: '付款記錄 ID',
    example: 'pay_abc123xyz'
  })
  @IsString()
  paymentId!: string;

  @ApiProperty({ 
    description: '付款狀態',
    example: 'pending'
  })
  @IsString()
  status!: string;

  @ApiProperty({ 
    description: '付款金額',
    example: 1500
  })
  @IsNumber()
  amount!: number;

  @ApiProperty({ 
    description: '貨幣代碼',
    example: 'TWD'
  })
  @IsString()
  currency!: string;
}

export class PaymentWebhookDto {
  @IsString()
  type!: string;

  @IsString()
  id!: string;

  data!: {
    object: {
      id: string;
      status: string;
      amount: number;
      currency: string;
      customer_email: string;
      payment_intent: string;
    };
  };
}
