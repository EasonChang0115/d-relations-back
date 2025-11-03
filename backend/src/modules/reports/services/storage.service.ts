import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly s3Client: AWS.S3;
  private readonly pdfCache = new Map<string, { url: string; expiresAt: number }>();

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new AWS.S3({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get('AWS_REGION'),
    });
  }

  /**
   * Upload PDF to S3 and cache the URL for 30 days
   */
  async uploadPdf(fileName: string, fileBuffer: Buffer): Promise<string> {
    const cacheKey = `pdf:${fileName}`;
    const cached = this.pdfCache.get(cacheKey);

    // Return cached URL if still valid
    if (cached && cached.expiresAt > Date.now()) {
      this.logger.log(`Returning cached PDF URL for ${fileName}`);
      return cached.url;
    }

    try {
      const bucketName = this.configService.get('AWS_S3_BUCKET');
      const key = `pdfs/${fileName}`;

      const params: AWS.S3.PutObjectRequest = {
        Bucket: bucketName,
        Key: key,
        Body: fileBuffer,
        ContentType: 'application/pdf',
        CacheControl: 'max-age=2592000', // 30 days
      };

      await this.s3Client.upload(params).promise();

      const url = `https://${bucketName}.s3.${this.configService.get('AWS_REGION')}.amazonaws.com/${key}`;

      // Cache URL for 30 days (in memory for this session)
      const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
      this.pdfCache.set(cacheKey, {
        url,
        expiresAt: Date.now() + thirtyDaysInMs,
      });

      this.logger.log(`PDF uploaded to S3: ${url}`);
      return url;
    } catch (error) {
      this.logger.error(`Failed to upload PDF to S3: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get cached PDF URL if available
   */
  getCachedPdfUrl(fileName: string): string | null {
    const cacheKey = `pdf:${fileName}`;
    const cached = this.pdfCache.get(cacheKey);

    if (cached && cached.expiresAt > Date.now()) {
      return cached.url;
    }

    this.pdfCache.delete(cacheKey);
    return null;
  }

  /**
   * Clear PDF cache for specific file
   */
  clearPdfCache(fileName: string): void {
    const cacheKey = `pdf:${fileName}`;
    this.pdfCache.delete(cacheKey);
  }

  /**
   * Clear all expired cache entries
   */
  clearExpiredCache(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    for (const [key, value] of this.pdfCache.entries()) {
      if (value.expiresAt <= now) {
        expiredKeys.push(key);
      }
    }

    expiredKeys.forEach(key => this.pdfCache.delete(key));
    this.logger.log(`Cleared ${expiredKeys.length} expired cache entries`);
  }
}
