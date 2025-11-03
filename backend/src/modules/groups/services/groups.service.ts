import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupExamBatch, BatchStatus } from '../entities/group-exam-batch.entity';
import { GroupTaker, TakerStatus } from '../entities/group-taker.entity';
import {
  CreateBatchDto,
  ConfigureTakersDto,
  BatchResponseDto,
  BatchStatusDto,
  TakerDetailDto,
} from '../dto/batch.dto';
import { QuestionsService } from '@/modules/questions/questions.service';
import { MailService } from '@/modules/mail/mail.service';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

/**
 * Groups Service
 * Manages group exam batches, takers, and results
 */
@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(GroupExamBatch)
    private readonly batchRepository: Repository<GroupExamBatch>,
    @InjectRepository(GroupTaker)
    private readonly takerRepository: Repository<GroupTaker>,
    private readonly questionsService: QuestionsService,
    private readonly mailService: MailService,
  ) {}

  /**
   * Create a new group exam batch (admin purchase)
   */
  async createBatch(userId: string, createBatchDto: CreateBatchDto): Promise<BatchResponseDto> {
    const { batchName, batchDescription, examType, takerCount, questionCount } = createBatchDto;

    // Validate inputs
    if (takerCount < 5 || takerCount > 100) {
      throw new BadRequestException('受測者數量必須在 5-100 之間');
    }

    if (questionCount < 10 || questionCount > 50) {
      throw new BadRequestException('題目數量必須在 10-50 之間');
    }

    // Generate batch and admin tokens
    const batchToken = uuidv4();
    const adminToken = this.generateAdminToken();
    const batchSeed = this.generateBatchSeed(userId, batchName);

    // Generate questions for batch
    const questionSequence = await this.generateBatchQuestions(examType, questionCount, batchSeed);

    const batch = this.batchRepository.create({
      adminId: userId,
      batchName,
      batchDescription,
      status: BatchStatus.CREATED,
      examType,
      questionCount,
      takerCount,
      completedCount: 0,
      questionSequence,
      batchToken,
      adminToken,
      batchSeed,
      viewExpiresAt: this.getViewExpiryDate(),
    });

    const savedBatch = await this.batchRepository.save(batch);
    return this.toBatchResponseDto(savedBatch);
  }

  /**
   * Generate batch questions using batch seed
   * Ensures all takers in batch get same questions
   */
  async generateBatchQuestions(examType: string, count: number, seed: string): Promise<string[]> {
    // Get random questions using batch seed
    const questions = await this.questionsService.findRandomQuestions(examType as any, count, seed);
    return questions.map((q) => q.id);
  }

  /**
   * Generate admin token for batch management
   */
  private generateAdminToken(): string {
    const token = uuidv4();
    return crypto.createHash('sha256').update(token).digest('hex').substring(0, 32);
  }

  /**
   * Generate deterministic batch seed
   */
  private generateBatchSeed(userId: string, batchName: string): string {
    const data = `${userId}-${batchName}-${Date.now()}`;
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * Configure batch with takers
   */
  async configureTakers(
    batchId: string,
    userId: string,
    configureTakersDto: ConfigureTakersDto,
  ): Promise<BatchResponseDto> {
    const batch = await this.findBatchByIdAndAdmin(batchId, userId);

    // Validate taker count
    if (configureTakersDto.takerEmails.length !== batch.takerCount) {
      throw new BadRequestException(`必須提供 ${batch.takerCount} 個受測者郵件`);
    }

    // Create takers
    const takers: GroupTaker[] = [];
    for (const email of configureTakersDto.takerEmails) {
      const invitationToken = uuidv4();
      const taker = this.takerRepository.create({
        batchId,
        takerName: email.split('@')[0],
        takerEmail: email,
        status: TakerStatus.INVITED,
        invitationToken,
        invitedAt: new Date(),
      });
      takers.push(taker);
    }

    await this.takerRepository.save(takers);

    // Update batch status
    batch.status = BatchStatus.CONFIGURED;
    const updatedBatch = await this.batchRepository.save(batch);

    // Send invitations
    await this.inviteTakers(batchId, configureTakersDto.takerEmails);

    // Return full batch response
    return this.toBatchResponseDto(updatedBatch);
  }

  /**
   * Send invitations to takers
   */
  private async inviteTakers(batchId: string, takerEmails: string[]): Promise<void> {
    const batch = await this.batchRepository.findOne({ where: { id: batchId } });
    if (!batch) {
      throw new NotFoundException('批次不存在');
    }

    // Get all takers
    const takers = await this.takerRepository.find({ where: { batchId } });

    for (const taker of takers) {
      try {
        // Generate exam link with invitation token
        const examUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/exams/group/${batch.batchToken}?token=${taker.invitationToken}`;

        // Send invitation email
        await this.mailService.sendBatchInvitation(taker.takerEmail, {
          takerName: taker.takerName,
          batchName: batch.batchName,
          examUrl,
          questionCount: batch.questionCount,
          expiresAt: batch.viewExpiresAt,
        });
      } catch (error) {
        console.error(`Failed to send invitation to ${taker.takerEmail}:`, error);
        // Continue with other invitations
      }
    }
  }

  /**
   * Get batch status with all taker details
   */
  async getBatchStatus(batchId: string, userId: string): Promise<BatchStatusDto> {
    const batch = await this.findBatchByIdAndAdmin(batchId, userId);

    const takers = await this.takerRepository.find({
      where: { batchId },
      order: { createdAt: 'ASC' },
    });

    return {
      id: batch.id,
      batchName: batch.batchName,
      status: batch.status,
      takerCount: batch.takerCount,
      completedCount: batch.completedCount,
      groupAccuracyRate: batch.groupAccuracyRate,
      takers: takers.map((t) => this.toTakerDetailDto(t)),
    };
  }

  /**
   * Calculate group statistics
   */
  async calculateGroupStats(batchId: string): Promise<void> {
    const batch = await this.batchRepository.findOne({ where: { id: batchId } });
    if (!batch) {
      throw new NotFoundException('批次不存在');
    }

    const takers = await this.takerRepository.find({
      where: { batchId, status: TakerStatus.COMPLETED },
    });

    if (takers.length === 0) {
      batch.groupAccuracyRate = 0;
      batch.totalCorrectAnswers = 0;
      batch.totalQuestionsAnswered = 0;
      await this.batchRepository.save(batch);
      return;
    }

    const totalCorrect = takers.reduce((sum, t) => sum + (t.correctAnswers || 0), 0);
    const totalQuestions = takers.reduce((sum, t) => sum + (t.totalQuestions || 0), 0);

    batch.totalCorrectAnswers = totalCorrect;
    batch.totalQuestionsAnswered = totalQuestions;
    batch.groupAccuracyRate = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;
    batch.completedCount = takers.length;

    await this.batchRepository.save(batch);
  }

  /**
   * Get batch by token (for taker access)
   */
  async getBatchByToken(batchToken: string): Promise<GroupExamBatch> {
    const batch = await this.batchRepository.findOne({ where: { batchToken } });
    if (!batch) {
      throw new NotFoundException('批次不存在');
    }

    return batch;
  }

  /**
   * Get taker by invitation token
   */
  async getTakerByInvitationToken(invitationToken: string): Promise<GroupTaker> {
    const taker = await this.takerRepository.findOne({ where: { invitationToken } });
    if (!taker) {
      throw new NotFoundException('邀請令牌無效');
    }

    return taker;
  }

  /**
   * Update taker exam and result
   */
  async updateTakerResult(
    takerId: string,
    examId: string,
    correctAnswers: number,
    totalQuestions: number,
    timeSpentSeconds: number,
  ): Promise<void> {
    const taker = await this.takerRepository.findOne({ where: { id: takerId } });
    if (!taker) {
      throw new NotFoundException('受測者不存在');
    }

    const accuracyRate = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

    taker.examId = examId;
    taker.correctAnswers = correctAnswers;
    taker.totalQuestions = totalQuestions;
    taker.accuracyRate = accuracyRate;
    taker.timeSpentSeconds = timeSpentSeconds;
    taker.status = TakerStatus.COMPLETED;
    taker.completedAt = new Date();

    await this.takerRepository.save(taker);

    // Update batch statistics
    const batch = await this.batchRepository.findOne({ where: { id: taker.batchId } });
    if (batch) {
      await this.calculateGroupStats(batch.id);
    }
  }

  /**
   * Check if batch view has expired
   */
  async isBatchViewExpired(batchId: string): Promise<boolean> {
    const batch = await this.batchRepository.findOne({ where: { id: batchId } });
    if (!batch) {
      throw new NotFoundException('批次不存在');
    }

    if (!batch.viewExpiresAt) {
      return false;
    }

    return new Date() > batch.viewExpiresAt;
  }

  /**
   * Verify taker count vs purchase
   */
  async verifyTakerCount(batchId: string, takerEmails: string[]): Promise<boolean> {
    const batch = await this.batchRepository.findOne({ where: { id: batchId } });
    if (!batch) {
      throw new NotFoundException('批次不存在');
    }

    if (takerEmails.length > batch.takerCount) {
      throw new BadRequestException(
        `受測者數量 (${takerEmails.length}) 超過購買份數 (${batch.takerCount})`,
      );
    }

    return true;
  }

  /**
   * Find batch by ID and verify admin
   */
  private async findBatchByIdAndAdmin(batchId: string, userId: string): Promise<GroupExamBatch> {
    const batch = await this.batchRepository.findOne({ where: { id: batchId } });
    if (!batch) {
      throw new NotFoundException('批次不存在');
    }

    if (batch.adminId !== userId) {
      throw new ForbiddenException('無權限存取此批次');
    }

    return batch;
  }

  /**
   * Get view expiry date (30 days from now)
   */
  private getViewExpiryDate(): Date {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    return expiryDate;
  }

  /**
   * Convert to response DTO
   */
  private toBatchResponseDto(batch: GroupExamBatch): BatchResponseDto {
    return {
      id: batch.id,
      batchName: batch.batchName,
      batchDescription: batch.batchDescription,
      status: batch.status,
      examType: batch.examType,
      questionCount: batch.questionCount,
      takerCount: batch.takerCount,
      completedCount: batch.completedCount,
      groupAccuracyRate: batch.groupAccuracyRate,
      startedAt: batch.startedAt,
      completedAt: batch.completedAt,
      viewExpiresAt: batch.viewExpiresAt,
      adminToken: batch.adminToken,
      batchToken: batch.batchToken,
      createdAt: batch.createdAt,
      updatedAt: batch.updatedAt,
    };
  }

  /**
   * Convert to taker detail DTO
   */
  private toTakerDetailDto(taker: GroupTaker): TakerDetailDto {
    return {
      id: taker.id,
      takerName: taker.takerName,
      takerEmail: taker.takerEmail,
      status: taker.status,
      correctAnswers: taker.correctAnswers,
      totalQuestions: taker.totalQuestions,
      accuracyRate: taker.accuracyRate,
      timeSpentSeconds: taker.timeSpentSeconds,
      startedAt: taker.startedAt,
      completedAt: taker.completedAt,
    };
  }
}
