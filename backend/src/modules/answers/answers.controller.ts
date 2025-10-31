import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AnswersService } from './answers.service';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { AnswerResponseDto } from './dto/answer-response.dto';
import { Public } from '@/common/decorators/public.decorator';

@ApiTags('answers')
@Controller('answers')
@Public()
export class AnswersController {
  constructor(private readonly answersService: AnswersService) {}

  @Post('submit')
  @ApiOperation({ summary: '提交答案' })
  @ApiResponse({ status: 201, description: '答案已提交', type: AnswerResponseDto })
  @ApiResponse({ status: 400, description: '請求參數錯誤或測驗狀態不正確' })
  @ApiResponse({ status: 404, description: '測驗或題目不存在' })
  async submitAnswer(@Body() submitAnswerDto: SubmitAnswerDto): Promise<AnswerResponseDto> {
    return await this.answersService.submitAnswer(submitAnswerDto);
  }

  @Get('exam/:examId')
  @ApiOperation({ summary: '取得測驗的所有答案記錄' })
  @ApiResponse({ status: 200, description: '成功', type: [AnswerResponseDto] })
  async getExamAnswers(@Param('examId') examId: string): Promise<AnswerResponseDto[]> {
    return await this.answersService.findByExamId(examId);
  }

  @Get(':id')
  @ApiOperation({ summary: '取得答案記錄' })
  @ApiResponse({ status: 200, description: '成功', type: AnswerResponseDto })
  @ApiResponse({ status: 404, description: '答案記錄不存在' })
  async getAnswer(@Param('id') id: string): Promise<AnswerResponseDto> {
    return await this.answersService.findOne(id);
  }
}
