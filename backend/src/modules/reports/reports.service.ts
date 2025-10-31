import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResultReport } from './entities/result-report.entity';
import { ReportResponseDto, CellTypeStatDto } from './dto/report-response.dto';
import { ExamsService } from '../exams/exams.service';
import { AnswersService } from '../answers/answers.service';
import { QuestionsService } from '../questions/questions.service';
import { CELL_TYPE_LABELS } from '@/common/constants';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(ResultReport)
    private readonly reportRepository: Repository<ResultReport>,
    private readonly examsService: ExamsService,
    private readonly answersService: AnswersService,
    private readonly questionsService: QuestionsService,
  ) {}

  async generateReport(examId: string): Promise<ReportResponseDto> {
    // Get exam
    const exam = await this.examsService.findOne(examId);

    // Check if report already exists
    const existingReport = await this.reportRepository.findOne({
      where: { examId },
    });

    if (existingReport) {
      // Check if expired
      if (new Date() > existingReport.expiresAt) {
        existingReport.isExpired = true;
        await this.reportRepository.save(existingReport);
        throw new ForbiddenException('報表已過期');
      }
      return new ReportResponseDto(existingReport);
    }

    // Get answers
    const answers = await this.answersService.findByExamId(examId);

    // Calculate statistics
    const correctAnswers = answers.filter((a) => a.isCorrect).length;
    const wrongAnswers = answers.filter((a) => !a.isCorrect).length;
    const accuracyRate = answers.length > 0 
      ? (correctAnswers / answers.length) * 100 
      : 0;

    // Calculate time statistics
    const totalTimeSeconds = answers.reduce((sum, a) => sum + (a.timeSpentSeconds || 0), 0);
    const avgTimePerQuestion = answers.length > 0 
      ? totalTimeSeconds / answers.length 
      : 0;

    // Calculate cell type statistics
    const cellTypeStats = await this.calculateCellTypeStats(examId, answers as any);

    // Create report
    const report = this.reportRepository.create({
      examId,
      totalQuestions: exam.totalQuestions,
      correctAnswers,
      wrongAnswers,
      accuracyRate: parseFloat(accuracyRate.toFixed(2)),
      totalTimeSeconds,
      avgTimePerQuestion: parseFloat(avgTimePerQuestion.toFixed(2)),
      cellTypeStats,
      generatedAt: new Date(),
      expiresAt: exam.expiresAt,
      isExpired: false,
    });

    const savedReport = await this.reportRepository.save(report);
    return new ReportResponseDto(savedReport);
  }

  async findOne(id: string): Promise<ReportResponseDto> {
    const report = await this.reportRepository.findOne({
      where: { id },
    });

    if (!report) {
      throw new NotFoundException('報表不存在');
    }

    // Check if expired
    if (new Date() > report.expiresAt) {
      report.isExpired = true;
      await this.reportRepository.save(report);
      throw new ForbiddenException('報表已過期 (有效期限 7 天)');
    }

    return new ReportResponseDto(report);
  }

  async findByExamId(examId: string): Promise<ReportResponseDto> {
    const report = await this.reportRepository.findOne({
      where: { examId },
    });

    if (!report) {
      throw new NotFoundException('報表不存在');
    }

    // Check if expired
    if (new Date() > report.expiresAt) {
      report.isExpired = true;
      await this.reportRepository.save(report);
      throw new ForbiddenException('報表已過期 (有效期限 7 天)');
    }

    return new ReportResponseDto(report);
  }

  private async calculateCellTypeStats(
    examId: string,
    answers: any[],
  ): Promise<CellTypeStatDto[]> {
    // Get all questions for this exam
    const exam = await this.examsService.findOne(examId);
    const questions = await this.questionsService.findByIds(exam.questionSequence);

    // Group by cell type
    const cellTypeMap = new Map<string, {
      total: number;
      correct: number;
      wrong: number;
    }>();

    for (const question of questions) {
      if (!cellTypeMap.has(question.cellType)) {
        cellTypeMap.set(question.cellType, { total: 0, correct: 0, wrong: 0 });
      }

      const stats = cellTypeMap.get(question.cellType);
      stats.total += 1;

      // Find answer for this question
      const answer = answers.find((a) => a.questionId === question.id);
      if (answer) {
        if (answer.isCorrect) {
          stats.correct += 1;
        } else {
          stats.wrong += 1;
        }
      }
    }

    // Convert to array
    const cellTypeStats: CellTypeStatDto[] = [];
    cellTypeMap.forEach((stats, cellType) => {
      const accuracyRate = stats.total > 0 
        ? (stats.correct / stats.total) * 100 
        : 0;

      cellTypeStats.push({
        cellType,
        cellTypeName: CELL_TYPE_LABELS[cellType] || cellType,
        total: stats.total,
        correct: stats.correct,
        wrong: stats.wrong,
        accuracyRate: parseFloat(accuracyRate.toFixed(2)),
      });
    });

    return cellTypeStats.sort((a, b) => b.accuracyRate - a.accuracyRate);
  }

  async checkExpiry(id: string): Promise<boolean> {
    const report = await this.reportRepository.findOne({ where: { id } });
    if (!report) {
      throw new NotFoundException('報表不存在');
    }

    const isExpired = new Date() > report.expiresAt;
    
    if (isExpired && !report.isExpired) {
      report.isExpired = true;
      await this.reportRepository.save(report);
    }

    return isExpired;
  }

  async remove(id: string): Promise<void> {
    const report = await this.reportRepository.findOne({ where: { id } });
    if (!report) {
      throw new NotFoundException('報表不存在');
    }
    await this.reportRepository.softRemove(report);
  }
}
