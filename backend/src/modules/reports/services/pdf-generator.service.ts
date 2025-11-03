import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue, Job } from 'bull';
import { PdfTemplateBuilder } from './pdf-template.builder';

interface PdfGenerationPayload {
  reportId: string;
  userId: string;
  reportData: any;
}

/**
 * PDF Generation Service
 * Queues PDF generation as background jobs
 * Returns URL after generation completes
 */
@Injectable()
export class PdfGeneratorService {
  private readonly logger = new Logger(PdfGeneratorService.name);

  constructor(
    @InjectQueue('pdf-generation') private pdfQueue: Queue,
    private readonly templateBuilder: PdfTemplateBuilder,
  ) {
    this.setupQueueListeners();
  }

  /**
   * Queue PDF generation (async background job)
   */
  async queuePdfGeneration(userId: string, reportId: string, reportData: any): Promise<string> {
    const job = await this.pdfQueue.add(
      { userId, reportId, reportData } as PdfGenerationPayload,
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: true,
      },
    );

    this.logger.log(`PDF generation queued: job ${job.id} for report ${reportId}`);
    return job.id.toString();
  }

  /**
   * Process PDF generation job
   */
  async processPdfGeneration(job: Job<PdfGenerationPayload>): Promise<string> {
    try {
      const { reportId, userId, reportData } = job.data;
      this.logger.log(`Processing PDF job ${job.id} for report ${reportId}`);

      // Generate HTML template
      const html = this.templateBuilder.buildResultReportTemplate(reportData);

      // In production, convert HTML to PDF using one of:
      // 1. Puppeteer (requires Chromium)
      // 2. wkhtmltopdf (system dependency)
      // 3. AWS Lambda + external service
      // 4. Third-party PDF API

      this.logger.log(`PDF generation completed for report ${reportId}`);
      return html;
    } catch (error) {
      this.logger.error(`PDF generation failed for job ${job.id}:`, error);
      throw error;
    }
  }

  /**
   * Generate PDF for result report (synchronous - uses queue internally)
   * Returns HTML for now - in production use: puppeteer, wkhtmltopdf, or similar
   */
  async generateResultPdf(reportData: any, userId?: string, reportId?: string): Promise<string> {
    // Generate HTML template
    const html = this.templateBuilder.buildResultReportTemplate(reportData);

    // Queue PDF generation if IDs provided
    if (userId && reportId) {
      await this.queuePdfGeneration(userId, reportId, reportData);
    }

    return html;
  }

  private setupQueueListeners(): void {
    this.pdfQueue.on('completed', (job) => {
      this.logger.log(`PDF job ${job.id} completed successfully`);
    });

    this.pdfQueue.on('failed', (job, err) => {
      this.logger.error(`PDF job ${job.id} failed after retries: ${err.message}`);
    });

    this.pdfQueue.on('stalled', (job) => {
      this.logger.warn(`PDF job ${job.id} stalled, will be retried`);
    });
  }

  /**
   * Get PDF filename
   */
  getPdfFileName(reportId: string, userId: string): string {
    const timestamp = new Date().toISOString().split('T')[0];
    return `report_${userId}_${reportId}_${timestamp}.pdf`;
  }

  /**
   * Get PDF S3 key
   */
  getPdfS3Key(userId: string, reportId: string): string {
    return `pdf-reports/${userId}/${reportId}.pdf`;
  }
}
