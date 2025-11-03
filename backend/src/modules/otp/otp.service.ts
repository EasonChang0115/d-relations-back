import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OtpVerification } from '../entities/otp-verification.entity';
import { User } from '@/modules/users/entities/user.entity';
import * as crypto from 'crypto';

@Injectable()
export class OtpService {
  private readonly OTP_LENGTH = 6;
  private readonly OTP_EXPIRY_MINUTES = 10;
  private readonly MAX_ATTEMPTS = 10;
  private readonly LOCKOUT_MINUTES = 5;

  constructor(
    @InjectRepository(OtpVerification)
    private readonly otpRepository: Repository<OtpVerification>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async generateOtp(): Promise<string> {
    let otp = '';
    for (let i = 0; i < this.OTP_LENGTH; i++) {
      otp += Math.floor(Math.random() * 10).toString();
    }
    return otp;
  }

  async sendOtp(email: string, verificationType: string = 'email_verification'): Promise<{ message: string; expiresIn: string }> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      return { message: '如果該電子郵件已註冊，將發送驗證碼', expiresIn: '10 分鐘' };
    }

    // Check if user has active OTP (prevent spam)
    const existingOtp = await this.otpRepository.findOne({
      where: { userId: user.id, isVerified: false },
    });

    if (existingOtp && !existingOtp.isLocked) {
      const timeSinceCreation = Date.now() - existingOtp.createdAt.getTime();
      const secondsSinceCreation = Math.floor(timeSinceCreation / 1000);
      if (secondsSinceCreation < 60) {
        throw new BadRequestException('請在 60 秒後重新申請驗證碼');
      }
    }

    const otp = await this.generateOtp();
    const expiresAt = new Date(Date.now() + this.OTP_EXPIRY_MINUTES * 60 * 1000);

    // Save OTP to database
    await this.otpRepository.save({
      userId: user.id,
      otpCode: otp,
      expiresAt,
      verificationType,
      attemptCount: 0,
      maxAttempts: this.MAX_ATTEMPTS,
      isLocked: false,
    });

    // TODO: Send OTP via email
    // await this.mailService.sendOtp(email, otp);

    return { message: '驗證碼已發送至您的電子郵件', expiresIn: `${this.OTP_EXPIRY_MINUTES} 分鐘` };
  }

  async verifyOtp(email: string, otpCode: string): Promise<{ message: string; sessionToken?: string }> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('使用者不存在');
    }

    const otp = await this.otpRepository.findOne({
      where: { userId: user.id, isVerified: false },
      order: { createdAt: 'DESC' },
    });

    if (!otp) {
      throw new BadRequestException('驗證碼不存在或已過期');
    }

    // Check if locked
    if (otp.isLocked && otp.lockedUntil && otp.lockedUntil > new Date()) {
      throw new BadRequestException('驗證碼已被鎖定，請稍後重試');
    }

    // Check if expired
    if (otp.expiresAt < new Date()) {
      throw new BadRequestException('驗證碼已過期');
    }

    // Increment attempt count
    otp.attemptCount += 1;

    // Check if max attempts exceeded
    if (otp.attemptCount >= otp.maxAttempts) {
      otp.isLocked = true;
      otp.lockedUntil = new Date(Date.now() + this.LOCKOUT_MINUTES * 60 * 1000);
      await this.otpRepository.save(otp);
      throw new BadRequestException(`驗證次數過多，請在 ${this.LOCKOUT_MINUTES} 分鐘後重試`);
    }

    // Verify OTP code
    if (otp.otpCode !== otpCode) {
      await this.otpRepository.save(otp);
      throw new BadRequestException(
        `驗證碼不正確，剩餘嘗試次數: ${otp.maxAttempts - otp.attemptCount}`,
      );
    }

    // Mark as verified
    otp.isVerified = true;
    otp.verifiedAt = new Date();
    await this.otpRepository.save(otp);

    // Generate session token
    const sessionToken = crypto.randomBytes(32).toString('hex');

    return {
      message: '驗證成功',
      sessionToken,
    };
  }

  async invalidateOtp(userId: string): Promise<void> {
    await this.otpRepository.update(
      { userId, isVerified: false },
      { isVerified: true },
    );
  }
}
