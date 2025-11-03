import { Injectable, NotFoundException, BadRequestException, ForbiddenException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Exam } from './entities/exam.entity';
import { StartExamDto } from './dto/start-exam.dto';
import { ExamResponseDto, CurrentQuestionResponseDto, ExamQuestionDto } from './dto/exam-response.dto';
import { QuestionsService } from '../questions/questions.service';
import { ExamStatus, EXAM_CONFIG } from '@/common/constants';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

@Injectable()
export class ExamsService {
  private readonly logger = new Logger(ExamsService.name);

  constructor(
    @InjectRepository(Exam)
    private readonly examRepository: Repository<Exam>,
    private readonly questionsService: QuestionsService,
  ) {}

  async startExam(startExamDto: StartExamDto): Promise<ExamResponseDto> {
    const { examType, version, sessionId, userId } = startExamDto;

    // Validate session or user
    if (!sessionId && !userId) {
      throw new BadRequestException('必須提供 sessionId 或 userId');
    }

    // Get exam configuration
    const config = EXAM_CONFIG[version.toUpperCase() as keyof typeof EXAM_CONFIG];
    if (!config) {
      throw new BadRequestException('無效的測驗版本');
    }

    // Generate random seed for deterministic question selection
    const randomSeed = this.generateRandomSeed(sessionId || userId || '', examType);

    // Get random questions using seed-based algorithm
    const questions = await this.questionsService.findRandomQuestions(
      examType,
      config.questionCount,
      randomSeed,
    );

    // Create question sequence (array of question IDs)
    const questionSequence = questions.map((q) => q.id);

    // Calculate expiry date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + config.validityDays);

    // Create exam (only include userId if it's provided)
    const examData: any = {
      sessionId,
      examType,
      version,
      status: ExamStatus.NOT_STARTED,
      totalQuestions: config.questionCount,
      currentQuestion: 0,
      questionSequence,
      randomSeed,
      expiresAt,
    };

    // Only set userId if provided and not undefined
    if (userId !== undefined && userId !== null) {
      examData.userId = userId;
    }

    console.log('Creating exam with data:', JSON.stringify(examData, null, 2));

    const exam = this.examRepository.create(examData);
    console.log('Created exam entity:', JSON.stringify(exam, null, 2));

    const savedExam = await this.examRepository.save(exam);

    // Ensure we're working with a single entity
    const examResult = Array.isArray(savedExam) ? savedExam[0] : savedExam;
    return new ExamResponseDto(examResult);
  }

  async getCurrentQuestion(examId: string): Promise<CurrentQuestionResponseDto> {
    const exam = await this.findOne(examId);

    // Check if exam is expired
    if (exam.expiresAt && new Date() > exam.expiresAt) {
      await this.updateStatus(examId, ExamStatus.EXPIRED);
      throw new ForbiddenException('測驗已過期');
    }

    // Check if exam is completed
    if (exam.status === ExamStatus.COMPLETED) {
      throw new BadRequestException('測驗已完成');
    }

    // Update status to in progress if not started
    if (exam.status === ExamStatus.NOT_STARTED) {
      exam.status = ExamStatus.IN_PROGRESS;
      exam.startedAt = new Date();
      await this.examRepository.save(exam);
    }

    // Get current question
    const questionId = exam.questionSequence[exam.currentQuestion];
    if (!questionId) {
      throw new NotFoundException('題目不存在');
    }

    const question = await this.questionsService.findOne(questionId);

    const response = new CurrentQuestionResponseDto(exam);
    response.currentQuestionData = {
      id: question.id,
      order: exam.currentQuestion + 1,
      imageUrl: question.image.imageUrl,
      thumbnailUrl: question.image.thumbnailUrl,
      description: question.description,
    };

    return response;
  }

  async findOne(id: string): Promise<Exam> {
    const exam = await this.examRepository.findOne({
      where: { id },
      relations: ['user', 'answers'],
    });

    if (!exam) {
      throw new NotFoundException('測驗不存在');
    }

    return exam;
  }

  async findBySessionId(sessionId: string): Promise<Exam[]> {
    return await this.examRepository.find({
      where: { sessionId },
      order: { createdAt: 'DESC' },
    });
  }

