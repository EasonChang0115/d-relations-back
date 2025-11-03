import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { OtpVerification } from './entities/otp-verification.entity';
import { User } from '@/modules/users/entities/user.entity';
import { MailModule } from '@/modules/mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([OtpVerification, User]), MailModule],
  providers: [OtpService],
  controllers: [OtpController],
  exports: [OtpService],
})
export class OtpModule {}
