import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  BadRequestException,
  Get,
  Param,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreateCheckoutDto, PaymentWebhookDto } from './dto/create-checkout.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { Public } from '@/common/decorators/public.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-checkout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: '建立付款結帳頁面',
    description: '建立 Stripe 付款結帳頁面並返回付款連結'
  })
  @ApiBody({ type: CreateCheckoutDto })
  @ApiResponse({ 
    status: 200, 
    description: '結帳頁面已建立',
    example: {
      sessionId: 'cs_test_abc123',
      url: 'https://checkout.stripe.com/pay/cs_test_abc123'
    }
  })
  @ApiResponse({ status: 400, description: '參數錯誤' })
  @ApiResponse({ status: 401, description: '未授權' })
  async createCheckout(
    @Body() createCheckoutDto: CreateCheckoutDto,
  ): Promise<{ sessionId: string; url: string }> {
    return this.paymentsService.createCheckoutSession(createCheckoutDto);
  }

  @Public()
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Stripe Webhook',
    description: '接收 Stripe 付款事件通知 (由 Stripe 自動呼叫)'
  })
  @ApiResponse({ status: 200, description: 'Webhook 已接收' })
  async handleWebhook(@Body() event: PaymentWebhookDto): Promise<{ received: boolean }> {
    if (!event.type) {
      throw new BadRequestException('Webhook event type required');
    }
    await this.paymentsService.handleWebhook(event);
    return { received: true };
  }

  @Get(':paymentId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: '查詢付款狀態',
    description: '查詢指定付款記錄的狀態'
  })
  @ApiResponse({ 
    status: 200, 
    description: '成功',
    example: {
      paymentId: 'pay_abc123xyz',
      status: 'succeeded',
      amount: 1500,
      currency: 'TWD'
    }
  })
  @ApiResponse({ status: 404, description: '付款記錄不存在' })
  @ApiResponse({ status: 401, description: '未授權' })
  async getPaymentStatus(@Param('paymentId') paymentId: string) {
    return this.paymentsService.getPaymentStatus(paymentId);
  }

  @Get('user/history')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: '取得使用者付款歷史',
    description: '取得當前使用者的所有付款記錄'
  })
  @ApiResponse({ 
    status: 200, 
    description: '成功',
    example: [
      {
        paymentId: 'pay_abc123xyz',
        amount: 1500,
        currency: 'TWD',
        status: 'succeeded',
        createdAt: '2024-01-15T10:00:00Z'
      }
    ]
  })
  @ApiResponse({ status: 401, description: '未授權' })
  async getUserPaymentHistory(@Request() req: any) {
    return this.paymentsService.getUserPaymentHistory(req.user.userId);
  }
}