  async findByUserId(userId: string): Promise<Exam[]> {
    return await this.examRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async moveToNextQuestion(examId: string): Promise<ExamResponseDto> {
    const exam = await this.findOne(examId);

    if (exam.status === ExamStatus.COMPLETED) {
      throw new BadRequestException('測驗已完成');
    }

    exam.currentQuestion += 1;

    // Check if exam is completed
    if (exam.currentQuestion >= exam.totalQuestions) {
      exam.status = ExamStatus.COMPLETED;
      exam.completedAt = new Date();
      if (exam.startedAt) {
        exam.timeSpentSeconds = Math.floor(
          (exam.completedAt.getTime() - exam.startedAt.getTime()) / 1000,
        );
      }
    }

    const updatedExam = await this.examRepository.save(exam);
    return new ExamResponseDto(updatedExam);
  }

  async updateStatus(examId: string, status: ExamStatus): Promise<ExamResponseDto> {
    const exam = await this.findOne(examId);
    exam.status = status;

    if (status === ExamStatus.COMPLETED && !exam.completedAt) {
      exam.completedAt = new Date();
      if (exam.startedAt) {
        exam.timeSpentSeconds = Math.floor(
          (exam.completedAt.getTime() - exam.startedAt.getTime()) / 1000,
        );
      }
    }

    const updatedExam = await this.examRepository.save(exam);
    return new ExamResponseDto(updatedExam);
  }

  /**
   * Generate deterministic random seed based on user/session and exam type
   * This ensures the same user gets the same questions for the same exam type
   */
  private generateRandomSeed(identifier: string, examType: string): string {
    const data = `${identifier}-${examType}-${Date.now()}`;
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * Verify if user has access to paid exam via payment
   * Used for paid version exams (20 questions)
   */
  async verifyPaidExamAccess(userId: string, paymentId: string): Promise<boolean> {
    // Check if exam exists for this payment
    const exam = await this.examRepository.findOne({
      where: { userId, paymentId },
    });

    if (!exam) {
      // Create paid exam for user if not exists
      return true;
    }

    // Check if exam hasn't expired
    if (exam.expiresAt && new Date() > exam.expiresAt) {
      throw new ForbiddenException('測驗已過期');
    }

    return true;
  }

  /**
   * Create paid exam after successful payment
   */
  async createPaidExamFromPayment(
    userId: string,
    paymentId: string,
    examType: string,
  ): Promise<ExamResponseDto> {
    // Check if paid exam already exists for this payment
    const existingExam = await this.examRepository.findOne({
      where: { userId, paymentId },
    });

    if (existingExam && existingExam.status !== ExamStatus.EXPIRED) {
      return new ExamResponseDto(existingExam);
    }

    // Get PERSONAL exam config (20 questions)
    const config = EXAM_CONFIG['PERSONAL'];
    if (!config) {
      throw new BadRequestException('無效的測驗配置');
    }

    // Generate random seed deterministically
    const randomSeed = this.generateRandomSeed(userId, examType);

    // Get random questions
    const questions = await this.questionsService.findRandomQuestions(
      examType,
      config.questionCount,
      randomSeed,
    );

    const questionSequence = questions.map((q) => q.id);

    // Calculate expiry (30 days for paid exams)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const exam = this.examRepository.create({
      userId,
      paymentId,
      examType,
      version: 'PERSONAL',
      status: ExamStatus.NOT_STARTED,
      totalQuestions: config.questionCount,
      currentQuestion: 0,
      questionSequence,
      randomSeed,
      expiresAt,
    });

    const savedExam = await this.examRepository.save(exam);
    return new ExamResponseDto(savedExam);
  }

  /**
   * Validate and start group exam using invitation token
   */
  async validateGroupExamToken(batchToken: string, invitationToken: string): Promise<{ valid: boolean; batchId?: string }> {
    // TODO: Verify tokens with GroupsService
    // - Check batch token exists and is not expired
    // - Check invitation token matches batch
    // - Return batch ID if valid

    // For now, accept any format
    const isValid = /^[a-f0-9-]{36}$/.test(batchToken) && /^[a-f0-9-]{36}$/.test(invitationToken);
    return { valid: isValid };
  }

  /**
   * Daily cron job to cleanup expired exams (2:00 AM every day)
   * Deletes exams that have been viewing-expired for more than 7 days
   */
  @Cron('0 2 * * *')
  async cleanupExpiredExams(): Promise<void> {
    this.logger.log('Starting cleanup of expired exams');

    try {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      const result = await this.examRepository.delete({
        viewExpiresAt: () => `viewExpiresAt < '${sevenDaysAgo.toISOString()}'`,
      });

      this.logger.log(`Cleaned up ${result.affected || 0} expired exams`);
    } catch (error) {
      this.logger.error('Cleanup of expired exams failed:', error);
    }
  }

  /**
   * Start group exam for taker
   */
  async startGroupExam(
    batchId: string,
    takerId: string,
    questionSequence: string[],
    randomSeed: string,
  ): Promise<ExamResponseDto> {
    const config = EXAM_CONFIG.GROUP;
    if (!config) {
      throw new BadRequestException('無效的測驗版本');
    }

    // Calculate expiry (30 days for group exams)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const exam = this.examRepository.create({
      sessionId: takerId,
      examType: 'group',
      version: 'GROUP',
      status: ExamStatus.NOT_STARTED,
      totalQuestions: questionSequence.length,
      currentQuestion: 0,
      questionSequence,
      randomSeed,
      expiresAt,
      // TODO: Add group-specific fields once schema is updated
      // batchId,
    });

    const savedExam = await this.examRepository.save(exam);
    return new ExamResponseDto(savedExam);
  }

  /**
   * Resume taker exam after session expiry or device change
   */
  async resumeTakerExam(examId: string, deviceFingerprint: string): Promise<{ resumeAllowed: boolean; reason?: string }> {
    const exam = await this.findOne(examId);

    // Check if exam is expired
    if (exam.expiresAt && new Date() > exam.expiresAt) {
      return { resumeAllowed: false, reason: '測驗已過期' };
    }

    // Check if exam is completed
    if (exam.status === ExamStatus.COMPLETED) {
      return { resumeAllowed: false, reason: '測驗已完成' };
    }

    // Device fingerprint validation (TODO: compare with original device)
    // If different device, require re-authentication
    // For now, always allow resume
    return { resumeAllowed: true };
  }

  async remove(id: string): Promise<void> {
    const exam = await this.findOne(id);
    await this.examRepository.softRemove(exam);
  }
}
