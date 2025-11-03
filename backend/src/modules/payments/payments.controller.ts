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
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-checkout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async createCheckout(
    @Body() createCheckoutDto: CreateCheckoutDto,
  ): Promise<{ sessionId: string; url: string }> {
    return this.paymentsService.createCheckoutSession(createCheckoutDto);
  }

  @Public()
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
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
  async getPaymentStatus(@Param('paymentId') paymentId: string) {
    return this.paymentsService.getPaymentStatus(paymentId);
  }

  @Get('user/history')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getUserPaymentHistory(@Request() req: any) {
    return this.paymentsService.getUserPaymentHistory(req.user.userId);
  }
}
