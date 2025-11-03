import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: any;
  private readonly logger = new Logger(MailService.name);

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

  async sendBatchInvitation(
    email: string,
    invitationData: {
      takerName: string;
      batchName: string;
      examUrl: string;
      questionCount: number;
      expiresAt?: Date;
    },
  ): Promise<void> {
    try {
      const { takerName, batchName, examUrl, questionCount, expiresAt } = invitationData;

      await this.transporter.sendMail({
        from: this.configService.get('MAIL_FROM', 'noreply@medical-test.com'),
        to: email,
        subject: `群組測驗邀請 - ${batchName}`,
        html: `
          <h2>群組測驗邀請</h2>
          <p>您好 ${takerName},</p>
          <p>您已被邀請參與群組測驗：<strong>${batchName}</strong></p>
          <p>測驗詳情：</p>
          <ul>
            <li>題目數量：${questionCount} 題</li>
            <li>有效期限：${expiresAt ? new Date(expiresAt).toLocaleDateString('zh-TW') : '30 天'}</li>
          </ul>
          <p>請點擊下方連結開始測驗：</p>
          <p><a href="${examUrl}" style="background-color: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px;">開始測驗</a></p>
          <p style="color: #666;">此邀請連結為一次性使用。</p>
        `,
      });
    } catch (error) {
      console.error('Failed to send batch invitation email:', error);
      throw error;
    }
  }

  async sendAdminLink(
    email: string,
    adminData: {
      adminName: string;
      batchName: string;
      adminUrl: string;
      takerCount: number;
    },
  ): Promise<void> {
    try {
      const { adminName, batchName, adminUrl, takerCount } = adminData;

      await this.transporter.sendMail({
        from: this.configService.get('MAIL_FROM', 'noreply@medical-test.com'),
        to: email,
        subject: `群組管理面板 - ${batchName}`,
        html: `
          <h2>群組管理面板</h2>
          <p>您好 ${adminName},</p>
          <p>您的群組測驗 <strong>${batchName}</strong> 已準備好。</p>
          <p>批次資訊：</p>
          <ul>
            <li>受測者數量：${takerCount} 人</li>
            <li>批次狀態：已建立</li>
          </ul>
          <p>請點擊下方連結訪問管理面板：</p>
          <p><a href="${adminUrl}" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px;">進入管理面板</a></p>
          <p style="color: #666;">在管理面板中，您可以：</p>
          <ul>
            <li>查看受測者進度</li>
            <li>查看實時統計結果</li>
            <li>管理受測者信息</li>
          </ul>
        `,
      });
    } catch (error) {
      console.error('Failed to send admin link email:', error);
      throw error;
    }
  }

  async sendExamReminder(
    email: string,
    reminderData: {
      takerName: string;
      batchName: string;
      examUrl: string;
      questionCount: number;
      expiresAt: Date;
    },
  ): Promise<void> {
    try {
      const { takerName, batchName, examUrl, questionCount, expiresAt } = reminderData;

      await this.transporter.sendMail({
        from: this.configService.get('MAIL_FROM', 'noreply@medical-test.com'),
        to: email,
        subject: `提醒：測驗即將過期 - ${batchName}`,
        html: `
          <h2>📝 測驗提醒</h2>
          <p>您好 ${takerName},</p>
          <p>這是友善的提醒，您參與的群組測驗 <strong>${batchName}</strong> 尚未完成。</p>
          <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
            <p style="color: #856404; margin: 0; font-weight: bold;">⏰ 測驗將於 ${new Date(expiresAt).toLocaleDateString('zh-TW')} 過期</p>
            <p style="color: #856404; margin: 10px 0 0 0;">請盡快完成測驗以免錯過。</p>
          </div>
          <p><strong>測驗詳情：</strong></p>
          <ul>
            <li>題目數量：${questionCount} 題</li>
            <li>批次名稱：${batchName}</li>
            <li>狀態：未完成</li>
          </ul>
          <p><a href="${examUrl}" style="background-color: #ffc107; color: #333; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">現在完成測驗</a></p>
        `,
      });
    } catch (error) {
      console.error('Failed to send exam reminder email:', error);
      throw error;
    }
  }

  /**
   * Daily cron job to send exam reminder emails (9:00 AM every day)
   * Processes incomplete exams expiring within 3 days
   */
  @Cron('0 9 * * *')
  async dailyReminderJob(): Promise<void> {
    this.logger.log('Starting daily exam reminder job');

    try {
      // TODO: Query incomplete exams expiring soon
      // SELECT * FROM exams WHERE status != 'completed' AND view_expires_at < NOW() + INTERVAL 3 DAYS

      // TODO: For each exam, check shouldSendReminder()
      // if (shouldSendReminder(exam)) {
      //   await sendExamReminder(...)
      // }

      this.logger.log('Daily reminder job completed');
    } catch (error) {
      this.logger.error('Daily reminder job failed:', error);
    }
  }

  /**
   * Schedule reminder emails for incomplete exams
   * Should be called by @nestjs/schedule
   */
  async scheduleReminders(): Promise<void> {
    // TODO: Query incomplete exams expiring soon
    // SELECT * FROM exams WHERE status != 'completed' AND view_expires_at < NOW() + INTERVAL 3 DAYS

    // TODO: For each exam, check shouldSendReminder()
    // if (shouldSendReminder(exam)) {
    //   await sendExamReminder(...)
    // }
  }

  /**
   * Check if reminder should be sent for an exam
   */
  async shouldSendReminder(examId: string): Promise<boolean> {
    // TODO: Query exam
    // - Check if exam is completed (if yes, don't send)
    // - Check if exam has expired (if yes, don't send)
    // - Check if reminder was already sent (once per exam)
    // - Check if exam expires within 3 days (if yes, send)

    return false; // Placeholder
  }
}
