import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: any;

  constructor(private readonly configService: ConfigService) {
    // TODO: Configure with AWS SES or other mail service
    // For development, configure nodemailer with SMTP
    this.transporter = nodemailer.createTransport({
      host: configService.get('MAIL_HOST', 'localhost'),
      port: configService.get('MAIL_PORT', 1025),
      secure: false,
      auth: {
        user: configService.get('MAIL_USER'),
        pass: configService.get('MAIL_PASSWORD'),
      },
    });
  }

  async sendOtp(email: string, otp: string, name?: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.configService.get('MAIL_FROM', 'noreply@medical-test.com'),
        to: email,
        subject: '醫學細胞識別測驗 - 驗證碼',
        html: `
          <h2>電子郵件驗證</h2>
          <p>您好${name ? ` ${name}` : ''},</p>
          <p>請使用以下驗證碼完成驗證：</p>
          <div style="background-color: #f0f0f0; padding: 20px; border-radius: 5px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #007bff; margin: 20px 0;">
            ${otp}
          </div>
          <p>此驗證碼有效期為 10 分鐘。</p>
        `,
      });
    } catch (error) {
      console.error('Failed to send OTP email:', error);
      throw error;
    }
  }

  async sendExamLink(
    email: string,
    examUrl: string,
    name?: string,
  ): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.configService.get('MAIL_FROM', 'noreply@medical-test.com'),
        to: email,
        subject: '您的測驗已準備好',
        html: `
          <h2>您的測驗已準備好</h2>
          <p>您好${name ? ` ${name}` : ''},</p>
          <p>感謝您購買我們的付費版測驗。您現在可以開始進行 20 題的細胞識別測驗。</p>
          <p><a href="${examUrl}" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px;">開始測驗</a></p>
          <p>此測驗有效期限為 30 天</p>
        `,
      });
    } catch (error) {
      console.error('Failed to send exam link email:', error);
      throw error;
    }
  }

  async sendPasswordReset(
    email: string,
    resetUrl: string,
    name?: string,
  ): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.configService.get('MAIL_FROM', 'noreply@medical-test.com'),
        to: email,
        subject: '密碼重設',
        html: `
          <h2>密碼重設請求</h2>
          <p>您好${name ? ` ${name}` : ''},</p>
          <p>我們收到了您的密碼重設請求。請點擊下方連結重設您的密碼：</p>
          <p><a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px;">重設密碼</a></p>
          <p style="color: #666;">此連結有效期為 1 小時。如果您沒有要求重設密碼，請忽略此郵件。</p>
        `,
      });
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      throw error;
    }
  }
}
