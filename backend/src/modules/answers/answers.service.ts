import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnswerRecord } from './entities/answer-record.entity';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { AnswerResponseDto } from './dto/answer-response.dto';
import { ExamsService } from '../exams/exams.service';
import { QuestionsService } from '../questions/questions.service';
import { ExamStatus } from '@/common/constants';

@Injectable()
export class AnswersService {
  constructor(
    @InjectRepository(AnswerRecord)
    private readonly answerRepository: Repository<AnswerRecord>,
    private readonly examsService: ExamsService,
    private readonly questionsService: QuestionsService,
  ) {}

  async submitAnswer(submitAnswerDto: SubmitAnswerDto): Promise<AnswerResponseDto> {
    const { examId, questionId, userAnswer, timeSpentSeconds } = submitAnswerDto;

    // Get exam
    const exam = await this.examsService.findOne(examId);

    // Validate exam status
    if (exam.status === ExamStatus.COMPLETED) {
      throw new BadRequestException('測驗已完成，無法再提交答案');
    }

    if (exam.status === ExamStatus.EXPIRED) {
      throw new BadRequestException('測驗已過期');
    }

    // Check if question belongs to exam
    const questionOrder = exam.questionSequence.indexOf(questionId);
    if (questionOrder === -1) {
      throw new BadRequestException('此題目不屬於此測驗');
    }

    // Check if answer already exists
    const existingAnswer = await this.answerRepository.findOne({
      where: { examId, questionId },
    });

    if (existingAnswer) {
      throw new BadRequestException('此題已作答，無法重複提交');
    }

    // Get question to verify correct answer
    const question = await this.questionsService.findOne(questionId);

    // Check if answer is correct
    const isCorrect = userAnswer.trim().toLowerCase() === 
                      question.correctAnswer.trim().toLowerCase();

    // Create answer record
    const answerRecord = this.answerRepository.create({
      examId,
      questionId,
      questionOrder: questionOrder + 1,
      userAnswer,
      correctAnswer: question.correctAnswer,
      isCorrect,
      timeSpentSeconds,
      answeredAt: new Date(),
    });

    const savedAnswer = await this.answerRepository.save(answerRecord);

    // Move to next question
    await this.examsService.moveToNextQuestion(examId);

    return new AnswerResponseDto(savedAnswer);
  }

  async findByExamId(examId: string): Promise<AnswerResponseDto[]> {
    const answers = await this.answerRepository.find({
      where: { examId },
      order: { questionOrder: 'ASC' },
    });

    return answers.map((answer) => new AnswerResponseDto(answer));
  }

  async findOne(id: string): Promise<AnswerResponseDto> {
    const answer = await this.answerRepository.findOne({
      where: { id },
    });

    if (!answer) {
      throw new NotFoundException('答案記錄不存在');
    }

    return new AnswerResponseDto(answer);
  }

  async getExamStatistics(examId: string): Promise<{
    totalQuestions: number;
    answeredQuestions: number;
    correctAnswers: number;
    wrongAnswers: number;
    accuracyRate: number;
  }> {
    const exam = await this.examsService.findOne(examId);
    const answers = await this.findByExamId(examId);

    const correctAnswers = answers.filter((a) => a.isCorrect).length;
    const wrongAnswers = answers.filter((a) => !a.isCorrect).length;
    const accuracyRate = answers.length > 0 
      ? (correctAnswers / answers.length) * 100 
      : 0;

    return {
      totalQuestions: exam.totalQuestions,
      answeredQuestions: answers.length,
      correctAnswers,
      wrongAnswers,
      accuracyRate: parseFloat(accuracyRate.toFixed(2)),
    };
  }

  async remove(id: string): Promise<void> {
    const answer = await this.answerRepository.findOne({ where: { id } });
    if (!answer) {
      throw new NotFoundException('答案記錄不存在');
    }
    await this.answerRepository.softRemove(answer);
  }
}
