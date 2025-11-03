import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { PaymentRecord, PaymentStatus } from '../entities/payment-record.entity';
import { User } from '@/modules/users/entities/user.entity';
import { CreateCheckoutDto, PaymentWebhookDto } from '../dto/create-checkout.dto';
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
  private readonly stripeSecretKey: string;
  private readonly stripeWebhookSecret: string;

  constructor(
    @InjectRepository(PaymentRecord)
    private readonly paymentRepository: Repository<PaymentRecord>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {
    this.stripeSecretKey = configService.get<string>('stripe.secretKey') || '';
    this.stripeWebhookSecret = configService.get<string>('stripe.webhookSecret') || '';
  }

  async createCheckoutSession(createCheckoutDto: CreateCheckoutDto): Promise<{ sessionId: string; url: string }> {
    const user = await this.userRepository.findOne({
      where: { email: createCheckoutDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('使用者不存在');
    }

    // TODO: Integrate with Stripe SDK
    // const stripe = require('stripe')(this.stripeSecretKey);
    // const session = await stripe.checkout.sessions.create({...})

    // For now, create a mock payment record
    const mockPaymentId = `pi_${crypto.randomBytes(16).toString('hex')}`;

    const payment = await this.paymentRepository.save({
      userId: user.id,
      amount: createCheckoutDto.examType === 'personal' ? 299 : 599,
      currency: 'TWD',
      stripePaymentId: mockPaymentId,
      status: PaymentStatus.PENDING,
      paymentMethod: 'card',
      examType: createCheckoutDto.examType,
    });

    return {
      sessionId: mockPaymentId,
      url: `https://checkout.stripe.com/pay/${mockPaymentId}`,
    };
  }

  async handleWebhook(event: PaymentWebhookDto): Promise<void> {
    // Verify webhook signature
    // TODO: Implement proper signature verification
    // const sig = request.headers['stripe-signature'];
    // const event = stripe.webhooks.constructEvent(body, sig, this.stripeWebhookSecret);

    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutCompleted(event.data.object);
        break;
      case 'charge.failed':
        await this.handleChargeFailed(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }

  private async handleCheckoutCompleted(data: any): Promise<void> {
    const payment = await this.paymentRepository.findOne({
      where: { stripePaymentId: data.payment_intent },
    });

    if (payment) {
      payment.status = PaymentStatus.COMPLETED;
      payment.completedAt = new Date();
      payment.receiptUrl = data.receipt_email;
      payment.stripeResponse = JSON.stringify(data);
      await this.paymentRepository.save(payment);
    }
  }

  private async handleChargeFailed(data: any): Promise<void> {
    const payment = await this.paymentRepository.findOne({
      where: { stripePaymentId: data.payment_intent },
    });

    if (payment) {
      payment.status = PaymentStatus.FAILED;
      payment.failureReason = data.failure_message;
      payment.stripeResponse = JSON.stringify(data);
      await this.paymentRepository.save(payment);
    }
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentRecord> {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new BadRequestException('付款紀錄不存在');
    }

    return payment;
  }

  async getUserPaymentHistory(userId: string, limit: number = 10): Promise<PaymentRecord[]> {
    return this.paymentRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
