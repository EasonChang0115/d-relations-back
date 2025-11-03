import { Injectable, Logger } from '@nestjs/common';

export enum EmailJobType {
  OTP = 'otp',
  EXAM_LINK = 'exam_link',
  PASSWORD_RESET = 'password_reset',
  REPORT_READY = 'report_ready',
}

export interface EmailJob {
  id?: string;
  type: EmailJobType;
  recipient: string;
  subject: string;
  templateName: string;
  data: Record<string, any>;
  retries?: number;
  maxRetries?: number;
  createdAt?: Date;
  processedAt?: Date;
}

/**
 * Email Queue Service
 * Manages email delivery queue for reliable email sending
 * 
 * In production, integrate with Bull Queue + Redis:
 * - Install: npm install bull redis
 * - Each email goes to queue
 * - Workers process asynchronously
 * - Automatic retry on failure
 * - Dead letter queue for failures
 */
@Injectable()
export class EmailQueueService {
  private readonly logger = new Logger(EmailQueueService.name);
  private emailQueue: EmailJob[] = [];
  private processedEmails: Set<string> = new Set();

  /**
   * Add email to queue
   */
  async addEmailToQueue(job: EmailJob): Promise<void> {
    job.id = `${job.type}_${Date.now()}_${Math.random()}`;
    job.createdAt = new Date();
    job.maxRetries = job.maxRetries || 3;
    job.retries = 0;

    this.emailQueue.push(job);
    this.logger.log(`Email queued: ${job.id} (${job.type} to ${job.recipient})`);

    // In production with Bull Queue:
    // await this.emailQueue.add(job, { attempts: 3, backoff: 'exponential' });
  }

  /**
   * Process email queue
   */
  async processQueue(): Promise<void> {
    while (this.emailQueue.length > 0) {
      const job = this.emailQueue.shift();
      if (!job) break;

      try {
        await this.processEmailJob(job);
        this.processedEmails.add(job.id!);
        this.logger.log(`Email processed: ${job.id}`);
      } catch (error) {
        this.logger.error(`Email failed: ${job.id}`, error);
        if ((job.retries || 0) < (job.maxRetries || 3)) {
          job.retries = (job.retries || 0) + 1;
          // Re-queue for retry
          this.emailQueue.push(job);
        } else {
          this.logger.error(`Email failed after ${job.maxRetries} retries: ${job.id}`);
          // Move to dead letter queue (log for manual review)
        }
      }
    }
  }

  /**
   * Process single email job
   */
  private async processEmailJob(job: EmailJob): Promise<void> {
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // In production, call MailService here:
    // await this.mailService.send({...job})

    job.processedAt = new Date();
    this.logger.debug(`Email sent: ${job.type} to ${job.recipient}`);
  }

  /**
   * Get queue status
   */
  getQueueStatus(): { pending: number; processed: number } {
    return {
      pending: this.emailQueue.length,
      processed: this.processedEmails.size,
    };
  }

  /**
   * Get pending emails
   */
  getPendingEmails(): EmailJob[] {
    return [...this.emailQueue];
  }

  /**
   * Schedule background queue processing
   */
  startQueueWorker(intervalMs: number = 5000): void {
    setInterval(async () => {
      try {
        await this.processQueue();
      } catch (error) {
        this.logger.error('Queue processing error:', error);
      }
    }, intervalMs);

    this.logger.log(`Email queue worker started (interval: ${intervalMs}ms)`);
  }
}
