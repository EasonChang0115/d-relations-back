import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exam } from './entities/exam.entity';
import { StartExamDto } from './dto/start-exam.dto';
import { ExamResponseDto, CurrentQuestionResponseDto, ExamQuestionDto } from './dto/exam-response.dto';
import { QuestionsService } from '../questions/questions.service';
import { ExamStatus, EXAM_CONFIG } from '@/common/constants';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

@Injectable()
export class ExamsService {
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

  async remove(id: string): Promise<void> {
    const exam = await this.findOne(id);
    await this.examRepository.softRemove(exam);
  }
}
