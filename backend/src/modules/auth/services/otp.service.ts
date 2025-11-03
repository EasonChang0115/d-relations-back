import { Injectable, BadRequestException, TooManyRequestsException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';

interface OtpAttempt {
  count: number;
  lockedUntil?: number;
}

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);
  private readonly otpAttempts = new Map<string, OtpAttempt>();
  private readonly maxAttempts = 5;
  private readonly lockoutDuration = 15 * 60 * 1000; // 15 minutes

  constructor(private readonly configService: ConfigService) {}

  /**
   * Generate OTP secret and QR code
   */
  async generateSecret(email: string): Promise<{ secret: string; qrCode: string }> {
    const secret = speakeasy.generateSecret({
      name: `Medical Cell Test (${email})`,
      issuer: 'Medical Cell Recognition Platform',
      length: 32,
    });

    const qrCode = await qrcode.toDataURL(secret.otpauth_url || '');

    return {
      secret: secret.base32,
      qrCode,
    };
  }

  /**
   * Verify OTP token with rate limiting and lockout
   * Throws:
   * - BadRequestException (400) on invalid/expired OTP
   * - TooManyRequestsException (429) on rate limit/lockout
   */
  async verifyOtp(email: string, token: string): Promise<boolean> {
    // Check if account is locked
    const attempt = this.otpAttempts.get(email);
    if (attempt?.lockedUntil && Date.now() < attempt.lockedUntil) {
      const remainingSeconds = Math.ceil((attempt.lockedUntil - Date.now()) / 1000);
      this.logger.warn(`OTP verification locked for ${email} for ${remainingSeconds}s`);
      throw new TooManyRequestsException(
        `帳戶已鎖定，請在 ${remainingSeconds} 秒後重試`,
      );
    }

    // Verify OTP token
    const isValid = speakeasy.totp.verify({
      secret: this.configService.get('OTP_SECRET') || '',
      encoding: 'base32',
      token,
      window: 2, // Allow 2 time steps
    });

    if (!isValid) {
      // Increment failed attempts
      const currentAttempt = this.otpAttempts.get(email) || { count: 0 };
      currentAttempt.count++;

      if (currentAttempt.count >= this.maxAttempts) {
        currentAttempt.lockedUntil = Date.now() + this.lockoutDuration;
        this.logger.warn(`OTP verification locked for ${email} after ${this.maxAttempts} failed attempts`);
      }

      this.otpAttempts.set(email, currentAttempt);
      throw new BadRequestException('OTP 無效或已過期');
    }

    // Reset attempts on success
    this.otpAttempts.delete(email);
    return true;
  }

  /**
   * Reset OTP attempts for email (admin only)
   */
  resetAttempts(email: string): void {
    this.otpAttempts.delete(email);
    this.logger.log(`OTP attempts reset for ${email}`);
  }

  /**
   * Check remaining attempts before lockout
   */
  getRemainingAttempts(email: string): number {
    const attempt = this.otpAttempts.get(email);
    if (!attempt) {
      return this.maxAttempts;
    }

    return Math.max(0, this.maxAttempts - attempt.count);
  }

  /**
   * Check if email is currently locked
   */
  isLocked(email: string): boolean {
    const attempt = this.otpAttempts.get(email);
    return attempt?.lockedUntil ? Date.now() < attempt.lockedUntil : false;
  }

  /**
   * Get lockout time remaining in seconds
   */
  getLockoutTime(email: string): number {
    const attempt = this.otpAttempts.get(email);
    if (!attempt?.lockedUntil) {
      return 0;
    }

    const remaining = attempt.lockedUntil - Date.now();
    return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
  }
}
