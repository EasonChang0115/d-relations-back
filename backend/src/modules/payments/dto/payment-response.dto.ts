import { IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaymentResponseDto {
  @ApiProperty({ 
    description: '付款記錄 ID',
    example: 'pay_abc123xyz'
  })
  @IsString()
  id!: string;

  @ApiProperty({ 
    description: '使用者 Email',
    example: 'user@example.com'
  })
  @IsEmail()
  email!: string;

  @ApiProperty({ 
    description: '付款狀態',
    example: 'succeeded',
    enum: ['pending', 'succeeded', 'failed', 'refunded']
  })
  @IsString()
  status!: string;

  @ApiProperty({ 
    description: 'Stripe 付款 ID',
    example: 'pi_3ABC123xyz'
  })
  @IsString()
  stripePaymentId!: string;
}
