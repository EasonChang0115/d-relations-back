import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GroupsService } from '../services/groups.service';
import { ExamsService } from '@/modules/exams/exams.service';
import { AnswersService } from '@/modules/answers/answers.service';

/**
 * Group Taker Controller
 * Handles group exam taking and result submission
 */
@ApiTags('group-exams')
@Controller('group-exams')
export class GroupExamTakerController {
  constructor(
    private readonly groupsService: GroupsService,
    private readonly examsService: ExamsService,
    private readonly answersService: AnswersService,
  ) {}

  @Get(':batchToken/start')
  @ApiOperation({ summary: '開始群組測驗' })
  @ApiResponse({ status: 200, description: '測驗已開始' })
  @ApiResponse({ status: 404, description: '批次不存在' })
  async startGroupExam(
    @Param('batchToken') batchToken: string,
    @Query('token') invitationToken: string,
  ): Promise<any> {
    // Get batch
    const batch = await this.groupsService.getBatchByToken(batchToken);

    // Validate invitation token
    const taker = await this.groupsService.getTakerByInvitationToken(invitationToken);
    if (taker.batchId !== batch.id) {
      throw new Error('邀請令牌與批次不符');
    }

    // Check if batch view has expired
    const isExpired = await this.groupsService.isBatchViewExpired(batch.id);
    if (isExpired) {
      throw new Error('批次查看期限已過期');
    }

    // Start exam with batch questions
    const exam = await this.examsService.startGroupExam(
      batch.id,
      taker.id,
      batch.questionSequence || [],
      batch.batchSeed || '',
    );

    // Update taker status
    if (taker.status === 'invited') {
      taker.status = 'started';
      taker.startedAt = new Date();
      // await takerRepository.save(taker);
    }

    return {
      examId: exam.id,
      batchToken,
      invitationToken,
      exam,
    };
  }

  @Post(':examId/submit-answer')
  @ApiOperation({ summary: '提交答案' })
  @ApiResponse({ status: 200, description: '答案已提交' })
  async submitAnswer(
    @Param('examId') examId: string,
    @Body() submitData: { questionId: string; selectedOption: string; isCorrect: boolean },
  ): Promise<any> {
    const exam = await this.examsService.findOne(examId);

    // Save answer
    const answer = await this.answersService.create({
      examId,
      questionId: submitData.questionId,
      selectedOption: submitData.selectedOption,
      isCorrect: submitData.isCorrect,
    } as any);

    return {
      success: true,
      answerId: answer.id,
      questionIndex: exam.currentQuestion,
      totalQuestions: exam.totalQuestions,
    };
  }

  @Post(':examId/complete')
  @ApiOperation({ summary: '完成測驗' })
  @ApiResponse({ status: 200, description: '測驗已完成' })
  async completeExam(
    @Param('examId') examId: string,
    @Body() completeData: { timeSpentSeconds: number },
  ): Promise<any> {
    const exam = await this.examsService.findOne(examId);

    // Calculate statistics
    const answers = await this.answersService.findByExamId(examId);
    const correctAnswers = answers.filter(a => a.isCorrect).length;
    const totalQuestions = answers.length;

    // Update taker results
    if (exam.sessionId) {
      await this.groupsService.updateTakerResult(
        exam.sessionId,
        examId,
        correctAnswers,
        totalQuestions,
        completeData.timeSpentSeconds,
      );
    }

    // Update exam status
    exam.status = 'completed';
    exam.completedAt = new Date();
    exam.currentQuestion = totalQuestions;
    await this.examsService.save(exam);

    return {
      success: true,
      examId,
      correctAnswers,
      totalQuestions,
      accuracyRate: totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0,
    };
  }
}
