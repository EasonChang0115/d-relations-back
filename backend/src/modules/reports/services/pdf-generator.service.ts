import { Injectable } from '@nestjs/common';
import { PdfTemplateBuilder } from './pdf-template.builder';

/**
 * PDF Generation Service
 * Generates PDF reports from exam results using puppeteer
 * Note: In production, integrate with external service like AWS Lambda + wkhtmltopdf
 */
@Injectable()
export class PdfGeneratorService {
  constructor(private readonly templateBuilder: PdfTemplateBuilder) {}

  /**
   * Generate PDF for result report
   * Returns HTML for now - in production use: puppeteer, wkhtmltopdf, or similar
   */
  async generateResultPdf(reportData: any): Promise<string> {
    // Generate HTML template
    const html = this.templateBuilder.buildResultReportTemplate(reportData);

    // In production, convert HTML to PDF using one of:
    // 1. Puppeteer (requires Chromium)
    // 2. wkhtmltopdf (system dependency)
    // 3. AWS Lambda + external service
    // 4. Third-party PDF API

    // For now, return HTML for client-side rendering or queue for background processing
    return html;
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
