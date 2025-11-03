import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PaymentRecord } from './entities/payment-record.entity';
import { User } from '@/modules/users/entities/user.entity';
import { MailModule } from '@/modules/mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentRecord, User]), MailModule],
  providers: [PaymentsService],
  controllers: [PaymentsController],
  exports: [PaymentsService],
})
export class PaymentsModule {}
